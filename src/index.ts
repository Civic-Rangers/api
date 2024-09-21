import express from "express";
import routes from "./routers";
import { mongoConnector } from "./utils/mongooseConnection";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

mongoConnector();

app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
