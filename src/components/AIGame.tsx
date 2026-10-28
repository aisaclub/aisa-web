import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Trophy, X, Zap, Shield, Sparkles, Scan, Bot, CheckCircle2, AlertCircle, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AIGameProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GameObject {
  x: number;
  y: number;
  type: 'gpu' | 'weight' | 'bug' | 'golden_epoch';
  size: number;
  speed: number;
  label: string;
}

interface DetectiveCase {
  id: number;
  category: 'Agrotech AI (FPA)' | 'Computer Vision & Deepfake' | 'NLP & Kod Algoritma' | 'Dron & Robotik Autonomi';
  scenario: string;
  evidence: string;
  isSyntheticOrAnomaly: boolean; // true = AI Generated / Anomaly, false = Real / Healthy
  explanation: string;
}

const DETECTIVE_CASES: DetectiveCase[] = [
  {
    id: 1,
    category: 'Agrotech AI (FPA)',
    scenario: 'Pemeriksaan Spektrometri Dron Ladang Sawit UiTM Jasin',
    evidence: 'Penderia inframerah mengesan indeks NDVI daun sawit menurun mendadak kepada 0.21 dengan tompok nekrosis berspora.',
    isSyntheticOrAnomaly: true,
    explanation: 'ANOMALI DIKESAN: Gejala Hawar Daun (Curvularia Leaf Blight) memerlukan rawatan racun kulat segera.',
  },
  {
    id: 2,
    category: 'Agrotech AI (FPA)',
    scenario: 'Analisis Citra Udara Sawah Padi Sungai Rambai',
    evidence: 'Pantulan kanopi sekata, indeks pantulan fotosintesis optimum 0.88, tiada tanda serangan bena perang.',
    isSyntheticOrAnomaly: false,
    explanation: 'TANAMAN SIHAT: Tanaman padi dalam fasa bunting aktif dan membesar dalam parameter normal.',
  },
  {
    id: 3,
    category: 'Computer Vision & Deepfake',
    scenario: 'Audit Biometrik Wajah Kad Matrik Digital',
    evidence: 'Sempadan cuping telinga tidak simetri dan terdapat artifak pantulan mata berkembar tidak sejajar dengan sumber cahaya.',
    isSyntheticOrAnomaly: true,
    explanation: 'SINTETIK AI: Wajah dijana menggunakan model generatif Diffusion / GAN tanpa data biometrik fizikal sebenar.',
  },
  {
    id: 4,
    category: 'Computer Vision & Deepfake',
    scenario: 'Fotografi Majlis Perasmian AISA di Dewan Al-Khawarizmi',
    evidence: 'Kedalaman medan optik (depth of field) semula jadi, pantulan fabrik baju kurung UiTM menepati tekstur fizikal.',
    isSyntheticOrAnomaly: false,
    explanation: 'FOTOGRAFI NYATA: Citra optik asli yang dirakam melalui kamera lensa DSLR mahasiswa media.',
  },
  {
    id: 5,
    category: 'NLP & Kod Algoritma',
    scenario: 'Semakan Kod Repositori Projek Python AI',
    evidence: 'Skrip memanggil fungsi rekaan "torch.cuda.hyper_super_tensor()" yang tidak wujud dalam mana-mana pustaka PyTorch rasmi.',
    isSyntheticOrAnomaly: true,
    explanation: 'HALUSINASI LLM: Kod mengandungi sintaks sintetik yang direka secara halusinasi oleh model bahasa besar.',
  },
  {
    id: 6,
    category: 'NLP & Kod Algoritma',
    scenario: 'Model Pengelasan Dialek Melayu Melaka FSKM',
    evidence: 'Struktur tatabahasa n-gram mengandungi perkataan loghat "hawau", "kocik", dan pemetaan fonetik beranotasi manual.',
    isSyntheticOrAnomaly: false,
    explanation: 'KORPUS ASLI: Data teks tulen yang dikumpul dan disahkan oleh penyelidik linguistik komputasi tempatan.',
  },
  {
    id: 7,
    category: 'Dron & Robotik Autonomi',
    scenario: 'Penderiaan Jarak Agrobot Pemetaan Tanah',
    evidence: 'Penderia LiDAR memulangkan data jarak 9999 meter secara berselang-selang semasa berhadapan dinding makmal pada jarak 1 meter.',
    isSyntheticOrAnomaly: true,
    explanation: 'ANOMALI PENDERIA: Glitch isyarat penderia (Sensor Glitch) akibat gangguan optik pantulan lantai licin.',
  },
  {
    id: 8,
    category: 'Dron & Robotik Autonomi',
    scenario: 'Telemetri Dron Penyembur Baja Automatik',
    evidence: 'Penerima GPS RTK mengunci kedudukan dengan ketepatan sisihan 1.2 cm merentasi zon poligon terancang.',
    isSyntheticOrAnomaly: false,
    explanation: 'NAVIGASI NORMAL: Dron beroperasi dalam had kestabilan penerbangan autonomi tahap piawai.',
  },
  {
    id: 9,
    category: 'Agrotech AI (FPA)',
    scenario: 'Pengesanan Penyakit Fertigasi Cili Merah',
    evidence: 'Model YOLOv11 mengesan bintik lekuk berair kehitaman pada permukaan buah cili merah (Anthracnose).',
    isSyntheticOrAnomaly: true,
    explanation: 'ANOMALI DIKESAN: Penyakit Antraknos dikesan pada keyakinan 94.8% dan memerlukan pengasingan pokok.',
  },
  {
    id: 10,
    category: 'Computer Vision & Deepfake',
    scenario: 'Pemeriksaan Sijil Digital Anugerah Dekan',
    evidence: 'Ketiadaan tera air digital kriptografi dan fon huruf nombor siri tidak sepadan dengan templat rasmi Hal Ehwal Akademik.',
    isSyntheticOrAnomaly: true,
    explanation: 'DOKUMEN SINTETIK: Sijil palsu yang dijana tanpa tandatangan kunci persendirian universiti.',
  },
];

export const AIGame: React.FC<AIGameProps> = ({ isOpen, onClose }) => {
  // Game Selector: 'epoch_rush' or 'neural_detective'
  const [activeGame, setActiveGame] = useState<'epoch_rush' | 'neural_detective'>('epoch_rush');

  // ==========================================
  // GAME 1: EPOCH RUSH (DRONE RUNNER)
  // ==========================================
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('aisa_game_highscore') || '0', 10);
  });
  const [epoch, setEpoch] = useState(1);
  const [health, setHealth] = useState(3);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Web Audio Synth for retro sound effects
  const playSound = useCallback((type: 'collect' | 'hit' | 'golden' | 'gameover' | 'correct' | 'wrong' | 'combo') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'collect' || type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.12);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'golden' || type === 'combo') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.1);
        osc.frequency.linearRampToValueAtTime(1320, now + 0.25);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'hit' || type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'gameover') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(55, now + 0.4);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch {
      // AudioContext fallback
    }
  }, [soundEnabled]);

  const startGame1 = () => {
    setScore(0);
    setHealth(3);
    setEpoch(1);
    setGameState('playing');
  };

  useEffect(() => {
    if (!isOpen || activeGame !== 'epoch_rush' || gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    let playerX = width / 2;
    const playerY = height - 45;
    const playerWidth = 50;
    const playerHeight = 22;
    let targetPlayerX = playerX;

    let currentScore = 0;
    let currentHealth = 3;
    let currentEpoch = 1;
    let items: GameObject[] = [];
    let lastSpawn = 0;
    let spawnInterval = 650;
    let animationId: number;

    const keys: Record<string, boolean> = {};
    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true;
      if (['ArrowLeft', 'ArrowRight', ' ', 'a', 'd'].includes(e.key)) {
        e.preventDefault();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      targetPlayerX = (e.clientX - rect.left) * scaleX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        targetPlayerX = (e.touches[0].clientX - rect.left) * scaleX;
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove);

    const spawnItem = () => {
      const rand = Math.random();
      const x = Math.random() * (width - 40) + 20;

      let type: GameObject['type'] = 'weight';
      let speed = 2.5 + currentEpoch * 0.4;
      let label = 'w';
      let size = 20;

      if (rand < 0.45) {
        type = 'gpu';
        label = 'GPU';
        size = 24;
      } else if (rand < 0.75) {
        type = 'weight';
        label = 'DATA';
        size = 20;
      } else if (rand < 0.92) {
        type = 'bug';
        label = 'BUG';
        speed += 0.8;
        size = 22;
      } else {
        type = 'golden_epoch';
        label = '⚡AI';
        size = 26;
        speed += 1.2;
      }

      items.push({ x, y: -20, type, size, speed, label });
    };

    const loop = (time: number) => {
      const moveSpeed = 7;
      if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        targetPlayerX -= moveSpeed;
      }
      if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        targetPlayerX += moveSpeed;
      }

      playerX += (targetPlayerX - playerX) * 0.25;
      playerX = Math.max(playerWidth / 2, Math.min(width - playerWidth / 2, playerX));

      if (time - lastSpawn > spawnInterval) {
        spawnItem();
        lastSpawn = time;
        const newEpoch = Math.floor(currentScore / 400) + 1;
        if (newEpoch !== currentEpoch) {
          currentEpoch = newEpoch;
          setEpoch(newEpoch);
          spawnInterval = Math.max(300, 650 - currentEpoch * 40);
        }
      }

      ctx.fillStyle = '#060814';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.y += item.speed;

        const hitX = Math.abs(item.x - playerX) < (playerWidth / 2 + item.size / 2);
        const hitY = Math.abs(item.y - playerY) < (playerHeight / 2 + item.size / 2);

        if (hitX && hitY) {
          if (item.type === 'gpu') {
            currentScore += 100;
            playSound('collect');
          } else if (item.type === 'weight') {
            currentScore += 50;
            playSound('collect');
          } else if (item.type === 'golden_epoch') {
            currentScore += 250;
            playSound('golden');
            confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
          } else if (item.type === 'bug') {
            currentHealth -= 1;
            setHealth(currentHealth);
            playSound('hit');
            if (currentHealth <= 0) {
              playSound('gameover');
              setGameState('gameover');
              setScore(currentScore);
              if (currentScore > highScore) {
                setHighScore(currentScore);
                localStorage.setItem('aisa_game_highscore', currentScore.toString());
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
              }
              return;
            }
          }
          setScore(currentScore);
          items.splice(i, 1);
          continue;
        }

        if (item.y > height + 30) {
          items.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        if (item.type === 'gpu') {
          ctx.fillStyle = '#10b981';
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 12;
          ctx.arc(item.x, item.y, item.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.type === 'weight') {
          ctx.fillStyle = '#06b6d4';
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 10;
          ctx.arc(item.x, item.y, item.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.type === 'golden_epoch') {
          ctx.fillStyle = '#f59e0b';
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 18;
          ctx.arc(item.x, item.y, item.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 14;
          ctx.rect(item.x - item.size / 2, item.y - item.size / 2, item.size, item.size);
          ctx.fill();
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.label, item.x, item.y);
        ctx.restore();
      }

      ctx.save();
      ctx.shadowColor = '#6366f1';
      ctx.shadowBlur = 16;
      ctx.fillStyle = '#6366f1';
      ctx.beginPath();
      ctx.roundRect(playerX - playerWidth / 2, playerY - playerHeight / 2, playerWidth, playerHeight, 8);
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(playerX, playerY, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#a855f7';
      ctx.fillRect(playerX - 16, playerY + playerHeight / 2, 8, 5);
      ctx.fillRect(playerX + 8, playerY + playerHeight / 2, 8, 5);
      ctx.restore();

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationId);
    };
  }, [isOpen, activeGame, gameState, epoch, highScore, playSound]);

  // ==========================================
  // GAME 2: NEURAL DETECTIVE (VISION AI CLASSIFIER)
  // ==========================================
  const [detectiveState, setDetectiveState] = useState<'idle' | 'playing' | 'round_result' | 'gameover'>('idle');
  const [detectiveScore, setDetectiveScore] = useState(0);
  const [detectiveHighScore, setDetectiveHighScore] = useState(() => {
    return parseInt(localStorage.getItem('aisa_detective_highscore') || '0', 10);
  });
  const [caseIndex, setCaseIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [roundTimer, setRoundTimer] = useState(6);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const currentCase = DETECTIVE_CASES[caseIndex % DETECTIVE_CASES.length];

  // Round timer countdown
  useEffect(() => {
    if (!isOpen || activeGame !== 'neural_detective' || detectiveState !== 'playing') return;

    if (roundTimer <= 0) {
      handleDetectiveDecision(null); // Time out
      return;
    }

    const timer = setInterval(() => {
      setRoundTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, activeGame, detectiveState, roundTimer]);

  const startDetectiveGame = () => {
    setDetectiveScore(0);
    setStreak(0);
    setCaseIndex(0);
    setRoundTimer(6);
    setLastAnswerCorrect(null);
    setDetectiveState('playing');
  };

  const handleDetectiveDecision = (userChoice: boolean | null) => {
    if (detectiveState !== 'playing') return;

    const isCorrect = userChoice === currentCase.isSyntheticOrAnomaly;
    setLastAnswerCorrect(isCorrect);
    setDetectiveState('round_result');

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      const multiplier = Math.min(5, newStreak >= 3 ? 3 : newStreak >= 2 ? 2 : 1);
      const points = (100 + roundTimer * 20) * multiplier;
      const updatedScore = detectiveScore + points;
      setDetectiveScore(updatedScore);

      if (newStreak >= 3) {
        playSound('combo');
      } else {
        playSound('correct');
      }

      if (updatedScore > detectiveHighScore) {
        setDetectiveHighScore(updatedScore);
        localStorage.setItem('aisa_detective_highscore', updatedScore.toString());
      }
    } else {
      setStreak(0);
      playSound('wrong');
    }

    // Advance to next round or game over after 10 cases
    setTimeout(() => {
      if (caseIndex + 1 >= 8) {
        setDetectiveState('gameover');
        playSound('golden');
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      } else {
        setCaseIndex((prev) => prev + 1);
        setRoundTimer(6);
        setDetectiveState('playing');
      }
    }, 2200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-indigo-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header with Sound & Close */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Bot className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-space">
                MODUL SIMULASI & PENDIDIKAN AI AISA
              </h3>
              <p className="text-[11px] text-slate-400">
                Pusat Pembelajaran Interaktif Mahasiswa FSKM & FPA UiTM Jasin
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Kawal Bunyi"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2-GAME ARCADE SELECTOR TABS */}
        <div className="flex items-center gap-2 my-3 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveGame('epoch_rush')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-space flex items-center justify-center gap-2 transition-all ${
              activeGame === 'epoch_rush'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4 shrink-0 text-cyan-300" />
            <span>Permainan 1: Epoch Rush</span>
          </button>
          <button
            onClick={() => setActiveGame('neural_detective')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-space flex items-center justify-center gap-2 transition-all ${
              activeGame === 'neural_detective'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scan className="w-4 h-4 shrink-0 text-pink-300" />
            <span>Permainan 2: Neural Detective</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* VIEW 1: GAME 1 (EPOCH RUSH)                               */}
        {/* ========================================================= */}
        {activeGame === 'epoch_rush' && (
          <div className="flex-1 flex flex-col">
            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-2 mb-3 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 text-center font-mono-code text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">SKOR</span>
                <span className="text-cyan-400 font-bold text-sm">{score}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">SKOR TERTINGGI</span>
                <span className="text-amber-400 font-bold text-sm">{highScore}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">EPOCH</span>
                <span className="text-purple-400 font-bold text-sm">{epoch}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">KESIHATAN</span>
                <span className="text-rose-400 font-bold text-sm">{'❤️'.repeat(Math.max(0, health))}</span>
              </div>
            </div>

            {/* Canvas */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex-1">
              <canvas
                ref={canvasRef}
                width={520}
                height={350}
                className="w-full h-auto block cursor-crosshair"
              />

              {/* Idle Screen */}
              {gameState === 'idle' && (
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                  <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 mb-3 animate-bounce">
                    <Zap className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-black text-white font-space mb-1">
                    Latihan Model & Dron AI AISA
                  </h4>
                  <p className="text-xs text-slate-300 max-w-sm mb-4 leading-relaxed">
                    Kawal dron penyelidikan AI anda: kutip <span className="text-emerald-400 font-bold">GPU (+100)</span> dan <span className="text-cyan-400 font-bold">DATA (+50)</span>, elak <span className="text-rose-400 font-bold">BUG OVERFLOW</span>!
                  </p>
                  <button
                    onClick={startGame1}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 text-white font-bold font-space hover:scale-105 transition-transform shadow-lg shadow-indigo-500/30"
                  >
                    <Play className="w-4 h-4" /> MULA LATIHAN MODEL
                  </button>
                </div>
              )}

              {/* Game Over Screen */}
              {gameState === 'gameover' && (
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                  <div className="p-3 rounded-full bg-rose-500/20 text-rose-400 mb-2">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-black text-rose-400 font-space mb-1">
                    GRADIENT OVERFLOW! (TAMAT)
                  </h4>
                  <p className="text-xs text-slate-300 mb-3">
                    Model anda berjaya dilatih sehingga <span className="text-purple-400 font-bold">Epoch {epoch}</span>!
                  </p>
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl mb-4 w-48">
                    <div className="text-[11px] text-slate-400 font-mono-code">Skor Akhir</div>
                    <div className="text-2xl font-black text-cyan-400 font-mono-code">{score}</div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={startGame1}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm font-space transition-all"
                    >
                      <RotateCcw className="w-4 h-4" /> CUBA LAGI
                    </button>
                    <button
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold font-space"
                    >
                      TUTUP
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer instructions */}
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono-code">
              <span>🎮 Kawalan: Sentuhan / Tetikus / Kekunci Anak Panah</span>
              <span className="flex items-center gap-1 text-amber-400">
                <Trophy className="w-3.5 h-3.5" /> UiTM Jasin AI Leaderboard
              </span>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: GAME 2 (NEURAL DETECTIVE - VISION AI CLASSIFIER)  */}
        {/* ========================================================= */}
        {activeGame === 'neural_detective' && (
          <div className="flex-1 flex flex-col space-y-3">
            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-center font-mono-code text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">SKOR DETEKTIF</span>
                <span className="text-purple-400 font-bold text-sm">{detectiveScore}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">REKOD TERTINGGI</span>
                <span className="text-amber-400 font-bold text-sm">{detectiveHighScore}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">KES SEMAKAN</span>
                <span className="text-cyan-400 font-bold text-sm">{caseIndex + 1} / 8</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">STREAK COMBO</span>
                <span className="text-pink-400 font-bold text-sm">
                  {streak > 0 ? `🔥 x${Math.min(5, streak >= 3 ? 3 : streak >= 2 ? 2 : 1)}` : 'Tiada'}
                </span>
              </div>
            </div>

            {/* Main Stage */}
            {detectiveState === 'idle' && (
              <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-950/40 to-slate-950 border border-purple-500/30 flex flex-col items-center justify-center text-center space-y-3">
                <div className="p-3.5 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse">
                  <Scan className="w-10 h-10" />
                </div>
                <h4 className="text-lg font-black text-white font-space">
                  Penyelidik Visi Komputer & Detektif AI
                </h4>
                <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
                  Uji kemahiran anda dalam mengklasifikasikan bukti lapangan UiTM Jasin: adakah senario merupakan <strong className="text-pink-400">Janaan AI / Anomali Dikesan</strong> atau <strong className="text-emerald-400">Pola Asli / Mahasiswa / Tanaman Sihat</strong> dalam tempoh 6 saat!
                </p>
                <button
                  onClick={startDetectiveGame}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold font-space hover:scale-105 transition-transform shadow-lg shadow-purple-600/30"
                >
                  <Play className="w-4 h-4" /> MULA SIASATAN KES (ROUND 1)
                </button>
              </div>
            )}

            {(detectiveState === 'playing' || detectiveState === 'round_result') && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-3">
                {/* Timer Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono-code">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      ZON SIASATAN: <strong className="text-white">{currentCase.category}</strong>
                    </span>
                    <span className="text-amber-400 font-bold">MASA BERBAKI: {roundTimer}S</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 transition-all duration-1000 ease-linear rounded-full"
                      style={{ width: `${(roundTimer / 6) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Case Scenario Box */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    KES #{currentCase.id}: {currentCase.scenario}
                  </span>
                  <p className="text-sm text-slate-100 font-medium leading-relaxed">
                    "{currentCase.evidence}"
                  </p>
                </div>

                {/* Feedback Toast if Round Just Ended */}
                {detectiveState === 'round_result' && (
                  <div
                    className={`p-3 rounded-xl border text-xs font-mono-code flex items-start gap-2 animate-fadeIn ${
                      lastAnswerCorrect
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                    }`}
                  >
                    {lastAnswerCorrect ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                    )}
                    <div>
                      <strong className="block font-bold">
                        {lastAnswerCorrect ? 'KLASIFIKASI TEPAT!' : 'KLASIFIKASI KURANG TEPAT!'}
                      </strong>
                      <span className="text-[11px] text-slate-300">{currentCase.explanation}</span>
                    </div>
                  </div>
                )}

                {/* 2 Big Decision Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    disabled={detectiveState !== 'playing'}
                    onClick={() => handleDetectiveDecision(true)}
                    className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-600/20 to-purple-600/20 border border-pink-500/50 hover:border-pink-400 hover:bg-pink-600/30 active:scale-95 text-left transition-all disabled:opacity-50 group flex items-center justify-between"
                  >
                    <div>
                      <span className="block text-xs font-black font-space text-pink-300 group-hover:text-white">
                        🤖 JANAAN AI / ANOMALI
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Sintetik, Halusinasi, atau Penyakit
                      </span>
                    </div>
                    <span className="px-2 py-1 rounded-lg bg-pink-500/30 text-pink-200 text-xs font-mono-code font-bold">
                      [1]
                    </span>
                  </button>

                  <button
                    disabled={detectiveState !== 'playing'}
                    onClick={() => handleDetectiveDecision(false)}
                    className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/50 hover:border-emerald-400 hover:bg-emerald-600/30 active:scale-95 text-left transition-all disabled:opacity-50 group flex items-center justify-between"
                  >
                    <div>
                      <span className="block text-xs font-black font-space text-emerald-300 group-hover:text-white">
                        👤 ASLI / MAHASISWA / SIHAT
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Pola Semula Jadi, Foto Tulen
                      </span>
                    </div>
                    <span className="px-2 py-1 rounded-lg bg-emerald-500/30 text-emerald-200 text-xs font-mono-code font-bold">
                      [2]
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Game Over Screen */}
            {detectiveState === 'gameover' && (
              <div className="p-6 rounded-2xl bg-slate-950 border border-purple-500/40 text-center space-y-3 animate-fadeIn">
                <div className="p-3 rounded-full bg-purple-500/20 text-purple-300 w-12 h-12 mx-auto flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-black text-white font-space">
                  LAPORAN AKHIR DETEKTIF VISI AI
                </h4>
                <p className="text-xs text-slate-300">
                  Tahniah! Anda telah menamatkan 8 sesi siasatan kes biometrik dan agroteknologi.
                </p>
                <div className="inline-block p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-mono-code">Jumlah Skor Dikumpul</span>
                  <div className="text-2xl font-black text-purple-400 font-mono-code">{detectiveScore}</div>
                </div>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={startDetectiveGame}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-space transition-all"
                  >
                    <RotateCcw className="w-4 h-4" /> MAIN SEMULA
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold font-space"
                  >
                    SELESAI
                  </button>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono-code">
              <span>🧠 Pembelajaran Deep Learning, GAN & Penderiaan Dron FPA</span>
              <span className="text-cyan-400 font-bold">UiTM Melaka Kampus Jasin</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIGame;
