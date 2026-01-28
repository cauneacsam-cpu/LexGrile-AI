import React, { useState, useEffect } from 'react';
import SetupForm from './components/SetupForm';
import QuizInterface from './components/QuizInterface';
import ResultsView from './components/ResultsView';
import { generateQuiz } from './services/geminiService';
import { Question, QuizConfig, QuizResult, ViewState } from './types';
import { Loader2, AlertOctagon, Maximize, Minimize, Layout } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('SETUP');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Monitorizează schimbarea stării de fullscreen (de ex. dacă utilizatorul apasă ESC)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Eroare la activarea fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleStartQuiz = async (config: QuizConfig) => {
    setView('LOADING');
    setError(null);
    try {
      const generatedQuestions = await generateQuiz(config);
      setQuestions(generatedQuestions);
      setView('QUIZ');
    } catch (err: any) {
      setError(err.message || "A apărut o eroare neașteptată.");
      setView('SETUP');
    }
  };

  const handleQuizFinish = (finalResults: QuizResult[]) => {
    setResults(finalResults);
    setView('RESULTS');
  };

  const handleReset = () => {
    setQuestions([]);
    setResults([]);
    setView('SETUP');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-legal-200 flex flex-col">
      
      {/* Global Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center cursor-pointer group" onClick={() => view !== 'LOADING' && handleReset()}>
              <div className="w-9 h-9 bg-legal-800 rounded-lg flex items-center justify-center mr-3 group-hover:bg-black transition-colors">
                <span className="text-white font-serif font-bold text-xl">L</span>
              </div>
              <span className="font-serif font-bold text-xl text-legal-900 tracking-tight">
                LexGrile <span className="text-legal-500 font-light">AI</span>
              </span>
            </div>

            <div className="flex items-center gap-4">
              {view === 'QUIZ' && (
                 <div className="hidden md:flex items-center text-xs font-bold text-legal-600 bg-legal-50 px-3 py-1 rounded-full border border-legal-100 uppercase tracking-tighter">
                   Sesiune Activă
                 </div>
              )}
              
              <button 
                onClick={toggleFullscreen}
                className="p-2 text-slate-500 hover:text-legal-800 hover:bg-slate-100 rounded-full transition-all flex items-center gap-2"
                title={isFullscreen ? "Ieșire Fullscreen" : "Ecran Complet"}
              >
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                <span className="text-xs font-semibold hidden sm:inline uppercase">
                  {isFullscreen ? "Fereastră" : "Fullscreen"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {error && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm flex items-start gap-3 animate-fade-in">
            <AlertOctagon className="text-red-500 flex-shrink-0" />
            <div>
              <p className="font-bold text-red-800">Eroare</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {view === 'SETUP' && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-legal-900 mb-4">
                Pregătire pentru Performanță
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Generează grile unice bazate pe Codurile din România, cu raționament juridic complex și stil adaptat examenelor de admitere.
              </p>
            </div>
            <SetupForm onStart={handleStartQuiz} />
          </div>
        )}

        {view === 'LOADING' && (
          <div className="flex flex-col items-center justify-center py-24 animate-pulse">
            <div className="relative mb-8">
              <Loader2 className="w-20 h-20 text-legal-600 animate-spin" />
              <Layout className="w-8 h-8 text-legal-200 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-legal-900 mb-3 text-center">Analizăm textele de lege...</h2>
            <div className="space-y-2 text-center">
              <p className="text-slate-500 max-w-md mx-auto italic">
                AI-ul construiește spețe și corelează articolele din {questions.length > 0 ? 'materiile selectate' : 'codurile juridice'}.
              </p>
              <div className="flex justify-center gap-1">
                <div className="w-2 h-2 bg-legal-300 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                <div className="w-2 h-2 bg-legal-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-legal-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}

        {view === 'QUIZ' && (
          <QuizInterface 
            questions={questions} 
            onFinish={handleQuizFinish} 
          />
        )}

        {view === 'RESULTS' && (
          <ResultsView 
            questions={questions} 
            results={results} 
            onReset={handleReset} 
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-xs">
          <p className="mb-2">© {new Date().getFullYear()} LexGrile AI. Dezvoltat pentru studiul avansat al dreptului românesc.</p>
          <p className="max-w-xl mx-auto opacity-75">
            Disclaimer: Acest simulator folosește inteligență artificială. Rezultatele au scop pur educațional. 
            Verificați întotdeauna versiunea oficială a legii în Monitorul Oficial.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;