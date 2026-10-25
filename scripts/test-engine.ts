import { registerDistributor } from '../src/lib/matrixEngine';
import db, { initDb } from '../src/lib/db';
import bcrypt from 'bcryptjs';

async function testMatrixEngine() {
  console.log('Testing Matrix Engine & Commission logic...');

  initDb();

  const pw = bcrypt.hashSync('Password123!', 10);

  // Register 12 test users under ORB00000 as sponsor
  for (let i = 1; i <= 12; i++) {
    const res = await registerDistributor({
      name: `Test User ${i}`,
      email: `user${i}@test.com`,
      passwordHash: pw,
      sponsorId: 'ORB00000',
      flavorPreference: i % 2 === 0 ? 'Vanilla' : 'Chocolate',
      shippingAddress: `123 Test Street #${i}`,
    });

    console.log(`Registered ${res.userId} -> Parent: ${res.parentId}, Level: ${res.matrixLevel}, Pos: ${res.position}, BFS Seq: ${res.bfsSequence}`);
  }

  // Check Root ORB00000 wallet balance
  // Direct referral bonus: 12 * 1000 = 12,000
  // Matrix level bonus: 12 * 200 = 2,400 (ORB00000 receives L1 for 1-10 and L1 via ORB00001 for 11-12)
  // Total expected = 14,400
  const root = db.prepare('SELECT wallet_balance FROM users WHERE id = ?').get('ORB00000') as { wallet_balance: number };
  console.log(`Root ORB00000 Wallet Balance: ₹${root.wallet_balance}`);

  const user11 = db.prepare('SELECT id, parent_id, matrix_level FROM users WHERE id = ?').get('ORB00011') as { id: string; parent_id: string; matrix_level: number } | undefined;

  if (user11) {
    console.log(`User ${user11.id} Parent: ${user11.parent_id}, Level: ${user11.matrix_level}`);
    if (user11.parent_id === 'ORB00001' && user11.matrix_level === 2) {
      console.log('SUCCESS: Strict BFS spillover verified! User 11 correctly spilled over to ORB00001 on Level 2.');
    } else {
      console.error('FAILED: Incorrect placement for User 11', user11);
      process.exit(1);
    }
  } else {
    console.error('FAILED: User ORB00011 not found');
    process.exit(1);
  }
}

testMatrixEngine().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
