import React from 'react'
import Store from "@/store"
import App from './App.jsx'
import ReactDOM from 'react-dom/client'
import * as serviceWorker from './serviceWorker';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Store.Provider>
      <App />
    </Store.Provider>
  </React.StrictMode>,
)

serviceWorker.unregister()