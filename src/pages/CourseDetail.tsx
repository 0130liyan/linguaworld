import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { mockCourses } from '../data/mockData';
import { 
  ChevronLeft, BookOpen, Users, Star, Trophy, 
  Play, Book, Headphones, Mic, Target,
  Heart, Share2, Check 
} from 'lucide-react';

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { favorites, toggleFavorite, isAuthenticated } = useStore();
  
  const course = mockCourses.find(c => c.id === id);
  
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-4">
            课程不存在
          </h2>
          <Link to="/courses" className="btn-primary">
            返回课程中心
          </Link>
        </div>
      </div>
    );
  }

  const isFavorite = favorites.includes(course.id);

  const learningModules = [
    { icon: Book, title: '单词记忆', desc: '智能记忆曲线', color: 'bg-primary-500', path: `/learn/words` },
    { icon: Target, title: '语法练习', desc: '情境式语法训练', color: 'bg-accent-500', path: `/learn/grammar` },
    { icon: Mic, title: '口语跟读', desc: 'AI语音评测', color: 'bg-highlight-500', path: `/learn/speaking` },
    { icon: Headphones, title: '听力训练', desc: '真实语境听力', color: 'bg-purple-500', path: `/learn/listening` },
  ];

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return { text: '初级', class: 'badge-accent' };
      case 'intermediate': return { text: '中级', class: 'badge-highlight' };
      case 'advanced': return { text: '高级', class: 'badge-primary' };
      default: return { text: difficulty, class: 'badge-primary' };
    }
  };

  const difficulty = getDifficultyText(course.difficulty);

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="mb-6">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            返回课程中心
          </Link>
        </div>

        <div className="card-gradient overflow-hidden mb-8">
          <div className="relative h-64 lg:h-80">
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="badge bg-white/90 text-slate-900">
                {course.languageFlag} {course.language}
              </span>
              <span className={`badge ${difficulty.class}`}>
                {difficulty.text}
              </span>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => toggleFavorite(course.id)}
                className={`p-3 rounded-full transition-all ${
                  isFavorite
                    ? 'bg-red-500 text-white'
                    : 'bg-white/80 text-slate-600 hover:bg-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button className="p-3 rounded-full bg-white/80 text-slate-600 hover:bg-white transition-all">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="font-display text-3xl lg:text-4xl font-bold text-white mb-3">
                {course.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-5 h-5" />
                  <span>{course.lessonCount} 课时</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-5 h-5" />
                  <span>{course.enrolledCount.toLocaleString()} 人学习</span>
                </div>
                <div className="flex items-center gap-1 text-highlight-400">
                  <Trophy className="w-5 h-5" />
                  <span>{course.totalExp} EXP</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-4">
                课程介绍
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {course.description}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-4">
                学习模块
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {learningModules.map((module) => (
                  <Link
                    key={module.title}
                    to={module.path}
                    className="card p-5 hover:shadow-lg transition-all group"
                  >
                    <div className={`w-12 h-12 rounded-xl ${module.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                      <module.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {module.title}
                    </h3>
                    <p className="text-sm text-slate-500">{module.desc}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-4">
                课程章节
              </h2>
              <div className="space-y-3">
                {Array.from({ length: Math.min(course.lessonCount, 8) }).map((_, index) => (
                  <div
                    key={index}
                    className="card p-4 flex items-center gap-4"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold ${
                      index < 3
                        ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900 dark:text-white">
                        第 {index + 1} 章 {index === 0 ? '入门基础' : index === 1 ? '核心语法' : index === 2 ? '实战应用' : `学习模块 ${index - 2}`}
                      </h4>
                      <p className="text-sm text-slate-500">
                        {index < 3 ? '免费试学' : '完成前置章节后解锁'}
                      </p>
                    </div>
                    {index < 3 ? (
                      <Link
                        to={learningModules[index % 4].path}
                        className="btn-primary px-4 py-2 text-sm"
                      >
                        {isAuthenticated ? '开始学习' : '试学'}
                      </Link>
                    ) : (
                      <div className="flex items-center gap-1 text-slate-400">
                        <Check className="w-5 h-5" />
                        <span className="text-sm">未解锁</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card-gradient p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-sm text-slate-500 mb-2">课程总价</div>
                <div className="font-display text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  ¥{course.difficulty === 'beginner' ? 0 : course.difficulty === 'intermediate' ? 299 : 599}
                </div>
                <p className="text-sm text-slate-500">
                  {course.difficulty === 'beginner' ? '免费课程' : '包含全部学习内容'}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  '完整课程内容',
                  '互动式学习模块',
                  '学习进度追踪',
                  '社区交流权限',
                  '成就徽章系统',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent-500" />
                    <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>

              {course.difficulty === 'beginner' ? (
                <Link to={isAuthenticated ? learningModules[0].path : '/login'} className="btn-primary w-full flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  {isAuthenticated ? '开始学习' : '登录后学习'}
                </Link>
              ) : (
                <button className="btn-primary w-full flex items-center justify-center gap-2">
                  <Star className="w-5 h-5" />
                  立即购买
                </button>
              )}

              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">课程标签</h4>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag) => (
                    <span key={tag} className="badge badge-primary">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
