'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { categoryService } from '@/lib/appwrite/services/category.service';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

const generateFileName = (file, categoryName) => {
    const timestamp = Math.floor(Date.now() / 1000); // Current time in seconds
    const cleanCategoryName = categoryName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric chars with hyphen
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    
    const fileExtension = file.name.split('.').pop();
    return `${timestamp}-${cleanCategoryName}.${fileExtension}`;
};

export default function CategoriesAdd() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        isActive: true,
        iconUrl: ''
    });
    const [iconFile, setIconFile] = useState(null);
    const [iconPreview, setIconPreview] = useState(null);

    const handleIconSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
            setError('Please upload a valid image file (JPG or PNG)');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setError('Image size should be less than 2MB');
            return;
        }

        const previewUrl = URL.createObjectURL(file);
        setIconFile(file);
        setIconPreview(previewUrl);
        setFormData(prev => ({
            ...prev,
            iconUrl: previewUrl
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!formData.name.trim()) {
                throw new Error('Category name is required');
            }

            if (!iconFile) {
                throw new Error('Category icon is required');
            }

            // Generate custom filename
            const customFileName = generateFileName(iconFile, formData.name);

            // Create a new File object with the custom name
            const renamedFile = new File([iconFile], customFileName, {
                type: iconFile.type,
                lastModified: new Date().getTime()
            });

            // Upload icon using the service with the renamed file
            const fileId = await categoryService.uploadIcon(renamedFile);

            // Generate icon URL
            const iconUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_CATRGORY_BUCKET_ID}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

            // Create category
            const categoryData = {
                name: formData.name.trim(),
                icon: fileId,
                iconUrl: iconUrl,
                isActive: formData.isActive,
                createdAt: new Date().toISOString(),
                fileName: customFileName // Optionally store the filename
            };

            await categoryService.createCategory(categoryData);
            toast.success('Category created successfully');
            router.push('/admin/categories');

        } catch (error) {
            console.error('Error:', error);
            setError(error.message || 'Failed to create category');
            toast.error(error.message || 'Failed to create category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto pb-20">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Add New Category</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Create a new category for your products
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                    <p className="font-medium">Error</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Icon */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Category Icon</h2>
                    <div className="space-y-4">
                        {/* Icon Preview */}
                        {iconPreview && (
                            <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-50">
                                <Image
                                    src={iconPreview}
                                    alt="Category icon preview"
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIconFile(null);
                                        setIconPreview(null);
                                        setFormData(prev => ({
                                            ...prev,
                                            iconUrl: ''
                                        }));
                                    }}
                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* Upload Button */}
                        {!iconPreview && (
                            <label className="cursor-pointer block">
                                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span className="text-sm text-gray-500">Add Icon</span>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleIconSelect}
                                    disabled={loading}
                                />
                            </label>
                        )}

                        <p className="text-sm text-gray-500">
                            Recommended: 96x96px (Max 2MB)
                        </p>
                    </div>
                </div>

                {/* Category Information */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Category Information</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category Name*
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Enter category name"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                id="isActive"
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            />
                            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                                Category is Active
                            </label>
                        </div>
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => router.push('/admin/categories')}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Category'}
                    </button>
                </div>
            </form>
        </div>
    );
}
