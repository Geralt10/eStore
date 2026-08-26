import axios from "axios";

const api = axios.create({
    baseURL:"/api",
    withCredentials:true
});

export async function createProduct(formData){
    try {
        const response = await api.post('/product/create',formData);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getSellerProduct(){
    try {
        const response = await api.get('/product/seller');
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getAllProducts(){
    try {
        const response = await api.get('/product');
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getProductById(id){
    try {
        const response = await api.get(`/product/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}