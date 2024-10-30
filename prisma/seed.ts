import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

const firstUserId = 'asdasdasio73y47ghiubn4';

const firstHabitId = '0730ffac-d039-4194-9571-01aa2aa0efbd';
const firstHabitCreationDate = new Date('2024-09-30T03:00:00.000');

const secondHabitId = '00880d75-a933-4fef-94ab-e05744435297';
const secondHabitCreationDate = new Date('2024-01-03T03:00:00.000');

const thirdHabitId = 'fa1a1bcf-3d87-4626-8c0d-d7fd1255ac00';
const thirdHabitCreationDate = new Date('2024-01-08T03:00:00.000');

// Função para gerar números aleatórios
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function run() {
  await prisma.dayHabit.deleteMany();
  await prisma.habitWeekDays.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.day.deleteMany();
  await prisma.user.deleteMany();

  /**
   * Create habits
   */
  await Promise.all([
 
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
				id: firstHabitId,
				title: 'estudar',
				created_at: firstHabitCreationDate,
				WeekDays: {
				  create: [{ week_day: 1 }, { week_day: 2 }, { week_day: 3 }],
				},
			  },
			  {
				id: secondHabitId,
				title: 'Beber 2L água',
				created_at: secondHabitCreationDate,
				WeekDays: {
				  create: [ { week_day: 0 },
					{ week_day: 1 },
					{ week_day: 2 },
					{ week_day: 3 },
					{ week_day: 4 },
					{ week_day: 5 },
					{ week_day: 6 },],
				},
			  },
            {
              id: thirdHabitId,
              title: 'Dormir 8h',
              created_at: thirdHabitCreationDate,
              WeekDays: {
                create: [
				          { week_day: 0 },
                  { week_day: 1 },
                  { week_day: 2 },
                  { week_day: 3 },
                  { week_day: 4 },
                  { week_day: 5 },
				          { week_day: 6 },
                ],
              },
            },
          ],
        },
      },
    }),
  ]);

  // Loop para criar dias aleatórios com dayHabits de 'thirdHabitId' do dia atual até 1º de janeiro de 2024
  const today = dayjs().startOf('day');
  const firstDayOfJanuary = dayjs('2024-01-01').add(100, 'day');
  const dayPromises: Promise<any>[] = [];

  let currentDate = today;
  while (currentDate.isAfter(firstDayOfJanuary) || currentDate.isSame(firstDayOfJanuary)) {
    
    dayPromises.push(
      prisma.day.create({
        data: {
          date: currentDate.toDate(),
          dayHabits: {
            create: [1,2,3].includes(currentDate.day()) ? [
              {
                habit_id: thirdHabitId,
              }, 
              {
                habit_id: firstHabitId
              }
            ] : {
            habit_id: thirdHabitId,
          },
          },
        },
      })
    );
    // Gera um intervalo aleatório entre 1 e 3 dias para pular para a próxima data
    const randomDaysToSubtract = getRandomInt(1, 3);
    currentDate = currentDate.subtract(randomDaysToSubtract, 'day');
  }
 
  await Promise.all(dayPromises);

  console.log(`${dayPromises.length} dias cadastrados com sucesso!`);
}

run()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
