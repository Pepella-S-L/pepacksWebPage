<?php
declare(strict_types=1);

namespace Pepacks\Security;

class Security
{
    private static array $config;

    private static function loadConfig(): void
    {
        if (!isset(self::$config)) {
            self::$config = require __DIR__ . '/../config/app.php';
        }
    }

    public static function initSession(): void
    {
        self::loadConfig();

        if (session_status() === PHP_SESSION_NONE) {
            ini_set('session.use_strict_mode', '1');
            ini_set('session.use_only_cookies', '1');
            ini_set('session.cookie_httponly', '1');
            ini_set('session.cookie_samesite', self::$config['security']['cookie_samesite']);
            ini_set('session.gc_maxlifetime', (string) self::$config['security']['lifetime']);

            if (self::$config['security']['cookie_secure'] && isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
                ini_set('session.cookie_secure', '1');
            }

            session_name(self::$config['security']['session_name']);
            session_start();

            if (!isset($_SESSION['_created'])) {
                $_SESSION['_created'] = time();
            }

            if (time() - $_SESSION['_created'] > self::$config['security']['lifetime']) {
                session_regenerate_id(true);
                $_SESSION['_created'] = time();
            }
        }
    }

    public static function generateCsrfToken(): string
    {
        self::initSession();

        if (empty($_SESSION['_csrf_token'])) {
            $_SESSION['_csrf_token'] = bin2hex(random_bytes(self::$config['security']['csrf_length']));
        }

        return $_SESSION['_csrf_token'];
    }

    public static function validateCsrfToken(string $token): bool
    {
        self::initSession();

        if (empty($_SESSION['_csrf_token']) || empty($token)) {
            return false;
        }

        return hash_equals($_SESSION['_csrf_token'], $token);
    }

    public static function regenerateCsrfToken(): string
    {
        self::initSession();
        $_SESSION['_csrf_token'] = bin2hex(random_bytes(self::$config['security']['csrf_length']));
        return $_SESSION['_csrf_token'];
    }

    public static function hashPassword(string $password): string
    {
        self::loadConfig();
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => self::$config['security']['bcrypt_cost']]);
    }

    public static function verifyPassword(string $password, string $hash): bool
    {
        return password_verify($password, $hash);
    }

    public static function sanitizeInput(string $input): string
    {
        return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
    }

    public static function sanitizeOutput(string $output): string
    {
        return htmlspecialchars($output, ENT_QUOTES, 'UTF-8');
    }

    public static function generateToken(int $length = 32): string
    {
        return bin2hex(random_bytes($length));
    }

    public static function getIpAddress(): string
    {
        $headers = ['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'REMOTE_ADDR'];
        foreach ($headers as $header) {
            if (!empty($_SERVER[$header])) {
                $ip = explode(',', $_SERVER[$header])[0];
                $ip = trim($ip);
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                    return $ip;
                }
            }
        }
        return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }

    public static function hashIp(string $ip): string
    {
        return hash('sha256', $ip . 'pepacks_salt_2026');
    }

    public static function rateLimitCheck(string $ip, string $type = 'login'): bool
    {
        self::loadConfig();
        $db = \Pepacks\Config\Database::getInstance();

        $stmt = $db->prepare('SELECT COUNT(*) FROM login_attempts WHERE ip_address = :ip AND attempted_at > datetime(:now, :interval)');
        $stmt->execute([
            ':ip' => $ip,
            ':now' => 'now',
            ':interval' => '-' . self::$config['security']['lockout_time'] . ' seconds',
        ]);

        $attempts = (int) $stmt->fetchColumn();
        return $attempts < self::$config['security']['max_login_attempts'];
    }

    public static function logAttempt(string $username, string $ip, bool $success): void
    {
        $db = \Pepacks\Config\Database::getInstance();
        $stmt = $db->prepare('INSERT INTO login_attempts (username, ip_address, is_success) VALUES (:user, :ip, :success)');
        $stmt->execute([
            ':user' => $username,
            ':ip' => $ip,
            ':success' => $success ? 1 : 0,
        ]);
    }

public static function setSecurityHeaders(): void
{
    // Headers de seguridad básicos (sin CSP para desarrollo local)
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('X-XSS-Protection: 0');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()');
    // CSP desactivada para desarrollo local
    // header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';");
}

    public static function redirect(string $url): void
    {
        header('Location: ' . $url, true, 302);
        exit;
    }

    public static function isHttps(): bool
    {
        return (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ||
               (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');
    }
}
