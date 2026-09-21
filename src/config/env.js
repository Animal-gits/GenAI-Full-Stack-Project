import dotenv from 'dotenv'

dotenv.config({
    path : "./.env"
})

if(!process.env.MONGO_URI){
    console.error(
        "Warning : MONGO_URI is not set. Please set it in the .env file."
    )
    process.exit(1)
}
if(!process.env.PORT){
    console.error(
        "Warning : PORT is not set. Please set it in the .env file."
    )
    process.exit(1)
}

const config = {
    MONGO_URI : process.env.MONGO_URI,
    PORT : process.env.PORT
}

export default Object.freeze(config)