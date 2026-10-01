import { Router, Route, Switch } from 'wouter'
import Layout from './components/Layout'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Gallery from './pages/Gallery'
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

/**
 * `ssrPath` is only passed at build time, by src/entry-server.jsx, which
 * renders each route to static HTML. There is no window.location in Node, so
 * the router has to be told which page it is drawing. In the browser it is
 * undefined and wouter reads the real location as normal.
 */
export default function App({ ssrPath }) {
  return (
    <Router base={base} ssrPath={ssrPath}>
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/projects" component={Projects} />
          <Route path="/gallery" component={Gallery} />
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
