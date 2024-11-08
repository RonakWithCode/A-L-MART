'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { categoryService } from '@/lib/appwrite/services/category.service';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function CategorySub() {
    const router = useRouter();
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState({}); // To store parent category details

    useEffect(() => {
        fetchSubCategories();
        fetchCategories();
    }, []);

    const fetchSubCategories = async () => {
        try {
            const response = await categoryService.getAllSubCategories();
            setSubCategories(response);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch sub-categories:', error);
            setError('Failed to fetch sub-categories');
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await categoryService.getAllCategories();
            const categoryMap = {};
            response.forEach(category => {
                categoryMap[category.$id] = category;
            });
            setCategories(categoryMap);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const handleDelete = async (subCategoryId, imageId) => {
        try {
            await categoryService.deleteSubCategory(subCategoryId);
            if (imageId) {
                await categoryService.deleteSubCategoryImage(imageId);
            }
            toast.success('Sub-category deleted successfully');
            fetchSubCategories(); // Refresh the list
        } catch (error) {
            console.error('Delete Error:', error);
            toast.error('Failed to delete sub-category');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Sub Categories</h1>
                <Link
                    href="/admin/categories/sub/add"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Add Sub Category
                </Link>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                    <p className="font-medium">Error</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {subCategories.map((subCategory) => (
                        <li key={subCategory.$id} className="px-6 py-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    {subCategory.imageUrl && (
                                        <div className="flex-shrink-0 h-12 w-12 relative">
                                            <Image
                                                src={subCategory.imageUrl}
                                                alt={subCategory.name}
                                                fill
                                                className="rounded-lg object-cover"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-900">{subCategory.name}</h2>
                                        {categories[subCategory.parentCategoryId] && (
                                            <div className="flex items-center mt-1">
                                                {categories[subCategory.parentCategoryId].iconUrl && (
                                                    <Image
                                                        src={categories[subCategory.parentCategoryId].iconUrl}
                                                        alt={categories[subCategory.parentCategoryId].name}
                                                        width={20}
                                                        height={20}
                                                        className="mr-2"
                                                    />
                                                )}
                                                <p className="text-sm text-gray-500">
                                                    Parent: {categories[subCategory.parentCategoryId].name}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Link
                                        href={`/admin/categories/sub/edit/${subCategory.$id}`}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(subCategory.$id, subCategory.imageId)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
