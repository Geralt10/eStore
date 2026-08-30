import {
    createProduct,
    getSellerProduct,
    getAllProducts,
    getProductById,
    createVariant,
    updateVariantStock
} from "../services/product.api";
import { useDispatch } from "react-redux";
import { setAllProducts, setSellerProduct, setLoading, setError } from "../state/product.slice";

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

    async function handleGetAllProducts() {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await getAllProducts();
            dispatch(setAllProducts(data.products));
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to fetch products";
            dispatch(setError(errorMsg));
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
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to fetch products";
            dispatch(setError(errorMsg));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetProduct(id) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await getProductById(id);
            return data.product;
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to fetch product";
            dispatch(setError(errorMsg));
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleCreateVariant(productId, formData) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await createVariant(productId, formData);
            return data.product;
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to create variant";
            dispatch(setError(errorMsg));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleUpdateVariantStock(productId, variantId, stock) {
        try {
            dispatch(setError(null));
            const data = await updateVariantStock(productId, variantId, stock);
            return data.product;
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to update stock";
            dispatch(setError(errorMsg));
            throw error;
        }
    }


    return {
        handleCreateProduct,
        handleGetAllProducts,
        handleGetSellerProduct,
        handleGetProduct,
        handleCreateVariant,
        handleUpdateVariantStock
    };
}