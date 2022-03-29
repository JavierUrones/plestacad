const { boolean, string } = require("@hapi/joi");
const mongoose = require("mongoose");

const postInteractionScheema = mongoose.Schema({
    authorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    authorFullName: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }

});

module.exports = mongoose.model("PostInteraction", postInteractionScheema);
