import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AllSessions from './components/AllSessions';
import DownloadResources from './components/DownloadResources';
import Forum from './components/forum/Forum';
import ForumItem from './components/forum/PostDetail';
import { default as ForumCreate, default as ForumEdit } from './components/forum/PostForm';
import Home from "./components/Home";
import LoginForm from './components/LoginForm';
import ManageResources from "./components/ManageResources";
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import RegisterForm from './components/RegisterForm';
import RegisterSessions from './components/RegisterSessions';
import Resource from './components/Resource';
import Resources from './components/Resources';
import SearchSessions from './components/searchsession/SearchSessions';
import Sessions from './components/Sessions';
import StudentSessions from './components/StudentSessions';
import Support from './components/Support';
import UploadResource from './components/UploadResource';
import { AuthProvider } from './contexts/AuthContext';
import About from './pages/about/About';
import Contact from './pages/contactus/ContactUs';
import MentorDashboard from './pages/MentorDashboard';
import StudentDashboard from './pages/StudentDashboard';

export default function App() {
  return (
    <AuthProvider>
    <BrowserRouter>

      <Routes>

<Route path="/about"           element={<About />} />
<Route path="/contact"           element={<Contact />} />
          <Route
          path="/"
          element={
            <PublicRoute>
     <Home />
            </PublicRoute>
          }
        />
        {/* Public: only accessible when NOT logged in */}
        <Route
          path="/login"
          element={
            <PublicRoute>
     <LoginForm />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterForm />
            </PublicRoute>
          }
        />

        {/* Root → login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Student-only pages */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/dashboard/student"           element={<StudentDashboard />} />
          <Route path="/dashboard/student/sessions"  element={<StudentSessions />} />
          <Route path="/dashboard/student/register"  element={<RegisterSessions />} />
          <Route path="/dashboard/student/resource" element={<DownloadResources />} />
          <Route path="/dashboard/student/resources" element={<Resources />} />
          <Route path="/dashboard/student/resources/:id" element={<Resource />} />
          <Route path="/dashboard/student/search" element={<SearchSessions />} />
          <Route path="/dashboard/student/support" element={<Support />} />
          <Route path="/dashboard/student/forum" element={<Forum />} />
          <Route path="/dashboard/student/forum/create" element={<ForumCreate />} />
          <Route path="/dashboard/student/forum/post/:id" element={<ForumItem />} />
          <Route path="/dashboard/student/forum/post/:id/edit/:id" element={<ForumEdit />} />
          <Route path="/dashboard/student/all-sessions" element={<AllSessions />} />
          <Route path="/dashboard/student/profile" element={<Profile />} />
        </Route>

        {/* Mentor-only page */}
        <Route element={<ProtectedRoute allowedRoles={['mentor']} />}>
          <Route path="/dashboard/mentor" element={<MentorDashboard />} />
          <Route path="/dashboard/sessions" element={<Sessions />} />
          <Route path="/dashboard/upload-resource" element={<UploadResource />} />
          <Route path="/dashboard/manage-resources" element={<ManageResources />} />
          <Route path="/dashboard/mentor/forum" element={<Forum />} />
          <Route path="/dashboard/mentor/support" element={<Support />} />
          <Route path="/dashboard/mentor/forum/create" element={<ForumCreate />} />
          <Route path="/dashboard/mentor/forum/post/:id" element={<ForumItem />} />
          <Route path="/dashboard/mentor/forum/post/:id/edit/:id" element={<ForumEdit />} />
          <Route path="/dashboard/mentor/profile" element={<Profile />} />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<h1>404 – Not Found</h1>} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>  
  )
}
