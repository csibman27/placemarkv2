import { Placemark } from "./placemark.js";
import { stationMongoStore } from "./station-mongo-store.js";

export const placemarkMongoStore = {
  async getAllPlacemarks() {
    const placemark = await Placemark.find().lean();
    return placemark;
  },

  async getPlacemarkById(id) {
    if (id) {
      const placemark = await Placemark.findOne({ _id: id }).lean();
      if (placemark) {
        placemark.stations = await stationMongoStore.getStationsByPlacemarkId(placemark._id);
      }
      return placemark;
    }
    return null;
  },

  async getPlacemarksByStationId(id) {
    const placemarks = await Placemark.find({ stationid: id }).lean();
    return placemarks;
    return true;
  },

  async addPlacemark(placemark) {
    const newPlacemark = new Placemark(placemark);
    const placemarkObj = await newPlacemark.save();
    return this.getPlacemarkById(placemarkObj._id);
  },

  async getUserPlacemarks(id) {
    const placemark = await Placemark.find({ userid: id }).lean();
    return placemark;
  },

  async deletePlacemarkById(id) {
    try {
      await Placemark.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAllPlacemarks() {
    await Placemark.deleteMany({});
  },

  async updatePlacemark(updatedPlacemark) {
    const placemark = await Placemark.findOne({ _id: updatedPlacemark._id });
    placemark.title = updatedPlacemark.title;
    placemark.img = updatedPlacemark.img;
    await placemark.save();
  },
};
