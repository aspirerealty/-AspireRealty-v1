<?php
// Shared setup for the PHP endpoints (lead form + leads page).
// Not a page: direct requests are refused here and in .htaccess.
if (!defined('AVR')) {
    http_response_code(404);
    exit;
}

date_default_timezone_set('Asia/Kolkata');

// Settings (database password, admin password, emails) live in
// lead-config.php ONE LEVEL ABOVE public_html, so they are never web-visible
// and never committed to GitHub. See hostinger/lead-config.sample.php.
function avr_config(): array
{
    static $config = null;
    if ($config !== null) return $config;

    $file = dirname(__DIR__, 2) . '/lead-config.php';
    if (!is_file($file)) {
        error_log('[avr] lead-config.php not found at ' . $file);
        http_response_code(500);
        exit('Server is not configured yet.');
    }
    $config = require $file;
    return $config;
}

function avr_db(): PDO
{
    static $pdo = null;
    if ($pdo) return $pdo;

    $c = avr_config();
    $pdo = new PDO(
        "mysql:host={$c['db_host']};dbname={$c['db_name']};charset=utf8mb4",
        $c['db_user'],
        $c['db_pass'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );

    // Created automatically on first use.
    $pdo->exec("CREATE TABLE IF NOT EXISTS leads (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        created_at DATETIME NOT NULL,
        name VARCHAR(120) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(160) NOT NULL DEFAULT '',
        reason VARCHAR(80) NOT NULL DEFAULT '',
        project VARCHAR(120) NOT NULL DEFAULT '',
        message TEXT NULL,
        source VARCHAR(120) NOT NULL DEFAULT '',
        page VARCHAR(255) NOT NULL DEFAULT '',
        ip VARCHAR(45) NOT NULL DEFAULT '',
        user_agent VARCHAR(255) NOT NULL DEFAULT '',
        KEY idx_created (created_at),
        KEY idx_ip_created (ip, created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    return $pdo;
}

function avr_ip(): string
{
    return substr((string) ($_SERVER['REMOTE_ADDR'] ?? ''), 0, 45);
}

function h($value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}
