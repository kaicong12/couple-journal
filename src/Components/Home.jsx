import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

import OurStory from '../Pages/OurStory';
import Gallery from '../Pages/Gallery';

const HomePage = () => {
    return (
        <Box bg="#D9D9D9" pt="40px">
            <Tabs variant='soft-rounded' colorScheme='brown' align='center' pb="0">
                <TabList>
                    <Tab>Our Story</Tab>
                    <Tab>Gallery</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel px="0" pb="0">
                        <OurStory />
                    </TabPanel>
                    <TabPanel px="0" pb="0">
                        <Gallery />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    )
}

export default HomePage