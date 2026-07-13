import { create } from 'zustand'
import axios from '../lib/axios.js'
import toast from 'react-hot-toast'

const useProductStore = create((set) => ({
    products: [],
    setProducts: (products) => set({ products }),
    loading: false,

    createProduct: async (productData) => {
        set({ loading: true })

        try {
            const res = await axios.post("/products", productData)
            set(state => ({
                products: [...state.products, res.data],
                loading: false
            }))    
        } 
        catch (error) {
            toast.error(error.response?.data?.message)
            set({ loading: false })
        }
    },

    fetchAllProducts: async () => {
        set({ loading: true })

        try {
            const res = await axios.get("/products")
            set({ products: res.data.products, loading: false })    
        } 
        catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch products")
            set({ loading: false })
        }
    },

    deleteProduct: async (productId) => {
        set({ loading: true })
        try {
            await axios.delete(`/products/${productId}`)  
            set(state => ({
                products: state.products.filter(product => product._id !== productId),
                loading: false
            })) 
        } 
        catch (error) {
            set({ loading: false });
			toast.error(error.response.data.error || "Failed to delete product");
        }
    },

    toggleFeaturedProduct: async (productId) => {
        set({ loading: true })
        try {
            const res = await axios.patch(`/products/${productId}`)
            // it will update the isFeatured prop of the product
            set(state => ({
                products: state.products.map(product => product._id === productId ? {...product, isFeatured: res.data.isFeatured} : product),
                loading: false
            }))
        } 
        catch (error) {
            set({ loading: false });
			toast.error(error.response?.data?.error || "Failed to update product");
        }
    },

    fetchProductsByCategory: async (category) => {
        set({ loading: true })

        try {
            const res = await axios.get(`/products/category/${category}`)
            set({ products: res.data.products, loading: false })    
        } 
        catch (error) {
            set({ loading: false });
			toast.error(error.response?.data?.error || "Failed to fetch products");
        }
    }
}))

export { useProductStore }


