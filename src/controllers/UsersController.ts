import { User } from "../models/User" 
import { z } from 'zod'
import { UserProps } from "../models/User"

export async function createUser( request: any ) {
    const userModel = new User()
    const createUserBody = z.object({
        name: z.string(),
        email: z.string(),
        password: z.string()

    })    
    const {name, email, password} = createUserBody.parse(request.body)

    const user: UserProps = {
        name: name,
        password: password,
        email:email
    }

    const response = userModel.createUser(user)
    return response
} 

