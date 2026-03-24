/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Telescope, 
  Rocket, 
  Orbit, 
  Thermometer, 
  Weight, 
  Wind, 
  Info, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Loader2,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { analyzeExoplanet, PlanetData } from './services/geminiService';
import { cn } from './lib/utils';

interface AnalysisResult {
  status: string;
  reasons: string[];
  description: string;
  confidenceScore: number;
}

export default function App() {
  const [planetData, setPlanetData] = useState<PlanetData>({
    name: '',
    starType: 'G-Tipi (Güneş Benzeri)',
    distance: 1.0,
    mass: 1.0,
    atmosphere: 'Azot, Oksijen, Argon',
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPlanetData(prev => ({
      ...prev,
      [name]: name === 'distance' || name === 'mass' || name === 'temperature' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planetData.name) {
      setError('Lütfen gezegene bir isim verin.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeExoplanet(planetData);
      setResult(analysis);
    } catch (err) {
      setError('Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('yaşanabilir')) return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10';
    if (s.includes('potansiyel')) return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
    return 'text-rose-400 border-rose-400/30 bg-rose-400/10';
  };

  const getStatusIcon = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('yaşanabilir')) return <CheckCircle2 className="w-6 h-6" />;
    if (s.includes('potansiyel')) return <AlertCircle className="w-6 h-6" />;
    return <XCircle className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-12 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-xs font-mono mb-4"
        >
          <Sparkles className="w-3 h-3" />
          <span>DEEP SPACE AI ANALYSIS v1.0</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40"
        >
          DÜNYANIN ÖTESİNDE
        </motion.h1>
        <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
          Yapay zeka destekli ötegezegen avı simülasyonu. Keşfettiğiniz gezegenin verilerini girin, AI yaşanabilirlik potansiyelini hesaplasın.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 space-y-6"
        >
          <div className="glass-panel p-6 relative overflow-hidden neon-border">
            <div className="scanline" />
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Telescope className="w-5 h-5 text-neon-blue" />
              Gezegen Verileri
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-500 uppercase">Gezegen Adı</label>
                <input
                  type="text"
                  name="name"
                  value={planetData.name}
                  onChange={handleInputChange}
                  placeholder="Örn: Kepler-452b"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue/50 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-500 uppercase">Yıldız Tipi</label>
                  <select
                    name="starType"
                    value={planetData.starType}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue/50 transition-colors appearance-none"
                  >
                    <option value="G-Tipi (Güneş Benzeri)">G-Tipi</option>
                    <option value="M-Tipi (Kızıl Cüce)">M-Tipi</option>
                    <option value="K-Tipi (Turuncu Cüce)">K-Tipi</option>
                    <option value="F-Tipi (Sarı-Beyaz)">F-Tipi</option>
                    <option value="A-Tipi (Beyaz)">A-Tipi</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-500 uppercase flex items-center gap-1">
                    <Orbit className="w-3 h-3" /> Uzaklık (AU)
                  </label>
                  <input
                    type="number"
                    name="distance"
                    step="0.01"
                    value={planetData.distance}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue/50 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-500 uppercase flex items-center gap-1">
                    <Weight className="w-3 h-3" /> Kütle (Dünya)
                  </label>
                  <input
                    type="number"
                    name="mass"
                    step="0.1"
                    value={planetData.mass}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-500 uppercase flex items-center gap-1">
                    <Thermometer className="w-3 h-3" /> Sıcaklık (K)
                  </label>
                  <input
                    type="number"
                    name="temperature"
                    placeholder="Opsiyonel"
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue/50 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-500 uppercase flex items-center gap-1">
                  <Wind className="w-3 h-3" /> Atmosfer Bileşimi
                </label>
                <input
                  type="text"
                  name="atmosphere"
                  value={planetData.atmosphere}
                  onChange={handleInputChange}
                  placeholder="Örn: CO2, Azot, Metan"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue/50 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isAnalyzing}
                className={cn(
                  "w-full mt-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all",
                  isAnalyzing 
                    ? "bg-white/10 text-slate-500 cursor-not-allowed" 
                    : "bg-neon-blue text-space-950 hover:bg-white hover:shadow-[0_0_20px_rgba(0,242,255,0.4)]"
                )}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    ANALİZ EDİLİYOR...
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5" />
                    TARAMAYI BAŞLAT
                  </>
                )}
              </button>
            </form>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}
        </motion.div>

        {/* Results Area */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!result && !isAnalyzing ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[400px] glass-panel flex flex-col items-center justify-center text-center p-8 border-dashed border-white/5"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Info className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-xl font-medium text-slate-400">Analiz Bekleniyor</h3>
                <p className="text-slate-500 text-sm max-w-xs mt-2">
                  Soldaki formdan gezegen verilerini girerek yapay zeka analizini başlatın.
                </p>
              </motion.div>
            ) : isAnalyzing ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[400px] glass-panel flex flex-col items-center justify-center p-8"
              >
                <div className="relative w-24 h-24 mb-6">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-t-neon-blue border-r-transparent border-b-transparent border-l-transparent rounded-full"
                  />
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-2 border border-t-neon-purple border-r-transparent border-b-transparent border-l-transparent rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Telescope className="w-8 h-8 text-neon-blue animate-pulse" />
                  </div>
                </div>
                <h3 className="text-xl font-mono text-neon-blue animate-pulse">VERİLER İŞLENİYOR...</h3>
                <div className="mt-4 space-y-2 w-48">
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="h-full bg-neon-blue"
                    />
                  </div>
                  <p className="text-[10px] font-mono text-slate-500 text-center uppercase tracking-widest">
                    Habitability Matrix Calibrating
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Güven Skoru</span>
                    <span className="text-2xl font-mono text-neon-blue">{result?.confidenceScore}%</span>
                  </div>
                </div>

                <div className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold mb-6",
                  getStatusColor(result?.status || '')
                )}>
                  {getStatusIcon(result?.status || '')}
                  {result?.status.toUpperCase()}
                </div>

                <h2 className="text-3xl font-bold mb-4">{planetData.name}</h2>
                <p className="text-slate-300 leading-relaxed mb-8 italic">
                  "{result?.description}"
                </p>

                <div className="space-y-6">
                  <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest border-b border-white/10 pb-2">
                    Analiz Detayları
                  </h4>
                  <ul className="space-y-4">
                    {result?.reasons.map((reason, idx) => (
                      <motion.li 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx} 
                        className="flex gap-3 text-sm text-slate-400"
                      >
                        <ChevronRight className="w-4 h-4 text-neon-blue shrink-0 mt-0.5" />
                        {reason}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="mt-12 pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="text-[10px] font-mono text-slate-500 uppercase">Sıcaklık</div>
                      <div className="text-sm font-mono">{planetData.temperature || '---'} K</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] font-mono text-slate-500 uppercase">Uzaklık</div>
                      <div className="text-sm font-mono">{planetData.distance} AU</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setResult(null)}
                    className="text-xs font-mono text-slate-500 hover:text-white transition-colors flex items-center gap-1"
                  >
                    YENİ TARAMA <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Decoration */}
      <footer className="mt-20 text-center text-[10px] font-mono text-slate-600 uppercase tracking-[0.2em]">
        &copy; 2026 Deep Space Exploration Initiative // Powered by Gemini AI
      </footer>
    </div>
  );
}
