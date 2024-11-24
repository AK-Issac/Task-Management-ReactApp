import { useEffect, useState } from 'react';
import { getAuth, signOut, deleteUser, updateProfile, updatePassword } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import './Profile.css';

const auth = getAuth();
const storage = getStorage();

export function Profile() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [photoURL, setPhotoURL] = useState(null);
    const [message, setMessage] = useState("");
    const [image, setImage] = useState(null);
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setUsername(currentUser.displayName || "");
                setPhotoURL(currentUser.photoURL || "default-avatar.png"); // URL par défaut si pas de photo
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        signOut(auth).then(() => {
            setUser(null);
            Cookies.remove("username");
            navigate("/connexion");
        }).catch((err) => console.log(`Error logging out: ${err.message}`));
    };

    const handleDeleteAccount = () => {
        if (user && window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            deleteUser(auth.currentUser)
                .then(() => {
                    setUser(null);
                    Cookies.remove("username");
                    navigate("/connexion");
                })
                .catch((err) => setMessage(`Error: ${err.message}`));
        }
    };

    const fileUpload = async (selectedImage) => {
        if (!selectedImage) return null;
        const storageRef = ref(storage, `profile_pictures/${user.uid}/${selectedImage.name}`);
        try {
            await uploadBytes(storageRef, selectedImage);
            const url = await getDownloadURL(storageRef);
            return url;
        } catch (err) {
            setMessage(`Error uploading file: ${err.message}`);
            return null;
        }
    };

    const handleUpdateUser = async () => {
        if (!user) return setMessage("No user is currently logged in.");

        const updatedProfile = {};
        if (username !== user.displayName) updatedProfile.displayName = username;

        if (image) {
            const newPhotoURL = await fileUpload(image);
            if (newPhotoURL) {
                updatedProfile.photoURL = newPhotoURL;
                setPhotoURL(newPhotoURL); // Mettre à jour l'URL de l'image
            }
        }

        if (password && newPassword === confirmPassword) {
            await updatePassword(user, newPassword).catch(err => setMessage(`Error updating password: ${err.message}`));
        }

        updateProfile(user, updatedProfile)
            .then(() => {
                setUser(prev => ({ ...prev, displayName: username }));
                Cookies.set("username", username, { expires: 7 });
                setMessage("Profile updated successfully!");
            })
            .catch(err => setMessage(`Error updating profile: ${err.message}`));
    };

    return (
        <div className="profile-container">
            <div className="profile-box">
                <h2>Votre Profil</h2>
                <p>{message}</p>
                {photoURL && <img src={photoURL} alt="Profile" className="profile-photo" />}
                <div className="profile-form">
                    <label>Nom dutilisateur</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

                    <label>Photo de profil</label>
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} />

                    <label>Votre mot de passse actuel</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                    <label>Votre nouveau mot de passe</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

                    <label>Confirmation du nouveau mot de passe</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                    <button onClick={handleUpdateUser}>Mettre à jour le profil</button>
                    <button onClick={handleLogout}>Deconnexion</button>
                    <button onClick={handleDeleteAccount} className="delete-account">Supprimer le compte</button>
                    <button onClick={() => navigate('/chat')} className="back-button">Retourner au Chat</button>
                </div>
            </div>
        </div>
    );
}