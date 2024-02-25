import { createFactory } from 'hono/factory';
import { verify } from 'hono/jwt';

const factory = createFactory();

export const authMiddleware = factory.createMiddleware(async (c, next) => {
    try {
        const header = c.req.header('Authorization') || '';

        if (!header) return c.json({ msg: 'Unauthorized' }, 401);
        const token = header.split(' ')[1];
        if (!token) return c.json({ msg: 'Unauthorized' }, 401);

        const decoded = await verify(token, c.env.JWT_SECRET);

        if (!decoded) return c.json({ msg: 'Unauthorized' }, 401);
        c.set('userId', decoded?.id);
        c.set('email', decoded?.email);
        await next();
    }catch(err){
        console.error(err);
        return c.json({ msg: 'Internal Server Error' }, 500);
    }
});
