package org.example.clinique;


import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import java.io.InputStream;
import java.util.logging.LogManager;

public class TestConnection {

    public static void main(String[] args) {
        // Configurer le logging pour réduire les messages INFO
        try {
            InputStream configFile = TestConnection.class.getClassLoader()
                    .getResourceAsStream("logging.properties");
            if (configFile != null) {
                LogManager.getLogManager().readConfiguration(configFile);
            }
        } catch (Exception e) {
            System.err.println("Impossible de charger la configuration de logging.");
        }

        System.out.println("--- DÉBUT DU TEST DE CONNEXION JPA ---");

        EntityManagerFactory emf = null;
        try {
            // 1. Tente de créer l'EntityManagerFactory.
            //    C'est cette ligne qui lit le persistence.xml et tente la connexion.
            //    Assurez-vous que "cliniquePU" correspond EXACTEMENT au nom de votre persistence-unit.
            emf = Persistence.createEntityManagerFactory("cliniquePU");

            // 2. Si aucune erreur (exception) n'a été levée, la connexion a réussi.
            System.out.println("✅ SUCCÈS : La connexion à la base de données a été établie.");
            System.out.println("Hibernate a pu lire le fichier persistence.xml et se connecter.");

        } catch (Exception e) {
            // 3. Si une erreur se produit pendant la tentative de connexion...
            System.err.println("❌ ÉCHEC : Impossible de se connecter à la base de données.");
            System.err.println("Veuillez vérifier les points suivants :");
            System.err.println("  - Le serveur PostgreSQL est-il bien démarré ?");
            System.err.println("  - Les informations dans persistence.xml (URL, user, password) sont-elles correctes ?");
            System.err.println("  - La base de données 'clinique_db' existe-t-elle bien ?");
            System.err.println("  - La dépendance PostgreSQL est-elle bien chargée dans le pom.xml (non rouge) ?");

            // Affiche l'erreur technique complète, ce qui est très utile pour le débogage.
            e.printStackTrace();

        } finally {
            // 4. Quoi qu'il arrive, on ferme l'EntityManagerFactory si elle a été créée.
            if (emf != null && emf.isOpen()) {
                emf.close();
                System.out.println("--- L'EntityManagerFactory a été fermée. FIN DU TEST. ---");
            }
        }
    }
}