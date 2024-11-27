import {Route, BrowserRouter, Routes} from "react-router-dom";
import {Login} from "./composants/Login/Login";

function App() {
  return (
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
      </BrowserRouter>
  );
}

export default App;
