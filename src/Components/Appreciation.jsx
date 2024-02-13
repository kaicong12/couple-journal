import { Box, Text, Image } from '@chakra-ui/react'

const poem = [
    '我不善言辞， 那就祝我们,',
    '一直在一起晨昏与四季节,',
    '我要携带我所有热情, 偏爱, 喜欢,',
    '全都毫无保留的奔向你,',
    '是你我才决定要恋爱的,',
    '希望这次是必胜局,'
]

const Appreciation = () => {
    return (
        <Box bg="#F2F2F2" pt="75px">
            <Text
                fontSize="30px"
                fontWeight="800"
                fontFamily="actor"
                mb="30px"
            >
                曾经看到一段很浪漫的话
            </Text>
            { poem.map((poemTxt, pIndex)=> (
                <Text
                    fontSize={ pIndex === 4 ? "20px" : "17px" }
                    fontFamily="actor"
                    mb="10px"
                    fontWeight={ pIndex === 4 ? '800' : '400' }
                    key={pIndex}
                >
                    {poemTxt}
                </Text>
            )) }
            
            <Box boxSize="300px" mt="55px">
                <Image src="/images/coupleCouch.svg" alt="Couple Couch"/>
            </Box>
        </Box>
    )
}

export default Appreciation