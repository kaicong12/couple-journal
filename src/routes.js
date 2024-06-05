import { createBrowserRouter } from "react-router-dom"
import App from './App';
import EventPage from './Pages/EventsList'
import FoodRecommendations from './Pages/FoodRecommender'


  
export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "events",
                element: <EventPage />,
            },
            {
                path: "food",
                element: <FoodRecommendations />,
            },
        ],
    },
]);

