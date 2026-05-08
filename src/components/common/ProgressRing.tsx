import { useEffect, useState } from 'react';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showValue?: boolean;
  color?: 'primary' | 'accent' | 'highlight';
}

export default function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  className = '',
  showValue = true,
  color = 'primary',
}: ProgressRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedProgress / 100) * circumference;

  const colorClasses = {
    primary: 'stroke-primary-500',
    accent: 'stroke-accent-500',
    highlight: 'stroke-highlight-500',
  };

  const gradientId = `progress-gradient-${color}`;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(Math.min(progress, 100));
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            {color === 'primary' && (
              <>
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#818cf8" />
              </>
            )}
            {color === 'accent' && (
              <>
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#34d399" />
              </>
            )}
            {color === 'highlight' && (
              <>
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#fbbf24" />
              </>
            )}
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-slate-200 dark:stroke-slate-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${colorClasses[color]} transition-all duration-1000 ease-out`}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            {Math.round(animatedProgress)}%
          </span>
        </div>
      )}
    </div>
  );
}
