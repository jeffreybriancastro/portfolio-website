import { StrictMode, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Home from '@/components/Home'
import NotFound from '@/components/NotFound'
import { restorePerfTier } from '@/lib/perf'
import { restorePrefs } from '@/lib/a11y'

// Every route but Home is its own chunk: the first visit only pays for Home.
const ProjectsView = lazy(() => import('@/views/ProjectsView'))
const ServicesView = lazy(() => import('@/views/ServicesView'))
const TestimonialsGrid = lazy(() => import('@/components/TestimonialsGrid'))
const AboutGrid = lazy(() => import('@/components/AboutGrid'))
const ContactGrid = lazy(() => import('@/components/ContactGrid'))
const BookGrid = lazy(() => import('@/components/BookGrid'))
import './styles/tokens.css'
import './styles/global.css'
import './styles/slab.css'
import './styles/theme-glyph.css'
// The legacy section sheets first, then the shell. The redesign overrides them
// (the floating nav pill hiding behind the rail, the compact workflow), and
// equal-specificity rules are decided by source order.
import './styles/sections.css'
import './styles/extensions.css'
import './styles/shell.css'
import './styles/rail.css'
import './styles/home.css'
import './styles/bento.css'
import './styles/projects-grid.css'
import './styles/project-panel.css'
import './styles/services-grid.css'
import './styles/testimonials-grid.css'
import './styles/about-grid.css'
import './styles/contact-grid.css'
import './styles/book-grid.css'
import './styles/ghl.css'
import './styles/boot.css'
import './styles/credentials.css'
import './styles/testimonials.css'
import './styles/mobile-app.css'
import './styles/a11y.css'
// Apple design pass - an overlay on everything above; perf.css still wins.
import './styles/apple.css'
// Last: the perf tiers only ever turn things OFF, so they must win.
import './styles/perf.css'

// Re-apply this tab's performance verdict before the first paint, so a
// downgraded visitor never sees the expensive layers flash back on reload.
restorePerfTier()
restorePrefs()

const container = document.getElementById('root')
if (!container) throw new Error('Root element #root not found')

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* The shell owns the rail, the shader and the intro; each child
            renders into its one scrolling panel. */}
        <Route element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsView />} />
          <Route path="/services" element={<ServicesView />} />
          <Route path="/testimonials" element={<TestimonialsGrid />} />
          <Route path="/about" element={<AboutGrid />} />
          <Route path="/contact" element={<ContactGrid />} />
          <Route path="/book" element={<BookGrid />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
