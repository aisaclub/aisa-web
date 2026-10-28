import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Cpu, Award, Users } from 'lucide-react';

interface TeaserVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const scenes = [
  {
    start: 0,
    end: 4,
    badge: 'PENGENALAN PERSATUAN',
    title: 'WE ARE AISA UiTM JASIN',
    subtitle: 'Artificial Intelligence Student Association',
    description: 'Pusat tumpuan mahasiswa peneraju revolusi kecerdasan buatan di Kolej Pengajian Pengkomputeran, Informatik & Matematik (KPPIM) UiTM Melaka Kampus Jasin.',
    icon: Sparkles,
    color: 'from-indigo-600 via-indigo-900 to-black',
    highlight: 'KPPIM UiTM MELAKA',
    tag: '#NextGenAI'
  },
  {
    start: 4,
    end: 8,
    badge: 'TEKNOLOGI & PROJEK',
    title: 'AUTONOMOUS AGENTS & COMPUTER VISION',
    subtitle: 'Membina Algoritma Masa Depan',
    description: 'Dari latihan Large Language Models (LLM) hingga ke sistem penglihatan komputer masa nyata untuk Smart Agriculture & Healthcare.',
    icon: Cpu,
    color: 'from-cyan-600 via-blue-950 to-black',
    highlight: 'CUDA • PYTORCH • EDGE AI',
    tag: '#HandsOnCode'
  },
  {
    start: 8,
    end: 12,
    badge: 'PENCAPAIAN KEBANGSAAN',
    title: 'JUARA HACKATHON & GERAN INDUSTRI',
    subtitle: 'Mengiktiraf Bakat Pelajar di Pentas Negara',
    description: 'Lebih 15+ kemenangan podium dalam pertandingan peringkat universiti dan kerjasama aktif bersama rakan teknologi antarabangsa.',
    icon: Award,
    color: 'from-amber-600 via-yellow-950 to-black',
    highlight: 'RM50,000+ HADIAH TERKUMPUL',
    tag: '#AISAChampions'
  },
  {
    start: 12,
    end: 15,
    badge: 'SERTAI KAMI SESI 2026/2027',
    title: 'SHAPE THE FUTURE WITH US',
    subtitle: 'Jadilah Sebahagian Daripada Keluarga AISA',
    description: 'Sama ada anda seorang pereka visual, pengaturcara model atau pembina komuniti — tempat anda ada bersama AISA UiTM Jasin!',
    icon: Users,
    color: 'from-purple-600 via-indigo-950 to-black',
    highlight: 'PENDAFTARAN KINI DIBUKA',
    tag: '#AISA2026'
  }
];

export const TeaserVideoModal: React.FC<TeaserVideoModalProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const totalDuration = 15; // 15 seconds

  useEffect(() => {
    if (!isOpen) {
      setCurrentTime(0);
      setIsPlaying(true);
      return;
    }

    let interval: any;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return Math.min(totalDuration, prev + 0.1);
        });
      }, 100);
    }

    return () => window.clearInterval(interval);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  const currentScene = scenes.find((s) => currentTime >= s.start && currentTime <= s.end) || scenes[scenes.length - 1];
  const IconComponent = currentScene.icon;
  const progressPercent = (currentTime / totalDuration) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-3xl aspect-video rounded-3xl overflow-hidden border border-indigo-500/30 bg-slate-950 shadow-2xl flex flex-col justify-between">
        {/* Background Animated Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${currentScene.color} opacity-40 transition-all duration-700 pointer-events-none`} />
        
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent pointer-events-none" />

        {/* Top Bar with Timer and Close */}
        <div className="relative z-10 flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono-code font-bold bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
              {currentScene.badge}
            </span>
            <span className="text-xs font-mono-code text-cyan-400">
              {currentTime.toFixed(1)}s / {totalDuration}s
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMuted(!muted)}
              className="p-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white"
            >
              {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Cinematic Scene Content */}
        <div className="relative z-10 px-8 py-4 flex flex-col items-center text-center">
          <div className="inline-flex p-4 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-cyan-400 mb-4 animate-bounce">
            <IconComponent className="w-10 h-10" />
          </div>

          <span className="text-xs uppercase tracking-widest font-mono-code text-indigo-400 font-bold mb-1">
            {currentScene.tag}
          </span>

          <h2 className="text-2xl md:text-4xl font-black text-white font-space tracking-tight mb-2 drop-shadow-md">
            {currentScene.title}
          </h2>

          <h4 className="text-sm md:text-base font-semibold text-cyan-300 mb-3">
            {currentScene.subtitle}
          </h4>

          <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto mb-4 leading-relaxed">
            {currentScene.description}
          </p>

          <div className="inline-block px-4 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-xs font-mono-code text-indigo-300">
            ⚡ {currentScene.highlight}
          </div>
        </div>

        {/* Bottom Control Bar & Progress */}
        <div className="relative z-10 p-6 bg-slate-950/80 border-t border-slate-800/80">
          {/* Progress bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
            <div
              className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-500 h-full transition-all duration-100 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-space transition-all"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" /> PAUSE TEASER
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" /> PLAY TEASER
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setCurrentTime(0);
                  setIsPlaying(true);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Mula Semula"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Audio Equalizer Bars */}
            <div className="flex items-end gap-1 h-6">
              {[40, 80, 60, 100, 70, 90, 50, 85].map((val, idx) => (
                <div
                  key={idx}
                  className={`w-1 bg-cyan-400 rounded-full transition-all duration-200 ${
                    isPlaying && !muted ? 'animate-pulse' : 'opacity-30'
                  }`}
                  style={{
                    height: isPlaying && !muted ? `${(val * ((idx % 3) + 1)) % 100}%` : '20%',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
