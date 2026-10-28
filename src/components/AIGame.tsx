import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Trophy, X, Zap, Shield, Sparkles } from 'lucide-react';
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

export const AIGame: React.FC<AIGameProps> = ({ isOpen, onClose }) => {
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
  const playSound = useCallback((type: 'collect' | 'hit' | 'golden' | 'gameover') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'collect') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'golden') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.linearRampToValueAtTime(1046.5, now + 0.25);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'hit') {
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

  const startGame = () => {
    setScore(0);
    setHealth(3);
    setEpoch(1);
    setGameState('playing');
  };

  useEffect(() => {
    if (!isOpen || gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions
    const width = canvas.width;
    const height = canvas.height;

    // Player drone state
    let playerX = width / 2;
    const playerY = height - 45;
    const playerWidth = 50;
    const playerHeight = 22;
    let targetPlayerX = playerX;

    // Game variables
    let currentScore = 0;
    let currentHealth = 3;
    let currentEpoch = 1;
    let items: GameObject[] = [];
    let lastSpawn = 0;
    let spawnInterval = 650;
    let animationId: number;

    // Key handlers
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

    // Mouse / Touch movement tracking
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

    // Spawn falling objects
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

    // Main Game Loop
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      // Update player position via keyboard
      const moveSpeed = 7;
      if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        targetPlayerX -= moveSpeed;
      }
      if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        targetPlayerX += moveSpeed;
      }

      // Smooth lerp to target position
      playerX += (targetPlayerX - playerX) * 0.25;
      playerX = Math.max(playerWidth / 2, Math.min(width - playerWidth / 2, playerX));

      // Spawn items
      if (time - lastSpawn > spawnInterval) {
        spawnItem();
        lastSpawn = time;
        // Progress epoch based on score
        const newEpoch = Math.floor(currentScore / 400) + 1;
        if (newEpoch !== currentEpoch) {
          currentEpoch = newEpoch;
          setEpoch(newEpoch);
          spawnInterval = Math.max(300, 650 - currentEpoch * 40);
        }
      }

      // Clear Canvas
      ctx.fillStyle = '#060814';
      ctx.fillRect(0, 0, width, height);

      // Draw grid lines (Cyber effect)
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Update and draw items
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.y += item.speed;

        // Collision detection with player drone
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

        // Remove offscreen
        if (item.y > height + 30) {
          items.splice(i, 1);
          continue;
        }

        // Draw Item
        ctx.save();
        ctx.beginPath();
        if (item.type === 'gpu') {
          ctx.fillStyle = '#10b981'; // Green
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 12;
          ctx.arc(item.x, item.y, item.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.type === 'weight') {
          ctx.fillStyle = '#06b6d4'; // Cyan
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 10;
          ctx.arc(item.x, item.y, item.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.type === 'golden_epoch') {
          ctx.fillStyle = '#f59e0b'; // Gold
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 18;
          ctx.arc(item.x, item.y, item.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#ef4444'; // Red Bug
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 14;
          ctx.rect(item.x - item.size / 2, item.y - item.size / 2, item.size, item.size);
          ctx.fill();
        }

        // Item text label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.label, item.x, item.y);
        ctx.restore();
      }

      // Draw Player AI Drone
      ctx.save();
      ctx.shadowColor = '#6366f1';
      ctx.shadowBlur = 16;
      ctx.fillStyle = '#6366f1';
      // Drone main body
      ctx.beginPath();
      ctx.roundRect(playerX - playerWidth / 2, playerY - playerHeight / 2, playerWidth, playerHeight, 8);
      ctx.fill();

      // Drone cockpit glow
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(playerX, playerY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Thrusters
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
  }, [isOpen, gameState, epoch, highScore, playSound]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-400 animate-pulse" />
            <h3 className="text-lg font-bold text-white font-space tracking-wide">
              AISA NEURAL RUNNER: <span className="text-cyan-400">EPOCH RUSH</span>
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              title="Bunyi"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Game Stats Bar */}
        <div className="grid grid-cols-4 gap-2 my-4 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 text-center font-mono-code text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">SCORE</span>
            <span className="text-cyan-400 font-bold text-sm">{score}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">HIGH SCORE</span>
            <span className="text-amber-400 font-bold text-sm">{highScore}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">EPOCH</span>
            <span className="text-purple-400 font-bold text-sm">{epoch}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">HEALTH</span>
            <span className="text-rose-400 font-bold text-sm">{'❤️'.repeat(Math.max(0, health))}</span>
          </div>
        </div>

        {/* Canvas Game Area */}
        <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
          <canvas
            ref={canvasRef}
            width={480}
            height={380}
            className="w-full h-auto block cursor-crosshair"
          />

          {/* Idle Screen */}
          {gameState === 'idle' && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <Sparkles className="w-12 h-12 text-indigo-400 mb-3 animate-bounce" />
              <h4 className="text-xl font-black text-white font-space mb-1">
                Latih Model AI AISA!
              </h4>
              <p className="text-xs text-slate-300 max-w-xs mb-4">
                Kawal drone AI anda: kutip <span className="text-emerald-400 font-bold">GPU (+100)</span> & <span className="text-cyan-400 font-bold">DATA (+50)</span>, elak <span className="text-rose-400 font-bold">BUG OVERFLOW</span>!
              </p>
              <button
                onClick={startGame}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold font-space hover:scale-105 transition-transform shadow-lg shadow-indigo-500/30"
              >
                <Play className="w-4 h-4" /> MULA BERMAIN
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
                GRADIENT OVERFLOW! (GAME OVER)
              </h4>
              <p className="text-xs text-slate-300 mb-3">
                Model anda berjaya dilatih sehingga <span className="text-purple-400 font-bold">Epoch {epoch}</span>!
              </p>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl mb-4 w-48">
                <div className="text-[11px] text-slate-400">Skor Akhir</div>
                <div className="text-2xl font-black text-cyan-400 font-mono-code">{score}</div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={startGame}
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

        {/* Controls Instructions Footer */}
        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
          <span>🎮 Kawalan: Tetikus / Touch / Kekunci <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-200">←</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-200">→</kbd></span>
          <span className="flex items-center gap-1 text-amber-400">
            <Trophy className="w-3.5 h-3.5" /> UiTM Jasin AI Leaderboard
          </span>
        </div>
      </div>
    </div>
  );
};
