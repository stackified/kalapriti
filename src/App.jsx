import { Router, Route, Switch } from 'wouter'
import Layout from './components/Layout'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Services from './pages/Services'
import Process from './pages/Process'
import Resources from './pages/Resources'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import './App.css'

/**
 * Router base is derived from the Vite base so the app works unchanged at
 * /kalapriti/ today and at "/" once the site moves to its own domain.
 * wouter wants the base without a trailing slash.
 */
const base = import.meta.env.BASE_URL.replace(/\/$/, '')

export default function App() {
  return (
    <Router base={base}>
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/projects" component={Projects} />
          <Route path="/services" component={Services} />
          <Route path="/process" component={Process} />
          <Route path="/resources" component={Resources} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  )
}
