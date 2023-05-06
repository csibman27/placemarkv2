import { v4 } from "uuid";
import { stat } from "@hapi/vision/lib/utils.js";

let stations = [];

export const stationMemStore = {
  async getAllStations() {
    return stations;
  },

  async getUserStations(userid) {
    return stations.filter((station) => station.userid === userid);
  },

  async addStation(placemarkId, station) {
    station._id = v4();
    station.placemarkid = placemarkId;
    stations.push(station);
    return station;
  },

  async getStationsByPlacemarkId(id) {
    return stations.filter((station) => station.placemarkid === id);
  },

  async getStationById(id) {
    return stations.find((station) => station._id === id);
  },

  async getPlacemarkStations(placemarkId) {
    return stations.filter((station) => station.placemarkid === placemarkId);
  },

  async deleteStation(id) {
    const index = stations.findIndex((station) => station._id === id);
    stations.splice(index, 1);
  },

  async deleteAllStations() {
    stations = [];
  },

  async updateStation(station, updatedStation) {
    station.title = updatedStation.title;
    station.lat = updatedStation.lat;
    station.lng = updatedStation.lng;
    station.category = updatedStation.category;
    station.description = updatedStation.description;
    station.unleaded_price = updatedStation.unleaded_price;
    station.diesel_price = updatedStation.diesel_price;
  },
};
