"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _Custom_message_1 = require("../../Custom_message/index");
const admin_1 = __importDefault(require("../../models/admin"));
const http_status_codes_1 = require("http-status-codes");
const argon2_1 = __importDefault(require("argon2"));
const authenticate_1 = require("../../utils/authenticate");
const publisher_1 = require("../../utils/publisher");
const api_call_method_1 = require("../../utils/api_call_method");
const adminSignUp = async (body, fastify) => {
    try {
        const { name, email, password } = body;
        body.password = await argon2_1.default.hash(password + "" + "1234");
        const add = await admin_1.default.create(body);
        return ({ code: http_status_codes_1.StatusCodes.CREATED, data: add });
    }
    catch (err) {
        throw ({ code: http_status_codes_1.StatusCodes.BAD_REQUEST, err: err });
    }
};
const adminLogin = async (body, fastify) => {
    try {
        const { email, password } = body;
        const add = await admin_1.default.findOne({ email: email });
        if (add) {
            if (await argon2_1.default.verify(add.password, password + "" + "1234")) {
                const token = await (0, authenticate_1.generateToken)(fastify, add._id, 'admin');
                const obj = {
                    _id: add._id,
                    token: token
                };
                (0, publisher_1.sendMessage)('login_queue', obj);
                const api_endPoint = "/class/api/v1/admin/auth/list";
                const response = await (0, api_call_method_1.Api_call_get_method)('Class', api_endPoint, token);
                return ({ token: token, classData: response });
            }
            else {
                throw ((0, _Custom_message_1.messages)('en').WrongPassword);
            }
        }
        else {
            throw ((0, _Custom_message_1.messages)('en').noSuchAccountExist);
        }
    }
    catch (err) {
        console.log(err);
        throw (err);
    }
};
const add_classto_user = async (body, userId) => {
    try {
        const { classId } = body;
        console.log(classId, "slssl-------classId");
        const add = await admin_1.default.findOneAndUpdate({ _id: userId }, { $set: { classId: classId } }, { new: true });
        return add;
    }
    catch (err) {
        throw err;
    }
};
const details = async (userId, headers) => {
    try {
        const { authorization } = headers;
        // const data = await adminModel.findOne({ _id: userId, classId: { $exists: true } });
        const data = await admin_1.default.findOne({ _id: userId });
        if (data) {
            if (data.classId) {
                const api_endPoint = "/class/api/v1/admin/auth/details?classId=" + data.classId;
                const response = await (0, api_call_method_1.Api_call_get_method)('Class', api_endPoint, authorization);
                const new_obj = data.toObject();
                new_obj.classDetails = response;
                return new_obj;
            }
        }
        return data;
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.default = {
    adminSignUp,
    adminLogin,
    add_classto_user,
    details
};
