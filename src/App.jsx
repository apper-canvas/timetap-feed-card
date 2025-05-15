import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import getIcon from './utils/iconUtils';

// Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Set dark mode on document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  // Icon declarations with error handling
  let SunIcon, MoonIcon;
  
  try {
    SunIcon = getIcon('Sun');
    if (!SunIcon) throw new Error('Sun icon not found');
  } catch (error) {
    console.error('Failed to load Sun icon:', error);
    // Fallback icon component
    SunIcon = ({ size, className }) => (
      <div className={`w-${size/4} h-${size/4} rounded-full bg-yellow-300 ${className}`}></div>
    );
  }
  
  try {
    MoonIcon = getIcon('Moon');
    if (!MoonIcon) throw new Error('Moon icon not found');
  } catch (error) {
    console.error('Failed to load Moon icon:', error);
    // Fallback icon component
    MoonIcon = ({ size, className }) => (
      <div className={`w-${size/4} h-${size/4} rounded-full border-2 border-surface-600 ${className}`}></div>
    );
  }

  return (
    <div className="app min-h-screen">
      <header className="fixed w-full top-0 z-40 bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <motion.div 
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5 }}
              className="text-primary-dark dark:text-primary-light"
            >
              {(() => {
                try {
                  const ClockIcon = getIcon('Clock');
                  return ClockIcon ? <ClockIcon size={28} /> : <span>⏰</span>;
                } catch (error) {
                  console.error('Failed to load Clock icon:', error);
                  return <span>⏰</span>;
                }
              })()}
            </motion.div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TimeTap
            </h1>
          </div>
          
          <button 
            onClick={toggleDarkMode}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <SunIcon className="text-yellow-300" size={18} />
            ) : (
              <MoonIcon className="text-surface-600" size={18} />
            )}
          </button>
        </div>
      </header>
      
      <main className="pt-16 pb-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        toastClassName="!rounded-xl !font-medium"
      />
    </div>
  );
}

export default App;