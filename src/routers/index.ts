import express from "express";

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

router.get("/users", (req, res) => {
  res.send("Get all users");
});

router.post("/users", (req, res) => {
  res.send("Create a new user");
});

router.get("/users/:id", (req, res) => {
  res.send(`Get user with id ${req.params.id}`);
});

router.put("/users/:id", (req, res) => {
  res.send(`Update user with id ${req.params.id}`);
});

router.delete("/users/:id", (req, res) => {
  res.send(`Delete user with id ${req.params.id}`);
});

router.get("/spots", (req, res) => {
  res.send("Get all spots");
});

router.post("/spots", (req, res) => {
  res.send("Create a new spot");
});

router.get("/spots/:id", (req, res) => {
  res.send(`Get spot with id ${req.params.id}`);
});

router.put("/spots/:id", (req, res) => {
  res.send(`Update spot with id ${req.params.id}`);
});

router.delete("/spots/:id", (req, res) => {
  res.send(`Delete spot with id ${req.params.id}`);
});

router.get("/applications", (req, res) => {
  res.send("Get all applications");
});

router.post("/applications", (req, res) => {
  res.send("Create a new application");
});

router.get("/applications/:id", (req, res) => {
  res.send(`Get application with id ${req.params.id}`);
});

router.put("/applications/:id", (req, res) => {
  res.send(`Update application with id ${req.params.id}`);
});

router.delete("/applications/:id", (req, res) => {
  res.send(`Delete application with id ${req.params.id}`);
});

export default router;
