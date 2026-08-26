import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sellerProduct:[],
    loading:false,
    error:null,
    allProducts:[],
}

const productSlice = createSlice({
    name:'product',
    initialState,
    reducers:{
        setSellerProduct : (state,action) => {
            state.sellerProduct = action.payload;
        },
        setLoading : (state,action) => {
            state.loading = action.payload;
        },
        setError : (state,action) => {
            state.error = action.payload;
        },
        setAllProducts : (state,action) => {
            state.allProducts = action.payload;
        }
    }
})


export const {setSellerProduct,setLoading,setError,setAllProducts} = productSlice.actions;
export default productSlice.reducer;    