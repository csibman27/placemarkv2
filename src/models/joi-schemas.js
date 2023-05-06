import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserCredentialsSpec = Joi.object()
  .keys({
    email: Joi.string().email().example("homer@simpson.com").required(),
    password: Joi.string().example("secret").required(),
    permission: Joi.string().example("ADMIN"),
  })
  .label("UserCredentials");

export const UserSpec = Joi.object()
  .keys({
    firstName: Joi.string().example("Homer").required(),
    lastName: Joi.string().example("Simpson").required(),
    email: Joi.string().email().example("homer@simpson.com").required(),
    password: Joi.string().example("secret").required(),
    _id: IdSpec,
    __v: Joi.number(),
  })
  .label("UserDetails");

export const UserSpecPlus = UserSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("UserDetailsPlus");

export const UserArray = Joi.array().items(UserSpec).label("UserArray");

export const StationSpec = Joi.object()
  .keys({
    title: Joi.string().required().example("Amaran"),
    lat: Joi.number().allow().optional(),
    lng: Joi.number().allow().optional(),
    category: Joi.string().required(),
    description: Joi.string().required().example("Belphi"),
    unleaded_price: Joi.number().allow("").optional().example(1.01),
    diesel_price: Joi.number().allow("").optional().example(0.98),
    placemarkid: IdSpec,
  })
  .label("Station");

export const StationSpecPlus = StationSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("StationPlus");

export const StationArraySpec = Joi.array().items(StationSpecPlus).label("StationArray");

export const PlacemarkSpec = Joi.object()
  .keys({
    title: Joi.string().required().example("Kildare"),
    userid: IdSpec,
    stations: StationArraySpec,
  })
  .label("Placemark");

export const PlacemarkSpecPlus = PlacemarkSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("PlacemarkPlus");

export const PlacemarkArraySpec = Joi.array().items(PlacemarkSpecPlus).label("PlacemarkArray");

export const JwtAuth = Joi.object()
  .keys({
    success: Joi.boolean().example("true").required(),
    token: Joi.string().example("eyJhbGciOiJND.g5YmJisIjoiaGYwNTNjAOhE.gCWGmY5-YigQw0DCBo").required(),
  })
  .label("JwtAuth");
