import { addToCart, getCart } from "../service/cart.api";
import { useDispatch } from "react-redux";
import { setItems } from "../state/cart.slice";

export const useCart = () => {
    const dispatch = useDispatch();
    
    const handleAddToCart = async ({ productId, variantId, quantity = 1 }) => {      
        try {               
            const response = await addToCart({ productId, variantId, quantity });
            if (response?.cart?.items) {
                dispatch(setItems(response.cart.items));
            }
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const handleGetCart = async () => {
        try {
            const response = await getCart();
            if (response?.cart?.items) {
                dispatch(setItems(response.cart.items));
            }
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    return { handleAddToCart, handleGetCart };
};