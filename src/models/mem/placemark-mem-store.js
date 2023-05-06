import { v4 } from "uuid";
import { stationMemStore } from "./station-mem-store.js";

let placemarks = [];

export const placemarkMemStore = {
  async getAllPlacemarks() {
    return placemarks;
  },

  async addPlacemark(stationId, placemark) {
    placemark._id = v4();
    placemark.stationid = stationId;
    placemarks.push(placemark);
    return placemark;
  },

  async getPlacemarkById(id) {
    const list = placemarks.find((placemark) => placemark._id == id);
    list.stations = await stationMemStore.getStationsByPlacemarkId(list._id);
    return list;
  },

  async getPlacemarksByStationId(id) {
    return placemarks.filter((station) => station.stationid === id);
  },

  async getUserPlacemarks(userid) {
    return placemarks.filter((placemark) => placemark.userid === userid);
  },

  async deletePlacemarkById(id) {
    const index = placemarks.findIndex((placemark) => placemark._id === id);
    placemarks.splice(index, 1);
  },

  async deleteAllPlacemarks() {
    placemarks = [];
  },
};
