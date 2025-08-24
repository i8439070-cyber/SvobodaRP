import * as alt from 'alt-server';

export function registerRPChat() {
  alt.onClient('rp:me', (player, text) => alt.emitAllClients('rp:me', player.id, text));
  alt.onClient('rp:do', (player, text) => alt.emitAllClients('rp:do', player.id, text));
  alt.onClient('rp:try', (player, text) => {
    const success = Math.random() < 0.5;
    alt.emitAllClients('rp:try', player.id, text, success);
  });
}