import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testPlacemarks, Bulls } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";
import { EventEmitter } from "events";

EventEmitter.setMaxListeners(25);

suite("Placemark Model tests", () => {
  setup(async () => {
    db.init("mongo");
    await db.placemarkStore.deleteAllPlacemarks();
    for (let i = 0; i < testPlacemarks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testPlacemarks[i] = await db.placemarkStore.addPlacemark(testPlacemarks[i]);
    }
  });

  test("create a placemark", async () => {
    const placemark = await db.placemarkStore.addPlacemark(Bulls);
    assertSubset(Bulls, placemark);
    assert.isDefined(placemark._id);
  });

  test("delete all placemarks", async () => {
    const placemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(testPlacemarks.length, placemarks.length);
    await db.placemarkStore.deleteAllPlacemarks();
    const returnedPlacemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(0, returnedPlacemarks.length);
  });

  test("get a placemark - success", async () => {
    const placemark = await db.placemarkStore.addPlacemark(Bulls);
    const returnedPlacemark = await db.placemarkStore.getPlacemarkById(placemark._id);
    assertSubset(Bulls, placemark);
  });

  test("delete One Placemark - success", async () => {
    const id = testPlacemarks[0]._id;
    await db.placemarkStore.deletePlacemarkById(id);
    const returnedPlacemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(returnedPlacemarks.length, testPlacemarks.length - 1);
    const deletedPlacemark = await db.placemarkStore.getPlacemarkById(id);
    assert.isNull(deletedPlacemark);
  });

  test("get a placemark - bad params", async () => {
    assert.isNull(await db.placemarkStore.getPlacemarkById(""));
    assert.isNull(await db.placemarkStore.getPlacemarkById());
  });

  test("delete One Placemark - fail", async () => {
    await db.placemarkStore.deletePlacemarkById("bad-id");
    const allPlacemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(testPlacemarks.length, allPlacemarks.length);
  });
});
