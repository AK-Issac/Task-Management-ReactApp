import React, { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth, db } from "../../../Firebase";
import { doc, setDoc } from "firebase/firestore";
import HumanVerification from '../../Recaptcha';  // Adjust path if necessary
import "./Register.css";

const Register = () => {
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isHuman, setIsHuman] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(""); // Reset error message

        if (!isHuman) {
            setError("Veuillez vérifier que vous êtes humain.");
            return;
        }

        // Check if emails match
        if (email !== confirmEmail) {
            setError("Les emails ne correspondent pas. Veuillez vérifier.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await sendEmailVerification(user);
            alert("Un email de vérification a été envoyé. Veuillez vérifier votre email avant de vous connecter.");

            const creationDate = new Date().toISOString();

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                creationDate: creationDate,
            });

            window.location.href = "/connexion";
        } catch (err) {
            setError("Erreur lors de l'inscription ou de l'envoi de l'email de vérification : " + err.message);
        }
    };

    const handleHumanVerification = (status) => {
        setIsHuman(status);
        setError('');  // Clear any existing errors once verified
    };

    return (
        <div className="auth-container">
            <h1 style={{ fontSize: '1.8rem' }}>S'inscrire</h1>
            <form onSubmit={handleRegister}>
                <div className="input-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Confirmez l'Email</label>
                    <input
                        type="email"
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Mot de passe</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {/* Human Verification Component */}
                <HumanVerification onVerify={handleHumanVerification} />

                {error && <p className="error">{error}</p>}
                <button type="submit" className="signup-button">S'inscrire</button>
            </form>
        </div>
    );
};

export default Register;
