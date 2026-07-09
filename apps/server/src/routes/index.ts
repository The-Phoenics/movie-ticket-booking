import express, { Router } from "express";
import ownerRouter from "./ownerRouter";
import customerRouter from "./customerRouter";
import onboardingRouter from "./onboardingRouter";
import profileRouter from "./profileRouter";
import { authRequired } from "@/middlewares";
import moviesRouter from "./movieRouter";

const apiRouter: Router = express.Router();

apiRouter.use("/b", authRequired, /*validateBusinessRequestRole,*/ ownerRouter); // TODO: disabled during testing
apiRouter.use("/c", authRequired, /*validateCustomerRequestRole,*/ customerRouter); // TODO: disabled during testing
apiRouter.use("/movies", moviesRouter);
apiRouter.use("/onboard", onboardingRouter);
apiRouter.use("/profile", authRequired, profileRouter);

export default apiRouter;
