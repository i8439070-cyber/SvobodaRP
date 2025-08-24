import * as alt from 'alt-server';
import bcrypt from 'bcrypt';
import { getDB } from '../core/db.js';
import fs from 'fs';

async function getAccountByUsername(username) {
  const db = getDB();
  const [rows] = await db.query('SELECT * FROM accounts WHERE username = ?', [username]);
  return rows[0];
}

async function createAccount(username, password) {
  const db = getDB();
  const hash = await bcrypt.hash(password, 10);
  const [res] = await db.query('INSERT INTO accounts (username, password_hash) VALUES (?, ?)', [username, hash]);
  return res.insertId;
}

async function updateLastLogin(id) {
  const db = getDB();
  await db.query('UPDATE accounts SET last_login = NOW() WHERE id = ?', [id]);
}

alt.on('playerConnect', (player) => {
  alt.emitClient(player, 'ui:showLogin', true);
});

alt.onClient('acc:register', async (player, username, password) => {
  if (!username || !password) return alt.emitClient(player, 'ui:loginError', 'Порожні поля');
  const existing = await getAccountByUsername(username);
  if (existing) return alt.emitClient(player, 'ui:loginError', 'Логін зайнятий');
  const id = await createAccount(username, password);
  player.accountId = id;
  player.setStreamSyncedMeta('accountId', id);
  await updateLastLogin(id);
  alt.emitClient(player, 'ui:authOk', username);
  // spawn
  alt.emitClient(player, 'core:spawn');
});

alt.onClient('acc:login', async (player, username, password) => {
  const acc = await getAccountByUsername(username);
  if (!acc) return alt.emitClient(player, 'ui:loginError', 'Аккаунт не знайдено');
  const ok = await bcrypt.compare(password, acc.password_hash);
  if (!ok) return alt.emitClient(player, 'ui:loginError', 'Невірний пароль');
  player.accountId = acc.id;
  player.setStreamSyncedMeta('accountId', acc.id);
  await updateLastLogin(acc.id);
  alt.emitClient(player, 'ui:authOk', username);
  alt.emitClient(player, 'core:spawn');
});