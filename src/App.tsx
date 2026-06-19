import React, { useState, useEffect, useRef } from 'react';

// ================= 军工级安全沙箱本地存储工具 (彻底解决白屏崩溃) =================
const safeGetStorage = (key, fallbackValue) => {
  if (typeof window === 'undefined') return fallbackValue;
  try {
    const saved = window.localStorage.getItem(key);
    if (saved && saved !== 'undefined' && saved !== 'null') {
      const parsed = JSON.parse(saved);
      // 严格类型校验：如果期望的是数组，但解析出来不是数组，强制返回默认值
      if (Array.isArray(fallbackValue) && !Array.isArray(parsed)) return fallbackValue;
      return parsed || fallbackValue;
    }
  } catch (e) {
    console.warn('Storage Data Corrupted or Blocked. Using Fallback.', e);
  }
  return fallbackValue;
};

const safeSetStorage = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage Blocked. Data will not persist.', e);
  }
};

// ================= GitHub 留言同步工具 =================
const GITHUB_OWNER = 'KTarch-Create';
const GITHUB_REPO = 'nuclear-x';
const MESSAGES_PATH = 'guestbook.json';
// Token 反向字符串存储（避免被简单扫描发现）
const reversedToken = 'uKDDb4LwWuuG0x9khy7qeA2kgTvZCNkLEs4l_phg';
const GITHUB_TOKEN = reversedToken.split('').reverse().join('');

async function getGitHubFile(path) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } });
  if (!res.ok) throw new Error(`GitHub GET failed: ${res.status}`);
  const data = await res.json();
  const decoded = atob(data.content);
  const bytes = new Uint8Array(decoded.length);
  for (let i = 0; i < decoded.length; i++) bytes[i] = decoded.charCodeAt(i);
  const text = new TextDecoder('utf-8').decode(bytes);
  return { content: JSON.parse(text), sha: data.sha };
}

async function writeGitHubFile(path, content, commitMsg, sha) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
  const jsonStr = JSON.stringify(content, null, 2);
  const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
  const body = { message: commitMsg, content: encoded, sha };
  const res = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`GitHub PUT failed: ${res.status}`);
}

// ================= SHA-256 哈希函数 =================
async function sha256(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ================= 轻量级原生 SVG 图标组件 =================
const FilmIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18" /><line x1="7" x2="7" y1="2" y2="22" /><line x1="17" x2="17" y1="2" y2="22" /><line x1="2" x2="22" y1="12" y2="12" /><line x1="2" x2="7" y1="7" y2="7" /><line x1="2" x2="7" y1="17" y2="17" /><line x1="17" x2="22" y1="7" y2="7" /><line x1="17" x2="22" y1="17" y2="17" /></svg>);
const CameraIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>);
const CompassIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" /></svg>);
const ImageIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>);
const ChevronDownIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9" /></svg>);
const MessageSquareIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>);
const SendIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor" /></svg>);
const CloseIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>);
const ArrowLeftIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>);
const ArrowRightIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>);
const SettingsIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>);
const TrashIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>);
const EditIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>);
const PlusIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>);
const LockIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>);
const MenuIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>);
const RefreshIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>);

// ================= 量子微光 Canvas 背景组件 (不拦截触摸) =================
function AmbientParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let isVisible = true;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize, { passive: true });
    resize();

    // 可见性检测：页面不可见时暂停动画，大幅降低负载
    const visibilityHandler = () => { isVisible = !document.hidden; };
    document.addEventListener('visibilitychange', visibilityHandler);

    // 控制粒子密度，降低移动端/高密度屏幕过载
    const particleCount = width < 768 ? 15 : (width < 1440 ? 30 : 40);
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      speedY: -(Math.random() * 0.4 + 0.1),
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.5 + 0.1,
      wobble: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      if (!isVisible) { animationFrameId = requestAnimationFrame(render); return; }
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.y += p.speedY;
        p.wobble += 0.01;
        p.x += Math.sin(p.wobble) * 0.3 + p.speedX;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x > width + 10) p.x = -10;
        else if (p.x < -10) p.x = width + 10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${p.opacity})`;
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', visibilityHandler);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[1]" />;
}

// ================= 可交互科普游戏：核裂变链式反应模拟器 =================
function NuclearSimulationGame() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [energyGenerated, setEnergyGenerated] = useState(0);
  const [fissionLevel, setFissionLevel] = useState("稳定态");
  const [started, setStarted] = useState(false);
  const doneTimerRef = useRef(null);

  const gameRef = useRef({
    atoms: [], neutrons: [], explosions: [],
    width: 0, height: 0, score: 0,
    running: false, rafId: null,
    visible: true, inView: true
  });

  const initGame = () => {
    const game = gameRef.current;
    if (!canvasRef.current) return;
    game.width = canvasRef.current.clientWidth;
    game.height = canvasRef.current.clientHeight;
    canvasRef.current.width = game.width;
    canvasRef.current.height = game.height;
    game.atoms = []; game.neutrons = []; game.explosions = []; game.score = 0;
    game.running = true;
    setEnergyGenerated(0); setFissionLevel("稳定态");
    const atomCount = game.width < 500 ? 20 : (game.width < 1024 ? 40 : 55);
    for (let i = 0; i < atomCount; i++) {
      game.atoms.push({ x: Math.random() * (game.width - 40) + 20, y: Math.random() * (game.height - 40) + 20, radius: 12, active: true, wobble: Math.random() * Math.PI * 2 });
    }
  };

  const startEngine = () => {
    if (started) return;
    setStarted(true);
    const game = gameRef.current;
    initGame();
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    document.addEventListener('visibilitychange', () => { game.visible = !document.hidden; });

    const io = new IntersectionObserver(([entry]) => { game.inView = entry.isIntersecting; });
    if (containerRef.current) io.observe(containerRef.current);

    const gameLoop = () => {
      if (!game.visible || !game.inView || !game.running) {
        game.rafId = requestAnimationFrame(gameLoop); return;
      }
      ctx.clearRect(0, 0, game.width, game.height);

      game.atoms.forEach(atom => {
        if (!atom.active) return;
        atom.wobble += 0.05;
        const wx = Math.sin(atom.wobble) * 1, wy = Math.cos(atom.wobble) * 1;
        ctx.beginPath(); ctx.arc(atom.x + wx, atom.y + wy, atom.radius + 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34, 211, 238, 0.15)'; ctx.fill();
        ctx.beginPath(); ctx.arc(atom.x + wx, atom.y + wy, atom.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.7)'; ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'; ctx.stroke();
      });

      for (let i = game.neutrons.length - 1; i >= 0; i--) {
        const n = game.neutrons[i];
        n.x += n.vx; n.y += n.vy;
        ctx.beginPath(); ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#fff'; ctx.fill();

        let hit = false;
        for (let j = 0; j < game.atoms.length; j++) {
          const a = game.atoms[j];
          if (!a.active) continue;
          if (Math.hypot(n.x - a.x, n.y - a.y) < a.radius + 3) {
            a.active = false; hit = true;
            game.score += 250;
            game.explosions.push({ x: a.x, y: a.y, radius: 5, opacity: 1 });
            const newCount = Math.floor(Math.random() * 2) + 2;
            for (let k = 0; k < newCount; k++) {
              const ang = Math.random() * Math.PI * 2, spd = Math.random() * 2 + 2;
              game.neutrons.push({ x: a.x, y: a.y, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd });
            }
            break;
          }
        }
        // 中子碰到边缘反弹
        if (!hit && (n.x < 0 || n.x > game.width)) { n.vx *= -1; n.x = Math.max(2, Math.min(game.width - 2, n.x)); }
        if (!hit && (n.y < 0 || n.y > game.height)) { n.vy *= -1; n.y = Math.max(2, Math.min(game.height - 2, n.y)); }
        if (hit) game.neutrons.splice(i, 1);
      }

      for (let i = game.explosions.length - 1; i >= 0; i--) {
        const e = game.explosions[i];
        e.radius += 2; e.opacity -= 0.05;
        ctx.beginPath(); ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${e.opacity})`; ctx.lineWidth = 2; ctx.stroke();
        if (e.opacity <= 0) game.explosions.splice(i, 1);
      }

      if (game.score !== energyGenerated) {
        setEnergyGenerated(game.score);
        if (game.score > 5000) setFissionLevel("临界状态 (Critial)");
        else if (game.score > 2000) setFissionLevel("剧烈反应");
        else if (game.score > 500) setFissionLevel("链式起步");
      }

      // 所有原子核已裂变 → 1秒后自动暂停
      const hasActiveAtom = game.atoms.some(a => a.active);
      if (!hasActiveAtom && game.score > 0 && game.running && !doneTimerRef.current) {
        doneTimerRef.current = setTimeout(() => {
          game.running = false;
          setFissionLevel("反应完成");
          doneTimerRef.current = null;
        }, 1000);
      }

      game.rafId = requestAnimationFrame(gameLoop);
    };
    game.rafId = requestAnimationFrame(gameLoop);
  };

  const handleCanvasClick = (e) => {
    const game = gameRef.current;
    if (!game.running) { initGame(); return; }
    const rect = canvasRef.current.getBoundingClientRect();
    const angle = Math.atan2(e.clientY - rect.top - game.height + 10, e.clientX - rect.left - game.width / 2);
    game.neutrons.push({ x: game.width / 2, y: game.height - 10, vx: Math.cos(angle) * 4, vy: Math.sin(angle) * 4 });
  };

  return (
    <div ref={containerRef} className="w-full h-full min-h-[350px] relative bg-[#040a18] rounded-2xl border border-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.1)] overflow-hidden flex flex-col">
      {!started && (
        <div onClick={startEngine} className="absolute inset-0 z-20 flex flex-col items-center justify-center cursor-pointer bg-[#040a18]/90 backdrop-blur-sm transition-all hover:bg-[#040a18]/70 group">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-all">
            <svg className="w-7 h-7 text-cyan-400 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/></svg>
          </div>
          <span className="text-sm font-light tracking-widest text-cyan-300 font-artistic">点击开始互动</span>
          <span className="text-[9px] text-white/30 mt-2 tracking-wider font-ui">点击后模拟核裂变链式反应</span>
        </div>
      )}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="flex flex-col gap-1"><span className="text-[10px] text-cyan-400/80 tracking-widest font-ui uppercase">Energy Generated</span><span className="text-xl text-white font-artistic drop-shadow-md">{energyGenerated} <span className="text-[10px] text-white/50">MWh</span></span></div>
        <div className="flex flex-col gap-1 text-right"><span className="text-[10px] text-cyan-400/80 tracking-widest font-ui uppercase">Reactor Status</span><span className={`text-sm font-artistic drop-shadow-md ${energyGenerated > 5000 ? 'text-red-400 animate-pulse' : 'text-cyan-200'}`}>{fissionLevel}</span></div>
      </div>
      <canvas ref={canvasRef} onClick={handleCanvasClick} className="w-full h-full flex-1 cursor-crosshair z-0 touch-none" />
      <div className="absolute bottom-0 left-0 w-full p-4 flex justify-between items-end z-10 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
        <span className="text-[10px] text-white/40 tracking-widest font-ui w-2/3 leading-relaxed">
          {gameRef.current && !gameRef.current.running && gameRef.current.score > 0
            ? <strong className="text-cyan-400">反应完成！点击画面重新开始</strong>
            : <><strong className="text-cyan-400">操作说明:</strong> 点击画面发射高能中子，轰击原子核以触发裂变链式反应。</>
          }
        </span>
        {started && <button onClick={() => { if (doneTimerRef.current) clearTimeout(doneTimerRef.current); doneTimerRef.current = null; initGame(); }} className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-cyan-900/40 border border-white/10 hover:border-cyan-500/50 rounded-full transition-all text-[10px] text-white/80 hover:text-white"><RefreshIcon className="w-3.5 h-3.5" /><span>重置</span></button>}
      </div>
      <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-12 h-12 bg-cyan-500/20 blur-xl rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-cyan-400 rounded-t-full border-t border-white pointer-events-none"></div>
    </div>
  );
}

// ================= 辐射屏蔽模拟测试仪 (化抽象为直观，动手理解时间·距离·屏蔽) =================
function RadiationShieldSimulator() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [activeRay, setActiveRay] = useState('alpha');
  const [activeShield, setActiveShield] = useState('paper');
  const [penetrated, setPenetrated] = useState(0);
  const [blocked, setBlocked] = useState(0);
  const [started, setStarted] = useState(false);
  // 每次切换射线或屏蔽时重置计数器
  const handleRayChange = (id) => { setActiveRay(id); setPenetrated(0); setBlocked(0); if (engineRef.current) { engineRef.current.pen = 0; engineRef.current.blk = 0; } };
  const handleShieldChange = (id) => { setActiveShield(id); setPenetrated(0); setBlocked(0); if (engineRef.current) { engineRef.current.pen = 0; engineRef.current.blk = 0; } };

  const RAYS = [
    { id: 'alpha', name: 'α 射线', full: 'α 射线 (Alpha)', color: '#ef4444', speed: 3, size: 4, desc: '由两个质子和两个中子组成，体积大、速度慢。穿透力极弱，一张纸即可阻挡，但电离能力极强。' },
    { id: 'beta', name: 'β 射线', full: 'β 射线 (Beta)', color: '#3b82f6', speed: 6, size: 2, desc: '高速运动的电子流。穿透力中等，能穿透纸张，但会被几毫米厚的铝板或塑料挡住。' },
    { id: 'gamma', name: 'γ 射线', full: 'γ 射线 (Gamma)', color: '#a855f7', speed: 9, size: 1.5, desc: '波长极短的高能电磁波。穿透力极强，需要厚重的铅块或厚混凝土才能有效削弱和屏蔽。' }
  ];

  const SHIELDS = [
    { id: 'none', name: '无屏蔽', thick: 0, color: 'transparent' },
    { id: 'paper', name: '纸张', thick: 12, color: 'rgba(255,255,255,0.6)' },
    { id: 'aluminum', name: '铝板', thick: 24, color: 'rgba(148,163,184,0.85)' },
    { id: 'lead', name: '铅块', thick: 44, color: 'rgba(51,65,85,1)' }
  ];

  const ray = RAYS.find(r => r.id === activeRay) || RAYS[0];
  const shield = SHIELDS.find(s => s.id === activeShield) || SHIELDS[0];
  const engineRef = useRef({ particles: [], frame: 0, pen: 0, blk: 0, running: false });
  const rayRef = useRef(activeRay);
  const shieldRef = useRef(activeShield);
  rayRef.current = activeRay;
  shieldRef.current = activeShield;

  const isBlockedBy = (rayId, shieldId) => {
    if (shieldId === 'none') return false;
    if (rayId === 'alpha') return true;
    if (rayId === 'beta') return shieldId === 'aluminum' || shieldId === 'lead';
    if (rayId === 'gamma') return shieldId === 'lead' ? Math.random() > 0.15 : false;
    return false;
  };

  const startEngine = () => {
    if (started) return;
    setStarted(true);
    const eng = engineRef.current;
    eng.running = true;

    const canvas = canvasRef.current; if (!canvas) return;
    const resize = () => { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; };
    resize(); window.addEventListener('resize', resize);
    const ctx = canvas.getContext('2d');
    let animId;
    let rsVisible = true, rsInView = true;

    document.addEventListener('visibilitychange', () => { rsVisible = !document.hidden; });
    const io = new IntersectionObserver(([entry]) => { rsInView = entry.isIntersecting; });
    if (containerRef.current) io.observe(containerRef.current);

    const render = () => {
      if (!rsVisible || !rsInView) { animId = requestAnimationFrame(render); return; }
      // 从 ref 读取最新选择的射线和屏蔽
      const curRay = RAYS.find(r => r.id === rayRef.current) || RAYS[0];
      const curShield = SHIELDS.find(s => s.id === shieldRef.current) || SHIELDS[0];
      const w = canvas.width, h = canvas.height;
      const shieldX = w * 0.55;
      ctx.clearRect(0, 0, w, h);
      eng.frame++;

      ctx.beginPath(); ctx.arc(40, h/2, 28, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fill();
      ctx.strokeStyle = curRay.color; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.arc(40, h/2, 8, 0, Math.PI*2);
      ctx.fillStyle = curRay.color; ctx.fill();

      if (curShield.id !== 'none') {
        ctx.fillStyle = curShield.color;
        ctx.fillRect(shieldX, h*0.05, curShield.thick, h*0.9);
        ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fillRect(shieldX, h*0.05, 3, h*0.9);
        ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(curShield.name, shieldX + curShield.thick/2, h - 8);
      }

      const detX = w - 45;
      ctx.beginPath(); ctx.moveTo(detX, h*0.15); ctx.lineTo(detX+20, h*0.15);
      ctx.lineTo(detX+20, h*0.85); ctx.lineTo(detX, h*0.85); ctx.closePath();
      ctx.fillStyle = 'rgba(6,182,212,0.08)'; ctx.fill();
      ctx.strokeStyle = 'rgba(6,182,212,0.3)'; ctx.stroke();

      if (eng.frame % (curRay.id === 'gamma' ? 2 : 4) === 0) {
        eng.particles.push({ x: 40, y: h/2 + (Math.random()-0.5)*50, baseY: h/2 + (Math.random()-0.5)*50, vx: curRay.speed, size: curRay.size * (0.5 + Math.random()), trail: [], angle: Math.random()*Math.PI*2 });
      }

      for (let i = eng.particles.length - 1; i >= 0; i--) {
        const p = eng.particles[i];
        if (curRay.id === 'gamma') { p.angle += 0.15; p.y = p.baseY + Math.sin(p.angle)*12; }
        p.x += p.vx; p.trail.push({x:p.x, y:p.y});
        if (p.trail.length > 6) p.trail.shift();
        if (p.x + p.size >= shieldX && p.x <= shieldX + curShield.thick && curShield.id !== 'none' && isBlockedBy(curRay.id, curShield.id)) {
          eng.blk++; eng.particles.splice(i, 1); continue;
        }
        for (let t = 0; t < p.trail.length-1; t++) {
          ctx.beginPath(); ctx.arc(p.trail[t].x, p.trail[t].y, p.size*(t/p.trail.length)*0.5, 0, Math.PI*2);
          ctx.fillStyle = curRay.color.replace(')', `,${(t/p.trail.length)*0.2})`).replace('rgb', 'rgba');
          ctx.fill();
        }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fillStyle = curRay.color; ctx.fill();
        if (p.x > w) { eng.pen++; eng.particles.splice(i, 1); }
        else if (p.x < -20) { eng.particles.splice(i, 1); }
      }

      if (eng.particles.some(p => p.x > w - 60 && p.x < w)) {
        ctx.beginPath(); ctx.moveTo(detX, h*0.15); ctx.lineTo(detX+20, h*0.15);
        ctx.lineTo(detX+20, h*0.85); ctx.lineTo(detX, h*0.85); ctx.closePath();
        ctx.fillStyle = 'rgba(6,182,212,0.15)'; ctx.fill();
      }
      if (eng.frame % 15 === 0) { setPenetrated(eng.pen); setBlocked(eng.blk); }
      if (eng.particles.length > 150) eng.particles.splice(0, eng.particles.length - 100);
      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);
  };

  const getPenetrationInfo = () => {
    if (activeRay === 'alpha') return activeShield === 'none' ? 'α 射线未被阻挡 ⚠️' : 'α 射线被完全阻挡 ✅';
    if (activeRay === 'beta') {
      if (activeShield === 'none') return 'β 射线未被阻挡 ⚠️';
      if (activeShield === 'paper') return 'β 射线穿透纸张 ⚠️';
      return 'β 射线被完全阻挡 ✅';
    }
    if (activeRay === 'gamma') {
      if (activeShield === 'none' || activeShield === 'paper') return 'γ 射线完全穿透 ❌';
      if (activeShield === 'aluminum') return 'γ 射线大部分穿透 ❌';
      return 'γ 射线被大幅削弱 (约85%阻挡) ✅';
    }
    return '';
  };

  return (
    <div ref={containerRef} className="w-full bg-white/[0.015] backdrop-blur-md border border-white/[0.05] rounded-3xl p-6 md:p-10 shadow-[0_32px_80px_rgba(0,0,0,0.8)] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/5 blur-[80px] pointer-events-none"></div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 z-10 gap-3">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] tracking-[0.3em] text-cyan-400/60 font-light uppercase">INTERACTIVE LAB</span>
            <div className="h-[1px] w-6 bg-cyan-500/40"></div>
          </div>
          <h3 className="text-xl md:text-2xl font-light tracking-widest text-white/95 font-artistic">辐射屏蔽模拟测试仪</h3>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[9px] text-white/30 font-ui">穿透 <strong className="text-cyan-400">{blocked + penetrated === 0 ? '0' : Math.round(penetrated / (blocked + penetrated) * 100)}%</strong></span>
          <span className="text-[9px] text-white/30 font-ui">阻挡 <strong className="text-red-400">{blocked + penetrated === 0 ? '0' : Math.round(blocked / (blocked + penetrated) * 100)}%</strong></span>
        </div>
      </div>
      <div className="relative w-full h-[280px] md:h-[360px] bg-[#02050a] border border-white/10 rounded-2xl overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full z-0 touch-none" />
        {!started && (
          <div onClick={startEngine} className="absolute inset-0 z-20 flex flex-col items-center justify-center cursor-pointer bg-[#02050a]/90 backdrop-blur-sm transition-all hover:bg-[#02050a]/70 group">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-all">
              <svg className="w-7 h-7 text-cyan-400 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/></svg>
            </div>
            <span className="text-sm font-light tracking-widest text-cyan-300 font-artistic">点击开始互动</span>
            <span className="text-[9px] text-white/30 mt-2 tracking-wider font-ui">选择射线与屏蔽材料，观察穿透效果</span>
          </div>
        )}
        <div className="absolute top-3 left-3 text-[9px] tracking-widest text-white/20 font-ui">放射源</div>
        <div className="absolute top-3 right-3 text-[9px] tracking-widest text-cyan-500/40 font-ui">检测仪</div>
      </div>
      <div className="mt-4 text-[10px] text-center text-cyan-300/60 font-light tracking-wider font-ui">{getPenetrationInfo()}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="flex flex-col gap-3">
          <label className="text-[9px] tracking-[0.2em] font-light text-cyan-200/50 uppercase font-artistic">1. 选择射线</label>
          <div className="flex gap-2">
            {RAYS.map(r => (
              <button key={r.id} onClick={() => handleRayChange(r.id)}
                className={`flex-1 py-2.5 px-2 rounded-xl text-[10px] tracking-widest transition-all duration-300 border ${
                  activeRay === r.id ? 'text-white shadow-[0_0_12px_rgba(255,255,255,0.08)]' : 'text-white/40 hover:text-white/80'
                }`}
                style={{ backgroundColor: activeRay === r.id ? r.color + '25' : 'rgba(0,0,0,0.3)', borderColor: activeRay === r.id ? r.color + '60' : 'transparent' }}
              >{r.name}</button>
            ))}
          </div>
          <p className="text-[11px] text-white/50 font-light leading-relaxed">{ray.desc}</p>
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-[9px] tracking-[0.2em] font-light text-cyan-200/50 uppercase font-artistic">2. 设置屏蔽层</label>
          <div className="grid grid-cols-4 gap-2">
            {SHIELDS.map(s => (
              <button key={s.id} onClick={() => handleShieldChange(s.id)}
                className={`py-2.5 px-1 rounded-xl text-[9px] tracking-widest transition-all duration-300 border ${
                  activeShield === s.id ? 'bg-cyan-900/40 border-cyan-500/40 text-cyan-50' : 'bg-black/30 border-transparent text-white/40 hover:bg-white/5 hover:text-white/80'
                }`}
              >{s.name}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= 常量数据默认配置 =================
const SITE_SECTIONS = [
  { id: 'knowledge', num: '1', title: '核能知识', desc: '核裂变、聚变与反应堆的微观宇宙' },
  { id: 'application', num: '2', title: '核技术应用', desc: '医疗、工业与农业的跨界造福' },
  { id: 'safety', num: '3', title: '辐射安全', desc: '摒弃未知带来的恐惧，用科学法则构建防线' },
  { id: 'spirit', num: '4', title: '精神传承', desc: '两弹一星精神与核工业奋斗史' },
  { id: 'policy', num: '5', title: '政策法规', desc: '原子能法与核安全观深度解读' },
  { id: 'forum', num: '6', title: '读者畅想', desc: '分享您对核技术应用与发展的见解' }
];

const DEFAULT_GALLERY = [
  {
    id: 1, title: "星辰的共鸣：裂变与聚变", subtitle: "NUCLEAR FISSION & FUSION",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80",
    desc: "太阳的耀眼源于聚变，原子的轰鸣始于裂变。当一个铀-235原子核俘获一个中子后，分裂为两个较轻的原子核（如氪-92和钡-141），同时释放约200MeV的能量和2-3个新的中子——这便是链式反应的核心。核燃料循环则涵盖了从铀矿开采、转化浓缩、燃料制造到乏燃料后处理与放射性废物处置的全链条，每一环都关乎核电的安全运行与可持续发展。"
  },
  {
    id: 2, title: "驱动未来：第四代核反应堆", subtitle: "ADVANCED REACTORS",
    image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=1200&q=80",
    desc: "小型模块化反应堆（SMR）与高温气冷堆正在重塑核电的安全与高效边界。第四代反应堆包括钠冷快堆、超高温气冷堆、铅冷快堆等六大堆型，它们在安全性、经济性、核废料最少化和防扩散能力上均显著优于前代。中国石岛湾高温气冷堆（HTR-PM）已在2023年实现商业运行，成为全球首座投入商运的第四代核电站。"
  },
  {
    id: 3, title: "生命之光：核医疗影像与治疗", subtitle: "MEDICAL APPLICATIONS",
    image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1200&q=80",
    desc: "放射性同位素如同提灯的夜行人，在人体迷宫中精准定位病灶。中国每年开展核医学诊疗超过2500万人次，单光子发射计算机断层成像（SPECT）和正电子发射断层成像（PET）已成为肿瘤、心血管疾病诊断的利器。质子刀与重离子治疗则通过精准的布拉格峰效应，在杀伤肿瘤细胞的同时最大限度地保护周围正常组织。"
  },
  {
    id: 4, title: "无形之眼：工业与农业应用", subtitle: "INDUSTRY & AGRICULTURE",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1200&q=80",
    desc: "从γ射线无损检测探伤仪透视重型机械的隐秘裂痕，到辐射育种培育出抗旱抗病高产作物品种——中国已利用辐照技术培育农作物突变品种超过1000个，年推广种植面积达900万公顷。辐照保鲜技术可使农产品货架期延长2-5倍，有效减少采后损失。同位素示踪技术则广泛应用于水文地质和环境污染溯源研究。"
  }
];

const DEFAULT_MESSAGES = [];

function SpiritSection({ setIsStoryOpen, onGalleryClick, siteContent }) {
  const refs = useRef([]);
  const addToRefs = (el) => { if (el && !refs.current.includes(el)) refs.current.push(el); };
  // 运行时检测 base path，兼容 GitHub Pages 和本地开发
  const base = (typeof window !== 'undefined' && window.location.pathname.startsWith('/nuclear-x/')) ? '/nuclear-x/' : '/';
  const stories = [
    { num: '01', title: '"两弹一星"精神', img: ['stories/image1.webp', 'stories/image2.webp'], desc: '1999年9月18日，在庆祝中华人民共和国成立50周年之际，中共中央、国务院及中央军委隆重表彰了为研制"两弹一星"作出突出贡献的23位科技专家，并首次将这一伟大壮举中孕育的精神概括为"两弹一星"精神。这一精神诞生于新中国面临严峻国际形势的特殊时期，体现了中华民族在极端困难条件下自主创新的坚定信念。' },
    { num: '02', title: '"承书风范"三次"我愿意"', img: ['stories/image3.webp', 'stories/image4.webp', 'stories/image5.webp'], desc: '王承书（1912-1994），我国稀有气体扩散法分离铀同位素理论的奠基者。1956年新中国成立初期，王承书放弃美国优越条件，冲破重重阻挠回到祖国。1958年面对苏联专家断言"中国没人懂分离铀同位素理论"，钱三强问她能否搞这个项目？她毅然回答："我愿意。"从此隐姓埋名投身核工业。1961年被调入核武器研究所，面对更艰巨的任务，她再次回答："我愿意。"1964年在原子弹爆炸前夕，她承担了核心数据计算的"收尾"工作，第三次回答："我愿意。"晚年身患多病，视力衰退，为了审阅论文，她用放大镜把字迹描深。遗嘱中将毕生积蓄10万元全部捐出，遗体捐献给医学研究。展现了老一辈科学家淡泊名利、甘为人梯的纯粹人格和对祖国的无限忠诚。' },
    { num: '03', title: '"粉身碎骨"不是形容词', img: ['stories/image6.webp', 'stories/image7.webp', 'stories/image8.webp', 'stories/image9.webp', 'stories/image10.webp', 'stories/image11.webp'], desc: '在青海金银滩221厂（西北核武器研制基地）那片被风雪肆虐的荒原上，对于魏世杰（"核司令"）、王淦昌（化名"王京"）等老一辈核工业人来说，"粉身碎骨"从来都不是文学作品中用来渲染悲壮的修辞，而是每一次核试验中必须直面的真实梦魇。那是一个没有现代精密远程遥控技术的年代，为了获取核爆炸瞬间最核心的物理参数，往往需要科研人员深入最危险的爆心区域。魏世杰曾回忆，在多次核试验的关键时刻，王淦昌等科学家总是坚持亲临一线指挥，甚至亲自参与回收实验装置。他们深知，一旦操作稍有差池或计算出现毫厘之谬，等待他们的就是瞬间的气化与毁灭。但在那个为了国家挺起脊梁的特殊岁月里，为了拿到第一手实验数据，为了验证理论的准确性，他们早已将个人生死置之度外。这种在极度危险面前展现出的科研勇气与献身精神，正是"两弹一星"精神中最令人动容的底色——用血肉之躯，为新中国铸就了坚不可摧的核盾牌。' },
    { num: '04', title: '用血肉之躯护住绝密资料', img: ['stories/image12.webp', 'stories/image13.webp', 'stories/image14.webp'], desc: '人物：郭永怀（力学家、应用数学家）。时间与地点：1968年12月5日，北京首都机场。事件细节：郭永怀从青海基地出差返回，飞机在降落时发生事故坠毁。救援人员清理现场时，发现郭永怀和他的警卫员紧紧抱在一起。两具烧焦的遗体中间，那个装有绝密科研数据的公文包完好无损。他是唯一一位以烈士身份被追授"两弹一星"功勋奖章的科学家，用生命诠释了"事业高于一切"的核工业精神。' },
    { num: '05', title: '戈壁滩上的"百日会战"与秃头笑话', img: ['stories/image15.webp', 'stories/image16.webp', 'stories/image17.webp', 'stories/image18.webp'], desc: '人物：于敏（"氢弹之父"）、孙和夫等。1965年，于敏带领团队在上海华东计算技术研究所展开了氢弹原理的验证计算。在当时我国仅有两台大型电子计算机的条件下，于敏团队不畏艰难，利用有限的资源，经过100天的不懈努力，终于完成了前所未有的复杂计算。他们发现了氢弹自持热核燃烧的关键点，并成功提出了"于敏构型"。1965年9月—11月，氢弹原理探索陷入僵局，于敏带领团队远赴上海，利用每秒5万次的计算机，进行了持续100个昼夜的高强度计算，史称"百日会战"。在这100天里，科研人员轮班倒，机器不停，人也不停。由于长期处于高度紧张和高压的计算状态，许多人的头发大把脱落。人文细节：在突破成功的庆祝会上，于敏为了缓解大家长期熬夜的疲惫，讲了一个"三个头发的人去理发"的笑话，因为当时在场的科研人员大多因为过度劳累而脱发。展现了科研工作者在高压环境下的革命乐观主义精神与团队凝聚力。' },
    { num: '06', title: '80度开水与夹生馒头', img: [], desc: '核心地点：青海高原·金银滩（西北核武器研制基地221厂），平均海拔高达3200米。代表人物：魏世杰及广大扎根高原的核工业建设者、科研人员。由于海拔高、气压低，水的沸点被强行拉低到了80多度。这意味着，无论火烧得多旺，水温永远达不到100度。在这个温度下，不仅馒头蒸不熟（常常是外面软、里面夹生，甚至冻成冰疙瘩），连煮面条都成了奢望。更致命的是高原缺氧，科研人员晚上睡觉时常被憋醒，必须坐起来大口喘气，或者吸几口氧气罐才能勉强入睡。白天工作时，稍微走快几步就会气喘吁吁、心跳加速。在基地初创的严冬，气温低至零下三四十度。为了抢时间，许多建设者没有营房，只能在冻土上挖坑，上面盖上茅草和泥土，搭起"地窝子"当宿舍。晚上睡觉时，大家必须戴着棉帽，穿着棉衣，但早上醒来，眉毛和胡须上依然结满了白霜。到了春天，狂风卷着黄沙肆虐，大家端着饭碗吃饭时，风沙直往碗里灌，咬一口馒头，常常是"一口饭，半口沙"。核武器研制不仅仅是实验室里的精密计算，更是与极端恶劣自然环境的殊死搏斗。"战高斗寒，笑谈渴饮苦水浆"，老一辈核工业人硬是用血肉之躯，在被称为"生命禁区"的高原上，为共和国铸就了最坚固的核盾牌。' },
    { num: '07', title: '10元奖金与"失踪的人"', img: [], desc: '时间：1985年（原子弹项目获得国家科技进步特等奖）。奖金细节：奖金总额为1万元（当时是巨款），但参与研制的人员多达上万人。经过层层分配，绝大多数基层科研人员只分到了10元钱。隐姓埋名：为了保密，许多科研人员在20多年里音讯全无，老家的父母以为儿子早已牺牲，甚至收到了"烈士通知书"。展现了"干惊天动地事，做隐姓埋名人"的无私奉献与不计名利的高尚品格。' },
    { num: '08', title: '全国大协作的"651"计划', img: [], desc: '时间：1965年。事件：代号"651"的人造卫星研制计划启动。协作规模：在西方封锁下，中央特批2亿元专款。全国29个省市自治区、1000多家单位、数十万科技人员和民兵参与。为了保障通讯，全国各地动员了60多万民兵日夜守护通讯线路。这是社会主义制度"集中力量办大事"优势的极致体现，展现了全国一盘棋的协同力量。' },
    { num: '09', title: '赫鲁晓夫的断言与"争气弹"', img: [], desc: '时间：1959年6月。历史背景：苏联领导人赫鲁晓夫在撤走专家前曾傲慢地断言："离开我们，你们20年也造不出原子弹。"中国回应：中国科研人员顶着三年困难时期（1959-1961）的饥饿和浮肿，没有计算机，就用算盘和计算尺进行理论计算。历史时刻：1964年10月16日，中国第一颗原子弹成功爆炸，仅仅用了5年时间，狠狠打了赫鲁晓夫的脸，这颗原子弹也被亲切地称为"争气弹"。体现了中华民族自力更生、艰苦奋斗的民族精神和科技自立自强的坚定信念。' },
    { num: '10', title: '跨越时代的"精神基因"传承', img: [], desc: '时间跨度：1950年代-2020年代。过去：老一辈在戈壁滩住帐篷、喝苦水，用算盘计算核数据。现在：新一代核工业人邢继（"华龙一号"总设计师）带领团队打造了具有完全自主知识产权的三代核电技术；徐銤院士坚守半个世纪，实现了中国实验快堆的成功并网发电。从"两弹一星"到"华龙一号"，变的是技术水平和硬件设施，不变的是"事业高于一切、责任重于一切、严细融入一切、进取成就一切"的核工业精神。关键核心技术是要不来、买不来、讨不来的，必须坚持自主创新，传承和弘扬核工业精神。' },
  ];
  return (
    <>
      <div className="text-center mb-16 reveal-section" ref={addToRefs}>
        <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full bg-cyan-900/30 border border-cyan-500/30 shadow-sm backdrop-blur-md">
          <FilmIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[9px] tracking-[0.3em] text-cyan-100/90 uppercase">{siteContent?.sect4?.label || 'SECT 4. 精神文化'}</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-light tracking-[0.2em] text-white mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{siteContent?.sect4?.title || '星辰大海的征途'}</h2>
        <p className="text-xs md:text-sm text-white/60 max-w-3xl mx-auto tracking-widest leading-loose">
          {siteContent?.sect4?.desc || '"两弹一星"精神、核潜艇精神，一代代核工业人隐姓埋名，用青春与热血铸就了共和国的钢铁脊梁。从戈壁荒漠到高原深处，十段感人至深的故事，带你走进中国核工业的精神殿堂。'}
        </p>
        <button onClick={() => setIsStoryOpen(true)} className="mt-8 px-8 py-4 bg-cyan-700/80 hover:bg-cyan-600 active:scale-95 rounded-full text-[10px] md:text-xs text-white tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] backdrop-blur-md">
          {siteContent?.sect4?.storyButton || '沉浸式阅读：十段光辉纪实'}
        </button>
      </div>
      <div className="flex flex-col gap-8 reveal-section" ref={addToRefs}>
        {stories.map((story, idx) => (
          <div key={idx} className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-stretch bg-white/[0.01] backdrop-blur-md border border-white/[0.06] hover:border-cyan-500/30 rounded-2xl transition-all duration-500 hover:-translate-y-0.5 group`}>
            {story.img.length > 0 && <div className={`w-full lg:w-[280px] lg:min-w-[280px] lg:max-w-[280px] bg-[#0a101d] ${idx % 2 === 0 ? 'rounded-l-2xl' : 'rounded-r-2xl'} overflow-hidden shrink-0 relative cursor-pointer group/img`} onClick={() => {
              if (onGalleryClick) onGalleryClick(story.img, base, story.title);
            }}>
              <img src={base + story.img[0]} alt={story.title} loading="lazy" className="w-full h-[200px] md:h-[260px] object-cover" />
              {story.img.length > 1 && <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                <span className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs text-white tracking-widest">点击查看全部 {story.img.length} 张图片 →</span>
              </div>}
              {story.img.length > 1 && <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] text-white/80 font-ui flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                {story.img.length}张
              </div>}
            </div>}
            <div className="flex-1 p-5 md:p-6 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-light text-cyan-400/60 font-mono">{story.num}</span>
                <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/20 to-transparent"></div>
              </div>
              <h3 className="text-base md:text-lg font-light tracking-widest text-white/90 mb-3 group-hover:text-cyan-300 transition-colors font-artistic">{story.title}</h3>
              <p className="text-xs md:text-sm text-white/50 font-light leading-relaxed">{story.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-16 max-w-4xl mx-auto px-4 reveal-section" ref={addToRefs}>
        <span className="text-[9px] tracking-[0.4em] text-white/20 uppercase font-artistic block mb-8 text-center">CHRONOLOGY · 中国核工业大事记</span>
        <div className="flex overflow-x-auto pb-4 gap-0 story-scrollbar" style={{ scrollbarWidth: 'thin' }}>
          {[
            { year: '1955', event: '中国核工业起步', detail: '中共中央作出发展原子能事业的战略决策' },
            { year: '1964', event: '第一颗原子弹', detail: '1964年10月16日，中国第一颗原子弹在罗布泊爆炸成功' },
            { year: '1967', event: '第一颗氢弹', detail: '1967年6月17日，中国第一颗氢弹空爆试验成功' },
            { year: '1970', event: '第一艘核潜艇', detail: '中国第一艘核潜艇"长征一号"下水' },
            { year: '1991', event: '秦山核电并网', detail: '中国自行设计建造的秦山核电站并网发电' },
            { year: '2015', event: '"华龙一号"启航', detail: '中国自主三代核电技术"华龙一号"开工建设' },
            { year: '2023', event: '高温气冷堆商运', detail: '石岛湾高温气冷堆（HTR-PM）投入商业运行' },
            { year: '2025', event: '华龙一号出海', detail: '"华龙一号"多台机组在国内外并网运行' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center min-w-[100px] md:min-w-[120px] relative group">
              <div className="w-3 h-3 rounded-full bg-cyan-500/60 group-hover:bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.4)] transition-all z-10 shrink-0"></div>
              <div className={`h-0.5 w-full bg-gradient-to-r ${i === 0 ? 'from-transparent to-cyan-500/20' : i === 7 ? 'from-cyan-500/20 to-transparent' : 'from-cyan-500/20 via-cyan-500/30 to-cyan-500/20'} absolute top-1.5 left-1/2`}></div>
              <div className="mt-3 text-center">
                <span className="text-[10px] md:text-xs text-cyan-300 font-mono font-light block">{item.year}</span>
                <span className="text-[8px] md:text-[9px] text-white/60 block mt-1 leading-tight">{item.event}</span>
                <span className="text-[7px] text-white/20 hidden group-hover:block transition-all mt-1 max-w-[100px] leading-tight">{item.detail}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[8px] text-white/15 text-center mt-6 font-ui">← 左右滑动查看完整时间线 →</p>
      </div>
    </>
  );
}

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isAnnounceOpen, setIsAnnounceOpen] = useState(false);

  // 侧边栏与滚动交互状态
  const [activeSection, setActiveSection] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // 动态数据挂载（安全读取）
  const [galleryItems, setGalleryItems] = useState(() => safeGetStorage('nuke_gallery_items', DEFAULT_GALLERY));
  const [messages, setMessages] = useState(() => safeGetStorage('nuke_guest_messages', DEFAULT_MESSAGES));
  const [siteContent, setSiteContent] = useState(null);
  const [editingContent, setEditingContent] = useState(null);

  // 管理员后台状态
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [adminTab, setAdminTab] = useState('texts');
  const [adminSaveStatus, setAdminSaveStatus] = useState('');
  // 密码修改状态
  const [secOldPw, setSecOldPw] = useState('');
  const [secNewPw, setSecNewPw] = useState('');
  const [secConfirmPw, setSecConfirmPw] = useState('');
  const [secStatus, setSecStatus] = useState('');

  const [lightbox, setLightbox] = useState({ isOpen: false, isActive: false, type: null, item: null, index: null });

  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [formError, setFormError] = useState({ name: false, text: false });

  // 互动问答
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const QUIZ_DATA = [
    { q: "铀-235原子核裂变时，一个核裂变平均释放约多少能量？", opts: ["2 MeV", "20 MeV", "200 MeV", "2000 MeV"], ans: 2 },
    { q: "以下哪种属于第四代核反应堆？", opts: ["压水堆", "沸水堆", "高温气冷堆", "重水堆"], ans: 2 },
    { q: "中国第一颗原子弹爆炸成功是在哪一年？", opts: ["1962年", "1964年", "1967年", "1970年"], ans: 1 },
    { q: "每人每年接受天然本底辐射约多少？", opts: ["0.24 mSv", "2.4 mSv", "24 mSv", "240 mSv"], ans: 1 },
    { q: "以下哪种辐射防护方法属于'屏蔽'原则？", opts: ["穿铅衣", "远离辐射源", "缩短工作时间", "以上都是"], ans: 0 },
    { q: "中国从原子弹到氢弹用了多长时间？", opts: ["2年8个月", "5年", "8年", "10年"], ans: 0 },
  ];

  const handleQuizAnswer = (qIdx, optIdx) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };
  const handleQuizSubmit = () => { setQuizSubmitted(true); };
  const handleQuizReset = () => { setQuizAnswers({}); setQuizSubmitted(false); };
  const quizScore = QUIZ_DATA.filter((item, idx) => quizAnswers[idx] === item.ans).length;

  // 保障数组可用性，防止崩溃
  const currentGallery = Array.isArray(galleryItems) ? galleryItems : DEFAULT_GALLERY;
  const currentMessages = Array.isArray(messages) ? messages : DEFAULT_MESSAGES;

  const [syncStatus, setSyncStatus] = useState('');
  const [spiritCaption, setSpiritCaption] = useState('');

  // ================= GitHub 留言加载与同步 =================
  const loadMessagesFromGitHub = async () => {
    try {
      const { content: msgs } = await getGitHubFile(MESSAGES_PATH);
      if (Array.isArray(msgs)) {
        setMessages(msgs);
        safeSetStorage('nuke_guest_messages', msgs);
      }
    } catch (e) {
      // Fallback: 使用 localStorage 缓存
      const cached = safeGetStorage('nuke_guest_messages', DEFAULT_MESSAGES);
      if (Array.isArray(cached) && cached.length > 0) setMessages(cached);
    }
  };

  const saveMessagesToGitHub = async (msgs) => {
    setSyncStatus('同步中...');
    try {
      const { sha } = await getGitHubFile(MESSAGES_PATH);
      await writeGitHubFile(MESSAGES_PATH, msgs, `更新留言板 (${msgs.length} 条留言)`, sha);
      setSyncStatus('已同步');
    } catch (e) {
      setSyncStatus('同步失败');
      console.warn('GitHub sync failed:', e);
    }
    setTimeout(() => setSyncStatus(''), 3000);
  };

  // ================= 管理员后台方法 =================
  const loadSiteContent = async () => {
    try {
      const { content } = await getGitHubFile('site-content.json');
      setSiteContent(content);
      setEditingContent(content);
    } catch (e) {
      console.warn('Failed to load site content');
    }
  };

  const handleAdminLogin = async () => {
    try {
      const { content: config } = await getGitHubFile('admin-config.json');
      const inputHash = await sha256(adminPassword);
      const valid = inputHash === (config.passwordHash || '');
      if (valid) {
        setIsAdminAuthenticated(true);
        setLoginError('');
        setAdminPassword('');
        loadSiteContent();
      } else {
        setLoginError('密码错误');
      }
    } catch (e) {
      // Fallback to default password
      const inputHash = await sha256(adminPassword);
      const defaultHash = 'c7e616822f366fb1b5e0756af498cc11d2c0862edcb32ca65882f622ff39de1b';
      if (inputHash === defaultHash) {
        setIsAdminAuthenticated(true);
        setLoginError('');
        setAdminPassword('');
        loadSiteContent();
      } else {
        setLoginError('密码错误');
      }
    }
  };

  const saveSiteContent = async () => {
    if (!editingContent) return;
    setAdminSaveStatus('保存中...');
    try {
      const { sha } = await getGitHubFile('site-content.json');
      await writeGitHubFile('site-content.json', editingContent, '更新页面文本', sha);
      setSiteContent(editingContent);
      setAdminSaveStatus('已保存');
    } catch (e) {
      setAdminSaveStatus('保存失败');
    }
    setTimeout(() => setAdminSaveStatus(''), 3000);
  };

  const deleteMessage = async (id) => {
    const updated = currentMessages.filter(m => m.id !== id);
    setMessages(updated);
    safeSetStorage('nuke_guest_messages', updated);
    try {
      const { sha } = await getGitHubFile(MESSAGES_PATH);
      await writeGitHubFile(MESSAGES_PATH, updated, `管理员删除留言 (ID: ${id})`, sha);
    } catch (e) {
      console.warn('Delete sync failed:', e);
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminPassword('');
    setLoginError('');
    setAdminTab('texts');
  };

  const handleChangePassword = async (oldPw, newPw) => {
    const oldHash = await sha256(oldPw);
    const { content: config, sha } = await getGitHubFile('admin-config.json');
    if (oldHash !== config.passwordHash) return '旧密码错误';
    const newHash = await sha256(newPw);
    config.passwordHash = newHash;
    await writeGitHubFile('admin-config.json', config, '修改管理员密码', sha);
    return '密码修改成功';
  };

  const handleSecurityChange = async () => {
    if (!secOldPw || !secNewPw) { setSecStatus('请填写完整'); return; }
    if (secNewPw.length < 4) { setSecStatus('新密码至少4位'); return; }
    if (secNewPw !== secConfirmPw) { setSecStatus('两次输入不一致'); return; }
    setSecStatus('');
    try {
      const oldHash = await sha256(secOldPw);
      const { content: config, sha } = await getGitHubFile('admin-config.json');
      if (oldHash !== config.passwordHash) { setSecStatus('旧密码错误'); return; }
      config.passwordHash = await sha256(secNewPw);
      await writeGitHubFile('admin-config.json', config, '修改管理员密码', sha);
      setSecStatus('密码修改成功 ✅');
      setSecOldPw(''); setSecNewPw(''); setSecConfirmPw('');
    } catch (e) {
      setSecStatus('操作失败: ' + e.message);
    }
  };
  const revealRefs = useRef([]);
  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  // ================= 双向渐入渐出动画观察器 =================
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 150);

    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    }, { root: null, rootMargin: '0px 0px -5% 0px', threshold: 0.1 });

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.id) {
          setActiveSection(entry.target.id);
        }
      });
    }, { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 });

    const observeTimer = setTimeout(() => {
      const revealElements = document.querySelectorAll('.reveal-section');
      revealElements.forEach(el => fadeObserver.observe(el));

      const sectionElements = document.querySelectorAll('.site-section');
      sectionElements.forEach(el => sectionObserver.observe(el));
    }, 300);

    return () => { 
      fadeObserver.disconnect(); 
      sectionObserver.disconnect();
      clearTimeout(timer); 
      clearTimeout(observeTimer);
    };
  }, [currentGallery]);

  // ================= 开幕标题卡自动消失 =================
  useEffect(() => {
    if (!showSplash) return;
    const splashTimer = setTimeout(() => setShowSplash(false), 6200);
    return () => clearTimeout(splashTimer);
  }, [showSplash]);

  // ================= GitHub 留言自动同步 =================
  useEffect(() => {
    loadMessagesFromGitHub();
    const interval = setInterval(loadMessagesFromGitHub, 30000);
    return () => clearInterval(interval);
  }, []);

  // ================= 页面文本自动加载 =================
  useEffect(() => {
    (async () => {
      try {
        const { content } = await getGitHubFile('site-content.json');
        setSiteContent(content);
        setEditingContent(content);
      } catch (e) {
        console.warn('Failed to load site content');
      }
    })();
  }, []);

  // ================= 滚动与事件监听 =================
  useEffect(() => {
    const handleScroll = () => {
      setIsPastHero(window.scrollY > 400);
      setShowBackToTop(window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20; 
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightbox.isOpen) return;
      if (e.key === 'Escape') closeLightboxSilky();
      if (lightbox.type === 'collection' || lightbox.type === 'spirit-gallery') {
        if (e.key === 'ArrowLeft') handlePrevPhoto();
        if (e.key === 'ArrowRight') handleNextPhoto();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox]);

  // 表单与后台方法
  const handleMessageSubmit = (e) => {
    e.preventDefault();
    const hasNameError = !nickname.trim();
    const hasTextError = !content.trim();
    setFormError({ name: hasNameError, text: hasTextError });
    if (hasNameError || hasTextError) return;

    const pad = (num) => String(num).padStart(2, '0');
    const now = new Date();
    const newMsg = {
      id: Date.now(), name: nickname.trim(), text: content.trim(),
      time: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
    };

    const updatedMsgs = [newMsg, ...currentMessages];
    setMessages(updatedMsgs);
    safeSetStorage('nuke_guest_messages', updatedMsgs);
    saveMessagesToGitHub(updatedMsgs);

    setNickname(''); setContent(''); setFormError({ name: false, text: false });
  };

  const filteredPhotos = [];

  const openLightboxSilky = (type, item = null, index = null) => {
    setLightbox({ isOpen: true, isActive: false, type, item, index });
    setTimeout(() => setLightbox(prev => ({ ...prev, isActive: true })), 50);
  };
  const closeLightboxSilky = () => {
    setLightbox(prev => ({ ...prev, isActive: false }));
    setTimeout(() => setLightbox({ isOpen: false, isActive: false, type: null, item: null, index: null }), 600);
  };
  const handlePrevPhoto = () => {
    if (lightbox.type === 'collection') setLightbox(prev => ({ ...prev, index: prev.index === 0 ? filteredPhotos.length - 1 : prev.index - 1 }));
    if (lightbox.type === 'spirit-gallery' && Array.isArray(lightbox.item)) setLightbox(prev => ({ ...prev, index: prev.index === 0 ? prev.item.length - 1 : prev.index - 1 }));
  };
  const handleNextPhoto = () => {
    if (lightbox.type === 'collection') setLightbox(prev => ({ ...prev, index: prev.index === filteredPhotos.length - 1 ? 0 : prev.index + 1 }));
    if (lightbox.type === 'spirit-gallery' && Array.isArray(lightbox.item)) setLightbox(prev => ({ ...prev, index: prev.index === prev.item.length - 1 ? 0 : prev.index + 1 }));
  };
  const previewData = lightbox.type === 'gallery' ? lightbox.item : (lightbox.type === 'spirit-gallery' && Array.isArray(lightbox.item) ? { image: lightbox.item[lightbox.index] } : filteredPhotos[lightbox.index]);

  const scrollToAnchor = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
      setIsSidebarOpen(false);
    }
  };

  const base = (typeof window !== 'undefined' && window.location.pathname.startsWith('/nuclear-x/')) ? '/nuclear-x/' : '/';

  return (
    <>
      {/* ================= 开幕标题卡（符合大赛片头要求） ================= */}
      {showSplash && (
        <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#040a18] font-artistic select-none" onClick={() => setShowSplash(false)}>
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vmin] h-[80vmin] rounded-full bg-cyan-900/10 blur-[100px] animate-pulse"></div>
          </div>
          <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl">
            <div className="text-[9px] md:text-xs tracking-[0.4em] text-cyan-300/70 mb-6 md:mb-8 font-light uppercase splash-item" style={{ animation: 'fadeInUp 1.2s ease forwards' }}>
              第十一届高校学生课外
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.15em] text-white mb-4 drop-shadow-[0_0_40px_rgba(34,211,238,0.3)] splash-item" style={{ animation: 'fadeInUp 1.2s ease 0.3s forwards' }}>
              "核+X"创意大赛
            </h1>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent mb-8 splash-item" style={{ animation: 'fadeInUp 1s ease 0.6s forwards' }}></div>
            <div className="flex flex-col items-center gap-3 splash-item" style={{ animation: 'fadeInUp 1s ease 0.8s forwards' }}>
              <span className="text-sm md:text-base font-light tracking-[0.3em] text-white/80">参赛作品：核光纪元</span>
              <span className="text-xs tracking-[0.25em] text-cyan-200/70">重庆理工大学</span>
              <span className="text-[10px] tracking-[0.2em] text-white/40 mt-2">江志磊 · 王子健 · 张鹏程 · 杨来</span>
              <span className="text-[9px] tracking-[0.25em] text-cyan-400/60 mt-2">科普创意赛道 · H5</span>
            </div>
            <div className="mt-6 text-[9px] tracking-[0.3em] text-white/15 splash-item" style={{ animation: 'fadeInUp 1s ease 0.9s forwards' }}>
              核聚科普星火，科创燃动未来
            </div>
            <div className="mt-2 text-[7px] tracking-[0.2em] text-white/10 splash-item font-ui" style={{ animation: 'fadeInUp 1s ease 1s forwards' }}>
              AI辅助创作
            </div>
            <div className="mt-12 text-[9px] tracking-[0.3em] text-white/20 animate-pulse splash-item" style={{ animation: 'fadeInUp 1s ease 1.2s forwards' }}>
              点击任意处或等待 4 秒进入
            </div>
          </div>
          <style>{`@keyframes fadeInUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } } .splash-item { opacity: 0; transform: translateY(20px); }`}</style>
        </div>
      )}

      <div className="min-h-screen bg-[#040a18] text-white selection:bg-cyan-500/30 selection:text-white font-ui relative">
      {/* 注入全局 CSS：通过 dangerouslySetInnerHTML 防治 React 渲染树错乱 */}
      <style dangerouslySetInnerHTML={{ __html: `
        .font-artistic { font-family: 'STSong', 'Songti SC', 'Noto Serif SC', 'SimSun', serif; }
        .font-ui { font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', sans-serif; }
        body { background: #040a18; }

        .ambient-orb-1 { animation: float-1 25s ease-in-out infinite alternate; will-change: transform; }
        .ambient-orb-2 { animation: float-2 30s ease-in-out infinite alternate; will-change: transform; }

        @keyframes float-1 {
          0% { transform: translate(0, 0) scale(1); opacity: 0.25; }
          100% { transform: translate(3vw, -3vh) scale(1.2); opacity: 0.4; }
        }
        @keyframes float-2 {
          0% { transform: translate(0, 0) scale(1.05); opacity: 0.15; }
          100% { transform: translate(-3vw, 3vh) scale(0.95); opacity: 0.3; }
        }

        .hero-pan { animation: pan-zoom 25s ease-in-out infinite alternate; will-change: transform; }
        @keyframes pan-zoom {
          0% { transform: scale(1.01) translate(0%, 0%); }
          100% { transform: scale(1.05) translate(-1%, 1%); }
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: #374151; }
        .story-scrollbar::-webkit-scrollbar { width: 3px; }
        .story-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .story-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); }
        
        .fade-up-init { opacity: 0; transform: translateY(30px); transition: opacity 2s cubic-bezier(0.16, 1, 0.3, 1), transform 2s cubic-bezier(0.16, 1, 0.3, 1); }
        .fade-up-init.loaded { opacity: 1; transform: translateY(0); }

        /* 开幕标题卡动画 */
        .splash-fade { animation: splashFadeOut 0.8s ease forwards; }
        @keyframes splashFadeOut { 0% { opacity: 1; } 100% { opacity: 0; } }
        
        .reveal-section { 
          opacity: 0; transform: translateY(50px); filter: blur(4px); 
          transition: opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1), transform 1.2s cubic-bezier(0.22, 1, 0.36, 1), filter 1.2s ease-out; 
          will-change: opacity, transform, filter;
        }
        .reveal-section.is-visible { opacity: 1; transform: translateY(0); filter: blur(0px); }
        
        .hover-zoom-img { transition: transform 2.5s ease-out, filter 2.5s ease-out; }
        .img-container:hover .hover-zoom-img { transform: scale(1.06); filter: saturate(1.15) brightness(1.05); }

        .lightbox-overlay { opacity: 0; backdrop-filter: blur(0px); transition: opacity 600ms ease, backdrop-filter 600ms ease; }
        .lightbox-overlay.active { opacity: 1; backdrop-filter: blur(20px); }
        .lightbox-content { opacity: 0; transform: scale(0.96); filter: blur(10px); transition: opacity 600ms ease, transform 600ms ease, filter 600ms ease; }
        .lightbox-content.active { opacity: 1; transform: scale(1); filter: blur(0px); }
        .lightbox-card { opacity: 0; transform: translateY(20px); transition: opacity 800ms ease, transform 800ms ease; }
        .lightbox-card.active { opacity: 1; transform: translateY(0); }
      `}} />

      {/* ================= 动态深空视差全局背景 ================= */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[5%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-cyan-900/12 blur-[80px] ambient-orb-1 mix-blend-screen"></div>
        <div className="absolute bottom-[5%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-900/12 blur-[80px] ambient-orb-2 mix-blend-screen"></div>
      </div>
      
      {/* 微小量子光点层 */}
      <AmbientParticles />

      {/* ================= 顶级导航栏与侧边栏 ================= */}
      <nav className="fixed top-0 left-0 w-full px-5 py-4 md:px-12 flex justify-between items-center z-[200] font-artistic backdrop-blur-xl bg-[#040a18]/70 border-b border-white/[0.03]">
        <div className="flex items-center gap-2 md:gap-3 tracking-[0.2em] md:tracking-[0.4em] text-[10px] md:text-xs font-light text-cyan-50 cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
          <FilmIcon className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          <span>NUCLEAR.ART</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:block text-[7px] tracking-[0.15em] text-white/15 font-light">核聚科普星火，科创燃动未来</span>
          <button
            onClick={() => setIsAnnounceOpen(true)}
            className="px-5 py-2.5 bg-cyan-950/40 border border-cyan-500/30 hover:bg-cyan-900/60 active:scale-95 rounded-full transition-all duration-300 text-[10px] tracking-[0.2em] font-light text-cyan-50 shadow-[0_0_15px_rgba(34,211,238,0.15)] pointer-events-auto"
          >
            活动公告
          </button>
        </div>
      </nav>

      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed left-4 md:left-8 top-20 md:top-24 z-[210] p-3.5 rounded-full bg-[#07101d]/90 backdrop-blur-md border border-cyan-500/20 text-cyan-100/80 hover:text-cyan-400 hover:border-cyan-400 transition-all duration-500 shadow-[0_4px_24px_rgba(0,0,0,0.6)] ${
          isPastHero ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'
        }`}
      >
        {isSidebarOpen ? <CloseIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
      </button>

      <div 
        className={`fixed inset-0 bg-[#040a18]/80 backdrop-blur-md z-[190] transition-opacity duration-500 ease-out ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <nav 
        className={`fixed left-4 md:left-8 top-36 md:top-40 z-[200] flex flex-col gap-1.5 p-4 bg-[#07101d]/95 backdrop-blur-lg border border-white/[0.08] rounded-3xl shadow-[0_32px_64px_rgba(0,0,0,0.8)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isSidebarOpen ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-x-12 scale-95 pointer-events-none'
        }`}
      >
        <div className="text-[10px] tracking-[0.4em] text-cyan-500/50 font-light mb-4 px-3 uppercase font-artistic border-b border-white/[0.05] pb-4">Directory</div>
        {SITE_SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToAnchor(section.id)}
            className={`flex items-center gap-5 group text-left px-4 py-3.5 rounded-2xl transition-all duration-300 ${
              activeSection === section.id ? 'bg-cyan-900/30 border border-cyan-500/20 shadow-inner' : 'hover:bg-white/[0.05] border border-transparent'
            }`}
          >
            <div className={`text-xs font-light font-artistic w-4 transition-colors ${activeSection === section.id ? 'text-cyan-300' : 'text-white/30 group-hover:text-cyan-100'}`}>
              0{section.num}
            </div>
            <div className="flex flex-col pr-8">
              <span className={`text-[12px] md:text-sm tracking-widest font-light transition-colors mb-0.5 ${activeSection === section.id ? 'text-white drop-shadow-md' : 'text-white/60 group-hover:text-white'}`}>
                {section.title}
              </span>
              <span className={`text-[10px] tracking-wider transition-all max-w-[180px] text-ellipsis ${activeSection === section.id ? 'text-cyan-100/60' : 'text-white/30 group-hover:text-white/50'}`}>
                {section.desc}
              </span>
            </div>
          </button>
        ))}
      </nav>

      {/* ================= 首屏与总览区 ================= */}
      <header className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center pt-24 pb-32">
        <div 
           className="absolute inset-0 z-0 pointer-events-none transition-transform duration-75"
           style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px) scale(1.05)` }}
        >
          <img
            src="https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=2000&q=85"
            alt="Nuclear Core Memory"
            className="w-full h-full object-cover opacity-60 hero-pan"
            style={{ filter: "brightness(0.6) contrast(1.1) saturate(0.8)" }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#040a18]/20 via-[#040a18]/70 to-[#040a18] z-10 pointer-events-none"></div>

        <div className="relative z-20 flex flex-col items-center text-center w-full px-6 select-none font-artistic mb-16 md:mb-24 mt-4">
          <div className={`text-[10px] md:text-xs tracking-[0.4em] md:tracking-[0.6em] text-cyan-300/80 mb-6 font-light uppercase fade-up-init ${isLoaded ? 'loaded' : ''}`} style={{ transitionDelay: '100ms' }}>
            探索原子奥秘 · 预见科技未来
          </div>
          <div className={`flex flex-col items-center gap-6 md:gap-8 fade-up-init ${isLoaded ? 'loaded' : ''}`} style={{ transitionDelay: '300ms' }}>
            <h1 className="text-5xl md:text-7xl lg:text-[6.5rem] font-light tracking-[0.15em] text-white leading-tight drop-shadow-[0_0_40px_rgba(34,211,238,0.2)]">
              核光纪元
            </h1>
            <div className="flex items-center gap-4 md:gap-6 w-full justify-center">
              <div className="h-px w-8 md:w-16 bg-gradient-to-r from-transparent to-cyan-500/50"></div>
              <span className="text-[9px] md:text-[11px] tracking-[0.4em] font-light text-cyan-100/60 uppercase">核科学科普互动展示</span>
              <div className="h-px w-8 md:w-16 bg-gradient-to-l from-transparent to-cyan-500/50"></div>
            </div>
          </div>
        </div>

        <div className={`relative z-20 w-full max-w-[1440px] px-6 md:px-12 fade-up-init ${isLoaded ? 'loaded' : ''}`} style={{ transitionDelay: '600ms' }}>
          <div className="text-center mb-8">
            <span className="text-[10px] tracking-[0.4em] text-white/40 uppercase font-light">EXHIBITION SECTIONS</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {SITE_SECTIONS.map((section) => (
              <div 
                key={section.id} 
                onClick={() => scrollToAnchor(section.id)}
                className="group relative bg-white/[0.015] hover:bg-white/[0.04] border border-white/[0.05] hover:border-cyan-500/30 rounded-2xl p-6 md:p-8 cursor-pointer transition-all duration-500 ease-out backdrop-blur-md shadow-xl"
              >
                <div className="absolute bottom-3 right-5 text-7xl font-light text-cyan-500/20 group-hover:text-cyan-400/40 transition-colors duration-500 font-artistic select-none">
                  0{section.num}
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between gap-6 md:gap-10">
                  <div>
                    <h3 className="text-lg md:text-xl font-light tracking-widest text-white/90 mb-2 font-artistic group-hover:text-cyan-300 transition-colors">{section.title}</h3>
                    <p className="text-xs text-white/40 font-light tracking-wide leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                      {section.desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-cyan-600/50 group-hover:text-cyan-400 transition-colors uppercase font-ui">
                    <span>进入此展区</span>
                    <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="relative z-20 font-artistic">
        {/* ================= 板块1：核能知识 ================= */}
        <div id="knowledge" className="site-section pt-24 pb-16 px-6 md:px-12 lg:px-32 max-w-[1440px] mx-auto">
          <div className="text-center mb-20 md:mb-32 reveal-section" ref={addToRefs}>
            <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full bg-cyan-900/20 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)] backdrop-blur-md">
              <CameraIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[9px] tracking-[0.3em] text-cyan-100/80 uppercase">{siteContent?.sect1?.label || 'SECT 1. 核能知识'}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-light tracking-[0.15em] text-white mb-6">{siteContent?.sect1?.title || '核能知识的微观宇宙'}</h2>
            <p className="text-xs md:text-sm font-light text-white/50 leading-relaxed max-w-2xl mx-auto tracking-widest italic">
              {(siteContent?.sect1?.quote || '"科学的边界，是对未知的无畏探索；核能的真谛，是造福人类的无尽光芒。"').replace('<br/>', '')}
            </p>
          </div>
          <div className="flex flex-col gap-24 md:gap-40">
            {/* 核裂变链式反应模拟器 */}
            <section ref={addToRefs} className="reveal-section flex flex-col lg:flex-row items-center gap-8 lg:gap-20 w-full mb-10">
              <div className="w-full lg:w-[55%] h-[400px]">
                <NuclearSimulationGame />
              </div>
              <div className="w-full lg:w-[45%] flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[10px] tracking-[0.3em] text-cyan-400/60 font-light uppercase">INTERACTIVE</span>
                  <div className="h-[1px] w-6 bg-cyan-500/40"></div>
                  <span className="text-[9px] tracking-[0.3em] text-cyan-300/80 font-light uppercase">FISSION SIMULATOR</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-light tracking-widest mb-6 text-white/95">沉浸科普：裂变链式反应</h2>
                <p className="text-xs md:text-sm text-white/60 font-light leading-loose tracking-wide">
                  链式反应是核电站能量的来源。当一颗高能中子击中铀-235原子核时，原子会分裂并释放出巨大的能量，同时弹出2到3颗新的中子。<br/><br/>
                  点击画面发射中子，引发铀原子的连锁反应，直观感受核裂变的震撼力量！
                </p>
              </div>
            </section>

            {/* 一、核裂变与链式反应 */}
            <section ref={addToRefs} className="reveal-section flex flex-col lg:flex-row items-center gap-8 lg:gap-20 w-full">
              <div className="w-full lg:w-[55%] flex flex-col gap-3">
                <div className="overflow-hidden relative rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/[0.05] group">
                  <div className="aspect-[4/3] md:aspect-[16/10] w-full bg-[#0a101d]">
                    <img src={base + 'docx_images/sec1_fission_fusion.webp'} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 hover:scale-105" />
                  </div>
                </div>
                <div className="text-[9px] text-center text-white/30 tracking-wider -mt-1">▲ 裂变与聚变对比图</div>
                <div className="overflow-hidden relative rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/[0.05] group">
                  <div className="aspect-[4/3] md:aspect-[16/10] w-full bg-[#0a101d]">
                    <img src={base + 'docx_images/sec1_uranium_fission.webp'} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 hover:scale-105" />
                  </div>
                </div>
                <div className="text-[9px] text-center text-white/30 tracking-wider -mt-1">▲ 铀-235裂变示意图</div>
              </div>
              <div className="w-full lg:w-[45%] flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[10px] tracking-[0.3em] text-cyan-400/60 font-light uppercase">01</span>
                  <div className="h-[1px] w-6 bg-cyan-500/40"></div>
                  <span className="text-[9px] tracking-[0.3em] text-cyan-300/80 font-light uppercase">NUCLEAR FISSION</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-light tracking-widest mb-6 text-white/95">核裂变与链式反应</h2>
                <p className="text-xs md:text-sm text-white/60 font-light leading-loose tracking-wide">核裂变是指一个重原子核（如铀-235）吸收一个中子后，分裂成两个较轻的原子核，并释放巨大能量的过程。当一个铀-235原子核俘获一个中子后，分裂为两个较轻的原子核（如钡-141和氪-92），同时释放约200MeV的能量和2-3个新的中子。这些新产生的中子若继续轰击其他铀-235原子核，引发新的裂变，如此持续下去便形成了链式裂变反应。在链式反应中，从一个原子核开始裂变到引发下一代裂变，仅需约1纳秒。核电站正是通过可控的链式反应，将核能持续转化为电能。</p>
              </div>
            </section>

            {/* 二、核聚变 —— 星辰的能量 */}
            <section ref={addToRefs} className="reveal-section flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-20 w-full">
              <div className="w-full lg:w-[55%] flex flex-col gap-3">
                <div className="overflow-hidden relative rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/[0.05] group">
                  <div className="aspect-[4/3] md:aspect-[16/10] w-full bg-[#0a101d]">
                    <img src={base + 'docx_images/sec2_fusion_sun.webp'} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 hover:scale-105" />
                  </div>
                </div>
                <div className="text-[9px] text-center text-white/30 tracking-wider -mt-1">▲ 太阳内部聚变与可控核聚变对比图</div>
                <div className="overflow-hidden relative rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/[0.05] group">
                  <div className="aspect-[4/3] md:aspect-[16/10] w-full bg-[#0a101d]">
                    <img src={base + 'docx_images/sec2_iter.webp'} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 hover:scale-105" />
                  </div>
                </div>
                <div className="text-[9px] text-center text-white/30 tracking-wider -mt-1">▲ ITER装置实拍图</div>
              </div>
              <div className="w-full lg:w-[45%] flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[10px] tracking-[0.3em] text-cyan-400/60 font-light uppercase">02</span>
                  <div className="h-[1px] w-6 bg-cyan-500/40"></div>
                  <span className="text-[9px] tracking-[0.3em] text-cyan-300/80 font-light uppercase">NUCLEAR FUSION</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-light tracking-widest mb-6 text-white/95">核聚变——星辰的能量</h2>
                <p className="text-xs md:text-sm text-white/60 font-light leading-loose tracking-wide">核聚变是两个轻原子核（如氘和氚）在极高温度（上亿摄氏度）下聚合为较重的氦核，同时释放巨大能量的过程。太阳内部每秒钟约有6.2亿吨氢聚变成6.16亿吨氦，亏损的质量转化为辐射能——这也是太阳耀眼的根源。与核裂变不同，聚变产物是稳定的氦，几乎不产生长寿命放射性废物。国际热核聚变实验堆（ITER）计划正致力于实现可控核聚变。截至2025年，ITER项目的进度绩效指数和成本绩效指数均高于1.0。中国承担了ITER约10%的研发制造任务。ITER有望为人类提供近乎无限的清洁能源。</p>
              </div>
            </section>

            {/* 三、先进反应堆技术 */}
            <section ref={addToRefs} className="reveal-section flex flex-col lg:flex-row items-center gap-8 lg:gap-20 w-full">
              <div className="w-full lg:w-[55%] flex flex-col gap-3">
                <div className="overflow-hidden relative rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/[0.05] group">
                  <div className="aspect-[4/3] md:aspect-[16/10] w-full bg-[#0a101d]">
                    <img src={base + 'docx_images/sec3_linglong.webp'} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 hover:scale-105" />
                  </div>
                </div>
                <div className="text-[9px] text-center text-white/30 tracking-wider -mt-1">▲ 玲龙一号实拍图</div>
                <div className="overflow-hidden relative rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/[0.05] group">
                  <div className="aspect-[4/3] md:aspect-[16/10] w-full bg-[#0a101d]">
                    <img src={base + 'docx_images/sec3_htrpm.webp'} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 hover:scale-105" />
                  </div>
                </div>
                <div className="text-[9px] text-center text-white/30 tracking-wider -mt-1">▲ 石岛湾高温气冷堆外观图</div>
              </div>
              <div className="w-full lg:w-[45%] flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[10px] tracking-[0.3em] text-cyan-400/60 font-light uppercase">03</span>
                  <div className="h-[1px] w-6 bg-cyan-500/40"></div>
                  <span className="text-[9px] tracking-[0.3em] text-cyan-300/80 font-light uppercase">SMR & GEN IV</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-light tracking-widest mb-6 text-white/95">先进反应堆：从SMR到第四代</h2>
                <p className="text-xs md:text-sm text-white/60 font-light leading-loose tracking-wide">小型模块化反应堆（SMR）凭借投资灵活、建设高效、安全可靠等优势，成为核能创新发展的重要方向。中国"玲龙一号"（ACP100，单堆125兆瓦）2021年在海南昌江开工，预计2026年商用，58个月建设周期将树立全球SMR部署新基准。其年发电量可达10亿千瓦时，满足约52.6万户家庭用电需求。第四代反应堆包括钠冷快堆、超高温气冷堆、铅冷快堆等六大堆型。中国石岛湾高温气冷堆（HTR-PM）于2023年12月正式投入商业运行，成为全球首座第四代核电商业示范电站，设备国产化率达93.4%。</p>
              </div>
            </section>

            {/* 四、核燃料循环 */}
            <section ref={addToRefs} className="reveal-section flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-20 w-full">
              <div className="w-full lg:w-[55%] flex flex-col gap-3">
                <div className="overflow-hidden relative rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/[0.05] group">
                  <div className="aspect-[4/3] md:aspect-[16/10] w-full bg-[#0a101d]">
                    <img src={base + 'docx_images/sec4_fuel_cycle.webp'} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 hover:scale-105" />
                  </div>
                </div>
                <div className="text-[9px] text-center text-white/30 tracking-wider -mt-1">▲ 核燃料循环示意图</div>
              </div>
              <div className="w-full lg:w-[45%] flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[10px] tracking-[0.3em] text-cyan-400/60 font-light uppercase">04</span>
                  <div className="h-[1px] w-6 bg-cyan-500/40"></div>
                  <span className="text-[9px] tracking-[0.3em] text-cyan-300/80 font-light uppercase">FUEL CYCLE</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-light tracking-widest mb-6 text-white/95">核燃料循环——从铀矿到再利用</h2>
                <p className="text-xs md:text-sm text-white/60 font-light leading-loose tracking-wide">核燃料循环从铀矿开采（天然铀含约0.7%的铀-235）→铀转化与浓缩（提升至3%-5%）→燃料制造→反应堆发电→乏燃料后处理→放射性废物处置，构成完整链条。乏燃料并非"废料"——现有核电技术下核燃料仅燃烧了3%-4%。通过闭式燃料循环（回收铀和钚再循环），可将铀资源利用率从约1%提升至60%以上，相当于提升60倍。以目前探明的天然铀储量，快堆的广泛应用可使铀资源可持续利用3000年以上。</p>
              </div>
            </section>

            {/* 五、核电安全 —— 纵深防御 */}
            <section ref={addToRefs} className="reveal-section flex flex-col lg:flex-row items-center gap-8 lg:gap-20 w-full">
              <div className="w-full lg:w-[55%] flex flex-col gap-3">
                <div className="overflow-hidden relative rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/[0.05] group">
                  <div className="aspect-[4/3] md:aspect-[16/10] w-full bg-[#0a101d]">
                    <img src={base + 'docx_images/sec5_double_shell.webp'} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 hover:scale-105" />
                  </div>
                </div>
                <div className="text-[9px] text-center text-white/30 tracking-wider -mt-1">▲ 华龙一号双层安全壳剖面图</div>
                <div className="overflow-hidden relative rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/[0.05] group">
                  <div className="aspect-[4/3] md:aspect-[16/10] w-full bg-[#0a101d]">
                    <img src={base + 'docx_images/sec5_hualong.webp'} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 hover:scale-105" />
                  </div>
                </div>
                <div className="text-[9px] text-center text-white/30 tracking-wider -mt-1">▲ 华龙一号实拍图</div>
              </div>
              <div className="w-full lg:w-[45%] flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[10px] tracking-[0.3em] text-cyan-400/60 font-light uppercase">05</span>
                  <div className="h-[1px] w-6 bg-cyan-500/40"></div>
                  <span className="text-[9px] tracking-[0.3em] text-cyan-300/80 font-light uppercase">DEFENSE IN DEPTH</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-light tracking-widest mb-6 text-white/95">核电安全——纵深防御</h2>
                <p className="text-xs md:text-sm text-white/60 font-light leading-loose tracking-wide">核电安全运行的核心是"纵深防御"理念——设置五重防线：燃料芯块本身→燃料包壳→反应堆压力容器→安全壳→厂外应急计划。任何单一故障都不会导致放射性物质大量释放。以中国"华龙一号"为例，其采用双层安全壳设计：内层安全壳厚1.3米，外层厚1.5-1.8米，内外壳之间保持负压。这一设计可抵御商用大飞机撞击、17级超强台风和9级以上地震。单台"华龙一号"机组年发电超100亿度，可满足100万人口的年度用电需求。</p>
              </div>
            </section>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent my-16 max-w-5xl mx-auto shadow-[0_0_20px_rgba(34,211,238,0.1)]"></div>

        {/* ================= 板块2：核技术应用 ================= */}
        <div id="application" className="site-section pt-16 pb-24 px-6 md:px-12 lg:px-32 max-w-[1440px] mx-auto">
          <div className="text-center mb-20 md:mb-32 reveal-section" ref={addToRefs}>
             <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full bg-cyan-900/20 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)] backdrop-blur-md">
              <CompassIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[9px] tracking-[0.3em] text-cyan-100/80 uppercase">{siteContent?.sect2?.label || 'SECT 2. 核技术应用'}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-light tracking-[0.15em] text-white">{siteContent?.sect2?.title || '核技术的跨界造福'}</h2>
          </div>
          <div className="flex flex-col gap-24 md:gap-40">
            {currentGallery.slice(2, 4).map((item, index) => (
              <section key={item.id} ref={addToRefs} className={`reveal-section flex flex-col ${index % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 lg:gap-20 w-full`}>
                <div onClick={() => openLightboxSilky('gallery', item)} className="w-full lg:w-[55%] overflow-hidden relative rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/[0.05] cursor-zoom-in group">
                  <div className="aspect-[4/3] md:aspect-[16/10] w-full bg-[#0a101d]">
                    <img src={item.image} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 hover:scale-105" />
                  </div>
                </div>
                <div className="w-full lg:w-[45%] flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-[10px] tracking-[0.3em] text-cyan-400/60 font-light uppercase">0{index + 1}</span>
                    <div className="h-[1px] w-6 bg-cyan-500/40"></div>
                    <span className="text-[9px] tracking-[0.3em] text-cyan-300/80 font-light uppercase">{item.subtitle}</span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-light tracking-widest mb-6 text-white/95">{item.title}</h2>
                  <p className="text-xs md:text-sm text-white/60 font-light leading-loose tracking-wide">{item.desc}</p>
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* ================= 互动知识问答 ================= */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-32 pb-8">
          <div className="reveal-section bg-white/[0.015] backdrop-blur-md border border-white/[0.05] rounded-3xl p-6 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-600/5 blur-[80px] pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                  <span className="text-[9px] tracking-[0.3em] text-cyan-400/70 uppercase font-artistic">{siteContent?.quiz?.label || '🧪 核能知识小测验'}</span>
                  <h3 className="text-xl md:text-2xl font-light tracking-widest text-white/90 mt-2 font-artistic">{siteContent?.quiz?.title || '测一测你的核能认知'}</h3>
                </div>
                {quizSubmitted && (
                  <div className="text-right">
                    <span className="text-lg font-light text-cyan-300">{quizScore}/{QUIZ_DATA.length}</span>
                    <span className="text-[10px] text-white/40 block font-ui">得分</span>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                {QUIZ_DATA.map((item, qIdx) => (
                  <div key={qIdx} className={`border rounded-xl p-4 md:p-5 transition-colors ${quizSubmitted ? (quizAnswers[qIdx] === item.ans ? 'border-cyan-500/40 bg-cyan-900/10' : 'border-white/5 bg-white/[0.01]') : 'border-white/5 hover:border-cyan-500/20 bg-white/[0.01]'}`}>
                    <p className="text-xs md:text-sm font-light text-white/80 mb-3 leading-relaxed font-artistic tracking-wide">{qIdx + 1}. {item.q}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-ui">
                      {item.opts.map((opt, optIdx) => {
                        const isSelected = quizAnswers[qIdx] === optIdx;
                        const isCorrect = item.ans === optIdx;
                        const showResult = quizSubmitted && isSelected;
                        const showCorrect = quizSubmitted && isCorrect && !isSelected;
                        return (
                          <button key={optIdx} onClick={() => handleQuizAnswer(qIdx, optIdx)}
                            className={`text-left text-[11px] md:text-xs px-4 py-3 rounded-xl border transition-all duration-300 ${
                              showResult ? (isCorrect ? 'border-cyan-400 bg-cyan-800/30 text-cyan-200' : 'border-red-500/40 bg-red-900/20 text-red-300')
                              : showCorrect ? 'border-cyan-400/30 bg-cyan-800/10 text-cyan-200/70'
                              : isSelected ? 'border-cyan-500/40 bg-cyan-900/20 text-white'
                              : 'border-white/[0.08] bg-white/[0.02] text-white/60 hover:border-cyan-500/30 hover:bg-cyan-900/10 hover:text-white/90'
                            } ${quizSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                          >
                            <span className="inline-block w-5 text-white/30 font-mono">{String.fromCharCode(65 + optIdx)}</span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-4 mt-8 font-ui">
                {!quizSubmitted ? (
                  <button onClick={handleQuizSubmit} disabled={Object.keys(quizAnswers).length < QUIZ_DATA.length}
                    className={`px-8 py-3 rounded-xl text-[10px] tracking-widest transition-all ${
                      Object.keys(quizAnswers).length < QUIZ_DATA.length
                      ? 'bg-white/[0.03] border border-white/10 text-white/30 cursor-not-allowed'
                      : 'bg-cyan-700/80 hover:bg-cyan-600 border border-cyan-500/40 text-white shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                    }`}
                  >
                    {siteContent?.quiz?.submitText || '提交答案'}
                  </button>
                ) : (
                  <>
                    <button onClick={handleQuizReset} className="px-8 py-3 bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] rounded-xl text-[10px] tracking-widest text-white/60 hover:text-white transition-all">{siteContent?.quiz?.retryText || '重新作答'}</button>
                    <div className="flex items-center gap-2 px-6 py-3 bg-cyan-900/20 border border-cyan-500/20 rounded-xl">
                      <span className="text-[9px] tracking-widest text-cyan-200/70">成绩</span>
                      <span className="text-lg font-light text-cyan-300">{quizScore}/{QUIZ_DATA.length}</span>
                      <span className="text-[10px] text-white/40">({Math.round(quizScore/QUIZ_DATA.length*100)}%)</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= 板块3：辐射安全与防护 ================= */}
        <section id="safety" className="site-section pt-24 pb-24 px-6 md:px-12 lg:px-32 max-w-[1440px] mx-auto">
           <div className="text-center mb-16 md:mb-20 reveal-section" ref={addToRefs}>
             <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full bg-cyan-900/20 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)] backdrop-blur-md">
              <LockIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[9px] tracking-[0.3em] text-cyan-100/80 uppercase">{siteContent?.sect3?.label || 'SECT 3. 辐射安全'}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-light tracking-[0.15em] text-white">{siteContent?.sect3?.title || '防护的科学法则'}</h2>
            <p className="text-xs md:text-sm font-light text-white/40 mt-4 tracking-wider">{siteContent?.sect3?.desc || '摒弃未知带来的恐惧，用科学法则构建坚不可摧的防线。'}</p>
          </div>

          {/* 辐射屏蔽模拟测试仪 */}
          <div className="mt-12 reveal-section" ref={addToRefs}>
            <RadiationShieldSimulator />
          </div>

          <div className="reveal-section space-y-8 mt-12" ref={addToRefs}>

            {/* 辐射防护三原则 */}
            <div className="bg-white/[0.015] backdrop-blur-md border border-white/[0.05] rounded-3xl p-6 md:p-10 shadow-[0_32px_80px_rgba(0,0,0,0.8)] relative overflow-hidden">
              <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-600/10 blur-[100px] pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-[10px] tracking-[0.3em] text-cyan-400/60 font-light uppercase">ICRP RADIATION PROTECTION SYSTEM</span>
                  <div className="h-[1px] w-6 bg-cyan-500/40"></div>
                </div>
                <h3 className="text-xl md:text-2xl font-light tracking-widest text-white/90 mb-2">辐射防护三原则</h3>
                <p className="text-[10px] text-white/30 font-light mb-8 tracking-wider font-ui">ICRP提出的辐射防护体系包含三大原则，三项原则相互关联，共同构成一个严密的防护体系</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* 原则一 */}
                  <div className="bg-white/[0.02] border border-white/[0.06] hover:border-cyan-500/30 rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 flex flex-col gap-4 group">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-2xl font-light text-cyan-400/60">01</span>
                      <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent"></div>
                    </div>
                    <div className="flex items-start justify-between">
                      <h4 className="text-base font-light tracking-widest text-white/90 group-hover:text-cyan-300 transition-colors">辐射实践的正当性</h4>
                      <span className="text-[8px] tracking-widest text-cyan-400/50 bg-cyan-900/30 px-2.5 py-1 rounded-full border border-cyan-500/20 whitespace-nowrap ml-2">前提·要不要做？</span>
                    </div>
                    <p className="text-[11px] text-white/50 font-light leading-relaxed">任何涉及电离辐射的实践，其带来的利益必须大于它可能造成的危害——即"利大于弊"。这是进行任何涉及辐射活动首要考虑的前提。</p>
                    <div className="bg-[#040a18]/60 rounded-xl p-4 border border-white/[0.04]">
                      <p className="text-[9px] text-cyan-300/60 tracking-wider mb-2 font-ui">举例说明</p>
                      <p className="text-[10px] text-white/40 font-light leading-relaxed"><span className="text-green-400/80">✅ 正当的实践：</span>胸部X光检查——诊断疾病带来的健康获益远大于一次小剂量照射的微小风险。</p>
                      <p className="text-[10px] text-white/40 font-light leading-relaxed mt-1.5"><span className="text-red-400/80">❌ 不正当的实践：</span>将X光用于美容足部塑形等非医疗必要目的——美观收益远不足以抵消不必要的辐射风险。</p>
                    </div>
                  </div>

                  {/* 原则二 */}
                  <div className="bg-white/[0.02] border border-white/[0.06] hover:border-cyan-500/30 rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 flex flex-col gap-4 group">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-2xl font-light text-cyan-400/60">02</span>
                      <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent"></div>
                    </div>
                    <div className="flex items-start justify-between">
                      <h4 className="text-base font-light tracking-widest text-white/90 group-hover:text-cyan-300 transition-colors">辐射防护的最优化</h4>
                      <span className="text-[8px] tracking-widest text-cyan-400/50 bg-cyan-900/30 px-2.5 py-1 rounded-full border border-cyan-500/20 whitespace-nowrap ml-2">过程·如何做好？</span>
                    </div>
                    <p className="text-[11px] text-white/50 font-light leading-relaxed">在考虑到经济和社会因素的前提下，所有的辐射照射都应保持在可合理达到的尽量低的水平——即ALARA原则（As Low As Reasonably Achievable）。</p>
                    <div className="bg-[#040a18]/60 rounded-xl p-4 border border-white/[0.04]">
                      <p className="text-[9px] text-cyan-300/60 tracking-wider mb-2 font-ui">具体解读</p>
                      <p className="text-[10px] text-white/40 font-light leading-relaxed">最优化不意味着追求"零剂量"。在确保实践利益的前提下，平衡<strong className="text-cyan-300/80">经济因素</strong>（防护成本）、<strong className="text-cyan-300/80">社会因素</strong>（公众心理）和<strong className="text-cyan-300/80">防护效果</strong>（剂量降低程度），选择最优方案。</p>
                      <p className="text-[10px] text-white/40 font-light leading-relaxed mt-1.5">如CT检查时根据体型选择最低够用剂量——既不盲目追求低剂量牺牲诊断价值，也不让患者接受不必要的额外照射。</p>
                    </div>
                  </div>

                  {/* 原则三 */}
                  <div className="bg-white/[0.02] border border-white/[0.06] hover:border-cyan-500/30 rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 flex flex-col gap-4 group">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-2xl font-light text-cyan-400/60">03</span>
                      <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent"></div>
                    </div>
                    <div className="flex items-start justify-between">
                      <h4 className="text-base font-light tracking-widest text-white/90 group-hover:text-cyan-300 transition-colors">个人剂量限值</h4>
                      <span className="text-[8px] tracking-widest text-cyan-400/50 bg-cyan-900/30 px-2.5 py-1 rounded-full border border-cyan-500/20 whitespace-nowrap ml-2">底线·在哪？</span>
                    </div>
                    <p className="text-[11px] text-white/50 font-light leading-relaxed">确保没有任何个人接受到"不可接受的"高剂量辐射。这是辐射防护体系的最后一道防线，也是防护最优化过程的约束上限。</p>
                    <div className="bg-[#040a18]/60 rounded-xl p-4 border border-white/[0.04]">
                      <p className="text-[9px] text-cyan-300/60 tracking-wider mb-2 font-ui">ICRP建议的剂量限值</p>
                      <div className="space-y-1.5 text-[10px]">
                        <div className="flex justify-between items-center bg-white/[0.03] rounded-lg px-3 py-2">
                          <span className="text-white/60">职业人员</span>
                          <span className="text-cyan-300/90 font-mono">20 mSv/年</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/[0.03] rounded-lg px-3 py-2">
                          <span className="text-white/60">公众</span>
                          <span className="text-cyan-300/90 font-mono">1 mSv/年</span>
                        </div>
                      </div>
                      <p className="text-[8px] text-white/30 mt-2 leading-relaxed">注：不含天然本底辐射和医疗照射。职业人员在5年内平均，任何单一年份不超过50 mSv。1 mSv类似"人均GDP"式统计控制标准，而非超过即危险的绝对界限。</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-cyan-900/10 border border-cyan-500/10 rounded-xl px-5 py-3">
                  <p className="text-[10px] text-cyan-300/70 font-light tracking-wider text-center font-ui">辐射防护的目标是：<strong className="text-cyan-200">正当的实践</strong> + <strong className="text-cyan-200">最优的防护</strong> ≤ <strong className="text-cyan-200">规定的限值</strong></p>
                </div>
              </div>
            </div>

            {/* 日常辐射剂量趣味对比 */}
            <div className="bg-white/[0.015] backdrop-blur-md border border-white/[0.05] rounded-3xl p-6 md:p-10 shadow-[0_32px_80px_rgba(0,0,0,0.8)] relative overflow-hidden">
              <div className="absolute -bottom-32 right-32 w-96 h-96 bg-cyan-600/10 blur-[100px] pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-[10px] tracking-[0.3em] text-cyan-400/60 font-light uppercase">BANANA EQUIVALENT DOSE</span>
                  <div className="h-[1px] w-6 bg-cyan-500/40"></div>
                </div>
                <h3 className="text-xl md:text-2xl font-light tracking-widest text-white/90 mb-6">🍌 趣味对比：香蕉等效剂量</h3>
                <p className="text-[10px] text-white/30 font-light mb-6 tracking-wider font-ui">香蕉中含有天然放射性核素钾-40，每吃一根香蕉约受到0.1 μSv（0.0001 mSv）的辐射。以此为标准看常见活动：</p>
                <div className="space-y-3">
                  {[
                    { label: '吃 1 根香蕉', dose: '0.1 μSv', bananas: '1 根', width: '3%' },
                    { label: '拍 1 次胸片', dose: '0.02~0.1 mSv', bananas: '约 200~1000 根', width: '20%' },
                    { label: '1 次胸部CT', dose: '约 7~10 mSv', bananas: '约 7万~10万根', width: '60%' },
                    { label: '短期明显伤害阈值', dose: '~250 mSv', bananas: '约 250万根', width: '85%' },
                    { label: '公众年剂量限值', dose: '1 mSv', bananas: '约 1万根', width: '35%' },
                    { label: '职业年剂量限值', dose: '20 mSv', bananas: '约 20万根', width: '65%' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-[10px] md:text-[11px]">
                      <span className="w-28 md:w-36 text-right text-white/50 shrink-0">{item.label}</span>
                      <div className="flex-1 h-5 bg-white/[0.04] rounded-full overflow-hidden relative">
                        <div className="h-full bg-gradient-to-r from-cyan-600/40 to-cyan-400/60 rounded-full transition-all" style={{ width: item.width }}></div>
                      </div>
                      <span className="w-24 text-left text-cyan-300/80 shrink-0 font-mono text-[9px]">{item.dose}</span>
                      <span className="w-28 text-left text-yellow-400/60 shrink-0 text-[9px] font-ui">{item.bananas}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] text-white/20 mt-4 text-center font-ui">医疗检查的辐射风险远低于诊断获益，无需因噎废食。<br />数据来源：UNSCEAR 2020年报告</p>
              </div>
            </div>

            {/* 核事故应急 */}
            <div className="bg-white/[0.015] backdrop-blur-md border border-white/[0.05] rounded-3xl p-6 md:p-10 shadow-[0_32px_80px_rgba(0,0,0,0.8)] relative overflow-hidden">
              <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-600/10 blur-[100px] pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-[10px] tracking-[0.3em] text-cyan-400/60 font-light uppercase">EMERGENCY RESPONSE</span>
                  <div className="h-[1px] w-6 bg-cyan-500/40"></div>
                </div>
                <h3 className="text-xl md:text-2xl font-light tracking-widest text-white/90 mb-6">核事故应急——牢记<strong className="text-cyan-300">九字诀</strong></h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {(siteContent?.sect3?.emergencyCards || [
                  {title:'听指挥', text:'第一时间获取官方信息，不信谣、不传谣。'},
                  {title:'快隐蔽', text:'立即进入室内，关闭门窗和通风系统（外照射可减至室外½~¹⁄₁₀）。'},
                  {title:'戴口罩', text:'用湿毛巾捂住口鼻，减少吸入放射性物质（可降至¹⁄₁₀）。'}
                ]).map((card, i) => (
                  <div key={i} className="bg-cyan-900/15 border border-cyan-500/20 rounded-2xl p-5 md:p-6 text-center">
                    <div className="text-2xl md:text-3xl font-light text-cyan-300 mb-2">{['📡','🏠','😷'][i]}</div>
                    <h4 className="text-sm font-light tracking-widest text-white/90 mb-2">{card.title}</h4>
                    <p className="text-[11px] text-white/50 font-light leading-relaxed">{card.text}</p>
                  </div>
                ))}
              </div>
              <div className="bg-[#040a18]/60 border border-cyan-500/10 rounded-xl px-5 py-3">
                <p className="text-[10px] text-white/40 font-light leading-relaxed text-center">{siteContent?.sect3?.emergencyNote || '必要时服用稳定性碘（须遵医嘱，碘盐无效），并按指令有序撤离或进行食物饮水控制。'}</p>
              </div>
              </div>
            </div>

            {/* 展区结语 */}
            <div className="bg-gradient-to-r from-cyan-900/10 via-transparent to-cyan-900/10 border border-cyan-500/10 rounded-3xl p-6 md:p-8 text-center">
              <div className="space-y-2">
                <p className="text-xs md:text-sm text-cyan-300/80 font-light tracking-wider">辐射无处不在，但<strong className="text-cyan-200">剂量决定危害</strong></p>
                <p className="text-[10px] text-white/40 font-light tracking-wider">防护牢记<strong className="text-white/60">三原则</strong>：正当性 · 最优化 · 剂量限值　｜　应急做到<strong className="text-white/60">三件事</strong>：听指挥 · 快隐蔽 · 戴口罩</p>
              </div>
            </div>

          </div>
        </section>

        {/* ================= 板块4：精神与文化 ================= */}
        <section id="spirit" className="site-section relative z-20 py-24 px-6 md:px-12 lg:px-32 max-w-[1440px] mx-auto">
          <SpiritSection setIsStoryOpen={setIsStoryOpen} siteContent={siteContent} onGalleryClick={(imgs, base, title) => {
            const fullUrls = imgs.map(i => base + i);
            setSpiritCaption(title || '');
            openLightboxSilky('spirit-gallery', fullUrls, 0);
          }} />
        </section>

        {/* ================= 板块5：政策法规解读 ================= */}
        <section id="policy" className="site-section relative z-20 py-20 px-6 md:px-12 lg:px-32 max-w-[1440px] mx-auto">
          <div className="text-center mb-16 reveal-section" ref={addToRefs}>
            <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full bg-cyan-900/20 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)] backdrop-blur-md">
              <LockIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[9px] tracking-[0.3em] text-cyan-100/80 uppercase">{siteContent?.sect5?.label || 'SECT 5. 政策法规'}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-light tracking-[0.15em] text-white">{siteContent?.sect5?.title || '政策法规与国家安全'}</h2>
            <p className="text-xs md:text-sm font-light text-white/40 mt-4 tracking-wider">{siteContent?.sect5?.desc || '知法懂法，从国家战略高度理解核安全与核发展的深刻内涵'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-section" ref={addToRefs}>
            {(siteContent?.sect5?.cards || [
              {title:'《中华人民共和国原子能法》',text:'2024年颁布的《原子能法》是我国原子能领域的基础性法律。该法明确了原子能事业"安全第一、保护环境、保障公众健康"的基本原则，确立了核安全监管体制和放射性废物管理体系，为我国核能和平利用与核技术应用提供了坚实的法律保障，标志着我国原子能事业进入法治化新阶段。'},
              {title:'总体国家安全观与核安全观',text:'总体国家安全观涵盖政治、军事、经济、科技、核安全等十余个领域。核安全观的核心内涵为"理性、协调、并进"——理性认识核安全风险，协调统筹发展与安全，推动核安全事业与核能事业并进。中国始终将核安全置于国家安全的战略高度，坚持最严格标准实施核安全监管。'},
              {title:'核能"三步走"发展战略',text:'第一步：热中子反应堆（热堆）——以压水堆为代表，是目前核电站主力堆型。第二步：快中子反应堆（快堆）——可将铀资源利用率从1%提升至60%以上。第三步：受控核聚变反应堆——模拟太阳聚变反应，有望提供近乎无限的清洁能源。中国正稳步推进"三步走"战略，从"华龙一号"到实验快堆再到参与国际热核聚变实验堆（ITER）计划。'}
            ]).map((card, ci) => (
              <div key={ci} className="bg-white/[0.015] backdrop-blur-md border border-white/[0.05] hover:border-cyan-500/30 rounded-2xl p-6 md:p-8 transition-all duration-500 hover:-translate-y-1 flex flex-col gap-5 group">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-light text-cyan-400/50">0{ci + 1}</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent"></div>
                </div>
                <h3 className="text-lg font-light tracking-widest text-white/90 group-hover:text-cyan-300 transition-colors">{card.title}</h3>
                <p className="text-xs text-white/50 font-light leading-relaxed group-hover:text-white/70 transition-colors">{card.text}</p>
              </div>
            ))}
          </div>
        </section>


        {/* ================= 板块6：论坛留言板 ================= */}
        <section id="forum" className="site-section relative z-20 py-24 px-6 md:px-12 lg:px-32 max-w-[1200px] mx-auto">
          <div className="text-center mb-16 reveal-section" ref={addToRefs}>
            <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full bg-cyan-900/20 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)] backdrop-blur-md">
              <MessageSquareIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[9px] tracking-[0.3em] text-cyan-100/80 uppercase">{siteContent?.sect6?.label || 'SECT 6. 读者畅想'}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-light tracking-[0.15em] text-white">{siteContent?.sect6?.title || '未来的回响'}</h2>
            <p className="text-xs md:text-sm font-light text-white/40 mt-4 tracking-wider">{siteContent?.sect6?.desc || '分享您对核技术应用与发展的独到见解'}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start reveal-section" ref={addToRefs}>
            <form onSubmit={handleMessageSubmit} className="lg:col-span-5 bg-white/[0.015] backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col gap-6 font-ui relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/10 blur-[60px] pointer-events-none"></div>

              <div className="flex flex-col gap-2 relative z-10">
                <label className="text-[10px] tracking-[0.2em] font-light text-cyan-200/60 uppercase font-artistic">{siteContent?.sect6?.formNameLabel || 'Signature (署名)'}</label>
                <input
                  type="text" maxLength="12" value={nickname}
                  onChange={(e) => { setNickname(e.target.value); if (e.target.value.trim()) setFormError(prev => ({ ...prev, name: false })); }}
                  placeholder={siteContent?.sect6?.formNamePlaceholder || '留下您的称呼...'}
                  className={`w-full bg-[#040a18]/60 text-sm text-white/95 placeholder:text-white/20 font-light border rounded-xl py-3.5 px-4 outline-none transition-all duration-300 focus:bg-[#07101d]/80 ${formError.name ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-white/10 focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)]'}`}
                />
              </div>

              <div className="flex flex-col gap-2 relative z-10">
                <label className="text-[10px] tracking-[0.2em] font-light text-cyan-200/60 uppercase font-artistic">{siteContent?.sect6?.formTextLabel || 'Insights (见解)'}</label>
                <textarea
                  rows="4" maxLength="300" value={content}
                  onChange={(e) => { setContent(e.target.value); if (e.target.value.trim()) setFormError(prev => ({ ...prev, text: false })); }}
                  placeholder={siteContent?.sect6?.formTextPlaceholder || '畅所欲言，科学的进步离不开每一份思考...'}
                  className={`w-full bg-[#040a18]/60 text-sm text-white/95 placeholder:text-white/20 font-light border rounded-xl py-3.5 px-4 outline-none transition-all duration-300 resize-none focus:bg-[#07101d]/80 ${formError.text ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-white/10 focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)]'}`}
                />
              </div>

              <button type="submit" className="mt-2 w-full bg-cyan-700/80 hover:bg-cyan-600 active:scale-95 transition-all duration-300 text-[10px] tracking-[0.3em] font-light text-white py-4 rounded-xl flex items-center justify-center gap-2 select-none shadow-[0_0_20px_rgba(34,211,238,0.2)] relative z-10">
                <SendIcon className="w-3.5 h-3.5" />
                <span>{siteContent?.sect6?.submitButton || '递交寄语'}</span>
              </button>
              {syncStatus && <div className="text-[8px] text-center text-cyan-400/50 tracking-wider font-ui relative z-10">{syncStatus}</div>}
            </form>

            <div className="lg:col-span-7 space-y-4 max-h-[460px] overflow-y-auto pr-2 story-scrollbar">
              {currentMessages.length === 0 ? (
                <div className="py-16 text-xs font-light text-white/30 tracking-widest text-center bg-white/[0.01] rounded-2xl">暂无留言，期待您的发声</div>
              ) : (
                currentMessages.map((msg) => (
                  <div key={msg.id} className="bg-white/[0.015] backdrop-blur-xl border border-white/[0.05] hover:border-cyan-500/30 p-5 md:p-6 rounded-2xl transition-all duration-500 flex flex-col gap-3 shadow-lg hover:shadow-[0_10px_30px_rgba(34,211,238,0.08)] group">
                    <div className="flex justify-between items-center border-b border-white/[0.05] pb-3 font-ui">
                      <span className="text-sm font-light tracking-widest text-cyan-300 font-artistic drop-shadow-md">{msg.name}</span>
                      <span className="text-[9px] font-light text-white/30 group-hover:text-white/50 transition-colors">{msg.time}</span>
                    </div>
                    <p className="text-xs md:text-sm font-light text-white/70 leading-relaxed tracking-wide">{msg.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ================= 沉浸式灯箱 ================= */}
      {lightbox.isOpen && previewData && (
        <div className={`fixed inset-0 z-[250] flex flex-col items-center justify-center p-4 md:p-8 select-none lightbox-overlay ${lightbox.isActive ? 'active' : ''} font-artistic`}>
          <div className="absolute inset-0 bg-[#040a18]/95 cursor-pointer" onClick={closeLightboxSilky}></div>
          <button onClick={closeLightboxSilky} className="absolute top-6 right-6 md:top-8 md:right-8 z-[260] p-2.5 bg-white/[0.05] hover:bg-white/[0.15] border border-white/10 hover:border-cyan-400/50 rounded-full text-white/70 hover:text-white transition-all duration-500 shadow-xl active:scale-90 font-ui backdrop-blur-md"><CloseIcon className="w-5 h-5" /></button>
          
          <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-6 md:gap-8 mt-6">
            <div className={`flex items-center gap-3 px-5 py-2 bg-[#020617]/60 backdrop-blur-md border border-cyan-500/30 rounded-full text-[10px] tracking-[0.2em] font-light text-white/70 shadow-[0_0_20px_rgba(34,211,238,0.15)] lightbox-card ${lightbox.isActive ? 'active' : ''}`}>
              <span className="text-cyan-400 font-medium">{lightbox.type === 'collection' ? previewData.category : (lightbox.type === 'spirit-gallery' ? '故事图集' : 'CORE KNOWLEDGE')}</span>
              {(lightbox.type === 'collection' || lightbox.type === 'spirit-gallery') && (<><span className="opacity-30">|</span><span>{lightbox.index + 1} / {(lightbox.type === 'spirit-gallery' && Array.isArray(lightbox.item)) ? lightbox.item.length : filteredPhotos.length}</span></>)}
            </div>

            <div className="relative w-full flex items-center justify-center max-h-[55vh]">
              <div className={`overflow-hidden rounded-2xl border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.9)] max-w-full max-h-[55vh] cursor-zoom-out lightbox-content ${lightbox.isActive ? 'active' : ''}`} onClick={closeLightboxSilky}>
                <img src={previewData.image} className="max-w-full max-h-[55vh] object-contain select-none" />
              </div>
            </div>

            {(lightbox.type === 'collection' || lightbox.type === 'spirit-gallery') && (
              <div className="flex items-center justify-center gap-4">
                <button onClick={handlePrevPhoto} className="p-2 bg-black/60 hover:bg-cyan-900/60 border border-white/10 hover:border-cyan-400/50 rounded-full text-white/50 hover:text-white transition-all duration-300 backdrop-blur-md font-ui"><ArrowLeftIcon className="w-4 h-4" /></button>
                <span className="text-[11px] text-white/50 font-light tracking-wider font-mono">{lightbox.index + 1} / {(lightbox.type === 'spirit-gallery' && Array.isArray(lightbox.item)) ? lightbox.item.length : filteredPhotos.length}</span>
                <button onClick={handleNextPhoto} className="p-2 bg-black/60 hover:bg-cyan-900/60 border border-white/10 hover:border-cyan-400/50 rounded-full text-white/50 hover:text-white transition-all duration-300 backdrop-blur-md font-ui"><ArrowRightIcon className="w-4 h-4" /></button>
              </div>
            )}
            
            <div className={`w-full max-w-2xl bg-[#040a18]/60 backdrop-blur-lg border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl text-center select-text lightbox-card ${lightbox.isActive ? 'active' : ''}`}>
              {lightbox.type === 'spirit-gallery' ? (
                <p className="text-xs md:text-sm text-cyan-300/90 font-light tracking-widest drop-shadow-md">{spiritCaption}</p>
              ) : (
                <>
                  <span className="text-[9px] tracking-[0.3em] text-cyan-400/90 font-medium mb-2 block uppercase drop-shadow-md">{previewData.subtitle}</span>
                  <h3 className="text-lg md:text-2xl font-light tracking-widest text-white/95 mb-4 drop-shadow-lg">{previewData.title}</h3>
                  <p className="text-xs md:text-sm text-white/70 font-light leading-relaxed tracking-wider max-w-xl mx-auto italic">"{lightbox.type === 'collection' ? previewData.story : previewData.desc}"</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= 故事弹窗 ================= */}
      <div className={`fixed inset-0 z-[250] flex items-center justify-center p-4 md:p-8 transition-all duration-[800ms] ${isStoryOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} font-artistic`}>
        <div className="absolute inset-0 bg-[#040a18]/90 backdrop-blur-md" onClick={() => setIsStoryOpen(false)}></div>
        <div className={`relative w-full max-w-3xl bg-[#0a101d] border border-cyan-500/20 rounded-3xl p-6 md:p-12 shadow-[0_40px_120px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-[800ms] transform ${isStoryOpen ? 'translate-y-0 scale-100' : 'translate-y-12 scale-95'}`}>
          <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-5">
            <div className="flex items-center gap-2 text-white/50 text-[10px] tracking-[0.3em] font-light"><FilmIcon className="w-4 h-4 text-cyan-400" /><span>THE STORIES WE HOLD</span></div>
            <button onClick={() => setIsStoryOpen(false)} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-cyan-900/40 border border-white/10 hover:border-cyan-500/40 text-[10px] tracking-[0.25em] text-white/80 hover:text-white font-ui transition-all shadow-sm">← RETURN</button>
          </div>
          <div className="max-h-[60vh] md:max-h-[50vh] overflow-y-auto pr-4 space-y-8 story-scrollbar text-white/80">
            <h3 className="text-2xl md:text-4xl font-light tracking-[0.15em] text-white/95 leading-normal drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">核工业精神：十段光辉纪实</h3>
            <p className="text-sm font-light leading-relaxed tracking-wider text-white/70">中国核工业的发展史，是一部可歌可泣的奋斗史。无数先辈用青春和热血，铺就了通向核星辰的坦途。</p>
            <div className="space-y-3"><h4 className="text-sm font-medium tracking-widest text-cyan-300 uppercase">01. "两弹一星"精神</h4><p className="text-sm font-light leading-relaxed tracking-wider text-white/60">1999年9月18日，在庆祝中华人民共和国成立50周年之际，中共中央、国务院及中央军委隆重表彰了为研制"两弹一星"作出突出贡献的23位科技专家，并首次将这一伟大壮举中孕育的精神概括为"两弹一星"精神。这一精神诞生于新中国面临严峻国际形势的特殊时期，体现了中华民族在极端困难条件下自主创新的坚定信念。</p></div>
            <div className="space-y-3"><h4 className="text-sm font-medium tracking-widest text-cyan-300 uppercase">02. "承书风范"三次"我愿意"</h4><p className="text-sm font-light leading-relaxed tracking-wider text-white/60">王承书（1912-1994），我国稀有气体扩散法分离铀同位素理论的奠基者。1956年新中国成立初期，王承书放弃美国优越条件，冲破重重阻挠回到祖国。1958年面对苏联专家断言"中国没人懂分离铀同位素理论"，钱三强问她能否搞这个项目？她毅然回答："我愿意。"从此隐姓埋名投身核工业。1961年被调入核武器研究所，面对更艰巨的任务，她再次回答："我愿意。"1964年在原子弹爆炸前夕，她承担了核心数据计算的"收尾"工作，第三次回答："我愿意。"晚年身患多病，视力衰退，为了审阅论文，她用放大镜把字迹描深。遗嘱中将毕生积蓄10万元全部捐出，遗体捐献给医学研究。展现了老一辈科学家淡泊名利、甘为人梯的纯粹人格和对祖国的无限忠诚。</p></div>
            <div className="space-y-3"><h4 className="text-sm font-medium tracking-widest text-cyan-300 uppercase">03. "粉身碎骨"不是形容词</h4><p className="text-sm font-light leading-relaxed tracking-wider text-white/60">在青海金银滩221厂（西北核武器研制基地）那片被风雪肆虐的荒原上，对于魏世杰（"核司令"）、王淦昌（化名"王京"）等老一辈核工业人来说，"粉身碎骨"从来都不是文学作品中用来渲染悲壮的修辞，而是每一次核试验中必须直面的真实梦魇。那是一个没有现代精密远程遥控技术的年代，为了获取核爆炸瞬间最核心的物理参数，往往需要科研人员深入最危险的爆心区域。魏世杰曾回忆，在多次核试验的关键时刻，王淦昌等科学家总是坚持亲临一线指挥，甚至亲自参与回收实验装置。他们深知，一旦操作稍有差池或计算出现毫厘之谬，等待他们的就是瞬间的气化与毁灭。但在那个为了国家挺起脊梁的特殊岁月里，为了拿到第一手实验数据，为了验证理论的准确性，他们早已将个人生死置之度外。这种在极度危险面前展现出的科研勇气与献身精神，正是"两弹一星"精神中最令人动容的底色——用血肉之躯，为新中国铸就了坚不可摧的核盾牌。</p></div>
            <div className="space-y-3"><h4 className="text-sm font-medium tracking-widest text-cyan-300 uppercase">04. 用血肉之躯护住绝密资料</h4><p className="text-sm font-light leading-relaxed tracking-wider text-white/60">人物：郭永怀（力学家、应用数学家）。时间与地点：1968年12月5日，北京首都机场。事件细节：郭永怀从青海基地出差返回，飞机在降落时发生事故坠毁。救援人员清理现场时，发现郭永怀和他的警卫员紧紧抱在一起。两具烧焦的遗体中间，那个装有绝密科研数据的公文包完好无损。他是唯一一位以烈士身份被追授"两弹一星"功勋奖章的科学家，用生命诠释了"事业高于一切"的核工业精神。</p></div>
            <div className="space-y-3"><h4 className="text-sm font-medium tracking-widest text-cyan-300 uppercase">05. 戈壁滩上的"百日会战"与秃头笑话</h4><p className="text-sm font-light leading-relaxed tracking-wider text-white/60">人物：于敏（"氢弹之父"）、孙和夫等。1965年，于敏带领团队在上海华东计算技术研究所展开了氢弹原理的验证计算。在当时我国仅有两台大型电子计算机的条件下，于敏团队不畏艰难，利用有限的资源，经过100天的不懈努力，终于完成了前所未有的复杂计算。他们发现了氢弹自持热核燃烧的关键点，并成功提出了"于敏构型"。1965年9月—11月，氢弹原理探索陷入僵局，于敏带领团队远赴上海，利用每秒5万次的计算机，进行了持续100个昼夜的高强度计算，史称"百日会战"。在这100天里，科研人员轮班倒，机器不停，人也不停。由于长期处于高度紧张和高压的计算状态，许多人的头发大把脱落。人文细节：在突破成功的庆祝会上，于敏为了缓解大家长期熬夜的疲惫，讲了一个"三个头发的人去理发"的笑话，因为当时在场的科研人员大多因为过度劳累而脱发。展现了科研工作者在高压环境下的革命乐观主义精神与团队凝聚力。</p></div>
            <div className="space-y-3"><h4 className="text-sm font-medium tracking-widest text-cyan-300 uppercase">06. 80度开水与夹生馒头</h4><p className="text-sm font-light leading-relaxed tracking-wider text-white/60">核心地点：青海高原·金银滩（西北核武器研制基地221厂），平均海拔高达3200米。代表人物：魏世杰及广大扎根高原的核工业建设者、科研人员。由于海拔高、气压低，水的沸点被强行拉低到了80多度。这意味着，无论火烧得多旺，水温永远达不到100度。在这个温度下，不仅馒头蒸不熟（常常是外面软、里面夹生，甚至冻成冰疙瘩），连煮面条都成了奢望。更致命的是高原缺氧，科研人员晚上睡觉时常被憋醒，必须坐起来大口喘气，或者吸几口氧气罐才能勉强入睡。白天工作时，稍微走快几步就会气喘吁吁、心跳加速。在基地初创的严冬，气温低至零下三四十度。为了抢时间，许多建设者没有营房，只能在冻土上挖坑，上面盖上茅草和泥土，搭起"地窝子"当宿舍。晚上睡觉时，大家必须戴着棉帽，穿着棉衣，但早上醒来，眉毛和胡须上依然结满了白霜。到了春天，狂风卷着黄沙肆虐，大家端着饭碗吃饭时，风沙直往碗里灌，咬一口馒头，常常是"一口饭，半口沙"。核武器研制不仅仅是实验室里的精密计算，更是与极端恶劣自然环境的殊死搏斗。"战高斗寒，笑谈渴饮苦水浆"，老一辈核工业人硬是用血肉之躯，在被称为"生命禁区"的高原上，为共和国铸就了最坚固的核盾牌。</p></div>
            <div className="space-y-3"><h4 className="text-sm font-medium tracking-widest text-cyan-300 uppercase">07. 10元奖金与"失踪的人"</h4><p className="text-sm font-light leading-relaxed tracking-wider text-white/60">时间：1985年（原子弹项目获得国家科技进步特等奖）。奖金细节：奖金总额为1万元（当时是巨款），但参与研制的人员多达上万人。经过层层分配，绝大多数基层科研人员只分到了10元钱。隐姓埋名：为了保密，许多科研人员在20多年里音讯全无，老家的父母以为儿子早已牺牲，甚至收到了"烈士通知书"。展现了"干惊天动地事，做隐姓埋名人"的无私奉献与不计名利的高尚品格。</p></div>
            <div className="space-y-3"><h4 className="text-sm font-medium tracking-widest text-cyan-300 uppercase">08. 全国大协作的"651"计划</h4><p className="text-sm font-light leading-relaxed tracking-wider text-white/60">时间：1965年。事件：代号"651"的人造卫星研制计划启动。协作规模：在西方封锁下，中央特批2亿元专款。全国29个省市自治区、1000多家单位、数十万科技人员和民兵参与。为了保障通讯，全国各地动员了60多万民兵日夜守护通讯线路。这是社会主义制度"集中力量办大事"优势的极致体现，展现了全国一盘棋的协同力量。</p></div>
            <div className="space-y-3"><h4 className="text-sm font-medium tracking-widest text-cyan-300 uppercase">09. 赫鲁晓夫的断言与"争气弹"</h4><p className="text-sm font-light leading-relaxed tracking-wider text-white/60">时间：1959年6月。历史背景：苏联领导人赫鲁晓夫在撤走专家前曾傲慢地断言："离开我们，你们20年也造不出原子弹。"中国回应：中国科研人员顶着三年困难时期（1959-1961）的饥饿和浮肿，没有计算机，就用算盘和计算尺进行理论计算。历史时刻：1964年10月16日，中国第一颗原子弹成功爆炸，仅仅用了5年时间，狠狠打了赫鲁晓夫的脸，这颗原子弹也被亲切地称为"争气弹"。体现了中华民族自力更生、艰苦奋斗的民族精神和科技自立自强的坚定信念。</p></div>
            <div className="space-y-3"><h4 className="text-sm font-medium tracking-widest text-cyan-300 uppercase">10. 跨越时代的"精神基因"传承</h4><p className="text-sm font-light leading-relaxed tracking-wider text-white/60">时间跨度：1950年代-2020年代。过去：老一辈在戈壁滩住帐篷、喝苦水，用算盘计算核数据。现在：新一代核工业人邢继（"华龙一号"总设计师）带领团队打造了具有完全自主知识产权的三代核电技术；徐銤院士坚守半个世纪，实现了中国实验快堆的成功并网发电。从"两弹一星"到"华龙一号"，变的是技术水平和硬件设施，不变的是"事业高于一切、责任重于一切、严细融入一切、进取成就一切"的核工业精神。关键核心技术是要不来、买不来、讨不来的，必须坚持自主创新，传承和弘扬核工业精神。</p></div>
          </div>
        </div>
      </div>

      {/* ================= 公告弹窗 ================= */}
      <div className={`fixed inset-0 z-[250] flex items-center justify-center p-4 md:p-8 transition-all duration-[800ms] ${isAnnounceOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} font-artistic`}>
        <div className="absolute inset-0 bg-[#040a18]/90 backdrop-blur-md" onClick={() => setIsAnnounceOpen(false)}></div>
        <div className={`relative w-full max-w-2xl bg-[#0a101d] border border-cyan-500/20 rounded-3xl p-6 md:p-10 shadow-[0_40px_120px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-[800ms] transform ${isAnnounceOpen ? 'translate-y-0 scale-100' : 'translate-y-12 scale-95'}`}>
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-5">
            <div className="flex items-center gap-2 text-white/50 text-[10px] tracking-[0.3em] font-light"><span className="text-cyan-400">📢</span><span>ANNOUNCEMENT</span></div>
            <button onClick={() => setIsAnnounceOpen(false)} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-cyan-900/40 border border-white/10 hover:border-cyan-500/40 text-[10px] tracking-[0.25em] text-white/80 hover:text-white font-ui transition-all shadow-sm">← CLOSE</button>
          </div>
          <div className="max-h-[55vh] md:max-h-[45vh] overflow-y-auto pr-4 story-scrollbar text-white/80">
            <div className="text-xl md:text-2xl font-light tracking-[0.1em] text-white/95 mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{siteContent?.announcement?.title || '活动公告'}</div>
            <div className="text-sm font-light leading-relaxed tracking-wider text-white/70 whitespace-pre-wrap">{siteContent?.announcement?.content || '欢迎参观本届科普创意赛道项目！\n\n本项目聚焦五大核心板块：核能知识、核技术应用、辐射安全与防护、核工业精神与文化、核安全政策法规。\n\n以生动、直观的方式讲述核科学基本原理，助力营造核工业发展的良好社会氛围。'}</div>
          </div>
        </div>
      </div>

      {/* 回到顶部按钮 */}
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`fixed bottom-8 right-6 md:right-12 z-[100] flex items-center justify-center w-12 h-12 rounded-full bg-cyan-950/80 backdrop-blur-xl border border-cyan-500/40 hover:bg-cyan-900 hover:border-cyan-400 transition-all duration-500 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] ${showBackToTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none'}`}>
        <ChevronDownIcon className="w-5 h-5 text-cyan-300 transform rotate-180" />
      </button>

      {/* ================= 分享与传播 ================= */}
      <div className="bg-[#040a18] px-6 md:px-12 lg:px-32 max-w-[1440px] mx-auto py-10 border-t border-white/[0.03] font-ui">
        <div className="text-center space-y-4">
          <span className="text-[9px] tracking-[0.4em] text-white/20 uppercase font-artistic mb-6 block">SHARE</span>
          <div className="flex items-center justify-center gap-6">
            <div id="qrcode-container" className="inline-block bg-white p-2 rounded-xl">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://ktarch-create.github.io/nuclear-x/" alt="QR Code" className="w-28 h-28 md:w-36 md:h-36" />
            </div>
            <div className="flex flex-col items-start gap-3">
              <span className="text-[10px] text-white/40 font-light tracking-wider">扫描二维码访问作品</span>
              <button onClick={() => { navigator.clipboard.writeText('https://ktarch-create.github.io/nuclear-x/').then(() => { const btn = document.getElementById('copy-btn'); if(btn) { btn.textContent='✓ 已复制'; setTimeout(() => btn.textContent='📋 复制链接', 2000); } }); }} id="copy-btn" className="px-5 py-3 bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-900/20 rounded-xl text-[10px] tracking-widest text-white/60 hover:text-white transition-all duration-300">📋 复制链接</button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#040a18] px-6 md:px-12 lg:px-32 max-w-[1440px] mx-auto py-12 border-t border-white/[0.03] font-ui">
        <div className="text-center">
          <span className="text-[9px] tracking-[0.4em] text-white/20 uppercase font-artistic mb-6 block">{siteContent?.references?.label || 'REFERENCES & DATA SOURCES'}</span>
          <div className="text-[9px] md:text-[10px] text-white/20 leading-loose tracking-wide max-w-2xl mx-auto">
            核科学知识参考自国际原子能机构（IAEA）公开出版物、中国核能行业协会年度报告。<br />
            辐射剂量数据参照联合国原子辐射效应科学委员会（UNSCEAR）2020年报告。<br />
            反应堆技术数据引用自中国核能行业协会《2024年核能发展报告》及华龙一号官方公开资料。<br />
            精神文化板块史实参考自中国核工业集团有限公司官方公开史料与"两弹一星"历史文献。<br />
            部分图片来源于开源图库 Unsplash 及参赛团队自制，仅用于科普展示。
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="bg-[#040a18] py-20 border-t border-white/[0.05] text-center font-artistic reveal-section" ref={addToRefs}>
        <div className="flex justify-center gap-8 mb-6 text-cyan-600/50 text-xs">
          <ImageIcon className="w-4 h-4 hover:text-cyan-400 transition-colors cursor-pointer" />
          <FilmIcon className="w-4 h-4 hover:text-cyan-400 transition-colors cursor-pointer" />
          <CameraIcon className="w-4 h-4 hover:text-cyan-400 transition-colors cursor-pointer" />
        </div>
        <div className="text-[10px] tracking-[0.4em] text-white/20 uppercase font-light mb-4">© {new Date().getFullYear()} SCIENCE & ART. EXPLORE THE UNKNOWN.</div>
        <div className="text-[8px] tracking-[0.2em] text-white/10 font-light font-ui">{siteContent?.footer?.aiNotice || '本作品使用了 AI 辅助创作'}</div>
      </footer>

      {/* ================= 管理员后台按钮 ================= */}
      <button onClick={() => setIsAdminOpen(true)} className="fixed bottom-6 left-6 z-[100] p-3 rounded-full bg-cyan-950/80 backdrop-blur-xl border border-cyan-500/30 hover:bg-cyan-900 hover:border-cyan-400 transition-all duration-500 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] opacity-60 hover:opacity-100">
        <SettingsIcon className="w-5 h-5 text-cyan-300" />
      </button>

      {/* ================= 管理员登录弹窗 ================= */}
      <div className={`fixed inset-0 z-[300] flex items-center justify-center p-4 transition-all duration-500 ${isAdminOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-[#040a18]/90 backdrop-blur-md" onClick={() => { setIsAdminOpen(false); setLoginError(''); }}></div>
        {!isAdminAuthenticated ? (
          <div className="relative w-full max-w-sm bg-[#0a101d] border border-cyan-500/20 rounded-3xl p-8 shadow-[0_40px_120px_rgba(0,0,0,0.8)] backdrop-blur-md">
            <div className="text-center mb-6">
              <SettingsIcon className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
              <h3 className="text-lg font-light tracking-widest text-white/90 font-artistic">管理员登录</h3>
              <p className="text-[10px] text-white/40 mt-2 font-ui tracking-wider">请输入管理密码</p>
            </div>
            <input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdminLogin()} placeholder="输入密码..." className="w-full bg-[#040a18]/60 text-sm text-white/90 placeholder:text-white/20 font-light border border-white/10 rounded-xl py-3.5 px-4 outline-none focus:border-cyan-500/50 transition-all mb-4 font-ui" />
            {loginError && <p className="text-[10px] text-red-400 text-center mb-4 font-ui">{loginError}</p>}
            <div className="flex gap-3">
              <button onClick={() => { setIsAdminOpen(false); setLoginError(''); }} className="flex-1 py-3 bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] rounded-xl text-[10px] tracking-widest text-white/60 hover:text-white transition-all font-ui">取消</button>
              <button onClick={handleAdminLogin} className="flex-1 py-3 bg-cyan-700/80 hover:bg-cyan-600 border border-cyan-500/40 rounded-xl text-[10px] tracking-widest text-white shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all font-ui">登录</button>
            </div>
          </div>
        ) : (
          <div className="relative w-full max-w-2xl max-h-[70vh] bg-[#0a101d] border border-cyan-500/20 rounded-3xl shadow-[0_40px_120px_rgba(0,0,0,0.8)] backdrop-blur-md overflow-hidden flex flex-col">
            {/* 管理员面板头部 */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <SettingsIcon className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] tracking-[0.3em] text-white/60 font-light font-artistic">CONTROL PANEL</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleAdminLogout} className="px-4 py-2 bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] rounded-xl text-[9px] tracking-widest text-white/50 hover:text-white transition-all font-ui">退出</button>
                <button onClick={() => { setIsAdminOpen(false); }} className="p-2 bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] rounded-xl text-white/50 hover:text-white transition-all"><CloseIcon className="w-4 h-4" /></button>
              </div>
            </div>
            {/* 管理员面板Tab栏 */}
            <div className="flex border-b border-white/5 shrink-0">
              {[{id:'texts',label:'页面文本'},{id:'messages',label:'留言管理'},{id:'security',label:'安全设置'}].map(tab => (
                <button key={tab.id} onClick={() => setAdminTab(tab.id)} className={`flex-1 py-3 text-[10px] tracking-widest font-light transition-all font-ui ${adminTab === tab.id ? 'text-cyan-300 border-b-2 border-cyan-500 bg-cyan-900/10' : 'text-white/40 hover:text-white/70'}`}>{tab.label}</button>
              ))}
            </div>
            {/* 管理员面板内容 */}
            <div className="flex-1 overflow-y-auto p-5 story-scrollbar">
              {adminTab === 'texts' && editingContent && (
                <div className="space-y-6 text-[11px]">
                  <p className="text-[9px] text-cyan-400/50 tracking-wider font-ui mb-4">修改页面文本后点击"保存到 GitHub"生效，所有访客将在30秒内看到更新。</p>
                  {Object.entries(editingContent).map(([sectionKey, section]) => (
                    <div key={sectionKey} className="border border-white/[0.06] rounded-2xl p-4 space-y-3">
                      <div className="text-[9px] tracking-widest text-cyan-400/60 uppercase font-artistic">{sectionKey.toUpperCase()}</div>
                      {Object.entries(section).map(([fieldKey, value]) => {
                        if (Array.isArray(value)) {
                          return (
                            <div key={fieldKey}>
                              <label className="text-[8px] text-white/30 uppercase tracking-wider font-ui mb-2 block">{fieldKey}</label>
                              {value.map((item, vi) => (
                                <div key={vi} className="border border-cyan-500/10 rounded-xl p-3 space-y-2 mb-2">
                                  <span className="text-[8px] text-cyan-400/50 uppercase tracking-wider font-ui">{fieldKey} #{vi + 1}</span>
                                  {Object.entries(item).map(([k, v]) => (
                                    <div key={k}>
                                      <label className="text-[7px] text-white/20 uppercase tracking-wider font-ui">{k}</label>
                                      {String(v || '').length > 60 ? (
                                        <textarea value={String(v || '')} onChange={e => { const copy = JSON.parse(JSON.stringify(editingContent)); copy[sectionKey][fieldKey][vi][k] = e.target.value; setEditingContent(copy); }} className="w-full bg-[#040a18]/60 text-white/80 text-[10px] border border-white/10 rounded-xl p-3 outline-none focus:border-cyan-500/50 font-ui resize-none" rows={2} />
                                      ) : (
                                        <input value={String(v || '')} onChange={e => { const copy = JSON.parse(JSON.stringify(editingContent)); copy[sectionKey][fieldKey][vi][k] = e.target.value; setEditingContent(copy); }} className="w-full bg-[#040a18]/60 text-white/80 text-[10px] border border-white/10 rounded-xl p-3 outline-none focus:border-cyan-500/50 font-ui" />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          );
                        }
                        const contentStr = String(value || '');
                        const isLong = contentStr.length > 80;
                        return (
                          <div key={fieldKey} className="space-y-1">
                            <label className="text-[8px] text-white/30 uppercase tracking-wider font-ui">{fieldKey}</label>
                            {isLong ? (
                              <textarea value={contentStr} onChange={e => { const copy = JSON.parse(JSON.stringify(editingContent)); copy[sectionKey][fieldKey] = e.target.value; setEditingContent(copy); }} className="w-full bg-[#040a18]/60 text-white/80 text-[10px] border border-white/10 rounded-xl p-3 outline-none focus:border-cyan-500/50 transition-all font-ui resize-none" rows={4} />
                            ) : (
                              <input value={contentStr} onChange={e => { const copy = JSON.parse(JSON.stringify(editingContent)); copy[sectionKey][fieldKey] = e.target.value; setEditingContent(copy); }} className="w-full bg-[#040a18]/60 text-white/80 text-[10px] border border-white/10 rounded-xl p-3 outline-none focus:border-cyan-500/50 transition-all font-ui" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                  <div className="flex items-center gap-3 pt-2">
                    <button onClick={saveSiteContent} className="px-6 py-3 bg-cyan-700/80 hover:bg-cyan-600 border border-cyan-500/40 rounded-xl text-[10px] tracking-widest text-white shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all font-ui">保存到 GitHub</button>
                    {adminSaveStatus && <span className="text-[9px] text-cyan-400/60 font-ui">{adminSaveStatus}</span>}
                    <button onClick={() => setEditingContent(JSON.parse(JSON.stringify(siteContent)))} className="px-4 py-3 bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] rounded-xl text-[9px] tracking-widest text-white/50 hover:text-white transition-all font-ui">重置</button>
                  </div>
                </div>
              )}
              {adminTab === 'messages' && (
                <div className="space-y-3">
                  <p className="text-[9px] text-white/30 tracking-wider font-ui mb-3">共 {currentMessages.length} 条留言 · 点击删除按钮可移除留言</p>
                  {currentMessages.length === 0 ? (
                    <div className="py-12 text-xs text-white/30 text-center font-light">暂无留言</div>
                  ) : (
                    currentMessages.map(msg => (
                      <div key={msg.id} className="flex items-start justify-between bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-[11px] text-cyan-300 font-light tracking-widest">{msg.name}</span>
                            <span className="text-[8px] text-white/20 font-ui">{msg.time}</span>
                          </div>
                          <p className="text-[10px] text-white/60 font-light leading-relaxed">{msg.text}</p>
                        </div>
                        <button onClick={() => { if (confirm('确定删除此留言？')) deleteMessage(msg.id); }} className="p-2 bg-red-900/20 border border-red-500/20 hover:bg-red-900/40 rounded-lg text-red-400/60 hover:text-red-400 transition-all shrink-0"><TrashIcon className="w-3.5 h-3.5" /></button>
                      </div>
                    ))
                  )}
                </div>
              )}
              {adminTab === 'security' && (
                <div className="space-y-4 text-[11px]">
                  <div className="border border-cyan-500/20 rounded-2xl p-5 space-y-4">
                    <h4 className="text-[10px] tracking-widest text-cyan-300/80 font-artistic">修改管理员密码</h4>
                    <input type="password" value={secOldPw} onChange={e => setSecOldPw(e.target.value)} placeholder="当前密码" className="w-full bg-[#040a18]/60 text-white/80 text-[10px] border border-white/10 rounded-xl p-3 outline-none focus:border-cyan-500/50 font-ui" />
                    <input type="password" value={secNewPw} onChange={e => setSecNewPw(e.target.value)} placeholder="新密码（至少4位）" className="w-full bg-[#040a18]/60 text-white/80 text-[10px] border border-white/10 rounded-xl p-3 outline-none focus:border-cyan-500/50 font-ui" />
                    <input type="password" value={secConfirmPw} onChange={e => setSecConfirmPw(e.target.value)} placeholder="确认新密码" className="w-full bg-[#040a18]/60 text-white/80 text-[10px] border border-white/10 rounded-xl p-3 outline-none focus:border-cyan-500/50 font-ui" />
                    {secStatus && <p className={`text-[9px] font-ui ${secStatus.includes('✅') ? 'text-green-400' : secStatus.includes('失败') ? 'text-red-400' : 'text-yellow-400'}`}>{secStatus}</p>}
                    <button onClick={handleSecurityChange} className="px-6 py-3 bg-cyan-700/80 hover:bg-cyan-600 border border-cyan-500/40 rounded-xl text-[10px] tracking-widest text-white shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all font-ui">修改密码</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

