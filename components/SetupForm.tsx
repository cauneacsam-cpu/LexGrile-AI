import React, { useState } from 'react';
import { BookOpen, Scale, Gavel, FileText, ChevronRight, GraduationCap, CheckCircle2, ListChecks } from 'lucide-react';
import { QuizConfig, LegalCode, Difficulty, QuestionType, CorrectAnswersMode } from '../types';

interface SetupFormProps {
  onStart: (config: QuizConfig) => void;
}

const SetupForm: React.FC<SetupFormProps> = ({ onStart }) => {
  const [selectedCodes, setSelectedCodes] = useState<LegalCode[]>([LegalCode.CIVIL]);
  const [topic, setTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [questionType, setQuestionType] = useState<QuestionType>(QuestionType.MIXED);
  const [count, setCount] = useState<number>(10);
  const [correctMode, setCorrectMode] = useState<CorrectAnswersMode>(CorrectAnswersMode.ONE_OR_TWO);

  const toggleCode = (code: LegalCode) => {
    setSelectedCodes(prev => 
      prev.includes(code) 
        ? (prev.length > 1 ? prev.filter(c => c !== code) : prev) 
        : [...prev, code]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({ 
      codes: selectedCodes, 
      topic: topic || 'General / Toată materia', 
      difficulty, 
      questionType,
      count,
      correctMode
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200 animate-fade-in-up">
      <div className="bg-legal-900 p-6 text-white flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold flex items-center gap-2">
            <Scale className="w-6 h-6 text-legal-200" />
            Configurare Sesiune
          </h2>
          <p className="text-legal-300 text-sm mt-1">Grile cu 3 variante (A, B, C)</p>
        </div>
        <GraduationCap className="w-10 h-10 text-legal-500 opacity-50" />
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* Materie Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">
            Materiile Selectate
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.values(LegalCode).map((c) => {
              const isSelected = selectedCodes.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCode(c)}
                  className={`p-4 rounded-lg border text-left transition-all duration-200 flex items-center justify-between
                    ${isSelected 
                      ? 'border-legal-600 bg-legal-50 text-legal-900 ring-1 ring-legal-600 shadow-sm' 
                      : 'border-slate-200 hover:border-legal-300 text-slate-600 bg-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    {c.includes('Procedură') ? <Gavel size={18} /> : <BookOpen size={18} />}
                    <span className="font-medium text-sm">{c}</span>
                  </div>
                  {isSelected && <CheckCircle2 size={16} className="text-legal-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Correct Answers Mode */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <ListChecks size={16} className="text-legal-500" />
            Regim Răspunsuri Corecte (din 3 variante)
          </label>
          <div className="grid grid-cols-1 gap-2">
            {Object.values(CorrectAnswersMode).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setCorrectMode(mode)}
                className={`p-3 rounded-lg border text-sm font-medium transition-all text-left flex items-center gap-3
                  ${correctMode === mode 
                    ? 'bg-legal-700 text-white border-legal-700 shadow-md' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${correctMode === mode ? 'border-white' : 'border-slate-300'}`}>
                  {correctMode === mode && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Input & Question Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">
              Tipul Grilelor
            </label>
            <div className="flex gap-2">
              {Object.values(QuestionType).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setQuestionType(t)}
                  className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all
                    ${questionType === t 
                      ? 'bg-legal-800 text-white border-legal-800' 
                      : 'bg-white text-slate-500 border-slate-200'
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">
              Nivel Dificultate
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="w-full p-2.5 border border-slate-300 rounded-lg bg-white text-base focus:ring-2 focus:ring-legal-500 outline-none shadow-sm"
            >
              {Object.values(Difficulty).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="topic" className="block text-sm font-semibold text-slate-700 uppercase tracking-wider">
            Tematică Specifică (Opțional)
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ex: Rezoluțiunea contractului, Art. 1549..."
            className="w-full p-3 border border-slate-300 rounded-lg bg-white text-base focus:ring-2 focus:ring-legal-500 outline-none placeholder:text-slate-400 shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wider flex justify-between">
            Număr Grile <span>{count}</span>
          </label>
          <input 
            type="range" min="1" max="50" step="1" value={count} 
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-legal-600"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-legal-800 hover:bg-legal-700 text-white font-bold py-4 rounded-lg shadow-lg flex items-center justify-center gap-2 group transition-all"
        >
          <FileText size={20} />
          Generează {count} Grile
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
};

export default SetupForm;