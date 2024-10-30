import { prisma } from "../lib/prisma";
import { UserProps } from "./User";
import dayjs from "dayjs";


export type SummaryType = {
    id: string,
    date: Date,
    amount: number,
    completed: number
}[]


export class Summary {
    constructor() { }

    async getData(userId: string) : Promise<SummaryType>{

        const data = await prisma.$queryRaw<SummaryType>`
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
    async getChartSummary(summary: SummaryType) {
        let data = { 
                0: {percent:0, qtd: 0}, 
                1: {percent:0, qtd: 0}, 
                2: {percent:0, qtd: 0}, 
                3: {percent:0, qtd: 0}, 
                4: {percent:0, qtd: 0}, 
                5: {percent:0, qtd: 0}, 
                6: {percent:0, qtd: 0}, 
            }
            
        
        
        summary.forEach(day => {
            data[dayjs(day.date).day()].qtd++
            data[dayjs(day.date).day()].percent += (day.completed / day.amount * 100)
        
        });

        for (const key in data) {
            data[key] = (data[key].percent / data[key].qtd).toFixed(2)
        }
        
        return data;
    }
}