import { Box } from '@chakra-ui/react'
import HeroSection from './Components/Hero';
import Footer from './Components/Footer';
import Appreciation from './Components/Appreciation';
import Whisper from './Components/Whisper';
import Testimonials from './Components/Testimonials'

const OurStory = ({ setActiveTab }) => {
    return (
        <Box pt="30px">
            <HeroSection />
            <Appreciation />
            <Whisper />
            <Testimonials />
            <Footer setActiveTab={setActiveTab} />
        </Box>
    )
}

export default OurStory