import { register, login, getMe, logout } from "../service/auth.api";
import { useDispatch } from "react-redux";
import { setError, setLoading, setUser } from "../state/auth.slice";
import toast from "react-hot-toast";

export const useAuth = () => {
    const dispatch = useDispatch();

    const handleRegister = async ({ fullname, email, password, contact, isSeller = false }) => {
        try {
            dispatch(setLoading(true));
            const response = await register({ fullname, email, password, contact, isSeller });
            dispatch(setUser(response.user));
            dispatch(setError(null));
            toast.success("Account created successfully!");
            return true;
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Registration failed";
            dispatch(setError(errorMsg));
            dispatch(setUser(null));
            toast.error(errorMsg);
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    };  

    const handleLogin = async({email,password}) => {
        try {
            dispatch(setLoading(true));
            const response = await login({email,password});
            dispatch(setUser(response.user));
            dispatch(setError(null));
            toast.success("Login successful!");
            return response.user;
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Login failed";
            dispatch(setError(errorMsg));
            dispatch(setUser(null));
            toast.error(errorMsg);
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    }

    const handleGetMe = async() => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const response = await getMe();
            dispatch(setUser(response.user));
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to fetch user";
            dispatch(setError(errorMsg));
            dispatch(setUser(null));
        } finally {
            dispatch(setLoading(false));
        }
    }

    const handleLogout = async () => {
        try {
            dispatch(setLoading(true));
            await logout();
            dispatch(setUser(null));
            dispatch(setError(null));
            toast.success("Logged out successfully");
            return true;
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Logout failed";
            toast.error(errorMsg);
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {
        handleRegister,
        handleLogin,
        handleGetMe,
        handleLogout
    }
}