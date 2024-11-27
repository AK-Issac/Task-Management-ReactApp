import { useState, useEffect } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from '../../../Firebase.js'; // Votre fichier de configuration Firebase
import Student from '../../assets/Student.svg';
import Teacher from '../../assets/Teacher.svg';
import Task from '../../assets/Task.svg';
import Profile from '../../assets/Profile.svg';
import './Home.css';
import { useNavigate } from 'react-router-dom'; // Pour la navigation

export function Home() {
    const [userRole, setUserRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Vérification du rôle de l'utilisateur connecté
        const fetchUserRole = async () => {
            if (auth.currentUser) {
                const userRef = doc(db, "users", auth.currentUser.uid);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    setUserRole(userDoc.data().role);
                }
            }
        };
        fetchUserRole();
    }, []);

    // Navigation vers la page des tâches de l'utilisateur (Community)
    const handleViewTasks = () => {
        navigate('/tasks'); // Assurez-vous que la route "/tasks" est définie
    };

    return (
        <div className="App">
            <div className='Recherche'>
                <input className='RechercheInput' type='text' placeholder='Search' />
            </div>
            <div className='Header_Home'>
                <div className='Students'>
                    <button className='btn_Students' type='button'>
                        <img className='img_Students' src={Student} alt='Students' />
                        <p className='text_Students'>Students</p>
                    </button>
                </div>
                <div className='Tasks'>
                    <button className='btn_Tasks' type='button'>
                        <img className='img_Tasks' src={Task} alt='Tasks' />
                        <p className='text_Tasks'>Tasks</p>
                    </button>
                </div>
                <div className='Teachers'>
                    <button className='btn_Teachers' type='button'>
                        <img className='img_Teachers' src={Teacher} alt='Teachers' />
                        <p className='text_Teachers'>Teachers</p>
                    </button>
                </div>
                <div className='Profile'>
                    <button className='btn_Profile' type='button'>
                        <img className='img_Profile' src={Profile} alt='Profile' />
                        <p className='text_Profile'>Profile</p>
                    </button>
                </div>
            </div>
            <div className='Home_Information'>
                {userRole === 'admin' ? (
                    <>
                        <h1>Ajoutez un élève ou une tâche pour profiter pleinement de notre site !</h1>
                        <div className='btn_Home'>
                            <button className='add-student' type='button'>Ajouter un nouvel élève</button>
                            <button className='add-task' type='button'>Ajouter une nouvelle tâche</button>
                        </div>
                    </>
                ) : userRole === 'community' ? (
                    <>
                        <h1>Regardez vos tâches présentes</h1>
                        <div className='btn_Home'>
                            <button className='view-tasks' type='button' onClick={handleViewTasks}>Voir mes tâches</button>
                        </div>
                    </>
                ) : (
                    <h1>Chargement...</h1>
                )}
            </div>
        </div>
    );
}
