import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { mockAchievements } from '../data/mockData';
import { 
  Trophy, Lock, Zap, Star, Clock, CheckCircle, 
  Users, BookOpen, Headphones, GraduationCap, 
  Globe, Rocket, Flame 
} from 'lucide-react';
import ProgressRing from '../components/common/ProgressRing';

const iconMap: Record<string, any> = {
  'trophy': Trophy,
  'star': Star,
  'clock': Clock,
  'check-circle': CheckCircle,
  'users': Users,
  'book': BookOpen,
  'headphones': Headphones,
  'graduation-cap': GraduationCap,
  'globe': Globe,
  'rocket': Rocket,
  'flame': Flame,
  'zap': Zap,
};

export default function AchievementsPage() {
  const { achievements, unlockAchievement, updateAchievementProgress, user } = useStore();
  
  const allAchievements = achievements.length > 0 ? achievements : mockAchievements;

  useEffect(() => {
    if (achievements.length === 0) {
      mockAchievements.forEach(ach => {
        updateAchievementProgress(ach.id, ach.progress || 0);
      });
    }
  }, []);

  const unlockedCount = allAchievements.filter(a => a.unlocked).length;
  const totalCount = allAchievements.length;
  const progress = Math.round((unlockedCount / totalCount) * 100);

  const getIcon = (iconName: string) => {
    return iconMap[iconName] || Trophy;
  };

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            我的成就
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            收集徽章，解锁成就，提升等级
          </p>
        </div>

        <div className="card-gradient p-8 mb-8 flex flex-col md:flex-row items-center gap-8">
          <ProgressRing progress={progress} size={120} strokeWidth={10} color="highlight" />
          <div className="text-center md:text-left">
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-2">
              成就收集进度
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              已解锁 <span className="font-bold text-highlight-500">{unlockedCount}</span> / {totalCount} 个成就
            </p>
            {user && (
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-highlight-500" />
                  <span className="text-slate-700 dark:text-slate-300">
                    Lv.{user.level} · {user.expPoints} 经验值
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allAchievements.map((achievement, index) => {
            const Icon = getIcon(achievement.icon);
            
            return (
              <div
                key={achievement.id}
                className={`card p-6 transition-all ${
                  achievement.unlocked 
                    ? 'ring-2 ring-highlight-500 dark:ring-highlight-400' 
                    : 'opacity-70'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-highlight-400 to-highlight-500 shadow-lg shadow-highlight-500/30'
                      : 'bg-slate-100 dark:bg-slate-700'
                  }`}>
                    {achievement.unlocked ? (
                      <Icon className="w-7 h-7 text-white" />
                    ) : (
                      <Lock className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${
                        achievement.unlocked 
                          ? 'text-slate-900 dark:text-white' 
                          : 'text-slate-500'
                      }`}>
                        {achievement.title}
                      </h3>
                      {achievement.unlocked && (
                        <CheckCircle className="w-4 h-4 text-accent-500" />
                      )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                      {achievement.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`badge ${
                        achievement.unlocked ? 'badge-highlight' : 'bg-slate-100 text-slate-500 dark:bg-slate-700'
                      }`}>
                        +{achievement.expReward} EXP
                      </span>
                      {achievement.target && (
                        <span className="text-xs text-slate-400">
                          {achievement.progress || 0}/{achievement.target}
                        </span>
                      )}
                    </div>
                    {achievement.target && !achievement.unlocked && (
                      <div className="mt-2">
                        <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-highlight-400 to-highlight-500 rounded-full transition-all"
                            style={{ 
                              width: `${Math.min(
                                ((achievement.progress || 0) / achievement.target) * 100, 
                                100
                              )}%` 
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 card-gradient p-8">
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-4">
            成就系统说明
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex gap-3">
              <Rocket className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <p>完成课程学习和每日任务可获得经验值，提升用户等级</p>
            </div>
            <div className="flex gap-3">
              <Trophy className="w-5 h-5 text-highlight-500 flex-shrink-0 mt-0.5" />
              <p>达成特定里程碑可解锁独特成就徽章，展示你的学习成就</p>
            </div>
            <div className="flex gap-3">
              <Flame className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p>连续学习可累积连续天数，解锁坚持不懈成就</p>
            </div>
            <div className="flex gap-3">
              <Star className="w-5 h-5 text-highlight-400 flex-shrink-0 mt-0.5" />
              <p>积极参与社区互动，与其他学习者分享学习心得</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
