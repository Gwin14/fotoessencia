import Squares from "./components/Squares";
import MainScreen from "./screens/MainScreen";
import ClickSpark from "./components/ClickSpark";
import { fetchInstagramProfileInfo } from "./services/instagram";
import { useState, useEffect } from "react";
import Header from "./components/Header";

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
    <>
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
          direction="diagonal" // up, down, left, right, diagonal
          borderColor="#75757533"
          hoverFillColor="#75757533"
        />
        <Header profilePic={profileInfo?.profilePicture} />

        <MainScreen />
      </ClickSpark>
    </>
  );
}

export default App;
