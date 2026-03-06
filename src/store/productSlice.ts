import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product, ProductResponse, ProductState } from "../types/product";
import { productApii } from "../api/productsApi";


const initialState: ProductState = {
    items: [],
    selectedProduct: null,
    loading: false,
    error: null,
    total: 0,
    skip: 0,
    limit: 20,
    hasMore: true,
    searchQuery: '',
};


export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async ({ skip, limit }: { skip: number, limit: number }, { rejectWithValue }) => {
        try {
            return await productApii.fetchProducts(limit, skip)
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed tofetchproducts'
            )
        }
    }
)

export const searchProducts = createAsyncThunk(
    "/products/searchProducts",
    async (query: string, { rejectWithValue }) => {
        try {
            return await productApii.searchProducts(query)
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Searching of productt failed'
            );
        }
    }
)

export const fetchProductsById = createAsyncThunk(
    "/products/fetchProductById",
    async (id: number, { rejectWithValue }) => {
        try {
            return await productApii.fetchProductById(id)
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to fetch the indiv productdetails'
            );
        }
    }
)

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
            if (action.payload === '') {
                // Clear search results if query is empty
                state.skip = 0;
                state.hasMore = true;
            }
        },
        resetProducts: (state) => {
            state.items = [];
            state.skip = 0;
            state.hasMore = true;
            state.error = null;
        },
        resetSelectedProduct: (state) => {
            state.selectedProduct = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch Products
        builder.addCase(fetchProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchProducts.fulfilled, (state, action: PayloadAction<ProductResponse>) => {
            state.loading = false;
            if (state.skip === 0) {
                state.items = action.payload.products;
            } else {
                state.items = [...state.items, ...action.payload.products];
            }
            state.total = action.payload.total;
            state.skip += action.payload.products.length;
            state.hasMore = state.items.length < state.total;
        });
        builder.addCase(fetchProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Search Products
        builder.addCase(searchProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(searchProducts.fulfilled, (state, action: PayloadAction<ProductResponse>) => {
            state.loading = false;
            state.items = action.payload.products;
            state.total = action.payload.total;
            state.hasMore = false;
        });
        builder.addCase(searchProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Fetch Product By ID
        builder.addCase(fetchProductsById.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchProductsById.fulfilled, (state, action: PayloadAction<Product>) => {
            state.loading = false;
            state.selectedProduct = action.payload;
        });
        builder.addCase(fetchProductsById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

// Todo: Persistant State of configuration

import { configurePersistence } from "../storage/persistance"

export const { setSearchQuery, resetProducts, resetSelectedProduct } = productsSlice.actions

// for the persistance
const persistedProductsReducer = configurePersistence<ProductState, any>(
    'products',
    productsSlice.reducer,
    ['loading', 'error', 'selectedProduct', 'searchQuery']
);

export default persistedProductsReducer;
