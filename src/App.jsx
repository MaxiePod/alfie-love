import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Games from './pages/Games';
import Blog from './pages/Blog';
import LexiconPage from './pages/LexiconPage';

export const APP_VERSION = 'v1.0.1';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/lexicon" element={<LexiconPage />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
    </Layout>
  );
}

export default App;
