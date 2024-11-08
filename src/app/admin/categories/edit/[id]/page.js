'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { categoryService } from '@/lib/appwrite/services/category.service';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

export default function EditCategory({ params }) {
    const router = useRouter();
    const { id } = params;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        isActive: true,
        iconUrl: ''
    });
    const [iconFile, setIconFile] = useState(null);
    const [iconPreview, setIconPreview] = useState(null);
    const [originalIcon, setOriginalIcon] = useState(null);

    // Fetch category data
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const category = await categoryService.getCategory(id);
                setFormData({
                    name: category.name,
                    isActive: category.isActive,
                    iconUrl: category.iconUrl
                });
                setIconPreview(category.iconUrl);
                setOriginalIcon(category.icon);
            } catch (error) {
                setError('Failed to fetch category');
                toast.error('Failed to fetch category');
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [id]);

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
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            if (!formData.name.trim()) {
                throw new Error('Category name is required');
            }

            // Prepare category data
            const categoryData = {
                name: formData.name.trim(),
                isActive: formData.isActive,
                updatedAt: new Date().toISOString()
            };

            // Update category with icon if changed
            if (iconFile) {
                await categoryService.updateCategoryWithIcon(id, categoryData, iconFile, originalIcon);
            } else {
                await categoryService.updateCategory(id, categoryData);
            }
            
            toast.success('Category updated successfully');
            router.push('/admin/categories');

        } catch (error) {
            console.error('Update Error:', error);
            setError(error.message || 'Failed to update category');
            toast.error(error.message || 'Failed to update category');
        } finally {
            setSaving(false);
        }
    };

    const handleRemoveIcon = () => {
        if (saving) return;

        setIconFile(null);
        setIconPreview(formData.iconUrl);
        setError('');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto pb-20">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Update category information
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
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-50">
                            {iconPreview ? (
                                <>
                                    <Image
                                        src={iconPreview}
                                        alt="Category icon preview"
                                        fill
                                        className="object-cover"
                                    />
                                    {iconFile && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveIcon}
                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                            disabled={saving}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Upload Button - Always visible */}
                        <label className="cursor-pointer inline-block">
                            <div className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                {iconPreview ? 'Change Icon' : 'Upload Icon'}
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleIconSelect}
                                disabled={saving}
                            />
                        </label>
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
                        disabled={saving}
                        className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
