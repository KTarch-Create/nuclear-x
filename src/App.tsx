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
    setEnergyGenerated(0); setFissionLevel("稳定态");
    const atomCount = game.width < 500 ? 12 : (game.width < 1024 ? 25 : 35);
    for (let i = 0; i < atomCount; i++) {
      game.atoms.push({ x: Math.random() * (game.width - 40) + 20, y: Math.random() * (game.height - 40) + 20, radius: 12, active: true, wobble: Math.random() * Math.PI * 2 });
    }
  };

  const startEngine = () => {
    if (started) return;
    setStarted(true);
    const game = gameRef.current;
    game.running = true;
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
        if (hit || n.x < 0 || n.x > game.width || n.y < 0 || n.y > game.height) game.neutrons.splice(i, 1);
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
      game.rafId = requestAnimationFrame(gameLoop);
    };
    game.rafId = requestAnimationFrame(gameLoop);
  };

  const handleCanvasClick = (e) => {
    const game = gameRef.current;
    if (!game.running) { startEngine(); return; }
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
      <canvas ref={canvasRef} onClick={handleCanvasClick} className="w-full h-full flex-1 cursor-crosshair z-0" />
      <div className="absolute bottom-0 left-0 w-full p-4 flex justify-between items-end z-10 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
        <span className="text-[10px] text-white/40 tracking-widest font-ui w-2/3 leading-relaxed"><strong className="text-cyan-400">操作说明:</strong> 点击画面发射高能中子，轰击原子核以触发裂变链式反应。</span>
        {started && <button onClick={initGame} className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-cyan-900/40 border border-white/10 hover:border-cyan-500/50 rounded-full transition-all text-[10px] text-white/80 hover:text-white"><RefreshIcon className="w-3.5 h-3.5" /><span>重置</span></button>}
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
      const w = canvas.width, h = canvas.height;
      const shieldX = w * 0.55;
      ctx.clearRect(0, 0, w, h);
      eng.frame++;

      ctx.beginPath(); ctx.arc(40, h/2, 28, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fill();
      ctx.strokeStyle = ray.color; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.arc(40, h/2, 8, 0, Math.PI*2);
      ctx.fillStyle = ray.color; ctx.fill();

      if (shield.id !== 'none') {
        ctx.fillStyle = shield.color;
        ctx.fillRect(shieldX, h*0.05, shield.thick, h*0.9);
        ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fillRect(shieldX, h*0.05, 3, h*0.9);
        ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(shield.name, shieldX + shield.thick/2, h - 8);
      }

      const detX = w - 45;
      ctx.beginPath(); ctx.moveTo(detX, h*0.15); ctx.lineTo(detX+20, h*0.15);
      ctx.lineTo(detX+20, h*0.85); ctx.lineTo(detX, h*0.85); ctx.closePath();
      ctx.fillStyle = 'rgba(6,182,212,0.08)'; ctx.fill();
      ctx.strokeStyle = 'rgba(6,182,212,0.3)'; ctx.stroke();

      if (eng.frame % (ray.id === 'gamma' ? 2 : 4) === 0) {
        eng.particles.push({ x: 40, y: h/2 + (Math.random()-0.5)*50, baseY: h/2 + (Math.random()-0.5)*50, vx: ray.speed, size: ray.size * (0.5 + Math.random()), trail: [], angle: Math.random()*Math.PI*2 });
      }

      for (let i = eng.particles.length - 1; i >= 0; i--) {
        const p = eng.particles[i];
        if (ray.id === 'gamma') { p.angle += 0.15; p.y = p.baseY + Math.sin(p.angle)*12; }
        p.x += p.vx; p.trail.push({x:p.x, y:p.y});
        if (p.trail.length > 6) p.trail.shift();
        if (p.x + p.size >= shieldX && p.x <= shieldX + shield.thick && shield.id !== 'none' && isBlockedBy(ray.id, shield.id)) {
          eng.blk++; eng.particles.splice(i, 1); continue;
        }
        for (let t = 0; t < p.trail.length-1; t++) {
          ctx.beginPath(); ctx.arc(p.trail[t].x, p.trail[t].y, p.size*(t/p.trail.length)*0.5, 0, Math.PI*2);
          ctx.fillStyle = ray.color.replace(')', `,${(t/p.trail.length)*0.2})`).replace('rgb', 'rgba');
          ctx.fill();
        }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fillStyle = ray.color; ctx.fill();
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
          <span className="text-[9px] text-white/30 font-ui">穿透 <strong className="text-cyan-400">{penetrated}</strong></span>
          <span className="text-[9px] text-white/30 font-ui">阻挡 <strong className="text-red-400">{blocked}</strong></span>
        </div>
      </div>
      <div className="relative w-full h-[280px] md:h-[360px] bg-[#02050a] border border-white/10 rounded-2xl overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full z-0" />
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
              <button key={r.id} onClick={() => setActiveRay(r.id)}
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
              <button key={s.id} onClick={() => setActiveShield(s.id)}
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
  { id: 'knowledge', num: '1', title: '核能知识', desc: '裂变、聚变与反应堆的微观宇宙' },
  { id: 'application', num: '2', title: '核技术应用', desc: '医疗、工业与农业的跨界造福' },
  { id: 'safety', num: '3', title: '辐射安全', desc: '理性认知，科学护航日常生活' },
  { id: 'spirit', num: '4', title: '精神传承', desc: '两弹一星与核潜艇的奋斗史' },
  { id: 'policy', num: '5', title: '政策法规', desc: '原子能法与核安全观深度解读' },
  { id: 'album', num: '6', title: '全景图集', desc: '探索多维度的核能高光瞬间' },
  { id: 'forum', num: '7', title: '读者畅想', desc: '思想碰撞，分享您对未来的见解' }
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

const DEFAULT_COLLECTION = [
  { id: "photo-1", title: "天然辐射与剂量", category: "安全与防护", subtitle: "NATURAL RADIATION", image: "https://images.unsplash.com/photo-1506744626753-1fa28f67ea1c?auto=format&fit=crop&w=1000&q=85", story: "宇宙射线、脚下的土壤，甚至你吃下的香蕉都带有天然辐射。" },
  { id: "photo-2", title: "防护三原则", category: "安全与防护", subtitle: "SAFETY PRINCIPLES", image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=1000&q=85", story: "时间、距离、屏蔽——这是辐射防护的三大铁律，构筑坚不可摧的安全防线。" },
  { id: "photo-3", title: "戈壁的丰碑", category: "工业精神", subtitle: "TWO BOMBS", image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1000&q=85", story: "隐姓埋名数十载，老一辈核工业人为共和国铸就了不屈的脊梁。" },
  { id: "photo-4", title: "深潜报国", category: "工业精神", subtitle: "SCIENTIST FOOTPRINTS", image: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=1000&q=85", story: "核工业科学家们的感人事迹，让中国核事业从无到有，劈波斩浪。" },
  { id: "photo-5", title: "环境治理", category: "技术应用", subtitle: "ENVIRONMENT", image: "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=1000&q=85", story: "利用电子束处理废水，核技术在环保领域发挥着交叉研究价值。" },
  { id: "photo-6", title: "同位素技术", category: "技术应用", subtitle: "ISOTOPE TRACING", image: "https://images.unsplash.com/photo-1555664424-778a1e5e3b48?auto=format&fit=crop&w=1000&q=85", story: "同位素示踪技术被广泛应用于医学和水文学，揭示物质循环路径。" }
];

const DEFAULT_MESSAGES = [
  { id: 101, name: "青年学者", text: "探讨和畅想是非常必要的。核能不仅仅是硬核技术，更是关乎人类命运共同体的重大议题，期待论坛中能看到更多有趣的观点！", time: "2026-06-15 19:42" },
  { id: 102, name: "未来探索者", text: "极具质感的设计让人能沉下心来阅读硬核的科普内容。非常期待第四代反应堆的商业化应用，清洁能源普及指日可待！", time: "2026-06-16 09:15" }
];

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

  // 后台系统状态
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [adminTab, setAdminTab] = useState('gallery');
  const [editingItemId, setEditingItemId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', subtitle: '', image: '', desc: '', story: '', category: '' });

  // 动态数据挂载（安全读取）
  const [galleryItems, setGalleryItems] = useState(() => safeGetStorage('nuke_gallery_items', DEFAULT_GALLERY));
  const [collectionPhotos, setCollectionPhotos] = useState(() => safeGetStorage('nuke_collection_photos', DEFAULT_COLLECTION));
  const [messages, setMessages] = useState(() => safeGetStorage('nuke_guest_messages', DEFAULT_MESSAGES));

  const [lightbox, setLightbox] = useState({ isOpen: false, isActive: false, type: null, item: null, index: null });
  const [activePhotoCategory, setActivePhotoCategory] = useState('安全与防护');
  
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
  const currentCollection = Array.isArray(collectionPhotos) ? collectionPhotos : DEFAULT_COLLECTION;
  const currentMessages = Array.isArray(messages) ? messages : DEFAULT_MESSAGES;

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
  }, [currentGallery, currentCollection]);

  // ================= 开幕标题卡自动消失 =================
  useEffect(() => {
    if (!showSplash) return;
    const splashTimer = setTimeout(() => setShowSplash(false), 6200);
    return () => clearTimeout(splashTimer);
  }, [showSplash]);

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
      if (lightbox.type === 'collection') {
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
    
    setNickname(''); setContent(''); setFormError({ name: false, text: false });
  };

  const filteredPhotos = currentCollection.filter(p => p.category === activePhotoCategory);

  const openLightboxSilky = (type, item = null, index = null) => {
    setLightbox({ isOpen: true, isActive: false, type, item, index });
    setTimeout(() => setLightbox(prev => ({ ...prev, isActive: true })), 50);
  };
  const closeLightboxSilky = () => {
    setLightbox(prev => ({ ...prev, isActive: false }));
    setTimeout(() => setLightbox({ isOpen: false, isActive: false, type: null, item: null, index: null }), 600);
  };
  const handlePrevPhoto = () => { if (lightbox.type === 'collection') setLightbox(prev => ({ ...prev, index: prev.index === 0 ? filteredPhotos.length - 1 : prev.index - 1 })); };
  const handleNextPhoto = () => { if (lightbox.type === 'collection') setLightbox(prev => ({ ...prev, index: prev.index === filteredPhotos.length - 1 ? 0 : prev.index + 1 })); };
  const previewData = lightbox.type === 'gallery' ? lightbox.item : filteredPhotos[lightbox.index];

  const handleAdminLogin = (e) => {
    if (e) e.preventDefault(); 
    if (adminPassword.trim() === '666') { 
      setIsAdminAuthenticated(true); 
      setLoginError(false); 
      setAdminPassword(''); 
    } else { 
      setLoginError(true); 
    }
  };
  const handleAdminLogout = () => { setIsAdminAuthenticated(false); setIsAdminOpen(false); };

  const deleteGuestMessage = (id) => {
    const updated = currentMessages.filter(item => item.id !== id);
    setMessages(updated);
    safeSetStorage('nuke_guest_messages', updated);
  };
  const startEditing = (item) => {
    setEditingItemId(item.id);
    setEditForm({ title: item.title||'', subtitle: item.subtitle||'', image: item.image||'', desc: item.desc||'', story: item.story||'', category: item.category||'' });
  };
  const saveGalleryEdit = (id) => {
    const updated = currentGallery.map(item => item.id === id ? { ...item, ...editForm } : item);
    setGalleryItems(updated);
    safeSetStorage('nuke_gallery_items', updated);
    setEditingItemId(null);
  };
  const saveCollectionEdit = (id) => {
    const updated = currentCollection.map(item => item.id === id ? { ...item, ...editForm } : item);
    setCollectionPhotos(updated);
    safeSetStorage('nuke_collection_photos', updated);
    setEditingItemId(null);
  };
  const addNewCollectionPhoto = () => {
    const newPhoto = {
      id: 'photo-' + Date.now(), title: "未命名瞬间", subtitle: "NEW SPARK", category: "安全与防护",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85", story: "在此编辑内容..."
    };
    const updated = [newPhoto, ...currentCollection];
    setCollectionPhotos(updated);
    safeSetStorage('nuke_collection_photos', updated);
    startEditing(newPhoto);
  };
  const deleteCollectionPhoto = (id) => {
    const updated = currentCollection.filter(item => item.id !== id);
    setCollectionPhotos(updated);
    safeSetStorage('nuke_collection_photos', updated);
  };

  const scrollToAnchor = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; 
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
      setIsSidebarOpen(false); 
    }
  };

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
            </div>
            <div className="mt-12 text-[9px] tracking-[0.3em] text-white/20 animate-pulse splash-item" style={{ animation: 'fadeInUp 1s ease 1.2s forwards' }}>
              点击任意处或等待 4 秒进入
            </div>
          </div>
          <style>{`@keyframes fadeInUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } } .splash-item { opacity: 0; transform: translateY(20px); }`}</style>
        </div>
      )}

      <div className="min-h-screen bg-[#040a18] text-white selection:bg-cyan-500/30 selection:text-white overflow-x-hidden font-ui relative">
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
          <span className="hidden md:block text-[7px] tracking-[0.15em] text-white/15 font-light">第十一届高校学生课外"核+X"创意大赛 · 重庆理工大学 · 核光纪元</span>
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
              <span className="text-[9px] tracking-[0.3em] text-cyan-100/80 uppercase">SECT 1. 核能知识</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-light tracking-[0.15em] text-white mb-6">核能知识的微观宇宙</h2>
            <p className="text-xs md:text-sm font-light text-white/50 leading-relaxed max-w-2xl mx-auto tracking-widest italic">
              "科学的边界，是对未知的无畏探索；<br className="md:hidden" />核能的真谛，是造福人类的无尽光芒。"
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
            {currentGallery.slice(0, 2).map((item, index) => (
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

            {/* 核聚变原理 + 核电安全 + 燃料循环 三合一知识卡片 */}
            <section ref={addToRefs} className="reveal-section w-full mt-4">
              <div className="flex items-center gap-3 mb-8 justify-center">
                <div className="h-px w-8 bg-cyan-500/30"></div>
                <span className="text-[10px] tracking-[0.3em] text-cyan-400/60 font-light uppercase">SCIENCE SPOTLIGHT</span>
                <div className="h-px w-8 bg-cyan-500/30"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.06] hover:border-cyan-500/30 rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 group">
                  <div className="text-3xl mb-4">☀️</div>
                  <h3 className="text-base font-light tracking-widest text-white/90 mb-3 group-hover:text-cyan-300 transition-colors">核聚变原理</h3>
                  <p className="text-xs text-white/50 font-light leading-relaxed group-hover:text-white/70 transition-colors">
                    核聚变是两个轻原子核（如氘和氚）在极高温度（上亿摄氏度）下聚合为较重的氦核，同时释放巨大能量的过程。太阳内部每秒钟约有6.2亿吨氢聚变成6.16亿吨氦，亏损的质量转化为辐射能——这也是太阳耀眼的根源。<br/><br/>
                    与核裂变不同，聚变产物是稳定的氦，几乎不产生放射性废物。国际热核聚变实验堆（ITER）计划正致力于实现可控核聚变，有望为人类提供近乎无限的清洁能源。
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.06] hover:border-cyan-500/30 rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 group">
                  <div className="text-3xl mb-4">🛡️</div>
                  <h3 className="text-base font-light tracking-widest text-white/90 mb-3 group-hover:text-cyan-300 transition-colors">纵深防御 · 多重屏障</h3>
                  <p className="text-xs text-white/50 font-light leading-relaxed group-hover:text-white/70 transition-colors">
                    核电安全运行的核心是"纵深防御"理念——设置五重防线：燃料芯块本身 → 燃料包壳 → 反应堆压力容器 → 安全壳 → 厂外应急计划。任何单一故障都不会导致放射性物质外泄。<br/><br/>
                    以中国"华龙一号"为例，其采用双层安全壳设计，可抵御商用大飞机撞击和9级地震，实现了从设计上消除大规模放射性释放的安全目标。
                  </p>
                </div>
                <div className="bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.06] hover:border-cyan-500/30 rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 group">
                  <div className="text-3xl mb-4">⚙️</div>
                  <h3 className="text-base font-light tracking-widest text-white/90 mb-3 group-hover:text-cyan-300 transition-colors">核燃料循环</h3>
                  <p className="text-xs text-white/50 font-light leading-relaxed group-hover:text-white/70 transition-colors">
                    核燃料循环从铀矿开采（天然铀含0.7%铀-235）→ 铀转化与浓缩（提升至3-5%）→ 燃料制造 → 反应堆发电 → 乏燃料后处理 → 放射性废物处置，构成完整链条。<br/><br/>
                    通过乏燃料后处理实现铀钚再循环，可将铀资源利用率从1%提升至60%以上，同时显著减少高放废物体积，是实现核能可持续发展的关键一环。
                  </p>
                </div>
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
              <span className="text-[9px] tracking-[0.3em] text-cyan-100/80 uppercase">SECT 2. 核技术应用</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-light tracking-[0.15em] text-white">核技术的跨界造福</h2>
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
                    <span className="text-[10px] tracking-[0.3em] text-cyan-400/60 font-light uppercase">0{index + 3}</span>
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
                  <span className="text-[9px] tracking-[0.3em] text-cyan-400/70 uppercase font-artistic">🧪 核能知识小测验</span>
                  <h3 className="text-xl md:text-2xl font-light tracking-widest text-white/90 mt-2 font-artistic">测一测你的核能认知</h3>
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
                    提交答案
                  </button>
                ) : (
                  <>
                    <button onClick={handleQuizReset} className="px-8 py-3 bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] rounded-xl text-[10px] tracking-widest text-white/60 hover:text-white transition-all">重新作答</button>
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
              <span className="text-[9px] tracking-[0.3em] text-cyan-100/80 uppercase">SECT 3. 辐射安全</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-light tracking-[0.15em] text-white">防护的科学法则</h2>
            <p className="text-xs md:text-sm font-light text-white/40 mt-4 tracking-wider">摒弃未知带来的恐惧，用科学法则构建坚不可摧的防线。</p>
          </div>

          {/* 辐射屏蔽模拟测试仪 */}
          <div className="mt-12 reveal-section" ref={addToRefs}>
            <RadiationShieldSimulator />
          </div>

          <div className="reveal-section flex flex-col lg:flex-row items-center gap-12 bg-white/[0.015] backdrop-blur-md border border-white/[0.05] rounded-3xl p-6 md:p-12 shadow-[0_32px_80px_rgba(0,0,0,0.8)] relative overflow-hidden mt-12" ref={addToRefs}>
             <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-600/10 blur-[100px] pointer-events-none"></div>

             <div className="w-full lg:w-[45%] rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-10">
               <img src="https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=1200&q=85" alt="Safety Principles" className="w-full h-full object-cover aspect-square md:aspect-[4/3] opacity-80 hover:opacity-100 transition-all duration-700 hover:scale-105" />
             </div>
             <div className="w-full lg:w-[55%] space-y-8 z-10">
               <div className="bg-white/[0.02] border border-cyan-500/10 rounded-2xl p-5">
                 <h3 className="text-sm font-light tracking-widest text-cyan-300 mb-4 text-center">📊 日常辐射剂量对比</h3>
                 <div className="space-y-2">
                   {[{ label: '1 根香蕉', dose: '0.1 μSv', width: '5%' }, { label: '胸片 X 光', dose: '100 μSv', width: '20%' }, { label: '跨大西洋飞行', dose: '40 μSv', width: '10%' }, { label: '胸部 CT', dose: '~10 mSv', width: '60%' }, { label: '年剂量限值（公众）', dose: '1 mSv', width: '50%' }, { label: '年剂量限值（职业）', dose: '20 mSv', width: '80%' }, { label: '确定性效应阈值', dose: '1000 mSv', width: '100%' }].map((item, i) => (
                     <div key={i} className="flex items-center gap-3 text-[10px] md:text-[11px]">
                       <span className="w-32 md:w-40 text-right text-white/50 shrink-0">{item.label}</span>
                       <div className="flex-1 h-4 bg-white/[0.04] rounded-full overflow-hidden">
                         <div className="h-full bg-gradient-to-r from-cyan-600/40 to-cyan-400/60 rounded-full transition-all" style={{ width: item.width }}></div>
                       </div>
                       <span className="w-20 text-left text-cyan-300/80 shrink-0 font-mono text-[9px]">{item.dose}</span>
                     </div>
                   ))}
                 </div>
                 <p className="text-[9px] text-white/20 mt-4 text-center font-ui">数据来源：UNSCEAR 2020年报告 · 一只香蕉约含 0.1 μSv 放射性活度</p>
               </div>
               <div className="space-y-3">
                 <h3 className="text-lg md:text-xl text-cyan-300 font-light tracking-widest border-l-[3px] border-cyan-500 pl-4 drop-shadow-md">时间、距离、屏蔽</h3>
                 <p className="text-xs md:text-sm text-white/60 font-light leading-relaxed pl-4">缩短受照时间、增加与辐射源的距离、设置有效的屏蔽材料，这是国际公认的辐射防护三大核心原则，能将辐射剂量降至绝对安全范围。</p>
               </div>
               <div className="space-y-3">
                 <h3 className="text-lg md:text-xl text-cyan-300 font-light tracking-widest border-l-[3px] border-cyan-500 pl-4 drop-shadow-md">天然辐射无处不在</h3>
                 <p className="text-xs md:text-sm text-white/60 font-light leading-relaxed pl-4">不必谈核色变。空气、水源甚至身体内部都含有微量的放射性同位素。建立科学的辐射剂量概念，是现代公民的必备素养。每人每年接受天然本底辐射约 2.4 mSv，远低于辐射防护限值。</p>
               </div>
               <div className="space-y-3">
                 <h3 className="text-lg md:text-xl text-cyan-300 font-light tracking-widest border-l-[3px] border-cyan-500 pl-4 drop-shadow-md">核应急常识</h3>
                 <p className="text-xs md:text-sm text-white/60 font-light leading-relaxed pl-4">在极端突发事件中：听从官方指挥，隐蔽在室内深处，关闭门窗与通风，必要时服用稳定性碘片。理智与科学是最好的护盾。</p>
               </div>
             </div>
          </div>
        </section>

        {/* ================= 板块4：精神与文化 ================= */}
        <section id="spirit" className="site-section relative z-20 py-24 md:py-32 px-6 md:px-12 lg:px-32 max-w-[1440px] mx-auto text-center">
            <div className="reveal-section relative bg-gradient-to-br from-[#0a101d]/80 to-[#040a18]/80 border-y border-cyan-500/20 py-20 md:py-28 rounded-[2rem] overflow-hidden shadow-[0_0_40px_rgba(34,211,238,0.05)] backdrop-blur-xl" ref={addToRefs}>
                <div className="relative z-10 px-6">
                  <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-cyan-900/30 border border-cyan-500/30 shadow-sm backdrop-blur-md">
                    <FilmIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[9px] tracking-[0.3em] text-cyan-100/90 uppercase">SECT 4. 精神文化</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-light tracking-[0.2em] text-white mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">星辰大海的征途</h2>
                  <p className="text-xs md:text-sm text-white/60 mb-10 max-w-2xl mx-auto tracking-widest leading-loose">
                      “两弹一星”精神、核潜艇精神，一代代核工业人隐姓埋名，用青春与热血铸就了共和国的钢铁脊梁。<br />
                      邓稼先（1924-1986）、于敏（1926-2019）、郭永怀（1909-1968）……<br />
                      他们的名字，是镌刻在民族丰碑上最闪亮的坐标。中国核工业从无到有、从弱到强的六十九载征程，是一部可歌可泣的奋斗史诗。
                  </p>
                  <button onClick={() => setIsStoryOpen(true)} className="px-8 py-4 bg-cyan-700/80 hover:bg-cyan-600 active:scale-95 rounded-full text-[10px] md:text-xs text-white tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] backdrop-blur-md">
                      沉浸式阅读：光辉精神纪实
                  </button>
                </div>
            </div>
            {/* 核工业历史时间线 */}
            <div className="mt-16 max-w-4xl mx-auto px-4 reveal-section" ref={addToRefs}>
              <span className="text-[9px] tracking-[0.4em] text-white/20 uppercase font-artistic block mb-8">CHRONOLOGY · 中国核工业大事记</span>
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
        </section>

        {/* ================= 板块5：政策法规解读 ================= */}
        <section id="policy" className="site-section relative z-20 py-20 px-6 md:px-12 lg:px-32 max-w-[1440px] mx-auto">
          <div className="text-center mb-16 reveal-section" ref={addToRefs}>
            <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full bg-cyan-900/20 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)] backdrop-blur-md">
              <LockIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[9px] tracking-[0.3em] text-cyan-100/80 uppercase">SECT 5. 政策法规</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-light tracking-[0.15em] text-white">政策法规与国家安全</h2>
            <p className="text-xs md:text-sm font-light text-white/40 mt-4 tracking-wider">知法懂法，从国家战略高度理解核安全与核发展的深刻内涵</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal-section" ref={addToRefs}>
            <div className="bg-white/[0.015] backdrop-blur-md border border-white/[0.05] hover:border-cyan-500/30 rounded-2xl p-6 md:p-8 transition-all duration-500 hover:-translate-y-1 flex flex-col gap-5 group">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-light text-cyan-400/50">01</span>
                <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent"></div>
              </div>
              <h3 className="text-lg font-light tracking-widest text-white/90 group-hover:text-cyan-300 transition-colors">《中华人民共和国原子能法》</h3>
              <p className="text-xs text-white/50 font-light leading-relaxed group-hover:text-white/70 transition-colors">
                2024年颁布的《原子能法》是我国原子能领域的基础性法律。该法明确了原子能事业"安全第一、保护环境、保障公众健康"的基本原则，确立了核安全监管体制和放射性废物管理体系，为我国核能和平利用与核技术应用提供了坚实的法律保障，标志着我国原子能事业进入法治化新阶段。
              </p>
            </div>

            <div className="bg-white/[0.015] backdrop-blur-md border border-white/[0.05] hover:border-cyan-500/30 rounded-2xl p-6 md:p-8 transition-all duration-500 hover:-translate-y-1 flex flex-col gap-5 group">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-light text-cyan-400/50">02</span>
                <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent"></div>
              </div>
              <h3 className="text-lg font-light tracking-widest text-white/90 group-hover:text-cyan-300 transition-colors">总体国家安全观与核安全观</h3>
              <p className="text-xs text-white/50 font-light leading-relaxed group-hover:text-white/70 transition-colors">
                总体国家安全观涵盖政治、军事、经济、科技、核安全等十余个领域。核安全观的核心内涵为"理性、协调、并进"——理性认识核安全风险，协调统筹发展与安全，推动核安全事业与核能事业并进。中国始终将核安全置于国家安全的战略高度，坚持最严格标准实施核安全监管。
              </p>
            </div>

            <div className="bg-white/[0.015] backdrop-blur-md border border-white/[0.05] hover:border-cyan-500/30 rounded-2xl p-6 md:p-8 transition-all duration-500 hover:-translate-y-1 flex flex-col gap-5 group">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-light text-cyan-400/50">03</span>
                <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent"></div>
              </div>
              <h3 className="text-lg font-light tracking-widest text-white/90 group-hover:text-cyan-300 transition-colors">核能"三步走"发展战略</h3>
              <p className="text-xs text-white/50 font-light leading-relaxed group-hover:text-white/70 transition-colors">
                第一步：热中子反应堆（热堆）——以压水堆为代表，是目前核电站主力堆型。第二步：快中子反应堆（快堆）——可将铀资源利用率从1%提升至60%以上。第三步：受控核聚变反应堆——模拟太阳聚变反应，有望提供近乎无限的清洁能源。中国正稳步推进"三步走"战略，从"华龙一号"到实验快堆再到参与国际热核聚变实验堆（ITER）计划。
              </p>
            </div>
          </div>
        </section>

        {/* ================= 板块6：综合科普图集 ================= */}
        <section id="album" className="site-section relative z-20 py-20 px-6 md:px-12 lg:px-32 max-w-[1440px] mx-auto">
          <div className="text-center mb-16 reveal-section" ref={addToRefs}>
            <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full bg-cyan-900/20 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)] backdrop-blur-md">
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[9px] tracking-[0.3em] text-cyan-100/80 uppercase">SECT 6. 全景图集</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-light tracking-[0.15em] text-white">高光瞬间</h2>

            <div className="flex justify-center gap-2 mt-10 max-w-sm mx-auto p-1.5 bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-full font-ui shadow-inner">
              {['安全与防护', '技术应用', '工业精神'].map((cat) => (
                <button key={cat} onClick={() => setActivePhotoCategory(cat)} className={`flex-1 py-2 text-[9px] tracking-[0.15em] font-light rounded-full transition-all duration-300 select-none ${activePhotoCategory === cat ? 'bg-cyan-900/70 border border-cyan-500/40 text-cyan-50 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'text-white/40 hover:text-white/80 border border-transparent'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 reveal-section" ref={addToRefs}>
            {filteredPhotos.map((photo, index) => (
              <div key={photo.id} onClick={() => openLightboxSilky('collection', null, index)} className="group cursor-pointer bg-white/[0.015] backdrop-blur-xl border border-white/[0.05] rounded-2xl overflow-hidden relative shadow-lg hover:shadow-[0_15px_30px_rgba(34,211,238,0.1)] hover:border-cyan-500/30 transition-all duration-500 hover:-translate-y-1 cursor-zoom-in">
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  <img src={photo.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040a18] via-[#040a18]/40 to-transparent opacity-95 transition-opacity duration-500"></div>
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 flex flex-col justify-end transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-[8px] tracking-[0.25em] text-cyan-400 font-medium uppercase mb-1.5 drop-shadow-md">{photo.subtitle}</span>
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-base md:text-lg font-light tracking-widest text-white/95 text-ellipsis overflow-hidden">{photo.title}</h3>
                      <span className="text-[9px] tracking-widest font-extralight text-cyan-500/50 group-hover:text-cyan-300 transition-colors duration-300 font-ui shrink-0">ZOOM</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 板块6：论坛留言板 ================= */}
        <section id="forum" className="site-section relative z-20 py-24 px-6 md:px-12 lg:px-32 max-w-[1200px] mx-auto">
          <div className="text-center mb-16 reveal-section" ref={addToRefs}>
            <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full bg-cyan-900/20 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)] backdrop-blur-md">
              <MessageSquareIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[9px] tracking-[0.3em] text-cyan-100/80 uppercase">SECT 7. 读者畅想</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-light tracking-[0.15em] text-white">未来的回响</h2>
            <p className="text-xs md:text-sm font-light text-white/40 mt-4 tracking-wider">分享您对核技术应用与发展的独到见解</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start reveal-section" ref={addToRefs}>
            <form onSubmit={handleMessageSubmit} className="lg:col-span-5 bg-white/[0.015] backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col gap-6 font-ui relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/10 blur-[60px] pointer-events-none"></div>

              <div className="flex flex-col gap-2 relative z-10">
                <label className="text-[10px] tracking-[0.2em] font-light text-cyan-200/60 uppercase font-artistic">Signature (署名)</label>
                <input
                  type="text" maxLength="12" value={nickname}
                  onChange={(e) => { setNickname(e.target.value); if (e.target.value.trim()) setFormError(prev => ({ ...prev, name: false })); }}
                  placeholder="留下您的称呼..."
                  className={`w-full bg-[#040a18]/60 text-sm text-white/95 placeholder:text-white/20 font-light border rounded-xl py-3.5 px-4 outline-none transition-all duration-300 focus:bg-[#07101d]/80 ${formError.name ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-white/10 focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)]'}`}
                />
              </div>

              <div className="flex flex-col gap-2 relative z-10">
                <label className="text-[10px] tracking-[0.2em] font-light text-cyan-200/60 uppercase font-artistic">Insights (见解)</label>
                <textarea
                  rows="4" maxLength="300" value={content}
                  onChange={(e) => { setContent(e.target.value); if (e.target.value.trim()) setFormError(prev => ({ ...prev, text: false })); }}
                  placeholder="畅所欲言，科学的进步离不开每一份思考..."
                  className={`w-full bg-[#040a18]/60 text-sm text-white/95 placeholder:text-white/20 font-light border rounded-xl py-3.5 px-4 outline-none transition-all duration-300 resize-none focus:bg-[#07101d]/80 ${formError.text ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-white/10 focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)]'}`}
                />
              </div>

              <button type="submit" className="mt-2 w-full bg-cyan-700/80 hover:bg-cyan-600 active:scale-95 transition-all duration-300 text-[10px] tracking-[0.3em] font-light text-white py-4 rounded-xl flex items-center justify-center gap-2 select-none shadow-[0_0_20px_rgba(34,211,238,0.2)] relative z-10">
                <SendIcon className="w-3.5 h-3.5" />
                <span>递交寄语</span>
              </button>
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
              <span className="text-cyan-400 font-medium">{lightbox.type === 'collection' ? previewData.category : 'CORE KNOWLEDGE'}</span>
              {lightbox.type === 'collection' && (<><span className="opacity-30">|</span><span>{lightbox.index + 1} / {filteredPhotos.length}</span></>)}
            </div>
            
            <div className="relative w-full flex items-center justify-center group/viewer max-h-[55vh]">
              {lightbox.type === 'collection' && (<button onClick={handlePrevPhoto} className="absolute left-2 md:-left-16 z-30 p-3 bg-black/60 hover:bg-cyan-900/60 border border-white/10 hover:border-cyan-400/50 rounded-full text-white/50 hover:text-white opacity-0 group-hover/viewer:opacity-100 md:opacity-100 transition-all duration-300 backdrop-blur-md font-ui"><ArrowLeftIcon className="w-4 h-4 md:w-5 md:h-5" /></button>)}
              <div className={`overflow-hidden rounded-2xl border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.9)] max-w-full max-h-[55vh] cursor-zoom-out lightbox-content ${lightbox.isActive ? 'active' : ''}`} onClick={closeLightboxSilky}>
                <img src={previewData.image} className="max-w-full max-h-[55vh] object-contain select-none" />
              </div>
              {lightbox.type === 'collection' && (<button onClick={handleNextPhoto} className="absolute right-2 md:-right-16 z-30 p-3 bg-black/60 hover:bg-cyan-900/60 border border-white/10 hover:border-cyan-400/50 rounded-full text-white/50 hover:text-white opacity-0 group-hover/viewer:opacity-100 md:opacity-100 transition-all duration-300 backdrop-blur-md font-ui"><ArrowRightIcon className="w-4 h-4 md:w-5 md:h-5" /></button>)}
            </div>
            
            <div className={`w-full max-w-2xl bg-[#040a18]/60 backdrop-blur-lg border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl text-center select-text lightbox-card ${lightbox.isActive ? 'active' : ''}`}>
              <span className="text-[9px] tracking-[0.3em] text-cyan-400/90 font-medium mb-2 block uppercase drop-shadow-md">{previewData.subtitle}</span>
              <h3 className="text-lg md:text-2xl font-light tracking-widest text-white/95 mb-4 drop-shadow-lg">{previewData.title}</h3>
              <p className="text-xs md:text-sm text-white/70 font-light leading-relaxed tracking-wider max-w-xl mx-auto italic">"{lightbox.type === 'collection' ? previewData.story : previewData.desc}"</p>
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
            <h3 className="text-2xl md:text-4xl font-light tracking-[0.15em] text-white/95 leading-normal drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">核工业的丰碑与荣光</h3>
            <p className="text-sm font-light leading-relaxed tracking-wider text-white/70">中国核工业的发展史，是一部可歌可泣的奋斗史。无数先辈用青春和热血，铺就了通向核星辰的坦途。</p>
            <div className="space-y-3"><h4 className="text-sm font-medium tracking-widest text-cyan-300 uppercase">邓稼先：中国核武器研制奠基人</h4><p className="text-sm font-light leading-relaxed tracking-wider text-white/60">1958年起隐姓埋名，带领团队在荒漠中摸索原子弹理论设计。在没有计算机的年代，他用算盘完成了原子弹核心参数的计算推导。1979年一次试验中，为找回未爆炸的弹头碎片，他拒绝了他人靠近，亲自进入辐射区域搜寻，身体因此遭受致命辐射损伤。</p></div>
            <div className="space-y-3"><h4 className="text-sm font-medium tracking-widest text-cyan-300 uppercase">于敏："氢弹之父" 的国产之路</h4><p className="text-sm font-light leading-relaxed tracking-wider text-white/60">未曾出国留学的"国产"专家，从零开始独立攻克氢弹理论。在于敏团队的设计方案下，中国从第一颗原子弹到第一颗氢弹仅用了2年8个月，为世界最快速度。他的"于敏构型"至今仍是国际核物理界的研究课题。</p></div>
            <div className="space-y-3"><h4 className="text-sm font-medium tracking-widest text-cyan-300 uppercase">郭永怀：以生命守护机密数据</h4><p className="text-sm font-light leading-relaxed tracking-wider text-white/60">1968年12月5日，郭永怀乘坐的飞机在着陆时失事。人们发现他与警卫员紧紧拥抱在一起，用身体保护着的公文包中——热核导弹的绝密数据完好无损。他用生命为中国核事业留下了最后一份贡献。</p></div>
            <div className="space-y-3"><h4 className="text-sm font-medium tracking-widest text-cyan-300 uppercase">"两弹一星"精神传承</h4><p className="text-sm font-light leading-relaxed tracking-wider text-white/60">热爱祖国、无私奉献，自力更生、艰苦奋斗，大力协同、勇于登攀。钱学森、邓稼先、于敏、郭永怀等老一辈科学家隐姓埋名，为共和国铸造了最坚实的盾牌。这种精神在新时代核工业人中薪火相传，推动中国核电技术从"引进消化"到"华龙一号"自主品牌的跨越。</p></div>
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
            <div className="text-xl md:text-2xl font-light tracking-[0.1em] text-white/95 mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">活动公告</div>
            <div className="text-sm font-light leading-relaxed tracking-wider text-white/70 whitespace-pre-wrap">欢迎参观本届科普创意赛道项目！<br/><br/>本项目聚焦五大核心板块：核能知识、核技术应用、辐射安全与防护、核工业精神与文化、核安全政策法规。<br/><br/>以生动、直观的方式讲述核科学基本原理，助力营造核工业发展的良好社会氛围。</div>
          </div>
        </div>
      </div>

      {/* ================= 管理员后台 ================= */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8 select-none font-ui" style={{ animation: "fadeInBlur 0.6s forwards" }}>
          <div className="absolute inset-0 bg-[#040a18]/95 backdrop-blur-lg cursor-pointer pointer-events-auto" onClick={() => setIsAdminOpen(false)}></div>
          
          <div className={`relative z-10 w-full ${isAdminAuthenticated ? 'max-w-4xl' : 'max-w-sm'} bg-[#07101d] border border-cyan-500/30 rounded-3xl p-6 md:p-8 shadow-[0_40px_120px_rgba(0,0,0,0.85)] max-h-[85vh] overflow-hidden flex flex-col backdrop-blur-md transition-all duration-500`}>
              
              {!isAdminAuthenticated ? (
                <form onSubmit={handleAdminLogin} className="flex flex-col items-center justify-center py-4 w-full text-center">
                  <div className="relative">
                    <LockIcon className="w-12 h-12 text-cyan-400 mb-6 relative z-10" />
                    <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse"></div>
                  </div>
                  <h3 className="text-xl font-light tracking-widest text-white/95 mb-2 font-artistic drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">CORE MANAGEMENT</h3>
                  <p className="text-[10px] tracking-[0.2em] text-cyan-100/50 uppercase mb-8 font-artistic">请输入管理员密码 (666)</p>
                  <div className="w-full space-y-4 mb-8">
                    <input 
                      type="password" 
                      value={adminPassword} 
                      onChange={(e) => { setAdminPassword(e.target.value); setLoginError(false); }} 
                      placeholder="Passcode..." 
                      className={`w-full bg-black/40 text-center text-sm text-white border rounded-xl py-3.5 px-4 outline-none transition-colors ${loginError ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-white/10 focus:border-cyan-400/50 focus:bg-black/60'}`} 
                    />
                    {loginError && <p className="text-[9px] tracking-widest text-red-500 uppercase mt-2">Access Denied: 密码错误</p>}
                  </div>
                  <div className="flex gap-4 w-full">
                    <button type="button" onClick={() => setIsAdminOpen(false)} className="flex-1 bg-white/[0.03] border border-white/10 hover:bg-white/[0.1] hover:border-white/20 transition-all py-3.5 rounded-xl text-[10px] tracking-widest">取消</button>
                    <button type="submit" onClick={handleAdminLogin} className="flex-1 bg-cyan-900/80 hover:bg-cyan-800 border border-cyan-500/40 hover:border-cyan-400/60 transition-all py-3.5 rounded-xl text-cyan-50 text-[10px] tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.2)]">认证进入</button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col h-full overflow-hidden select-text animate-fade-in-blur">
                  <div className="flex justify-between items-center border-b border-white/10 pb-5 mb-6 flex-shrink-0">
                    <div>
                      <h3 className="text-lg md:text-xl font-light tracking-widest text-cyan-300 font-artistic drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">内容多维控制台</h3>
                      <p className="text-[9px] tracking-widest text-cyan-100/50 uppercase font-artistic">PERSISTENCE CLOUD CONFIGURATION</p>
                    </div>
                    <button onClick={handleAdminLogout} className="px-4 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 rounded-xl text-[10px] tracking-widest text-red-200 font-light transition-all shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.1)]">退出登录 ✕</button>
                  </div>

                  <div className="flex gap-2 mb-6 border-b border-white/10 pb-4 overflow-x-auto select-none flex-shrink-0 font-artistic text-[10px] tracking-[0.2em]">
                    {[{ id: 'gallery', label: 'GALLERY (知识画廊)' }, { id: 'collection', label: 'ALBUM (全景图集)' }, { id: 'guestbook', label: 'FORUM (寄语审核)' }].map(tab => (
                      <button key={tab.id} onClick={() => { setAdminTab(tab.id); setEditingItemId(null); }} className={`px-5 py-2 rounded-xl transition-all shrink-0 ${adminTab === tab.id ? 'bg-cyan-900/40 border border-cyan-400/40 text-white shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'border border-transparent bg-white/[0.02] text-white/50 hover:bg-white/[0.05] hover:text-white/90'}`}>{tab.label}</button>
                    ))}
                  </div>

                  <div className="flex-1 overflow-y-auto pr-3 story-scrollbar space-y-6">
                    {adminTab === 'gallery' && (
                      <div className="space-y-4 font-ui">
                        {currentGallery.map(item => (
                          <div key={item.id} className="bg-black/20 border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row gap-5 items-start">
                            <img src={item.image} className="w-28 aspect-[16/10] object-cover rounded-xl border border-white/10 shadow-lg" alt="" />
                            <div className="flex-1 w-full">
                              {editingItemId === item.id ? (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} placeholder="主标题" className="bg-black/50 border border-white/10 text-xs p-2.5 rounded-lg text-white outline-none focus:border-cyan-400/50" />
                                    <input type="text" value={editForm.subtitle} onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })} placeholder="副标题" className="bg-black/50 border border-white/10 text-xs p-2.5 rounded-lg text-white outline-none focus:border-cyan-400/50" />
                                  </div>
                                  <input type="text" value={editForm.image} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })} placeholder="图片链接 URL" className="w-full bg-black/50 border border-white/10 text-xs p-2.5 rounded-lg text-white outline-none focus:border-cyan-400/50" />
                                  <textarea value={editForm.desc} onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })} placeholder="细节描述" rows="3" className="w-full bg-black/50 border border-white/10 text-xs p-2.5 rounded-lg text-white resize-none outline-none focus:border-cyan-400/50" />
                                  <div className="flex gap-2 justify-end">
                                    <button onClick={() => setEditingItemId(null)} className="px-4 py-1.5 bg-white/5 border border-white/10 text-[10px] rounded-lg text-white/70 hover:bg-white/10 hover:text-white">取消</button>
                                    <button onClick={() => saveGalleryEdit(item.id)} className="px-4 py-1.5 bg-cyan-700/80 border border-cyan-500/40 text-[10px] rounded-lg text-cyan-50 hover:bg-cyan-600">保存修改</button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="flex justify-between items-start mb-3">
                                    <div>
                                      <h4 className="text-base font-light text-white font-artistic">{item.title}</h4>
                                      <span className="text-[9px] text-cyan-400/80 tracking-wider font-light uppercase font-artistic block mt-1">{item.subtitle}</span>
                                    </div>
                                    <button onClick={() => startEditing(item)} className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center gap-1.5 text-[9px] text-white/70 hover:text-white select-none transition-colors">
                                      <EditIcon className="w-3.5 h-3.5" /><span>编辑</span>
                                    </button>
                                  </div>
                                  <p className="text-xs text-white/60 font-light line-clamp-2 leading-relaxed">{item.desc}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {adminTab === 'collection' && (
                      <div className="space-y-5">
                        <div className="flex justify-end select-none">
                          <button onClick={addNewCollectionPhoto} className="px-5 py-2.5 bg-cyan-900/60 border border-cyan-500/40 hover:bg-cyan-800 active:scale-95 text-[10px] tracking-widest rounded-xl flex items-center gap-2 transition-all text-cyan-50 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                            <PlusIcon className="w-4 h-4" /><span>新增图文项</span>
                          </button>
                        </div>
                        <div className="space-y-4">
                          {currentCollection.map(photo => (
                            <div key={photo.id} className="bg-black/20 border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row gap-5 items-start font-ui">
                              <img src={photo.image} className="w-28 aspect-[4/3] object-cover rounded-xl border border-white/10 shadow-lg" alt="" />
                              <div className="flex-1 w-full">
                                {editingItemId === photo.id ? (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                      <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} placeholder="主标题" className="bg-black/50 border border-white/10 text-xs p-2.5 rounded-lg text-white outline-none focus:border-cyan-400/50" />
                                      <input type="text" value={editForm.subtitle} onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })} placeholder="副标题" className="bg-black/50 border border-white/10 text-xs p-2.5 rounded-lg text-white outline-none focus:border-cyan-400/50" />
                                      <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className="bg-zinc-900 border border-white/20 text-xs p-2.5 rounded-lg text-white outline-none focus:border-cyan-400/50">
                                        <option value="安全与防护">安全与防护</option>
                                        <option value="技术应用">技术应用</option>
                                        <option value="工业精神">工业精神</option>
                                      </select>
                                    </div>
                                    <input type="text" value={editForm.image} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })} placeholder="图片链接 URL" className="w-full bg-black/50 border border-white/10 text-xs p-2.5 rounded-lg text-white outline-none focus:border-cyan-400/50" />
                                    <textarea value={editForm.story} onChange={(e) => setEditForm({ ...editForm, story: e.target.value })} placeholder="科普内容" rows="3" className="w-full bg-black/50 border border-white/10 text-xs p-2.5 rounded-lg text-white resize-none outline-none focus:border-cyan-400/50" />
                                    <div className="flex gap-2 justify-end">
                                      <button onClick={() => setEditingItemId(null)} className="px-4 py-1.5 bg-white/5 border border-white/10 text-[10px] rounded-lg text-white/70 hover:bg-white/10 hover:text-white">取消</button>
                                      <button onClick={() => saveCollectionEdit(photo.id)} className="px-4 py-1.5 bg-cyan-900/60 border border-cyan-500/40 text-[10px] rounded-lg text-cyan-50 hover:bg-cyan-800">保存修改</button>
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    <div className="flex justify-between items-start mb-3">
                                      <div>
                                        <h4 className="text-base font-light text-white font-artistic">{photo.title}</h4>
                                        <span className="inline-block px-2 py-1 bg-cyan-950/60 border border-cyan-500/20 text-[9px] text-cyan-200 rounded-md uppercase tracking-wider font-light mt-2 font-artistic">{photo.category} · {photo.subtitle}</span>
                                      </div>
                                      <div className="flex gap-2 select-none">
                                        <button onClick={() => startEditing(photo)} className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center gap-1.5 text-[9px] text-white/70 hover:text-white transition-colors"><EditIcon className="w-3.5 h-3.5" /><span>编辑</span></button>
                                        <button onClick={() => deleteCollectionPhoto(photo.id)} className="p-2 bg-red-950/30 hover:bg-red-900/50 border border-red-500/20 rounded-lg flex items-center gap-1.5 text-[9px] text-red-300/80 hover:text-red-200 transition-colors"><TrashIcon className="w-3.5 h-3.5" /></button>
                                      </div>
                                    </div>
                                    <p className="text-xs text-white/60 font-light line-clamp-2 leading-relaxed italic">"{photo.story}"</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {adminTab === 'guestbook' && (
                      <div className="space-y-4">
                        <div className="border border-cyan-500/20 rounded-xl bg-cyan-950/20 p-4 text-[11px] font-light tracking-wide text-cyan-100/70 mb-4 select-none">您可以直接删除不合规言论，更改会实时同步到本地存储。</div>
                        {currentMessages.length === 0 ? (
                          <div className="text-center py-16 text-xs font-light text-white/30 tracking-widest bg-black/20 rounded-2xl border border-white/5">暂无寄语可以审核</div>
                        ) : (
                          currentMessages.map(msg => (
                            <div key={msg.id} className="bg-black/30 border border-white/5 p-5 rounded-2xl flex items-start justify-between gap-6 font-ui hover:border-white/10 transition-colors">
                              <div className="flex-1">
                                <div className="flex gap-4 items-center mb-2">
                                  <span className="text-sm font-light text-cyan-300 font-artistic">{msg.name}</span>
                                  <span className="text-[9px] text-white/30 font-mono">{msg.time}</span>
                                </div>
                                <p className="text-xs font-light text-white/70 leading-relaxed">{msg.text}</p>
                              </div>
                              <button onClick={() => deleteGuestMessage(msg.id)} className="p-2.5 bg-red-950/20 hover:bg-red-900/50 border border-red-500/20 hover:border-red-500/40 rounded-xl text-red-300 hover:text-red-200 transition-all select-none" title="删除此言论"><TrashIcon className="w-4 h-4" /></button>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
      )}

      {/* 回到顶部按钮 */}
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`fixed bottom-8 right-6 md:right-12 z-[100] flex items-center justify-center w-12 h-12 rounded-full bg-cyan-950/80 backdrop-blur-xl border border-cyan-500/40 hover:bg-cyan-900 hover:border-cyan-400 transition-all duration-500 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] ${showBackToTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none'}`}>
        <ChevronDownIcon className="w-5 h-5 text-cyan-300 transform rotate-180" />
      </button>

      {/* ================= 参考资料与数据来源 ================= */}
      <div className="bg-[#040a18] px-6 md:px-12 lg:px-32 max-w-[1440px] mx-auto py-12 border-t border-white/[0.03] font-ui">
        <div className="text-center">
          <span className="text-[9px] tracking-[0.4em] text-white/20 uppercase font-artistic mb-6 block">REFERENCES & DATA SOURCES</span>
          <div className="text-[9px] md:text-[10px] text-white/20 leading-loose tracking-wide max-w-2xl mx-auto">
            本文中的核科学知识参考自国际原子能机构（IAEA）公开出版物、中国核能行业协会年度报告、<br className="hidden md:block" />
            以及《原子能法》官方公开文本。辐射剂量数据参照联合国原子辐射效应科学委员会（UNSCEAR）报告。<br />
            部分图片来源于开源图库 Unsplash，仅用于科普展示。
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
        <div className="mb-6 font-ui">
          <button onClick={() => setIsAdminOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.02] border border-white/5 hover:bg-cyan-900/30 hover:border-cyan-500/30 text-[9px] text-white/40 hover:text-cyan-200 rounded-lg transition-all tracking-widest uppercase shadow-sm">
            <SettingsIcon className="w-3 h-3" /><span>ADMIN PORTAL (密码: 666)</span>
          </button>
        </div>
        <div className="text-[10px] tracking-[0.4em] text-white/20 uppercase font-light mb-4">© {new Date().getFullYear()} SCIENCE & ART. EXPLORE THE UNKNOWN.</div>
        <div className="text-[8px] tracking-[0.2em] text-white/10 font-light font-ui">本作品使用了 AI 辅助创作</div>
      </footer>
    </div>
    </>
  );
}