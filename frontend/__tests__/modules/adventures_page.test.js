
import {
  getCityFromURL,
  fetchAdventures,
  addAdventureToDOM,
  filterByDuration,
  filterByCategory,
  filterFunction,
  saveFiltersToLocalStorage,
  getFiltersFromLocalStorage,
} from "../../modules/adventures_page.js";

require("jest-fetch-mock").enableMocks();

const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(
  path.resolve(__dirname, "../../pages/adventures/index.html"),
  "utf8"
);
jest.dontMock("fs");

Storage.prototype.getItem = jest.fn(() => expectedPayload);

describe("Adventure Page Tests", function () {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null),
      },
      writable: true,
    });
    fetch.resetMocks();
    document.documentElement.innerHTML = html.toString();
  });

  afterEach(() => {
    // restore the original func after test
    jest.resetModules();
  });

  it("Extract city from URL Params", async () => {
    const city = await getCityFromURL("?city=london");
    expect(city).toEqual("london");
  });

  it("Check if fetch call for the adventures was made and data was received", async () => {
    const data = await fetchAdventures("bengaluru");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("?city=bengaluru")
    );
  });

  it("Catches errors and returns null", async () => {
    fetch.mockReject(() => "API failure");

    const data = await fetchAdventures("bengaluru");
    expect(data).toEqual(null);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("?city=bengaluru")
    );
  });
  it("Tries adding a new Adventure - Park", function () {
    addAdventureToDOM([
      {
        category: "park",
        costPerHead: 20,
        currency: "INR",
        duration: 4,
        image: "",
        name: "park",
        id: "park",
      },
    ]);
    expect(document.getElementById("park")).toBeTruthy();
  });

  it("Check if City Card is linked correctly to Adventures page", function () {
    const expected = "/detail/?adventure=123456";

    addAdventureToDOM([
      {
        category: "park",
        costPerHead: 20,
        currency: "INR",
        duration: 4,
        image: "",
        name: "park",
        id: "123456",
      },
    ]);
    expect(document.getElementById("123456").href).toEqual(
      expect.stringContaining(expected)
    );
  });

  it("Check if filter by duration is working", function () {
    const expected = [
      {
        id: "3091807927",
        name: "East Phisphoe",
        price: "500",
        currency: "INR",
        image:
          "https://images.pexels.com/photos/3380805/pexels-photo-3380805.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        duration: 10,
        category: "Beaches",
      },
    ];
    const input = [
      {
        id: "3091807927",
        name: "East Phisphoe",
        price: "500",
        currency: "INR",
        image:
          "https://images.pexels.com/photos/3380805/pexels-photo-3380805.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        duration: 10,
        category: "Beaches",
      },
      {
        id: "3091807927",
        name: "Beach Cabanna",
        price: "500",
        currency: "INR",
        image:
          "https://images.pexels.com/photos/67566/palm-tree-palm-ocean-summer-67566.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        duration: 15,
        category: "Beaches",
      },
    ];
    let output = filterByDuration(input, "6", "10");

    expect(output.sort()).toEqual(expected.sort());
  });

  it("Check if filter by category is working", function () {
    const expected = [
      {
        id: "3091807927",
        name: "Cape Vernbla",
        price: "500",
        currency: "INR",
        image:
          "https://images.pexels.com/photos/4684185/pexels-photo-4684185.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        duration: 3,
        category: "Party",
      },
    ];
    const input = [
      {
        id: "3091807927",
        name: "Mount Sleephod",
        price: "500",
        currency: "INR",
        image:
          "https://images.pexels.com/photos/4390119/pexels-photo-4390119.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
        duration: 8,
        category: "Hillside",
      },
      {
        id: "3091807927",
        name: "Cape Vernbla",
        price: "500",
        currency: "INR",
        image:
          "https://images.pexels.com/photos/4684185/pexels-photo-4684185.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        duration: 3,
        category: "Party",
      },
    ];
    let output = filterByCategory(input, ["Party"]);

    expect(output.sort()).toEqual(expected.sort());
  });

  it("Check if filter by category and filter by duration are both working simultaneously", function () {
    const expected = [
      {
        id: "3091807920",
        name: "Lake Stokeque",
        price: "500",
        currency: "INR",
        image:
          "https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        duration: 20,
        category: "Cycling",
      },
      {
        id: "3091807922",
        name: "Beach Cabanna",
        price: "500",
        currency: "INR",
        image:
          "https://images.pexels.com/photos/67566/palm-tree-palm-ocean-summer-67566.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        duration: 15,
        category: "Beaches",
      },
    ];
    const input = [
      {
        id: "309180719",
        name: "West Wilkeshay",
        price: "500",
        currency: "INR",
        image:
          "https://images.pexels.com/photos/1658967/pexels-photo-1658967.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        duration: 2,
        category: "Hillside",
      },
      {
        id: "3091807920",
        name: "Lake Stokeque",
        price: "500",
        currency: "INR",
        image:
          "https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        duration: 20,
        category: "Cycling",
      },
      {
        id: "3091807921",
        name: "East Phisphoe",
        price: "500",
        currency: "INR",
        image:
          "https://images.pexels.com/photos/3380805/pexels-photo-3380805.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        duration: 10,
        category: "Beaches",
      },
      {
        id: "3091807922",
        name: "Beach Cabanna",
        price: "500",
        currency: "INR",
        image:
          "https://images.pexels.com/photos/67566/palm-tree-palm-ocean-summer-67566.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        duration: 15,
        category: "Beaches",
      },
    ];
    let output = filterFunction(input, {
      duration: "12-20",
      category: ["Beaches", "Cycling"],
    });

    expect(output.map((a) => a.id).sort()).toEqual(
      expected.map((a) => a.id).sort()
    );
  });

  it("Check if filter is being added to local storage", function () {
    saveFiltersToLocalStorage({ duration: "", category: [] });

    expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "filters",
      JSON.stringify({ duration: "", category: [] })
    );
  });
  it("Check if filter is being retrieved from local storage", function () {
    getFiltersFromLocalStorage("random");

    expect(window.localStorage.getItem).toHaveBeenCalledTimes(1);
    expect(window.localStorage.getItem).toHaveBeenCalledWith("filters");
  });
});
