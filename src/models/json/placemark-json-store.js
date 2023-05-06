import { v4 } from "uuid";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { stationJsonStore } from "./station-json-store.js";

const db = new Low(new JSONFile("./src/models/json/placemarks.json"));
db.data = { placemarks: [] };

export const placemarkJsonStore = {
  async getAllPlacemarks() {
    await db.read();
    return db.data.placemarks;
  },

  async addPlacemark(stationId, placemark) {
    await db.read();
    placemark._id = v4();
    placemark.stationid = stationId;
    db.data.placemarks.push(placemark);
    await db.write();
    return placemark;
  },

  async getPlacemarkById(id) {
    await db.read();
    let list = db.data.placemarks.find((placemark) => placemark._id === id);
    if (list) {
      list.stations = await stationJsonStore.getStationsByPlacemarkId(list._id);
    } else {
      list = null;
    }
    return list;
  },

  async getPlacemarksByStationId(id) {
    await db.read();
    return db.data.placemarks.filter((placemark) => placemark.stationid === id);
  },

  async getUserPlacemarks(userid) {
    await db.read();
    return db.data.placemarks.filter((placemark) => placemark.userid === userid);
  },

  async sortUserPlacemarks(userid) {
    await db.read();

    return db.data.placemarks
      .filter((placemark) => placemark.userid === userid)
      .sort(function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
  },

  async deletePlacemarkById(id) {
    await db.read();
    const index = db.data.placemarks.findIndex((placemark) => placemark._id === id);
    if (index !== -1) db.data.placemarks.splice(index, 1);
    await db.write();
  },

  async deleteAllPlacemarks() {
    db.data.placemarks = [];
    await db.write();
  },
};
