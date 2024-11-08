import { databases, storage } from '../client';
import { ID } from 'appwrite';

const config = {
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    collections: {
        products: 'products',
        categories: 'categories',
        brands: 'brands'
    },
    bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID
};

export const productService = {
    async createProduct(data) {
        return await databases.createDocument(
            config.databaseId,
            config.collections.products,
            ID.unique(),
            {
                name: data.name,
                description: data.description,
                price: data.price,
                categoryId: data.categoryId,
                brandId: data.brandId,
                stock: data.stock,
                image: data.image,
                status: 'active'
            }
        );
    },

    async getAllProducts() {
        return await databases.listDocuments(
            config.databaseId,
            config.collections.products
        );
    },

    async getProduct(id) {
        return await databases.getDocument(
            config.databaseId,
            config.collections.products,
            id
        );
    },

    async updateProduct(id, data) {
        return await databases.updateDocument(
            config.databaseId,
            config.collections.products,
            id,
            {
                ...data,
                updatedAt: new Date().toISOString()
            }
        );
    },

    async deleteProduct(id) {
        return await databases.deleteDocument(
            config.databaseId,
            config.collections.products,
            id
        );
    }
};
