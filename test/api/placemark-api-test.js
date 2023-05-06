import { EventEmitter } from "events";
import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, maggieCredentials, Amarando, testPlacemarks, Bulls } from "../fixtures.js";

EventEmitter.setMaxListeners(25);

suite("Placemark API tests", () => {
  let user = null;
  //let stationModel = null;

  setup(async () => {
    placemarkService.clearAuth();
    user = await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCredentials);
    await placemarkService.deleteAllStations();
    await placemarkService.deleteAllPlacemarks();
    await placemarkService.deleteAllUsers();
    user = await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCredentials);
    Bulls.userid = user._id;
    //stationModel = await placemarkService.createStation(Bulls);
  });

  teardown(async () => {});

  test("create placemark", async () => {
    const returnedPlacemark = await placemarkService.createPlacemark(Bulls);
    assert.isNotNull(returnedPlacemark);
    assertSubset(Bulls, returnedPlacemark);
  });

  /*test("Create multiple locations", async () => {
    for (let i = 0; i < testPlacemarks.length; i += 1) {
      await placemarkService.createPlacemark(stationModel._id, testPlacemarks[i]);
    }
    const returnedLocations = await placemarkService.getAllPlacemarks();
    assert.equal(returnedLocations.length, testPlacemarks.length);
    for (let i = 0; i < returnedLocations.length; i += 1) {
      const placemark = await placemarkService.getPlacemark(returnedLocations[i]._id);
      assertSubset(placemark, returnedLocations[i]);
    }
  });
*/

  test("delete a placemark", async () => {
    const placemark = await placemarkService.createPlacemark(Amarando);
    const response = await placemarkService.deletePlacemark(placemark._id);
    assert.equal(response.status, 204);
    try {
      const returnedPlacemark = await placemarkService.getPlacemark(placemark.id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No Placemark with this id", "Incorrect Response Message");
    }
  });

  test("create multiple placemarks", async () => {
    for (let i = 0; i < testPlacemarks.length; i += 1) {
      testPlacemarks[i].userid = user._id;
      // eslint-disable-next-line no-await-in-loop
      await placemarkService.createPlacemark(testPlacemarks[i]);
    }
    let returnedLists = await placemarkService.getAllPlacemarks();
    assert.equal(returnedLists.length, testPlacemarks.length);
    await placemarkService.deleteAllPlacemarks();
    returnedLists = await placemarkService.getAllPlacemarks();
    assert.equal(returnedLists.length, 0);
  });

  test("remove non-existant placemark", async () => {
    try {
      const response = await placemarkService.deletePlacemark("not an id");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No Placemark with this id", "Incorrect Response Message");
    }
  });
});
