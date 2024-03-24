import { FastifyInstance } from 'fastify'
import { login } from './auth'



export async function authRouters(app: FastifyInstance) {

    app.post('/login', {
        schema: {
            body: {
              type: 'object',
              properties: {
                email: { type: 'string', format: 'email' },
                password: {type: 'string'}
              },
              required: ['email', 'password'], 
            },
          },
          
          handler: async (request, res) => {
            const userFind = await login(request)
            if (!userFind){
                res.status(500)
                res.send({message: "login failed"})                
            } else {
                const token = app.jwt.sign(userFind,{
                  expiresIn: '2d'
                })
                res.send({message: "login successfully", token: token})
            }
          },
    })
}