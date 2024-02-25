import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import blogRouter from './routes/blogRouter';
import userRouter from './routes/userRouter';
import { getBlogs } from './controllers/blog.controller';

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>().basePath('/api/v1');

app.use(
  '/*',
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(prettyJSON());

// Custom Not Found Message
app.notFound((c) => {
  return c.json({ msg: '404 Not Found' }, 404);
});

// Error handling
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ msg: 'Internal Server Error' }, 500);
});

app.route('/user', userRouter);
app.route('/blog', blogRouter);
app.get('/blogs', ...getBlogs);

export default app;
