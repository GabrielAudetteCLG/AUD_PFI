const http = require("http");
const fs = require("fs");
const path = require("path");
const PORT = process.env.PORT || 8000;

// Création & appel du serveur
let serveur = http.createServer((requete, reponse) => {
  if (requete.url === "/") {
    let fileName = path.join(__dirname, "", "login.html");
    fournirPageWeb(fileName, reponse);
  } else {
    let fileName = path.join(__dirname, "", requete.url);
    fournirPageWeb(fileName, reponse);
  }
});

// Appel du serveur
serveur.listen(PORT, () =>
  console.log(`Le serveur est démarré sur le port :${PORT}`)
);

function test() {
  alert(`123`);
}
function fournirPageWeb(fileName, reponse) {
  console.log(fileName);
  fs.readFile(fileName, (err, contenu) => {
    if (err) {
      if (err.code === "ENOENT") {
        // Fichier non trouvé
        reponse.writeHead(404, { "Content-Type": "text/html" });
        reponse.write("<h1>Page Introuvable 404</h1>");
        reponse.end();
      } else {
        reponse.writeHead(500);
        reponse.write(`Erreur du serveur code : ${err.code}`);
        reponse.end();
      }
    } else {
      reponse.writeHead(200, { "Content-Type": "text/html" });
      reponse.write(contenu);
      reponse.end();
    }
  });
}
// Changement page Web
// function changerPageWeb(fileName, reponse) {
//   console.log(fileName);
//   fs.readFile(fileName, (err, contenu) => {
//     if (err) {
//       if (err.code === "ENOENT") {
//         // Fichier non trouvé
//         reponse.writeHead(404, { "Content-Type": "text/html" });
//         reponse.write("<h1>Page Introuvable 404</h1>");
//         reponse.end();
//       } else {
//         reponse.writeHead(500);
//         reponse.write(`Erreur du serveur code : ${err.code}`);
//         reponse.end();
//       }
//     } else {
//       reponse.writeHead(200, { "Content-Type": "text/html" });
//       reponse.write(contenu);
//       reponse.end();
//     }
//   });
// }

function extraction_donnes() {
  const user = document.getElementsByClassName("user").value;
  console.log(user);
  const pass = document.getElementsByClassName("pass");
}
// extrait de code
// if
// reponse.write("<h1>Page Introuvable...</h1>\n");
// fs.readFile(
//   path.join(__dirname, "pagesWeb", "index.html"),
//   (err, contenu) => {
//     if (err) throw err;
//     reponse.writeHead(200, { "Content-Type": "text/html" });
//     reponse.write(contenu);
//     reponse.end();
//   }
// );
// else
// reponse.end();
// let serveur = http.createServer((requete, reponse) => {

//   if (requete.url === "/") {
//     fs.readFile(
//       path.join(__dirname, "pagesWeb", "index.html"),
//       (err, contenu) => {
//         if (err) throw err;
//         reponse.writeHead(200, { "Content-Type": "text/html" });
//         reponse.write(contenu);
//         reponse.end();
//       }
//     );
//   } else {
//     reponse.write("<h1>Page Introuvable...</h1>\n");
//     reponse.end();
//   }
// });

// .listen(PORT, () => {
//   console.log(`Le service web est demarré`);
// });
