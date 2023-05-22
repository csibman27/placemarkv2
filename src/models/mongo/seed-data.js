export const seedData = {
  users: {
    _model: "User",
    homer: {
      firstName: "Homer",
      lastName: "Simpson",
      email: "homer@simpson.com",
      password: "$2a$10$WwL9kUm0MkqM/vOsG7lDMOSpQgo/ePcVrIGvlgp0eEsLvJ10XpZfm",
    },
    marge: {
      firstName: "Marge",
      lastName: "Simpson",
      email: "marge@simpson.com",
      password: "$2a$10$5uxMaTXLcp1JoEdDsjpPcO/LUCEpm5EfbuaF3/.bFA.jwshl7nbeK",
    },
    bart: {
      firstName: "Bart",
      lastName: "Simpson",
      email: "bart@simpson.com",
      password: "$2a$10$SXDdnq0Xgv2OPK2N/J0QOewQXdZfNrFBey0NRBosrjR3cz5bRlb4O",
    },
    1: {
      firstName: "1",
      lastName: "1",
      email: "1@1.com",
      password: "$2a$10$ODwSeC9EblnEjV9sSr5vSOcCg5WY0jYBAjGdlNmIauUz03ERYRrte",
    },
    3: {
      firstName: "3",
      lastName: "3",
      email: "3@3.com",
      password: "3",
    },
  },
  placemarks: {
    _model: "Placemark",
    Kildare: {
      title: "Kildare",
      userid: "->users.1",
    },
    Kilkenny: {
      title: "Kilkenny",
      userid: "->users.1",
    },
  },
  stations: {
    _model: "Station",
    station_1: {
      title: "Texaco",
      lat: 53.4234,
      lng: -7.2022,
      category: "station only",
      description: "Billing",
      unleaded_price: 2.3,
      diesel_price: 1.35,
      placemarkid: "->placemarks.Kildare",
      images: [{img: "https://res.cloudinary.com/dwrmwujsb/image/upload/v1684792420/kk2_qdbhx7.jpg", imgid: "kk2_qdbhx7"}]
    },
    station_2: {
      title: "Maxoil",
      lat: 52.1234,
      lng: -7.2922,
      category: "station only",
      description: "95 super",
      unleaded_price: 1.2,
      diesel_price: 1.15,
      placemarkid: "->placemarks.Kildare",
      images: [{img: "https://res.cloudinary.com/dwrmwujsb/image/upload/v1684792420/kk1_n8ylow.jpg", imgid: "kk1_n8ylow"}]
    },
    station_3: {
      title: "Shell",
      lat: 51.1214,
      lng: -8.2322,
      category: "station only",
      description: "97 extra",
      unleaded_price: 2.4,
      diesel_price: 1.29,
      placemarkid: "->placemarks.Kildare",
      images: [{img: "https://res.cloudinary.com/dwrmwujsb/image/upload/v1684792631/kk4_bywpmv.jpg", imgid: "kk4_bywpmv"}]
    },
    station_4: {
      title: "Shell",
      lat: 53.1215,
      lng: -7.2122,
      category: "super station",
      description: "95 petrol",
      unleaded_price: 1.99,
      diesel_price: 1.34,
      placemarkid: "->placemarks.Kilkenny",
      images: [{img: "https://res.cloudinary.com/dwrmwujsb/image/upload/v1684792631/kk3_ablfft.jpg", imgid: "kk3_ablfft"}]
    },
    station_5: {
      title: "Mol",
      lat: 52.1115,
      lng: -7.1122,
      category: "super station",
      description: "extra diesel",
      unleaded_price: 1.89,
      diesel_price: 1.77,
      placemarkid: "->placemarks.Kilkenny",
      images: [{img: "https://res.cloudinary.com/dwrmwujsb/image/upload/v1684792631/kk5_zj4plb.jpg", imgid: "kk5_zj4plb"}]
    },
  },
  messages: {
    _model: "Message",
    message_1: {
      messageText: "test message from a community user",
    },
  },
};
