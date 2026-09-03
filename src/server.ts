import app from "./app";
import { config } from "./config";

app.listen(config.port, () => {
  console.log(`Card validator API running on port ${config.port}`);
});
