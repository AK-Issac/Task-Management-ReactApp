import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Formulaire } from './composants/Formulaire/Formulaire.jsx';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Formulaire />} />
          <Route path="/formulaire" element={<Formulaire />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;