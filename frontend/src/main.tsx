
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import { Provider } from 'react-redux'
import { store } from './store'

createRoot(document.getElementById('root')!).render(

    <Provider store={store}>
      <ThemeProvider defaultTheme="system" storageKey="eventease-theme">
        <App />
      </ThemeProvider>
    </Provider>
)

