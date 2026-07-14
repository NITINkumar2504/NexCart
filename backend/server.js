import express from 'express'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import path from 'path'

import { connectDB } from './lib/db.js'
import authRoutes from './routes/auth.route.js'
import productRoutes from './routes/product.route.js'
import cartRoutes from './routes/cart.route.js'
import couponRoutes from './routes/coupon.route.js'
import paymentRoutes from './routes/payment.route.js'
import analyticsRoutes from './routes/analytics.route.js'
import job from './lib/cron.js'

const app = express()

const PORT = process.env.PORT || 5000

const __dirname = path.resolve()

app.use(express.json({limit: "5mb"}))
app.use(express.urlencoded({extended: true, limit: "5mb"}))
app.use(cookieParser())

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/coupons", couponRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/analytics", analyticsRoutes)

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, "/frontend/dist")))
    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"))
    })
}

console.log(process.env.NODE_ENV);
app.listen(PORT, async () => {
    await connectDB()
    console.log(`Server is running at PORT: ${PORT}`)

    if(process.env.NODE_ENV === 'production'){
        job.start()
    }
})