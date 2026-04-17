import { Router, type IRouter } from "express";
import healthRouter from "./health";
import eventsRouter from "./events";
import groupsRouter from "./groups";
import membersRouter from "./members";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(eventsRouter);
router.use(groupsRouter);
router.use(membersRouter);
router.use(dashboardRouter);

export default router;
