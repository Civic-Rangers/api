import { mongoConnector } from "./utils/mongooseConnection";
import express from "express";
import path from "path";
import cors from "cors";

import routes from "./routers";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cors());

mongoConnector();

//app.use("/static", express.static(path.join(__dirname, "src/static")));

app.use("/api", routes);

app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});
