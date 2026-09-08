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

export const removeFromCart = async({productId,variantId}) => {
    try {
        const response = await api.delete(`/${productId}/${variantId}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const incrementQuantityApi = async({productId,variantId}) => {
    try {
        const response = await api.post(`/quantity/increment/${productId}/${variantId}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const decrementQuantityApi = async({productId,variantId}) => {
    try {
        const response = await api.post(`/quantity/decrement/${productId}/${variantId}`)
        return response.data
    } catch (error) {
        throw error
    }
}
