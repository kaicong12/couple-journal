import { Box, Image } from '@chakra-ui/react'

const galleryImagesUrl = [
    '/gallery/IMG_2148.jpeg',
    '/gallery/IMG_1987.jpeg',
    '/gallery/IMG_2007.jpeg',
]

const Gallery = () => {
    return (
        <Box bg="#D9D9D9" px="20px" pb="20px">
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