import './styles/game.css';
import { GameApp } from './app/GameApp.ts';

const appEl = document.getElementById('app')!;
new GameApp(appEl);
