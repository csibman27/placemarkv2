import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testPlacemarks, testStations, Bulls, wideStations, Amarando, testUsers } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Station Model tests", () => {
  let waterfordList = null;

  setup(async () => {
    db.init("mongo");
    await db.placemarkStore.deleteAllPlacemarks();
    await db.stationStore.deleteAllStations();
    waterfordList = await db.placemarkStore.addPlacemark(Amarando);
    for (let i = 0; i < testStations.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testStations[i] = await db.stationStore.addStation(waterfordList._id, testStations[i]);
    }
  });

  test("create single station", async () => {
    const wexfordList = await db.placemarkStore.addPlacemark(Bulls);
    const station = await db.stationStore.addStation(wexfordList._id, wideStations);
    assert.isNotNull(station._id);
    assertSubset(wideStations, station);
  });

  test("create multiple trackApi", async () => {
    const stations = await db.placemarkStore.getPlacemarkById(waterfordList._id);
    assert.equal(testStations.length, testStations.length);
  });

  test("delete all stationApi", async () => {
    const stations = await db.stationStore.getAllStations();
    assert.equal(testStations.length, stations.length);
    await db.stationStore.deleteAllStations();
    const newTracks = await db.stationStore.getAllStations();
    assert.equal(0, newTracks.length);
  });

  test("get a station - success", async () => {
    const wexfordList = await db.placemarkStore.addPlacemark(Bulls);
    const station = await db.stationStore.addStation(wexfordList._id, wideStations);
    const newStation = await db.stationStore.getStationById(station._id);
    assertSubset(wideStations, newStation);
  });

  test("delete One Station - success", async () => {
    await db.stationStore.deleteStation(testStations[0]._id);
    const stations = await db.stationStore.getAllStations();
    assert.equal(stations.length, testPlacemarks.length - 1);
    const deletedStation = await db.stationStore.getStationById(testStations[0]._id);
    assert.isNull(deletedStation);
  });

  test("get a station - bad params", async () => {
    assert.isNull(await db.stationStore.getStationById(""));
    assert.isNull(await db.stationStore.getStationById());
  });

  test("delete one station - fail", async () => {
    await db.stationStore.deleteStation("bad-id");
    const stations = await db.stationStore.getAllStations();
    assert.equal(stations.length, testPlacemarks.length);
  });
});
