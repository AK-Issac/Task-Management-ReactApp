import { Route, BrowserRouter, Routes } from "react-router-dom";
import { SignUp } from "./composants/SignUp/SignUp.jsx";
import { Login } from "./composants/Login/Login.jsx";
import { Formulaire } from "./composants/Formulaire/Formulaire.jsx";
import { Tasks } from "./composants/PageSite/Task.jsx";
import { Home } from "./composants/PageSite/Home.jsx";

function App() {
  return (
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/inscription" element={<SignUp />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/formulaire" element={<Formulaire />} />
            <Route path="/tasks" element={<Tasks />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;