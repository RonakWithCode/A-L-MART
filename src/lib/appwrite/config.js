import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const appwriteConfig = {
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    storageId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID,
    categoryCollectionId: process.env.NEXT_PUBLIC_APPWRITE_CATEGORY_COLLECTION_ID,
    subCategoryCollectionId: process.env.NEXT_PUBLIC_APPWRITE_SUBCATEGORY_COLLECTION_ID,
    categoryBucketId: process.env.NEXT_PUBLIC_APPWRITE_CATEGORY_BUCKET_ID,
    subCategoryBucketId: process.env.NEXT_PUBLIC_APPWRITE_SUBCATEGORY_BUCKET_ID
};
