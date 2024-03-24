import { User } from "./models/User";
import bcrypt from 'bcryptjs';
import {z} from 'zod'

export async function login(request: any){
    try {

        const userModel = new User()
        const createUserBody = z.object({
            email: z.string(),
            password: z.string()
        })    

        let {email, password} = createUserBody.parse(request.body)

        const userFind = await userModel.validadeExistsUser(email)
        const passwordMatch = await bcrypt.compare(password, userFind.password)
        if ( userFind != null && passwordMatch )
            return  {
                email: userFind.email,
                name: userFind.name
            }
        return false
    } catch (error) {
        console.log(error);
        return false;
    }
    

}