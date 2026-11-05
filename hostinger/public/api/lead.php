<?php
// Receives enquiry form submissions from the website (src/lib/leads.ts),
// saves each one to the MySQL `leads` table and emails it to the sales inbox.
define('AVR', true);
require __DIR__ . '/_bootstrap.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'error' => 'Method not allowed']);
}

// Only accept submissions sent from our own pages.
$bareHost = fn(string $host): string => preg_replace(['/:\d+$/', '/^www\./'], '', strtolower($host));
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && $bareHost((string) parse_url($origin, PHP_URL_HOST)) !== $bareHost((string) ($_SERVER['HTTP_HOST'] ?? ''))) {
    respond(403, ['ok' => false, 'error' => 'Forbidden']);
}

$raw = file_get_contents('php://input', false, null, 0, 20000);
$input = json_decode((string) $raw, true);
if (!is_array($input)) $input = $_POST;

$field = function (string $key, int $max) use ($input): string {
    $v = $input[$key] ?? '';
    if (!is_string($v)) return '';
    $v = trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v) ?? '');
    return mb_substr($v, 0, $max);
};

// Honeypot: real visitors never fill the hidden "website" field.
if ($field('website', 200) !== '') respond(200, ['ok' => true]);

$lead = [
    'name' => $field('name', 120),
    'phone' => $field('phone', 20),
    'email' => $field('email', 160),
    'reason' => $field('reason', 80),
    'project' => $field('project', 120),
    'message' => $field('message', 3000),
    'source' => $field('source', 120),
    'page' => $field('page', 255),
];

$digits = preg_replace('/\D/', '', $lead['phone']);
if ($lead['name'] === '' || strlen($digits) < 10 || strlen($digits) > 13) {
    respond(422, ['ok' => false, 'error' => 'Please enter your name and a valid mobile number.']);
}
if ($lead['email'] !== '' && !filter_var($lead['email'], FILTER_VALIDATE_EMAIL)) {
    respond(422, ['ok' => false, 'error' => 'Please enter a valid email address.']);
}

$now = date('Y-m-d H:i:s');
$ip = avr_ip();
$saved = false;

try {
    $db = avr_db();

    // Simple flood protection: at most 5 enquiries per visitor per 10 minutes.
    $recent = $db->prepare('SELECT COUNT(*) FROM leads WHERE ip = ? AND created_at > ?');
    $recent->execute([$ip, date('Y-m-d H:i:s', time() - 600)]);
    if ((int) $recent->fetchColumn() >= 5) {
        respond(429, ['ok' => false, 'error' => 'Too many requests. Please call us instead.']);
    }

    $insert = $db->prepare('INSERT INTO leads
        (created_at, name, phone, email, reason, project, message, source, page, ip, user_agent)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $insert->execute([
        $now, $lead['name'], $lead['phone'], $lead['email'], $lead['reason'], $lead['project'],
        $lead['message'], $lead['source'], $lead['page'], $ip,
        mb_substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 255),
    ]);
    $saved = true;
} catch (Throwable $e) {
    error_log('[avr] lead save failed: ' . $e->getMessage());
}

// Email alert (a failed email never loses the lead — it is already saved).
$config = avr_config();
$mailed = false;
if (!empty($config['notify_to'])) {
    $labels = [
        'name' => 'Name', 'phone' => 'Mobile', 'email' => 'Email', 'reason' => 'Reason',
        'project' => 'Project', 'message' => 'Message', 'source' => 'Form', 'page' => 'Page',
    ];
    $lines = [];
    foreach ($labels as $key => $label) {
        if ($lead[$key] !== '') $lines[] = str_pad($label . ':', 10) . $lead[$key];
    }
    $lines[] = str_pad('Time:', 10) . date('d M Y, h:i A', strtotime($now));

    $subject = 'New enquiry: ' . $lead['name'] . ($lead['project'] !== '' ? ' — ' . $lead['project'] : '');
    $from = $config['mail_from'] ?? '';
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'From: Aspire Ventures Realty Website <' . $from . '>',
    ];
    if ($lead['email'] !== '') $headers[] = 'Reply-To: ' . $lead['email'];

    $mailed = @mail(
        $config['notify_to'],
        '=?UTF-8?B?' . base64_encode($subject) . '?=',
        implode("\n", $lines) . "\n",
        implode("\r\n", $headers),
        $from !== '' ? '-f' . $from : ''
    );
    if (!$mailed) error_log('[avr] lead email failed for ' . $lead['phone']);
}

// Copy to the Google Sheet (via the Apps Script web app in
// hostinger/google-sheet-apps-script.gs). Returns true when the sheet accepted it.
function send_to_sheet(array $config, array $lead, string $now): bool
{
    if (empty($config['sheet_url']) || !function_exists('curl_init')) return false;
    $ch = curl_init($config['sheet_url']);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($lead + ['time' => $now, 'secret' => $config['sheet_secret'] ?? '']),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true, // Apps Script answers via a redirect
        CURLOPT_TIMEOUT => 20,
    ]);
    $body = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $ok = $status === 200 && is_string($body) && str_contains($body, '"ok":true');
    if (!$ok) error_log('[avr] Google Sheet copy failed (' . $status . '): ' . substr((string) $body, 0, 200));
    return $ok;
}

if (!$saved && !$mailed) {
    // Last resort: if the sheet takes it, the lead is still safe.
    if (send_to_sheet($config, $lead, $now)) respond(200, ['ok' => true]);
    respond(500, ['ok' => false, 'error' => 'Something went wrong. Please call or WhatsApp us.']);
}

// Answer the visitor straight away, then copy to the sheet in the background
// so the form never waits on Google.
ignore_user_abort(true);
$reply = json_encode(['ok' => true]);
http_response_code(200);
if (function_exists('apache_setenv')) @apache_setenv('no-gzip', '1');
header('Content-Encoding: none');
header('Content-Length: ' . strlen($reply));
header('Connection: close');
echo $reply;
if (function_exists('litespeed_finish_request')) litespeed_finish_request(); // Hostinger
elseif (function_exists('fastcgi_finish_request')) fastcgi_finish_request();
else { while (ob_get_level() > 0) ob_end_flush(); flush(); }
send_to_sheet($config, $lead, $now);
