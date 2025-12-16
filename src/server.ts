import { App } from "./app";
import { ConnectMongo } from "./config/db";
import { ENV } from "./config/env";

const app = new App();
const database = new ConnectMongo();

database.connectDB();

app
  .getApp()
  .listen(ENV.PORT, () => console.log(`server running on port ${ENV.PORT}`));
