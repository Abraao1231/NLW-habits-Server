import dayjs from 'dayjs'
import {prisma} from './lib/prisma'
import { FastifyInstance } from 'fastify'
import {z} from 'zod'


export async function appRoutes(app: FastifyInstance){
    app.get('/', (req, reply) => {
        reply.send({ hello: 'world' })
      })
    app.post('/habits', async (request) => {

        const createHabitBody = z.object({
            title: z.string(),
            WeekDays: z.array(z.number().min(0).max(6))
        })

        const {title , WeekDays} = createHabitBody.parse(request.body)
        const today = dayjs().startOf('day').toDate()


        await prisma.habit.create({
            data: {
                title,
                created_at: today,
                WeekDays: {
                    create: WeekDays.map(weekDay => {
                        return {week_day: weekDay,}
                    })
                },
            }
        })

    })
    app.get('/day', async (request) => {
        const getDayParams = z.object({
            date : z.coerce.date()
        })
        const {date} = getDayParams.parse(request.query)
        const parsedDate = dayjs(date).startOf('day')
        const weekDay = parsedDate.get('day')

        const possibleHabits = await prisma.habit.findMany({
            where: {
                created_at: {
                    lte : date
                },
                WeekDays: {
                    some: {
                        week_day: weekDay
                    }
                }
            }
        })

        const day  = await prisma.day.findUnique({
            where: {
                date: parsedDate.toDate()
            },
            include: {
                dayHabits: true
            }
        })

        const completedHabits = day?.dayHabits.map(habits => {
            return habits.habit_id
        })

        return {
            possibleHabits,
            completedHabits
        }
    })
    app.patch('/habits/:id/toggle', async (request) => {
        const toggleHabitParams = z.object({
            id: z.string().uuid()
        })  

        const {id} = toggleHabitParams.parse(request.params)
        const today = dayjs().startOf('day').toDate()

        let day = await prisma.day.findUnique({
            where: {
                date: today
            }
        })
        if (!day){
            day = await prisma.day.create({
                data: {
                    date:today
                }
            })
        }

        const dayHabit = await prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day.id,
                    habit_id: id
                }
            }
        })

        if (dayHabit){
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
        
    })
    app.get('/summary', async(request)=>{
        const summary = await prisma.$queryRaw`
            SELECT 
                D.id, 
                D.date,
                (
                    SELECT 
                        cast(COUNT(*) as float)
                    FROM day_habit DH 
                    WHERE DH.day_id = D.id
                ) as completed,
                (
                    SELECT 
                        cast(COUNT(*) AS float)
                    FROM habit_week_days HWD
                    JOIN habits H 
                        ON H.id = HWD.habit_id
                    WHERE 
                        HWD.week_day = cast(strftime('%W', D.date/1000, 'unixepoch') as int ) 
                        AND H.created_at <= D.date
                ) as amount      
            FROM day D`
                    
        return summary
    })
    
}