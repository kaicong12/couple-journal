import { useState } from 'react';
import { Outlet, Link } from "react-router-dom";
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

import OurStory from './Pages/OurStory';


const HomePage = () => {
    const [activeTab, setActiveTab] = useState(0)
    const handleTabsChange = (index) => {
        setActiveTab(index);
    };

    return (
        <Box bg="#D9D9D9" pt="40px">
            <Tabs variant='soft-rounded' colorScheme='brown' align='center' pb="0" index={activeTab} onChange={handleTabsChange}>
                <TabList>
                    <Tab><Link to={`/`}>Our Story</Link></Tab>
                    {/* <Tab>Gallery</Tab> */}
                    <Tab><Link to={`events`}>Events</Link></Tab>
                    <Tab><Link to={`food`}>Food</Link></Tab>
                </TabList>
                <TabPanels>
                    <TabPanel px="0" pb="0">
                        <OurStory />
                    </TabPanel>
                    <TabPanel px="0" pb="0">
                        <Outlet />
                    </TabPanel>
                    <TabPanel px="0" pb="0">
                        <Outlet />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    )
}

export default HomePage