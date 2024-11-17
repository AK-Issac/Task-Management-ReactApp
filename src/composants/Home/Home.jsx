import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
    const navigate = useNavigate();

    const handleBtnConnexion = () => {
        navigate("/connexion");
    };

    const handleBtnInscription = () => {
        navigate("/register");
    };

    return (
        <div className="home-container">
            <h1 className="home-title">
                <b>Examen Mi-Session</b>
            </h1>
            <div className="button-card">
                <div className="button-container">
                    <button className="btnConnexion" onClick={handleBtnConnexion}>
                        Connexion
                    </button>
                    <button className="btnRegister" onClick={handleBtnInscription}>
                        Inscription
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;
