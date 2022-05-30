import { Router, Request } from "express";
import express from "express";
import multer from "multer";
import {
  AuthenticatedUser,
  Login,
  Logout,
  Register,
  UpdateInfo,
  UpdatePassword,
} from "../controllers/auth.controller";
import { upload } from "../controllers/image.controller";
import { permissions } from "../controllers/permission.controller";
import {
  createProduct,
  deleteProduct,
  getProduct,
  products,
  updateProduct,
} from "../controllers/product.controller";
import {
  createRoles,
  deleteRole,
  getRole,
  getRoles,
  updateRole,
} from "../controllers/role.controller";
import {
  CreateUser,
  deleteUser,
  GetUser,
  updateUser,
  Users,
} from "../controllers/user.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { exportCsv, orders } from "../controllers/order.controller";
import { permissionMiddleware } from "../middleware/permission.middleware";

export const route = (router: Router) => {
  router.post("/api/register", Register);
  router.post("/api/login", Login);
  router.get("/api/user", AuthMiddleware, AuthenticatedUser);
  router.post("/api/logout", AuthMiddleware, Logout);
  router.put("/api/users/info", AuthMiddleware, UpdateInfo);
  router.put("/api/users/password", AuthMiddleware, UpdatePassword);

  router.get(
    "/api/users",
    AuthMiddleware,
    permissionMiddleware("users"),
    Users
  );
  router.post(
    "/api/users",
    AuthMiddleware,
    permissionMiddleware("users"),
    CreateUser
  );
  router.get(
    "/api/users/:id",
    AuthMiddleware,
    permissionMiddleware("users"),
    GetUser
  );
  router.put(
    "/api/users/:id",
    AuthMiddleware,
    permissionMiddleware("users"),
    updateUser
  );
  router.delete(
    "/api/users/:id",
    AuthMiddleware,
    permissionMiddleware("users"),
    deleteUser
  );

  router.get("/api/permissions", AuthMiddleware, permissions);

  router.get("/api/roles", AuthMiddleware, getRoles);
  router.post("/api/roles", AuthMiddleware, createRoles);
  router.get("/api/roles/:id", AuthMiddleware, getRole);
  router.put("/api/roles/:id", AuthMiddleware, updateRole);
  router.delete("/api/roles/:id", AuthMiddleware, deleteRole);

  router.get(
    "/api/products",
    AuthMiddleware,
    permissionMiddleware("products"),
    products
  );
  router.post(
    "/api/products",
    AuthMiddleware,
    permissionMiddleware("products"),
    createProduct
  );
  router.get(
    "/api/products/:id",
    permissionMiddleware("products"),
    AuthMiddleware,
    getProduct
  );
  router.put(
    "/api/products/:id",
    permissionMiddleware("products"),
    AuthMiddleware,
    updateProduct
  );
  router.delete(
    "/api/products/:id",
    permissionMiddleware("products"),
    AuthMiddleware,
    deleteProduct
  );

  router.post("/api/uploads", AuthMiddleware, upload);
  router.use("/api/uploads", express.static("./uploads"));

  router.get("/api/orders", AuthMiddleware, orders);
  router.post("/api/export", AuthMiddleware, exportCsv);
  // router.get("/api/chart", AuthMiddleware, chart);
};
