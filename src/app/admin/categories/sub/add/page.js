'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { categoryService } from '@/lib/appwrite/services/category.service';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

export default function AddCategorySub() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        parentCategoryId: '',
        description: '',
        imageUrl: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const categories = await categoryService.getAllCategories();
            setCategories(categories);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            setError('Failed to fetch categories');
        }
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
            setError('Please upload a valid image file (JPG or PNG)');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setError('Image size should be less than 2MB');
            return;
        }

        const previewUrl = URL.createObjectURL(file);
        setImageFile(file);
        setImagePreview(previewUrl);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            if (!formData.name.trim()) {
                throw new Error('Sub-category name is required');
            }

            let imageId = null;
            if (imageFile) {
                imageId = await categoryService.uploadSubCategoryImage(imageFile);
            }

            const subCategoryData = {
                name: formData.name.trim(),
                parentCategoryId: formData.parentCategoryId.trim(),
                description: formData.description.trim(),
                image: imageId,
                imageUrl: imageId ? categoryService.getSubCategoryImageUrl(imageId) : '',
                createdAt: new Date().toISOString()
            };

            await categoryService.createSubCategory(subCategoryData);
            toast.success('Sub-category created successfully');
            router.push('/admin/categories/sub');

        } catch (error) {
            console.error('Create Error:', error);
            setError(error.message || 'Failed to create sub-category');
            toast.error(error.message || 'Failed to create sub-category');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto pb-20">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Add Sub-Category</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Create a new sub-category with its details
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                    <p className="font-medium">Error</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Sub-Category Image */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Sub-Category Image</h2>
                    <div className="space-y-4">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-50">
                            {imagePreview ? (
                                <>
                                    <Image
                                        src={imagePreview}
                                        alt="Sub-category image preview"
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImageFile(null);
                                            setImagePreview(null);
                                        }}
                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        <label className="cursor-pointer inline-block">
                            <div className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                {imagePreview ? 'Change Image' : 'Upload Image'}
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageSelect}
                                disabled={saving}
                            />
                        </label>
                    </div>
                </div>

                {/* Sub-Category Information */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Sub-Category Information</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sub-Category Name*
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Enter sub-category name"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Parent Category ID*
                            </label>
                            <select
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.parentCategoryId}
                                onChange={(e) => setFormData({ ...formData, parentCategoryId: e.target.value })}
                            >
                                <option value="">Select a parent category</option>
                                {categories.map((category) => (
                                    <option key={category.$id} value={category.$id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {formData.parentCategoryId && (
                                <div className="mt-2 flex items-center">
                                    {categories.map((category) => (
                                        category.$id === formData.parentCategoryId && category.iconUrl && (
                                            <Image
                                                key={category.$id}
                                                src={category.iconUrl}
                                                alt={category.name}
                                                width={40}
                                                height={40}
                                                className="mr-2"
                                            />
                                        )
                                    ))}
                                    <span>{categories.find(category => category.$id === formData.parentCategoryId)?.name}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                rows="3"
                                placeholder="Enter sub-category description"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={saving}
                >
                    {saving ? 'Creating...' : 'Create Sub-Category'}
                </button>
            </form>
        </div>
    );
}
