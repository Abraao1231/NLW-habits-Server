import dayjs from "dayjs"
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { User } from "./User";

export class Day {
    
    async getDay(request: any, userId: string) {
        try {
            const getDayParams = z.object({
                date: z.coerce.date()
            })
            const { date } = getDayParams.parse(request.query)
            const parsedDate = dayjs(date).startOf('day')
            const weekDay = parsedDate.get('day')
            
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

            const day = await prisma.day.findUnique({
                where: {
                    date: parsedDate.toDate(),
                    dayHabits: {
                        every: {
                           habit: {
                             user_id: userId
                           } 
                        }
                    } 
                },
                
                include: {
                    dayHabits: true
                }
            })

            const completedHabits = day?.dayHabits.map(habits => {
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