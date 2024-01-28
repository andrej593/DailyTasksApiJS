import { Router } from 'express';
import { register, login, checkForBearer } from '../controllers/userController.js';

const userRouter = Router();

//midlleware to check for bearer token and verify it
userRouter.use('/protected', checkForBearer);

//everyone
userRouter.post('/register', register);
userRouter.post('/login', login);

export { userRouter };