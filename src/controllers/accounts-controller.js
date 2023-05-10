import bcrypt from "bcrypt"; // ADDED hashing & salting
import { UserSpec, UserCredentialsSpec, UserSpecPlus } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

const saltRounds = 10; // ADDED hashing & salting

export const accountsController = {
  index: {
    auth: false,
    handler: function (request, h) {
      return h.view("main", { title: "Welcome to Placemark" });
    },
  },
  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup-view", { title: "Sign up for Placemark" });
    },
  },
  signup: {
    auth: false,
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("signup-view", { title: "Sign up error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const user = request.payload;
      user.password = await bcrypt.hash(user.password, saltRounds); // ADDED hashing& salting
      await db.userStore.addUser(user);
      return h.redirect("/");
    },
  },
  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login-view", { title: "Login to Placemark for Petrol Stations" });
    },
  },
  login: {
    auth: false,
    validate: {
      payload: UserCredentialsSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("login-view", { title: "Log in error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const { email, password } = request.payload;
      const user = await db.userStore.getUserByEmail(email);
      const passwordsMatch = await bcrypt.compare(password, user.password); // ADDED hashing & salting
      // if (!user || user.password !== password) {
      // OLD
      if (!user || !passwordsMatch) {
        // NEW STATEMENT ADDED
        // EDITED
        return h.redirect("/");
      }
      request.cookieAuth.set({ id: user._id });
      return h.redirect("/dashboard");
    },
  },
  logout: {
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },

  async validate(request, session) {
    const user = await db.userStore.getUserById(session.id);
    if (!user) {
      return { isValid: false };
    }
    return { isValid: true, credentials: user };
  },

  loggedInUserDetails: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const user = await db.userStore.getUserById(loggedInUser._id);
      const viewData = {
        title: "User Account",
        user: user,
      };
      return h.view("user-view", viewData);
    },
  },

  updateLoggedInUser: {
    validate: {
      payload: UserSpecPlus,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("user-view", { title: "Error", errors: error.details }).takeover.code(400);
      },
    },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const updatedUser = {
        firstName: request.payload.firstName,
        lastName: request.payload.lastName,
        email: request.payload.email,
        password: request.payload.password,
      };
      try {
        await db.userStore.updateUser(loggedInUser._id, updatedUser);
      } catch (error) {
        console.log(error);
      }
      return h.view("login-view");
    },
  },

  deleteUserAccount: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      let userStations = [];
      userStations = await db.stationStore.getUserStations(loggedInUser._id);
      for (let i = 0; i < userStations.length; i += 1) {
        let userPlacemarks = [];

        // eslint-disable-next-line no-await-in-loop
        userPlacemarks = await db.placemarkStore.getPlacemarksByStationId(userStations[i]._id);
        for (let k = 0; k < userPlacemarks.length; k += 1) {
          // eslint-disable-next-line no-await-in-loop
          await db.placemarkStore.deletePlacemarkById(userPlacemarks[k]._id);
        }
        // eslint-disable-next-line no-await-in-loop
        await db.stationStore.deleteStation(userStations[i]._id);
      }
      await db.userStore.deleteUserById(loggedInUser._id);
      return h.redirect("/");
    },
  },

  github: {
    auth: "github",
    // eslint-disable-next-line consistent-return
    handler: async function (request, h) {
      if (!request.auth.isAuthenticated) {
        return h.view("signup-view", { title: "Sign up error", errors: "Not logged in..." }).takeover().code(400);
      }
      // Check if the user logged in via Google
      const creds = request.auth.credentials;
      if (creds.provider === "github") {
        let gitEmail = "";
        // Check if email is public and not null
        if (creds.profile.email != null) {
          gitEmail = creds.profile.email;
        } else {
          gitEmail = `${creds.profile.username}@github`;
        }
        let user = await db.userStore.getUserByEmail(gitEmail);

        // If the user is not registered, create a new user account
        if (!user) {
          user = await db.userStore.addUser({
            firstName: creds.profile.displayName.split(" ")[0],
            lastName: creds.profile.displayName.split(" ")[1],
            email: gitEmail,
            // // Set a default password for Google users (leter on we can generate a random one)
            password: "github_password",
          });
        }

        // Log in the user
        request.cookieAuth.set({ id: user._id });
        return h.redirect("/dashboard");
      }
    },
  },
};
