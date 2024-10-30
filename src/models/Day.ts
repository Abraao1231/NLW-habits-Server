import dayjs from "dayjs";
import { prisma } from "../lib/prisma";
import { z } from "zod";


export class Day {
    
    async getDay(request: any, userId: string) {
        try {
            const getDayParams = z.object({
                date: z.coerce.date()
            })
            
            const { date } = getDayParams.parse(request.query)

            const parsedDate = dayjs(date).startOf('day')
            const weekDay = parsedDate.day()
            
            const possibleHabits = await prisma.habit.findMany({
                where: {
                    created_at: {
                        lte: date
                    },
                    WeekDays: {
                        some: {
                            week_day: weekDay
                        }
                    },
                    AND: {
                        user_id: userId
                    }
                }
            })
            const day2 = await prisma.day.findUnique({
                where: {
                    date: parsedDate.toDate(),
                  }
            })   
    
            const dayHabit = await prisma.dayHabit.findMany({
                where:{
                    day_id: day2.id,
                    habit: {
                        user_id: userId
                    }
                    
                } 
            })

           
            
            const completedHabits = dayHabit.map(habits => {
                return habits.habit_id
            }) ?? []
       
            
            return {
                possibleHabits,
                completedHabits
            }
        } catch (error) {
            console.log(error);

        }
    }
}