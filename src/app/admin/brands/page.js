'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { brandService } from '@/lib/appwrite/services/brand.service';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function BrandsPage() {
    const router = useRouter();
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBrands, setFilteredBrands] = useState([]);

    useEffect(() => {
        fetchBrands();
    }, []);

    useEffect(() => {
        filterBrands();
    }, [searchQuery, brands]);

    const fetchBrands = async () => {
        try {
            const fetchedBrands = await brandService.getBrands();
            setBrands(fetchedBrands);
            setFilteredBrands(fetchedBrands);
        } catch (error) {
            setError('Failed to fetch brands');
            toast.error('Failed to fetch brands');
        } finally {
            setLoading(false);
        }
    };

    const filterBrands = () => {
        const filtered = brands.filter(brand =>
            brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            brand.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredBrands(filtered);
    };

    const handleDelete = async (brandId, iconId) => {
        if (!window.confirm('Are you sure you want to delete this brand?')) {
            return;
        }

        try {
            if (iconId) {
                await brandService.deleteIcon(iconId);
            }
            await brandService.deleteBrand(brandId);
            toast.success('Brand deleted successfully');
            fetchBrands(); // Refresh the list
        } catch (error) {
            toast.error('Failed to delete brand');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
                <Link
                    href="/admin/brands/add"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Add New Brand
                </Link>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search brands..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                    <p className="font-medium">Error</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {/* Brands Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBrands.map((brand) => (
                    <div
                        key={brand.$id}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex items-center space-x-4">
                                {brand.iconUrl && (
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-50">
                                        <Image
                                            src={brand.iconUrl}
                                            alt={brand.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-gray-900">{brand.name}</h3>
                                    {brand.description && (
                                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                            {brand.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                        brand.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {brand.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    {brand.isSponsored && (
                                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                            {brand.sponsorshipType}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => router.push(`/admin/brands/edit/${brand.$id}`)}
                                        className="p-2 text-blue-600 hover:text-blue-800"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(brand.$id, brand.icon)}
                                        className="p-2 text-red-600 hover:text-red-800"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredBrands.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No brands found</p>
                </div>
            )}
        </div>
    );
}
