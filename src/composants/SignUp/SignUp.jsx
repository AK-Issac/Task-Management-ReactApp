import './SignUp.css';
import { useState } from "react";
import {Link} from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

export function SignUp() {
    const [role, setRole] = useState("Community"); // Rôle par défaut
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [birthName, setBirthName] = useState("");
    const [dateNaissance, setDateNaissance] = useState("");
    const [gender, setGender] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    //const [photo, setPhoto] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [captchaVerified, setCaptchaVerified] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault(); // Empêche le rechargement de la page

        // Validation basique pour l'exemple
        if (!email || !password) {
            setErrorMessage("Veuillez remplir tous les champs.");
        } else {
            setErrorMessage(""); // Réinitialise le message d'erreur
            console.log("Connexion avec :", { email, password });
            // Ajouter ici la logique de connexion (API, Firebase, etc.)
        }
    };

    const handleCaptchaChange = (value) => setCaptchaVerified(value !== null);

    const handleChangeRole = (newRole) => {
        setRole(newRole); // Change le rôle selon le bouton cliqué
    };

    return (
        <div className='SignUp_App'>
            <div className='Element_Right'>
                <div className='Header_SignUp'>
                    <div className='Element_Header_SignUp'>
                        <div className='Element_Header_SignUp_Precis'>
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
                <div className='Container_SignUp'>
                    <div className='Box_SignUp'>
                        <div className='Section_SignUp'>
                            <div className='Btn_Role_SignUp'>
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
                                    <label htmlFor="name">Prénom</label>
                                    <input
                                        className="form_input"
                                        type="name"
                                        name="name"
                                        id="name"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)} // Met à jour l'état
                                    />
                                </div>
                                <div className="Form_group">
                                    <label htmlFor="birthName">Nom</label>
                                    <input
                                        className="form_input"
                                        type="text"
                                        name="birthName"
                                        id="birthName"
                                        required
                                        value={birthName}
                                        onChange={(e) => setBirthName(e.target.value)} // Mise à jour de l'état
                                    />
                                </div>
                                <div className="Form_group">
                                    <label htmlFor="dateNaissance">Date de naissance</label>
                                    <input
                                        className="form_input"
                                        type="date"
                                        name="dateNaissance"
                                        id="dateNaissance"
                                        required
                                        value={dateNaissance}
                                        onChange={(e) => setDateNaissance(e.target.value)} // Mise à jour de l'état
                                    />
                                </div>
                                <div className="Form_group">
                                    <label htmlFor="gender">Genre</label>
                                    <select
                                        className="form_input"
                                        name="gender"
                                        id="gender"
                                        required
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)} // Mise à jour de l'état
                                    >
                                        <option value="">Sélectionner un genre</option>
                                        <option value="Homme">Homme</option>
                                        <option value="Femme">Femme</option>
                                        <option value="Autre">Autre</option>
                                    </select>
                                </div>
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
                                <div className="Form_group">
                                    <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                                    <input
                                        className="form_input"
                                        type="password"
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)} // Mise à jour de l'état
                                    />
                                </div>

                                <ReCAPTCHA sitekey="6Lev-ngqAAAAAOel5-0v-SIaJQR8h6UhGFd1PDrP"
                                           onChange={handleCaptchaChange}/>
                                <br/>
                                <button type="submit" className="btn_submit_SignUp">Inscription</button>

                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                            </form>

                            <p className='Direction_SignUp'>Vous avez deja un compte?<Link> Cliquez-ici </Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}