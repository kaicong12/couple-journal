import './App.css';
import { extendTheme, ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { brownScheme} from './theme'

import NavBar from './NavBar';
import OurStory from './Pages/OurStory'
import Events from './Pages/EventsList';
import FoodRecommender from './Pages/FoodRecommender';
import { RestaurantDetails } from './Pages/FoodRecommender/RestaurantDetails';
import { RestaurantListView } from './Pages/FoodRecommender/RestaurantList';

const theme = extendTheme({
  colors: {
    brown: brownScheme,
  },
  components: {
    Input: {
      baseStyle: {
        field: {
            _focus: {
              boxShadow: '0 0 0 1px rgba(255, 181, 62, 0.6)', 
              borderWidth: '2px', 
              borderColor: 'brown.200',
              outline: 'none' 
          }
        }
      }
    }
  }
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <div className="App">
          <NavBar />
          <Routes>
              <Route path="/" element={<OurStory />} />
              <Route path="events" element={<Events />} />
              <Route path="food" element={<FoodRecommender />} />
              <Route path="food/:restaurantId" element={<RestaurantDetails />} />
              <Route path="food/viewAllPopular" element={<RestaurantListView />} />
              <Route path="food/viewAllBookmarked" element={<RestaurantListView />} />
          </Routes>
        </div>
        <Analytics />
      </Router>
    </ChakraProvider>
  );
}

export default App;
