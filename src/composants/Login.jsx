// src/pages/Connexion.jsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../../Firebase';
import { Link } from 'react-router-dom';
import HumanVerification from '../Recaptcha';  // Adjust the path if needed
import "./Login.css";

const Connexion = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isHuman, setIsHuman] = useState(false);
    const [resetPasswordMode, setResetPasswordMode] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        if (!isHuman) {
            setError("Veuillez vérifier que vous êtes humain.");
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then(() => (window.location.href = "/dashboard"))
            .catch(() => setError('Identifiants incorrects'));
    };

    const handleSocialLogin = (provider) => {
        if (!isHuman) {
            setError("Veuillez vérifier que vous êtes humain.");
            return;
        }

        signInWithPopup(auth, provider)
            .then(() => (window.location.href = "/dashboard"))
            .catch(() => setError('Connexion échouée.'));
    };

    const handleResetPassword = () => {
        if (!email) {
            setError('Entrez votre email pour réinitialiser.');
            return;
        }
        sendPasswordResetEmail(auth, email)
            .then(() => alert('Un email de réinitialisation a été envoyé.'))
            .catch(() => setError("Erreur d'envoi d'email."));
    };

    const handleHumanVerification = (status) => {
        setIsHuman(status);
        setError('');  // Clear any existing errors once verified
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 id="title">Se Connecter</h2>
                <form onSubmit={handleLogin}>
                    <label id="labels">Email</label>
                    <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    {!resetPasswordMode && (
                        <>
                            <label id="labels">Mot de passe</label>
                            <input
                                className="input"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {error && <p className="error-text">{error}</p>}
                            <button className="button" id="btnConnexion">Se connecter</button>
                            <p>
                                <button type="button" onClick={() => setResetPasswordMode(true)}>Mot de passe oublié ?</button>
                            </p>
                        </>
                    )}
                    {resetPasswordMode && (
                        <>
                            <button type="button" className="button" onClick={handleResetPassword}>
                                Envoyer un email de réinitialisation
                            </button>
                            <button type="button" onClick={() => setResetPasswordMode(false)}>Annuler</button>
                        </>
                    )}
                </form>

                {/* Human Verification Component */}
                <HumanVerification onVerify={handleHumanVerification} />

                <p id="labels">Pas encore inscrit? <Link to="/register">S'inscrire ici</Link></p>
                <div className="social-login">
                    <button className="social-button google-button" onClick={() => handleSocialLogin(googleProvider)}>Google</button>
                    <button className="social-button facebook-button" onClick={() => handleSocialLogin(facebookProvider)}>Facebook</button>
                </div>
            </div>
        </div>
    );
};

export default Connexion;
