const mongoose = require("mongoose");

const workRequestScheema = mongoose.Schema({
    role: {
        type: String,
        enum: ["student", "teacher"]
    },
    date: {
        type: Date
    },
    userIdSender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userIdReceiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    workId: { type: mongoose.Schema.Types.ObjectId, ref: 'Work' },

});

module.exports = mongoose.model("WorkRequest", workRequestScheema);
