import { v4 } from "uuid";

let messages = [];

export const messageMemStore = {
  async getAllMessages() {
    return messages;
  },

  async addMessages(message) {
    message._id = v4();
    messages.push(message);
    return message;
  },

  async getUserMessages(userid) {
    return messages.filter((message) => message.userid === userid);
  },

  async deleteMessageById(id) {
    const index = messages.findIndex((message) => message._id === id);
    messages.splice(index, 1);
  },

  async deleteAllMessages() {
    messages = [];
  },
};
