import React, { useState } from 'react';
import { Question, QuizResult } from '../types';
import { CheckCircle, XCircle, RotateCcw, BookOpen, AlertTriangle } from 'lucide-react';

interface ResultsViewProps {
  questions: Question[];
  results: QuizResult[];
  onReset: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ questions, results, onReset }) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const correctCount = results.filter(r => r.isCorrect).length;
  const score = Math.round((correctCount / questions.length) * 100);
  
  // Calculate a "grade" color
  let scoreColor = 'text-red-600';
  if (score >= 50) scoreColor = 'text-orange-500';
  if (score >= 70) scoreColor = 'text-legal-600';
  if (score >= 90) scoreColor = 'text-green-600';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Score Card */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden text-center p-8 border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Rezultatele Sesiunii</h2>
        <div className={`text-6xl font-black ${scoreColor} mb-4`}>
          {correctCount}<span className="text-3xl text-slate-400 font-medium">/{questions.length}</span>
        </div>
        <p className="text-slate-500 mb-6">Ai obținut un punctaj de {score} puncte.</p>
        
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 bg-legal-800 text-white px-6 py-3 rounded-lg hover:bg-legal-700 transition-colors shadow-lg"
        >
          <RotateCcw size={18} />
          Generează un test nou
        </button>
      </div>

      {/* Detailed Review */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-800 ml-2">Analiză Detaliată</h3>
        
        {questions.map((q, idx) => {
          const result = results.find(r => r.questionId === q.id)!;
          const isExpanded = expandedId === q.id;
          
          return (
            <div 
              key={q.id} 
              className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 transition-all duration-300
                ${result.isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}
            >
              <div 
                className="p-6 cursor-pointer hover:bg-slate-50"
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {result.isCorrect 
                      ? <CheckCircle className="text-green-500 w-6 h-6" /> 
                      : <XCircle className="text-red-500 w-6 h-6" />
                    }
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-2">
                       <span className="font-bold text-slate-700">Grila #{idx + 1}</span>
                       <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                         {isExpanded ? 'Ascunde Detalii' : 'Arată Detalii'}
                       </span>
                    </div>
                    <p className={`text-slate-800 font-serif ${!isExpanded && 'line-clamp-2'}`}>
                      {q.text}
                    </p>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50">
                  <div className="grid gap-3 mb-6">
                    {q.options.map((opt, optIdx) => {
                      const letter = String.fromCharCode(65 + optIdx);
                      const isSelected = result.selectedIndices.includes(optIdx);
                      const isActuallyCorrect = q.correctIndices.includes(optIdx);
                      
                      let optionClass = "border-slate-200 bg-white";
                      let icon = null;

                      if (isActuallyCorrect) {
                        optionClass = "border-green-300 bg-green-50 ring-1 ring-green-400";
                        icon = <CheckCircle size={16} className="text-green-600" />;
                      } else if (isSelected && !isActuallyCorrect) {
                        optionClass = "border-red-300 bg-red-50 ring-1 ring-red-400";
                        icon = <XCircle size={16} className="text-red-600" />;
                      }

                      return (
                        <div key={optIdx} className={`p-3 rounded-md border flex items-start gap-3 ${optionClass}`}>
                          <span className="font-bold w-6">{letter}.</span>
                          <span className="flex-grow text-sm md:text-base">{opt}</span>
                          {icon}
                          {isSelected && !isActuallyCorrect && <span className="text-xs text-red-600 font-bold self-center">Ales Greșit</span>}
                          {isSelected && isActuallyCorrect && <span className="text-xs text-green-600 font-bold self-center">Ales Corect</span>}
                          {!isSelected && isActuallyCorrect && <span className="text-xs text-green-600 font-bold self-center">Trebuia Ales</span>}
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="flex items-center gap-2 text-blue-800 font-bold mb-2">
                      <BookOpen size={18} />
                      Soluție și Explicație
                    </h4>
                    <p className="text-blue-900 text-sm leading-relaxed whitespace-pre-wrap">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsView;