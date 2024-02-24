### Run the Backend:

```
npm install
npm run dev
```

### Deploy the Backend:

```
npm run deploy
```

> Note: Must have Cloudflare account and signed in to wrangler

### Endpoints:

1. POST - `/api/v1/signin` : Signup user
2. POST - `/api/v1/login` : Login user
3. GET - `/api/v1/blogs` : Get All Blogs (Public)
4. GET - `/api/v1/blog/:id` : Get Blog by ID (Private)
5. POST - `/api/v1/blog` : Create Blog (Private)
6. PUT - `/api/v1/blog/:id` : Update Blog by ID (Private)
