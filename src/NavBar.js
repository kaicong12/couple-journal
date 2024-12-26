import { useEffect, useState } from 'react';
import { routesWithinApp } from './routes';
import { Link, useLocation } from 'react-router-dom';
import { Box, Tabs, Text, TabList, Tab } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faCalendarAlt, faUtensils } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        let basePath = '/'
        if (location.pathname && location.pathname.startsWith('/')) {
            // Split the pathname by slashes and return the first non-empty part
            const parts = location.pathname.split('/').filter(part => part.length > 0);
            basePath = parts.length > 0 ? `/${parts[0]}` : '/';
        }

        const newActiveTab = routesWithinApp.indexOf(basePath);
        setActiveTab(newActiveTab);
    }, [location.pathname]);

  return (
        <Box bg="#D9D9D9" py="20px">
            <Tabs
                variant="soft-rounded"
                colorScheme="brown"
                align="center"
                pb="0"
                index={activeTab}
            >
                <TabList>
                    <Tab>
                        <Link to={`/`}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <FontAwesomeIcon icon={faBookOpen} />
                                <Text fontSize="12px" fontWeight="bold">Our Story</Text>
                            </Box>
                        </Link>
                    </Tab>
                    <Tab>
                        <Link to={`events`}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                <Text fontSize="12px" fontWeight="bold">Events</Text>
                            </Box>
                        </Link>
                    </Tab>
                    <Tab>
                        <Link to={`food`}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <FontAwesomeIcon icon={faUtensils} />
                                <Text fontSize="12px" fontWeight="bold">Food</Text>
                            </Box>
                        </Link>
                    </Tab>
                    {/* <Tab>
                        <Link to={`letter`}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <FontAwesomeIcon icon={faEnvelope} />
                                <Text fontSize="12px" fontWeight="bold">Letter</Text>
                            </Box>
                        </Link>
                    </Tab> */}
                </TabList>
            </Tabs>
        </Box>
    );
};

export default NavBar;
