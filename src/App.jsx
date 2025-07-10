import Squares from "./components/Squares";
import MainScreen from "./screens/MainScreen";
import ClickSpark from "./components/ClickSpark";

function App() {
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
        <MainScreen />
      </ClickSpark>
    </>
  );
}

export default App;
