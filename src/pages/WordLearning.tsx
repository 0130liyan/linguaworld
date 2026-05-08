import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { mockWords } from '../data/mockData';
import { 
  Volume2, VolumeX, RotateCcw, Check, X, ChevronLeft, 
  ChevronRight, Star, Zap, Trophy, BookOpen 
} from 'lucide-react';

export default function WordLearning() {
  const { type } = useParams<{ type: string }>();
  const { updateProgress, addExp, isAuthenticated } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0, streak: 0 });
  const [showResult, setShowResult] = useState<'correct' | 'incorrect' | null>(null);

  const words = mockWords['en-beginner'] || mockWords['jp-beginner'] || mockWords['kr-beginner'];
  const currentWord = words[currentIndex];

  const speak = (text: string, lang: string = 'en-US') => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (correct: boolean) => {
    setShowResult(correct ? 'correct' : 'incorrect');
    
    if (correct) {
      setSessionStats(prev => ({
        ...prev,
        correct: prev.correct + 1,
        streak: prev.streak + 1,
      }));
      addExp(10 + sessionStats.streak * 2);
    } else {
      setSessionStats(prev => ({
        ...prev,
        incorrect: prev.incorrect + 1,
        streak: 0,
      }));
    }

    setTimeout(() => {
      setShowResult(null);
      nextCard();
    }, 1000);
  };

  const nextCard = () => {
    setIsFlipped(false);
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const prevCard = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const resetSession = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionStats({ correct: 0, incorrect: 0, streak: 0 });
  };

  const progress = ((currentIndex + 1) / words.length) * 100;

  useEffect(() => {
    if (currentWord) {
      const langMap: Record<string, string> = {
        'en-beginner': 'en-US',
        'jp-beginner': 'ja-JP',
        'kr-beginner': 'ko-KR',
      };
      const lang = langMap[type || 'en-beginner'] || 'en-US';
      speak(currentWord.word, lang);
    }
  }, [currentIndex, type]);

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/courses"
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            返回
          </Link>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              进度 {currentIndex + 1} / {words.length}
            </span>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-highlight-500" />
              <span className="font-mono text-highlight-600 dark:text-highlight-400">
                {sessionStats.streak} 连击
              </span>
            </div>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="stat-card text-center">
            <BookOpen className="w-6 h-6 text-primary-500 mx-auto mb-2" />
            <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white">
              {sessionStats.correct}
            </div>
            <div className="text-xs text-slate-500">答对</div>
          </div>
          <div className="stat-card text-center">
            <X className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white">
              {sessionStats.incorrect}
            </div>
            <div className="text-xs text-slate-500">答错</div>
          </div>
          <div className="stat-card text-center">
            <Trophy className="w-6 h-6 text-highlight-500 mx-auto mb-2" />
            <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white">
              {Math.round((sessionStats.correct / (sessionStats.correct + sessionStats.incorrect || 1)) * 100)}%
            </div>
            <div className="text-xs text-slate-500">正确率</div>
          </div>
        </div>

        <div className="relative h-80 mb-8 perspective-1000">
          <div
            onClick={handleFlip}
            className={`relative w-full h-full cursor-pointer transform-style-preserve-3d transition-transform duration-500 ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          >
            <div
              className="absolute inset-0 card-gradient p-8 flex flex-col items-center justify-center backface-hidden rounded-3xl shadow-2xl"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="absolute top-4 left-4 badge badge-primary">
                {currentIndex + 1}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const langMap: Record<string, string> = {
                    'en-beginner': 'en-US',
                    'jp-beginner': 'ja-JP',
                    'kr-beginner': 'ko-KR',
                  };
                  speak(currentWord.word, langMap[type || 'en-beginner'] || 'en-US');
                }}
                className="absolute top-4 right-4 p-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
              >
                <Volume2 className="w-5 h-5" />
              </button>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 text-center">
                {currentWord.word}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg mb-4">
                {currentWord.pronunciation}
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-sm animate-bounce-gentle">
                点击卡片查看释义
              </p>
            </div>

            <div
              className="absolute inset-0 bg-gradient-to-br from-accent-500 to-accent-600 p-8 flex flex-col items-center justify-center rounded-3xl shadow-2xl"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <h3 className="font-display text-3xl font-bold text-white mb-4">
                {currentWord.meaning}
              </h3>
              <div className="bg-white/20 rounded-xl p-4 w-full mb-4">
                <p className="text-white/90 mb-1">
                  <span className="font-semibold">例句：</span>
                </p>
                <p className="text-white text-lg italic">{currentWord.example}</p>
                <p className="text-white/80 text-sm mt-2">{currentWord.exampleMeaning}</p>
              </div>
              <p className="text-white/70 text-sm animate-bounce-gentle">
                点击卡片返回
              </p>
            </div>
          </div>

          {showResult && (
            <div className={`absolute inset-0 flex items-center justify-center rounded-3xl ${
              showResult === 'correct' ? 'bg-accent-500/20' : 'bg-red-500/20'
            } animate-scale-in`}>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                showResult === 'correct' ? 'bg-accent-500' : 'bg-red-500'
              } shadow-2xl`}>
                {showResult === 'correct' ? (
                  <Check className="w-10 h-10 text-white" />
                ) : (
                  <X className="w-10 h-10 text-white" />
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={prevCard}
            disabled={currentIndex === 0}
            className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleAnswer.bind(null, true)}
            className="flex-1 max-w-xs btn-accent flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            认识
          </button>

          <button
            onClick={handleAnswer.bind(null, false)}
            className="flex-1 max-w-xs px-6 py-3 bg-white dark:bg-slate-800 text-red-600 font-semibold rounded-full border-2 border-red-300 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <X className="w-5 h-5 inline mr-2" />
            不认识
          </button>

          <button
            onClick={nextCard}
            disabled={currentIndex === words.length - 1}
            className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="flex justify-center">
          <button
            onClick={resetSession}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            重新开始
          </button>
        </div>
      </div>
    </div>
  );
}
