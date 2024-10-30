
import { FastifyInstance } from 'fastify'
import { createHabits, getDay, getSummary, toggleHabit } from './controllers/HabitsController'
import { createUser } from './controllers/UsersController'
import { authenticateHandler } from './middleware/authenticateHandler'
export async function appRoutes(app: FastifyInstance) {


    app.post('/habits', {onRequest: [authenticateHandler]}, async (request, response) => {
      try {
        const decodedToken = app.jwt.decode(request.headers.authorization.replace('Bearer ', ''));
        const email = decodedToken['email']
        createHabits(request, email)
      } catch (error) {
        response.status(500)
        response.send({message: 'server connection error'})
        console.log(error);
      }
        
    })
    app.get('/', async (request, response) => {
        response.send({message:'asd'})
    })
    app.get('/day', {onRequest: [authenticateHandler]}, async (request, response) => {
      try {
        const decodedToken = app.jwt.decode(request.headers.authorization.replace('Bearer ', ''));
        const email = decodedToken['email']
          return getDay(request, email)
      } catch (error) {
        response.status(500)
        response.send({message: 'server connection error'})
        console.log(error);
      }
     
    })

    
    app.patch('/habits/:id/toggle', {onRequest: [authenticateHandler]}, async (request, response) => {
      try {
        const decodedToken = app.jwt.decode(request.headers.authorization.replace('Bearer ', ''));
        const email = decodedToken['email']
        toggleHabit(request, email)
      } catch (error) {
        response.status(500)
        response.send({message: 'server connection error'})
        console.log(error);
      }
        
    })
     
    app.get('/summary', {onRequest: [authenticateHandler]}, async (request, response) => {
      try { 
        const decodedToken = app.jwt.decode(request.headers.authorization.replace('Bearer ', ''));
        const email = decodedToken['email']

        return getSummary(email)        
      } catch (error) {
        response.status(500)
        response.send({message: 'server connection error'})
        console.log(error);
      }
      
      // return getSummary(email)
    })
    app.post('/user', {
        schema: {
            body: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                email: { type: 'string', format: 'email' },
                password: {type: 'string'}
              },
              required: ['name', 'email', 'password'], 
            },
          },
          
          handler: async (request, reply) => {
            const response = await createUser(request)
            
            reply.status(response.status)
            if (response.status == 200){
              const token = app.jwt.sign(response.user,{
                expiresIn: '2d'
              })
              return {
                user: response.user,
                token: token 
              }
            } 
            
            reply.send({message: response.message})
          },
    })
    
   
}