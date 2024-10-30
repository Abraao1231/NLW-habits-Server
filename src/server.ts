import Fastfy from 'fastify'
import cors from '@fastify/cors'
import { appRoutes } from './routers'
import { authRouters } from './routersAuth'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

const app = Fastfy()


const swaggerOptions = {
    swagger: {
        info: {
            title: "My Title",
            description: "My Description.",
            version: "1.0.0",
        },
        host: "localhost",
        schemes: ["http", "https"],
        consumes: ["application/json"],
        produces: ["application/json"],
        tags: [{ name: "Default", description: "Default" }],
    },
};

const swaggerUiOptions = {
    routePrefix: "/docs",
    exposeRoute: true,
};

app.register(fastifySwagger, swaggerOptions);
app.register(fastifySwaggerUi, swaggerUiOptions);

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
    console.log(`HTTP server running in ${process.env.PORT ? Number(process.env.PORT) : 3333}` );
    
})