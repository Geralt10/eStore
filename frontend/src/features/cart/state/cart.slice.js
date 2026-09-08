import {createSlice} from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name:"cart",
    initialState:{
        items:[],
        
    },
    reducers:{
        setItems:(state,action)=>{
            state.items = action.payload;
        },
        incrementQuantityInStore:(state, action)=>{
            const { productId, variantId } = action.payload;
            const item = state.items.find(i => {
                const pId = i.product?._id ? i.product._id.toString() : i.product?.toString();
                const vId = i.variant?._id ? i.variant._id.toString() : i.variant?.toString();
                return pId === String(productId) && (variantId ? vId === String(variantId) : true);
            });
            if (item) {
                item.quantity = (item.quantity || 1) + 1;
            }
        },
        decrementQuantityInStore:(state, action)=>{
            const { productId, variantId } = action.payload;
            const item = state.items.find(i => {
                const pId = i.product?._id ? i.product._id.toString() : i.product?.toString();
                const vId = i.variant?._id ? i.variant._id.toString() : i.variant?.toString();
                return pId === String(productId) && (variantId ? vId === String(variantId) : true);
            });
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            }
        },
        removeItemFromStore:(state, action)=>{
            const { productId, variantId } = action.payload;
            state.items = state.items.filter(i => {
                const pId = i.product?._id ? i.product._id.toString() : i.product?.toString();
                const vId = i.variant?._id ? i.variant._id.toString() : i.variant?.toString();
                return !(pId === String(productId) && (variantId ? vId === String(variantId) : true));
            });
        }
    }
})

export const { setItems, incrementQuantityInStore, decrementQuantityInStore, removeItemFromStore } = cartSlice.actions;
export default cartSlice.reducer;