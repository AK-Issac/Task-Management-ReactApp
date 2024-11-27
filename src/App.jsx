import {Route, BrowserRouter, Routes} from "react-router-dom";
import {SignUp} from "./composants/SignUp/SignUp.jsx";

function App() {
  return (
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />
      </Routes>
      </BrowserRouter>
  );
}

export default App;
