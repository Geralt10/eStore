import { createProduct, getSellerProduct } from "../services/product.api";
import { useDispatch } from "react-redux";
import { setSellerProduct, setLoading, setError } from "../state/product.slice";

export function useProduct() {
    const dispatch = useDispatch();

    async function handleCreateProduct(formData) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await createProduct(formData);
            return data.products;
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to create product";
            dispatch(setError(errorMsg));
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetSellerProduct() {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await getSellerProduct();
            dispatch(setSellerProduct(data.products));
            return data.products;
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to fetch products";
            dispatch(setError(errorMsg));
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    }

    return {
        handleCreateProduct,
        handleGetSellerProduct
    };
}