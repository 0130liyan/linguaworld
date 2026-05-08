import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useStore } from './store/useStore';
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import HomePage from './pages/HomePage';
import CourseCenter from './pages/CourseCenter';
import CourseDetail from './pages/CourseDetail';
import WordLearning from './pages/WordLearning';
import GrammarPractice from './pages/GrammarPractice';
import SpeakingPractice from './pages/SpeakingPractice';
import ListeningPractice from './pages/ListeningPractice';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import AchievementsPage from './pages/AchievementsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  const { settings } = useStore();

  return (
    <BrowserRouter>
      <div className={settings.theme === 'dark' ? 'dark' : ''}>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={
              <>
                <Navbar />
                <main className="pt-16">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/courses" element={<CourseCenter />} />
                    <Route path="/course/:id" element={<CourseDetail />} />
                    <Route path="/learn/words" element={<WordLearning />} />
                    <Route path="/learn/grammar" element={<GrammarPractice />} />
                    <Route path="/learn/speaking" element={<SpeakingPractice />} />
                    <Route path="/learn/listening" element={<ListeningPractice />} />
                    <Route path="/community" element={<CommunityPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/achievements" element={<AchievementsPage />} />
                    <Route path="/achievements" element={<AchievementsPage />} />
                  </Routes>
                </main>
                <BottomNav />
              </>
            } />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
