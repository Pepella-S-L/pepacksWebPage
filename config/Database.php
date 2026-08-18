<?php
declare(strict_types=1);

namespace Pepacks\Config;

use PDO;
use PDOException;
use RuntimeException;

class Database
{
    private static ?PDO $instance = null;

    public static function getInstance(): PDO
    {
        if (self::$instance === null) {
            $config = require __DIR__ . '/app.php';
            $dbPath = $config['db']['path'];

            $dir = dirname($dbPath);
            if (!is_dir($dir)) {
                if (!mkdir($dir, 0750, true)) {
                    throw new RuntimeException('No se pudo crear el directorio de la base de datos');
                }
            }

            try {
                self::$instance = new PDO('sqlite:' . $dbPath, null, null, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]);

                self::$instance->exec('PRAGMA journal_mode = WAL');
                self::$instance->exec('PRAGMA foreign_keys = ON');
                self::$instance->exec('PRAGMA synchronous = NORMAL');
                self::$instance->exec("PRAGMA encoding = \"UTF-8\"");
            } catch (PDOException $e) {
                throw new RuntimeException('Error de conexion a la base de datos: ' . $e->getMessage());
            }
        }

        return self::$instance;
    }

    public static function init(): void
    {
        $db = self::getInstance();
        $schema = file_get_contents(__DIR__ . '/schema.sql');

        if ($schema === false) {
            throw new RuntimeException('No se pudo cargar el esquema de la base de datos');
        }

        $db->exec($schema);
    }
}
