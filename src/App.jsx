import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { InstagramProvider } from "./context/InstagramContext";
import { YoutubeProvider } from "./context/YoutubeContext";

import ClickSpark from "./components/ClickSpark";
import Squares from "./components/Squares";
import Header from "./components/Header";
import MainScreen from "./screens/MainScreen";
import WIPScreen from "./screens/WIPScreen";
import GaleryScreen from "./screens/GaleryScreen";
import KomorebiScreen from "./screens/KomorebiScreen";
import ActivityScreen from "./screens/ActivityScreen";
import NewsletterPostScreen from "./screens/NewsletterPostScreen";

import { HelmetProvider } from "react-helmet-async";

const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
};
const pageTransition = { duration: 0.4, ease: "easeInOut" };

function Page({ children }) {
  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {children}
    </motion.main>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => window.scrollTo({ top: 0 })}
    >
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <Page>
              <MainScreen />
            </Page>
          }
        />
        <Route
          path="/WIP"
          element={
            <Page>
              <WIPScreen />
            </Page>
          }
        />
        <Route
          path="/komorebi"
          element={
            <Page>
              <KomorebiScreen />
            </Page>
          }
        />
        <Route
          path="/galery"
          element={
            <Page>
              <GaleryScreen />
            </Page>
          }
        />
        <Route
          path="/activity"
          element={
            <Page>
              <ActivityScreen />
            </Page>
          }
        />

        <Route
          path="/activity/:slug"
          element={
            <Page>
              <NewsletterPostScreen />
            </Page>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <HelmetProvider>
      <YoutubeProvider>
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
      </YoutubeProvider>
    </HelmetProvider>
  );
}

export default App;
