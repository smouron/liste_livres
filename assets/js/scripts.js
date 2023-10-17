document.addEventListener("DOMContentLoaded", function () {
  console.log("script.js lancé !!!");

  const containerList = document.querySelector("#list");
  const nbBookTop = document.querySelector(".nbBookTop");
  const nbBookBottom = document.querySelector(".nbBookBottom");
  const selectAuthor = document.querySelector("#select_author");
  const selectEditor = document.querySelector("#select_editor");

  containerList.innerHTML = "";

  let filterAuthor = "tout";
  let filterEditor = "tout";
  let nbTotalBook = 0;
  let nbBook = 0;
  let idBook = "";
  let dataListe = "";

  var myHeaders = new Headers();

  var myInit = {
    method: "GET",
    headers: myHeaders,
    mode: "cors",
    cache: "default",
  };

  // Récupération des données des livres du fichier texte
  fetch("./assets/data/livres.json", myInit)
    .then((response) => response.json())
    .then((data) => {
      // Faites quelque chose avec les données JSON
      dataListe = data.liste;
      console.log(dataListe);

      // Récupération du nombre total de livres
      nbTotalBook = dataListe.length;
      // Nombre de livres en fonction des filtres
      nbBook = nbTotalBook;
      nbBookTop.innerHTML = nbBook;
      nbBookBottom.innerHTML = nbBook;

      // Génération des articles
      for (let pas = 0; pas < nbTotalBook; pas++) {
        // Création d'un identifiant pour chaque article
        idBook = "book" + pas;
        // Génération du code HTML pour chaque livre
        containerList.innerHTML +=
          '<article id="' +
          idBook +
          '" class="book ' +
          idBook +
          '" title="' +
          dataListe[pas].title +
          '">' +
          "<h2>" +
          dataListe[pas].title +
          "</h2>" +
          "<h3>de " +
          dataListe[pas].main_author +
          "</h3>" +
          '<img class="image1" src="./assets/images/' +
          dataListe[pas].first_cover +
          '" alt="' +
          dataListe[pas].title +
          '"></img>' +
          '<img class="image2 hidden" src="./assets/images/' +
          dataListe[pas].fourth_cover +
          '" alt="' +
          dataListe[pas].title +
          '"></img>' +
          "<p>édition " +
          dataListe[pas].editor +
          "</p>" +
          "</article>";
      }
    })
    .catch((error) => {
      console.error("Une erreur s'est produite : ", error);
    });

  // Gestion des filtres
  (function ($) {
    // Détection quand on agit sur le filtre AUTEUR
    $(document).ready(function () {
      $("#select_author").change(function (e) {
        // console.log(e);
        // console.log(e.target);
        filterAuthor = e.target.value;
        console.log("Auteur : " + filterAuthor + "Editeur : " + filterEditor);
        functionFilterData(filterAuthor, filterEditor);
        functionFilterListe(filterAuthor, filterEditor);
      });

      // Détection quand on agit sur le filtre EDITEUR
      $("#select_editor").change(function (e) {
        // console.log(e);
        // console.log(e.target.value);
        filterEditor = e.target.value;
        console.log("Auteur : " + filterAuthor + "Editeur : " + filterEditor);
        functionFilterData(filterAuthor, filterEditor);
        functionFilterListe(filterAuthor, filterEditor);
      });

      // Function pour filtrer l'affichage
      // data1 = valeur du filtre sélectionné pour les auteurs
      // data2 = valeurs du filtre sélectionné pour les éditeurs
      function functionFilterData(data1, data2) {
        console.log("Nombre total de livres: " + nbBook + "/" + nbTotalBook);
        console.log("data1: " + data1 + " - data2: " + data2);
        nbBook = 0;
        for (let pas = 0; pas < nbTotalBook; pas++) {
          // console.log($(".book")[pas]);

          // S'il n'y a rien à filtrer on fait tout afficher
          // si non on cache avant d'appliquer les filtres
          if (data2 == "tout" && data1 == "tout") {
            $(".book" + pas).removeClass("hidden");
            nbBook += 1;
          } else {
            $(".book" + pas).addClass("hidden");
          }

          // Filtre uniquement les auteurs
          if (
            (data1 === dataListe[pas].main_author.toLowerCase() ||
              data1 === dataListe[pas].secondary_author.toLowerCase()) &&
            data2 == "tout"
          ) {
            $(".book" + pas).removeClass("hidden");
            nbBook += 1;
          }

          // Filtre uniquement les éditeurs
          if (
            data1 === "tout" &&
            data2 === dataListe[pas].editor.toLowerCase()
          ) {
            $(".book" + pas).removeClass("hidden");
            nbBook += 1;
          }

          // Filtre les auteurs + les éditeurs
          if (
            (data1 === dataListe[pas].main_author.toLowerCase() ||
              data1 === dataListe[pas].secondary_author.toLowerCase()) &&
            data2 === dataListe[pas].editor.toLowerCase()
          ) {
            $(".book" + pas).removeClass("hidden");
            nbBook += 1;
          }
        }

        // Mise à jour du nombre de livres à l'affichage
        let texte = nbBook + " / " + nbTotalBook;
        if (nbBook == nbTotalBook) {
          texte = nbTotalBook;
        }
        console.log("Nombre total de livres: " + nbBook + "/" + nbTotalBook);
        nbBookTop.innerHTML = texte;
        nbBookBottom.innerHTML = texte;

        // Affiche un texte à la place du compteur s'il n'y a aucun livre
        if (nbBook === 0) {
          $(".nbBook").addClass("hidden");
          $(".noBook").removeClass("hidden");
        } else {
          $(".nbBook").removeClass("hidden");
          $(".noBook").addClass("hidden");
        }
      }

      // Function pour filtrer la liste des filtre
      function functionFilterListe(data1, data2) {
        console.log(selectAuthor);
        console.log(selectAuthor[1]);
        console.log(selectAuthor.length);
        console.log(selectEditor.length);
      }
    });
  })(jQuery);
});
