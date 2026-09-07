import axios from "axios";

const api = axios.create({
    baseURL: "/api/cart",
    withCredentials:true
})

export const addToCart = async({productId,variantId,quantity}) => {
    try {
        const response = await api.post(`/add/${productId}/${variantId}`,{quantity})
        return response.data
    } catch (error) {
        throw error
    }
}

export const getCart = async() => {
    try {
        const response = await api.get("/")
        return response.data
    } catch (error) {
        throw error
    }
}