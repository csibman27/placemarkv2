import { v4 } from "uuid";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const db = new Low(new JSONFile("./src/models/json/stations.json"));
db.data = { stations: [] };

export const stationJsonStore = {
  async getAllStations() {
    await db.read();
    return db.data.stations;
  },

  async getUserStations(userid) {
    await db.read();
    return db.data.stations.filter((station) => station.userid === userid);
  },

  async addStation(placemarkId, station) {
    await db.read();
    station._id = v4();
    station.placemarkid = placemarkId;
    db.data.stations.push(station);
    await db.write();
    return station;
  },

  async getStationsByPlacemarkId(id) {
    await db.read();
    return db.data.stations.filter((station) => station.placemarkid === id);
  },

  async getStationById(id) {
    await db.read();
    return db.data.stations.find((station) => station._id === id);
  },

  async deleteStation(id) {
    await db.read();
    const index = db.data.stations.findIndex((station) => station._id === id);
    db.data.stations.splice(index, 1);
    await db.write();
  },

  async deleteAllStations() {
    db.data.stations = [];
    await db.write();
  },

  async updateStation(station, updatedStation) {
    station.title = updatedStation.title;
    station.description = updatedStation.description;
    station.unleaded_price = updatedStation.unleaded_price;
    station.diesel_price = updatedStation.diesel_price;
    await db.write();
  },
};
