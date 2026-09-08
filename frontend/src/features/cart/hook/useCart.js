import { useCallback } from "react";
import { addToCart, getCart, removeFromCart, incrementQuantityApi, decrementQuantityApi } from "../service/cart.api";
import { useDispatch } from "react-redux";
import { setItems, incrementQuantityInStore, decrementQuantityInStore, removeItemFromStore } from "../state/cart.slice";

export const useCart = () => {
    const dispatch = useDispatch();

    const handleAddToCart = useCallback(async ({ productId, variantId, quantity = 1 }) => {
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
    }, [dispatch]);

    const handleGetCart = useCallback(async () => {
        try {
            const response = await getCart();
            if (response?.cart?.items) {
                dispatch(setItems(response.cart.items));
            }
            return response;
        } catch (error) {
            console.log("err", error);
            throw error;
        }
    }, [dispatch]);

    const handleRemoveFromCart = useCallback(async ({ productId, variantId }) => {
        dispatch(removeItemFromStore({ productId, variantId }));
        try {
            const response = await removeFromCart({ productId, variantId });
            return response;
        } catch (error) {
            console.log("err", error);
            try {
                const cartRes = await getCart();
                if (cartRes?.cart?.items) {
                    dispatch(setItems(cartRes.cart.items));
                }
            } catch (fetchErr) {
                console.error("Failed to re-sync cart after remove error:", fetchErr);
            }
            throw error;
        }
    }, [dispatch]);

    const handleIncrementQuantity = useCallback(async ({ productId, variantId }) => {
        dispatch(incrementQuantityInStore({ productId, variantId }));
        try {
            const response = await incrementQuantityApi({ productId, variantId });
            return response;
        } catch (error) {
            console.log("err", error);
            dispatch(decrementQuantityInStore({ productId, variantId }));
            throw error;
        }
    }, [dispatch]);

    const handleDecrementQuantity = useCallback(async ({ productId, variantId }) => {
        dispatch(decrementQuantityInStore({ productId, variantId }));
        try {
            const response = await decrementQuantityApi({ productId, variantId });
            return response;
        } catch (error) {
            console.log("err", error);
            dispatch(incrementQuantityInStore({ productId, variantId }));
            throw error;
        }
    }, [dispatch]);

    return { handleAddToCart, handleGetCart, handleRemoveFromCart, handleIncrementQuantity, handleDecrementQuantity };
};
