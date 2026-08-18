<?php
/**
 * Script de instalación - crear base de datos y usuario admin
 * Ejecutar: php scripts/init.php
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../src/Security.php';

use Pepacks\Config\Database;
use Pepacks\Security\Security;

try {
    Database::init();
    echo "Base de datos creada correctamente.\n";

    $db = Database::getInstance();

    // Verificar si ya hay usuarios
    $stmt = $db->query('SELECT COUNT(*) FROM users');
    $count = (int) $stmt->fetchColumn();

    if ($count === 0) {
        $username = 'admin';
        $email = 'admin@pepacks.com';
        $password = 'Pepella./SHJK777';

        $stmt = $db->prepare('INSERT INTO users (username, email, password_hash, role) VALUES (:username, :email, :password, :role)');
        $stmt->execute([
            ':username' => $username,
            ':email' => $email,
            ':password' => Security::hashPassword($password),
            ':role' => 'admin',
        ]);

        echo "Usuario administrador creado:\n";
        echo "  Usuario: {$username}\n";
        echo "  Contraseña: {$password}\n";
        echo "  Email: {$email}\n";
        echo "\n";
        echo "IMPORTANTE: Cambia la contraseña por defecto en producción.\n";
    } else {
        echo "Ya existen {$count} usuarios. No se crea usuario por defecto.\n";
    }

    // Insertar juegos de ejemplo si no hay
    $stmt = $db->query('SELECT COUNT(*) FROM games');
    $gameCount = (int) $stmt->fetchColumn();

    if ($gameCount === 0) {
        $games = [
            [
                'title' => 'Cosmic Adventure',
                'slug' => 'cosmic-adventure',
                'description' => "Cosmic Adventure es un juego de plataformas 2D que te lleva a un viaje épico a través del cosmos.\n\nCaracterísticas:\n- Más de 50 niveles únicos distribuidos en 5 planetas diferentes\n- Sistema de power-ups coleccionables\n- Jefes finales desafiantes en cada mundo\n- Gráficos pixel art cuidadosamente diseñados\n- Banda sonora original sintetizada",
                'description_short' => 'Explora el espacio exterior en este emocionante juego de plataformas indie con gráficos pixel art.',
                'version' => '1.2.0',
                'author' => 'IndieDev Studio',
                'category' => 'plataformas',
                'tags' => json_encode(['Plataformas', 'Espacio', 'Pixel Art']),
                'rating' => 4.5,
                'downloads' => 3420,
                'views' => 1205,
            ],
            [
                'title' => 'Forest Mystery',
                'slug' => 'forest-mystery',
                'description' => "Forest Mystery es un juego de puzzles ambientado en un bosque mágico.\n\nCaracterísticas:\n- Más de 100 puzzles únicos\n- Historia envolvente con múltiples finales\n- Arte hand-drawn\n- Banda sonora orquestal",
                'description_short' => 'Resuelve puzzles misteriosos en un bosque encantado lleno de criaturas mágicas.',
                'version' => '1.0.0',
                'author' => 'Mystery Games',
                'category' => 'puzzle',
                'tags' => json_encode(['Puzzle', 'Aventura', 'Fantasía']),
                'rating' => 4.2,
                'downloads' => 2100,
                'views' => 890,
            ],
            [
                'title' => 'Neon Racer',
                'slug' => 'neon-racer',
                'description' => "Neon Racer es un juego de carreras arcade con estética cyberpunk.\n\nCaracterísticas:\n- 20 pistas únicas\n- Multiplayer online\n- Sistema de personalización de vehículos\n- Banda sonora synthwave",
                'description_short' => 'Carreras de alta velocidad en un mundo cyberpunk con estilo visual neón.',
                'version' => '2.1.0',
                'author' => 'Neon Studios',
                'category' => 'carreras',
                'tags' => json_encode(['Carreras', 'Cyberpunk', 'Acción']),
                'rating' => 4.7,
                'downloads' => 4500,
                'views' => 1567,
            ],
        ];

        $stmt = $db->prepare('INSERT INTO games (title, slug, description, description_short, version, author, category, tags, rating, downloads, views, is_visible) VALUES (:title, :slug, :description, :description_short, :version, :author, :category, :tags, :rating, :downloads, :views, 1)');

        foreach ($games as $game) {
            $stmt->execute($game);
        }

        echo "Juegos de ejemplo insertados correctamente.\n";
    } else {
        echo "Ya existen {$gameCount} juegos. No se insertan ejemplos.\n";
    }

    echo "\nInstalación completada.\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
