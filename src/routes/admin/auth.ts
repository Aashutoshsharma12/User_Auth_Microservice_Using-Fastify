
import { StatusCodes } from "http-status-codes";
import auth from "../../controllers/admin/auth";
import { authorizeRoles } from "@utils/authenticate";
export default async function authRoute(fastify: any) {
    fastify.post('/signUp', async (req: any, reply: any) => {
        try {
            const data = await auth.adminSignUp(req.body, fastify);
            reply.status(StatusCodes.CREATED).send({ data: data, code: StatusCodes.CREATED });
        } catch (err) {
            reply.code(StatusCodes.BAD_REQUEST).send({ error: err.err.message, code: StatusCodes.BAD_REQUEST });
        }
    });

    fastify.post('/login', async (req: any, reply: any) => {
        try {
            const data = await auth.adminLogin(req.body, fastify);
            reply.status(StatusCodes.CREATED).send({ data: data, code: StatusCodes.CREATED });
        } catch (err) {
            reply.code(StatusCodes.BAD_REQUEST).send({ error: err, code: StatusCodes.BAD_REQUEST });
        }
    });

    fastify.put('/add_classto_user', { preHandler: authorizeRoles(["admin"]) }, async (req: any, reply: any) => {
        const data = await auth.add_classto_user(req.body, req.userId);
        reply.status(StatusCodes.CREATED).send({ data: data, code: StatusCodes.CREATED });
    });

    fastify.get('/details', { preHandler: authorizeRoles(["admin"]) }, async (req: any, reply: any) => {
        try {
            const data = await auth.details(req.userId, req.headers);
            reply.status(StatusCodes.OK).send({ data: data, code: StatusCodes.OK });
        } catch (err: any) {
            reply.code(StatusCodes.BAD_REQUEST).send({ error: err.toString(), code: StatusCodes.BAD_REQUEST });
        }
    });

}