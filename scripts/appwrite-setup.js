import { sdk } from 'node-appwrite';
import { APPWRITE_CONFIG } from '../src/lib/appwrite/config';

async function setupAppwrite() {
    const client = new sdk.Client();
    
    client
        .setEndpoint(APPWRITE_CONFIG.endpoint)
        .setProject(APPWRITE_CONFIG.projectId)
        .setKey('standard_5dffc38ac093f756056855d865c4b4656c3c8ae81b230b5044d990627955f5039f757a002fb57bcd0ddfc2817d711c6d69518af33d004c7f38949ab42b414645ea13abbe55e0f82349c6da527313e3671216dd906e45e5a25ba556b1fad3f491fe372588656f596f4ec8313b1af8e1c818f9ca4ca618ee6bf1d1a4c678b0fb94');

    const databases = new sdk.Databases(client);

    // Create collections
    for (const [key, collection] of Object.entries(APPWRITE_CONFIG.collections)) {
        try {
            // Create collection
            await databases.createCollection(
                APPWRITE_CONFIG.databaseId,
                collection.id,
                collection.id
            );

            // Create indexes
            for (const index of collection.indexes) {
                await databases.createIndex(
                    APPWRITE_CONFIG.databaseId,
                    collection.id,
                    index.key,
                    index.type,
                    index.attributes
                );
            }

            console.log(`Collection ${key} created successfully`);
        } catch (error) {
            console.error(`Failed to create collection ${key}:`, error);
        }
    }
}

setupAppwrite().catch(console.error);
