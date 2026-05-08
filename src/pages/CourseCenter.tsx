import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockCourses } from '../data/mockData';
import { useStore } from '../store/useStore';
import { 
  Search, Filter, Grid, List, Star, Users, BookOpen, 
  ChevronDown, Heart, TrendingUp 
} from 'lucide-react';

export default function CourseCenter() {
  const { favorites, toggleFavorite } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('全部');
  const [selectedDifficulty, setSelectedDifficulty] = useState('全部');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const languages = ['全部', '英语', '日语', '韩语'];
  const difficulties = ['全部', 'beginner', 'intermediate', 'advanced'];

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = selectedLanguage === '全部' || course.language === selectedLanguage;
    const matchesDifficulty = selectedDifficulty === '全部' || course.difficulty === selectedDifficulty;
    return matchesSearch && matchesLanguage && matchesDifficulty;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.enrolledCount - a.enrolledCount;
      case 'rating':
        return b.totalExp - a.totalExp;
      case 'newest':
        return 0;
      default:
        return 0;
    }
  });

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
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            探索课程
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            发现最适合你的语言学习课程
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索课程名称或描述..."
              className="input-field pl-12"
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="input-field w-auto min-w-[120px]"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="input-field w-auto min-w-[120px]"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff === '全部' ? '全部级别' : getDifficultyText(diff)}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field w-auto min-w-[120px]"
            >
              <option value="popular">最受欢迎</option>
              <option value="rating">最高评分</option>
              <option value="newest">最新课程</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-slate-500">
            共找到 <span className="font-semibold text-slate-900 dark:text-white">{sortedCourses.length}</span> 个课程
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' 
                  : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' 
                  : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {sortedCourses.length === 0 ? (
          <div className="text-center py-16">
            <Filter className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-white mb-2">
              没有找到匹配的课程
            </h3>
            <p className="text-slate-500">尝试调整筛选条件或搜索关键词</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {sortedCourses.map((course, index) => (
              <Link
                key={course.id}
                to={`/course/${course.id}`}
                className={`card group overflow-hidden animate-slide-up ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={viewMode === 'grid' ? '' : 'w-64 h-48 flex-shrink-0 relative overflow-hidden'}>
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                      viewMode === 'list' ? 'h-48' : 'h-48'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(course.id);
                    }}
                    className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      favorites.includes(course.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/80 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${favorites.includes(course.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
                <div className={`p-5 ${viewMode === 'list' ? 'flex-1 flex items-center' : ''}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{course.languageFlag}</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{course.language}</span>
                    <span className={`badge ${getDifficultyColor(course.difficulty)} ml-auto`}>
                      {getDifficultyText(course.difficulty)}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-slate-500">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {course.lessonCount}课
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {course.enrolledCount >= 1000 
                          ? `${(course.enrolledCount / 1000).toFixed(1)}k` 
                          : course.enrolledCount}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-highlight-500">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-semibold">{course.totalExp}</span>
                      <span className="text-xs">EXP</span>
                    </div>
                  </div>
                  {viewMode === 'list' && (
                    <div className="hidden lg:flex items-center gap-2 ml-8">
                      {course.tags.map((tag) => (
                        <span key={tag} className="badge badge-primary text-xs">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {viewMode === 'grid' && sortedCourses.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: '学习趋势', content: '追踪你的学习进度，查看每周学习报告', icon: TrendingUp },
              { title: '个性化推荐', content: '基于你的学习历史，智能推荐适合的课程', icon: Star },
              { title: '社区支持', content: '加入学习小组，与志同道合的伙伴一起进步', icon: Users },
            ].map((item) => (
              <div key={item.title} className="card-gradient p-6 text-center">
                <item.icon className="w-10 h-10 text-primary-500 mx-auto mb-4" />
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
