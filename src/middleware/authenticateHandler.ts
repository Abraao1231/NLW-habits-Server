
import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';


export async function authenticateHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
    } catch (error) {
      reply.send(error);
    }
  }
  