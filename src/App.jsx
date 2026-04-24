import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Games from './pages/Games';
import Blog from './pages/Blog';
import LexiconPage from './pages/LexiconPage';
import VexillumPage from './pages/VexillumPage';
import CapitoliumPage from './pages/CapitoliumPage';

export const APP_VERSION = 'v1.13.0';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/lexicon" element={<LexiconPage />} />
        <Route path="/games/vexillum" element={<VexillumPage />} />
        <Route path="/games/capitolium" element={<CapitoliumPage />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
    </Layout>
  );
}

export default App;
