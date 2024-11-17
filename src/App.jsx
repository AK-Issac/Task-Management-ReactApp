import Connexion from './composants/Connexion/Connexion.jsx'
import Success from './composants/Connexion/Success.jsx'
import {Route, BrowserRouter, Routes} from "react-router-dom";


function App() {
  return (
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Connexion />} />
        <Route path="/success" element={<Success />} />
      </Routes>
      </BrowserRouter>
  );
}

export default App;