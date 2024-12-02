import { Box } from '@chakra-ui/react'
import HeroSection from './Components/Hero';
import Footer from './Components/Footer';
import Appreciation from './Components/Appreciation';
import Whisper from './Components/Whisper';

const OurStory = () => {
    return (
        <Box>
            <HeroSection />
            <Appreciation />
            <Whisper />
            <Footer />
        </Box>
    )
}

export default OurStory