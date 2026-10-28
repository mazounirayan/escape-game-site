import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { installStaticApi } from './staticApi'

installStaticApi()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <App />
  </>,
)
