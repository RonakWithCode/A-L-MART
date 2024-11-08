'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { categoryService } from '@/lib/appwrite/services/category.service';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function Categories() {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');


    // Fetch categories
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getAllCategories();
            setCategories(data);
        } catch (error) {
            setError('Failed to fetch categories');
            toast.error('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    // Filter categories based on search
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle delete
    const handleDelete = async (categoryId, iconId) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            await categoryService.deleteCategory(categoryId);
            await categoryService.deleteIcon(iconId);
            toast.success('Category deleted successfully');
            fetchCategories(); // Refresh the list
        } catch (error) {
            toast.error('Failed to delete category');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Manage your product categories
                    </p>
                </div>
              
            </div>
            <div className="flex flex-row items-center mb-8 space-x-4">
            <Link
                    href="/admin/categories/sub"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Sub-Category Management
                </Link>
                <Link
                    href="/admin/categories/add"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Add New Category
                </Link>
            </div>
            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search categories..."
                        className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg
                        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                    <p className="font-medium">Error</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {/* Categories Grid */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCategories.map((category) => (
                        <div
                            key={category.$id}
                            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                    <Image
                                        src={category.iconUrl}
                                        alt={category.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-lg font-medium text-gray-900 truncate">
                                        {category.name}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {category.isActive ? (
                                            <span className="text-green-600">Active</span>
                                        ) : (
                                            <span className="text-red-600">Inactive</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    onClick={() => router.push(`/admin/categories/edit/${category.$id}`)}
                                    className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(category.$id, category.icon)}
                                    className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredCategories.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No categories found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
