import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { mockSpeaking } from '../data/mockData';
import { 
  ChevronLeft, Mic, MicOff, Volume2, Check, Star, 
  Trophy, ArrowRight, RotateCcw, Play, Loader 
} from 'lucide-react';

export default function SpeakingPractice() {
  const { addExp } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const phrases = mockSpeaking['en-beginner'] || mockSpeaking['jp-beginner'] || mockSpeaking['kr-beginner'];
  const currentPhrase = phrases[currentIndex];

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.7;
    window.speechSynthesis.speak(utterance);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('无法访问麦克风:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
    setHasRecorded(true);
    
    const simulatedScore = Math.floor(Math.random() * 30) + 70;
    setScore(simulatedScore);
    addExp(Math.floor(simulatedScore / 10));
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < phrases.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setHasRecorded(false);
      setScore(0);
      setShowResult(false);
      setRecordingTime(0);
    } else {
      setCompleted(true);
      addExp(50);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setHasRecorded(false);
    setScore(0);
    setShowResult(false);
    setCompleted(false);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (s: number) => {
    if (s >= 90) return 'text-accent-500';
    if (s >= 70) return 'text-highlight-500';
    return 'text-red-500';
  };

  const getScoreFeedback = (s: number) => {
    if (s >= 90) return '太棒了！发音非常标准！';
    if (s >= 70) return '很好！继续加油！';
    return '不错！多练习会更棒！';
  };

  if (completed) {
    return (
      <div className="min-h-screen pb-20 lg:pb-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="card-gradient p-8 text-center animate-scale-in">
            <div className="w-24 h-24 bg-gradient-to-br from-accent-400 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-accent-500/30">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-4">
              口语练习完成！
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              你完成了所有跟读练习
            </p>
            <div className="flex justify-center gap-4 mb-8">
              <Link to="/courses" className="btn-secondary flex items-center gap-2">
                <RotateCcw className="w-5 h-5" />
                再练一次
              </Link>
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
            {currentIndex + 1} / {phrases.length}
          </span>
        </div>

        <div className="mb-6">
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-highlight-500 to-highlight-600 rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / phrases.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="card-gradient p-8 mb-8">
          <div className="text-center mb-8">
            <p className="text-slate-500 dark:text-slate-400 mb-4">听一听，然后跟读</p>
            
            <button
              onClick={() => speak(currentPhrase.phrase)}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <Play className="w-8 h-8 text-white ml-1" />
            </button>

            <h2 className="font-display text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {currentPhrase.phrase}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-2">
              {currentPhrase.pronunciation}
            </p>
            <p className="text-lg text-primary-600 dark:text-primary-400">
              {currentPhrase.translation}
            </p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 mb-6">
            <p className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
              <Star className="w-4 h-4 text-highlight-500 mt-0.5 flex-shrink-0" />
              <span><strong>技巧提示：</strong>{currentPhrase.tips}</span>
            </p>
          </div>

          {showResult ? (
            <div className="text-center animate-scale-in">
              <div className="mb-6">
                <div className={`font-mono text-6xl font-bold ${getScoreColor(score)} mb-2`}>
                  {score}
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  {getScoreFeedback(score)}
                </p>
              </div>
              <div className="flex justify-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-8 h-8 ${
                      score >= star * 20
                        ? 'text-highlight-500 fill-highlight-500'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                ))}
              </div>
              <button onClick={handleNext} className="btn-primary flex items-center gap-2 mx-auto">
                {currentIndex < phrases.length - 1 ? '下一句' : '完成练习'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 transition-all ${
                  isRecording
                    ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/30'
                    : 'bg-gradient-to-br from-highlight-500 to-highlight-600 shadow-lg shadow-highlight-500/30 hover:scale-105'
                }`}
              >
                {isRecording ? (
                  <MicOff className="w-10 h-10 text-white" />
                ) : (
                  <Mic className="w-10 h-10 text-white" />
                )}
              </button>
              
              {isRecording && (
                <div className="mb-4">
                  <div className="font-mono text-2xl text-red-500 mb-2">
                    {formatTime(recordingTime)}
                  </div>
                  <p className="text-sm text-slate-500">录音中... 点击停止</p>
                </div>
              )}

              {!isRecording && !hasRecorded && (
                <p className="text-slate-500 dark:text-slate-400">
                  点击麦克风开始跟读
                </p>
              )}

              {hasRecorded && !showResult && (
                <div className="flex items-center justify-center gap-2 text-accent-500">
                  <Check className="w-5 h-5" />
                  <span>录音完成，评分中...</span>
                  <Loader className="w-5 h-5 animate-spin" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
