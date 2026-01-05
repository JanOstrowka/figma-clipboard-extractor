import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Lazy load analytics - not needed for FCP
const Analytics = lazy(() => 
  import('@vercel/analytics/react').then(mod => ({ default: mod.Analytics }))
)
const SpeedInsights = lazy(() => 
  import('@vercel/speed-insights/react').then(mod => ({ default: mod.SpeedInsights }))
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Suspense fallback={null}>
      <Analytics />
      <SpeedInsights />
    </Suspense>
  </StrictMode>,
)
