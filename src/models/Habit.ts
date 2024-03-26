import dayjs from "dayjs"
import { prisma } from "../lib/prisma";
import { z } from "zod";


export class Habit {
    constructor(){}
    async  createHabit(request: any, userId: string) {
        const createHabitBody = z.object({
            title: z.string(),
            WeekDays: z.array(z.number().min(0).max(6))
        })

        const { title, WeekDays } = createHabitBody.parse(request.body)
        const today = dayjs().startOf('day').toDate()

        await prisma.habit.create({
            data: {
                title,
                created_at: today,
                WeekDays: {
                    create: WeekDays.map(weekDay => {
                        return { week_day: weekDay, }
                    })
                },
                user_id: userId
            }
        })
    }

    async  toggleHabit(request: any, userId: string) {
        const toggleHabitParams = z.object({
            id: z.string().uuid()
        })

        const { id } = toggleHabitParams.parse(request.params)
        const today = dayjs().startOf('day').toDate()

        let day = await prisma.day.findUnique({
            where: {
                date: today
            }
        })
        if (!day) {
            day = await prisma.day.create({
                data: {
                    date: today
                }
            })
        }

        const dayHabit = await prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day.id,
                    habit_id: id
                },
                AND: {
                    habit: {
                        user_id: userId
                    }
                }
            },
            
        })

        if (dayHabit) {
            await prisma.dayHabit.delete({
                where: {
                    id: dayHabit.id,
                }
            })
        } else {
            // completar habito

            await prisma.dayHabit.create({
                data: {
                    day_id: day.id,
                    habit_id: id
                }
            })
        }

    }

}