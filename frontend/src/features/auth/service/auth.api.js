import axios from "axios";

const api = axios.create({
    baseURL:"http://localhost:3000/api/auth",
    withCredentials:true
})

export const register = async ({fullname,email,password,contact,isSeller})=>{
    try{
        const response = await api.post("/register",{fullname,email,password,contact,isSeller});
        return response.data;
    }catch(error){
        console.log(error.message);
        return error.response.data;
    }
}