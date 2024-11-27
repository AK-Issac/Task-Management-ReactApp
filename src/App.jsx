import { Route, BrowserRouter, Routes } from "react-router-dom";
import { SignUp } from "./composants/SignUp/SignUp.jsx";
import { Login } from "./composants/Login/Login.jsx";
import { Formulaire } from "./composants/Formulaire/Formulaire.jsx";
<<<<<<< HEAD
import { Tasks } from "./composants/PageSite/Task.jsx";
=======
>>>>>>> 12a8f9593e85c1bae36d02da56b6c666396dc10c
import { Home } from "./composants/PageSite/Home.jsx";

function App() {
  return (
      <BrowserRouter>
        <Routes>
<<<<<<< HEAD
            <Route path="/" element={<Login />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/inscription" element={<SignUp />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/formulaire" element={<Formulaire />} />
            <Route path="/tasks" element={<Tasks />} />
=======
          <Route path="/" element={<SignUp />} />
          <Route path="/inscription" element={<SignUp />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/formulaire" element={<Formulaire />} />
          <Route path="/home" element={<Home />} />
>>>>>>> 12a8f9593e85c1bae36d02da56b6c666396dc10c
        </Routes>
      </BrowserRouter>
  );
}

export default App;