import './App.css';
import { extendTheme, ChakraProvider } from '@chakra-ui/react'
import { brownScheme} from './theme'

import HomePage from './Components/Home';

const theme = extendTheme({
  colors: {
    brown: brownScheme,
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <div className="App">
        <HomePage />
      </div>
    </ChakraProvider>
  );
}

export default App;
