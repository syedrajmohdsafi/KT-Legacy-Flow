import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import Layout from './components/Layout';
import TreeVisualizer from './components/TreeVisualizer';
import GuideView from './components/GuideView';
import { TreeType } from './types';
import { PATERNAL_ANCESTRY, MATERNAL_ANCESTRY, SHAJRA_DATA } from './constants';
import { speakText, playRawPCM } from './services/geminiService';

// Declare window.aistudio interface
declare global {
  interface Window {
    aistudio?: any;
  }
}

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
              {/* Background Image Layer */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={tile.image} 
                  alt={tile.title} 
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700 ease-out grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
              </div>
              
              {/* Content Layer */}
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
      
      {/* Top Bar for Family View */}
      <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-sm z-10 shrink-0">
        <h2 className="text-lg md:text-2xl font-black text-white hidden md:block">Bloodline</h2>
        
        {/* Mobile-optimized Toggle */}
        <div className="flex w-full md:w-auto bg-slate-950 p-1 rounded-xl border border-white/10">
          <button 
            onClick={() => setActiveTab('paternal')} 
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'paternal' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Paternal
          </button>
          <button 
            onClick={() => setActiveTab('maternal')} 
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'maternal' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Maternal
          </button>
        </div>
      </div>

      {/* Tree Container */}
      <div className="flex-1 relative w-full bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#020617_100%)]">
        <TreeVisualizer data={activeTab === 'paternal' ? PATERNAL_ANCESTRY : MATERNAL_ANCESTRY} type={TreeType.FAMILY} />
      </div>
    </div>
  );
};

const SilsilaView: React.FC = () => {
  const [loadingAudio, setLoadingAudio] = useState<string | null>(null);

  const handleRecite = async (text: string, id: string) => {
    if (loadingAudio !== null) return;
    setLoadingAudio(id);
    try {
      const audio = await speakText(text);
      if (audio) await playRawPCM(audio);
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
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeyReady(hasKey);
      } else {
        // In dev/other environments without aistudio, we assume key is handled externally
        setApiKeyReady(true);
      }
      setChecking(false);
    };
    checkKey();
  }, []);

  const requestKey = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        setApiKeyReady(true); // Optimistic update as per instructions
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (checking) {
    return <div className="h-full w-full bg-[#020617] flex items-center justify-center text-slate-500 font-mono text-xs">Initializing Secure Environment...</div>;
  }

  // API Key Protection Screen
  if (!apiKeyReady && window.aistudio) {
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