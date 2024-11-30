import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut, deleteUser, updateProfile, updatePassword } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Cookies from 'js-cookie';
import './Profile.css';
import Student from '../../assets/Student.svg';
import Teacher from '../../assets/Teacher.svg';
import Task from '../../assets/Task.svg';
import Profilez from '../../assets/Profile.svg'; // Assuming you have this image

const auth = getAuth();
const storage = getStorage();

export function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [image, setImage] = useState(null);
    const [showProfileForm, setShowProfileForm] = useState(false);
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [userRole, setUserRole] = useState('');
    
    useEffect(() => {
        const savedUsername = Cookies.get("username");
        if (savedUsername) {
            setUser({ displayName: savedUsername });
        }

        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setUsername(currentUser.displayName || "");
                // Fetch the user's role and store it for search functionality
                const userRef = doc(db, "users", currentUser.uid);
                getDoc(userRef).then((doc) => {
                    if (doc.exists()) {
                        setUserRole(doc.data().role);  // Set the role to be used in search
                    }
                });
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                setUser(null);
                setMessage("User logged out successfully!");
                Cookies.remove("userEmail");
                Cookies.remove("username");
                navigate("/");
            })
            .catch((err) => {
                console.log(`Error logging out: ${err.message}`);
            });
    };

    const handleSearch = async (term) => {
        setSearchTerm(term);

        if (term.trim() === "") {
            setSearchResults([]);
            return;
        }

        const roleToSearch = userRole === "Admin" ? "student" : "teacher";
        const q = query(
            collection(db, "users"),
            where("role", "==", roleToSearch),
            where("name", ">=", term),
            where("name", "<=", term + '\uf8ff')
        );
        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSearchResults(results);
    };

    const fileUpload = async (selectedImage) => {
        if (!selectedImage) {
            alert("No file selected!");
            return null;
        }

        const storageRef = ref(storage, `profile_pictures/${user.uid}/${selectedImage.name}`);
        const metadata = { contentType: selectedImage.type };

        try {
            await uploadBytes(storageRef, selectedImage, metadata);
            const url = await getDownloadURL(storageRef);
            return url;
        } catch (err) {
            console.log(err);
            setMessage(`Error uploading file: ${err.message}`);
            return null;
        }
    };

    const handleUpdateUser = async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            const updatedProfile = {};

            if (username !== currentUser.displayName) {
                updatedProfile.displayName = username;
            }

            if (image) {
                const newPhotoURL = await fileUpload(image);
                if (newPhotoURL) {
                    updatedProfile.photoURL = newPhotoURL;
                }
            }

            if (password && newPassword === confirmPassword) {
                updatePassword(currentUser, newPassword).catch((error) => {
                    setMessage(`Error updating password: ${error.message}`);
                });
            }

            updateProfile(currentUser, updatedProfile)
                .then(() => {
                    setUser((prevUser) => ({
                        ...prevUser,
                        displayName: updatedProfile.displayName || prevUser.displayName,
                        photoURL: updatedProfile.photoURL || prevUser.photoURL
                    }));
                    setMessage("Profile updated successfully!");
                    Cookies.set("username", updatedProfile.displayName || username, { expires: 7 });
                })
                .catch((err) => {
                    setMessage(`Error updating profile: ${err.message}`);
                });
        } else {
            setMessage("No user is currently logged in.");
        }
    };

    // Fonctions de navigation
    const handleViewStudents = () => {
        navigate('/Student'); // Redirige vers la page des étudiants
    };

    const handleViewTasks = () => {
        navigate('/Tasks'); // Redirige vers la page des tâches
    };

    const handleViewTeachers = () => {
        navigate('/Teachers'); // Redirige vers la page des enseignants
    };

    const handleViewProfile = () => {
        navigate('/Profile'); // Redirige vers la page du profil
    };

    return (
        <div className="App">
            

            <div className='Header_Home'>
                <div className='Students'>
                    <button className='btn_Students' type='button' onClick={handleViewStudents}>
                        <img className='img_Students' src={Student} alt='Students' />
                        <p className='text_Students'>Students</p>
                    </button>
                </div>
                <div className='Tasks'>
                    <button className='btn_Tasks' type='button' onClick={handleViewTasks}>
                        <img className='img_Tasks' src={Task} alt='Tasks' />
                        <p className='text_Tasks'>Tasks</p>
                    </button>
                </div>
                <div className='Teachers'>
                    <button className='btn_Teachers' type='button' onClick={handleViewTeachers}>
                        <img className='img_Teachers' src={Teacher} alt='Teachers' />
                        <p className='text_Teachers'>Teachers</p>
                    </button>
                </div>
                <div className='Profile'>
                    <button className='btn_Profile' type='button' onClick={() => navigate('/Profile')}>
                        <img className='img_Profile' src={Profilez} alt='Profile' />
                        <p className='text_Profile'>Profile</p>
                    </button>
                </div>
            </div>

            <div className="Profile-container">
                {user && !showProfileForm ? (
                    <div className="Profile-box has-text-centered">
                        <p className="subtitle">Vous êtes maintenant connecté. Profitez de l'application !</p>
                        {message && <div className="notification is-info">{message}</div>}
                        <h1 className="title">{user.displayName || "Utilisateur"}&#39;s Account</h1>
                        <figure className="image">
                            <img
                                src={user.photoURL || "/Default_pfp.svg"}
                                alt="Profile Picture"
                                className="is-rounded"
                            />
                        </figure>
                        <button className="button is-warning" onClick={handleLogout}>
                            Déconnexion
                        </button>
                        <button className="button is-danger" onClick={() => handleDeleteAccount()}>
                            Supprimer le compte
                        </button>
                        <button className="button is-info" onClick={() => setShowProfileForm(true)}>
                            Modifier le profil
                        </button>
                    </div>
                ) : user ? (
                    <div className="Profile-box">
                        <h2 className="subtitle">Modifiez votre profil ici !</h2>
                        {message && <div className="notification is-info">{message}</div>}
                        <div className="field">
                            <label className="label">Nom d'utilisateur</label>
                            <input
                                className="input"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="field">
                            <label className="label">Image de profil</label>
                            <input
                                className="input"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </div>
                        <div className="field">
                            <label className="label">Mot de passe actuel</label>
                            <input
                                className="input"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="field">
                            <label className="label">Nouveau mot de passe</label>
                            <input
                                className="input"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="field">
                            <label className="label">Confirmer le mot de passe</label>
                            <input
                                className="input"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <div className="buttons">
                            <button className="button is-success" onClick={handleUpdateUser}>Enregistrer</button>
                            <button className="button is-danger" onClick={() => setShowProfileForm(false)}>Annuler</button>
                        </div>
                    </div>
                ) : (
                    <div className="Profile-box">
                        <p className="subtitle">Veuillez vous connecter.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
