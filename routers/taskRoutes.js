import { Router } from 'express';
import { checkForBearer } from '../controllers/userController.js';
import { checkQueryParams, createTask, getTasks } from '../controllers/taskController.js';

const taskRouter = Router();

//midlleware to check for bearer token and verify it
taskRouter.use('*', checkForBearer);
taskRouter.use('/query', checkQueryParams);

//loged in users -> midlleware for bearer, where query check if value are valid
taskRouter.post('/createTask', createTask);
taskRouter.get('/query/getTasks', getTasks);

export { taskRouter };