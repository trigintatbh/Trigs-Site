import { BrowserRouter, Route, Routes } from 'react-router'
import Header from './components/Header'
import Main from './components/Main'
import Home from './pages/Home'
import Games from './pages/Games'
import About from './pages/About'
import Contact from './pages/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <BrowserRouter>
        <Header />
        <Main>
          <Routes>
            <Route index Component={Home} />
            <Route path='games' Component={Games} />
            <Route path='about' Component={About} />
            <Route path='contact' Component={Contact} />
          </Routes>
        </Main>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App
