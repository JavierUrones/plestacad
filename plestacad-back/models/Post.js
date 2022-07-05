const { boolean, string } = require("@hapi/joi");
const mongoose = require("mongoose");
/** 
const postScheema = mongoose.Schema({
    title: {
        type: string,
        required: true
      },
      creationDate: {
          type: Date,
          required: true
      },
      isFavorite: {
          type: boolean,
          required: true
      },
      message: {
          type: string,
          required: true
      },
      lastMessageDate: {
          type: Date
      },
      interactions: [{type: mongoose.Schema.Types.ObjectId, ref: 'PostInteraction'}],
  workId: {type: mongoose.Schema.Types.ObjectId, ref: 'Work'},
  authorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  
});
*/
const postScheema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  lastMessageDate: {
    type: Date,
  },
  interactions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "PostInteraction" },
  ],
  workId: { type: mongoose.Schema.Types.ObjectId, ref: "Work" },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Post", postScheema);
