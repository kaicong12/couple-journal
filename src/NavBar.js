import { useEffect, useState } from 'react';
import { routesWithinApp } from './routes';
import { Link, useLocation } from 'react-router-dom';
import { Box, Tabs, TabList, Tab } from '@chakra-ui/react';

const NavBar = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const newActiveTab = routesWithinApp.indexOf(location.pathname);
        setActiveTab(newActiveTab);
    }, [location.pathname]);

  return (
        <Box bg="#D9D9D9" pt="40px">
            <Tabs
            variant="soft-rounded"
            colorScheme="brown"
            align="center"
            pb="0"
            index={activeTab}
            >
            <TabList>
                <Tab>
                    <Link to={`/`}>Our Story</Link>
                </Tab>
                <Tab>
                    <Link to={`events`}>Events</Link>
                </Tab>
                <Tab>
                    <Link to={`food`}>Food</Link>
                </Tab>
            </TabList>
            </Tabs>
        </Box>
    );
};

export default NavBar;
