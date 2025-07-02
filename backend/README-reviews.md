# Configuration de la table Reviews

## Instructions pour créer la table reviews

Pour que le système de notation fonctionne, vous devez exécuter le script SQL `create-reviews-table.sql` dans votre base de données Supabase.

### Option 1: Via l'interface Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Ouvrez votre projet SnapRead
3. Allez dans l'onglet "SQL Editor"
4. Copiez-collez le contenu du fichier `create-reviews-table.sql`
5. Cliquez sur "Run" pour exécuter le script

### Option 2: Via psql (si installé)
```bash
psql "votre-url-de-connexion-supabase" -f create-reviews-table.sql
```

## Fonctionnalités activées après création de la table

✅ **App Mobile**: Sauvegarde des notes quand l'utilisateur clique sur "Générer mon badge"  
✅ **Site Web**: Affichage des vraies notes avec étoiles dynamiques  
✅ **Calcul automatique**: Moyenne des notes et nombre d'avis par formation  
✅ **Unicité**: Un utilisateur ne peut noter qu'une seule fois par formation  

## Structure de la table

- `id`: Identifiant unique
- `user_id`: Référence vers l'utilisateur qui note
- `formation_id`: Référence vers la formation notée
- `rating`: Note de 1 à 5 étoiles
- `created_at`: Date de création
- `updated_at`: Date de mise à jour

## Sécurité

- Row Level Security (RLS) activé
- Tout le monde peut voir les avis
- Seuls les utilisateurs connectés peuvent créer/modifier leurs propres avis 