import config from "../conf/index.js";

//Implementation to extract adventure ID from query params
function getAdventureIdFromURL(search) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Get the Adventure Id from the URL
  let pos = search.search('=');
  return search.slice(pos+1);

  // Place holder for functionality to work in the Stubs
  //return null;
}
//Implementation of fetch call with a paramterized input based on adventure ID
async function fetchAdventureDetails(adventureId) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Fetch the details of the adventure by making an API call
  var url = config.backendEndpoint + "/adventures/detail?adventure=" + adventureId;
  try{
    let obj = await fetch(url)
    .then(res => res.json());
    return obj;
  }catch(err){
    return null; 
  }

  // Place holder for functionality to work in the Stubs
  //return null;
}

//Implementation of DOM manipulation to add adventure details to DOM
function addAdventureDetailsToDOM(adventure) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Add the details of the adventure to the HTML DOM

  var head = document.getElementById("adventure-name");
  head.innerHTML = adventure.name;

  var subhead = document.getElementById("adventure-subtitle");
  subhead.innerHTML = adventure.subtitle;
  
  var gallery = document.getElementById("photo-gallery");
  
  for(var i=0; i<adventure.images.length; i++){
    var div = document.createElement("div");
    var image = document.createElement("img");
    if(i == 0)  image.setAttribute("id", "img_1");
    image.setAttribute("src", adventure.images[i]);
    image.setAttribute("class", "activity-card-image");
    div.appendChild(image);
    gallery.appendChild(div);
  }

  var exp = document.getElementById("adventure-content");
  exp.innerHTML = adventure.content;
}

//Implementation of bootstrap gallery component
function addBootstrapPhotoGallery(images) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Add the bootstrap carousel to show the Adventure images
  var div = document.getElementById("photo-gallery");
  var inner_div = document.createElement("div");
  inner_div.setAttribute("class","carousel-inner");
  
  //console.log(images);
  //console.log(div.childNodes.length);
  var n = div.childNodes.length;
  for(var i=0; i<n; i++){
    var gallery = document.getElementById("photo-gallery").firstChild;
    gallery.remove();
  }

  var f=0;
  for(var i=0; i<images.length; i++){
    var div_in = document.createElement("div");
    var image = document.createElement("img");
    if(i == 0)  image.setAttribute("id", "img_1");
    image.setAttribute("src", images[i]);
    image.setAttribute("class", "activity-card-image");
    div_in.appendChild(image);
    if(f == 0)  div_in.setAttribute("class","carousel-item active");
    else  div_in.setAttribute("class","carousel-item");
    f=1;
    inner_div.appendChild(div_in);
  }

  inner_div.firstChild.setAttribute("class","carousel-item active");
  div.appendChild(inner_div);
  
  var div = document.getElementById("photo-gallery");
  div.setAttribute("class", "row mb-3 carousel slide");
  div.setAttribute("data-ride", "carousel");
  
  var a1 = document.createElement("a");
  a1.setAttribute("class", "carousel-control-prev");
  a1.setAttribute("href", "#photo-gallery");
  a1.setAttribute("data-slide", "prev");

  var span1 = document.createElement("span");
  span1.setAttribute("class", "carousel-control-prev-icon");
  a1.appendChild(span1);

  var a2 = document.createElement("a");
  a2.setAttribute("class", "carousel-control-next");
  a2.setAttribute("href", "#photo-gallery");
  a2.setAttribute("data-slide", "next");

  var span2 = document.createElement("span");
  span2.setAttribute("class", "carousel-control-next-icon");
  a2.appendChild(span2);

  div.appendChild(a1);
  div.appendChild(a2);

  var ul = document.createElement("ul");
  ul.setAttribute("class", "carousel-indicators");
  for(var i=0; i<images.length; i++){
    var li = document.createElement("li");
    li.setAttribute("data-target", "#photo-gallery");
    li.setAttribute("data-slide-to", i);
    if(i == 0)  li.setAttribute("class", "active");
    ul.appendChild(li);
  }
  div.appendChild(ul);
  var ul = document.createElement("p");
}

//Implementation of conditional rendering of DOM based on availability
function conditionalRenderingOfReservationPanel(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. If the adventure is already reserved, display the sold-out message.
  // adventure.available
  if(adventure.available){
    document.getElementById("reservation-panel-sold-out").style.display = "none";
    document.getElementById("reservation-panel-available").style.display = "block";
    var cost = document.getElementById("reservation-person-cost");
    cost.innerHTML = adventure.costPerHead;
  }
  else{
    document.getElementById("reservation-panel-available").style.display = "none";
    document.getElementById("reservation-panel-sold-out").style.display = "block";
  }
}

//Implementation of reservation cost calculation based on persons
function calculateReservationCostAndUpdateDOM(adventure, persons) {
  // TODO: MODULE_RESERVATIONS
  // 1. Calculate the cost based on number of persons and update the reservation-cost field
  
  var sum = adventure.costPerHead * persons;
  document.getElementById("reservation-cost").innerHTML = sum;
}

//Implementation of reservation form submission using JQuery
function captureFormSubmitUsingJQuery(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. Capture the query details and make a POST API call using JQuery to make the reservation

    $("#myForm").on("submit", function(event){
      event.preventDefault();
      
      $.ajax({
        url: config.backendEndpoint + "/reservations/new",
        type: "post",
        dataType: "json",
        data: $("#myForm").serialize() + `&adventure=${adventure.id}`,
        success: function(res){
          alert("Success!");
          window.location.reload();
        },
        error: function(res){
          alert("Failed!");
        }
      })
    });
  
  // 2. If the reservation is successful, show an alert with "Success!" and refresh the page. If the reservation fails, just show an alert with "Failed!".
}

//Implementation of success banner after reservation
function showBannerIfAlreadyReserved(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. If user has already reserved this adventure, show the reserved-banner, else don't

  if(adventure.reserved){
    document.getElementById("reserved-banner").style.display = "block";
  }
  else{
    document.getElementById("reserved-banner").style.display = "none";
  }
}

export {
  getAdventureIdFromURL,
  fetchAdventureDetails,
  addAdventureDetailsToDOM,
  addBootstrapPhotoGallery,
  conditionalRenderingOfReservationPanel,
  captureFormSubmitUsingJQuery,
  calculateReservationCostAndUpdateDOM,
  showBannerIfAlreadyReserved,
};
