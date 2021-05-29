import config from "../conf/index.js";

//Implementation of fetch call to fetch all reservations
async function fetchReservations() {
  // TODO: MODULE_RESERVATIONS
  // 1. Fetch Reservations by invoking the REST API and return them

  var url = config.backendEndpoint + "/reservations/";
  try{
    let obj = await fetch(url)
    .then(res => res.json());
    return obj;
  }catch(err){
    return null; 
  }
  // Place holder for functionality to work in the Stubs
  return null;
}

//Function to add reservations to the table. Also; in case of no reservations, display the no-reservation-banner, else hide it.
function addReservationToTable(reservations) {
  // TODO: MODULE_RESERVATIONS
  // 1. Add the Reservations to the HTML DOM so that they show up in the table

  //Conditionally render the no-reservation-banner and reservation-table-parent
  
  if(reservations.length == 0){
    document.getElementById("no-reservation-banner").style.display = "block";
    document.getElementById("reservation-table-parent").style.display = "none";
  }
  else{
    document.getElementById("no-reservation-banner").style.display = "none";
    document.getElementById("reservation-table-parent").style.display = "block";
  }
  /*
    Iterating over reservations, adding it to table (into div with class "reservation-table") and link it correctly to respective adventure
    The last column of the table should have a "Visit Adventure" button with id=<reservation-id>, class=reservation-visit-button and should link to respective adventure page

    Note:
    1. The date of adventure booking should appear in the format D/MM/YYYY (en-IN format) Example:  4/11/2020 denotes 4th November, 2020
    2. The booking time should appear in a format like 4 November 2020, 9:32:31 pm
  */

  var table = document.getElementById("reservation-table");
  for(var i=0; i<reservations.length; i++){
    var tr = document.createElement("tr");
  
    var id = document.createElement("td");
    id.setAttribute("scope","col");
    id.innerHTML = reservations[i].id;
    tr.appendChild(id);

    var name = document.createElement("td");
    name.setAttribute("scope","col");
    name.innerHTML = reservations[i].name;
    tr.appendChild(name);

    var adventureName = document.createElement("td");
    adventureName.setAttribute("scope","col");
    adventureName.innerHTML = reservations[i].adventureName;
    tr.appendChild(adventureName);

    var person = document.createElement("td");
    person.setAttribute("scope","col");
    person.innerHTML = reservations[i].person;
    tr.appendChild(person);

    var date = document.createElement("td");
    date.setAttribute("scope","col");
    var d = new Date(reservations[i].date);
    var day = d.getDate();
    var mon = d.getMonth()+1;
    var yy = d.getFullYear();
    date.innerHTML = day +"/"+ mon +"/"+ yy;
    tr.appendChild(date);

    var price = document.createElement("td");
    price.setAttribute("scope","col");
    price.innerHTML = reservations[i].price;
    tr.appendChild(price);

    var time = document.createElement("td");
    time.setAttribute("scope","col");
    var d = new Date(reservations[i].time);
    var day = d.getDate();
    var mon = d.getMonth();
    var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var yy = d.getFullYear();
    d = d.toLocaleString().toLowerCase();
    var pos = d.search(",");
    d = d.slice(pos+1);
    time.innerHTML = day +" "+ month[mon] +" "+ yy+ ","+d;
    tr.appendChild(time);

    // /pages/adventures/detail/?adventure=
    var adventure = document.createElement("td");
    adventure.setAttribute("scope","col");
    var a = document.createElement("a");
    a.setAttribute("href","../detail/?adventure=" + reservations[i].adventure);
    adventure.setAttribute("id", reservations[i].id);
    a.setAttribute("class", "reservation-visit-button");
    a.innerHTML = "Visit Adventure";
    adventure.appendChild(a);
    tr.appendChild(adventure);
    
    table.appendChild(tr);
  }
}

export { fetchReservations, addReservationToTable };
