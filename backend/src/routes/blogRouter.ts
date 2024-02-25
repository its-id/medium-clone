import { Hono } from 'hono';
import {
  createBlog,
  deleteBlog,
  getBlog,
  updateBlog
} from '../controllers/blog.controller';
import { authMiddleware } from '../middleware/auth';

const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use('/*', authMiddleware);

blogRouter
  .get('/:id', ...getBlog)
  .post('/', ...createBlog)
  .put('/:id', ...updateBlog)
  .delete('/:id', ...deleteBlog);

export default blogRouter;
