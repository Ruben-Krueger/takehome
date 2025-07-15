import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboards';
import Charts from './pages/Charts';
import Home from './pages/Home';
import { Footer } from './components/ui/footer';
import { FontSizeProvider } from './contexts/FontSizeContext';
import { FiltersProvider } from './contexts/FiltersContext';
import Header from './components/ui/header';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSideBar from '@/components/ui/AppSideBar';
import Search from './pages/Search';

function App() {
  return (
    <FontSizeProvider>
      <FiltersProvider>
        <Router>
          <SidebarProvider>
            <AppSideBar />
            <div className="min-h-screen bg-gray-50 flex-1 flex flex-col">
              <Header />
              <main className="flex-1 py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard/:id" element={<Dashboard />} />
                  <Route path="/charts" element={<Charts />} />
                  <Route path="/search" element={<Search />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </SidebarProvider>
        </Router>
      </FiltersProvider>
    </FontSizeProvider>
  );
}

export default App;
