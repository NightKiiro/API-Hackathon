const express = require('express');
const router = express.Router();
const db = require('../db');
const { generateApiKey, hashApiKey } = require('../services/apiKeyService');
const { isEmailAllowed } = require('../services/authService');

/**
 * Stockage temporaire des clés API (en mémoire)
 */
const apiKeys = [];

/**
 * POST /api/auth/register
 * Inscription d'un nouveau créateur
 */
router.post('/register', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email requis' });
  }

  // Vérifier si l'email est dans la whitelist
  if (!isEmailAllowed(email)) {
    return res.status(403).json({ error: 'Email non autorisé' });
  }

  // Vérifier si le créateur existe déjà dans la DB
  db.get('SELECT * FROM creators WHERE email = ?', [email], async (err, existingCreator) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    // Générer une clé API
    const apiKey = generateApiKey();
    const hashedKey = hashApiKey(apiKey);

    // Stocker la clé en mémoire (temporaire)
    const userId = email; // On utilise l'email comme identifiant
    apiKeys.push({ keyHash: hashedKey, userId });

    if (!existingCreator) {
      // Créer le créateur dans la base de données
      db.run(
        'INSERT INTO creators (email, api_key) VALUES (?, ?)',
        [email, hashedKey],
        function (err) {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la création du créateur' });
          }

          res.status(201).json({
            message: 'Créateur inscrit avec succès',
            api_key: apiKey,  // La clé en clair à conserver
            email
          });
        }
      );
    } else {
      // Mettre à jour la clé API du créateur existant
      db.run(
        'UPDATE creators SET api_key = ? WHERE email = ?',
        [hashedKey, email],
        function (err) {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la mise à jour' });
          }

          res.json({
            message: 'Nouvelle clé API générée',
            api_key: apiKey,
            email
          });
        }
      );
    }
  });
});

/**
 * GET /api/auth/me
 * Vérifie la validité de la clé API et retourne les infos du créateur
 * 
 * Headers : x-api-key
 */
router.get('/me', (req, res) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ error: 'Clé API requise' });
  }

  const hashedKey = hashApiKey(apiKey);
  const validKey = apiKeys.find(k => k.keyHash === hashedKey);

  if (!validKey) {
    return res.status(403).json({ error: 'Clé API invalide' });
  }

  // Récupérer les infos du créateur
  db.get('SELECT id, email, created_at FROM creators WHERE email = ?', [validKey.userId], (err, creator) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    if (!creator) {
      return res.status(404).json({ error: 'Créateur non trouvé' });
    }

    res.json({
      id: creator.id,
      email: creator.email,
      created_at: creator.created_at
    });
  });
});

module.exports = router;