import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken
        if(!accessToken) return res.status(401).json({ message: "Unauthorized - No access token provided" })
           
        try {
            const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

            const user = await User.findById(decodedToken.userId).select("-password")
            if(!user) return res.status(404).json({error : "User not found"})
                
            req.user = user
            next()
        } 
        catch (error) {
            if(error.name === "TokenExpiredError") return res.status(401).json({ message: "Unauthorized - Access token expired"})
            throw error
        }
    } 
    catch (error) {
        console.log("Error in protectRoute middleware", error.message)
        return res.status(401).json({message: "Unauthorized - Invalid access token"})
    }
}

const adminRoute = (req, res, next) => {
    try {
        if(req.user && req.user.role === 'admin') next()
        else return res.status(403).json({message: "Access denied - Admin only"})
    } 
    catch (error) {
        console.log("Error in adminRoute middleware", error.message)
        return res.status(401).json({message: "Server Error"})
    }
}


export { protectRoute, adminRoute }