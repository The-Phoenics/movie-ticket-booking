import express, { Router } from "express";
import businessRouter from "./businessRouter";
import customerRouter from "./customerRouter";
import onboardingRouter from "./onboardingRouter";
import {
  authRequired,
  validateBusinessRequestRole,
  validateCustomerRequestRole,
} from "@/middlewares";
import moviesRouter from "./movieRouter";

const apiRouter: Router = express.Router();

apiRouter.use("/b", authRequired, /*validateBusinessRequestRole,*/ businessRouter); // TODO: disabled during testing
apiRouter.use("/c", authRequired, /*validateCustomerRequestRole,*/ customerRouter); // TODO: disabled during testing
apiRouter.use("/movies", moviesRouter);
apiRouter.use("/onboard", onboardingRouter);

export default apiRouter;
