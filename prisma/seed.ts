import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs';
import dayjs from 'dayjs';

// user.password = await bcrypt.hash(user.password, 10);


const prisma = new PrismaClient()

const firstUserId = 'asdasdasio73y47ghiubn4'


const firstHabitId = '0730ffac-d039-4194-9571-01aa2aa0efbd'
const firstHabitCreationDate = new Date('2024-12-31T03:00:00.000')

const secondHabitId = '00880d75-a933-4fef-94ab-e05744435297'
const secondHabitCreationDate = new Date('2024-01-03T03:00:00.000')

const thirdHabitId = 'fa1a1bcf-3d87-4626-8c0d-d7fd1255ac00'
const thirdHabitCreationDate = new Date('2024-01-08T03:00:00.000')

async function run() {
	await prisma.dayHabit.deleteMany()
	await prisma.habitWeekDays.deleteMany()
	await prisma.habit.deleteMany()
	await prisma.day.deleteMany()
	await prisma.user.deleteMany()

	/**
	 * Create habits
	 */
	await Promise.all([
		
		prisma.user.create({
			data: {
				// id: firstUserId,    
				name: 'abraao',      
				email: 'abraao1231@gmail.com',      
				password: await bcrypt.hash('123', 10),   
				created_at: dayjs().startOf('day').toDate(),
				habit: {
					create: [
						{
							id: firstHabitId,
							title: 'Beber 2L água',
							created_at: firstHabitCreationDate,
							WeekDays: {
								create: [{ week_day: 1 }, { week_day: 2 }, { week_day: 3 }]
							},
							
						},
						{
							id: secondHabitId,
							title: 'Acordar',
							created_at: secondHabitCreationDate,
							WeekDays: {
								create: [{ week_day: 1 }, { week_day: 2 }, { week_day: 3 }]
							},

						},
					]
				}
			}
		}),
		prisma.user.create({
			data: {
				id: firstUserId,    
				name: 'abraao2',      
				email: 'abraao12312@gmail.com',      
				password: await bcrypt.hash('123', 10),   
				created_at: dayjs().startOf('day').toDate(),
				habit: {
					create: [
						{
							id: thirdHabitId,
							title: 'Dormir 8h',
							created_at: thirdHabitCreationDate,
							WeekDays: {
								create: [
									{ week_day: 1 },
									{ week_day: 2 },
									{ week_day: 3 },
									{ week_day: 4 },
									{ week_day: 5 }
								]
							}
						}
					]
				}
			}
		})
	])

	await Promise.all([
		/**
		 * Habits (Complete/Available): 1/1
		//  */
		prisma.day.create({
			data: {
				/** Monday */
				date: new Date('2024-01-02T03:00:00.000z'),
				dayHabits: {
					create: {
						habit_id: firstHabitId
					}
				}
			}
		}),

		/**
		 * Habits (Complete/Available): 1/1
		 */
		prisma.day.create({
			data: {
				/** Friday */
				date: new Date('2024-01-06T03:00:00.000z'),
				dayHabits: {
					create: {
						habit_id: firstHabitId
					}
				}
			}
		}),

		/**
		 * Habits (Complete/Available): 2/2
		 */
		prisma.day.create({
			data: {
				/** Wednesday */
				date: new Date('2024-01-04T03:00:00.000z'),
				dayHabits: {
					create: [{ habit_id: firstHabitId }, { habit_id: secondHabitId }]
				}
			}
		})
	])
}

run()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async e => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})