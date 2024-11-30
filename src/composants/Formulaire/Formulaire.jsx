import { useState, useEffect } from "react";
import { db, auth } from "../../../Firebase";
import { collection, addDoc, Timestamp, query, where, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
import './Formulaire.css';


// CHATGPT //
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.REACT_APP_OPENAI_API_KEY,
//   organization: "org-XFEb5fBruHfV7sl8bAVNwmcF",
//   dangerouslyAllowBrowser: true,
// });


export function Formulaire() {
  const [titre, setTitre] = useState('');
  const [priorite, setPriorite] = useState('faible');
  const [description, setDesciption] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [fichier, setFichier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]); // Liste des utilisateurs de type "Community"
  const [selectedUser, setSelectedUser] = useState('');

  const navigate = useNavigate();


  
  ///CHATGPT/////
  const [response, setResponse] = useState("");

  const fetchChatGPTResponse = async (titre, description) => {
    try {
      console.log("Starting API call...");
      const completion = await openai.chat.completions.create({
        model: "gpt-4",  // Fixed typo "gpt-4o" to "gpt-4"
        messages: [
          { role: "system", content: "You are a teacher assistant." },
          {
            role: "user",
            content: `In French: Write a 1-hour intervention content for my student. 
                      The title is ${titre}, and the content should be: ${description}`,
          },
        ],
      });
      console.log("API call successful.");
      console.log("API call successful.");
      console.log("API call successful.");

      return completion.choices[0].message.content; // Return the response directly
      
        
        // Update response state with result
    } catch (error) {
      console.error("Error fetching completion:", error);
      setResponse("Error fetching the content. Please try again.");
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    const fetchCommunityUsers = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "Community"));
        const querySnapshot = await getDocs(q);
        const fetchedUsers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs communautaires:", error);
      }
    };

    if (user) {
      fetchCommunityUsers();
    }

    return () => unsubscribe();
  }, [user]);

  const handleFileChange = (e) => {
    setFichier(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
  
    try {
      const currentUser = auth.currentUser;
  
      if (!currentUser) {
        throw new Error("Utilisateur non authentifié !");
      }
  
      let fichierURL = null;
  
      // Gestion de l'upload du fichier (si présent)
      if (fichier) {
        const storage = getStorage();
        const fichierRef = ref(storage, `fichiers/${Date.now()}-${fichier.name}`);
        await uploadBytes(fichierRef, fichier);
        fichierURL = await getDownloadURL(fichierRef);
      }
  
      // Récupérer la réponse de ChatGPT
      const chatgptResponse = await fetchChatGPTResponse(titre, description);  

      // Attendre 20 secondes avant de poursuivre
      await new Promise((resolve) => setTimeout(resolve, 20000));
  
      // Ajout de la tâche dans Firestore
      await addDoc(collection(db, "taches"), {
        titre,
        priorite,
        description,
        commentaire,
        fichierURL,
        userId: currentUser.uid,
        assignedTo: selectedUser, // Attribuer la tâche à un utilisateur de type "Community"
        createdAt: Timestamp.now(),
        chatgptResponse  // Ajouter la réponse ChatGPT à Firestore
      });
  
      setSuccess(true);
      setTitre('');
      setPriorite('faible');
      setDesciption('');
      setCommentaire('');
      setFichier(null);
      setSelectedUser(''); // Réinitialiser l'utilisateur sélectionné
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
      alert("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };  

  const annulerBtn = () => {
    navigate('/Tasks');
  };

  return (
    <div className="formulaire-container">
      <h2>Formulaire de soumission de Tâche</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Titre de la tâche</label>
          <input
            type="text"
            name="titre"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Priorité</label>
          <select name="priorite" value={priorite} onChange={(e) => setPriorite(e.target.value)} required>
            <option value="Faible">Faible</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Élevée">Élevée</option>
          </select>
        </div>
        <div className="form-group">
          <label>Description</label><br />
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDesciption(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>Ajouter une pièce jointe</label>
          <input type="file" name="fichier" onChange={handleFileChange} />
        </div>
        <div className="form-group">
          <label>Commentaires</label><br />
          <textarea
            name="commentaire"
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
          ></textarea>
        </div>
        <div className="form-group">
          <label>Assigner à un étudiant</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="User_Select"
          >
            <option value="">Sélectionner un étudiant</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.prenom} {user.nom}
              </option>
            ))}
          </select>
          
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Soumission..." : "Soumettre"}
        </button>
      </form>
      <button type="button" onClick={annulerBtn}>
        Annuler
      </button>
      {success && <p>Tâche soumise avec succès !</p>}
    </div>
  );
}
