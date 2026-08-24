import { useSelector } from "react-redux";
import { Navigate } from "react-router";

export default function Protected({children,role}){
    const user = useSelector((state)=>state.auth.user);
    const loading = useSelector((state)=>state.auth.loading);

    if(loading){
        return <div>Loading...</div>
    }
    if(!user){
        return <Navigate to="/" />
    }
    if(role && user.role !== role){
        return <Navigate to="/" />
    }
    return (
        <>
        {children}
        </>
    )
}