import app from "./src/app.js"
import connectDB from "./src/config/db.js";
import env from "./src/config/env.js";
import dns  from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

connectDB()

console.log(env.PORT)
app.listen(env.PORT , () => {
    console.log("Server is running on port 3000")
})