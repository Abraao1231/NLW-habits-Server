
import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';


export async function authenticateHandler(request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) {
    try {
      await request.jwtVerify();
    } catch (error) {
      reply.send(error);
    }
  }
  