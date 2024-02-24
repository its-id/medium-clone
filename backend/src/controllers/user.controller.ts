import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { createFactory } from 'hono/factory';
import { sign } from 'hono/jwt';

const factory = createFactory();

export const signUp = factory.createHandlers(async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });
    return c.json({ user, msg: 'Signed Up Successfully!' }, 201);
  } catch (e) {
    return c.status(403);
  }
});

export const signIn = factory.createHandlers(async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
        password: body.password,
      },
    });

    if (!user) return c.json({ error: 'User not found' }, 403);

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({ user, jwt, msg: 'Signed In Successfully!' }, 201);
  } catch (e) {
    return c.status(403);
  }
});
