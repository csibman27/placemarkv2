import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec, StationSpec, StationSpecPlus, StationArraySpec } from "../models/joi-schemas.js";
import { validationError } from "./logger.js";
import { imageStore } from "../models/image-store.js";

export const stationApi = {
  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const stations = await db.stationStore.getAllStations();
        return stations;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    response: { schema: StationArraySpec, failAction: validationError },
    description: "Get all StationApi",
    notes: "Returns all stationApi",
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    async handler(request) {
      try {
        const station = await db.stationStore.getStationById(request.params.id);
        if (!station) {
          return Boom.notFound("No station with this id");
        }
        return station;
      } catch (err) {
        return Boom.serverUnavailable("No station with this id");
      }
    },
    tags: ["api"],
    description: "Find a Station",
    notes: "Returns a station",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: StationSpecPlus, failAction: validationError },
  },

  findStationsByPlacemarkId: {
    auth: {
      strategy: "jwt",
    },
    async handler(request) {
      try {
        const station = await db.stationStore.getStationsByPlacemarkId(request.params.id);
        if (!station) {
          return Boom.notFound("No station with this id");
        }
        return station;
      } catch (err) {
        return Boom.serverUnavailable("No station with this id");
      }
    },
    tags: ["api"],
    description: "Find a Station",
    notes: "Returns a station",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: StationArraySpec, failAction: validationError },
  },

  create: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const station = await db.stationStore.addStation(request.params.id, request.payload);
        if (station) {
          return h.response(station).code(201);
        }
        return Boom.badImplementation("error creating station");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a station",
    notes: "Returns the newly created station",
    validate: { payload: StationSpec },
    response: { schema: StationSpecPlus, failAction: validationError },
  },

  updateStation: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const station = await db.stationStore.updateStation(request.params.stationid, request.payload);
        if (station) {
          return h.response(station).code(201);
        }
        return Boom.badImplementation("error creating station");
      } catch (err) {
        console.log(err);
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Update a Station",
    notes: "Returns the updated station",
    validate: { payload: StationSpecPlus },
    response: { schema: StationSpecPlus, failAction: validationError },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        await db.stationStore.deleteAllStations();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all stationApi",
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const station = await db.stationStore.getStationById(request.params.id);
        if (!station) {
          return Boom.notFound("No Station with this id");
        }
        await db.stationStore.deleteStation(station._id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("No Station with this id");
      }
    },
    tags: ["api"],
    description: "Delete a station",
    validate: { params: { id: IdSpec }, failAction: validationError },
  },

  uploadImage: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const station = await db.stationStore.getStationById(request.params.id);
        console.log("Adding image", station);
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          const response = await imageStore.uploadImage(request.payload.imagefile);
          console.log(response);
          station.images.push({ img: response.url, imgid: response.public_id });
          db.stationStore.updateStation(station._id, station);
        }
        return h.response().code(200);
      } catch (err) {
        console.log(err);
        return h.response().code(500);
      }
    },
    tags: ["api"],
    description: "Upload an image",
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },

  deleteImage: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const station = await db.stationStore.getStationById(request.params.id);
        await db.imageStore.deleteImage(request.params.imgid);
        console.log("station", station.images);
        station.images = station.images.filter((value) => value.imgid !== request.params.imgid);
        db.stationStore.updateStation(station._id, station);
        return h.response().code(200);
      } catch (err) {
        console.log(err);
        return h.response().code(500);
      }
    },
    tags: ["api"],
    description: "Delete an image",
  },
};
