
import { FastifyInstance } from 'fastify'
import { createHabits, getDay, toggleHabit, getSummary } from './controllers/HabitsController'
import { createUser } from './controllers/UsersController'
import { authenticateHandler } from './middleware/authenticateHandler'
export async function appRoutes(app: FastifyInstance) {

    

    app.post('/habits', {onRequest: [authenticateHandler]}, async (request) => {
        createHabits(request)
    })
    app.get('/day', {onRequest: [authenticateHandler]}, async (request) => {
        getDay(request)
    })
    app.patch('/habits/:id/toggle', {onRequest: [authenticateHandler]}, async (request) => {
        toggleHabit(request)
    })
    app.get('/summary', {onRequest: [authenticateHandler]}, async (request) => {
      const decodedToken = app.jwt.decode(request.headers.authorization.replace('Bearer ', ''));
      const email = decodedToken['email']
      return getSummary()
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
            return createUser(request)
          },
    })
    
   
}