import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

import NavBar from './NavBar';
import OurStory from './Pages/OurStory'
import Events from './Pages/EventsList';
import AddEvent from './Pages/AddEvent';
import EventDetail from './Pages/EventDetail';
import EditEvent from './Pages/EditEvent';
import Us from './Pages/Us';
import { LoginPage } from './Pages/Login';
import PrivateRoute from './PrivateRoute';
import { useAuth } from './AuthContext';

function App() {
  const { user, loading } = useAuth();
  // Wait for onAuthStateChanged to resolve before deciding, otherwise the
  // Login page flashes on every refresh for already-authenticated users.
  if (loading) {
    return null;
  }
  if (!user) {
    return <LoginPage />;
  }

  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<PrivateRoute>
                <OurStory />
              </PrivateRoute>
            } />
            <Route path="events" element={
              <PrivateRoute>
                <Events />
              </PrivateRoute>
            } />
            <Route path="events/new" element={
              <PrivateRoute>
                <AddEvent />
              </PrivateRoute>
            } />
            <Route path="events/:id" element={
              <PrivateRoute>
                <EventDetail />
              </PrivateRoute>
            } />
            <Route path="events/:id/edit" element={
              <PrivateRoute>
                <EditEvent />
              </PrivateRoute>
            } />
            <Route path="us" element={
              <PrivateRoute>
                <Us />
              </PrivateRoute>
            } />
            {/* <Route path="letter" element={<Letter />} /> */}
        </Routes>
      </div>
      <Analytics />
    </Router>
  );
}

export default App;
