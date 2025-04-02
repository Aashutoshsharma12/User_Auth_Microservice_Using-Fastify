"use strict";
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    classId: { type: String, required: false }
}, {
    timestamps: true
});
const adminModel = (0, mongoose_1.model)('admin', schema);
module.exports = adminModel;
