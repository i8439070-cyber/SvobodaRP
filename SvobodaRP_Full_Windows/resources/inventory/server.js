import * as alt from 'alt-server';
import { getDB } from '../core/db.js';

async function ensureInventory(accountId) {
  const db = getDB();
  const [rows] = await db.query('SELECT id FROM inventories WHERE owner_type="account" AND owner_id=?', [accountId]);
  if (rows[0]) return rows[0].id;
  const [res] = await db.query('INSERT INTO inventories (owner_type, owner_id) VALUES ("account", ?)', [accountId]);
  return res.insertId;
}

alt.onClient('inv:give', async (player, itemId, amount=1) => {
  if (!player.accountId) return;
  const invId = await ensureInventory(player.accountId);
  const db = getDB();
  await db.query('INSERT INTO inventory_items (inventory_id, item_id, amount) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE amount = amount + VALUES(amount)', [invId, itemId, amount]);
  player.sendChatMessage?.(`Отримано предмет #${itemId} x${amount}`);
});

alt.onClient('inv:list', async (player) => {
  if (!player.accountId) return;
  const invId = await ensureInventory(player.accountId);
  const db = getDB();
  const [rows] = await db.query('SELECT ii.item_id, ii.amount, i.name FROM inventory_items ii JOIN items i ON i.id = ii.item_id WHERE ii.inventory_id = ?', [invId]);
  alt.emitClient(player, 'inv:list', rows);
});