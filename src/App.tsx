import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './components/Main';
import Home from './pages/Home';
import PNF from './pages/404';

function App() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <BrowserRouter>
        <Main>
          <Routes>
            <Route index element={<Home />} />
            <Route path='*' element={<PNF />} />
          </Routes>
        </Main>
      </BrowserRouter>
    </div>
  );
}

export default App;
