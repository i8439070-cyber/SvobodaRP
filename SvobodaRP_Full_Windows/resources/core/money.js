import { getDB } from './db.js';
import * as alt from 'alt-server';

export async function getBalances(accountId) {
  const db = getDB();
  const [rows] = await db.query('SELECT cash, bank FROM accounts WHERE id = ?', [accountId]);
  return rows[0] || { cash: 0, bank: 0 };
}

export async function addCash(accountId, amount) {
  const db = getDB();
  await db.query('UPDATE accounts SET cash = cash + ? WHERE id = ?', [amount, accountId]);
}

export async function addBank(accountId, amount) {
  const db = getDB();
  await db.query('UPDATE accounts SET bank = bank + ? WHERE id = ?', [amount, accountId]);
}

export function registerMoneyCommands() {
  alt.onClient('core:givemoney', async (player, targetId, amount) => {
    amount = Number(amount);
    if (!player.accountId || isNaN(amount) || amount <= 0) return;
    const target = [...alt.Player.all].find(p => Number(p.getStreamSyncedMeta('accountId')) === Number(targetId));
    if (!target) {
      player.sendChatMessage?.('Гравця не знайдено.');
      return;
    }
    await addCash(target.accountId, amount);
    player.sendChatMessage?.(`Передано ${amount} ₴ гравцю ${target.name}`);
    target.sendChatMessage?.(`Ви отримали ${amount} ₴`);
  });
}