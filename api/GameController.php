<?php
declare(strict_types=1);

namespace Pepacks\Api;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../src/Security.php';

use Pepacks\Config\Database;
use Pepacks\Security\Security;

class GameController
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function index(): void
    {
        $page = max(1, (int) ($_GET['page'] ?? 1));
        $perPage = min(50, max(1, (int) ($_GET['per_page'] ?? 12)));
        $offset = ($page - 1) * $perPage;

        $where = ['is_visible = 1'];
        $params = [];

        if (!empty($_GET['search'])) {
            $where[] = '(title LIKE :search OR description LIKE :search2 OR author LIKE :search3)';
            $search = '%' . $_GET['search'] . '%';
            $params[':search'] = $search;
            $params[':search2'] = $search;
            $params[':search3'] = $search;
        }

        if (!empty($_GET['category'])) {
            $where[] = 'category = :category';
            $params[':category'] = $_GET['category'];
        }

        if (!empty($_GET['tag'])) {
            $where[] = 'tags LIKE :tag';
            $params[':tag'] = '%"' . $_GET['tag'] . '"%';
        }

        $whereClause = implode(' AND ', $where);

        $countStmt = $this->db->prepare("SELECT COUNT(*) FROM games WHERE {$whereClause}");
        $countStmt->execute($params);
        $total = (int) $countStmt->fetchColumn();

        $allowedSorts = ['created_at', 'title', 'downloads', 'views', 'rating'];
        $sortBy = in_array($_GET['sort'] ?? '', $allowedSorts) ? $_GET['sort'] : 'created_at';
        $sortOrder = ($_GET['order'] ?? 'desc') === 'asc' ? 'ASC' : 'DESC';

        $stmt = $this->db->prepare("
            SELECT id, title, slug, description_short, description, version, author, category, tags,
                   cover_image, thumbnail, screenshots, download_url, game_url, file_size, platform,
                   rating, rating_count, downloads, views, is_featured, created_at
            FROM games
            WHERE {$whereClause}
            ORDER BY is_featured DESC, {$sortBy} {$sortOrder}
            LIMIT :limit OFFSET :offset
        ");

        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->bindValue(':limit', $perPage, \PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, \PDO::PARAM_INT);
        $stmt->execute();

        $games = $stmt->fetchAll();

        foreach ($games as &$game) {
            $game = $this->formatGame($game);
        }

        $this->jsonResponse([
            'success' => true,
            'data' => $games,
            'pagination' => [
                'page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'total_pages' => (int) ceil($total / $perPage),
            ],
        ]);
    }

    public function show(int $id): void
    {
        $stmt = $this->db->prepare('SELECT * FROM games WHERE id = :id AND is_visible = 1');
        $stmt->execute([':id' => $id]);
        $game = $stmt->fetch();

        if (!$game) {
            $this->jsonResponse(['success' => false, 'error' => 'Juego no encontrado'], 404);
            return;
        }

        $viewStmt = $this->db->prepare('UPDATE games SET views = views + 1 WHERE id = :id');
        $viewStmt->execute([':id' => $id]);
        $game['views']++;

        $this->jsonResponse(['success' => true, 'data' => $this->formatGame($game)]);
    }

    public function showBySlug(string $slug): void
    {
        $stmt = $this->db->prepare('SELECT * FROM games WHERE slug = :slug AND is_visible = 1');
        $stmt->execute([':slug' => $slug]);
        $game = $stmt->fetch();

        if (!$game) {
            $this->jsonResponse(['success' => false, 'error' => 'Juego no encontrado'], 404);
            return;
        }

        $viewStmt = $this->db->prepare('UPDATE games SET views = views + 1 WHERE id = :id');
        $viewStmt->execute([':id' => $game['id']]);
        $game['views']++;

        $this->jsonResponse(['success' => true, 'data' => $this->formatGame($game)]);
    }

    public function store(): void
    {
        $this->requireAuth();

        $data = $this->getJsonInput();
        $errors = $this->validateGameData($data);

        if (!empty($errors)) {
            $this->jsonResponse(['success' => false, 'errors' => $errors], 422);
            return;
        }

        $slug = $this->generateSlug($data['title']);

        $stmt = $this->db->prepare('
            INSERT INTO games (title, slug, description, description_short, version, author, author_id, category, tags, cover_image, download_url, game_url, file_size, platform, is_featured)
            VALUES (:title, :slug, :description, :description_short, :version, :author, :author_id, :category, :tags, :cover_image, :download_url, :game_url, :file_size, :platform, :is_featured)
        ');

        $stmt->execute([
            ':title' => $data['title'],
            ':slug' => $slug,
            ':description' => $data['description'] ?? '',
            ':description_short' => $data['description_short'] ?? substr($data['description'], 0, 150),
            ':version' => $data['version'] ?? '1.0',
            ':author' => $data['author'] ?? 'Anonimo',
            ':author_id' => $_SESSION['user_id'] ?? null,
            ':category' => $data['category'] ?? 'otros',
            ':tags' => json_encode($data['tags'] ?? []),
            ':cover_image' => $data['cover_image'] ?? null,
            ':download_url' => $data['download_url'] ?? null,
            ':game_url' => $data['game_url'] ?? null,
            ':file_size' => $data['file_size'] ?? 0,
            ':platform' => $data['platform'] ?? 'windows',
            ':is_featured' => !empty($data['is_featured']) ? 1 : 0,
        ]);

        $id = (int) $this->db->lastInsertId();
        $this->jsonResponse(['success' => true, 'data' => ['id' => $id, 'slug' => $slug]], 201);
    }

    public function update(int $id): void
    {
        $this->requireAuth();

        $data = $this->getJsonInput();
        $errors = $this->validateGameData($data, false);

        if (!empty($errors)) {
            $this->jsonResponse(['success' => false, 'errors' => $errors], 422);
            return;
        }

        $fields = [];
        $params = [':id' => $id];

        $allowed = ['title', 'description', 'description_short', 'version', 'author', 'category', 'tags', 'cover_image', 'download_url', 'game_url', 'file_size', 'platform', 'is_featured', 'is_visible'];

        foreach ($allowed as $field) {
            if (isset($data[$field])) {
                $fields[] = "{$field} = :{$field}";
                $params[":{$field}"] = is_array($data[$field]) ? json_encode($data[$field]) : $data[$field];
            }
        }

        if (empty($fields)) {
            $this->jsonResponse(['success' => false, 'error' => 'No hay datos para actualizar'], 422);
            return;
        }

        $fields[] = "updated_at = datetime('now')";
        $sql = 'UPDATE games SET ' . implode(', ', $fields) . ' WHERE id = :id';
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        $this->jsonResponse(['success' => true, 'message' => 'Juego actualizado']);
    }

    public function destroy(int $id): void
    {
        $this->requireAuth();

        $stmt = $this->db->prepare('DELETE FROM games WHERE id = :id');
        $stmt->execute([':id' => $id]);

        $this->jsonResponse(['success' => true, 'message' => 'Juego eliminado']);
    }

    public function categories(): void
    {
        $stmt = $this->db->query('SELECT category, COUNT(*) as count FROM games WHERE is_visible = 1 GROUP BY category ORDER BY count DESC');
        $categories = $stmt->fetchAll();

        $this->jsonResponse(['success' => true, 'data' => $categories]);
    }

    public function tags(): void
    {
        $stmt = $this->db->query('SELECT tags FROM games WHERE is_visible = 1');
        $allTags = [];

        while ($row = $stmt->fetch()) {
            $tags = json_decode($row['tags'], true) ?? [];
            foreach ($tags as $tag) {
                $allTags[$tag] = ($allTags[$tag] ?? 0) + 1;
            }
        }

        arsort($allTags);
        $this->jsonResponse(['success' => true, 'data' => $allTags]);
    }

    public function incrementDownloads(int $id): void
    {
        $stmt = $this->db->prepare('UPDATE games SET downloads = downloads + 1 WHERE id = :id');
        $stmt->execute([':id' => $id]);
        $this->jsonResponse(['success' => true]);
    }

    private function formatGame(array $game): array
    {
        $game['tags'] = json_decode($game['tags'], true) ?? [];
        $game['screenshots'] = json_decode($game['screenshots'] ?? '[]', true) ?? [];
        $game['is_featured'] = (bool) ($game['is_featured'] ?? false);
        $game['is_visible'] = (bool) ($game['is_visible'] ?? true);
        $game['rating'] = (float) $game['rating'];
        $game['downloads'] = (int) $game['downloads'];
        $game['views'] = (int) $game['views'];
        $game['file_size'] = (int) $game['file_size'];
        return $game;
    }

    private function generateSlug(string $title): string
    {
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
        $originalSlug = $slug;
        $counter = 1;

        while (true) {
            $stmt = $this->db->prepare('SELECT COUNT(*) FROM games WHERE slug = :slug');
            $stmt->execute([':slug' => $slug]);
            if ((int) $stmt->fetchColumn() === 0) {
                break;
            }
            $slug = $originalSlug . '-' . $counter++;
        }

        return $slug;
    }

    private function validateGameData(array $data, bool $requireTitle = true): array
    {
        $errors = [];

        if ($requireTitle && empty($data['title'])) {
            $errors['title'] = 'El titulo es obligatorio';
        }

        if (!empty($data['title']) && strlen($data['title']) > 200) {
            $errors['title'] = 'El titulo no puede exceder 200 caracteres';
        }

        if (empty($data['description']) && $requireTitle) {
            $errors['description'] = 'La descripcion es obligatoria';
        }

        if (!empty($data['platform']) && !in_array($data['platform'], ['windows', 'mac', 'linux', 'web', 'multi'])) {
            $errors['platform'] = 'Plataforma no valida';
        }

        return $errors;
    }

    private function requireAuth(): void
    {
        Security::initSession();

        if (empty($_SESSION['user_id'])) {
            $this->jsonResponse(['success' => false, 'error' => 'Unauthorized'], 401);
            exit;
        }
    }

    private function getJsonInput(): array
    {
        $input = file_get_contents('php://input');
        return json_decode($input, true) ?? [];
    }

    private function jsonResponse(array $data, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
}
