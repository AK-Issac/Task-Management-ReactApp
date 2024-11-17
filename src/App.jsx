import Connexion from './composants/Connexion/Connexion.jsx'
import Success from './composants/Connexion/Success.jsx'
import {Route, Routes} from "react-router-dom";


function App() {
  return (
      <Routes>
        <Route path="/" element={<Connexion />} />
        <Route path="/success" element={<Success />} />
      </Routes>
  );
}

export default App;
