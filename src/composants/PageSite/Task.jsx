import { useState, useEffect } from 'react';
import { doc, getDocs, getDoc, collection, query, where, updateDoc } from "firebase/firestore";
import { db, auth } from '../../../Firebase.js'; // Votre fichier de configuration Firebase
import { useNavigate } from 'react-router-dom';
import Student from '../../assets/Student.svg';
import Teacher from '../../assets/Teacher.svg';
import Task from '../../assets/Task.svg';
import Profile from '../../assets/Profile.svg';
import './Task.css';

export function Tasks() {
    const [tasks, setTasks] = useState({
        todo: [],
        inProgress: [],
        done: [],
    });
    const [users, setUsers] = useState([]); // Liste des utilisateurs pour l'ajout de tâches
    const [searchResults, setSearchResults] = useState([]); // Résultats de recherche
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(''); // Utilisateur sélectionné pour la tâche
    const [newTask, setNewTask] = useState(''); // Nouvelle tâche
    const [userRole, setUserRole] = useState(''); // Rôle de l'utilisateur connecté
    const [loading, setLoading] = useState(true); // Pour afficher un chargement pendant que les données sont récupérées

    const navigate = useNavigate();

useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
                if (currentUser) {
                    const userRef = doc(db, "users", currentUser.uid);
                    const userDoc = await getDoc(userRef);

                    if (userDoc.exists()) {
                        const role = userDoc.data().role;
                        setUserRole(role);

                        let tasksQuery;

                        // Si Admin, récupérer toutes les tâches assignées par l'utilisateur
                        if (role === "Admin") {
                            tasksQuery = query(collection(db, "taches"), where("userId", "==", currentUser.uid));
                        }
                        // Si Community, récupérer les tâches qui lui sont assignées
                        else if (role === "Community") {
                            tasksQuery = query(collection(db, "taches"), where("assignedTo", "==", currentUser.uid));
                        }

                        const tasksSnapshot = await getDocs(tasksQuery);

                        const fetchedTasks = { todo: [], inProgress: [], done: [] };
                        tasksSnapshot.docs.forEach((doc) => {
                            const task = { id: doc.id, ...doc.data() };
                            const status = task.status || "todo"; // Par défaut, mettre les tâches sans statut dans "todo"
                            if (!fetchedTasks[status]) {
                                fetchedTasks[status] = []; // S'assurer que la catégorie existe
                            }
                            fetchedTasks[status].push(task);
                        });

                        setTasks(fetchedTasks);

                        // Charger les utilisateurs pour les Admin uniquement
                        if (role === "Admin") {
                            const communityQuery = query(collection(db, "users"), where("role", "==", "Community"));
                            const communitySnapshot = await getDocs(communityQuery);
                            const fetchedUsers = communitySnapshot.docs.map((doc) => ({
                                id: doc.id,
                                ...doc.data(),
                            }));
                            setUsers(fetchedUsers);
                        }
                    }
                } else {
                    console.log("Aucun utilisateur connecté.");
                }
            });

            return () => unsubscribe();
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
}, []);

    

    // Gestion du début de glisser (drag)
    const handleDragStart = (e, taskId, status) => {
        e.dataTransfer.setData("taskId", taskId);
        e.dataTransfer.setData("currentStatus", status);
    };

    // Gestion du dépôt (drop)
    const handleDrop = async (e, newStatus) => {
        const taskId = e.dataTransfer.getData("taskId");
        const currentStatus = e.dataTransfer.getData("currentStatus");

        if (currentStatus === newStatus) return; // Pas de changement de catégorie

        // Mettre à jour la catégorie dans Firebase
        const taskRef = doc(db, "taches", taskId);
        await updateDoc(taskRef, { status: newStatus });

        // Mettre à jour l'état local
        setTasks(prevTasks => {
            const updatedTasks = { ...prevTasks };
            const taskToMove = updatedTasks[currentStatus].find(task => task.id === taskId);

            updatedTasks[currentStatus] = updatedTasks[currentStatus].filter(task => task.id !== taskId);
            updatedTasks[newStatus] = [...updatedTasks[newStatus], taskToMove];

            return updatedTasks;
        });
    };

    // Gestion du survol d'une zone de dépôt
    const handleDragOver = (e) => {
        e.preventDefault(); // Nécessaire pour autoriser le drop
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
    
        if (term.trim() === "") {
            setSearchResults([]);
            return;
        }
    
        // Concaténer toutes les tâches dans un seul tableau pour simplifier le filtrage
        const allTasks = [...tasks.todo, ...tasks.inProgress, ...tasks.done];
    
        // Filtrer les tâches selon le terme recherché
        const filteredTasks = allTasks.filter((task) => {
            const searchIn = `${task.titre || ''} ${task.description || ''} ${task.commentaires || ''}`.toLowerCase();
            return searchIn.includes(term.toLowerCase());
        });
    
        setSearchResults(filteredTasks);
    };
    

    const handleAddTask = async () => {
        navigate('/formulaire');
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

    if (loading) {
        return <div>Loading...</div>; // Affichage de "loading" tant que les données sont en cours de récupération
    }

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
                    <button className='btn_Profile' type='button' onClick={handleViewProfile}>
                        <img className='img_Profile' src={Profile} alt='Profile' />
                        <p className='text_Profile'>Profile</p>
                    </button>
                </div>
                
            </div>
            <div className='Recherche'>
    <input
        className='RechercheInput'
        type='text'
        placeholder="Rechercher une tâche (titre, description, commentaires)"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
    />
</div>

{searchResults.length > 0 && (
    <div className="Search_Results">
        {searchResults.map((task) => (
            <div key={task.id} className="Task_Card">
                <h3>{task.titre || "Titre non défini"}</h3>
                <p><strong>Description :</strong> {task.description || "Pas de description"}</p>
                <p><strong>Commentaires :</strong> {task.commentaires || "Aucun commentaire"}</p>
            </div>
        ))}
    </div>
)}

            <div className='Home_Information'>
                <h1>Vos tâches</h1>
                <div className='Task_Board'>
                    {["todo", "inProgress", "done"].map((status, index) => (
                        <div
                            key={index}
                            className='Task_Column'
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, status)}
                        >
                            <h2 className='Column_Title'>
                                {status === "todo" ? "À faire" : status === "inProgress" ? "En cours" : "Terminé"}
                            </h2>
                            <div className='Task_List'>
                                
                                {tasks[status].map((task) => (
                                    <div
                                        key={task.id}
                                        className='Task_Card'
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, task.id, status)}
                                    >
                                        <h3>{task.titre || "Titre non défini"}</h3>
                                        <p><strong>Priorité :</strong> {task.priorite || "Non défini"}</p>
                                        <p><strong>Description :</strong> {task.description || "Pas de description"}</p>
                                        <p><strong>ChatGPT response :</strong> {task.chatgptResponse || "pas de GPT"}</p>
                                        <p><strong>Date de création :</strong> {task.createdAt?.toDate()?.toLocaleDateString() || "Non définie"}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                {userRole === "Admin" && (
                    <div className="Add_Task_Button">
                        <button onClick={handleAddTask}>Ajouter une tâche</button>
                    </div>
                )}
            </div>
        </div>
    );
}

