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
    const [lastVisible, setLastVisible] = useState(null); // Pagination
    const [userRole, setUserRole] = useState(''); // Rôle de l'utilisateur connecté
    const [loading, setLoading] = useState(true); // État de chargement
    const navigate = useNavigate();

    // Vérification de l'authentification
    useEffect(() => {
        if (!auth.currentUser) {
            navigate('/'); // Redirection si l'utilisateur n'est pas connecté
        } else {
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

    // Fonction pour récupérer les enseignants
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, orderBy("name"), limit(50)); // Trier par nom
            const querySnapshot = await getDocs(q);

            const userList = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(user => user.role === 'Teacher'); // Filtrer par rôle "Teacher"

            console.log("Enseignants récupérés :", userList);
            setUsers(userList);

            const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
            setLastVisible(lastVisibleDoc);
        } catch (error) {
            console.error("Erreur lors de la récupération des enseignants :", error);
        } finally {
            setLoading(false);
        }
    };

    // Charger plus d'enseignants (pagination)
    const loadMoreUsers = async () => {
        if (!lastVisible) return; // Vérification
        setLoading(true);
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, orderBy("name"), startAfter(lastVisible), limit(50));
            const querySnapshot = await getDocs(q);

            const userList = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(user => user.role === 'Teacher');

            setUsers(prevUsers => [...prevUsers, ...userList]);

            const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
            setLastVisible(lastVisibleDoc);
        } catch (error) {
            console.error("Erreur lors du chargement des enseignants :", error);
        } finally {
            setLoading(false);
        }
    };

    // Navigation entre les pages
    const handleViewStudents = () => navigate('/Student');
    const handleViewTasks = () => navigate('/Tasks');
    const handleViewTeachers = () => navigate('/Teachers');
    const handleViewProfile = () => navigate('/Profile');

    // Chargement initial
    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="App">
            <div className='Recherche'>
                <input className='RechercheInput' type='text' placeholder='Search' />
            </div>
            <div className='Header_Home'>
                <div className='Students'>
                    <button className='btn_Students' onClick={handleViewStudents}>
                        <img className='img_Students' src={Student} alt='Students' />
                        <p className='text_Students'>Students</p>
                    </button>
                </div>
                <div className='Tasks'>
                    <button className='btn_Tasks' onClick={handleViewTasks}>
                        <img className='img_Tasks' src={Task} alt='Tasks' />
                        <p className='text_Tasks'>Tasks</p>
                    </button>
                </div>
                <div className='Teachers'>
                    <button className='btn_Teachers' onClick={handleViewTeachers}>
                        <img className='img_Teachers' src={Teacher} alt='Teachers' />
                        <p className='text_Teachers'>Teachers</p>
                    </button>
                </div>
                <div className='Profile'>
                    <button className='btn_Profile' onClick={handleViewProfile}>
                        <img className='img_Profile' src={Profile} alt='Profile' />
                        <p className='text_Profile'>Profile</p>
                    </button>
                </div>
            </div>

            <div className='Home_Information'>
                <h1>Enseignants</h1>
                <div className='User_List'>
                    {users.length > 0 ? (
                        users.map(user => (
                            <div key={user.id} className="User_Box">
                                <h3>{user.name}</h3>
                                <p>Rôle: {user.role}</p>
                            </div>
                        ))
                    ) : (
                        <p>Aucun enseignant trouvé.</p>
                    )}
                </div>

                {/* Pagination */}
                <div className='Pagination'>
                    {loading ? (
                        <p>Chargement...</p>
                    ) : (
                        lastVisible && (
                            <button className="Load_More" onClick={loadMoreUsers}>
                                Charger plus d'enseignants
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
