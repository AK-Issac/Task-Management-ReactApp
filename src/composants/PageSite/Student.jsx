import { useState, useEffect } from 'react';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db, auth } from '../../../Firebase.js'; // Votre fichier de configuration Firebase
import Student from '../../assets/Student.svg';
import Teacher from '../../assets/Teacher.svg';
import Task from '../../assets/Task.svg';
import Profile from '../../assets/Profile.svg';
import './Student.css';
import { useNavigate } from 'react-router-dom'; // Pour la navigation

export function Students() {
    const [users, setUsers] = useState([]);
    const [userRole, setUserRole] = useState(''); // Rôle de l'utilisateur connecté
    const [loading, setLoading] = useState(true); // État de chargement
    const navigate = useNavigate();

    // Vérification de l'authentification de l'utilisateur
    useEffect(() => {
        if (!auth.currentUser) {
            navigate('/'); // Redirige vers la page de login si l'utilisateur n'est pas authentifié
        } else {
            // Vérification du rôle de l'utilisateur connecté
            const fetchUserRole = async () => {
                const userRef = doc(db, "users", auth.currentUser.uid);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    setUserRole(userDoc.data().role);
                }
            };
            fetchUserRole();
        }
    }, [navigate]);

    // Fonction pour récupérer les utilisateurs avec le rôle "Community"
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const usersRef = collection(db, "users");
            // Limiter à 50 utilisateurs par page
            const q = query(usersRef, limit(50)); 
            const querySnapshot = await getDocs(q);

            // Filtrage des utilisateurs ayant le rôle "Community"
            const userList = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(user => {
                    console.log(user.role); // Vérifiez la valeur du rôle
                    return user.role === 'Community'; // Filtrage des utilisateurs "Community"
                });

            console.log("Utilisateurs récupérés: ", userList); // Pour vérifier les données récupérées
            setUsers(userList);

        } catch (error) {
            console.error("Erreur de récupération des utilisateurs: ", error);
        } finally {
            setLoading(false);
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

    // Chargement initial des utilisateurs
    useEffect(() => {
        fetchUsers(); // Initialiser le chargement des utilisateurs
    }, []);

    return (
        <div className="App">
            <div className='Recherche'>
                <input className='RechercheInput' type='text' placeholder='Search' />
            </div>
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
                    <button className='btn_Profile' type='button' onClick={handleViewProfile}>
                        <img className='img_Profile' src={Profile} alt='Profile' />
                        <p className='text_Profile'>Profile</p>
                    </button>
                </div>
            </div>

            <div className='Home_Information'>
                <h1>Utilisateurs "Community"</h1>
                <div className='User_List'>
                    {users.length > 0 ? (
                        users.map(user => (
                            <div key={user.id} className="User_Box">
                                <h3>{user.firstName} {user.lastName}</h3> {/* Affiche le prénom et le nom */}
                                <p>Rôle: {user.role}</p>
                                <p>Sexe: {user.gender}</p> {/* Affiche le sexe de l'utilisateur */}
                            </div>
                        ))
                    ) : (
                        <p>Aucun utilisateur trouvé.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
