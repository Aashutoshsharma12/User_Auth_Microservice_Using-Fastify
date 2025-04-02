"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authRoute;
const http_status_codes_1 = require("http-status-codes");
const auth_1 = __importDefault(require("../../controllers/admin/auth"));
const authenticate_1 = require("../../utils/authenticate");
async function authRoute(fastify) {
    fastify.post('/signUp', async (req, reply) => {
        try {
            const data = await auth_1.default.adminSignUp(req.body, fastify);
            reply.status(http_status_codes_1.StatusCodes.CREATED).send({ data: data, code: http_status_codes_1.StatusCodes.CREATED });
        }
        catch (err) {
            reply.code(http_status_codes_1.StatusCodes.BAD_REQUEST).send({ error: err.err.message, code: http_status_codes_1.StatusCodes.BAD_REQUEST });
        }
    });
    fastify.post('/login', async (req, reply) => {
        try {
            const data = await auth_1.default.adminLogin(req.body, fastify);
            reply.status(http_status_codes_1.StatusCodes.CREATED).send({ data: data, code: http_status_codes_1.StatusCodes.CREATED });
        }
        catch (err) {
            reply.code(http_status_codes_1.StatusCodes.BAD_REQUEST).send({ error: err, code: http_status_codes_1.StatusCodes.BAD_REQUEST });
        }
    });
    fastify.put('/add_classto_user', { preHandler: (0, authenticate_1.authorizeRoles)(["admin"]) }, async (req, reply) => {
        const data = await auth_1.default.add_classto_user(req.body, req.userId);
        reply.status(http_status_codes_1.StatusCodes.CREATED).send({ data: data, code: http_status_codes_1.StatusCodes.CREATED });
    });
    fastify.get('/details', { preHandler: (0, authenticate_1.authorizeRoles)(["admin"]) }, async (req, reply) => {
        try {
            const data = await auth_1.default.details(req.userId, req.headers);
            reply.status(http_status_codes_1.StatusCodes.OK).send({ data: data, code: http_status_codes_1.StatusCodes.OK });
        }
        catch (err) {
            reply.code(http_status_codes_1.StatusCodes.BAD_REQUEST).send({ error: err.toString(), code: http_status_codes_1.StatusCodes.BAD_REQUEST });
        }
    });
}
