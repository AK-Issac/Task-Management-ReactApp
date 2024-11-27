import { useState, useEffect } from 'react';
import { doc, getDocs, getDoc, collection, query, where, addDoc, updateDoc } from "firebase/firestore";
import { db, auth } from '../../../Firebase.js'; // Votre fichier de configuration Firebase
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

    useEffect(() => {
        // Vérification du rôle de l'utilisateur connecté
        const checkUserRole = async () => {
            const userRef = doc(db, "users", auth.currentUser.uid);
            const userDoc = await getDoc(userRef); // Utilisation de getDoc pour un seul document
            setUserRole(userDoc.data().role);
            setLoading(false); // Données chargées, on arrête le chargement
        };
        checkUserRole();

        // Récupérer les utilisateurs pour l'ajout de tâches (si l'utilisateur est admin)
        const fetchUsers = async () => {
            if (userRole === "admin") { // Vérification du rôle avant de récupérer les utilisateurs
                const q = query(collection(db, "users"), where("role", "==", "student"));
                const querySnapshot = await getDocs(q);
                const fetchedUsers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsers(fetchedUsers);
            }
        };
        fetchUsers();

        // Récupérer les tâches assignées à l'utilisateur connecté
        const fetchTasks = async () => {
            const q = query(collection(db, "tasks"), where("assignedTo", "==", auth.currentUser.uid));
            const querySnapshot = await getDocs(q);

            const taskData = { todo: [], inProgress: [], done: [] };
            querySnapshot.docs.forEach(doc => {
                const task = { id: doc.id, ...doc.data() };
                taskData[task.status].push(task);
            });
            setTasks(taskData);
        };
        fetchTasks();
    }, [userRole]); // Utiliser userRole comme dépendance pour mettre à jour les utilisateurs et les tâches

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
        const taskRef = doc(db, "tasks", taskId);
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

    const handleSearch = async (term) => {
        setSearchTerm(term);

        if (term.trim() === "") {
            setSearchResults([]);
            return;
        }

        const roleToSearch = userRole === "admin" ? "student" : "teacher";
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

    const handleAddTask = async () => {
        if (selectedUser && newTask) {
            await addDoc(collection(db, "tasks"), {
                assignedTo: selectedUser,
                task: newTask,
                status: "todo", // La tâche est ajoutée dans la colonne "À faire" par défaut
            });
            alert("Tâche ajoutée avec succès !");
            setNewTask('');
            setSelectedUser('');
        } else {
            alert("Veuillez sélectionner un utilisateur et entrer une tâche.");
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Affichage de "loading" tant que les données sont en cours de récupération
    }

    return (
        <div className="App">
            <div className='Recherche'>
                <input
                    className='RechercheInput'
                    type='text'
                    placeholder={`Rechercher ${userRole === "admin" ? "un étudiant" : "un enseignant"}`}
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
            {searchResults.length > 0 && (
                <div className="Search_Results">
                    {searchResults.map(user => (
                        <div key={user.id} className="Search_Result_Item">
                            {user.name} - {user.role}
                        </div>
                    ))}
                </div>
            )}

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
                                        {task.task}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Section Ajouter une tâche pour l'admin */}
                {userRole === "admin" && (
                    <div className='Add_Task_Section'>
                        <h2>Ajouter une nouvelle tâche</h2>
                        <select
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            className='User_Select'
                        >
                            <option value="">Sélectionner un étudiant</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Entrez une tâche"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            className='Task_Input'
                        />
                        <button className='Add_Task_Button' onClick={handleAddTask}>
                            Ajouter une Tâche
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
