import { useState } from 'react';
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

import OurStory from './Pages/OurStory';
import Gallery from './Pages/Gallery';
import EventPage from './Pages/EventsList'
import FoodRecommendations from './Pages/FoodRecommender'

const HomePage = () => {
    const [activeTab, setActiveTab] = useState(0)
    const handleTabsChange = (index) => {
        setActiveTab(index);
    };

    return (
        <Box bg="#D9D9D9" pt="40px">
            <Tabs variant='soft-rounded' colorScheme='brown' align='center' pb="0" index={activeTab} onChange={handleTabsChange}>
                <TabList>
                    <Tab>Our Story</Tab>
                    {/* <Tab>Gallery</Tab> */}
                    <Tab>Events</Tab>
                    <Tab>Food</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel px="0" pb="0">
                        <OurStory setActiveTab={setActiveTab} />
                    </TabPanel>
                    {/* <TabPanel px="0" pb="0">
                        <Gallery />
                    </TabPanel> */}
                    <TabPanel px="0" pb="0">
                        <EventPage />
                    </TabPanel>
                    <TabPanel px="0" pb="0">
                        <FoodRecommendations />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    )
}

export default HomePage