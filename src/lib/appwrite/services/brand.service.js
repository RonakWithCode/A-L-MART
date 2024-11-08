import { databases, storage } from '../client';
import { ID } from 'appwrite';

class BrandService {
    async uploadIcon(file, brandName) {
        try {
            // Generate a timestamp-based filename with brand name
            const timestamp = Math.floor(Date.now() / 1000);
            const sanitizedBrandName = brandName.toLowerCase().replace(/[^a-z0-9]/g, '-');
            const fileExtension = file.name.split('.').pop();
            const newFileName = `${sanitizedBrandName}-${timestamp}.${fileExtension}`;

            // Create a new file with the formatted name
            const newFile = new File([file], newFileName, { type: file.type });

            // Upload file with unique ID
            const fileId = ID.unique();
            await storage.createFile(
                process.env.NEXT_PUBLIC_APPWRITE_BRAND_BUCKET_ID,
                fileId,
                newFile
            );
            return fileId;
        } catch (error) {
            throw new Error('Failed to upload icon: ' + error.message);
        }
    }

    getIconUrl(fileId) {
        return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BRAND_BUCKET_ID}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
    }

    async createBrand(data) {
        try {
            return await databases.createDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                'brands',
                ID.unique(),
                data
            );
        } catch (error) {
            throw new Error('Failed to create brand: ' + error.message);
        }
    }

    async deleteIcon(iconId) {
        try {
            await storage.deleteFile(
                process.env.NEXT_PUBLIC_APPWRITE_BRAND_BUCKET_ID,
                iconId
            );
        } catch (error) {
            throw new Error('Failed to delete icon: ' + error.message);
        }
    }

    async getBrands() {
        try {
            const response = await databases.listDocuments(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                'brands'
            );
            return response.documents;
        } catch (error) {
            throw new Error('Failed to fetch brands: ' + error.message);
        }
    }

    async deleteBrand(brandId) {
        try {
            await databases.deleteDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                'brands',
                brandId
            );
        } catch (error) {
            throw new Error('Failed to delete brand: ' + error.message);
        }
    }

    async getBrand(brandId) {
        try {
            const response = await databases.getDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                'brands',
                brandId
            );
            return response;
        } catch (error) {
            throw new Error('Failed to fetch brand: ' + error.message);
        }
    }

    async updateBrand(brandId, data) {
        try {
            return await databases.updateDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                'brands',
                brandId,
                data
            );
        } catch (error) {
            throw new Error('Failed to update brand: ' + error.message);
        }
    }
}

export const brandService = new BrandService();
