import './Login.css';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../../../Firebase"
import { doc, getDoc } from "firebase/firestore";

export function Login() {
    const [role, setRole] = useState("Community"); // Rôle par défaut
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [captchaVerified, setCaptchaVerified] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page

        // Validation basique pour l'exemple
        if (!email || !password) {
            setErrorMessage("Veuillez remplir tous les champs.");
        } else {
            setErrorMessage(""); // Réinitialise le message d'erreur
            console.log("Connexion avec :", { email, password });
            // Ajouter ici la logique de connexion (API, Firebase, etc.)
        }

        if (!captchaVerified) {
            setErrorMessage('Veuillez compléter le CAPTCHA');
            return;
        }    

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Récupération du document utilisateur depuis Firestore
            const userDocRef = doc(db, "users", user.uid); // Référence au document
            const userDoc = await getDoc(userDocRef); 
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const userRole = userData.role;
    
                if (role === userRole) {
                    alert("Compte connecté avec succès! Bienvenue!");
                    navigate('/home');
                } else {
                    throw new Error("Rôle utilisateur non reconnu");
                }
            } else {
                throw new Error("Utilisateur introuvable dans Firestore");
            }
        } catch (err) {
            setErrorMessage('Erreur de connexion. Vérifiez vos informations.');
            console.error(err);
            alert(`Erreur durant la connexion de votre compte: ${err.message}`);
        }
    };

    const handleCaptchaChange = (value) => setCaptchaVerified(value !== null);

    const handleChangeRole = (newRole) => {
        setRole(newRole); // Change le rôle selon le bouton cliqué
    };

    return (
        <div className='Login_App'>
            <div className='Element_Right'>
                <div className='Header_Login'>
                    <div className='Element_Header_Login'>
                        <div className='Element_Header_Login_Precis'>
                            <h1 className='Titre_Header'>
                                Gestion
                                <div className='Border_Header'></div>
                            </h1>
                            <div className='Subtitle_Header'>
                                <p className='Subtitle_Title_Header'>
                                    Gestionnaire de tâche
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='Container_Login'>
                    <div className='Box_login'>
                        <div className='Section_Login'>
                            <div className='Btn_Role_Login'>
                                <button
                                    className={`role-button ${role === "Admin" ? "active" : ""}`}
                                    id="role-admin"
                                    onClick={() => handleChangeRole("Admin")}
                                >
                                    Admin
                                </button>
                                <button
                                    className={`role-button ${role === "Community" ? "active" : ""}`}
                                    id="role-community"
                                    onClick={() => handleChangeRole("Community")}
                                >
                                    Community
                                </button>
                            </div>
                            <form className="Section_Form" onSubmit={handleSubmit}>
                                <div className="Form_group">
                                    <label htmlFor="email">Adresse Courriel</label>
                                    <input
                                        className="form_input"
                                        type="email"
                                        name="email"
                                        id="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)} // Met à jour l'état
                                    />
                                </div>
                                <div className="Form_group">
                                    <label htmlFor="password">Mot de passe</label>
                                    <input
                                        className="form_input"
                                        type="password"
                                        name="password"
                                        id="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)} // Met à jour l'état
                                    />
                                </div>
                                <ReCAPTCHA sitekey="6Lev-ngqAAAAAOel5-0v-SIaJQR8h6UhGFd1PDrP" onChange={handleCaptchaChange} />
                                <br/>
                                <button type="submit" className="btn_submit_Login">Connexion</button>

                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                            </form>

                            <p className='Direction_SignUp'>Première utilisation?<Link to="/inscription"> Cliquez-ici </Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
