export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
}

export interface ProductResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

export interface ProductState {
    items: Product[]
    selectedProduct: Product | null
    loading: boolean
    error: string | null
    total: number
    skip: number
    limit: number
    hasMore: boolean
    searchQuery: string
}