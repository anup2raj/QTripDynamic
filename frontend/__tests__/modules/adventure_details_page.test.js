import {
  fetchAdventureDetails,
  getAdventureIdFromURL,
  addAdventureDetailsToDOM,
  conditionalRenderingOfReservationPanel,
  addBootstrapPhotoGallery,
  calculateReservationCostAndUpdateDOM,
  showBannerIfAlreadyReserved,
  captureFormSubmitUsingJQuery,
} from "../../modules/adventure_details_page.js";
require("jest-fetch-mock").enableMocks();
global.jQuery = require("jquery");
global.$ = global.jQuery;

const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(
  path.resolve(__dirname, "../../pages/adventures/detail/index.html"),
  "utf8"
);
jest.dontMock("fs");
jest.spyOn(window, "alert").mockImplementation(() => {});

function ajax_response(response, success) {
  return function (params) {
    if (success) {
      params.success(response);
    } else {
      params.error(response);
    }
  };
}

describe("Adventure Detail Page Tests", function () {
  const { reload } = window.location;
  beforeAll(() => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: { reload: jest.fn() },
    });
  });

  afterAll(() => {
    window.location.reload = reload;
  });

  beforeEach(() => {
    fetch.resetMocks();
    document.documentElement.innerHTML = html.toString();
  });

  afterEach(() => {
    jest.resetModules();
  });

  it("Extract city from URL Params", async () => {
    const adventure = await getAdventureIdFromURL("?adventure=123");
    expect(adventure).toEqual("123");
  });

  it("Check if fetch call for the adventure details was made and data was received", async () => {
    const data = await fetchAdventureDetails("123");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("?adventure=123")
    );
  });

  it("Catches errors and returns null", async () => {
    fetch.mockReject(() => "API failure");

    const data = await fetchAdventureDetails("123");
    expect(data).toEqual(null);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("?adventure=123")
    );
  });

  it("Tries adding a Adventure Details - Park", function () {
    let adventure = {
      id: "6298356896",
      name: "Grand Dinyardlodge",
      subtitle: "This is a mind-blowing adventure!",
      images: [
        "https://images.pexels.com/photos/3061171/pexels-photo-3061171.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
        "https://images.pexels.com/photos/2583852/pexels-photo-2583852.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      ],
      content:
        "A random paragraph can also be an excellent way for a writer to tackle writers' block. Writing block can often happen due to being stuck with a current project that the writer is trying to complete.",
      available: true,
      reserved: false,
      costPerHead: 1000,
    };
    addAdventureDetailsToDOM(adventure);
    expect(document.getElementById("adventure-name").innerHTML).toBe(
      adventure.name
    );
    expect(document.getElementById("adventure-subtitle").innerHTML).toBe(
      adventure.subtitle
    );
    expect(document.getElementsByClassName("activity-card-image").length).toBe(
      adventure.images.length
    );
  });

  it("Check if bootstrap gallery is working", function () {
    let images = [
      "https://images.pexels.com/photos/3061171/pexels-photo-3061171.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/2583852/pexels-photo-2583852.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/3061171/pexels-photo-3061171.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/3061171/pexels-photo-3061171.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      "https://images.pexels.com/photos/3061171/pexels-photo-3061171.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    ];
    addBootstrapPhotoGallery(images);

    expect(document.getElementsByClassName("carousel slide")).toBeTruthy();
    expect(document.getElementsByClassName("carousel-item").length).toBe(
      images.length
    );
    expect(document.getElementsByClassName("carousel-item active").length).toBe(
      1
    );
    expect(document.getElementsByClassName("carousel slide").length).toBe(1);
  });

  it("Check if conditional rendering is working", function () {
    let adventure = {
      id: "6298356896",
      name: "Grand Dinyardlodge",
      subtitle: "This is a mind-blowing adventure!",
      images: [
        "https://images.pexels.com/photos/3061171/pexels-photo-3061171.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
        "https://images.pexels.com/photos/2583852/pexels-photo-2583852.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      ],
      content:
        "A random paragraph can also be an excellent way for a writer to tackle writers' block. Writing block can often happen due to being stuck with a current project that the writer is trying to complete.",
      available: true,
      reserved: false,
      costPerHead: 1000,
    };
    conditionalRenderingOfReservationPanel(adventure);

    expect(
      document.getElementById("reservation-panel-available").style.display
    ).toBe("block");
    expect(
      document.getElementById("reservation-panel-sold-out").style.display
    ).toBe("none");
    expect(document.getElementById("reservation-person-cost").innerHTML).toBe(
      String(adventure.costPerHead)
    );

    adventure = {
      id: "6298356896",
      name: "Grand Dinyardlodge",
      subtitle: "This is a mind-blowing adventure!",
      images: [
        "https://images.pexels.com/photos/3061171/pexels-photo-3061171.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
        "https://images.pexels.com/photos/2583852/pexels-photo-2583852.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      ],
      content:
        "A random paragraph can also be an excellent way for a writer to tackle writers' block. Writing block can often happen due to being stuck with a current project that the writer is trying to complete.",
      available: false,
      reserved: false,
      costPerHead: 1000,
    };
    conditionalRenderingOfReservationPanel(adventure);

    expect(
      document.getElementById("reservation-panel-available").style.display
    ).toBe("none");
    expect(
      document.getElementById("reservation-panel-sold-out").style.display
    ).toBe("block");
  });

  it("Check if reservation cost is calculated correctly and updated in DOM", function () {
    let adventure = {
      id: "6298356896",
      name: "Grand Dinyardlodge",
      subtitle: "This is a mind-blowing adventure!",
      images: [
        "https://images.pexels.com/photos/3061171/pexels-photo-3061171.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
        "https://images.pexels.com/photos/2583852/pexels-photo-2583852.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      ],
      content:
        "A random paragraph can also be an excellent way for a writer to tackle writers' block. Writing block can often happen due to being stuck with a current project that the writer is trying to complete.",
      available: true,
      reserved: false,
      costPerHead: 1234,
    };
    let persons = 63;
    calculateReservationCostAndUpdateDOM(adventure, persons);

    expect(document.getElementById("reservation-cost").innerHTML).toBe(
      String(77742)
    );
  });

  it("Check if reservation banner is displayed", function () {
    let adventure = {
      id: "6298356896",
      name: "Grand Dinyardlodge",
      subtitle: "This is a mind-blowing adventure!",
      images: [
        "https://images.pexels.com/photos/3061171/pexels-photo-3061171.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
        "https://images.pexels.com/photos/2583852/pexels-photo-2583852.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      ],
      content:
        "A random paragraph can also be an excellent way for a writer to tackle writers' block. Writing block can often happen due to being stuck with a current project that the writer is trying to complete.",
      available: true,
      reserved: true,
      costPerHead: 1000,
    };
    showBannerIfAlreadyReserved(adventure);

    expect(document.getElementById("reserved-banner").style.display).toBe(
      "block"
    );

    adventure = {
      id: "6298356896",
      name: "Grand Dinyardlodge",
      subtitle: "This is a mind-blowing adventure!",
      images: [
        "https://images.pexels.com/photos/3061171/pexels-photo-3061171.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
        "https://images.pexels.com/photos/2583852/pexels-photo-2583852.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      ],
      content:
        "A random paragraph can also be an excellent way for a writer to tackle writers' block. Writing block can often happen due to being stuck with a current project that the writer is trying to complete.",
      available: false,
      reserved: false,
      costPerHead: 1000,
    };
    showBannerIfAlreadyReserved(adventure);

    expect(document.getElementById("reserved-banner").style.display).toBe(
      "none"
    );
  });
  it("Check if JQuery form submission is taking place", function () {
    let adventure = {
      id: "6298356896",
      name: "Grand Dinyardlodge",
      subtitle: "This is a mind-blowing adventure!",
      images: [
        "https://images.pexels.com/photos/3061171/pexels-photo-3061171.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
        "https://images.pexels.com/photos/2583852/pexels-photo-2583852.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      ],
      content:
        "A random paragraph can also be an excellent way for a writer to tackle writers' block. Writing block can often happen due to being stuck with a current project that the writer is trying to complete.",
      available: true,
      reserved: false,
      costPerHead: 1234,
    };

    captureFormSubmitUsingJQuery(adventure);

    $.ajax = ajax_response('{ "response": "Dummy response." }', false);
    $("#myForm").trigger("submit");
    expect(window.alert).toHaveBeenCalledWith("Failed!");
    expect(window.location.reload).toHaveBeenCalledTimes(0);

    $.ajax = ajax_response('{ "response": "Dummy response." }', true);
    $("#myForm").trigger("submit");
    expect(window.alert).toHaveBeenCalledWith("Success!");
    expect(window.location.reload).toHaveBeenCalled();
  });

});
