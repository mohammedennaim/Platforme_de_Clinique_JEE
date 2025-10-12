# Guide des Dashboards - Clinique Digitale

## 🏥 Système de Dashboards par Rôles

Le système de gestion de la clinique digitale propose maintenant des interfaces personnalisées selon le rôle de l'utilisateur connecté.

## 📋 Dashboards Disponibles

### 1. Dashboard Médecin (`dashboard-doctor.jsp`)
- **Couleur thème** : Bleu foncé (#2c3e50)
- **Fonctionnalités** :
  - Informations personnelles (nom, numéro d'enregistrement, spécialité)
  - Gestion des rendez-vous
  - Gestion des patients
  - Statistiques de consultation
  - Actions (modifier profil, changer mot de passe)

### 2. Dashboard Patient (`dashboard-patient.jsp`)
- **Couleur thème** : Vert (#27ae60)
- **Fonctionnalités** :
  - Informations personnelles (CIN, date de naissance, genre, téléphone, adresse)
  - Mes rendez-vous
  - Mon dossier médical
  - Services de la clinique
  - Actions (modifier profil, changer mot de passe)

### 3. Dashboard Administrateur (`dashboard-admin.jsp`)
- **Couleur thème** : Violet (#8e44ad)
- **Fonctionnalités** :
  - Gestion des utilisateurs (médecins, patients, personnel)
  - Gestion de la clinique (départements, spécialités)
  - Rapports et statistiques
  - Administration système
  - Gestion des rendez-vous
  - Alertes et notifications

### 4. Dashboard Personnel (`dashboard-staff.jsp`)
- **Couleur thème** : Orange (#e67e22)
- **Fonctionnalités** :
  - Informations personnelles
  - Gestion des rendez-vous
  - Accueil des patients
  - Communication
  - Services support
  - Rapports quotidiens

## 🔄 Système de Routage

### Authentification et Redirection
- **AuthServlet** : Gère la connexion et redirige automatiquement vers le bon dashboard
- **DashboardServlet** : Point d'entrée unique pour tous les dashboards
- **Routage automatique** : Basé sur le rôle de l'utilisateur

### Flux de Connexion
1. Utilisateur se connecte via `index.jsp`
2. `AuthServlet` valide les identifiants
3. Récupération des informations complètes de l'utilisateur
4. Stockage en session (`userEmail` et `user`)
5. Redirection automatique vers le dashboard approprié

## 🎨 Design et Interface

### Caractéristiques du Design
- **Responsive** : S'adapte à différentes tailles d'écran
- **Couleurs distinctes** : Chaque rôle a sa propre identité visuelle
- **Interface moderne** : Design épuré avec des cartes et des boutons stylisés
- **Navigation intuitive** : Boutons d'action clairement identifiés

### Page de Connexion Améliorée
- **Design moderne** : Gradient de fond et interface centrée
- **Informations de test** : Comptes de démonstration affichés
- **Validation** : Messages d'erreur et de succès stylisés

## 🧪 Comptes de Test

### Comptes Disponibles
- **Admin** : `admin@clinique.com` / `admin`
- **Médecin** : `martin@clinique.com` / `1234`
- **Patient** : `alice@clinique.com` / `1234`

## 🚀 Utilisation

### Démarrage de l'Application
1. Démarrer les services Docker : `docker-compose up -d`
2. Accéder à l'application : `http://localhost:8085`
3. Se connecter avec un des comptes de test
4. Être automatiquement redirigé vers le dashboard approprié

### Navigation
- **Dashboard principal** : Redirection automatique après 3 secondes
- **Accès direct** : Bouton "Accéder à mon dashboard"
- **Déconnexion** : Bouton "Se déconnecter" disponible sur tous les dashboards

## 🔧 Architecture Technique

### Fichiers Créés/Modifiés
- `dashboard-doctor.jsp` : Interface médecin
- `dashboard-patient.jsp` : Interface patient
- `dashboard-admin.jsp` : Interface administrateur
- `dashboard-staff.jsp` : Interface personnel
- `DashboardServlet.java` : Servlet de routage
- `AuthServlet.java` : Modifié pour le routage par rôle
- `AuthService.java` : Ajout de la méthode `getUserByEmail()`
- `index.jsp` : Interface de connexion améliorée
- `dashboard.jsp` : Page de redirection générale

### Sécurité
- **Validation de session** : Vérification de l'authentification sur chaque dashboard
- **Redirection automatique** : Vers la page de connexion si non authentifié
- **Gestion des rôles** : Accès restreint selon le type d'utilisateur

## 📝 Prochaines Étapes

### Fonctionnalités à Implémenter
- [ ] Liens fonctionnels dans les dashboards
- [ ] Gestion des rendez-vous
- [ ] Gestion des dossiers médicaux
- [ ] Système de notifications
- [ ] Rapports et statistiques
- [ ] Gestion des utilisateurs (pour admin)
- [ ] Configuration système (pour admin)
