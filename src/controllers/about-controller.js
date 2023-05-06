import { db } from "../models/db.js";

export const aboutController = {
  index: {
    handler: async function (request, h) {
      const message = await db.messageStore.getAllMessages();
      const viewData = {
        title: "About Placemark",
        message: message,
      };
      return h.view("about-view", viewData);
    },
  },
  addMessage: {
    handler: async function (request, h) {
      //const message = request.body.message;
      const newMessage = {
        title: "Message store",
        messageText: request.payload.messageText,
      };
      await db.messageStore.addMessages(newMessage);
      return h.redirect("/about");
    },
  },
};
