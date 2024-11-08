import { databases, storage } from '../client';
import { ID, Query } from 'appwrite';

class CategoryService {
    async uploadIcon(file, oldIconId = null) {
        try {
            // Generate a timestamp-based filename
            const timestamp = Math.floor(Date.now() / 1000);
            const fileExtension = file.name.split('.').pop();
            const newFileName = `${timestamp}.${fileExtension}`;

            // Create a new file with the timestamp name
            const newFile = new File([file], newFileName, { type: file.type });

            // Delete old icon if it exists
            if (oldIconId) {
                try {
                    await this.deleteIcon(oldIconId);
                } catch (error) {
                    console.warn('Failed to delete old icon:', error);
                }
            }

            // Upload new icon
            const fileId = ID.unique();
            await storage.createFile(
                process.env.NEXT_PUBLIC_APPWRITE_CATEGORY_BUCKET_ID,
                fileId,
                newFile
            );
            return fileId;
        } catch (error) {
            throw new Error('Failed to upload icon: ' + error.message);
        }
    }

    getIconUrl(fileId) {
        return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_CATEGORY_BUCKET_ID}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
    }

    async updateCategoryWithIcon(categoryId, data, newIconFile, oldIconId) {
        try {
            if (newIconFile) {
                // Upload new icon and delete old one
                const newIconId = await this.uploadIcon(newIconFile, oldIconId);
                
                // Add icon data to update payload
                data = {
                    ...data,
                    icon: newIconId,
                    iconUrl: this.getIconUrl(newIconId)
                };
            }

            // Update category with new data
            return await databases.updateDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                process.env.NEXT_PUBLIC_APPWRITE_CATEGORY_COLLECTION_ID,
                categoryId,
                data
            );
        } catch (error) {
            console.error('Update Error:', error);
            throw new Error('Failed to update category: ' + error.message);
        }
    }

    async createCategory(data) {
        try {
            return await databases.createDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                process.env.NEXT_PUBLIC_APPWRITE_CATEGORY_COLLECTION_ID,
                ID.unique(),
                {
                    name: data.name,
                    icon: data.icon,
                    iconUrl: data.iconUrl,
                    isActive: data.isActive,
                    createdAt: data.createdAt
                }
            );
        } catch (error) {
            throw new Error('Failed to create category: ' + error.message);
        }
    }

    async getAllCategories() {
        try {
            const response = await databases.listDocuments(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                process.env.NEXT_PUBLIC_APPWRITE_CATEGORY_COLLECTION_ID,
                [
                    Query.orderDesc('createdAt')
                ]
            );
            return response.documents;
        } catch (error) {
            throw new Error('Failed to fetch categories: ' + error.message);
        }
    }

    async deleteCategory(categoryId) {
        try {
            await databases.deleteDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                process.env.NEXT_PUBLIC_APPWRITE_CATEGORY_COLLECTION_ID,
                categoryId
            );
        } catch (error) {
            throw new Error('Failed to delete category: ' + error.message);
        }
    }

    async deleteIcon(iconId) {
        try {
            await storage.deleteFile(
                process.env.NEXT_PUBLIC_APPWRITE_CATEGORY_BUCKET_ID,
                iconId
            );
        } catch (error) {
            throw new Error('Failed to delete icon: ' + error.message);
        }
    }

    async getCategory(categoryId) {
        try {
            return await databases.getDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                process.env.NEXT_PUBLIC_APPWRITE_CATEGORY_COLLECTION_ID,
                categoryId
            );
        } catch (error) {
            throw new Error('Failed to fetch category: ' + error.message);
        }
    }

    async updateCategory(categoryId, data) {
        try {
            return await databases.updateDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                process.env.NEXT_PUBLIC_APPWRITE_CATEGORY_COLLECTION_ID,
                categoryId,
                data
            );
        } catch (error) {
            throw new Error('Failed to update category: ' + error.message);
        }
    }

    async uploadSubCategoryImage(file) {
        try {
            // Generate a timestamp-based filename
            const timestamp = Math.floor(Date.now() / 1000);
            const fileExtension = file.name.split('.').pop();
            const newFileName = `${timestamp}.${fileExtension}`;

            // Create a new file with the timestamp name
            const newFile = new File([file], newFileName, { type: file.type });

            // Upload new image to a different bucket for sub-categories
            const fileId = ID.unique();
            await storage.createFile(
                process.env.NEXT_PUBLIC_APPWRITE_SUBCATEGORY_BUCKET_ID,
                fileId,
                newFile
            );
            return fileId;
        } catch (error) {
            throw new Error('Failed to upload sub-category image: ' + error.message);
        }
    }

    getSubCategoryImageUrl(fileId) {
        return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_SUBCATEGORY_BUCKET_ID}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
    }

    async createSubCategory(data) {
        try {
            return await databases.createDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                process.env.NEXT_PUBLIC_APPWRITE_SUBCATEGORY_COLLECTION_ID,
                ID.unique(),
                {
                    name: data.name,
                    parentCategoryId: data.parentCategoryId,
                    description: data.description,
                    image: data.image,
                    imageUrl: data.imageUrl,
                    createdAt: data.createdAt
                }
            );
        } catch (error) {
            throw new Error('Failed to create sub-category: ' + error.message);
        }
    }

    async getAllSubCategories() {
        try {
            const response = await databases.listDocuments(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                process.env.NEXT_PUBLIC_APPWRITE_SUBCATEGORY_COLLECTION_ID,
                [
                    Query.orderDesc('createdAt')
                ]
            );
            return response.documents;
        } catch (error) {
            throw new Error('Failed to fetch sub-categories: ' + error.message);
        }
    }

    async deleteSubCategory(subCategoryId) {
        try {
            await databases.deleteDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                process.env.NEXT_PUBLIC_APPWRITE_SUBCATEGORY_COLLECTION_ID,
                subCategoryId
            );
        } catch (error) {
            throw new Error('Failed to delete sub-category: ' + error.message);
        }
    }

    async deleteSubCategoryImage(imageId) {
        try {
            await storage.deleteFile(
                process.env.NEXT_PUBLIC_APPWRITE_SUBCATEGORY_BUCKET_ID,
                imageId
            );
        } catch (error) {
            throw new Error('Failed to delete sub-category image: ' + error.message);
        }
    }

    async getSubCategory(subCategoryId) {
        try {
            return await databases.getDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                process.env.NEXT_PUBLIC_APPWRITE_SUBCATEGORY_COLLECTION_ID,
                subCategoryId
            );
        } catch (error) {
            throw new Error('Failed to fetch sub-category: ' + error.message);
        }
    }

    async updateSubCategory(subCategoryId, data) {
        try {
            return await databases.updateDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
                process.env.NEXT_PUBLIC_APPWRITE_SUBCATEGORY_COLLECTION_ID,
                subCategoryId,
                data
            );
        } catch (error) {
            throw new Error('Failed to update sub-category: ' + error.message);
        }
    }
}

export const categoryService = new CategoryService();
