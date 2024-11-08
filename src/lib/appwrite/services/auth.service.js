import { account, databases } from '../client';
import { ID } from 'appwrite';

const config = {
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    userCollectionId: 'users'
};

export const authService = {
    async createAdmin(email, password, name) {
        try {
            const response = await account.create(
                ID.unique(),
                email,
                password,
                name
            );

            // Create admin profile
            await databases.createDocument(
                config.databaseId,
                config.userCollectionId,
                response.$id,
                {
                    name,
                    email,
                    role: 'admin',
                    createdAt: new Date().toISOString()
                }
            );

            return response;
        } catch (error) {
            throw error;
        }
    },

    async isAdmin(userId) {
        try {
            const user = await databases.getDocument(
                config.databaseId,
                config.userCollectionId,
                userId
            );
            return user.role === 'admin';
        } catch (error) {
            return false;
        }
    }
}; 