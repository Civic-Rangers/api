import express, { Request, Response } from "express";
import routes from "./routers";

const app = express();
const port = process.env.PORT || 3000;

app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
