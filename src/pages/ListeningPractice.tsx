import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { mockListening } from '../data/mockData';
import { 
  ChevronLeft, Play, Pause, Check, X, Volume2, 
  Trophy, ArrowRight, RotateCcw, Loader 
} from 'lucide-react';

export default function ListeningPractice() {
  const { addExp } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const listeningItems = mockListening['en-beginner'] || [];
  const currentItem = listeningItems[currentIndex];

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    setTimeout(() => setIsPlaying(false), 3000);
  };

  const handleSelectAnswer = (questionId: string, answerIndex: number) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleSubmit = () => {
    let correct = 0;
    currentItem.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    setScore(correct);
    setShowResults(true);
    addExp(correct * 20);
  };

  const handleNext = () => {
    if (currentIndex < listeningItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswers({});
      setShowResults(false);
      setScore(0);
    } else {
      setCompleted(true);
      addExp(50);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
    setCompleted(false);
  };

  if (!currentItem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">暂无听力内容</p>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen pb-20 lg:pb-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="card-gradient p-8 text-center animate-scale-in">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500/30">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-4">
              听力练习完成！
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              你完成了所有听力练习
            </p>
            <div className="flex justify-center gap-4 mb-8">
              <button onClick={handleRestart} className="btn-secondary flex items-center gap-2">
                <RotateCcw className="w-5 h-5" />
                再练一次
              </button>
              <Link to="/courses" className="btn-primary flex items-center gap-2">
                返回课程
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/courses"
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            返回
          </Link>
          <span className="text-sm text-slate-500">
            {currentIndex + 1} / {listeningItems.length}
          </span>
        </div>

        <div className="mb-6">
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / listeningItems.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="card-gradient p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              {currentItem.title}
            </h2>
            <button
              onClick={handlePlay}
              className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-500">听力原文</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
              {currentItem.transcript}
            </p>
          </div>

          <details className="mb-6">
            <summary className="cursor-pointer text-sm text-primary-600 dark:text-primary-400 hover:underline">
              查看中文翻译
            </summary>
            <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line">
                {currentItem.translation}
              </p>
            </div>
          </details>
        </div>

        <div className="space-y-4 mb-8">
          {currentItem.questions.map((question, qIndex) => (
            <div key={question.id} className="card p-5">
              <p className="font-medium text-slate-900 dark:text-white mb-4">
                <span className="text-primary-500 mr-2">Q{qIndex + 1}.</span>
                {question.question}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {question.options.map((option, oIndex) => (
                  <button
                    key={oIndex}
                    onClick={() => handleSelectAnswer(question.id, oIndex)}
                    disabled={showResults}
                    className={`p-3 rounded-xl text-left transition-all ${
                      showResults
                        ? oIndex === question.correctAnswer
                          ? 'bg-accent-100 dark:bg-accent-900/30 border-2 border-accent-500'
                          : oIndex === selectedAnswers[question.id]
                          ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500'
                          : 'bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700'
                        : selectedAnswers[question.id] === oIndex
                        ? 'bg-primary-100 dark:bg-primary-900/30 border-2 border-primary-500'
                        : 'bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                        showResults
                          ? oIndex === question.correctAnswer
                            ? 'bg-accent-500 text-white'
                            : oIndex === selectedAnswers[question.id]
                            ? 'bg-red-500 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                          : selectedAnswers[question.id] === oIndex
                          ? 'bg-primary-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + oIndex)}
                      </div>
                      <span className={`
                        ${showResults && oIndex === question.correctAnswer ? 'text-accent-700 dark:text-accent-300 font-medium' : ''}
                        ${showResults && oIndex === selectedAnswers[question.id] && oIndex !== question.correctAnswer ? 'text-red-700 dark:text-red-300' : ''}
                      `}>
                        {option}
                      </span>
                      {showResults && oIndex === question.correctAnswer && (
                        <Check className="w-5 h-5 text-accent-500 ml-auto" />
                      )}
                      {showResults && oIndex === selectedAnswers[question.id] && oIndex !== question.correctAnswer && (
                        <X className="w-5 h-5 text-red-500 ml-auto" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          {!showResults ? (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(selectedAnswers).length !== currentItem.questions.length}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              提交答案
            </button>
          ) : (
            <div className="text-center">
              <div className="mb-4">
                <div className="font-mono text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {score}/{currentItem.questions.length}
                </div>
                <p className="text-slate-500">正确答题数</p>
              </div>
              <button onClick={handleNext} className="btn-primary flex items-center gap-2 mx-auto">
                {currentIndex < listeningItems.length - 1 ? '下一题' : '完成练习'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
