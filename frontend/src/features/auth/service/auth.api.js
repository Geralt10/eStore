import axios from "axios";

const api = axios.create({
    baseURL:"/api/auth",
    withCredentials:true
})

export const register = async ({ fullname, email, password, contact, isSeller }) => {
    try {
        const response = await api.post("/register", { fullname, email, password, contact, isSeller });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const login = async ({email,password}) => {
    try {
        const response = await api.post("/login",{email,password})
        return response.data
    } catch (error) {
        throw error
    }
}

export const  getMe = async() => {
    try {
        const response = await api.get("/me");
        return response.data;
    } catch (error) {
        throw error
    }
}