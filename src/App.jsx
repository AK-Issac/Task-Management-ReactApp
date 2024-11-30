import { Route, BrowserRouter, Routes } from "react-router-dom";
import { SignUp } from "./composants/SignUp/SignUp.jsx";
import { Login } from "./composants/Login/Login.jsx";
import { Formulaire } from "./composants/Formulaire/Formulaire.jsx";
import { Tasks } from "./composants/PageSite/Task.jsx";
import { Home } from "./composants/PageSite/Home.jsx";
import { Students } from "./composants/PageSite/Student.jsx";
import { Profile } from "./composants/PageSite/Profile.jsx";
import { Teachers } from "./composants/PageSite/Teacher.jsx";

function App() {
  return (
      <BrowserRouter>
        <Routes>

            <Route path="/" element={<Login />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/inscription" element={<SignUp />} />
            <Route path="/formulaire" element={<Formulaire />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/Student" element={<Students />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/Teachers" element={<Teachers />} />

        </Routes>
      </BrowserRouter>
  );
}

export default App;