import { StationSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";
import { imageStore } from "../models/image-store.js";

export const placemarkController = {
  index: {
    handler: async function (request, h) {
      const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
      const viewData = {
        title: "Placemark",
        placemark: placemark,
      };
      return h.view("placemark-view", viewData);
    },
  },

  addStation: {
    validate: {
      payload: StationSpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        const currentPlacemark = await db.placemarkStore.getPlacemarkById(request.params.id);
        return h.view("placemark-view", { title: "Add station error", placemark: currentPlacemark, errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
      const newStation = {
        title: request.payload.title,
        lat: Number(request.payload.lat),
        lng: Number(request.payload.lng),
        category: request.payload.category,
        description: request.payload.description,
        unleaded_price: Number(request.payload.unleaded_price),
        diesel_price: Number(request.payload.diesel_price),
      };
      await db.stationStore.addStation(placemark._id, newStation);
      return h.redirect(`/placemark/${placemark._id}`);
    },
  },

  deleteStation: {
    handler: async function (request, h) {
      const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
      await db.stationStore.deleteStation(request.params.stationid);
      return h.redirect(`/placemark/${placemark._id}`);
    },
  },
  // async function addMarker("issmap", addStation) {}
  uploadImage: {
    handler: async function (request, h) {
      try {
        const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          const response = await imageStore.uploadImage(request.payload.imagefile);
          placemark.img = response.url;
          placemark.imgid = response.public_id;
          db.placemarkStore.updatePlacemark(placemark);
        }
        return h.redirect(`/placemark/${placemark._id}`);
      } catch (err) {
        console.log(err);
        return h.redirect(`/placemark/${placemark._id}`);
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },

  deleteImage: {
    handler: async function (request, h) {
      const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
      await db.imageStore.deleteImage(placemark.imgid);
      placemark.img = undefined;
      placemark.imgid = undefined;
      db.placemarkStore.updatePlacemark(placemark);
      return h.redirect(`/placemark/${placemark._id}`);
    },
  },
};
