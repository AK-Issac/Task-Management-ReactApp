import {Route, BrowserRouter, Routes} from "react-router-dom";
import {Home} from "./composants/PageSite/Home.jsx";

function App() {
  return (
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
      </Routes>
      </BrowserRouter>
  );
}

export default App;
