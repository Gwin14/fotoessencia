import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Squares from "./components/Squares";
import MainScreen from "./screens/MainScreen";
import ClickSpark from "./components/ClickSpark";
import Header from "./components/Header";
import { fetchInstagramProfileInfo } from "./services/instagram";
import WIPScreen from "./screens/WIPScreen";

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
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [profileInfo, setProfileInfo] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const [profile] = await Promise.all([fetchInstagramProfileInfo()]);
      setProfileInfo(profile);
    };
    loadData();
  }, []);

  return (
    <Router>
      {/* Efeitos globais — sempre visíveis */}
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

        <Header profilePic={profileInfo?.profilePicture} />

        {/* Somente o conteúdo da rota muda */}
        <AnimatedRoutes />
      </ClickSpark>
    </Router>
  );
}

export default App;
