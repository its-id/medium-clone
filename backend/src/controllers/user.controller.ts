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
    const userExists = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (userExists) return c.json({ error: 'User already exists' }, 403);

    //hashing password
    const digest = await crypto.subtle.digest(
      {
        name: 'SHA-256',
      },
      new TextEncoder().encode(body.password)
    );

    const hashedPassword = [...new Uint8Array(digest)]
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
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
      },
    });

    // Hashing the body password
    const digest = await crypto.subtle.digest(
      {
        name: 'SHA-256',
      },
      new TextEncoder().encode(body.password)
    );

    const hashedPassword = [...new Uint8Array(digest)]
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    //comparing the hashed password with the db user's hashed password
    if (hashedPassword !== user?.password)
      return c.json({ error: 'Wrong Email or password!' }, 403);

    if (!user) return c.json({ error: 'User not found' }, 403);

    const jwt = await sign(
      { id: user.id, email: user.email },
      c.env.JWT_SECRET
    );

    return c.json({ user, token: jwt, msg: 'Signed In Successfully!' }, 201);
  } catch (e) {
    return c.status(403);
  }
});
