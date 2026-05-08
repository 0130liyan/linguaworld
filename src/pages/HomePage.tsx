import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { mockCourses } from '../data/mockData';
import { 
  Flame, Trophy, BookOpen, Clock, Target, Zap, 
  ChevronRight, Play, Star, Users 
} from 'lucide-react';
import ProgressRing from '../components/common/ProgressRing';

export default function HomePage() {
  const { user, isAuthenticated, achievements } = useStore();

  const stats = [
    { icon: Flame, label: '连续学习', value: user?.streak || 0, unit: '天', color: 'highlight' },
    { icon: Trophy, label: '获得成就', value: achievements.filter(a => a.unlocked).length, unit: '个', color: 'primary' },
    { icon: BookOpen, label: '学习课时', value: Object.keys(user ? {} : {}).length || 0, unit: '节', color: 'accent' },
    { icon: Clock, label: '学习时长', value: 0, unit: '小时', color: 'primary' },
  ];

  const recommendedCourses = mockCourses.slice(0, 3);
  const dailyGoals = [
    { title: '完成课程', value: 2, completed: 0, color: 'bg-gradient-to-r from-primary-500 to-primary-600' },
    { title: '学习单词', value: 20, completed: 0, color: 'bg-gradient-to-r from-accent-500 to-accent-600' },
    { title: '练习口语', value: 5, completed: 0, color: 'bg-gradient-to-r from-highlight-500 to-highlight-600' },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'badge-accent';
      case 'intermediate': return 'badge-highlight';
      case 'advanced': return 'badge-primary';
      default: return 'badge-primary';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '初级';
      case 'intermediate': return '中级';
      case 'advanced': return '高级';
      default: return difficulty;
    }
  };

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        {!isAuthenticated ? (
          <div className="text-center py-12 lg:py-20 animate-fade-in">
            <h1 className="font-display text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              <span className="text-gradient">多语种学习</span>
              <br />
              从这里开始
            </h1>
            <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
              沉浸式语言学习体验，支持英语、日语、韩语等多种语言。
              通过互动式学习模块，让语言学习变得有趣高效。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary inline-flex items-center gap-2">
                <Zap className="w-5 h-5" />
                免费开始学习
              </Link>
              <Link to="/courses" className="btn-secondary inline-flex items-center gap-2">
                浏览课程
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="stat-card animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <stat.icon className={`w-8 h-8 mb-3 ${
                    stat.color === 'primary' ? 'text-primary-500' :
                    stat.color === 'accent' ? 'text-accent-500' :
                    'text-highlight-500'
                  }`} />
                  <div className="font-mono text-3xl font-bold text-slate-900 dark:text-white">
                    {stat.value}{stat.unit}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="font-display text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                  欢迎回来，{user?.username}！👋
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  继续你的语言学习之旅
                </p>
              </div>
              <div className="flex items-center gap-4">
                <ProgressRing progress={35} size={64} strokeWidth={6} color="primary" />
                <div>
                  <div className="text-sm text-slate-500">今日进度</div>
                  <div className="font-semibold text-slate-900 dark:text-white">35%</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="stat-card hover:shadow-lg transition-shadow"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                    stat.color === 'primary' ? 'bg-primary-100 dark:bg-primary-900/30' :
                    stat.color === 'accent' ? 'bg-accent-100 dark:bg-accent-900/30' :
                    'bg-highlight-100 dark:bg-highlight-900/30'
                  }`}>
                    <stat.icon className={`w-5 h-5 ${
                      stat.color === 'primary' ? 'text-primary-600 dark:text-primary-400' :
                      stat.color === 'accent' ? 'text-accent-600 dark:text-accent-400' :
                      'text-highlight-600 dark:text-highlight-400'
                    }`} />
                  </div>
                  <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                    <span className="text-sm font-normal text-slate-500 ml-1">{stat.unit}</span>
                  </div>
                  <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-4">
                每日目标
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dailyGoals.map((goal, index) => (
                  <div key={goal.title} className="card p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-slate-900 dark:text-white">{goal.title}</span>
                      <Target className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">{goal.completed}/{goal.value}</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {Math.round((goal.completed / goal.value) * 100)}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${goal.color} rounded-full transition-all duration-500`}
                          style={{ width: `${(goal.completed / goal.value) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">
              推荐课程
            </h2>
            <Link
              to="/courses"
              className="flex items-center gap-1 text-primary-600 dark:text-primary-400 font-medium hover:gap-2 transition-all"
            >
              查看全部
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCourses.map((course, index) => (
              <Link
                key={course.id}
                to={`/course/${course.id}`}
                className="card group overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="badge bg-white/90 text-slate-900">
                      {course.languageFlag} {course.language}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`badge ${getDifficultyColor(course.difficulty)}`}>
                      {getDifficultyText(course.difficulty)}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-display text-lg font-bold text-white mb-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-white/80 line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {course.lessonCount}课
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {course.enrolledCount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-highlight-500">
                      <Star className="w-4 h-4" />
                      <span className="font-medium">{course.totalExp}</span>
                      <span className="text-xs">EXP</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card p-6">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-4">
              快速开始学习
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/learn/words"
                className="flex flex-col items-center gap-3 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <span className="font-medium text-slate-900 dark:text-white">单词记忆</span>
              </Link>
              <Link
                to="/learn/grammar"
                className="flex flex-col items-center gap-3 p-4 rounded-xl bg-accent-50 dark:bg-accent-900/20 hover:bg-accent-100 dark:hover:bg-accent-900/30 transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-lg">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <span className="font-medium text-slate-900 dark:text-white">语法练习</span>
              </Link>
              <Link
                to="/learn/speaking"
                className="flex flex-col items-center gap-3 p-4 rounded-xl bg-highlight-50 dark:bg-highlight-900/20 hover:bg-highlight-100 dark:hover:bg-highlight-900/30 transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-highlight-500 to-highlight-600 flex items-center justify-center shadow-lg">
                  <Play className="w-7 h-7 text-white" />
                </div>
                <span className="font-medium text-slate-900 dark:text-white">口语跟读</span>
              </Link>
              <Link
                to="/learn/listening"
                className="flex flex-col items-center gap-3 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <span className="font-medium text-slate-900 dark:text-white">听力训练</span>
              </Link>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-4">
              学习语言分布
            </h3>
            <div className="space-y-4">
              {[
                { language: '英语', flag: '🇬🇧', progress: 45, color: 'bg-primary-500' },
                { language: '日语', flag: '🇯🇵', progress: 30, color: 'bg-accent-500' },
                { language: '韩语', flag: '🇰🇷', progress: 25, color: 'bg-highlight-500' },
              ].map((item) => (
                <div key={item.language} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{item.flag}</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{item.language}</span>
                    </span>
                    <span className="text-slate-500">{item.progress}%</span>
                  </div>
                  <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
