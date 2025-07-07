import Squares from "./components/Squares";
import MainScreen from "./screens/MainScreen";

function App() {
  return (
    <>
      <Squares
        speed={0.1}
        squareSize={40}
        direction="diagonal" // up, down, left, right, diagonal
        borderColor="#ebebeb"
        hoverFillColor="#ebebeb"
      />
      <MainScreen />
    </>
  );
}

export default App;
