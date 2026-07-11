import Product from "../models/product.model.js";

const getCartProducts = async (req, res) => {
    try {
        const productIds = req.user.cartItems.map((item) => item.product)
        const products = await Product.find({ _id: { $in: productIds } })

        // add quantity for each product
        const cartItems = products.map((product) => {
            const item = req.user.cartItems.find((cartItem) =>
                cartItem.product.equals(product._id)
            )
            return { ...product.toJSON(), quantity: item?.quantity ?? 1 }
        })

        res.json(cartItems)
    } catch (error) {
        console.log("Error in getCartProducts controller", error.message)
        res.status(500).json({ message: "Server error" })
    }
}

const addToCart = async (req, res) => {
    try {
        const { productId } = req.body
        const user = req.user

        const existingItem = user.cartItems.find(item => item.product.equals(productId))
        if(existingItem){
            existingItem.quantity += 1
        }
        else{
            user.cartItems.push({ product: productId, quantity: 1 })
        }

        await user.save()
        res.json(user.cartItems)
    } 
    catch (error) {
        console.log("Error in addToCart controller", error.message)
		res.status(500).json({message: "Server error"})
    }
}

const removeAllFromCart = async (req, res) => {
    try {
        const { productId } = req.body
        const user = req.user
        if(!productId){
            user.cartItems = []
        }
        else{
            user.cartItems = user.cartItems.filter(item => !item.product.equals(productId))
        }

        await user.save()
        res.json(user.cartItems)
    } 
    catch (error) {
        console.log("Error in removeAllFromCart controller", error.message)
		res.status(500).json({message: "Server error"})
    }   
}

const updateQuantity = async (req, res) => {
    try {
		const { id: productId } = req.params
		const { quantity } = req.body
		const user = req.user
		const existingItem = user.cartItems.find((item) => item.product.equals(productId))

		if (existingItem) {
			if (quantity === 0) {
				user.cartItems = user.cartItems.filter((item) => !item.product.equals(productId))
				await user.save()
				return res.json(user.cartItems)
			}

			existingItem.quantity = quantity
			await user.save()
			res.json(user.cartItems)
		} else {
			res.status(404).json({ message: "Product not found" })
		}
	} catch (error) {
		console.log("Error in updateQuantity controller", error.message)
		res.status(500).json({ message: "Server error" })
	}
}

export { addToCart, removeAllFromCart, updateQuantity, getCartProducts }