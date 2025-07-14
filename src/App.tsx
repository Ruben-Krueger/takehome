import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboards';
import Charts from './pages/Charts';
import Home from './pages/Home';
import { Footer } from './components/ui/footer';
import { FontSizeProvider } from './contexts/FontSizeContext';
import Header from './components/ui/header';

function App() {
  return (
    <FontSizeProvider>
      <Router>
        <Header />
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <main className="flex-1 container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/charts" element={<Charts />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </FontSizeProvider>
  );
}

export default App;
