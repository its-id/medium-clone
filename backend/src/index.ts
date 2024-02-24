import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import {
  createBlog,
  getBlog,
  getBlogs,
  updateBlog,
} from './controllers/blog.controller';
import { signIn, signUp } from './controllers/user.controller';
import { jwt, verify } from 'hono/jwt';

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
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

// JWT Middleware: Protecting the /blog/* routes
app.use('/blog/*', async (c, next) => {
  const header = c.req.header('Authorization') || '';

  if (!header) return c.json({ msg: 'Unauthorized' }, 401);
  const token = header.split(' ')[1];
  if (!token) return c.json({ msg: 'Unauthorized' }, 401);

  const decoded = await verify(token, c.env.JWT_SECRET);

  if (!decoded) return c.json({ msg: 'Unauthorized' }, 401);
  return next();
});

// Custom Not Found Message
app.notFound((c) => {
  return c.json({ msg: '404 Not Found' }, 404);
});

// Error handling
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ msg: 'Internal Server Error' }, 500);
});

app.get('/blogs', ...getBlogs);

app
  .get('/blog/:id', ...getBlog)
  .post('/blog', ...createBlog)
  .put('/blog/:id', ...updateBlog);

app.post('/signup', ...signUp);

app.post('/signin', ...signIn);

export default app;
