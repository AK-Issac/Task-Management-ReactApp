import { Route, BrowserRouter, Routes } from "react-router-dom";
import { SignUp } from "./composants/SignUp/SignUp.jsx";
import { Login } from "./composants/Login/Login.jsx";
import { Formulaire } from "./composants/Formulaire/Formulaire.jsx";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/inscription" element={<SignUp />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/formulaire" element={<Formulaire />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
