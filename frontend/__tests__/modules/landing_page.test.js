import { fetchCities, addCityToDOM } from "../../modules/landing_page.js";
require("jest-fetch-mock").enableMocks();
const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(
  path.resolve(__dirname, "../../index.html"),
  "utf8"
);
jest.dontMock("fs");

beforeEach(() => {
  fetch.resetMocks();
});

describe("Landing Page Tests", function () {
  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
  });

  afterEach(() => {
    // restore the original func after test
    jest.resetModules();
  });

  it("Check if fetch call for cities was made and data was received", async () => {
    const data = await fetchCities();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalledWith(expect.stringContaining("//cities"));
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/cities"));
  });

  it("Catches errors and returns null", async () => {
    fetch.mockReject(() => "API failure");

    const data = await fetchCities();

    expect(data).toEqual(null);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalledWith(expect.stringContaining("//cities"));
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/cities"));
  });

  it("Tries adding a new City - London", function () {
    addCityToDOM("london", "London", "London", "London");
    expect(document.getElementById("london")).toBeTruthy();

    //add checks for tile and parent div has an id of data
  });

  it("Check if City Card is linked correctly to Adventures page", function () {
    const expected = "adventures/?city=london";
    addCityToDOM("london", "London", "London", "London");
    expect(document.getElementById("london").href).toEqual(
      expect.stringContaining(expected)
    );
  });
});
