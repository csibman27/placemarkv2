import { v4 } from "uuid";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const db = new Low(new JSONFile("./src/models/json/message-store.json"));
db.data = { messages: [] };

export const messageJsonStore = {
  async getAllMessages() {
    await db.read();
    return db.data.messages;
  },

  async addMessages(message) {
    await db.read;
    message._id = v4();
    db.data.messages.push(message);
    await db.write();
    return message;
  },

  async getMessageById(id) {
    await db.read();
    let u = db.data.messages.find((message) => message._id === id);
    if (u === undefined) u = null;
    return u;
  },

  async deleteAll() {
    db.data.messages = [];
    await db.write();
  },
};
