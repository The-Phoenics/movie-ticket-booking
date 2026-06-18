import express, { Router } from "express";
import businessRouter from "./businessRouter";
import customerRouter from "./customerRouter";
import {
  authRequired,
  validateBusinessRequestRole,
  validateCustomerRequestRole,
} from "@/middlewares";
import moviesRouter from "./movieRouter";

const apiRouter: Router = express.Router();

apiRouter.use("/b", authRequired, /*validateBusinessRequestRole,*/ businessRouter); // TODO: diabled during testing
apiRouter.use("/c", authRequired, /*validateCustomerRequestRole,*/ customerRouter); // TODO: diabled during testing
apiRouter.use("/movies", moviesRouter);

export default apiRouter;
