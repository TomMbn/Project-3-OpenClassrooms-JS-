let api = "http://localhost:5678/api/";
let urlWorks = api+"works";
let urlCategory = api+"categories";
let gallery = document.querySelector(".gallery");
let filter = document.querySelector("#filterList")
const categorySet = new Set();

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

function addFilter(category){
    let newDiv = document.createElement("div");
    newDiv.setAttribute("class", "filter");
    newDiv.textContent = category;
    newDiv.addEventListener("click", eventFilter);
    document.querySelector("#filterList").appendChild(newDiv);
}

function eventFilter(){
    let galleryFigures = gallery.querySelectorAll("figure");
    let filterDiv = document.getElementsByClassName("filter");

    this.style.color = "white";
    this.style.backgroundColor = "#1D6154";

    for (let i = 0; i < filterDiv.length; i++) {
        if(!(filterDiv[i].textContent === this.textContent)){
            filterDiv[i].style.color = "#1D6154";
            filterDiv[i].style.backgroundColor = "white";
        }
    }
    
    if (this.textContent === "Tous"){
        for (let i = 0; i < galleryFigures.length; i++) {
                galleryFigures[i].style.display = "block";
        }
    }
    else{ 
        for (let i = 0; i < galleryFigures.length; i++) {
            if(galleryFigures[i].className === this.textContent){
                galleryFigures[i].style.display = "block";
            }
            else{
                galleryFigures[i].style.display = "none";
            }
            
        }
    }
}

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
    let category = work.category.name;
    console.log(category);

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


getWorks();
addFilter("Tous");
getCategory();
