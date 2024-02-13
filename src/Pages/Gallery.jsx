import { Box, Text, Image } from '@chakra-ui/react'

const galleryImagesUrl = [
    '/gallery/IMG_2148.jpeg',
    '/gallery/IMG_1987.jpeg',
    '/gallery/IMG_2007.jpeg',
]

const Gallery = () => {
    return (
        <Box bg="#D9D9D9" px="20px" pb="20px">
            <Text
                fontSize="40px"
                fontWeight="600"
                fontFamily="actor"
                mb="10px"
                mt="20px"
            >
                Our Gallery
            </Text>

            <Text fontFamily="actor" fontSize="20px" px="10px" mb="60px">
                Welcome to our Gallery of Memories. Though the collection may seem modest at the moment, 
                each photograph is a cherished chapter of our journey together and I 
                definitely look forward to expanding this collection together
            </Text>

            { galleryImagesUrl.map((imageUrl, iIndex) => {
                return (
                    <Box width="full" key={`${iIndex}-box`} mb={ iIndex !== galleryImagesUrl.length - 1 ? "10px": "0px" }>
                        <Image borderRadius="6px" src={`${imageUrl}`} alt="images" key={iIndex} />
                    </Box>
                )
            }) }
        </Box>
    )
}

export default Gallery