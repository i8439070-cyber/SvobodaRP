import * as alt from 'alt-server';
import { getDB } from '../core/db.js';

async function getFactionSalary(factionId, rank) {
  const db = getDB();
  const [rows] = await db.query('SELECT salary_json FROM factions WHERE id = ?', [factionId]);
  if (!rows[0]) return 0;
  const json = rows[0].salary_json;
  const data = typeof json === 'string' ? JSON.parse(json) : json;
  return Number(data[String(rank)] || 0);
}

alt.onClient('faction:invite', async (player, targetName, factionId, rank=1) => {
  const target = [...alt.Player.all].find(p => p.name.toLowerCase() === String(targetName).toLowerCase());
  if (!target || !target.accountId) return;
  const db = getDB();
  await db.query('UPDATE accounts SET faction_id=?, faction_rank=? WHERE id=?', [factionId, rank, target.accountId]);
  player.sendChatMessage?.(`Інвайт відправлено ${target.name}`);
  target.sendChatMessage?.(`Вас прийнято у фракцію #${factionId} ранг ${rank}`);
});

alt.setInterval(async () => {
  // Щохвилинна "зарплата" для прикладу (помнож на 60 для реального сервера)
  for (const p of alt.Player.all) {
    if (!p.accountId) continue;
    const db = getDB();
    const [rows] = await db.query('SELECT faction_id, faction_rank FROM accounts WHERE id=?', [p.accountId]);
    const acc = rows[0];
    if (!acc?.faction_id) continue;
    const salary = await getFactionSalary(acc.faction_id, acc.faction_rank || 1);
    if (salary > 0) await db.query('UPDATE accounts SET bank = bank + ? WHERE id = ?', [salary, p.accountId]);
    p.sendChatMessage?.(`Зарплата: +${salary} ₴ (нараховано на банк)`);
  }
}, 60000);