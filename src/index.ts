import { Hono } from "hono";
import { blogs } from "./types/types";
import { BLOG } from "./types/types";
const app = new Hono();

app.get("/", (c) => {
  return c.json({ blogs, port: process.env.PORT });
});

app.get("/api/blogs/:id", (c) => {
  const { id } = c.req.param();
  const blog = blogs.filter((data) => data.id === parseInt(id));
  return c.json(blog);
});

app.put("/api/blogs/:id", async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const blogIndex = blogs.findIndex((data) => data.id === parseInt(id));
  if (blogIndex === -1) return c.json({ message: "Blog not found" }, 404);

  blogs[blogIndex] = {
    ...blogs[blogIndex],
    title: body.title,
    content: body.content,
  };

  return c.json(
    { message: "Blog updated successfully", updatedBlog: blogs[blogIndex] },
    200
  );
});

app.post("/api/blogs", async (c) => {
  const body = await c.req.json();
  if (!body) return c.json({ message: "No body found" }, 400);
  const blog: BLOG = {
    id: blogs.length + 1,
    title: body.title,
    content: body.content,
  };

  blogs.push(blog);
  return c.json({ message: "Blog created successfully", blog }, 200);
});

app.delete("/api/blogs/:id", (c) => {
  const { id } = c.req.param();
  const blog = blogs.filter((data) => data.id === parseInt(id));
  return c.json({ message: "Blog deleted successfully", blog }, 200);
});

export default app;
