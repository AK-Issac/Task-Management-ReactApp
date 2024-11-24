import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Formulaire } from './composants/Formulaire/Formulaire.jsx';
import { Profile } from "./composants/Profile/Profile.jsx"
import { Connexion } from "./composants/Connexion/Connexion.jsx"

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Connexion />} />
          <Route path="/formulaire" element={<Formulaire />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/connexion" element={<Connexion />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;