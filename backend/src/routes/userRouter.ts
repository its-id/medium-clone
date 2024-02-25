import { Hono } from 'hono';
import { signIn, signUp } from '../controllers/user.controller';

const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

userRouter.post('/signup', ...signUp);
userRouter.post('/signin', ...signIn);

export default userRouter;
