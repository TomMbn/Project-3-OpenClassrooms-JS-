let api = "http://localhost:5678/api/";
let urlWorks = api+"works";
let urlCategory = api+"categories";
let gallery = document.querySelector(".gallery");
let filter = document.querySelector("#filterList")
const categorySet = new Set();

/*Récupération des catégories via l'API*/

async function getCategory(){
    const request = await fetch(urlCategory, {
        method : "GET"
    });

    if (!request.ok){
        alert("Une erreur est survenue");
    }
    else{
        let donnees = await request.json();
        donnees.forEach(element =>{
            categorySet.add(element.name);
        })
        categorySet.forEach(element => {
        addFilter(element);
        });
    }
}

/*Création des filtres et ajout au HTML*/

function addFilter(category){
    let newDiv = document.createElement("div");
    newDiv.setAttribute("class", "filter");
    newDiv.textContent = category;
    newDiv.addEventListener("click", eventFilter);
    document.querySelector("#filterList").appendChild(newDiv);
}

/*Fonction pour rendre les filtres fonctionnels*/

function eventFilter(){
    let galleryFigures = gallery.querySelectorAll("figure");
    let filterDiv = document.getElementsByClassName("filter");

    this.style.color = "white";
    this.style.backgroundColor = "#1D6154";

    for(filter of filterDiv){
        if(!(filter.textContent === this.textContent)){
            filter.style.color = "#1D6154";
            filter.style.backgroundColor = "white";
        }
    } 
    
    if (this.textContent === "Tous"){
        for(element of galleryFigures) {
                element.style.display = "block";
        }
    }
    else{ 
        for(element of galleryFigures) {
            element.className === this.textContent ? element.style.display = "block" : element.style.display = "none";
        }
    }
}

/*Récupération des travaux via l'API*/

async function getWorks(){
    const request = await fetch(urlWorks, {
        method : "GET"
    });

    if(!request.ok){
        alert("Un problème est survenu.")
    }
    else{
        let donnees = await request.json();
        
        donnees.forEach(element => {
            addWorks(element);
        });
    }
}

/*Ajout des travaux au HTML*/

function addWorks(work){

    let image = work.imageUrl; 
    let nom = work.title;
    let category = work.category.name;

    let newFigure = document.createElement("figure");
    newFigure.className = category;
    
    let newImg = document.createElement("img");
    newImg.setAttribute("src", image);
    newImg.setAttribute("alt", nom);
    newImg.setAttribute("crossorigin","anonymous");

    let newFigcaption = document.createElement("figcaption");
    newFigcaption.textContent = nom;

    newFigure.appendChild(newImg);
    newFigure.appendChild(newFigcaption);
    gallery.appendChild(newFigure);
}

/*Appel des fonctions*/

getWorks();
addFilter("Tous");
getCategory();
