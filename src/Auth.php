<?php
// src/Auth.php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/../config/database.php';

class Auth {
    public static function login(string $emailOrId, string $password): array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? OR id = ?");
        $stmt->execute([strtolower(trim($emailOrId)), trim($emailOrId)]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            throw new Exception("Invalid distributor credentials.");
        }

        $_SESSION['user_id'] = $user['id'];
        return $user;
    }

    public static function logout(): void {
        $_SESSION = [];
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();
    }

    public static function getUser(): ?array {
        if (!isset($_SESSION['user_id'])) {
            return null;
        }

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public static function requireAuth(): array {
        $user = self::getUser();
        if (!$user) {
            header('Location: login.php');
            exit();
        }
        return $user;
    }

    public static function requireAdmin(): array {
        $user = self::requireAuth();
        if ($user['role'] !== 'admin') {
            header('Location: dashboard.php');
            exit();
        }
        return $user;
    }
}
