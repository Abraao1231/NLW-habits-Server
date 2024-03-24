import Fastfy from 'fastify'
import cors from '@fastify/cors'
import { appRoutes } from './routers'
import { authRouters } from './routersAuth'
import fastifyJwt from '@fastify/jwt'



const app = Fastfy()
app.register(cors, {})
app.register(appRoutes)
app.register(authRouters, {
    prefix: '/auth'
})
app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET
})


app.listen({
    host: "0.0.0.0",
    port:process.env.PORT ? Number(process.env.PORT) : 3333,
}).then(() => {
    console.log('HTTP server running !');
    
})