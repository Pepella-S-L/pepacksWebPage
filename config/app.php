<?php
declare(strict_types=1);

namespace Pepacks\Config;

return [
    'site' => [
        'name' => 'Pepacks',
        'url' => 'http://localhost:8080',
        'lang' => 'es',
        'charset' => 'UTF-8',
        'timezone' => 'Europe/Madrid',
        'description' => 'Plataforma de juegos indie - descubre, comparte y juega',
        'keywords' => 'juegos, indie, gaming, descargar, gratis, pc, navegador',
    ],
    'db' => [
        'path' => __DIR__ . '/../data/pepacks.db',
        'charset' => 'utf8mb4',
    ],
    'security' => [
        'session_name' => 'PEPACKS_SID',
        'cookie_httponly' => true,
        'cookie_secure' => false,
        'cookie_samesite' => 'Lax',
        'lifetime' => 7200,
        'csrf_length' => 32,
        'password_min_length' => 8,
        'max_login_attempts' => 5,
        'lockout_time' => 900,
        'bcrypt_cost' => 12,
    ],
    'pagination' => [
        'per_page' => 12,
    ],
    'upload' => [
        'max_size' => 10485760,
        'allowed_image_types' => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        'allowed_file_types' => ['application/zip', 'application/x-zip-compressed', 'application/octet-stream'],
        'path' => __DIR__ . '/../public/uploads/',
    ],
    'cookies' => [
        'banner_delay' => 1000,
        'expire_days' => 365,
    ],
];
