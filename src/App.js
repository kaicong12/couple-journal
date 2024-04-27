import './App.css';
import { extendTheme, ChakraProvider } from '@chakra-ui/react'
import { brownScheme} from './theme'

import HomePage from './Home';

const theme = extendTheme({
  colors: {
    brown: brownScheme,
  },
  components: {
    Input: {
      baseStyle: {
        field: {
            _focus: {
              boxShadow: '0 0 0 1px rgba(255, 181, 62, 0.6)', 
              borderWidth: '2px', 
              borderColor: 'brown.200',
              outline: 'none' 
          }
        }
      }
    }
  }
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
