import './style.css';
import { mountGame } from '@/game/game';

const root = document.querySelector<HTMLDivElement>('#app');
if (!root) {
  throw new Error('Root container #app not found');
}

const game = mountGame(root);

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    game.dispose();
  });
}
