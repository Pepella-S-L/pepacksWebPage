<?php
declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../src/Security.php';

use Pepacks\Security\Security;
use Pepacks\Config\Database;

Security::setSecurityHeaders();

$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requestUri = str_replace('/api', '', $requestUri);
$requestUri = trim($requestUri, '/');
$method = $_SERVER['REQUEST_METHOD'];

if (empty($requestUri)) {
    $requestUri = 'games';
}

$segments = explode('/', $requestUri);
$resource = array_shift($segments);
$id = isset($segments[0]) && is_numeric($segments[0]) ? (int) array_shift($segments) : null;
$subResource = $segments[0] ?? null;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');

if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

try {
    switch ($resource) {
        case 'games':
        case 'game':
            $controller = new \Pepacks\Api\GameController();
            handleGameRoutes($controller, $method, $id, $subResource);
            break;

        case 'auth':
            $controller = new \Pepacks\Api\AuthController();
            handleAuthRoutes($controller, $method, $subResource);
            break;

        case 'cookies':
            handleCookies($method);
            break;

        case 'contact':
            handleContact($method);
            break;

        case 'upload':
            handleUpload($method);
            break;

        default:
            jsonResponse(['success' => false, 'error' => 'Endpoint no encontrado'], 404);
    }
} catch (Exception $e) {
    error_log('API Error: ' . $e->getMessage());
    jsonResponse(['success' => false, 'error' => 'Error interno del servidor'], 500);
}

function handleGameRoutes($controller, string $method, ?int $id, ?string $subResource): void
{
    if ($subResource === 'download' && $id) {
        $controller->incrementDownloads($id);
        return;
    }

    if ($subResource === 'slug' && !$id && !empty($GLOBALS['segments'][0] ?? '')) {
        // handle slug-based lookup
    }

    switch ($method) {
        case 'GET':
            if ($id) {
                $controller->show($id);
            } else {
                $controller->index();
            }
            break;
        case 'POST':
            $controller->store();
            break;
        case 'PUT':
            if (!$id) { jsonResponse(['success' => false, 'error' => 'ID requerido'], 400); }
            $controller->update($id);
            break;
        case 'DELETE':
            if (!$id) { jsonResponse(['success' => false, 'error' => 'ID requerido'], 400); }
            $controller->destroy($id);
            break;
    }
}

function handleAuthRoutes($controller, string $method, ?string $action): void
{
    if ($method !== 'POST' && $action !== 'me') {
        jsonResponse(['success' => false, 'error' => 'Method not allowed'], 405);
        return;
    }

    if ($method === 'GET' && $action === 'me') {
        $controller->me();
        return;
    }

    switch ($action) {
        case 'login':
            $controller->login();
            break;
        case 'logout':
            $controller->logout();
            break;
        case 'register':
            $controller->register();
            break;
        case 'me':
            $controller->me();
            break;
        default:
            jsonResponse(['success' => false, 'error' => 'Acción no válida'], 404);
    }
}

function handleCookies(string $method): void
{
    $db = Database::getInstance();

    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];

        $consentId = Security::generateToken(16);
        $ip = Security::getIpAddress();
        $ipHash = Security::hashIp($ip);

        $stmt = $db->prepare('INSERT INTO cookies_consent (consent_id, ip_hash, user_agent, necessary, analytics, marketing, preferences) VALUES (:cid, :ip, :ua, :nec, :ana, :mar, :pre)');
        $stmt->execute([
            ':cid' => $consentId,
            ':ip' => $ipHash,
            ':ua' => $_SERVER['HTTP_USER_AGENT'] ?? '',
            ':nec' => 1,
            ':ana' => !empty($input['analytics']) ? 1 : 0,
            ':mar' => !empty($input['marketing']) ? 1 : 0,
            ':pre' => !empty($input['preferences']) ? 1 : 0,
        ]);

        jsonResponse(['success' => true, 'consent_id' => $consentId]);
    }

    if ($method === 'GET') {
        $consentId = $_GET['consent_id'] ?? '';
        if (!$consentId) { jsonResponse(['success' => false, 'error' => 'ID requerido'], 400); }

        $stmt = $db->prepare('SELECT * FROM cookies_consent WHERE consent_id = :cid');
        $stmt->execute([':cid' => $consentId]);
        $consent = $stmt->fetch();

        if (!$consent) { jsonResponse(['success' => false, 'error' => 'No encontrado'], 404); }

        jsonResponse(['success' => true, 'data' => [
            'analytics' => (bool) $consent['analytics'],
            'marketing' => (bool) $consent['marketing'],
            'preferences' => (bool) $consent['preferences'],
        ]]);
    }
}

function handleContact(string $method): void
{
    if ($method !== 'POST') {
        jsonResponse(['success' => false, 'error' => 'Método no permitido'], 405);
        return;
    }

    $db = Database::getInstance();
    $input = json_decode(file_get_contents('php://input'), true) ?? [];

    $errors = [];
    if (empty($input['name']) || strlen(trim($input['name'])) < 2) { $errors['name'] = 'Nombre requerido'; }
    if (empty($input['email']) || !filter_var($input['email'], FILTER_VALIDATE_EMAIL)) { $errors['email'] = 'Invalid email'; }
    if (empty($input['subject'])) { $errors['subject'] = 'Asunto requerido'; }
    if (empty($input['message']) || strlen(trim($input['message'])) < 10) { $errors['message'] = 'Mensaje demasiado corto'; }

    if (!empty($errors)) {
        jsonResponse(['success' => false, 'errors' => $errors], 422);
        return;
    }

    $ip = Security::getIpAddress();
    $ipHash = Security::hashIp($ip);

    $stmt = $db->prepare('INSERT INTO contact_messages (name, email, subject, message, ip_hash) VALUES (:name, :email, :subject, :message, :ip)');
    $stmt->execute([
        ':name' => Security::sanitizeInput($input['name']),
        ':email' => $input['email'],
        ':subject' => Security::sanitizeInput($input['subject']),
        ':message' => Security::sanitizeInput($input['message']),
        ':ip' => $ipHash,
    ]);

    jsonResponse(['success' => true, 'message' => 'Mensaje enviado correctamente']);
}

function handleUpload(string $method): void
{
    if ($method !== 'POST') {
        jsonResponse(['success' => false, 'error' => 'Método no permitido'], 405);
        return;
    }

    Security::initSession();
    if (empty($_SESSION['user_id'])) {
        jsonResponse(['success' => false, 'error' => 'No autorizado'], 401);
        return;
    }

    if (empty($_FILES['file'])) {
        jsonResponse(['success' => false, 'error' => 'No se ha enviado ningún archivo'], 400);
        return;
    }

    $file = $_FILES['file'];
    $config = require __DIR__ . '/../config/app.php';

    if ($file['error'] !== UPLOAD_ERR_OK) {
        jsonResponse(['success' => false, 'error' => 'Error en la subida del archivo'], 400);
        return;
    }

    if ($file['size'] > $config['upload']['max_size']) {
        jsonResponse(['success' => false, 'error' => 'Archivo demasiado grande (máx 10MB)'], 422);
        return;
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->file($file['tmp_name']);
    $allowedTypes = array_merge($config['upload']['allowed_image_types'], $config['upload']['allowed_file_types']);

    if (!in_array($mimeType, $allowedTypes)) {
        jsonResponse(['success' => false, 'error' => 'Tipo de archivo no permitido: ' . $mimeType], 422);
        return;
    }

    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $newName = Security::generateToken(16) . '.' . $extension;
    $uploadPath = $config['upload']['path'] . $newName;

    if (!is_dir(dirname($uploadPath))) {
        mkdir(dirname($uploadPath), 0750, true);
    }

    if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
        jsonResponse(['success' => false, 'error' => 'Error al guardar el archivo'], 500);
        return;
    }

    $relativePath = 'uploads/' . $newName;
    jsonResponse(['success' => true, 'path' => $relativePath, 'url' => '/public/' . $relativePath]);
}

function jsonResponse(array $data, int $statusCode = 200): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
