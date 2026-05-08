import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { mockGrammar } from '../data/mockData';
import { 
  ChevronLeft, Check, X, Trophy, Target, 
  BookOpen, ArrowRight, RotateCcw 
} from 'lucide-react';

export default function GrammarPractice() {
  const { addExp } = useStore();
  const grammar = mockGrammar['en-beginner']?.[0] || mockGrammar['jp-beginner']?.[0] || mockGrammar['kr-beginner']?.[0];
  
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  if (!grammar) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">暂无语法内容</p>
      </div>
    );
  }

  const exercise = grammar.exercises[currentExercise];
  const totalExercises = grammar.exercises.length;

  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
    
    if (selectedAnswer === exercise.correctAnswer) {
      setScore(prev => prev + 1);
      addExp(15);
    }
  };

  const handleNext = () => {
    if (currentExercise < totalExercises - 1) {
      setCurrentExercise(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCompleted(true);
      addExp(50);
    }
  };

  const handleRestart = () => {
    setCurrentExercise(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <div className="min-h-screen pb-20 lg:pb-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="card-gradient p-8 text-center animate-scale-in">
            <div className="w-24 h-24 bg-gradient-to-br from-highlight-400 to-highlight-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-highlight-500/30">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-4">
              练习完成！
            </h2>
            <div className="mb-6">
              <div className="font-mono text-6xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                {score}/{totalExercises}
              </div>
              <p className="text-slate-500">正确答题数</p>
            </div>
            <div className="mb-8 p-4 bg-accent-50 dark:bg-accent-900/20 rounded-xl">
              <p className="text-accent-600 dark:text-accent-400 font-semibold">
                +{score * 15 + 50} 经验值
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={handleRestart} className="btn-secondary flex items-center justify-center gap-2">
                <RotateCcw className="w-5 h-5" />
                再来一次
              </button>
              <Link to="/courses" className="btn-primary flex items-center justify-center gap-2">
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
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-slate-400" />
            <span className="font-mono text-slate-600 dark:text-slate-400">
              {currentExercise + 1}/{totalExercises}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
              style={{ width: `${((currentExercise + 1) / totalExercises) * 100}%` }}
            />
          </div>
        </div>

        <div className="card-gradient p-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary-500" />
            <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
              {grammar.title}
            </span>
          </div>
          <h2 className="font-display text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-8">
            {exercise.question}
          </h2>

          <div className="space-y-3">
            {exercise.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={showResult}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  showResult
                    ? index === exercise.correctAnswer
                      ? 'bg-accent-100 dark:bg-accent-900/30 border-2 border-accent-500 text-accent-700 dark:text-accent-300'
                      : index === selectedAnswer
                      ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500 text-red-700 dark:text-red-300'
                      : 'bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700'
                    : selectedAnswer === index
                    ? 'bg-primary-100 dark:bg-primary-900/30 border-2 border-primary-500 text-primary-700 dark:text-primary-300'
                    : 'bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                    showResult
                      ? index === exercise.correctAnswer
                        ? 'bg-accent-500 text-white'
                        : index === selectedAnswer
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      : selectedAnswer === index
                      ? 'bg-primary-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-1">{option}</span>
                  {showResult && index === exercise.correctAnswer && (
                    <Check className="w-5 h-5 text-accent-500" />
                  )}
                  {showResult && index === selectedAnswer && index !== exercise.correctAnswer && (
                    <X className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4">
          {!showResult ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              确认答案
            </button>
          ) : (
            <button onClick={handleNext} className="btn-primary flex items-center gap-2">
              {currentExercise < totalExercises - 1 ? '下一题' : '完成练习'}
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {showResult && (
          <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              语法解析
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {grammar.explanation}
            </p>
            <div className="mt-3 space-y-2">
              {grammar.examples.map((example, index) => (
                <p key={index} className="text-sm text-slate-500 dark:text-slate-400">
                  <span className="italic">{example.sentence}</span> - {example.meaning}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
