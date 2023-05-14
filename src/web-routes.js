import { accountsController } from "./controllers/accounts-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { aboutController } from "./controllers/about-controller.js";
import { placemarkController } from "./controllers/placemark-controller.js";
import { analyticsController } from "./controllers/analytics-controller.js";
import { stationController } from "./controllers/station-controller.js";

export const webRoutes = [
  { method: "GET", path: "/", config: accountsController.index },
  { method: "GET", path: "/signup", config: accountsController.showSignup },
  { method: "GET", path: "/login", config: accountsController.showLogin },
  { method: "GET", path: "/logout", config: accountsController.logout },
  { method: "POST", path: "/register", config: accountsController.signup },
  { method: "POST", path: "/authenticate", config: accountsController.login },

  { method: "GET", path: "/about", config: aboutController.index },
  { method: "POST", path: "/about/addmessage", config: aboutController.addMessage },

  { method: "GET", path: "/user-account", config: accountsController.loggedInUserDetails },
  { method: "POST", path: "/updateUserDetails", config: accountsController.updateLoggedInUser },
  { method: "GET", path: "/deleteUserAccount", config: accountsController.deleteUserAccount },

  { method: "GET", path: "/analytics", config: analyticsController.index },
  { method: "GET", path: "/analytics/deleteuser/{id}", config: analyticsController.deleteUser },

  { method: "GET", path: "/github", config: accountsController.github },

  { method: "GET", path: "/dashboard", config: dashboardController.index },
  { method: "POST", path: "/dashboard/addplacemark", config: dashboardController.addPlacemark },
  { method: "GET", path: "/dashboard/deleteplacemark/{id}", config: dashboardController.deletePlacemark },
  { method: "GET", path: "/dashboard/sortplacemark/{id}", config: dashboardController.sortPlacemark },

  { method: "GET", path: "/placemark/{id}", config: placemarkController.index },
  { method: "POST", path: "/placemark/{id}/addstation", config: placemarkController.addStation },
  { method: "GET", path: "/placemark/{id}/deletestation/{stationid}", config: placemarkController.deleteStation },

  { method: "GET", path: "/station/{id}/editstation/{stationid}", config: stationController.index },
  { method: "POST", path: "/station/{id}/updatestation/{stationid}", config: stationController.update },

  { method: "POST", path: "/placemark/{id}/uploadimage", config: placemarkController.uploadImage },
  { method: "GET", path: "/placemark/{id}/deleteimage", config: placemarkController.deleteImage },

  { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } },
];
