const http = require("http");
const fs = require("fs");
const path = require("path");
const PORT = process.env.PORT || 8000;
const usager = require("./liste_usagers");
const SUCCESS = 200;
const UNAUTHORIZED = 401;
const UNEXISTING = 404;
const ERRORSERVER = 500;

// Dans ce projet, j'ai une page Login qui prends un user & un pass, qui redirige a une des 3 pages HTML selon le rôle donné de l'utilisateur donné, que je passe en param POST / GET avec mon formulaire

// Création & appel du serveur
http
  .createServer((requete, reponse) => {
    if (requete.url.substring(0, 11) == "/acess.html") {
      // preventDefault();
      traiterPostBack(requete, reponse);
    } else if (requete.url === "/" || requete.url === "/login.html") {
      // let fileName = path.join(__dirname, "pagesWeb", "login.html");
      fournirPageWeb("login.html", reponse);
    } else if (requete.url === "/login_get.html") {
      fournirPageWeb("login_get.html", reponse);
    } else {
      // let fileName = path.join(__dirname, "pagesWeb", requete.url);
      fournirPageWeb("", reponse);
    }
  })
  .listen(PORT, () =>
    console.log(`Le serveur est démarré sur le port :${PORT}`)
  );

function fournirPageWeb(fileName, reponse) {
  let nomFichier = path.join(__dirname, "pagesWeb", fileName);
  let fileType = typeContenu(fileName);

  fs.readFile(nomFichier, (err, contenu) => {
    if (err) {
      if (err.code === "ENOENT") {
        // Fichier non trouvé
        reponse.writeHead(UNEXISTING, { "Content-Type": "text/html" });
        reponse.write("<h1>Page Introuvable 404</h1>");
        reponse.end();
      } else {
        reponse.writeHead(ERRORSERVER);
        reponse.write(`Erreur du serveur code : ${err.code}`);
        reponse.end();
      }
    } else {
      reponse.writeHead(SUCCESS, { "Content-Type": fileType });
      reponse.write(contenu);
      reponse.end();
    }
  });
}
// Traite la demande de form en post, si le demande form positive, renvoie les params d'url dans le 3eme param en appelant la fonction traiterRequete
function traiterPOST(requete, reponse) {
  let postData = "";
  requete.on("data", (donnee) => {
    postData += donnee;
  });
  requete.on("end", () => {
    // Si rien recu dans l'url
    if (postData === "") {
      console.log(`Rien recu`);
    } else {
      const parametres = new URLSearchParams(postData);
      traiterRequete(requete, reponse, parametres);
    }
  });
}
// Fonction TraiterGET (Va chercher les params de user & password avec le substring)
function traiterGET(requete, reponse) {
  const parametres = new URLSearchParams(requete.url.substring(12));
  traiterRequete(requete, reponse, parametres);
}
// Traite la requête selon la méthode
function traiterPostBack(requete, reponse) {
  console.log(requete.method);
  if (requete.method === "POST") {
    // Ici on traite un POST
    traiterPOST(requete, reponse);
  } else {
    // Ici ça veut dire que la méthode est GET
    traiterGET(requete, reponse);
  }
}
// Fonction traiter Requete qui va être appelé par les fonctions POST / GET , passé en 3eme param les user / pass
function traiterRequete(requete, reponse, parametres) {
  const user = parametres.get("user");
  const pass = parametres.get("pass");
  // déclaration de la variable qui va chercher le data du usager
  let userTrouver = usager.find((data) => data.login === user);
  if (userTrouver) {
    if (userTrouver.pwd === pass) {
      if (userTrouver.acces === "admin") {
        changementContenuPageWeb("pageAdmin.html", reponse, userTrouver);
      } else if (userTrouver.acces === "normal") {
        changementContenuPageWeb("pageUsager.html", reponse, userTrouver);
      } else if (userTrouver.acces === "restreint") {
        changementContenuPageWeb("pageRestreinte.html", reponse, userTrouver);
      }
    } else {
      console.log(`Mot de passe invalide`);
      userTrouver = `Mot de passe invalide`;
      changementContenuPageWeb("", reponse, userTrouver);
    }
  } else {
    changementContenuPageWeb("", reponse, user);
  }
}
// Fonction Change le contenu de la page Web selon l'appel depuis la fonction traiter rêquete
function changementContenuPageWeb(fileName, reponse, userTrouver) {
  let nomFichier = path.join(__dirname, "pagesWeb", fileName);
  let fileType = typeContenu(fileName);

  fs.readFile(nomFichier, (err, contenu) => {
    if (err) {
      if (err.code === "ENOENT") {
        // Fichier non trouvé
        reponse.writeHead(UNEXISTING, { "Content-Type": "text/html" });
        reponse.write("<h1>Page Introuvable 404</h1>");
        reponse.end();
      } else {
        if (userTrouver === `Mot de passe invalide`) {
          reponse.writeHead(UNAUTHORIZED, { "Content-Type": "text/html" });
          reponse.write("<h1>Page Non authaurisee 404</h1>");
          reponse.write("<h1>Le mot de passe invalide</h1>");
          reponse.end();
        } else if (err.code === ERRORSERVER) {
          reponse.writeHead(ERRORSERVER);
          reponse.write(`Erreur du serveur code : ${err.code}`);
          reponse.end();
        } else {
          reponse.writeHead(UNAUTHORIZED, { "Content-Type": "text/html" });
          reponse.write("<h1>Page Non Authorisee 404</h1>");
          reponse.write(
            `<h1>Le nom d'utilisateur est non valide ${userTrouver}</h1>`
          );
          reponse.end();
        }
      }
      // Si pas d'erreur, retourner les informations par les bonnes dans la page
    } else {
      reponse.writeHead(SUCCESS, { "Content-Type": fileType });
      reponse.write(contenu.toString().replace(/_nom_nom/g, userTrouver.nom));
      reponse.write(
        contenu.toString().replace(/_login_login/g, userTrouver.login)
      );
      reponse.end();
    }
  });
}
// Fonction qui vérifie le type de contenu
function typeContenu(nomFichier) {
  let extFichier = path.extname(nomFichier).toLowerCase();
  // vérifie l'extFichier pour retourner le bon type de contenu
  let typeDeContenu = "text/html";
  switch (extFichier) {
    case ".png":
      typeDeContenu = "image/png";
      break;
    case ".jpg":
      typeDeContenu = "image/jpg";
      break;
    case ".gif":
      typeDeContenu = "image/gif";
      break;
    case ".js":
      typeDeContenu = "text/javascript";
      break;
    case ".css":
      typeDeContenu = "text/css";
      break;
  }
  return typeDeContenu;
}
