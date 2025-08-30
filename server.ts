import { createServer } from "http";
import next from "next";

const port: number = parseInt(process.env.PORT || "3000", 10);
const dev: boolean = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(port, (err?: Error) => {
    if (err) throw err;
    console.log(`🚀 Next.js running on http://localhost:${port}`);
  });
});
