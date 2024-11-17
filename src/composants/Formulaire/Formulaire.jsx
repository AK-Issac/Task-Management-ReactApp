import { useState } from "react";
import "./Formulaire.css"
import { useNavigate } from 'react-router-dom';

export function Formulaire() {
    const navigate = useNavigate();

    const [titre, setTitre] = useState('');
    const [priorite, setPriorite] = useState('');
    const [description, setDescription] = useState('');
    const [fichier, setFichier] = useState('');

    const handleSubmit = async (e) => {

    }

    return (
        <div className="formulaire-container">
            <h2>Formulaire de Soumission de Tâche</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Titre de la tâche</label>
                    <input
                        type="text"
                        name="titre"
                        value={titre}
                        onChange={(e) => setTitre(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Priorité</label>
                    <select name="gender" value={priorite} onChange={(e) => setPriorite(e.target.value)} required>
                        <option value="">Selectionnez...</option>
                        <option value="faible">Faible</option>
                        <option value="moyenne">Moyenne</option>
                        <option value="elevee">Élevée</option>
                    </select>
                </div>
                <div className="input-group">
                    <label>Description détaillée</label>
                    <input
                        type="text"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Pièce jointe</label>
                    <input
                        type="file"
                        name="fichier"
                        onChange={(e) => setFichier(e.target.files[0])}
                    />
                </div>
            </form>
        </div>
    );
}