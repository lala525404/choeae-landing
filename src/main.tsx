import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const container = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// 빌드한 HTML에는 랜딩이 미리 그려져 있어서(vite-plugins/landing-shell.ts) 그 DOM에 그대로 붙는다. 비어 있으면(예: 플러그인을 끈 개발 환경) 새로 그린다.
if (container.hasChildNodes()) hydrateRoot(container, app);
else createRoot(container).render(app);
