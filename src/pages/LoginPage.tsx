import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Globe, Lock, Eye, EyeOff, ArrowRight, Smartphone, MessageCircle, Check, Loader } from 'lucide-react';

type LoginMode = 'password' | 'sms';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useStore();
  const [loginMode, setLoginMode] = useState<LoginMode>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [smsSent, setSmsSent] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleSendSMS = async () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setError('请输入正确的手机号码');
      return;
    }
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      setSmsSent(true);
      setCountdown(60);
      setLoading(false);
    }, 1000);
  };

  const handleSMSLogin = () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setError('请输入正确的手机号码');
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      setError('请输入6位验证码');
      return;
    }
    
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      const mockUser = {
        id: `user_phone_${Date.now()}`,
        email: `${phone}@phone.com`,
        username: `用户${phone.slice(-4)}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${phone}`,
        level: 1,
        expPoints: 0,
        learningLanguages: [],
        streak: 0,
        dailyGoal: 50,
        createdAt: new Date().toISOString(),
      };
      
      useStore.getState().setUser(mockUser);
      setLoading(false);
      navigate('/');
    }, 1500);
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('邮箱或密码错误，请重试');
      }
    } catch {
      setError('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleThirdPartyLogin = (type: 'qq' | 'wechat') => {
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      const mockUser = {
        id: `user_${type}_${Date.now()}`,
        email: `${type}@${type}.com`,
        username: type === 'qq' ? 'QQ用户' : '微信用户',
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${type}_${Date.now()}`,
        level: 1,
        expPoints: 0,
        learningLanguages: [],
        streak: 0,
        dailyGoal: 50,
        createdAt: new Date().toISOString(),
      };
      
      useStore.getState().setUser(mockUser);
      setLoading(false);
      navigate('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-500/20">
              <Globe className="w-8 h-8 text-white" />
            </div>
          </Link>
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-2">
            欢迎回来
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            选择登录方式开始学习
          </p>
        </div>

        <div className="card-gradient p-8 shadow-xl">
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
            <button
              onClick={() => { setLoginMode('password'); setError(''); }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                loginMode === 'password'
                  ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Lock className="w-4 h-4 inline mr-2" />
              密码登录
            </button>
            <button
              onClick={() => { setLoginMode('sms'); setError(''); }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                loginMode === 'sms'
                  ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Smartphone className="w-4 h-4 inline mr-2" />
              短信登录
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {loginMode === 'password' ? (
            <form onSubmit={handlePasswordLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  邮箱地址
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  密码
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary-600" />
                  <span className="text-slate-600 dark:text-slate-400">记住我</span>
                </label>
                <a href="#" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
                  忘记密码？
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader className="w-5 h-5 animate-spin" /> : <>登录 <ArrowRight className="w-5 h-5" /></>}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  手机号码
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  placeholder="请输入手机号"
                  className="input-field"
                  maxLength={11}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  验证码
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="请输入验证码"
                    className="input-field flex-1"
                    maxLength={6}
                  />
                  <button
                    onClick={handleSendSMS}
                    disabled={countdown > 0 || loading}
                    className="px-4 py-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium rounded-xl hover:bg-primary-200 dark:hover:bg-primary-900/50 disabled:opacity-50 whitespace-nowrap"
                  >
                    {countdown > 0 ? `${countdown}s` : '获取验证码'}
                  </button>
                </div>
              </div>

              {smsSent && (
                <div className="p-3 bg-accent-50 dark:bg-accent-900/20 rounded-xl text-accent-600 dark:text-accent-400 text-sm flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  验证码已发送，请注意查收
                </div>
              )}

              <button
                onClick={handleSMSLogin}
                disabled={loading || !phone || code.length !== 6}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader className="w-5 h-5 animate-spin" /> : <><Smartphone className="w-5 h-5" /> 验证登录</>}
              </button>
            </div>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-slate-800 text-slate-500">或使用第三方账号登录</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleThirdPartyLogin('qq')}
                disabled={loading}
                className="flex items-center justify-center gap-3 px-4 py-4 border-2 border-blue-400 dark:border-blue-600 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all disabled:opacity-50"
              >
                <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.003 2c-2.265 0-6.29 1.364-6.29 7.325v1.195S3.55 14.96 3.55 17.474c0 .665.09 1.305.263 1.911.48 1.341 1.005-1.341 1.175-1.533a.45.45 0 01.088-.088l.088-.07c.211-.176.441-.352.675-.529a8.463 8.463 0 00-.832 4.019c-.083.494-.167 1.12.353 1.833a.45.45 0 00.263.176c.176.053.441.106.706-.035a.45.45 0 00.176-.263c.35-.776.441-1.244.52-1.644.088-.423.176-.776.53-.776.176 0 .352 0 .617.088.176.088.353.176.441.176s.176 0 .264-.088c.176-.088.176-.264.264-.44.088-.176.176-.529.176-.882 0-.706-.176-1.283-.529-1.8a.45.45 0 00-.176-.263c-.088-.035-.088-.088-.088-.176s.088-.176.264-.264c.441-.264.706-.776.706-1.42 0-.618-.264-1.244-.706-1.776a.45.45 0 00-.264-.176c-.088 0-.088-.088-.088-.176 0-.035 0-.088.088-.176s.176-.088.176-.176h.088c.264 0 .529 0 .793-.088.441-.088.882-.353 1.147-.793.176-.176.264-.441.352-.706.176-.618.088-1.148-.176-1.557-.353-.529-.882-.793-1.47-.882z"/>
                </svg>
                <span className="font-medium text-slate-700 dark:text-slate-300">QQ登录</span>
              </button>
              <button
                onClick={() => handleThirdPartyLogin('wechat')}
                disabled={loading}
                className="flex items-center justify-center gap-3 px-4 py-4 border-2 border-green-500 dark:border-green-600 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all disabled:opacity-50"
              >
                <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.87c-.135-.004-.272-.012-.407-.012zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z"/>
                </svg>
                <span className="font-medium text-slate-700 dark:text-slate-300">微信登录</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center mt-6 text-slate-600 dark:text-slate-400">
          还没有账号？{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
            立即注册
          </Link>
        </p>
      </div>
    </div>
  );
}
