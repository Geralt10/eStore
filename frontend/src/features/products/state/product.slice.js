import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sellerProduct:[],
    loading:false,
    error:null
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
        }
    }
})


export const {setSellerProduct,setLoading,setError} = productSlice.actions;
export default productSlice.reducer;    