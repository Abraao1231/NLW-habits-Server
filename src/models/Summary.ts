import { prisma } from "../lib/prisma";
import { UserProps } from "./User";


export class Summary {   
    constructor(){}

    async getData(userId: string){
        
        const data = await prisma.$queryRaw`
            SELECT D.id, 
            D.date,
                (
                SELECT cast(count(*) as float)
                FROM day_habit DH
                JOIN habits H on H.id = DH.habit_id
                WHERE DH.day_id = D.id
                AND H.user_id = ${userId}
                
            ) as completed,
            (
                SELECT cast(count(*) as float)
                FROM habit_week_days HDW
                JOIN habits H ON H.id = HDW.habit_id
                WHERE
                HDW.week_day = EXTRACT(dow FROM D.date AT TIME ZONE 'utc')
                AND H.created_at <= D.date
                AND H.user_id = ${userId}
            ) as amount
                FROM day D;
        `

        return data;
    }
}