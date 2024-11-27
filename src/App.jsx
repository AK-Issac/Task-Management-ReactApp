<<<<<<< HEAD
=======
import Connexion from './composants/Connexion/Connexion.jsx'
import Success from './composants/Connexion/Success.jsx'
import Formulaire from './composants/Formulaire/Formulaire.jsx'
>>>>>>> f04d1f24b549bc0317944bfd31b5a99d7bf63382
import {Route, BrowserRouter, Routes} from "react-router-dom";
import {Login} from "./composants/Login/Login";

function App() {
  return (
      <BrowserRouter>
<<<<<<< HEAD
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
=======
        <Routes>
          <Route path="/" element={<Connexion />} />
          <Route path="/success" element={<Success />} />
          <Route path="/formulaire" element={<Formulaire />} />
        </Routes>
>>>>>>> f04d1f24b549bc0317944bfd31b5a99d7bf63382
      </BrowserRouter>
  );
}

export default App;
