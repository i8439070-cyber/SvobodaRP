import * as alt from 'alt-server';
import { initDB } from './db.js';
import { registerMoneyCommands } from './money.js';
import { registerRPChat } from './rpchat.js';
import fs from 'fs';

async function bootstrap() {
  await initDB();
  registerMoneyCommands();
  registerRPChat();
  alt.log('[core] Ініційовано.');
}
bootstrap();

alt.on('playerConnect', (player) => {
  player.model = 'mp_m_freemode_01';
  alt.log(`[core] ${player.name} підключився.`);
});

// Helper chat for server-side messages
alt.Player.prototype.sendChatMessage = function (msg) {
  alt.emitClient(this, 'chat:message', msg);
};