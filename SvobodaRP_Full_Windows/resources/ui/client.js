import * as alt from 'alt-client';
import * as native from 'natives';

let view = null;
alt.onServer('ui:showLogin', (show) => {
  if (show) {
    if (view) return;
    view = new alt.WebView('http://resource/ui/login.html');
    view.focus();
    alt.showCursor(true);
    alt.toggleGameControls(false);
    view.on('ui:login', (u, p) => alt.emitServer('acc:login', u, p));
    view.on('ui:register', (u, p) => alt.emitServer('acc:register', u, p));
  } else {
    if (!view) return;
    view.destroy();
    view = null;
    alt.showCursor(false);
    alt.toggleGameControls(true);
  }
});

alt.onServer('ui:loginError', (msg) => {
  if (view) view.emit('ui:error', msg);
});

alt.onServer('ui:authOk', (username) => {
  if (view) view.emit('ui:success', username);
  setTimeout(() => {
    alt.emitServer('ui:close');
  }, 500);
  alt.emitServer('ui:close');
});

alt.onServer('core:spawn', () => {
  const x = -1037.0, y = -2737.0, z = 20.0;
  native.requestCollisionAtCoord(x, y, z);
  alt.setLocalMeta('hud:cash', 0);
  alt.setLocalMeta('hud:bank', 0);
  native.setEntityCoords(alt.Player.local, x, y, z, false, false, false, true);
  alt.emitServer('hud:requestBalances');
});

alt.onServer('chat:message', (text) => {
  alt.log(`CHAT: ${text}`);
});

// RP chat visual relay
alt.onServer('rp:me', (id, text) => alt.log(`*${id} ${text}`));
alt.onServer('rp:do', (id, text) => alt.log(`(${id}) ${text}`));
alt.onServer('rp:try', (id, text, ok) => alt.log(`[TRY ${ok ? 'OK' : 'FAIL'}] ${id}: ${text}`));