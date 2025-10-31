// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { InstagramProvider } from "./context/InstagramContext";

import ClickSpark from "./components/ClickSpark";
import Squares from "./components/Squares";
import Header from "./components/Header";
import MainScreen from "./screens/MainScreen";
import WIPScreen from "./screens/WIPScreen";
import GaleryScreen from "./screens/GaleryScreen";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.main
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <MainScreen />
            </motion.main>
          }
        />
        <Route
          path="/WIP"
          element={
            <motion.main
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <WIPScreen />
            </motion.main>
          }
        />
        <Route
          path="/galery"
          element={
            <motion.main
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <GaleryScreen />
            </motion.main>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <InstagramProvider>
      <Router>
        <ClickSpark
          sparkColor="white"
          sparkSize={10}
          sparkRadius={15}
          sparkCount={8}
          duration={400}
        >
          <Squares
            speed={0.1}
            squareSize={40}
            direction="diagonal"
            borderColor="#75757533"
            hoverFillColor="#75757533"
          />

          <Header />

          <AnimatedRoutes />
        </ClickSpark>
      </Router>
    </InstagramProvider>
  );
}

export default App;
