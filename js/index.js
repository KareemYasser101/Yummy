//Global location variable
let screenLocation = $("#homeOnLoad");

let loadingScreen = $(".lds-spinner");
//loadingScreen.removeClass("d-none");
//loadingScreen.fadeOut(500);
// ===============left nav===============
//#region
let leftNav = $(".left-nav");
let tabsSectionWidth = $(".tabs").innerWidth();

// on reload to get the user attention
leftNav.animate({left: `-${tabsSectionWidth}px`}, 300);

//on button click to open and close the left nav
let openBtn = $(".fa-bars");
let closeBtn = $(".fa-x");

openBtn.click(openLeftNav);
function openLeftNav(){
    //switch between buttons
    openBtn.addClass("d-none");
    closeBtn.removeClass("d-none");

    let leftOfNav = leftNav.css("left");
    // open left nav
    if(leftOfNav == `-${tabsSectionWidth}px`)
        leftNav.animate({left: `0px`}, 300);
}

closeBtn.click(closeLeftNav);
function closeLeftNav(){
    //switch between buttons
    closeBtn.addClass("d-none");
    openBtn.removeClass("d-none");

    let leftOfNav = leftNav.css("left");
    // close left nav
    if(leftOfNav == `0px`)
        leftNav.animate({left: `-${tabsSectionWidth}px`}, 300);
}
//#endregion

// ===============home content on load===============
//#region
let row = $("#homeOnLoad .row");
let meals;
async function getDataOnLoad(){
    loadingScreen.removeClass("d-none");
    let response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
    let Data = await response.json();
    loadingScreen.fadeOut(500);
    meals = Data;
    displayMealsOnLoad();
}
function displayMealsOnLoad(){
    let content = ``;
    for (let i = 0; i < meals.meals.length; i++) {
        if(!(meals.meals[i].strMeal.includes("pork"))){
            content += `
        <div class="meal col-md-3 mt-4" id="${meals.meals[i].idMeal}">
            <div class="food w-100 h-100 position-relative overflow-hidden rounded-2">
                <img src="${meals.meals[i].strMealThumb}" class="w-100 h-100 object-fit-fill position-absolute top-0 start-0" alt="food photo">
                <div class="layer w-100 h-100 d-flex align-items-center position-absolute top-100 start-0">
                    <h2 class="meal-name ms-1">${meals.meals[i].strMeal}</h2>
                </div>
            </div>
        </div>
      `
        }
        
    }
    row.html(content);
}
getDataOnLoad();

//==meal details==
let homeOnLoad = $("#homeOnLoad");
let mealDetailsScreen = $(".meal-details");
let rowDetails = $(".meal-details .row");

row.on("click", ".meal", async function (e) {
    homeOnLoad.addClass("d-none");
    let ID = $(e.currentTarget).attr("id");
    let mealDetails = await getMealDetails(ID);
    displayMealDetails(mealDetails);
});
async function getMealDetails(mealId){
    loadingScreen.removeClass("d-none");
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    let Data = await response.json();
    mealDetailsScreen.removeClass("d-none");screenLocation = mealDetailsScreen;
    loadingScreen.fadeOut(500);
    return Data;
}
function displayMealDetails(mealDetails){
    let ingredients = ``
    for (let i = 1; i <= 20; i++) {
        if (mealDetails.meals[0][`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${mealDetails.meals[0][`strMeasure${i}`]} ${mealDetails.meals[0][`strIngredient${i}`]}</li>`
        }
    }
    
    let tags = mealDetails.meals[0].strTags?.split(",")
    if (!tags) tags = []

    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }
    
    let content = `<div class="col-md-4">
    <img
        class="w-100 rounded-3"
        src="${mealDetails.meals[0].strMealThumb}"
        alt=""
    />
    <h2>${mealDetails.meals[0].strMeal}</h2>
    </div>
    <div class="col-md-8">
    <h2>Instructions</h2>
    <p>${mealDetails.meals[0].strInstructions}</p>
    <h3><span class="fw-bolder">Area : </span>${mealDetails.meals[0].strArea}</h3>
    <h3><span class="fw-bolder">Category : </span>${mealDetails.meals[0].strCategory}</h3>
    <h3>Recipes :</h3>
    <ul class="list-unstyled d-flex g-3 flex-wrap">
        ${ingredients}
    </ul>

    <h3>Tags :</h3>
    <ul class="list-unstyled d-flex g-3 flex-wrap">
        ${tagsStr}
    </ul>

    <a
        target="_blank"
        href="${mealDetails.meals[0].strSource}"
        class="btn btn-success"
        >Source</a
    >
    <a
        target="_blank"
        href="${mealDetails.meals[0].strYoutube}"
        class="btn btn-danger"
        >Youtube</a
    >
    </div>`
    
    rowDetails.html(content);
}

let closeDetailsBtn = $(".fa-xmark");
closeDetailsBtn.click(()=>{
    mealDetailsScreen.addClass("d-none");
    homeOnLoad.removeClass("d-none"); screenLocation = homeOnLoad;
});

//#endregion

// ===============Search for food==============
//#region
let searchScreen = $("#searchForFood");
let searchBtn = $("#search");
searchBtn.click(()=>{
    closeLeftNav();
    screenLocation.addClass("d-none");
    searchScreen.removeClass("d-none");screenLocation = searchScreen;
});

let byNameInput = $("#ByName");
let byFirstLetterInput = $("#ByFirstLetter");
let searchRow = $("#searchForFood .row")

byNameInput.keyup(async (e) => { 
    let inputValue = byNameInput.val();
    loadingScreen.removeClass("d-none");
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`);
    let Data = await response.json();
    loadingScreen.fadeOut(500);
    displaySearchRes(Data);
});
byFirstLetterInput.keyup(async (e) => { 
    let inputValue = byFirstLetterInput.val();
    loadingScreen.removeClass("d-none");
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${inputValue}`);
    let Data = await response.json();
    loadingScreen.fadeOut(500);
    displaySearchRes(Data);
});
function displaySearchRes(meals){
    let content = ``;
    if(meals.meals != null){
        for (let i = 0; i < meals.meals.length; i++) {
            if(!(meals.meals[i].strMeal.includes("pork"))){
                content += `<div class="meal col-md-3 mt-4" id="${meals.meals[i].idMeal}">
                    <div class="food w-100 h-100 position-relative overflow-hidden rounded-2">
                        <img src="${meals.meals[i].strMealThumb}" class="w-100 h-100 object-fit-fill position-absolute top-0 start-0" alt="food photo">
                        <div class="layer w-100 h-100 d-flex align-items-center position-absolute top-100 start-0">
                            <h2 class="meal-name ms-1">${meals.meals[i].strMeal}</h2>
                        </div>
                    </div>
                </div>`;
            }
            
        }
        searchRow.html(content);
    }
}
searchRow.on("click", ".meal", async function (e) {
    searchScreen.addClass("d-none");
    let ID = $(e.currentTarget).attr("id");
    let mealDetails = await getMealDetails(ID);
    displayMealDetails(mealDetails);
});
//#endregion

// ===============Categories section===========
//#region
let categoriesSection = $("#categories");
let categoriesBtn = $("#categoriesBtn");
let categoriesRow = $("#categories .row");

categoriesBtn.click(async ()=>{
    closeLeftNav();
    screenLocation.addClass("d-none");
    categoriesSection.removeClass("d-none");
    loadingScreen.removeClass("d-none");
    screenLocation = categoriesSection;
    let categoriesData = await getCategories();
    displayCategories(categoriesData);
    loadingScreen.fadeOut(500);
});

async function getCategories(){
    let response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
    let Data = await response.json();
    return Data;
}
function displayCategories(categoriesData){
    let content = ``;
    for (let i = 0; i < categoriesData.categories.length; i++) {
        if(!(categoriesData.categories[i].strCategory.includes("pork"))){
            content += `<div class="category col-md-3 mt-2" name="${categoriesData.categories[i].strCategory}">
        <div class="food w-100 h-100 position-relative overflow-hidden rounded-2">
            <img src="${categoriesData.categories[i].strCategoryThumb}" class="w-100 h-100 object-fit-fill position-absolute top-0 start-0" alt="food photo">
            <div class="layer w-100 h-100 d-flex flex-column text-center position-absolute top-100 start-0">
                <h2 class="categ-name ms-1">${categoriesData.categories[i].strCategory}</h2>
                <p class="description">${categoriesData.categories[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
            </div>
        </div>
      </div>`;
        }
        
    }
    categoriesRow.html(content);
}


categoriesRow.on("click", ".category", async function (e) {
    loadingScreen.removeClass("d-none");
    let categoriesData = await getCategoriesFiltered($(e.currentTarget).attr("name"));
    displayFilteredCategories(categoriesData);
    loadingScreen.fadeOut(500);

});
async function getCategoriesFiltered(catName){
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${catName}`);
    let Data = await response.json();
    return Data;
}
function displayFilteredCategories(categoriesData){
    let content = ``;
    for (let i = 0; i < categoriesData.meals.length; i++) {
        if(!(categoriesData.meals[i].strMeal.includes("pork"))){
            content += `<div class="category categ-filtered col-md-3 mt-3" id="${categoriesData.meals[i].idMeal}">
            <div class="food w-100 h-100 position-relative overflow-hidden rounded-2">
                <img src="${categoriesData.meals[i].strMealThumb}" class="w-100 h-100 object-fit-fill position-absolute top-0 start-0" alt="food photo">
                <div class="layer w-100 h-100 d-flex align-items-center position-absolute top-100 start-0">
                    <h2 class="categ-name ms-1">${categoriesData.meals[i].strMeal}</h2>
                </div>
            </div>
        </div>`;
        }
        
    }
    categoriesRow.html(content);
}
categoriesRow.on("click", ".categ-filtered", async function (e) {
    loadingScreen.removeClass("d-none");
    categoriesSection.addClass("d-none");
    let ID = $(e.currentTarget).attr("id");
    let mealDetails = await getMealDetails(ID);
    displayMealDetails(mealDetails);
    loadingScreen.fadeOut(500);
});
//#endregion

// ===============Area section===========
//#region
let areaSection = $("#area");
let areaBtn = $("#areaBtn");
let areaRow = $("#area .row");

areaBtn.click(async ()=>{
    closeLeftNav();
    areaSection.removeClass("d-none");
    screenLocation.addClass("d-none");
    screenLocation = areaSection;
    let Names = await getCountryNames();
    displayCountries(Names);
});

async function getCountryNames(){
    loadingScreen.removeClass("d-none");
    let response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
    let Data = await response.json();
    loadingScreen.fadeOut(500);
    return Data;
}
function displayCountries(Names){
    let content = ``;
    for (let i = 0; i < Names.meals.length; i++) {
        content += `<div name="${Names.meals[i].strArea}" class="country-name col-md-3 d-flex flex-column align-items-center mt-5 text-white cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-5x"></i>
                        <h2 class="country-name">${Names.meals[i].strArea}</h2>
                    </div>`;
    }
    areaRow.html(content);
}

async function getCountryData(Name){
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${Name}`);
    let Data = await response.json();
    return Data;
}
function displayCountryData(cData){
    let content = ``;
    for (let i = 0; i < cData.meals.length; i++) {
        if(!(cData.meals[i].strMeal.includes("pork"))){
            content += `<div class="meal categ-meal col-md-3 mt-4" id="${cData.meals[i].idMeal}">
            <div class="food w-100 h-100 position-relative overflow-hidden rounded-2">
                <img src="${cData.meals[i].strMealThumb}" class="w-100 h-100 object-fit-fill position-absolute top-0 start-0" alt="food photo">
                <div class="layer w-100 h-100 d-flex align-items-center position-absolute top-100 start-0">
                    <h2 class="meal-name ms-1">${cData.meals[i].strMeal}</h2>
                </div>
            </div>
        </div>`;
        }
        
    }
    areaRow.html(content);
}
areaRow.on("click", ".country-name", async function (e) {
    loadingScreen.removeClass("d-none");
    let countryData = await getCountryData($(e.currentTarget).attr("name"));
    displayCountryData(countryData);
    loadingScreen.fadeOut(500);

});
areaRow.on("click", ".categ-meal", async function (e) {
    loadingScreen.removeClass("d-none");
    areaSection.addClass("d-none");
    let ID = $(e.currentTarget).attr("id");
    let mealDetails = await getMealDetails(ID);
    displayMealDetails(mealDetails);
    loadingScreen.fadeOut(500);
});
//#endregion

// ===============Ingrediants section=========
//#region
let ingredientsSection = $("#ingrediants");
let ingredientsBtn = $("#ingredientsBtn");
let ingredientsRow = $("#ingrediants .row");

ingredientsBtn.click(async ()=>{
    closeLeftNav();
    ingredientsSection.removeClass("d-none")
    screenLocation.addClass("d-none");
    screenLocation = ingredientsSection;
    let ingredients = await getIngredients();
    displayIngredients(ingredients);
});

async function getIngredients(){
    loadingScreen.removeClass("d-none");
    let response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
    let Data = await response.json();
    loadingScreen.fadeOut(500);
    return Data;
}
function displayIngredients(ingredients){
    let content = ``;
    for (let i = 0; i < ingredients.meals.length; i++) {
        if(!(ingredients.meals[i].strIngredient.includes("pork"))){
            let description = ingredients.meals[i].strDescription ? ingredients.meals[i].strDescription.split(" ").slice(0, 20).join(" ") : '';
            content += `<div name="${ingredients.meals[i].strIngredient}" class="ingred col-md-3 d-flex flex-column align-items-center mt-4 text-white cursor-pointer">
            <i class="fa-solid fa-drumstick-bite fa-4x"></i>
            <h2>${ingredients.meals[i].strIngredient}</h2>
            <p>${description}</p>
          </div>`;
        }
    }
    ingredientsRow.html(content);
}

ingredientsRow.on("click", ".ingred", async function (e) {
    loadingScreen.removeClass("d-none");
    console.log($(e.currentTarget).attr("name"));
    let ingredientsData = await getIngredientsData($(e.currentTarget).attr("name"));
    displayIngredientsData(ingredientsData);
    loadingScreen.fadeOut(500);
});


async function getIngredientsData(name){
    loadingScreen.removeClass("d-none");
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${name}`);
    let Data = await response.json();
    loadingScreen.fadeOut(500);
    return Data;
}
function displayIngredientsData(ingredData){
    let content = ``;
    for (let i = 0; i < ingredData.meals.length; i++) {
        content += `<div class="meal ingrediant-meal col-md-3 mt-4" id="${ingredData.meals[i].idMeal}">
        <div class="food w-100 h-100 position-relative overflow-hidden rounded-2">
            <img src="${ingredData.meals[i].strMealThumb}" class="w-100 h-100 object-fit-fill position-absolute top-0 start-0" alt="food photo">
            <div class="layer w-100 h-100 d-flex align-items-center position-absolute top-100 start-0">
                <h2 class="meal-name ms-1">${ingredData.meals[i].strMeal}</h2>
            </div>
        </div>
    </div>`;
    }
    ingredientsRow.html(content);
}

async function getMealDetailsIngred(mealId){
    loadingScreen.removeClass("d-none");
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    let Data = await response.json();
    ingredientsSection.removeClass("d-none");screenLocation = ingredientsSection;
    loadingScreen.fadeOut(500);
    return Data;
}
function displayMealDetailsIngred(mealDetails){
    let ingredients = ``
    for (let i = 1; i <= 20; i++) {
        if (mealDetails.meals[0][`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${mealDetails.meals[0][`strMeasure${i}`]} ${mealDetails.meals[0][`strIngredient${i}`]}</li>`
        }
    }
    
    let tags = mealDetails.meals[0].strTags?.split(",")
    if (!tags) tags = []

    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }
    
    let content = `<div class="col-md-4 text-white">
    <img
        class="w-100 rounded-3"
        src="${mealDetails.meals[0].strMealThumb}"
        alt=""
    />
    <h2>${mealDetails.meals[0].strMeal}</h2>
    </div>
    <div class="col-md-8">
    <h2>Instructions</h2>
    <p>${mealDetails.meals[0].strInstructions}</p>
    <h3><span class="fw-bolder">Area : </span>${mealDetails.meals[0].strArea}</h3>
    <h3><span class="fw-bolder">Category : </span>${mealDetails.meals[0].strCategory}</h3>
    <h3>Recipes :</h3>
    <ul class="list-unstyled d-flex g-3 flex-wrap">
        ${ingredients}
    </ul>

    <h3>Tags :</h3>
    <ul class="list-unstyled d-flex g-3 flex-wrap">
        ${tagsStr}
    </ul>

    <a
        target="_blank"
        href="${mealDetails.meals[0].strSource}"
        class="btn btn-success"
        >Source</a
    >
    <a
        target="_blank"
        href="${mealDetails.meals[0].strYoutube}"
        class="btn btn-danger"
        >Youtube</a
    >
    </div>`
    
    ingredientsRow.html(content);
}
ingredientsRow.on("click", ".ingrediant-meal", async function (e) {
    console.log("hi");
    loadingScreen.removeClass("d-none");
    ingredientsSection.addClass("d-none");
    let ID = $(e.currentTarget).attr("id");
    let mealDetails = await getMealDetailsIngred(ID);
    displayMealDetailsIngred(mealDetails);
    loadingScreen.fadeOut(500);
});
//#endregion

// =============== contact section ===========
//#region
let contactSection = $(".contact");
let contactBtn = $("#contactBtn");
let contactRow = $(".contact .row");

contactBtn.click(async ()=>{
    closeLeftNav();
    contactSection.removeClass("d-none")
    screenLocation.addClass("d-none");
    screenLocation = contactSection;
    showContacts();
});
function showContacts() {
    contactRow.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `
    submitBtn = document.getElementById("submitBtn")


    document.getElementById("nameInput").addEventListener("focus", () => {
        nameInputTouched = true
    })

    document.getElementById("emailInput").addEventListener("focus", () => {
        emailInputTouched = true
    })

    document.getElementById("phoneInput").addEventListener("focus", () => {
        phoneInputTouched = true
    })

    document.getElementById("ageInput").addEventListener("focus", () => {
        ageInputTouched = true
    })

    document.getElementById("passwordInput").addEventListener("focus", () => {
        passwordInputTouched = true
    })

    document.getElementById("repasswordInput").addEventListener("focus", () => {
        repasswordInputTouched = true
    })
}

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;




function inputsValidation() {
    if (nameInputTouched) {
        if (nameValidation()) {
            document.getElementById("nameAlert").classList.replace("d-block", "d-none")

        } else {
            document.getElementById("nameAlert").classList.replace("d-none", "d-block")

        }
    }
    if (emailInputTouched) {

        if (emailValidation()) {
            document.getElementById("emailAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("emailAlert").classList.replace("d-none", "d-block")

        }
    }

    if (phoneInputTouched) {
        if (phoneValidation()) {
            document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("phoneAlert").classList.replace("d-none", "d-block")

        }
    }

    if (ageInputTouched) {
        if (ageValidation()) {
            document.getElementById("ageAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("ageAlert").classList.replace("d-none", "d-block")

        }
    }

    if (passwordInputTouched) {
        if (passwordValidation()) {
            document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("passwordAlert").classList.replace("d-none", "d-block")

        }
    }
    if (repasswordInputTouched) {
        if (repasswordValidation()) {
            document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")

        }
    }


    if (nameValidation() &&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        repasswordValidation()) {
        submitBtn.removeAttribute("disabled")
    } else {
        submitBtn.setAttribute("disabled", true)
    }
}

function nameValidation() {
    return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value))
}

function emailValidation() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value))
}

function phoneValidation() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value))
}

function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value))
}

function passwordValidation() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value))
}

function repasswordValidation() {
    return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
}
//#endregion



