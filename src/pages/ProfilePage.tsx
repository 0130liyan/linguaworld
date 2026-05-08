import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { mockCourses, mockAchievements } from '../data/mockData';
import { 
  Settings, LogOut, ChevronRight, BookOpen, 
  Trophy, Flame, Clock, Target, Bell, 
  Globe, Moon, Sun, Volume2, Shield 
} from 'lucide-react';
import ProgressRing from '../components/common/ProgressRing';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, settings, updateSettings, favorites } = useStore();

  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const enrolledCourses = mockCourses.slice(0, 2);
  const recentAchievements = mockAchievements.filter(a => a.unlocked).slice(0, 3);

  const stats = [
    { icon: Flame, label: '连续学习', value: user.streak, unit: '天', color: 'highlight' },
    { icon: Trophy, label: '获得成就', value: 0, unit: '个', color: 'primary' },
    { icon: BookOpen, label: '学习课时', value: 0, unit: '节', color: 'accent' },
    { icon: Clock, label: '学习时长', value: 0, unit: '小时', color: 'primary' },
  ];

  const getLevelTitle = (level: number) => {
    if (level <= 5) return '初学者';
    if (level <= 10) return '进阶者';
    if (level <= 20) return '熟练者';
    return '大师';
  };

  const expForNextLevel = user.level * 500;
  const expProgress = Math.round((user.expPoints % 500) / 5);

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="card-gradient p-6 lg:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-24 h-24 rounded-full border-4 border-primary-200 dark:border-primary-700 shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-highlight-400 to-highlight-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-800">
                <span className="font-display font-bold text-white text-sm">
                  {user.level}
                </span>
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="font-display text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {user.username}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mb-3">
                {getLevelTitle(user.level)} · Lv.{user.level}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden max-w-xs">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all"
                    style={{ width: `${expProgress}%` }}
                  />
                </div>
                <span className="font-mono text-sm text-slate-500">
                  {user.expPoints % 500}/500
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                距离下一级还需 {expForNextLevel - user.expPoints} 经验值
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/achievements" className="btn-secondary px-4 py-2 text-sm">
                <Trophy className="w-4 h-4 mr-2" />
                成就
              </Link>
              <Link to="/settings" className="btn-primary px-4 py-2 text-sm">
                <Settings className="w-4 h-4 mr-2" />
                设置
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card text-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${
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
                <span className="text-sm font-normal text-slate-500">{stat.unit}</span>
              </div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                我的课程
              </h2>
              <Link 
                to="/courses" 
                className="text-sm text-primary-600 dark:text-primary-400 flex items-center gap-1 hover:gap-2 transition-all"
              >
                查看全部
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {enrolledCourses.map((course) => (
                <Link key={course.id} to={`/course/${course.id}`} className="card p-4 flex gap-4">
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{course.languageFlag}</span>
                      <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                        {course.title}
                      </h3>
                    </div>
                    <ProgressRing progress={0} size={48} strokeWidth={4} color="primary" />
                  </div>
                </Link>
              ))}
              {favorites.length > 0 && favorites.map((courseId) => {
                const course = mockCourses.find(c => c.id === courseId);
                if (!course) return null;
                return (
                  <Link key={course.id} to={`/course/${course.id}`} className="card p-4 flex gap-4">
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{course.languageFlag}</span>
                        <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                          {course.title}
                        </h3>
                      </div>
                      <p className="text-sm text-slate-500">已收藏</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                学习语言
              </h2>
            </div>
            <div className="card p-6">
              <div className="space-y-4">
                {[
                  { flag: '🇬🇧', name: '英语', progress: 45, level: '中级' },
                  { flag: '🇯🇵', name: '日语', progress: 30, level: '初级' },
                  { flag: '🇰🇷', name: '韩语', progress: 25, level: '初级' },
                ].map((lang) => (
                  <div key={lang.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="text-2xl">{lang.flag}</span>
                        <span className="font-medium text-slate-900 dark:text-white">{lang.name}</span>
                      </span>
                      <span className="badge badge-primary">{lang.level}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                          style={{ width: `${lang.progress}%` }}
                        />
                      </div>
                      <span className="font-mono text-sm text-slate-500 w-12 text-right">
                        {lang.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-4">
            快捷设置
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">每日目标</p>
                  <p className="text-sm text-slate-500">设置每日学习目标</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-primary-600 dark:text-primary-400">
                  {settings.dailyGoal} 分钟
                </span>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-highlight-100 dark:bg-highlight-900/30 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-highlight-600 dark:text-highlight-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">学习提醒</p>
                  <p className="text-sm text-slate-500">开启每日学习提醒</p>
                </div>
              </div>
              <button
                onClick={() => updateSettings({ notifications: !settings.notifications })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.notifications ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  settings.notifications ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-accent-600 dark:text-accent-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">界面语言</p>
                  <p className="text-sm text-slate-500">选择界面显示语言</p>
                </div>
              </div>
              <span className="font-mono text-slate-500">中文</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">音效</p>
                  <p className="text-sm text-slate-500">开启学习音效反馈</p>
                </div>
              </div>
              <button
                onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.soundEnabled ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            <div 
              onClick={handleLogout}
              className="flex items-center gap-3 p-4 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">退出登录</p>
                <p className="text-sm text-red-400">退出当前账号</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
