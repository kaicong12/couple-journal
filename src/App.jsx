import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

import NavBar from './NavBar';
import OurStory from './Pages/OurStory'
import Events from './Pages/EventsList';
import { LoginPage } from './Pages/Login';
import PrivateRoute from './PrivateRoute';
import { useAuth } from './AuthContext';

function App() {
  const { user } = useAuth();
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
            {/* <Route path="letter" element={<Letter />} /> */}
        </Routes>
      </div>
      <Analytics />
    </Router>
  );
}

export default App;
