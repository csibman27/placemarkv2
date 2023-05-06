import { Message } from "./message.js";

export const messageMongoStore = {
  async getAllMessages() {
    const message = await Message.find().lean();
    return message;
  },

  async getMessageById(id) {
    if (id) {
      const message = await Message.findOne({ _id: id }).lean();
      return message;
    }
    return null;
  },

  async addMessages(message) {
    const newMessage = new Message(message);
    const messageObj = await newMessage.save();
    return this.getMessageById(messageObj._id);
  },

  async deleteAll() {
    await Message.deleteMany({});
  },
};
