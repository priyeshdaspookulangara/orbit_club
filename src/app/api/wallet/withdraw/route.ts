import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { Mutex } from 'async-mutex';

const withdrawMutex = new Mutex();

export async function POST(request: Request) {
  try {
    const auth = getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, method, payoutDetails } = await request.json();
    const withdrawAmount = Number(amount);

    if (!withdrawAmount || withdrawAmount <= 0) {
      return NextResponse.json({ error: 'Please enter a valid withdrawal amount.' }, { status: 400 });
    }

    if (!method || !['UPI', 'BANK_TRANSFER'].includes(method)) {
      return NextResponse.json({ error: 'Invalid payout method selected.' }, { status: 400 });
    }

    if (!payoutDetails || typeof payoutDetails !== 'string' || payoutDetails.trim().length < 4) {
      return NextResponse.json({ error: 'Please provide valid UPI ID or Bank Account details.' }, { status: 400 });
    }

    return await withdrawMutex.runExclusive(async () => {
      // Get fresh user wallet balance
      const user = await db.queryOne('SELECT id, wallet_balance FROM users WHERE id = ?', [auth.userId]);

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const currentBalance = Number(user.wallet_balance);

      if (currentBalance < withdrawAmount) {
        return NextResponse.json({
          error: `Insufficient wallet balance. Available: ₹${currentBalance.toLocaleString()}`,
        }, { status: 400 });
      }

      const txId = `WITHDRAW-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const newBalance = currentBalance - withdrawAmount;

      await db.withTransaction(async (tx) => {
        // Deduct wallet balance
        await tx.query('UPDATE users SET wallet_balance = ? WHERE id = ?', [newBalance, auth.userId]);

        // Record withdrawal transaction
        await tx.query(`
          INSERT INTO transactions (id, user_id, source_user_id, type, amount, description)
          VALUES (?, ?, ?, 'WITHDRAWAL', ?, ?)
        `, [
          txId,
          auth.userId,
          auth.userId,
          -withdrawAmount,
          `Payout Request (${method}): ${payoutDetails.trim()}`
        ]);
      });

      return NextResponse.json({
        success: true,
        message: `Successfully processed withdrawal request of ₹${withdrawAmount.toLocaleString()}`,
        newBalance,
        transactionId: txId,
      });
    });
  } catch (err: any) {
    console.error('Withdrawal error:', err);
    return NextResponse.json({ error: err.message || 'Withdrawal failed' }, { status: 500 });
  }
}
