require("dotenv").config();

import express, { Application, Request, Response } from "express";
import cors from "cors";
import { route } from "./routes/route";
import {
  MikroORM,
  RequestContext,
  EntityManager,
  EntityRepository,
} from "@mikro-orm/core";
import { Server } from "http";
import { MySqlDriver } from "@mikro-orm/mysql";
import cookieParser from "cookie-parser";

export const DI = {} as {
  server: Server;
  orm: MikroORM;
  em: EntityManager;
};

export const app: Application = express();
const port = process.env.PORT || 8000;

export const init = (async () => {
  DI.orm = await MikroORM.init<MySqlDriver>();
  DI.em = DI.orm.em;

  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({ credentials: true, origin: ["http://localhost:3000"] }));

  app.use((req, res, next) => RequestContext.create(DI.orm.em, next));

  route(app);

  app.listen(port, () => {
    console.log("Listening on Port 8000");
  });
})();
