import express from 'express'
import 'dotenv/config'
import cookieParser from 'cookie-parser'

import { connectDB } from './lib/db.js'
import authRoutes from './routes/auth.route.js'

const app = express()

const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    connectDB()
    console.log(`Server is running at PORT: ${PORT}`)
})