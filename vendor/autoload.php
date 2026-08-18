<?php
declare(strict_types=1);

spl_autoload_register(function ($class) {
    $prefixes = array(
        'Pepacks\\Api\\' => __DIR__ . '/../api/',
        'Pepacks\\Config\\' => __DIR__ . '/../config/',
        'Pepacks\\Security\\' => __DIR__ . '/../src/',
        'Pepacks\\' => __DIR__ . '/../src/',
    );

    foreach ($prefixes as $prefix => $baseDir) {
        $len = strlen($prefix);
        if (strncmp($prefix, $class, $len) !== 0) {
            continue;
        }

        $relativeClass = substr($class, $len);
        $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';

        if (file_exists($file)) {
            require $file;
            return;
        }
    }
});
