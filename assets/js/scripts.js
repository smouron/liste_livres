document.addEventListener("DOMContentLoaded", function () {
  console.log("script.js lancé !!!");

  const containerList = document.querySelector("#list");
  containerList.innerHTML = "";

  var myHeaders = new Headers();

  var myInit = {
    method: "GET",
    headers: myHeaders,
    mode: "cors",
    cache: "default",
  };

  let nbTotalBook = 0;
  // Récupération des données des sites du fichier texte
  fetch("./assets/data/livres.json", myInit)
    .then((response) => response.json())
    .then((data) => {
      // Faites quelque chose avec les données JSON ici
      console.log(data.liste);

      nbTotalBook = data.liste.length;
      console.log(nbTotalBook);

      for (let pas = 0; pas < nbTotalBook; pas++) {
        let idBook = "";
        if (pas < 10) {
          idBook = "book0000" + pas;
        } else if (pas < 100) {
          idBook = "book00" + pas;
        } else if (pas < 1000) {
          idBook = "book00" + pas;
        } else {
          idBook = "book" + pas;
        }
        containerList.innerHTML +=
          '<div id="' +
          idBook +
          '" class="book ' +
          idBook +
          '" title="' +
          data.liste[pas].title +
          '">' +
          '<h2>' +
          data.liste[pas].title +
          '</h2>' +
          '<h3>de ' +
          data.liste[pas].main_author +
          '</h3>' +
          '<img src="./assets/images/'+ data.liste[pas].first_cover +'" alt="'+data.liste[pas].title +'"></img>' +
          '<img class="hidden" src="./assets/images/'+ data.liste[pas].first_cover +'" alt="'+data.liste[pas].title +'"></img>' +
          '<p>édition ' +
          data.liste[pas].editor +
          '</p>' +
          '</div>';

        console.log(data.liste[pas]);
        console.log(data.liste[pas].id);
        console.log(data.liste[pas].title);
      }
    })
    .catch((error) => {
      console.error("Une erreur s'est produite : ", error);
    });
});
