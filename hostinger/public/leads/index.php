<?php
// Password-protected list of website enquiries, with an Excel (CSV) download.
// Open https://<domain>/leads/ — the password is set in lead-config.php.
define('AVR', true);
require dirname(__DIR__) . '/api/_bootstrap.php';

header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
header('X-Frame-Options: DENY');

session_name('avr_leads');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/leads/',
    'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'httponly' => true,
    'samesite' => 'Strict',
]);
session_start();

$config = avr_config();
$error = '';

if (isset($_GET['logout'])) {
    $_SESSION = [];
    session_destroy();
    header('Location: ./');
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && isset($_POST['password'])) {
    $expected = (string) ($config['admin_password'] ?? '');
    if ($expected !== '' && hash_equals($expected, (string) $_POST['password'])) {
        session_regenerate_id(true);
        $_SESSION['ok'] = true;
        header('Location: ./');
        exit;
    }
    sleep(2); // slow down password guessing
    $error = 'Wrong password.';
}

$loggedIn = !empty($_SESSION['ok']);
$columns = [
    'created_at' => 'Date & time', 'name' => 'Name', 'phone' => 'Mobile', 'email' => 'Email',
    'project' => 'Project', 'reason' => 'Reason', 'message' => 'Message', 'source' => 'Form', 'page' => 'Page',
];

if ($loggedIn && isset($_GET['download'])) {
    $rows = avr_db()->query('SELECT ' . implode(',', array_keys($columns)) . ' FROM leads ORDER BY id DESC');
    header('Content-Type: text/csv; charset=UTF-8');
    header('Content-Disposition: attachment; filename="aspire-leads-' . date('Y-m-d') . '.csv"');
    $out = fopen('php://output', 'w');
    fwrite($out, "\xEF\xBB\xBF"); // so Excel reads Indian names/₹ correctly
    fputcsv($out, array_values($columns));
    foreach ($rows as $row) {
        // Stop Excel from treating values like "=..." as formulas.
        fputcsv($out, array_map(fn($v) => preg_match('/^[=+\-@]/', (string) $v) ? "'" . $v : $v, $row));
    }
    exit;
}

$leads = [];
$total = 0;
$q = trim((string) ($_GET['q'] ?? ''));
if ($loggedIn) {
    $db = avr_db();
    $total = (int) $db->query('SELECT COUNT(*) FROM leads')->fetchColumn();
    if ($q !== '') {
        $like = '%' . $q . '%';
        $stmt = $db->prepare('SELECT * FROM leads WHERE name LIKE ? OR phone LIKE ? OR email LIKE ? OR project LIKE ?
            ORDER BY id DESC LIMIT 500');
        $stmt->execute([$like, $like, $like, $like]);
    } else {
        $stmt = $db->query('SELECT * FROM leads ORDER BY id DESC LIMIT 500');
    }
    $leads = $stmt->fetchAll();
}
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Leads — Aspire Ventures Realty</title>
<style>
  :root { --navy: #092c4c; --gold: #c49a52; --cream: #faf7f1; --muted: #5b6878; }
  * { box-sizing: border-box; }
  body { margin: 0; font: 15px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; background: var(--cream); color: #0b1b2b; }
  header { background: var(--navy); color: #fff; padding: 16px 24px; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between; }
  header b { font-size: 18px; letter-spacing: .04em; }
  header span { color: var(--gold); font-size: 12px; letter-spacing: .3em; margin-left: 8px; }
  main { padding: 24px; max-width: 1400px; margin: 0 auto; }
  a.btn, button { display: inline-block; background: var(--gold); color: #051a2e; border: 0; padding: 10px 18px; font: 600 14px system-ui, sans-serif; text-decoration: none; cursor: pointer; }
  a.btn.ghost { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,.35); }
  .bar { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  input { padding: 10px 12px; border: 1px solid #c9d1da; font: inherit; min-width: 240px; }
  .wrap { overflow-x: auto; background: #fff; border: 1px solid #e3e7ec; }
  table { border-collapse: collapse; width: 100%; min-width: 900px; }
  th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #eef1f4; vertical-align: top; }
  th { background: #f3f5f8; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); position: sticky; top: 0; }
  td.msg { max-width: 320px; white-space: pre-wrap; }
  td a { color: var(--navy); }
  .muted { color: var(--muted); }
  .login { max-width: 360px; margin: 12vh auto; background: #fff; padding: 32px; border: 1px solid #e3e7ec; }
  .login input { width: 100%; margin: 16px 0; }
  .login button { width: 100%; }
  .err { color: #b42318; }
</style>
</head>
<body>
<?php if (!$loggedIn): ?>
  <form class="login" method="post">
    <h2 style="margin:0;color:var(--navy)">Website leads</h2>
    <p class="muted" style="margin:4px 0 0">Aspire Ventures Realty</p>
    <input type="password" name="password" placeholder="Password" autofocus required>
    <?php if ($error): ?><p class="err"><?= h($error) ?></p><?php endif; ?>
    <button type="submit">Log in</button>
  </form>
<?php else: ?>
  <header>
    <div><b>ASPIRE VENTURES</b><span>LEADS</span></div>
    <div style="display:flex;gap:8px">
      <a class="btn" href="?download=1">Download Excel</a>
      <a class="btn ghost" href="?logout=1">Log out</a>
    </div>
  </header>
  <main>
    <div class="bar">
      <p class="muted" style="margin:0"><?= number_format($total) ?> enquiries in total<?= $q !== '' ? ' · ' . count($leads) . ' matching “' . h($q) . '”' : ($total > 500 ? ' · showing latest 500' : '') ?></p>
      <form method="get"><input type="search" name="q" value="<?= h($q) ?>" placeholder="Search name, mobile, email, project"></form>
    </div>
    <div class="wrap">
      <table>
        <thead><tr><?php foreach ($columns as $label): ?><th><?= h($label) ?></th><?php endforeach; ?></tr></thead>
        <tbody>
        <?php if (!$leads): ?>
          <tr><td colspan="<?= count($columns) ?>" class="muted">No enquiries yet.</td></tr>
        <?php endif; ?>
        <?php foreach ($leads as $l): ?>
          <tr>
            <td style="white-space:nowrap"><?= h(date('d M Y, h:i A', strtotime($l['created_at']))) ?></td>
            <td><?= h($l['name']) ?></td>
            <td style="white-space:nowrap"><a href="tel:<?= h(preg_replace('/[^\d+]/', '', $l['phone'])) ?>"><?= h($l['phone']) ?></a></td>
            <td><?php if ($l['email'] !== ''): ?><a href="mailto:<?= h($l['email']) ?>"><?= h($l['email']) ?></a><?php endif; ?></td>
            <td><?= h($l['project']) ?></td>
            <td><?= h($l['reason']) ?></td>
            <td class="msg"><?= h($l['message']) ?></td>
            <td><?= h($l['source']) ?></td>
            <td class="muted"><?= h($l['page']) ?></td>
          </tr>
        <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  </main>
<?php endif; ?>
</body>
</html>
