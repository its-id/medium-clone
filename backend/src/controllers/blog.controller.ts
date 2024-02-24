import { createFactory } from 'hono/factory';

const factory = createFactory();

export const getBlogs = factory.createHandlers(async (c) => {
  return c.text('Blogs!');
});

export const getBlog = factory.createHandlers(async (c) => {
  return c.text('Current Blog!');
});

export const updateBlog = factory.createHandlers(async (c) => {
  const id = c.req.param('id');
  return c.text(`Update Blog ${id}!`);
});

export const createBlog = factory.createHandlers(async (c) => {
  return c.text('Create Blog!');
});
