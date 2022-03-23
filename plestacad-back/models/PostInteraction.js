const { boolean, string } = require("@hapi/joi");
const mongoose = require("mongoose");

const postInteractionScheema = mongoose.Schema({
    authorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    message: {
        type: string,
        required: true
    },
    date: {
        type: Date,
        required: true
    }

});

module.exports = mongoose.model("PostInteraction", postInteractionScheema);
