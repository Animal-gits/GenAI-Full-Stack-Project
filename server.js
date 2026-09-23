import app from "./src/app.js"
import connectDB from "./src/config/db.js";
import env from "./src/config/env.js";

connectDB()

console.log(env.PORT)
app.listen(env.PORT , () => {
    console.log("Server is running on port 3000")
})