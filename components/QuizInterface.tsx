import React, { useState } from 'react';
import { Question, QuizResult } from '../types';
import { CheckCircle2, XCircle, ArrowRight, AlertCircle, BookOpen, Check } from 'lucide-react';

interface QuizInterfaceProps {
  questions: Question[];
  onFinish: (results: QuizResult[]) => void;
}

const QuizInterface: React.FC<QuizInterfaceProps> = ({ questions, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  
  const currentQuestion = questions[currentIndex];

  const toggleOption = (index: number) => {
    if (isSubmitted) return; // Disable selection after submission
    setSelectedIndices(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index].sort();
      }
    });
  };

  const handleVerify = () => {
    const correctIndices = [...currentQuestion.correctIndices].sort();
    const userSelected = [...selectedIndices].sort();
    const isCorrect = JSON.stringify(correctIndices) === JSON.stringify(userSelected);

    const newResult: QuizResult = {
      questionId: currentQuestion.id,
      selectedIndices: userSelected,
      isCorrect
    };

    setResults(prev => [...prev, newResult]);
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedIndices([]);
      setIsSubmitted(false);
    } else {
      onFinish(results);
    }
  };

  const progress = ((currentIndex + (isSubmitted ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header / Progress */}
      <div className="bg-white rounded-t-xl shadow-sm border-b border-slate-200 p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-legal-600">
            Grila {currentIndex + 1} din {questions.length}
          </span>
          <span className="text-xs text-slate-400 font-mono">
             ID: #{currentQuestion.id}
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-legal-600 h-2 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-b-xl shadow-xl p-6 md:p-10 flex flex-col transition-all">
        <div className="flex-grow">
          <div className="mb-8">
            <h3 className="text-xl md:text-2xl font-serif text-slate-800 leading-relaxed">
              {currentQuestion.text}
            </h3>
          </div>

          <div className="space-y-4">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedIndices.includes(idx);
              const isActuallyCorrect = currentQuestion.correctIndices.includes(idx);
              const letter = String.fromCharCode(65 + idx);

              let statusClasses = "border-slate-200 hover:border-legal-300 hover:bg-slate-50";
              let icon = null;

              if (isSubmitted) {
                if (isSelected && isActuallyCorrect) {
                  statusClasses = "border-green-500 bg-green-50 ring-1 ring-green-500";
                  icon = <CheckCircle2 className="text-green-600 w-5 h-5" />;
                } else if (isSelected && !isActuallyCorrect) {
                  statusClasses = "border-red-500 bg-red-50 ring-1 ring-red-500";
                  icon = <XCircle className="text-red-600 w-5 h-5" />;
                } else if (!isSelected && isActuallyCorrect) {
                  statusClasses = "border-green-300 bg-green-50/50 border-dashed";
                  icon = <Check className="text-green-400 w-5 h-5" />;
                } else {
                  statusClasses = "border-slate-100 opacity-60";
                }
              } else if (isSelected) {
                statusClasses = "border-legal-600 bg-legal-50 shadow-md ring-1 ring-legal-600";
              }

              return (
                <button
                  key={idx}
                  disabled={isSubmitted}
                  onClick={() => toggleOption(idx)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-start gap-4 group
                    ${statusClasses}
                  `}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold border transition-colors
                    ${isSelected && !isSubmitted
                      ? 'bg-legal-600 text-white border-legal-600' 
                      : (isSubmitted && isActuallyCorrect ? 'bg-green-600 text-white border-green-600' : 'bg-white text-slate-500 border-slate-300')
                    }`}>
                    {letter}
                  </div>
                  <span className={`flex-grow text-lg pt-0.5 ${isSelected ? 'text-legal-900 font-medium' : 'text-slate-700'}`}>
                    {option}
                  </span>
                  {icon}
                </button>
              );
            })}
          </div>

          {/* Instant Feedback Area */}
          {isSubmitted && (
            <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-xl animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="text-legal-600 w-5 h-5" />
                <h4 className="font-bold text-legal-900">Soluție Juridică și Explicație:</h4>
              </div>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm md:text-base italic">
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
          <div className="text-sm text-slate-500 italic flex items-center gap-2">
            {!isSubmitted && (
              <>
                <AlertCircle size={16} />
                <span>Selectează variantele (A, B, C).</span>
              </>
            )}
          </div>

          {!isSubmitted ? (
            <button
              onClick={handleVerify}
              disabled={selectedIndices.length === 0 && !confirm("Ești sigur că nu vrei să bifezi nicio variantă?")}
              className="bg-legal-800 hover:bg-legal-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              Verifică Răspunsul
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="bg-legal-900 hover:bg-black text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              {currentIndex === questions.length - 1 ? 'Vezi Rezultatul Final' : 'Următoarea Întrebare'}
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizInterface;