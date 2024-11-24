import { useState } from "react";
import { db, auth } from "../../../Firebase"; // Import Firebase config
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import './Formulaire.css'
import settings from '../../assets/settings.svg';

export function Formulaire() {
  const [titre, setTitre] = useState('');
  const [priorite, setPriorite] = useState('faible');
  const [description, setDesciption] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [fichier, setFichier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);

  const handleFileChange = (e) => {
    setFichier(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const user = auth.currentUser;

      if (!user) {
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

      // Ajout de la tâche dans Firestore
      await addDoc(collection(db, "taches"), {
        titre,
        priorite,
        description,
        commentaire,
        fichierURL,
        userId: user.uid,
        createdAt: Timestamp.now(),
      });

      setSuccess(true);
      setTitre('');
      setPriorite('faible');
      setDesciption('');
      setCommentaire('');
      setFichier(null);
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
      alert("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const redirectProfile = () => {
    window.location.href = '/profile';
  };

  return (
    <div className="formulaire-container">
      <div className="social-buttons">
        <div className="social-button" onClick={redirectProfile}>
          <img src={settings} alt="Profile" className="profile-avatar" />
          <span className="profile-name">{user?.displayName || "User"}</span>
        </div>
      </div>
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
            <option value="faible">Faible</option>
            <option value="moyenne">Moyenne</option>
            <option value="élevée">Élevée</option>
          </select>
        </div>
        <div className="form-group">
          <label>Description</label><br/>
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
          <label>Commentaires</label><br/>
          <textarea
            name="commentaire"
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Soumission..." : "Soumettre"}
        </button>
      </form>
      {success && <p>Tâche soumise avec succès !</p>}
    </div>
  );
};