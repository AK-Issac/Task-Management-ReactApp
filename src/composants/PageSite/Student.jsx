import { useState, useEffect } from 'react';
import { collection, getDocs, query, limit, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../../Firebase.js';
import Student from '../../assets/Student.svg';
import Teacher from '../../assets/Teacher.svg';
import Task from '../../assets/Task.svg';
import Profile from '../../assets/Profile.svg';
import './Student.css';
import { useNavigate } from 'react-router-dom';

export function Students() {
    const [users, setUsers] = useState([]);
    const [userRole, setUserRole] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.currentUser) {
            navigate('/'); // Redirige vers la page de connexion
        } else {
            const fetchUserRole = async () => {
                try {
                    const userRef = doc(db, "users", auth.currentUser.uid);
                    const userDoc = await getDoc(userRef);

                    if (userDoc.exists()) {
                        setUserRole(userDoc.data().role);
                    } else {
                        console.error("Utilisateur non trouvé dans Firestore.");
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération du rôle : ", error);
                }
            };

            fetchUserRole();
        }
    }, [navigate]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, limit(50));
            const querySnapshot = await getDocs(q);

            const userList = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(user => user.role === 'Community'); // Filtrer les utilisateurs "Community"

            setUsers(userList);
        } catch (error) {
            console.error("Erreur de récupération des utilisateurs : ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(); // Récupération initiale des utilisateurs
    }, []);

    return (
        <div className="App">
            <div className="Header_Home">
                <div className="Students">
                    <button className="btn_Students" type="button" onClick={() => navigate('/Student')}>
                        <img className="img_Students" src={Student} alt="Students" />
                        <p className="text_Students">Students</p>
                    </button>
                </div>
                <div className="Tasks">
                    <button className="btn_Tasks" type="button" onClick={() => navigate('/Tasks')}>
                        <img className="img_Tasks" src={Task} alt="Tasks" />
                        <p className="text_Tasks">Tasks</p>
                    </button>
                </div>
                <div className="Teachers">
                    <button className="btn_Teachers" type="button" onClick={() => navigate('/Teachers')}>
                        <img className="img_Teachers" src={Teacher} alt="Teachers" />
                        <p className="text_Teachers">Teachers</p>
                    </button>
                </div>
                <div className="Profile">
                    <button className="btn_Profile" type="button" onClick={() => navigate('/Profile')}>
                        <img className="img_Profile" src={Profile} alt="Profile" />
                        <p className="text_Profile">Profile</p>
                    </button>
                </div>
            </div>

            <div className="Home_Information">
                <h1>Liste des Utilisateurs "Community"</h1>
                {loading ? (
                    <p>Chargement...</p>
                ) : (
                    <div className="User_Table">
                        {/* Titres des colonnes */}
                        <div className="User_Row titles">
                            <div className="titles">Nom</div>
                            <div className="titles">Prénom</div>
                            <div className="titles">Rôle</div>
                            <div className="titles">Sexe</div>
                            <div className="titles">Email</div>
                        </div>

                        {/* Contenu des colonnes (une ligne par utilisateur) */}
                        {users.length > 0 ? (
                            users.map(user => (
                                <div className="User_Row" key={user.id}>
                                    <div className="info">{user.nom}</div>
                                    <div className="info">{user.prenom}</div>
                                    <div className="info">{user.role}</div>
                                    <div className="info">{user.genre}</div>
                                    <div className="info">{user.email}</div>
                                </div>
                            ))
                        ) : (
                            <p>Aucun utilisateur trouvé.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
