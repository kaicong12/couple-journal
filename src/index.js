import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { RecoilRoot } from 'recoil';
import reportWebVitals from './reportWebVitals';
import App from './App'
import { AuthProvider } from './AuthContext';
import { extendTheme, ChakraProvider } from '@chakra-ui/react'
import { brownScheme} from './theme'

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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RecoilRoot>
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </AuthProvider>
    </ChakraProvider>
  </RecoilRoot>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
