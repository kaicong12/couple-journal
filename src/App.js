import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

import NavBar from './NavBar';
import OurStory from './Pages/OurStory'
import Events from './Pages/EventsList';
import FoodRecommender from './Pages/FoodRecommender';
import { RestaurantDetails } from './Pages/FoodRecommender/RestaurantDetails';
import { RestaurantListView } from './Pages/FoodRecommender/RestaurantList';
// import { Letter } from './Pages/Letter';
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
            <Route path="food" element={
              <PrivateRoute>
                <FoodRecommender />
              </PrivateRoute>
            } />
            <Route path="food/:restaurantId" element={
              <PrivateRoute>
                <RestaurantDetails />
              </PrivateRoute>
            } />
            <Route path="food/viewAllPopular" element={
              <PrivateRoute>
                <RestaurantListView />
              </PrivateRoute>
            } />
            <Route path="food/viewAllBookmarked" element={
              <PrivateRoute>
                <RestaurantListView />
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
