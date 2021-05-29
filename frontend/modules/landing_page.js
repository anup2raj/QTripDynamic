import config from "../conf/index.js";

async function init() {
  //Fetches list of all cities along with their images and description
  let cities = await fetchCities();

  //Updates the DOM with the cities
  cities.forEach((key) => {
    addCityToDOM(key.id, key.city, key.description, key.image);
  });
}

//import url from "../conf/index.js";
//Implementation of fetch call
async function fetchCities() {
  // TODO: MODULE_CITIES
  // 1. Fetch cities using the Backend API and return the data
  
  try{
    var obj = await fetch(config.backendEndpoint + "/cities")
    .then(res => res.json());
    return obj;
  }catch(err){
    //console.log(err);
    return null;
  };
}

//Implementation of DOM manipulation to add cities
function addCityToDOM(id, city, description, image) {
  // TODO: MODULE_CITIES
  // 1. Populate the City details and insert those details into the DOM

  var href_ = document.createElement("a");
  href_.setAttribute("href", "pages/adventures/?city="+id);
  href_.setAttribute("id", id);

  var image_ = document.createElement("img");
  var city_ = document.createElement("h5");
  city_.innerHTML = city;
  var description_ = document.createElement("h5");
  description_.innerHTML = description;

  image_.setAttribute("src", image);
  href_.appendChild(image_);

  var div1 = document.createElement("div");
  div1.appendChild(href_);
  div1.setAttribute("class", "card col-sm-3 col-6 tile");
  div1.setAttribute("style", "border: 0px;");

  var div2 = document.createElement("div");
  div2.appendChild(city_);
  div2.appendChild(description_);
  div2.setAttribute("class", "tile-text");
  div1.appendChild(div2);
  
  var main = document.getElementById("data");
  main.appendChild(div1);
}

export { init, fetchCities, addCityToDOM };
