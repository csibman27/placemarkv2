import { StationSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

export const stationController = {
  index: {
    handler: async function (request, h) {
      const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
      const station = await db.stationStore.getStationById(request.params.stationid);
      const viewData = {
        title: "Edit Station",
        placemark: placemark,
        station: station,
      };
      return h.view("station-view", viewData);
    },
  },

  update: {
    validate: {
      payload: StationSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("station-view", { title: "Edit station error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const station = await db.stationStore.getStationById(request.params.stationid);
      const newStation = {
        title: request.payload.title,
        lat: Number(request.payload.lat),
        lng: Number(request.payload.lng),
        category: request.payload.category,
        description: request.payload.description,
        unleaded_price: Number(request.payload.unleaded_price),
        diesel_price: Number(request.payload.diesel_price),
      };
      await db.stationStore.updateStation(station, newStation);
      return h.redirect(`/placemark/${request.params.id}`);
    },
  },
};
