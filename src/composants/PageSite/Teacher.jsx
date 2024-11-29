import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, startAfter, limit, getDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../../Firebase.js'; // Votre fichier de configuration Firebase
import Student from '../../assets/Student.svg';
import Teacher from '../../assets/Teacher.svg';
import Task from '../../assets/Task.svg';
import Profile from '../../assets/Profile.svg';
import './Student.css';
import { useNavigate } from 'react-router-dom'; // Pour la navigation

export function Teachers() {
    const [users, setUsers] = useState([]);
    const [lastVisible, setLastVisible] = useState(null); // Pour la pagination
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

    // Fonction pour récupérer les utilisateurs avec le rôle "Teacher" et pagination
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const usersRef = collection(db, "users");
            // Filtrer les utilisateurs ayant le rôle "Teacher" (admin)
            const q = query(usersRef, orderBy("name"), limit(50)); // Limite à 50 utilisateurs par page
            const querySnapshot = await getDocs(q);

            // Filtrer par rôle "Teacher" (admin)
            const userList = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(user => user.role === 'Teacher'); // Filtrage des utilisateurs "Teacher"

            console.log("Utilisateurs récupérés: ", userList); // Pour vérifier les données récupérées

            setUsers(userList);

            // Mémoriser le dernier document pour la pagination
            const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
            setLastVisible(lastVisibleDoc);
        } catch (error) {
            console.error("Erreur de récupération des utilisateurs: ", error);
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour charger plus d'utilisateurs "Teacher"
    const loadMoreUsers = async () => {
        if (!lastVisible) return; // Si aucun document n'est disponible pour la pagination

        setLoading(true);
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, orderBy("name"), startAfter(lastVisible), limit(50));
            const querySnapshot = await getDocs(q);

            // Filtrer par rôle "Teacher" (admin)
            const userList = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(user => user.role === 'Teacher'); // Filtrage des utilisateurs "Teacher"

            setUsers(prevUsers => [...prevUsers, ...userList]);

            // Mettre à jour le dernier document visible
            const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
            setLastVisible(lastVisibleDoc);
        } catch (error) {
            console.error("Erreur lors du chargement de plus d'utilisateurs: ", error);
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
                <h1>Utilisateurs "Teacher" (Admins)</h1>
                <div className='User_List'>
                    {users.length > 0 ? (
                        users.map(user => (
                            <div key={user.id} className="User_Box">
                                <h3>{user.name}</h3>
                                <p>{user.role}</p>
                            </div>
                        ))
                    ) : (
                        <p>Aucun utilisateur trouvé.</p>
                    )}
                </div>

                {/* Bouton pour charger plus d'utilisateurs */}
                <div className='Pagination'>
                    {loading ? (
                        <p>Chargement...</p>
                    ) : (
                        <button className="Load_More" onClick={loadMoreUsers}>
                            Charger plus d'utilisateurs
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
