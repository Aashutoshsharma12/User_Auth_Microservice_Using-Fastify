import { messages } from "@Custom_message";
import adminModel from "@models/admin";
import { StatusCodes } from "http-status-codes";
import argon2 from "argon2";
import { generateToken } from "@utils/authenticate";
import cookieParser from 'cookie-parser';
import { sendMessage } from "@utils/publisher";
import { Api_call_get_method } from "@utils/api_call_method";

const adminSignUp = async (body: any, fastify: any) => {
    try {
        const { name, email, password } = body;
        body.password = await argon2.hash(password + "" + "1234");
        const add = await adminModel.create(body);
        return ({ code: StatusCodes.CREATED, data: add });
    } catch (err) {
        throw ({ code: StatusCodes.BAD_REQUEST, err: err });
    }
}

const adminLogin = async (body: any, fastify: any) => {
    try {
        const { email, password } = body;
        const add: any = await adminModel.findOne({ email: email });
        if (add) {
            if (await argon2.verify(add.password, password + "" + "1234")) {
                const token = await generateToken(fastify, add._id, 'admin');
                const obj: any = {
                    _id: add._id,
                    token: token
                }
                sendMessage('login_queue', obj);
                const api_endPoint = "/class/api/v1/admin/auth/list"
                const response = await Api_call_get_method('Class', api_endPoint, token)
                return ({ token: token, classData: response });
            } else {
                throw (messages('en').WrongPassword);
            }
        } else {
            throw (messages('en').noSuchAccountExist);
        }
    } catch (err) {
        console.log(err);
        throw (err);
    }
}
const add_classto_user = async (body: any, userId: any) => {
    try {
        const { classId } = body;
        console.log(classId, "slssl-------classId")
        const add = await adminModel.findOneAndUpdate({ _id: userId }, { $set: { classId: classId } }, { new: true });
        return add;
    } catch (err) {
        throw err;
    }
}

const details = async (userId: any, headers: any) => {
    try {
        const { authorization } = headers;
        // const data = await adminModel.findOne({ _id: userId, classId: { $exists: true } });
        const data = await adminModel.findOne({ _id: userId });
        if (data) {
            if (data.classId) {
                const api_endPoint = "/class/api/v1/admin/auth/details?classId=" + data.classId
                const response = await Api_call_get_method('Class', api_endPoint, authorization);
                const new_obj: any = data.toObject()
                new_obj.classDetails = response
                return new_obj;
            }
        }
        return data;
    } catch (err) {
        throw new Error(err);
    }
}

export default {
    adminSignUp,
    adminLogin,
    add_classto_user,
    details
} as const;