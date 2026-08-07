import { register } from "../service/auth.api";
import { useDispatch } from "react-redux";
import { setError, setLoading, setUser } from "../state/auth.slice";

export const useAuth = () =>{
    const dispatch = useDispatch();

    const handleRegister = async ({fullname,email,password,contact,isSeller=false}) =>{
        try{
            dispatch(setLoading(true))
            const response = await register({fullname,email,password,contact,isSeller})
            dispatch(setUser(response.user))
            dispatch(setError(null))
            return true
        }catch(error){
            dispatch(setError(error.message))
            dispatch(setUser(null))
            return false
        }finally{
            dispatch(setLoading(false))
        }
    }

    return {
        handleRegister
    }
}