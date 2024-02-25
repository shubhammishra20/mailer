// models/email.js
const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    from: {
        name: String,
        address: String,
    },
    to: [String],
    subject: String,
    text: String,
    html: String,
    attachments: [
        {
            filename: String,
            path: String,
            contentType: String,
            _id: false,
        },
    ],
    scheduledAt: { type: Date, default: null },
    sentAt: { type: Date, default: null },
});

module.exports = mongoose.model('Email', emailSchema);
