
import config from "../conf/index.js";

//Implementation to extract city from query params
function getCityFromURL(search) {
  // TODO: MODULE_ADVENTURES
  // 1. Extract the city id from the URL's Query Param and return it

  let pos = search.search('=');
  return search.slice(pos+1);
}

//Implementation of fetch call with a paramterized input based on city
async function fetchAdventures(city) {
  // TODO: MODULE_ADVENTURES
  // 1. Fetch adventures using the Backend API and return the data

  var url = config.backendEndpoint + "/adventures?city=" + city;
  try{
    let obj = await fetch(url)
    .then(res => res.json());
    return obj;
  }catch(err){
    return null; 
  }
}

//Implementation of DOM manipulation to add adventures for the given city from list of adventures
function addAdventureToDOM(adventures) {
  // TODO: MODULE_ADVENTURES
  // 1. Populate the Adventure Cards and insert those details into the DOM

  for(var i=0; i<adventures.length; i++){
    var href_ = document.createElement("a");
    href_.setAttribute("href", "detail/?adventure=" + adventures[i].id);
    href_.setAttribute("id", adventures[i].id);

    var image_ = document.createElement("img");
    image_.setAttribute("src", adventures[i].image);
    href_.appendChild(image_);
    
    var div1 = document.createElement("div");
    div1.appendChild(href_);
    div1.setAttribute("class", "col-sm-3 col-6 activity-card");
    div1.setAttribute("style", "padding: 0px 0px;");

    var banner = document.createElement("p");
    banner.setAttribute("class", "category-banner");
    banner.innerHTML = adventures[i].category;

    var div2 = document.createElement("div");
    div2.setAttribute("class", "card-body container");
    var p1,p2,p3,p4;

    var div3 = document.createElement("div");
    div3.setAttribute("class", "row");
    p1 = document.createElement("p");
    p1.setAttribute("class", "col-md-8");
    p1.innerHTML = adventures[i].name;
    p2 = document.createElement("p");
    p2.setAttribute("class", "col-md-4");
    p2.innerHTML = "₹ " + adventures[i].costPerHead;
    div3.appendChild(p1);
    div3.appendChild(p2);
    div2.appendChild(div3);
    
    var div4 = document.createElement("div");
    div4.setAttribute("class", "row");
    p3 = document.createElement("p");
    p3.setAttribute("class", "col-sm-8");
    p3.innerHTML = "Duration";
    p4 = document.createElement("p");
    p4.setAttribute("class", "col-sm-4");
    p4.innerHTML = adventures[i].duration + " Hours";
    div4.appendChild(p3);
    div4.appendChild(p4);
    div2.appendChild(div4);
    
    div1.appendChild(banner);
    div1.appendChild(div2);

    var main = document.getElementById("data");
    main.appendChild(div1);
  }
}

//Implementation of filtering by duration which takes in a list of adventures, the lower bound and upper bound of duration and returns a filtered list of adventures.
function filterByDuration(list, low, high) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on Duration and return filtered list

  list = list.filter(item => (item.duration >= low && item.duration <= high));
  return list;
}

//Implementation of filtering by category which takes in a list of adventures, list of categories to be filtered upon and returns a filtered list of adventures.
function filterByCategory(list, categoryList) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on their Category and return filtered list
  var ans = [];
  for(var i=0; i<list.length; i++){
    for(var j=0; j<categoryList.length; j++){
      if(list[i].category == categoryList[j])  ans.push(list[i]);
    }
  }
  return ans;
}

// filters object looks like this filters = { duration: "", category: [] };

//Implementation of combined filter function that covers the following cases :
// 1. Filter by duration only
// 2. Filter by category only
// 3. Filter by duration and category together

function filterFunction(list, filters) {
  // TODO: MODULE_FILTERS
  // 1. Handle the 3 cases detailed in the comments above and return the filtered list of adventures
  // 2. Depending on which filters are needed, invoke the filterByDuration() and/or filterByCategory() methods
  
  if(filters.duration.length > 0 && filters.category.length > 0){
    list = filterByCategory(list, filters.category);
    var pos = filters.duration.search('-');
    list = filterByDuration(list, filters.duration.slice(0, pos), filters.duration.slice(pos+1));
  }
  else if(filters.duration.length > 0){
    var pos = filters.duration.search('-');
    list = filterByDuration(list, filters.duration.slice(0, pos), filters.duration.slice(pos+1));
  }
  else if(filters.category.length > 0){
    list = filterByCategory(list, filters.category);
  }

  // Place holder for functionality to work in the Stubs
  return list;
}

//Implementation of localStorage API to save filters to local storage. This should get called everytime an onChange() happens in either of filter dropdowns
function saveFiltersToLocalStorage(filters) {
  // TODO: MODULE_FILTERS
  // 1. Store the filters to localStorage using JSON.stringify() 1
  filters = JSON.stringify(filters);
  window.localStorage.setItem('filters', filters);
  //return true;
}

//Implementation of localStorage API to get filters from local storage. This should get called whenever the DOM is loaded.
function getFiltersFromLocalStorage() {
  // TODO: MODULE_FILTERS
  // 1. Get the filters from localStorage and return in JSON format
  let data = window.localStorage.getItem("filters");
  data = JSON.parse(data);
  // Place holder for functionality to work in the Stubs
  return data;
}

//Implementation of DOM manipulation to add the following filters to DOM :
// 1. Update duration filter with correct value
// 2. Update the category pills on the DOM

function generateFilterPillsAndUpdateDOM(filters) {
  // TODO: MODULE_FILTERS
  // 1. Use the filters given as input, update the Duration Filter and Generate Category Pills
  if(filters.category.length > 0){
    var ul = document.createElement("ul");
    ul.setAttribute("class", "nav nav-pills");
    ul.setAttribute("id", "pill-list");

    for(var i=0; i<filters.category.length; i++){
      var li = document.createElement("li");
      li.setAttribute("class", "category-filter");
      li.innerHTML = filters.category[i];
      ul.appendChild(li);
    }

    //var main= document.getElementById("data");
    var div = document.getElementById("category-list");
    //console.log(div);
    div.appendChild(ul);
  }

}
export {
  getCityFromURL,
  fetchAdventures,
  addAdventureToDOM,
  filterByDuration,
  filterByCategory,
  filterFunction,
  saveFiltersToLocalStorage,
  getFiltersFromLocalStorage,
  generateFilterPillsAndUpdateDOM,
};
