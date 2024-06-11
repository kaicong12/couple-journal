import { Box } from '@chakra-ui/react'
import HeroSection from './Components/Hero';
import Footer from './Components/Footer';
import Appreciation from './Components/Appreciation';
import Whisper from './Components/Whisper';

const OurStory = ({ setActiveTab }) => {
    return (
        <Box pt="15px">
            <HeroSection />
            <Appreciation />
            <Whisper />
            <Footer setActiveTab={setActiveTab} />
        </Box>
    )
}

export default OurStory