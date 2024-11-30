import './SignUp.css';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { auth, db } from '../../../Firebase';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export function SignUp() {
    const [role, setRole] = useState("Community"); // Rôle par défaut
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [birthName, setBirthName] = useState("");
    const [dateNaissance, setDateNaissance] = useState("");
    const [gender, setGender] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [captchaVerified, setCaptchaVerified] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page

        if (password !== confirmPassword) {
            setErrorMessage('Les mots de passe ne correspondent pas');
            return;
        }

        if (!captchaVerified) {
            setErrorMessage('Veuillez compléter le CAPTCHA');
            return;
        }

        // Validation basique pour l'exemple
        if (!email || !password || !name || !birthName || !dateNaissance || !gender) {
            setErrorMessage("Veuillez remplir tous les champs.");
            return;
        }

        setErrorMessage(""); // Réinitialise le message d'erreur
        console.log("Inscription avec :", { email, password, name, birthName, dateNaissance, gender });

        try {
            // Création de l'utilisateur
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Référence Firestore avec l'UID de l'utilisateur
            const userRef = doc(db, "users", user.uid); // L'UID est utilisé ici comme identifiant

            // Enregistrement des informations de l'utilisateur dans Firestore
            await setDoc(userRef, {
                prenom: name,
                nom: birthName,
                dateNaissance: dateNaissance,
                genre: gender,
                email: user.email,
                role: role,
                uid: user.uid, // Ajout de l'UID dans Firestore
            });

            alert(`Inscription réussie en tant que ${role}!`);

            navigate('/home'); // Redirection vers la page d'accueil après l'inscription
        } catch (err) {
            setErrorMessage(err.message);
            alert(`Erreur durant la création du compte: ${err.message}`);
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
                                        type="text"
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

                            <p className='Direction_SignUp'>Vous avez déjà un compte? <Link to="/">Cliquez-ici</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
