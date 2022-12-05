let api = "http://localhost:5678/api/";
let urlWorks = api+"works";
let gallery = document.querySelector(".gallery");


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

function addWorks(work){
    let image = work.imageUrl; 
    let nom = work.title;

    let newFigure = document.createElement("figure");
    
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

getWorks();
