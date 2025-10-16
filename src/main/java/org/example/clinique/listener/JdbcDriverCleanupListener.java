package org.example.clinique.listener;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;

import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Enumeration;

/**
 * Listener pour nettoyer proprement le driver JDBC PostgreSQL
 * lors de l'arrêt de l'application afin d'éviter les fuites mémoire.
 */
@WebListener
public class JdbcDriverCleanupListener implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        // Rien à faire au démarrage
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        // Désenregistrer tous les drivers JDBC
        Enumeration<Driver> drivers = DriverManager.getDrivers();
        while (drivers.hasMoreElements()) {
            Driver driver = drivers.nextElement();
            try {
                DriverManager.deregisterDriver(driver);
                System.out.println("Driver JDBC désenregistré: " + driver.getClass().getName());
            } catch (SQLException e) {
                System.err.println("Erreur lors du désenregistrement du driver JDBC: " + e.getMessage());
            }
        }

        // Forcer la désenregistrement du driver PostgreSQL spécifiquement
        try {
            ClassLoader cl = Thread.currentThread().getContextClassLoader();
            Enumeration<Driver> driversEnum = DriverManager.getDrivers();
            while (driversEnum.hasMoreElements()) {
                Driver d = driversEnum.nextElement();
                if (d.getClass().getClassLoader() == cl) {
                    DriverManager.deregisterDriver(d);
                }
            }
        } catch (Exception e) {
            System.err.println("Erreur lors du nettoyage du driver PostgreSQL: " + e.getMessage());
        }
    }
}
