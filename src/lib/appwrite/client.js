import { Client, Account, Databases, Storage } from 'appwrite';

// Configuration
const config = {
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    userCollectionId: 'users'
};

// Initialize Appwrite
const client = new Client()
    .setEndpoint(config.endpoint)
    .setProject(config.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Helper functions for database operations
export const appwriteService = {
    // User profile operations
    async createUserProfile(userId, userData) {
        try {
            return await databases.createDocument(
                config.databaseId,
                config.userCollectionId,
                userId,
                userData
            );
        } catch (error) {
            console.error('Create profile error:', error);
            throw error;
        }
    },

    async getUserProfile(userId) {
        try {
            return await databases.getDocument(
                config.databaseId,
                config.userCollectionId,
                userId
            );
        } catch (error) {
            console.error('Get profile error:', error);
            throw error;
        }
    },

    async updateUserProfile(userId, userData) {
        try {
            return await databases.updateDocument(
                config.databaseId,
                config.userCollectionId,
                userId,
                userData
            );
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    }
};

export default client;
