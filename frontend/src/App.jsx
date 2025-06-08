import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authContext.jsx';
import ProtectedRoute from './middleware/protectedRoutes.jsx';

import Login from './pages/loginSignuppage/login.jsx';
import Signup from './pages/loginSignuppage/signup.jsx';
import Dashboard from './components/loginUser/dashboard.jsx';
import MentorsPage from './pages/mentorpage/mentorPage.jsx';
import LearnersPage from './pages/learnerpage/learnerPage.jsx';
import DevelopersPage from './pages/developerpage/developerPage.jsx';
import HomePage from './pages/homepage/homePage.jsx';
import LearnMore from './pages/loginSignuppage/learnMorePage.jsx';
import LandingPage from './pages/landingpage/landingPage.jsx';
import AllPostsPage from './pages/postpage/postPage.jsx';
import UserProfilePage from './pages/userpage/userPage.jsx';
import UserPosts from './pages/userpage/userPosts.jsx';
import SkillExchangeForm from './components/skill-exchange/skillsExchangeForm.jsx';
import Layout from './components/layout/layout.jsx';
import SendRequestForm from './components/hiring/sendRequestForm.jsx';
import SendMentorRequestForm from './components/mentors/sendMentorReq.jsx'

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
          <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="learn-more" element={<LearnMore />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />

          <Route path="home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="learn-more" element={<ProtectedRoute><LearnMore /></ProtectedRoute>} />
          <Route path="mentor" element={<ProtectedRoute><MentorsPage /></ProtectedRoute>} />
          <Route path="learner" element={<ProtectedRoute><LearnersPage /></ProtectedRoute>} />
          <Route path="developer" element={<ProtectedRoute><DevelopersPage /></ProtectedRoute>} />
          <Route path="hire/:userId" element={<ProtectedRoute><SendRequestForm /></ProtectedRoute>} />
          <Route path="mentor/:mentorId" element={<ProtectedRoute><SendMentorRequestForm /></ProtectedRoute>} />
          <Route path="skill-exchange" element={<ProtectedRoute><SkillExchangeForm /></ProtectedRoute>} />
          <Route path="posts" element={<ProtectedRoute><AllPostsPage /></ProtectedRoute>} />
          
          <Route path="profile/:id" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>}>
            <Route index element={null} />
            <Route path="posts" element={<UserPosts />} />
         </Route>
         
          <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<Login />} />
        </Route>

      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
