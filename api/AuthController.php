<?php
declare(strict_types=1);

namespace Pepacks\Api;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../src/Security.php';

use Pepacks\Config\Database;
use Pepacks\Security\Security;

class AuthController
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function login(): void
    {
        $data = $this->getJsonInput();
        $username = trim($data['username'] ?? '');
        $password = $data['password'] ?? '';
        $ip = Security::getIpAddress();

        if (!$username || !$password) {
            $this->jsonResponse(['success' => false, 'error' => 'Usuario y contraseña son requeridos'], 422);
            return;
        }

        if (!Security::rateLimitCheck($ip)) {
            $this->jsonResponse(['success' => false, 'error' => 'Demasiados intentos. Intenta de nuevo en 15 minutos.'], 429);
            return;
        }

        $stmt = $this->db->prepare('SELECT id, username, password_hash, role, is_active FROM users WHERE username = :username OR email = :email');
        $stmt->execute([':username' => $username, ':email' => $username]);
        $user = $stmt->fetch();

        if (!$user || !Security::verifyPassword($password, $user['password_hash'])) {
            Security::logAttempt($username, $ip, false);
            $this->jsonResponse(['success' => false, 'error' => 'Invalid credentials'], 401);
            return;
        }

        if (!$user['is_active']) {
            $this->jsonResponse(['success' => false, 'error' => 'Cuenta desactivada'], 403);
            return;
        }

        Security::initSession();
        session_regenerate_id(true);

        $_SESSION['user_id'] = (int) $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['_created'] = time();

        Security::logAttempt($username, $ip, true);

        $this->jsonResponse([
            'success' => true,
            'user' => [
                'id' => (int) $user['id'],
                'username' => $user['username'],
                'role' => $user['role'],
            ],
        ]);
    }

    public function logout(): void
    {
        Security::initSession();
        $_SESSION = [];
        session_destroy();
        $this->jsonResponse(['success' => true, 'message' => 'Sesion cerrada']);
    }

    public function me(): void
    {
        Security::initSession();

        if (empty($_SESSION['user_id'])) {
            $this->jsonResponse(['success' => false, 'error' => 'No autenticado'], 401);
            return;
        }

        $stmt = $this->db->prepare('SELECT id, username, email, role, avatar_url, created_at FROM users WHERE id = :id');
        $stmt->execute([':id' => $_SESSION['user_id']]);
        $user = $stmt->fetch();

        if (!$user) {
            $this->jsonResponse(['success' => false, 'error' => 'Usuario no encontrado'], 404);
            return;
        }

        $user['id'] = (int) $user['id'];
        $this->jsonResponse(['success' => true, 'data' => $user]);
    }

    public function register(): void
    {
        $data = $this->getJsonInput();
        $errors = $this->validateRegistration($data);

        if (!empty($errors)) {
            $this->jsonResponse(['success' => false, 'errors' => $errors], 422);
            return;
        }

        $stmt = $this->db->prepare('INSERT INTO users (username, email, password_hash) VALUES (:username, :email, :password)');
        $stmt->execute([
            ':username' => $data['username'],
            ':email' => $data['email'],
            ':password' => Security::hashPassword($data['password']),
        ]);

        $id = (int) $this->db->lastInsertId();
        $this->jsonResponse(['success' => true, 'data' => ['id' => $id]], 201);
    }

    private function validateRegistration(array $data): array
    {
        $errors = [];

        if (empty($data['username']) || strlen($data['username']) < 3) {
            $errors['username'] = 'El usuario debe tener al menos 3 caracteres';
        }

        if (!empty($data['username']) && !preg_match('/^[a-zA-Z0-9_-]+$/', $data['username'])) {
            $errors['username'] = 'El usuario solo puede contener letras, numeros, guiones y guiones bajos';
        }

        if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Email invalido';
        }

        if (empty($data['password']) || strlen($data['password']) < 8) {
            $errors['password'] = 'La contraseña debe tener al menos 8 caracteres';
        }

        return $errors;
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
