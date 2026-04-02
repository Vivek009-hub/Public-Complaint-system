import './src/config/env.js'
import connectDB from './src/config/db.js'
import { app } from './app.js'


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running on port ${process.env.PORT || 5000}`);
    })
})
.catch((error)=>{
    console.error("Failed to connect to the database:", error);
    process.exit(1);
})

