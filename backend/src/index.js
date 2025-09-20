import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
  path: "../.env",
});

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    // app.listen(PORT, "0.0.0.0", () => {
    //   console.log(`Server is running at http://0.0.0.0:${PORT}`);
    // });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at ${process.env.PORT || 8000}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection failed !! ", error);
  });
