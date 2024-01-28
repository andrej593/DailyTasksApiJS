import { Schema, model } from "mongoose";
/*const taskType = {
    REGULAR: 0,
    DAILY: 1,
    SPECIAL: 2
}*/
const status = {
    INPROGRESS: 0,
    COMPLETED: 1,
    FAILED: 2
}
//const options = { discriminatorKey: 'task' };
const taskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: Number, default: status.INPROGRESS },
    date: { type: Date, required: true }
}/*, options*/);
/*const dailyTaskSchema = new Schema({
    time: { type: String, required: true },
    exclude: { type: [], required: true, default: [] },
    completedOn: { type: [], required: true, defualt: [] }
}, options);
const regularTaskSchema = new Schema({
    status: { type: Number, default: status.INPROGRESS },
    date: { type: Date, required: true }
}, options);
const specialTaskSchema = new Schema({
    status: { type: Number, default: status.INPROGRESS },
    date: { type: Date, required: true },
    warnDate: { type: Date, required: true }
}, options);*/

const Task = model('Task', taskSchema);
/*const DailyTask = Task.discriminator('DailyTask', dailyTaskSchema);
const RegularTask = Task.discriminator('RegularTask', regularTaskSchema);
const SpecialTask = Task.discriminator('SpecialTask', specialTaskSchema);*/

export { Task, /*DailyTask, RegularTask, SpecialTask, taskType, taskSchema, status, dailyTaskSchema, regularTaskSchema, specialTaskSchema*/ }