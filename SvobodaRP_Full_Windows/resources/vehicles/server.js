import * as alt from 'alt-server';
import { getDB } from '../core/db.js';

alt.onClient('veh:buy', async (player, model='sultan') => {
  if (!player.accountId) return;
  const db = getDB();
  const plate = 'UA' + Math.floor(Math.random()*9000+1000);
  const [res] = await db.query(
    'INSERT INTO vehicles (owner_id, model, plate, pos_x, pos_y, pos_z) VALUES (?, ?, ?, 0, 0, 72)',
    [player.accountId, model, plate]
  );
  player.sendChatMessage?.(`Куплено авто ${model} (${plate})`);
});

alt.onClient('veh:spawn', async (player, vehId) => {
  if (!player.accountId) return;
  const db = getDB();
  const [rows] = await db.query('SELECT * FROM vehicles WHERE id = ? AND owner_id = ?', [vehId, player.accountId]);
  const v = rows[0];
  if (!v) return player.sendChatMessage?.('Авто не знайдено');
  const veh = new alt.Vehicle(v.model, player.pos.x + 2, player.pos.y, player.pos.z, 0, 0, 0);
  veh.numberPlateText = v.plate;
  player.sendChatMessage?.(`Спавн авто #${vehId}`);
});