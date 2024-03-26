import { User } from '../models/User'
import { Summary } from '../models/Summary'
import { Day } from '../models/Day'
import { Habit } from '../models/Habit'

    
export async function createHabits(request: any, email: string) {
    
    const habit = new Habit()
    const user = new User()
    const userId = await user.validadeExistsUser(email)
    await habit.createHabit(request, userId.id);
}

export async function getDay(request: any, email:string){
    const day = new Day()
    const user = new User()
    const userId = await user.validadeExistsUser(email)
    return day.getDay(request, userId.id)
}

export async function toggleHabit(request: any, email: string) {
    const habit = new Habit()
    const user = new User()
    const userId = await user.validadeExistsUser(email)

    await habit.toggleHabit(request, userId.id);
}

export async function getSummary(email: string){
    const user = new User()
    const SummaryModel = new Summary()
    const userId = await user.validadeExistsUser(email)
    const data = await SummaryModel.getData(userId.id);
    return  data;
}
