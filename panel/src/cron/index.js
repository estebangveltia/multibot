import cron from "node-cron";
import dayjs from "dayjs";
import { aggregateDay } from "./aggregate.js";

export function registerDailyCron() {
  cron.schedule("10 0 * * *", async () => {
    const yday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
    console.log("[CRON] Aggregating", yday);
    await aggregateDay(yday);
  });
}
