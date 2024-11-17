import Connexion from './composants/Connexion/Connexion.jsx'
import {Route, Router, Routes} from "react-router-dom";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Connexion />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
}

export default App;
