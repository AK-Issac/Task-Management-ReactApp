import { Route, BrowserRouter, Routes} from "react-router-dom";
import { SignUp } from "./composants/SignUp/SignUp.jsx";
import { Login } from "./composants/Login/Login.jsx";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/inscription" element={<SignUp />} />
          <Route path="/connexion" element={<Login />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
