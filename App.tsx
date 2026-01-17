import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import Layout from './components/Layout';
import TreeVisualizer from './components/TreeVisualizer';
import GuideView from './components/GuideView';
import { TreeType } from './types';
import { PATERNAL_ANCESTRY, MATERNAL_ANCESTRY, SHAJRA_DATA } from './constants';
import { speakText, playRawPCM } from './services/geminiService';

const HomeView: React.FC = () => {
  const tiles = [
    { 
      to: "/family", 
      label: "Lineage", 
      title: "Ancestry", 
      desc: "Biological roots & Paternal branches.", 
      color: "from-blue-600 to-cyan-500",
      image: "https://images.unsplash.com/photo-1580137189272-c9379f8864fd?auto=format&fit=crop&w=800&q=80" 
    },
    { 
      to: "/silsila", 
      label: "Legacy", 
      title: "Spiritual Silsila", 
      desc: "The chain of spiritual inheritance.", 
      color: "from-emerald-600 to-teal-500",
      image: "https://images.unsplash.com/photo-1542048956-f61b369c748c?auto=format&fit=crop&w=800&q=80"
    },
    { 
      to: "/guide", 
      label: "Spiritual", 
      title: "Guide", 
      desc: "Salah, Wazu, and Surahs.", 
      color: "from-indigo-600 to-purple-500",
      image: "https://images.unsplash.com/photo-1603554749298-251de4863334?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-12 py-8 md:py-16">
        <div className="text-center space-y-4 animate-in fade-in zoom-in duration-1000">
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter">Legacy <span className="text-blue-500">Flow</span></h1>
          <p className="text-slate-400 max-w-xl mx-auto font-medium tracking-wide">A digital archive of biological and spiritual inheritance.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {tiles.map((tile, i) => (
            <Link key={i} to={tile.to} className="group glass rounded-3xl p-8 border border-white/5 hover:border-white/20 transition-all flex flex-col justify-end h-72 relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 z-0">
                <img 
                  src={tile.image} 
                  alt={tile.title} 
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700 ease-out grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
              </div>
              <div className="relative z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <div className={`absolute -inset-4 bg-gradient-to-r ${tile.color} blur-2xl opacity-0 group-hover:opacity-20 transition duration-500 -z-10`}></div>
                <span className="px-3 py-1 text-[9px] font-black uppercase text-white bg-white/10 backdrop-blur-md rounded-full mb-3 inline-block w-fit tracking-widest border border-white/10">{tile.label}</span>
                <h2 className="text-3xl font-black text-white mb-2 group-hover:text-blue-200 transition-colors drop-shadow-lg">{tile.title}</h2>
                <p className="text-sm text-slate-300 font-medium leading-relaxed max-w-[85%]">{tile.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const FamilyView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'paternal' | 'maternal'>('paternal');
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-950">
      <div className="flex items-center justify-center px-4 py-3 md:px-8 md:py-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-sm z-10 shrink-0">
        <div className="flex w-full md:w-auto bg-slate-950 p-1 rounded-xl border border-white/10 max-w-lg shadow-inner">
          <button 
            onClick={() => setActiveTab('paternal')} 
            className={`flex-1 md:px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'paternal' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Paternal
          </button>
          <button 
            onClick={() => setActiveTab('maternal')} 
            className={`flex-1 md:px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'maternal' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Family Tree (نسب نامہ)
          </button>
        </div>
      </div>
      <div className="flex-1 relative w-full bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#020617_100%)]">
        <TreeVisualizer data={activeTab === 'paternal' ? PATERNAL_ANCESTRY : MATERNAL_ANCESTRY} type={TreeType.FAMILY} />
      </div>
    </div>
  );
};

const SilsilaView: React.FC = () => {
  const [loadingAudio, setLoadingAudio] = useState<string | null>(null);
  const [activeSubtitleIdx, setActiveSubtitleIdx] = useState(-1);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Expanded translation list for the live display panel
  const translations = [
    { start: 0, end: 5, text: "In the name of Allah, the Most Gracious, the Most Merciful" },
    { start: 5, end: 12, text: "My body is the Murshid's body, my heart is the Murshid's heart" },
    { start: 12, end: 18, text: "My soul is the Murshid's soul, my manifest is the Murshid's manifest" },
    { start: 18, end: 24, text: "My hidden is the Murshid's hidden, my sight is the Murshid's sight" },
    { start: 24, end: 32, text: "O Allah! Bless our Master Muhammad, the Master of Lovers" },
    { start: 32, end: 40, text: "Bless our Master Muhammad, the Master of those who Answer" },
    { start: 40, end: 48, text: "Bless our Master Muhammad, the Master of the Divine Messengers" },
    { start: 48, end: 55, text: "Bless our Master Muhammad, the Master of the Steadfast" },
    { start: 55, end: 65, text: "By the sanctity of 'There is no god but Allah, Adam is the Pure one of Allah'" },
    { start: 65, end: 75, text: "By the sanctity of 'There is no god but Allah, Noah is the Prophet of Allah'" },
    { start: 75, end: 85, text: "By the sanctity of 'There is no god but Allah, Ibrahim is the Friend of Allah'" },
    { start: 85, end: 95, text: "By the sanctity of 'There is no god but Allah, Musa is the Interlocutor of Allah'" },
    { start: 95, end: 110, text: "By the sanctity of 'There is no god but Allah, Isa is the Spirit of Allah'" },
    { start: 110, end: 130, text: "By the sanctity of 'There is no god but Allah, Muhammad is the Messenger of Allah'" },
    { start: 130, end: 155, text: "Hazrat Meera Syed Muhammad Mahdi Mauood (A.S)" },
    { start: 155, end: 180, text: "Hazrat Bandagi Miyan Syed Mahmood Sani Mahdi (R.A)" },
    { start: 180, end: 205, text: "Hazrat Bandagi Miyan Shah Yaqub Hasani Wilayat (R.A)" },
    { start: 205, end: 230, text: "Hazrat Bandagi Miyan Syed Khundmir Bara Banisrail (R.A)" },
    { start: 230, end: 255, text: "Hazrat Bandagi Miyan Shah Nusrat Makhsoos-uz-Zaman (R.A)" },
    { start: 255, end: 280, text: "Hazrat Bandagi Miyan Syed Sharif (R.A)" },
    { start: 280, end: 305, text: "Hazrat Bandagi Miyan Syed Mubarak (R.A)" },
    { start: 305, end: 330, text: "Hazrat Bandagi Miyan Syed Khuda Bakhsh (R.H)" },
    { start: 330, end: 355, text: "Hazrat Bandagi Miyan Syed Najmuddin Shaheed Akbar (R.H)" },
    { start: 355, end: 500, text: "Continuing the sacred chain of spiritual transmission and blessings..." }
  ];

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    const idx = translations.findIndex(s => time >= s.start && time <= s.end);
    if (idx !== activeSubtitleIdx) {
      setActiveSubtitleIdx(idx);
    }
  };

  const handleRecite = async (text: string, id: string) => {
    if (loadingAudio !== null) return;
    setLoadingAudio(id);
    try {
      const audio = await speakText(text);
      if (audio) await playRawPCM(audio);
    } catch (err) {
      console.error("Recitation error:", err);
    } finally {
      setLoadingAudio(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full p-4 md:p-8 overflow-hidden">
      <div className="shrink-0 text-center md:text-left mb-6">
        <h2 className="text-2xl md:text-3xl font-black text-white">Spiritual Silsila</h2>
        <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest mt-1">The Sacred Chain of Inheritance (Tawassul)</p>
      </div>
      <div className="flex-1 glass rounded-3xl p-4 md:p-12 overflow-y-auto custom-scrollbar border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
          {SHAJRA_DATA.map((item, i) => (
            <div key={i} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {item.lines?.map((line, li) => {
                  const lineId = `${i}-${li}`;
                  return (
                    <div key={li} className="group flex flex-col p-6 md:p-8 bg-white/5 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                         <span className="text-5xl md:text-6xl font-black text-emerald-500">{li + 1}</span>
                       </div>
                       <div className="space-y-6">
                          <p className="text-2xl md:text-5xl font-serif text-white rtl leading-snug text-right">{line.arabic}</p>
                          <div className="h-px w-full bg-white/10 group-hover:bg-emerald-500/20 transition-colors"></div>
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                             <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] flex-1">{line.roman}</p>
                             <p className="text-lg md:text-xl font-serif text-slate-300 rtl leading-relaxed flex-1 text-right">{line.urdu}</p>
                          </div>
                          <button 
                            onClick={() => handleRecite(line.arabic, lineId)}
                            className="self-end px-4 py-2 rounded-xl bg-emerald-600/10 text-emerald-400 border border-emerald-600/20 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-2"
                          >
                            {loadingAudio === lineId ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>}
                            Recite
                          </button>
                       </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="mt-16 pt-12 border-t border-white/10 relative">
            <div className="absolute inset-x-0 -top-24 h-48 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full animate-pulse"></div>
            
            <div className="text-center mb-8">
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Recitation Archive - Silsila in mothers voice</h3>
              <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Historical Audio Preservation</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-video bg-black/60 flex flex-col justify-center">
                  <video 
                    ref={videoRef}
                    onTimeUpdate={handleTimeUpdate}
                    className="w-full h-full object-contain"
                    controls
                    playsInline
                    preload="metadata"
                    src="videos/Silsila-mothers-voice.mp4"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              <div className="glass rounded-3xl border border-white/5 p-6 flex flex-col gap-4 bg-slate-900/40 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live Translation Display</span>
                  <div className={`w-2 h-2 rounded-full ${activeSubtitleIdx >= 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`}></div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 max-h-[300px] pr-2">
                  {translations.map((t, idx) => (
                    <div 
                      key={idx}
                      className={`p-4 rounded-2xl border transition-all duration-300 ${idx === activeSubtitleIdx ? 'bg-emerald-600/20 border-emerald-500/50 scale-[1.02] shadow-lg' : 'bg-white/5 border-transparent opacity-40'}`}
                    >
                      <p className={`text-sm md:text-base font-medium leading-relaxed ${idx === activeSubtitleIdx ? 'text-white' : 'text-slate-400'}`}>
                        {t.text}
                      </p>
                    </div>
                  ))}
                  {activeSubtitleIdx === -1 && (
                    <div className="h-full flex items-center justify-center text-slate-600 text-[10px] font-black uppercase tracking-widest text-center py-12">
                      Play video to sync translation
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">
              <div className="h-px flex-1 bg-white/5"></div>
              <span>Digital Archive • Silsila Recitation</span>
              <div className="h-px flex-1 bg-white/5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [apiKeyReady, setApiKeyReady] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkKey = async () => {
      const win = window as any;
      if (win.aistudio) {
        const hasKey = await win.aistudio.hasSelectedApiKey();
        setApiKeyReady(hasKey);
      } else {
        setApiKeyReady(true);
      }
      setChecking(false);
    };
    checkKey();
  }, []);

  const requestKey = async () => {
    const win = window as any;
    if (win.aistudio) {
      try {
        await win.aistudio.openSelectKey();
        setApiKeyReady(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (checking) {
    return <div className="h-full w-full bg-[#020617] flex items-center justify-center text-slate-500 font-mono text-xs">Initializing Secure Environment...</div>;
  }

  const win = window as any;
  if (!apiKeyReady && win.aistudio) {
    return (
      <div className="h-full w-full bg-[#020617] flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in fade-in duration-700">
         <div className="space-y-4">
             <h1 className="text-5xl font-black text-white tracking-tighter">Legacy <span className="text-blue-500">Flow</span></h1>
             <p className="text-slate-400 max-w-lg mx-auto text-lg">To access the ancestral archives and spiritual guides, please connect your secure API key.</p>
         </div>
         <div className="flex flex-col items-center gap-5">
            <button 
              onClick={requestKey}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-sm uppercase tracking-widest shadow-xl shadow-blue-900/30 transition-all hover:scale-105"
            >
              Connect API Key
            </button>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs text-slate-600 hover:text-slate-400 underline decoration-slate-700 underline-offset-4"
            >
              Get a Gemini API Key
            </a>
         </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/family" element={<FamilyView />} />
          <Route path="/silsila" element={<SilsilaView />} />
          <Route path="/guide" element={<GuideView />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;