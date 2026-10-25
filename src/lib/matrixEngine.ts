import db from './db';
import { Mutex } from 'async-mutex';

const matrixMutex = new Mutex();

export interface RegisterInput {
  name: string;
  email: string;
  passwordHash: string;
  sponsorId: string;
  flavorPreference: string;
  shippingAddress: string;
}

export interface RegisterResult {
  userId: string;
  parentId: string;
  matrixLevel: number;
  position: number;
  bfsSequence: number;
  orderId: string;
}

/**
 * Finds the next available parent in strict company-wide BFS sequence order.
 * Parent must have matrix_level < 4 (since max depth is 5 levels: 0, 1, 2, 3, 4)
 * and currently have < 10 children.
 */
export function findNextBfsParent(): { parentId: string; matrixLevel: number; position: number } {
  // Select candidate nodes ordered by bfs_sequence ASC whose matrix_level < 4
  const candidates = db.prepare(`
    SELECT u.id, u.matrix_level, COUNT(c.id) as child_count
    FROM users u
    LEFT JOIN users c ON c.parent_id = u.id
    WHERE u.matrix_level < 4
    GROUP BY u.id
    HAVING child_count < 10
    ORDER BY u.bfs_sequence ASC
    LIMIT 1
  `).get() as { id: string; matrix_level: number; child_count: number } | undefined;

  if (!candidates) {
    throw new Error('Matrix has reached maximum capacity (11,111 distributors). No further placements available.');
  }

  return {
    parentId: candidates.id,
    matrixLevel: candidates.matrix_level + 1,
    position: candidates.child_count, // 0 to 9
  };
}

/**
 * Registers a new distributor with strict BFS spillover and automated commission calculations inside a transaction.
 */
export async function registerDistributor(input: RegisterInput): Promise<RegisterResult> {
  // Acquire lock to guarantee atomic BFS placement under high concurrency
  return await matrixMutex.runExclusive(async () => {
    // Validate Sponsor ID exists
    const sponsor = db.prepare('SELECT id FROM users WHERE id = ?').get(input.sponsorId) as { id: string } | undefined;
    if (!sponsor) {
      throw new Error(`Sponsor ID '${input.sponsorId}' does not exist.`);
    }

    // Check email uniqueness
    const existingEmail = db.prepare('SELECT id FROM users WHERE email = ?').get(input.email);
    if (existingEmail) {
      throw new Error('Email address is already registered.');
    }

    // Find next parent via strict BFS
    const { parentId, matrixLevel, position } = findNextBfsParent();

    // Determine new BFS Sequence number
    const maxSeqResult = db.prepare('SELECT MAX(bfs_sequence) as max_seq FROM users').get() as { max_seq: number };
    const nextBfsSeq = (maxSeqResult.max_seq || 0) + 1;

    // Generate Distributor ID e.g., ORB00001, ORB00002
    const nextNum = nextBfsSeq - 1; // ORB00000 is seq 1, so seq 2 becomes ORB00001
    const newUserId = `ORB${String(nextNum).padStart(5, '0')}`;

    const orderId = `ORD-${newUserId}-${Date.now()}`;

    // Execute atomic transaction for user creation, order creation, and commission payouts
    const transaction = db.transaction(() => {
      // 1. Insert new distributor
      db.prepare(`
        INSERT INTO users (id, name, email, password_hash, role, sponsor_id, parent_id, matrix_level, position, bfs_sequence, flavor_preference, shipping_address)
        VALUES (?, ?, ?, ?, 'member', ?, ?, ?, ?, ?, ?, ?)
      `).run(
        newUserId,
        input.name,
        input.email,
        input.passwordHash,
        input.sponsorId,
        parentId,
        matrixLevel,
        position,
        nextBfsSeq,
        input.flavorPreference,
        input.shippingAddress
      );

      // 2. Create Product Order (₹6,000 package)
      db.prepare(`
        INSERT INTO orders (id, user_id, package_name, amount, flavor, fulfillment_status, tracking_number)
        VALUES (?, ?, '1kg Pure Whey Protein Powder Kit', 6000, ?, 'Processing', ?)
      `).run(
        orderId,
        newUserId,
        input.flavorPreference,
        `TRK-${Math.floor(100000 + Math.random() * 900000)}`
      );

      // 3. Direct Referral Commission (₹1,000 to Sponsor)
      const directCommTxId = `TX-DIR-${newUserId}-${Date.now()}`;
      db.prepare(`
        INSERT INTO transactions (id, user_id, source_user_id, type, amount, description)
        VALUES (?, ?, ?, 'DIRECT_REFERRAL', 1000, ?)
      `).run(
        directCommTxId,
        input.sponsorId,
        newUserId,
        `Direct referral bonus for joining of ${input.name} (${newUserId})`
      );

      db.prepare(`
        UPDATE users SET wallet_balance = wallet_balance + 1000 WHERE id = ?
      `).run(input.sponsorId);

      // 4. Matrix Level Commissions (₹200 per head up the parent chain)
      let currentParentId: string | null = parentId;
      let depth = 1;

      while (currentParentId && depth <= 5) {
        const matrixTxId = `TX-MAT-${newUserId}-L${depth}-${Date.now()}`;

        db.prepare(`
          INSERT INTO transactions (id, user_id, source_user_id, type, amount, level_depth, description)
          VALUES (?, ?, ?, 'MATRIX_LEVEL', 200, ?, ?)
        `).run(
          matrixTxId,
          currentParentId,
          newUserId,
          depth,
          `Matrix Level ${depth} bonus from placement of ${input.name} (${newUserId})`
        );

        db.prepare(`
          UPDATE users SET wallet_balance = wallet_balance + 200 WHERE id = ?
        `).run(currentParentId);

        // Fetch parent of current parent to walk up the chain
        const parentRecord = db.prepare('SELECT parent_id FROM users WHERE id = ?').get(currentParentId) as { parent_id: string | null } | undefined;
        currentParentId = parentRecord ? parentRecord.parent_id : null;
        depth++;
      }
    });

    transaction();

    return {
      userId: newUserId,
      parentId,
      matrixLevel,
      position,
      bfsSequence: nextBfsSeq,
      orderId,
    };
  });
}
