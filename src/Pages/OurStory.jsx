import { Box } from '@chakra-ui/react'
import HeroSection from '../Components/Hero';
import Footer from '../Components/Footer';
import Appreciation from '../Components/Appreciation';
import Whisper from '../Components/Whisper';
import Moments from '../Components/Moments'

const OurStory = () => {
    return (
        <Box pt="30px">
            <HeroSection />
            <Appreciation />
            <Whisper />
            <Moments />
            <Footer />
        </Box>
    )
}

export default OurStory