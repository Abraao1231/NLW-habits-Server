import dayjs from 'dayjs'
import {prisma} from '../lib/prisma'
import bcrypt from 'bcryptjs';



export interface UserPropsRequest {
    name: string
    email: string
    password: string
}

export interface UserProps {
    name: string
    email: string
    password: string
    id: string
    created_at: Date
}

export class User {
    constructor (){}

    async createUser(user: UserPropsRequest){
        try {
           

            const created_at = dayjs().startOf('day').toDate()
            const userFind = await this.validadeExistsUser(user.email)
            user.password = await bcrypt.hash(user.password, 10);

            
            if (userFind == null){
                await prisma.user.create({
                    data: {
                        name: user.name,
                        email: user.email,
                        password: user.password,
                        created_at: created_at
                    }
                })
                return {status: 200, message: 'usuario cadastrado com sucesso'}
            } else {
                return {status: 400, message: `e-mail ja cadastrado`}
            }

        } catch (error) {
            console.log(error);   
            console.log(user.password);
    
            return {status: 500, message: `erro interno no servidor ` }

        }
        
    }

    async validadeExistsUser(email: string){
        let user: UserProps;
        const userFind = await prisma.user.findFirst({
            where: {
                email: email
            }
        })   
        if (userFind != null)
             user = {
                name: userFind.name, 
                email: userFind.email,
                password: userFind.password,
                created_at: new Date(userFind.created_at),
                id: userFind.id
            }
        
        return user         
    }

}
 