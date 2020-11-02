import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import store from './redux/store'
import App from './components/App'

const theme = createMuiTheme({
  spacing: [0, 4, 8, 16, 32, 64],
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#ff5252',
    },
    white: {
      main: '#fff',
    },
    gray: {
      main: '#444141',
      dark: '#26292F',
      header: '#272727',
      label: '#303030',
      lite: '#eee',
    },
  },
})

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
)
