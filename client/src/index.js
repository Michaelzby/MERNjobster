import React from 'react'
import ReactDOM from 'react-dom'
import 'normalize.css'
import './index.css'
import App from './App'
import { AppProvider } from './context/appContext'

ReactDOM.render(
  <React.StrictMode>
    {/* 记得在index里面加上app provider */}
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
