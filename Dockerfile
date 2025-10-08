# === Étape 1 : build Maven ===
FROM maven:3.9.5-eclipse-temurin-17 AS builder

WORKDIR /build

# Copie la configuration Maven et télécharge les dépendances
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copie le code source
COPY src ./src

# Construit le fichier .war
RUN mvn clean package -DskipTests

# === Étape 2 : image Tomcat ===
FROM tomcat:10.1-jdk17

# Supprime les webapps par défaut de Tomcat
RUN rm -rf /usr/local/tomcat/webapps/*

# Copie le WAR généré depuis l’étape Maven, et le renomme ROOT.war
COPY --from=builder /build/target/*.war /usr/local/tomcat/webapps/ROOT.war

# Expose le port standard de Tomcat
EXPOSE 8080

CMD ["catalina.sh", "run"]