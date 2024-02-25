import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { createFactory } from 'hono/factory';

const factory = createFactory();

export const getBlogs = factory.createHandlers(async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            email: true,
          },
        },
      },
    });

    return c.json(posts);
  } catch (err) {
    return c.json({ msg: 'Internal Server Error' }, 500);
  }
});

export const getBlog = factory.createHandlers(async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const id = c.req.param('id');

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!post) return c.json({ msg: 'Post not found' }, 404);

    return c.json(post);
  } catch (err) {
    return c.json({ msg: 'Internal Server Error' }, 500);
  }
});

export const updateBlog = factory.createHandlers(async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const id = c.req.param('id');
  const { title, content } = await c.req.json();

  try {
    if (!title || !content)
      return c.json({ msg: 'Title and Content are required' }, 400);

    const post = await prisma.post.update({
      where: {
        id: id,
        authorId: c.get('userId'),
      },
      data: {
        title,
        content,
      },
    });

    if (!post) return c.json({ msg: 'Post not found' }, 404);
    return c.json({ msg: 'Blog Updated Successfully!' }, 201);
  } catch (err) {
    return c.json({ msg: 'Internal Server Error' }, 500);
  }
});

export const createBlog = factory.createHandlers(async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const { title, content } = await c.req.json();

  try {
    if (!title || !content)
      return c.json({ msg: 'Title and Content are required' }, 400);

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: true,
        authorId: c.get('userId'),
      },
    });

    return c.json({ postId: post?.id, msg: 'Blog Created Successfully!' }, 201);
  } catch (err) {
    return c.json({ msg: 'Internal Server Error' }, 500);
  }
});

export const deleteBlog = factory.createHandlers(async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const id = c.req.param('id');

  try {
    const post = await prisma.post.delete({
      where: {
        id: id,
        authorId: c.get('userId'),
      },
    });

    if (!post) return c.json({ msg: 'Post not found' }, 404);
    return c.json({ msg: 'Blog Deleted Successfully!' }, 201);
  } catch (err) {
    return c.json({ msg: 'Internal Server Error' }, 500);
  }
});
