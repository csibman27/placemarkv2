import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { placemarkService } from "./placemark-service.js";
import { maggie, maggieCredentials, testPlacemarks, testStations, wideStations, Bulls } from "../fixtures.js";

suite("Station API tests", () => {
  let user = null;
  let Waterford = null;

  setup(async () => {
    placemarkService.clearAuth();
    user = await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCredentials);
    await placemarkService.deleteAllPlacemarks();
    await placemarkService.deleteAllStations();
    await placemarkService.deleteAllUsers();
    user = await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCredentials);
    Bulls.userid = user._id;
    Waterford = await placemarkService.createPlacemark(Bulls);
  });

  teardown(async () => {});

  test("create station", async () => {
    const returnedStation = await placemarkService.createStation(Waterford._id, wideStations);
    assertSubset(wideStations, returnedStation);
  });

  /*
  test("create Multiple stations", async () => {

    for (let i = 0; i < testStations.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await placemarkService.createStation(Waterford._id, testStations[i]);
    }
    const returnedStations = await placemarkService.getAllStations();
    assert.equal(returnedStations.length, testStations.length);
    for (let i = 0; i < returnedStations.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const station = await placemarkService.getStation(returnedStations[i]._id);
      assertSubset(station, returnedStations[i]);
    }
  });
*/

  test("Delete StationApi", async () => {
    for (let i = 0; i < testStations.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await placemarkService.createStation(Waterford._id, testStations[i]);
    }
    let returnedStations = await placemarkService.getAllStations();
    assert.equal(returnedStations.length, testStations.length);
    for (let i = 0; i < returnedStations.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const station = await placemarkService.deleteStation(returnedStations[i]._id);
    }
    returnedStations = await placemarkService.getAllStations();
    assert.equal(returnedStations.length, 0);
  });

  test("denormalised placemark", async () => {
    for (let i = 0; i < testStations.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await placemarkService.createStation(Waterford._id, testStations[i]);
    }
    const returnedPlacemark = await placemarkService.getPlacemark(Waterford._id);
    assert.equal(returnedPlacemark.stations.length, testStations.length);
    for (let i = 0; i < testStations.length; i += 1) {
      assertSubset(testStations[i], returnedPlacemark.stations[i]);
    }
  });
});
