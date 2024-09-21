import express from "express";
import auth from "./auth.routes";

import spots from "./spots.routes";
import application from "./application.routes";

const router = express.Router();

router.get("/", (req: any, res) => {
  const routes = [
    { method: "GET", path: "/users", description: "Get all users" },
    { method: "POST", path: "/users", description: "Create a new user" },
    {
      method: "GET",
      path: "/users/:id",
      description: `Get user with given id`,
    },
    {
      method: "PUT",
      path: "/users/:id",
      description: `Update user with given id`,
    },
    { method: "GET", path: "/spots", description: "Get all spots" },
    { method: "POST", path: "/spots", description: "Create a new spot" },
    {
      method: "GET",
      path: "/spots/:id",
      description: `Get spot with given id`,
    },
    {
      method: "PUT",
      path: "/spots/:id",
      description: `Update spot with given id`,
    },
    {
      method: "DELETE",
      path: "/spots/:id",
      description: `Delete spot with given id`,
    },
    {
      method: "GET",
      path: "/applications",
      description: "Get all applications",
    },
    {
      method: "POST",
      path: "/applications",
      description: "Create a new application",
    },
    {
      method: "GET",
      path: "/applications/:id",
      description: `Get application with given id`,
    },
    {
      method: "PUT",
      path: "/applications/:id",
      description: `Update application with given id`,
    },
    {
      method: "DELETE",
      path: "/applications/:id",
      description: `Delete application with given id`,
    },
  ];

  res.json(routes);
});

router.use("/auth", auth);

router.use("/spots", spots);
router.use("/applications", application);

export default router;
