<?php
// ============================================
// PORTFOLIO DEVJ - Configuration centrale JWT
// ============================================

// --- DÉTECTION ENVIRONNEMENT ---
$host = $_SERVER['HTTP_HOST'] ?? $_SERVER['SERVER_NAME'] ?? '';
$isLocal = (str_contains($host, 'localhost') || str_contains($host, '127.0.0.1') || $host === '');

// --- BASE DE DONNÉES ---
define('DB_HOST',    $isLocal ? '127.0.0.1'                  : 'centerbeam.proxy.rlwy.net');
define('DB_PORT',    $isLocal ? '3307'                        : '31995');
define('DB_NAME',    'portfolio_devj');
define('DB_USER',    'root');
define('DB_PASS',    $isLocal ? ''                            : 'DSvVTMHUmPMcLivGTvyZmQHoatjujSOY');
define('DB_CHARSET', 'utf8mb4');

// --- CHEMINS ---
define('BASE_PATH',   dirname(__DIR__));
define('UPLOAD_PATH', BASE_PATH . '/admin/uploads/');
define('UPLOAD_URL',  'admin/uploads/');

// --- CORS ---
define('ALLOWED_ORIGIN', '*');

// --- JWT ---
define('JWT_SECRET', 'devj_secret_2026_railway_xK9p');
define('JWT_EXPIRE', 28800); // 8 heures

// ============================================
// Connexion PDO
// ============================================
function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            die(json_encode(['success' => false, 'message' => 'Erreur DB: ' . $e->getMessage()]));
        }
    }
    return $pdo;
}

// ============================================
// Headers API (JSON + CORS)
// ============================================
function setApiHeaders(): void {
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: ' . ALLOWED_ORIGIN);
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

// ============================================
// JWT — Génération
// ============================================
function generateToken(int $id, string $email): string {
    $header  = rtrim(strtr(base64_encode(json_encode(['alg'=>'HS256','typ'=>'JWT'])), '+/', '-_'), '=');
    $payload = rtrim(strtr(base64_encode(json_encode([
        'id'    => $id,
        'email' => $email,
        'exp'   => time() + JWT_EXPIRE,
        'iat'   => time(),
    ])), '+/', '-_'), '=');
    $sig = rtrim(strtr(base64_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true)), '+/', '-_'), '=');
    return "$header.$payload.$sig";
}

// ============================================
// JWT — Vérification → retourne le payload
// ============================================
function requireAuth(): array {
    // Récupérer le header Authorization (compatible nginx, apache, php-fpm)
    $auth = '';
    if (function_exists('getallheaders')) {
        foreach (getallheaders() as $k => $v) {
            if (strtolower($k) === 'authorization') { $auth = $v; break; }
        }
    }
    if (!$auth) $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';

    if (!$auth || stripos($auth, 'Bearer ') !== 0) {
        jsonError('Non autorisé — token manquant', 401);
    }

    $token = trim(substr($auth, 7));
    $parts = explode('.', $token);
    if (count($parts) !== 3) jsonError('Token invalide', 401);

    [$h, $p, $s] = $parts;

    $expectedSig = rtrim(strtr(base64_encode(hash_hmac('sha256', "$h.$p", JWT_SECRET, true)), '+/', '-_'), '=');
    if (!hash_equals($expectedSig, $s)) jsonError('Signature invalide', 401);

    $payload = json_decode(base64_decode(strtr($p, '-_', '+/')), true);
    if (!$payload) jsonError('Payload corrompu', 401);
    if (($payload['exp'] ?? 0) < time()) jsonError('Token expiré', 401);

    return $payload;
}

// ============================================
// Réponses JSON
// ============================================
function jsonSuccess($data = null, string $message = 'Succès', int $code = 200): void {
    http_response_code($code);
    echo json_encode(['success' => true, 'message' => $message, 'data' => $data], JSON_UNESCAPED_UNICODE);
    exit();
}

function jsonError(string $message = 'Erreur', int $code = 400): void {
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit();
}

// ============================================
// Upload image
// ============================================
function uploadImage(array $file, string $prefix = 'img'): string|false {
    $allowed = ['image/jpeg','image/png','image/webp','image/gif'];
    if (!in_array($file['type'], $allowed)) return false;
    if ($file['size'] > 5 * 1024 * 1024) return false;
    $ext      = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $filename = $prefix . '_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
    $dest     = UPLOAD_PATH . $filename;
    if (!is_dir(UPLOAD_PATH)) mkdir(UPLOAD_PATH, 0755, true);
    if (move_uploaded_file($file['tmp_name'], $dest)) return UPLOAD_URL . $filename;
    return false;
}
