import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { 
  Globe, Menu, X, Sun, Moon, User, LogOut, Settings, 
  Trophy, Bell, Search, ChevronDown 
} from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, settings, updateSettings } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSettings({ theme: newTheme });
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getLevelTitle = (level: number) => {
    if (level <= 5) return '初学者';
    if (level <= 10) return '进阶者';
    if (level <= 20) return '熟练者';
    return '大师';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary-500/30 transition-shadow">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-gradient hidden sm:block">
                LinguaWorld
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-6">
              <Link 
                to="/courses" 
                className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                课程中心
              </Link>
              <Link 
                to="/community" 
                className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                社区
              </Link>
              <Link 
                to="/achievements" 
                className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                成就
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索课程..."
                className="w-48 lg:w-64 pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="切换主题"
            >
              {settings.theme === 'light' ? (
                <Moon className="w-5 h-5 text-slate-600" />
              ) : (
                <Sun className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {isAuthenticated && user ? (
              <>
                <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
                  <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-highlight-500 rounded-full"></span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-8 h-8 rounded-full border-2 border-primary-200 dark:border-primary-700"
                    />
                    <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-scale-in">
                      <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-12 h-12 rounded-full border-2 border-primary-200 dark:border-primary-700"
                          />
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{user.username}</p>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <Trophy className="w-4 h-4 text-highlight-500" />
                              <span>Lv.{user.level} {getLevelTitle(user.level)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all"
                              style={{ width: `${(user.expPoints % 500) / 5}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono text-slate-500">
                            {user.expPoints % 500}/500
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          <User className="w-5 h-5 text-slate-400" />
                          <span className="text-slate-700 dark:text-slate-300">个人中心</span>
                        </Link>
                        <Link
                          to="/achievements"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          <Trophy className="w-5 h-5 text-slate-400" />
                          <span className="text-slate-700 dark:text-slate-300">我的成就</span>
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          <Settings className="w-5 h-5 text-slate-400" />
                          <span className="text-slate-700 dark:text-slate-300">设置</span>
                        </Link>
                      </div>

                      <div className="p-2 border-t border-slate-100 dark:border-slate-700">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                        >
                          <LogOut className="w-5 h-5" />
                          <span>退出登录</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-primary-600 dark:text-primary-400 font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full transition-colors">
                  登录
                </Link>
                <Link to="/register" className="btn-primary px-4 py-2 text-sm">
                  注册
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              ) : (
                <Menu className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-lg animate-slide-up">
          <div className="p-4 space-y-2">
            <Link
              to="/courses"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
            >
              课程中心
            </Link>
            <Link
              to="/community"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
            >
              社区
            </Link>
            <Link
              to="/achievements"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
            >
              成就
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
