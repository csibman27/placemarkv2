import { db } from "../models/db.js";

export const analytics = {
  async getTotalPlacemarks() {
    const placemarks = await db.placemarkStore.getAllPlacemarks();
    const totalPlacemarks = placemarks.length;
    return totalPlacemarks;
  },

  async getTotalStations() {
    const stations = await db.stationStore.getAllStations();
    const totalStations = stations.length;
    return totalStations;
  },

  async getTotalUsers() {
    const users = await db.userStore.getAllUsers();
    const totalUsers = users.length;
    return totalUsers;
  },

  // eslint-disable-next-line consistent-return
  async getCheapestPetrolPrice() {
    const stations = await db.stationStore.getAllStations();
    if (stations.length > 0) {
      let minPetrolPrice = stations[0].unleaded_price;
      for (let i = 0; i < stations.length; i++) {
        if (stations[i].unleaded_price <= minPetrolPrice) {
          minPetrolPrice = stations[i].unleaded_price;
        }
      }
      return minPetrolPrice;
    }
  },
  // eslint-disable-next-line consistent-return
  async getCheapestDieselPrice() {
    const stations = await db.stationStore.getAllStations();
    if (stations.length > 0) {
      let minDieselPrice = stations[0].diesel_price;
      for (let i = 0; i < stations.length; i++) {
        if (stations[i].diesel_price <= minDieselPrice) {
          minDieselPrice = stations[i].diesel_price;
        }
      }
      return minDieselPrice;
    }
  },
  async sortPlacemarks() {
    const placemarks = await db.placemarkStore.getUserPlacemarks();
    const sortedPlacemarks = placemarks.sort();
    return sortedPlacemarks;
  },
};
