import { useState } from 'react';
import { useStore } from '../store/useStore';
import { mockCommunityPosts } from '../data/mockData';
import { 
  Heart, MessageCircle, Share2, Send, Globe, 
  Filter, TrendingUp, Clock 
} from 'lucide-react';

export default function CommunityPage() {
  const { communityPosts, setCommunityPosts, toggleLike, addPost, isAuthenticated, user } = useStore();
  const [newPost, setNewPost] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('全部');
  const [sortBy, setSortBy] = useState<'trending' | 'recent'>('trending');

  const posts = communityPosts.length > 0 ? communityPosts : mockCommunityPosts;

  const filteredPosts = posts.filter((post) => {
    if (selectedLanguage === '全部') return true;
    return post.language === selectedLanguage;
  }).sort((a, b) => {
    if (sortBy === 'trending') return b.likes - a.likes;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handlePost = () => {
    if (!newPost.trim() || !user) return;
    const post = {
      id: `p${Date.now()}`,
      userId: user.id,
      userAvatar: user.avatar,
      userName: user.username,
      content: newPost,
      likes: 0,
      comments: 0,
      liked: false,
      createdAt: new Date().toISOString(),
      language: user.learningLanguages[0] || '英语',
    };
    addPost(post);
    setNewPost('');
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return '刚刚';
    if (hours < 24) return `${hours}小时前`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            学习社区
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            与全球学习者交流心得，分享进步
          </p>
        </div>

        {isAuthenticated && (
          <div className="card-gradient p-6 mb-8 animate-slide-up">
            <div className="flex gap-4">
              <img
                src={user?.avatar}
                alt={user?.username}
                className="w-12 h-12 rounded-full border-2 border-primary-200 dark:border-primary-700"
              />
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="分享你的学习心得..."
                  className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-xl resize-none outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  rows={3}
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <select className="bg-transparent text-sm text-slate-500 outline-none">
                      <option>英语</option>
                      <option>日语</option>
                      <option>韩语</option>
                    </select>
                  </div>
                  <button
                    onClick={handlePost}
                    disabled={!newPost.trim()}
                    className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            {['全部', '英语', '日语', '韩语'].map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedLanguage === lang
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
          <div className="flex gap-2 sm:ml-auto">
            <button
              onClick={() => setSortBy('trending')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                sortBy === 'trending'
                  ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              热门
            </button>
            <button
              onClick={() => setSortBy('recent')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                sortBy === 'recent'
                  ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Clock className="w-4 h-4" />
              最新
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredPosts.map((post, index) => (
            <div
              key={post.id}
              className="card p-6 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex gap-4">
                <img
                  src={post.userAvatar}
                  alt={post.userName}
                  className="w-12 h-12 rounded-full border-2 border-slate-200 dark:border-slate-700"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {post.userName}
                    </span>
                    <span className="badge badge-primary text-xs">
                      {post.language}
                    </span>
                    <span className="text-sm text-slate-400">
                      {formatTime(post.createdAt)}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 mb-4 whitespace-pre-wrap">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-2 transition-colors ${
                        post.liked
                          ? 'text-red-500'
                          : 'text-slate-400 hover:text-red-500'
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`}
                      />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-400 hover:text-primary-500 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-400 hover:text-primary-500 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <Globe className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-white mb-2">
              暂无帖子
            </h3>
            <p className="text-slate-500">成为第一个发帖的人吧！</p>
          </div>
        )}
      </div>
    </div>
  );
}
