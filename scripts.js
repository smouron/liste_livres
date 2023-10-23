document.addEventListener("DOMContentLoaded", function () {
  console.log("script.js lancé !!!");

  const containerList = document.querySelector("#list");
  const nbBookTop = document.querySelector(".nbBookTop");
  const nbBookBottom = document.querySelector(".nbBookBottom");
  const research = document.getElementById("research");

  containerList.innerHTML = "";
  research.value = "";

  let filterAuthor = "tout";
  let filterEditor = "tout";
  let nbTotalBook = 0;
  let nbBook = 0;
  let idBook = "";
  let dataListe = "";
  let wordResearch = "";

  // Initialisation des variables des filtres au premier affichage du site
  if (document.getElementById("select_author")) {
    document.getElementById("select_author").value = "tout";
  }
  if (document.getElementById("select_editor")) {
    document.getElementById("select_editor").value = "tout";
  }

  const myHeaders = new Headers();

  const myInit = {
    method: "GET",
    headers: myHeaders,
    mode: "cors",
    cache: "default",
  };

  // Récupération des données des livres du fichier texte
  // ./assets/data/livres.json
  fetch("livres.json", myInit)
    .then((response) => response.json())
    .then((data) => {
      // Récupération de la liste JSON et mise dans une variable
      dataListe = data.liste;

      // Récupération du nombre total de livres
      nbTotalBook = dataListe.length;

      // Génération des articles
      for (let pas = 0; pas < nbTotalBook; pas++) {
        // Création d'un identifiant pour chaque article
        idBook = "book" + pas;

        // Contrôle si le livre doit être affiché
        if (dataListe[pas].visible) {
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
            '<img class="image1" src="./images/' +
            dataListe[pas].first_cover +
            '" alt="' +
            dataListe[pas].title +
            '"></img>' +
            '<img class="image2 hidden" src="./images/' +
            dataListe[pas].fourth_cover +
            '" alt="' +
            dataListe[pas].title +
            '"></img>' +
            "<p>édition " +
            dataListe[pas].editor +
            "</p>" +
            "</article>";
        } else {
          nbTotalBook = nbTotalBook - 1;
        }
      }

      // Nombre de livres en fonction des filtres
      nbBook = nbTotalBook;

      nbBookTop.innerHTML = nbBook;
      nbBookBottom.innerHTML = nbBook;
    })
    .catch((error) => {
      console.error("Une erreur s'est produite : ", error);
    });

  // On désactive la validation avec la touche entrée
  // + code pour récupérer la touche utilisée
  research.addEventListener("keydown", (e) => {
    e.preventDefault();
    if (
      e.keyCode > 50 &&
      e.keyCode < 106 &&
      e.key != "<" &&
      e.key != ">" &&
      e.key != "/"
    ) {
      research.value += e.key;
    }
    switch (e.key) {
      case "Backspace":
        console.log("Backspace");
        if (research.value.length > 0) {
          research.value = research.value.substring(
            0,
            research.value.length - 1
          );
        }
        break;

      default:
        console.log(e.key, e.keyCode);
        return;
    }
  });

  // Gestion des filtres
  (function ($) {
    $(document).ready(function () {
      // Détection quand on click sur une image
      $("section").click(function (e) {
        if (e.target.className === "image1") {
          // console.log(e.target.classList);
          e.target.classList.add("hidden");

          // console.log(e.target.nextElementSibling.classList);
          e.target.nextElementSibling.classList.remove("hidden");
        }

        // previousElementSibling
        if (e.target.className === "image2") {
          // console.log(e.target.classList);
          e.target.classList.add("hidden");

          // console.log(e.target.nextElementSibling.classList);
          e.target.previousElementSibling.classList.remove("hidden");
        }
      });

      // Détection quand on agit sur le filtre AUTEUR
      $("#select_author").change(function (e) {
        filterAuthor = e.target.value;
        // console.log(
        //   "Auteur : " + filterAuthor + " - Editeur : " + filterEditor
        // );
        functionFilterData(filterAuthor, filterEditor);
      });

      // Détection quand on agit sur le filtre EDITEUR
      $("#select_editor").change(function (e) {
        filterEditor = e.target.value;
        // console.log(
        //   "Auteur : " + filterAuthor + " - Editeur : " + filterEditor
        // );
        functionFilterData(filterAuthor, filterEditor);
      });

      // Au click sur le bouton recherche, récupération du texte à rechercher
      $(".button_research").click(function (e) {
        wordResearch = e.currentTarget.nextElementSibling.value;
        // Supprission de la présence éventuelle de balises html
        wordResearch = wordResearch.replace(/(<([^>]+)>)/gi, "");
        // On convertit en minuscule
        wordResearch = wordResearch.toLowerCase();
        // On retire les blancs en début et fin de chaîne
        wordResearch = wordResearch.trim();

        if (wordResearch != "" || wordResearch != undefined) {
          document.getElementById("select_author").value = "tout";
          document.getElementById("select_editor").value = "tout";
          functionResearch(wordResearch);
        }
      });

      $("#research").click(function (e) {
        e.preventDefault();
        // On réinitialise l'input de recherche
        research.value = "";
      });

      // Function pour filtrer l'affichage
      //
      // data1 = valeur du filtre sélectionné pour les auteurs
      // data2 = valeurs du filtre sélectionné pour les éditeurs
      //
      function functionFilterData(data1, data2) {
        // console.log("data1: " + data1 + " - data2: " + data2);

        // On réinitialise l'input de recherche
        research.value = "";
        // Initialisation du nombre de livres
        nbBook = 0;
        for (let pas = 0; pas < nbTotalBook; pas++) {
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
        functionNbBook();
      }

      function functionResearch(data3) {
        console.log("Mots à rechercher: " + wordResearch);

        // Initialisation du nombre de livres
        nbBook = 0;
        for (let pas = 0; pas < nbTotalBook; pas++) {
          // On affiche l'article si on trouve le mot rechercher
          // dans la liste des auteurs, des titres et des editeurs
          if (
            dataListe[pas].main_author.toLowerCase().indexOf(data3) > -1 ||
            dataListe[pas].secondary_author.toLowerCase().indexOf(data3) > -1 ||
            dataListe[pas].editor.toLowerCase().indexOf(data3) > -1 ||
            dataListe[pas].title.toLowerCase().indexOf(data3) > -1
          ) {
            $(".book" + pas).removeClass("hidden");
            nbBook += 1;
          } else {
            $(".book" + pas).addClass("hidden");
          }
        }
        functionNbBook();
      }

      // Mise à jour du nombre de livres à l'affichage
      function functionNbBook() {
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
    });
  })(jQuery);
});
