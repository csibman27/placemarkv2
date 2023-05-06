import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec, StationSpec, StationSpecPlus, StationArraySpec } from "../models/joi-schemas.js";
import { validationError } from "./logger.js";

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
};
