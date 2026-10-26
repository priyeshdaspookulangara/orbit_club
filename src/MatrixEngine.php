<?php
// src/MatrixEngine.php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../database/init.php';

class MatrixEngine {
    private PDO $pdo;

    public function __construct() {
        $this->pdo = Database::getConnection();
    }

    /**
     * Strict Company-Wide BFS Algorithm to locate next parent with < 10 children
     */
    public function findNextPlacementParent(): array {
        // Query potential parents level by level (level 0 to 4), sorted left-to-right by bfs_sequence ASC
        $stmt = $this->pdo->prepare("
            SELECT u.id, u.matrix_level, u.bfs_sequence, COUNT(c.id) as child_count
            FROM users u
            LEFT JOIN users c ON c.parent_id = u.id
            WHERE u.matrix_level < 5
            GROUP BY u.id, u.matrix_level, u.bfs_sequence
            HAVING child_count < 10
            ORDER BY u.matrix_level ASC, u.bfs_sequence ASC
            LIMIT 1
        ");
        $stmt->execute();
        $parent = $stmt->fetch();

        if (!$parent) {
            throw new Exception("Matrix global capacity limit reached (Max 11,111 nodes across 5 levels).");
        }

        return [
            'parentId' => $parent['id'],
            'position' => (int)$parent['child_count'],
            'matrixLevel' => (int)$parent['matrix_level'] + 1,
        ];
    }

    /**
     * Register distributor, trigger auto-spillover placement, create ₹6,000 order, and pay commissions
     */
    public function registerDistributor(array $data): array {
        $name = trim($data['name']);
        $email = trim(strtolower($data['email']));
        $phone = trim($data['phone']);
        $password = $data['password'];
        $sponsorId = trim($data['sponsorId'] ?? 'ORB00000');
        $flavor = trim($data['flavor'] ?? 'Chocolate');
        $shippingAddress = trim($data['shippingAddress']);

        if (empty($name) || empty($email) || empty($password) || empty($shippingAddress)) {
            throw new Exception("Please fill in all required registration fields.");
        }

        $this->pdo->beginTransaction();

        try {
            // Check if email already exists
            $checkStmt = $this->pdo->prepare("SELECT id FROM users WHERE email = ?");
            $checkStmt->execute([$email]);
            if ($checkStmt->fetch()) {
                throw new Exception("A distributor with this email is already registered.");
            }

            // Verify sponsor ID exists
            $sponsorStmt = $this->pdo->prepare("SELECT id, name FROM users WHERE id = ?");
            $sponsorStmt->execute([$sponsorId]);
            $sponsor = $sponsorStmt->fetch();
            if (!$sponsor) {
                $sponsorId = 'ORB00000'; // Default to root
            }

            // Get total user count to compute next BFS sequence number
            $seqStmt = $this->pdo->prepare("SELECT MAX(bfs_sequence) FROM users");
            $seqStmt->execute();
            $maxSeq = (int)($seqStmt->fetchColumn() ?: 0);
            $bfsSequence = $maxSeq + 1;

            // Generate unique Distributor ID
            $numPart = str_pad((string)($bfsSequence - 1), 5, '0', STR_PAD_LEFT);
            $newUserId = "ORB" . $numPart;

            // Strict BFS Auto-Spillover placement
            $placement = $this->findNextPlacementParent();
            $parentId = $placement['parentId'];
            $position = $placement['position'];
            $matrixLevel = $placement['matrixLevel'];

            $passwordHash = password_hash($password, PASSWORD_BCRYPT);

            // Insert New User
            $insertUser = $this->pdo->prepare("
                INSERT INTO users (
                    id, name, email, phone, password_hash, role, sponsor_id, parent_id,
                    position, matrix_level, bfs_sequence, flavor_preference, shipping_address, wallet_balance
                ) VALUES (?, ?, ?, ?, ?, 'member', ?, ?, ?, ?, ?, ?, ?, 0.00)
            ");
            $insertUser->execute([
                $newUserId, $name, $email, $phone, $passwordHash,
                $sponsorId, $parentId, $position, $matrixLevel, $bfsSequence,
                $flavor, $shippingAddress
            ]);

            // Create ₹6,000 Protein Package Order
            $orderId = "ORD-" . $newUserId . "-" . time();
            $insertOrder = $this->pdo->prepare("
                INSERT INTO orders (id, user_id, package_name, amount, flavor, fulfillment_status, tracking_number, shipping_address)
                VALUES (?, ?, '1kg Pure Whey Protein Powder Kit', 6000.00, ?, 'Processing', ?, ?)
            ");
            $trackingNumber = "TRK-" . strtoupper(substr(md5(uniqid()), 0, 8));
            $insertOrder->execute([$orderId, $newUserId, $flavor, $trackingNumber, $shippingAddress]);

            // 1. Credit Direct Referral Commission (₹1,000) to Sponsor
            $updateSponsor = $this->pdo->prepare("UPDATE users SET wallet_balance = wallet_balance + 1000.00 WHERE id = ?");
            $updateSponsor->execute([$sponsorId]);

            $txIdDirect = "TX-DIR-" . uniqid();
            $insertTxDirect = $this->pdo->prepare("
                INSERT INTO transactions (id, user_id, type, amount, description, source_user_id)
                VALUES (?, ?, 'DIRECT_REFERRAL', 1000.00, ?, ?)
            ");
            $insertTxDirect->execute([
                $txIdDirect, $sponsorId,
                "Direct referral bonus for joining of {$name} ({$newUserId})",
                $newUserId
            ]);

            // 2. Credit Matrix Level Commissions (₹200) up the 5-tier parent chain
            $currentParentId = $parentId;
            $depth = 1;

            while (!empty($currentParentId) && $depth <= 5) {
                $pStmt = $this->pdo->prepare("SELECT id, name, parent_id FROM users WHERE id = ?");
                $pStmt->execute([$currentParentId]);
                $pNode = $pStmt->fetch();

                if (!$pNode) break;

                // Credit ₹200 to parent
                $updateParent = $this->pdo->prepare("UPDATE users SET wallet_balance = wallet_balance + 200.00 WHERE id = ?");
                $updateParent->execute([$currentParentId]);

                $txIdLevel = "TX-LVL-{$depth}-" . uniqid();
                $insertTxLevel = $this->pdo->prepare("
                    INSERT INTO transactions (id, user_id, type, amount, description, source_user_id, level_depth)
                    VALUES (?, ?, 'MATRIX_LEVEL', 200.00, ?, ?, ?)
                ");
                $insertTxLevel->execute([
                    $txIdLevel, $currentParentId,
                    "Matrix Level {$depth} bonus from placement of {$name} ({$newUserId})",
                    $newUserId, $depth
                ]);

                $currentParentId = $pNode['parent_id'];
                $depth++;
            }

            $this->pdo->commit();

            return [
                'success' => true,
                'userId' => $newUserId,
                'sponsorId' => $sponsorId,
                'parentId' => $parentId,
                'position' => $position,
                'matrixLevel' => $matrixLevel,
                'bfsSequence' => $bfsSequence,
            ];

        } catch (Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }
}
