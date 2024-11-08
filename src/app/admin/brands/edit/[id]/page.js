'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { brandService } from '@/lib/appwrite/services/brand.service';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

export default function EditBrandPage() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        isActive: true,
        isSponsored: false,
        sponsorshipType: 'none',
        sponsorshipStartDate: '',
        sponsorshipEndDate: '',
        iconUrl: ''
    });
    const [iconFile, setIconFile] = useState(null);
    const [iconPreview, setIconPreview] = useState(null);

    useEffect(() => {
        fetchBrand();
    }, [id]);

    const fetchBrand = async () => {
        try {
            const brand = await brandService.getBrand(id);
            setFormData({
                name: brand.name,
                description: brand.description || '',
                isActive: brand.isActive,
                isSponsored: brand.isSponsored,
                sponsorshipType: brand.sponsorshipType || 'none',
                sponsorshipStartDate: brand.sponsorshipStartDate || '',
                sponsorshipEndDate: brand.sponsorshipEndDate || '',
                iconUrl: brand.iconUrl || ''
            });
            setIconPreview(brand.iconUrl);
        } catch (error) {
            setError('Failed to fetch brand');
            toast.error('Failed to fetch brand');
        } finally {
            setLoading(false);
        }
    };

    const handleIconSelect = (e) => {
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
                throw new Error('Brand name is required');
            }

            if (formData.isSponsored && !formData.sponsorshipType) {
                throw new Error('Sponsorship type is required for sponsored brands');
            }

            let iconId = formData.icon;
            if (iconFile) {
                iconId = await brandService.uploadIcon(iconFile, formData.name.trim());
            }

            const brandData = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                isActive: formData.isActive,
                isSponsored: formData.isSponsored,
                sponsorshipType: formData.isSponsored ? formData.sponsorshipType : 'none',
                sponsorshipStartDate: formData.isSponsored ? formData.sponsorshipStartDate : null,
                sponsorshipEndDate: formData.isSponsored ? formData.sponsorshipEndDate : null,
                icon: iconId,
                iconUrl: iconId ? brandService.getIconUrl(iconId) : formData.iconUrl,
                updatedAt: new Date().toISOString()
            };

            await brandService.updateBrand(id, brandData);
            toast.success('Brand updated successfully');
            router.push('/admin/brands');

        } catch (error) {
            console.error('Update Error:', error);
            setError(error.message || 'Failed to update brand');
            toast.error(error.message || 'Failed to update brand');
        } finally {
            setSaving(false);
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
        <div className="max-w-2xl mx-auto pb-20">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Edit Brand</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Update brand details
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                    <p className="font-medium">Error</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Brand Icon */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Brand Logo</h2>
                    <div className="space-y-4">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-50">
                            {iconPreview ? (
                                <>
                                    <Image
                                        src={iconPreview}
                                        alt="Brand logo preview"
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIconFile(null);
                                            setIconPreview(null);
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
                                {iconPreview ? 'Change Logo' : 'Upload Logo'}
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

                {/* Brand Information */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Brand Information</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Brand Name*
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Enter brand name"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                rows="3"
                                placeholder="Enter brand description"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                                Active
                            </label>
                        </div>

                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                id="isSponsored"
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                checked={formData.isSponsored}
                                onChange={(e) => setFormData({ ...formData, isSponsored: e.target.checked })}
                            />
                            <label htmlFor="isSponsored" className="text-sm font-medium text-gray-700">
                                Sponsored
                            </label>
                        </div>

                        {formData.isSponsored && (
                            <div className="flex items-center space-x-3">
                                <label htmlFor="sponsorshipType" className="text-sm font-medium text-gray-700">
                                    Sponsorship Type
                                </label>
                                <select
                                    id="sponsorshipType"
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    value={formData.sponsorshipType}
                                    onChange={(e) => setFormData({ ...formData, sponsorshipType: e.target.value })}
                                >
                                    <option value="none">None</option>
                                    <option value="premium">Premium</option>
                                    <option value="standard">Standard</option>
                                    <option value="basic">Basic</option>
                                </select>
                            </div>
                        )}

                        {formData.isSponsored && (
                            <div className="flex items-center space-x-3">
                                <label htmlFor="sponsorshipStartDate" className="text-sm font-medium text-gray-700">
                                    Sponsorship Start Date
                                </label>
                                <input
                                    type="date"
                                    id="sponsorshipStartDate"
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    value={formData.sponsorshipStartDate}
                                    onChange={(e) => setFormData({ ...formData, sponsorshipStartDate: e.target.value })}
                                />
                            </div>
                        )}

                        {formData.isSponsored && (
                            <div className="flex items-center space-x-3">
                                <label htmlFor="sponsorshipEndDate" className="text-sm font-medium text-gray-700">
                                    Sponsorship End Date
                                </label>
                                <input
                                    type="date"
                                    id="sponsorshipEndDate"
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    value={formData.sponsorshipEndDate}
                                    onChange={(e) => setFormData({ ...formData, sponsorshipEndDate: e.target.value })}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={saving}
                >
                    {saving ? 'Updating...' : 'Update Brand'}
                </button>
            </form>
        </div>
    );
}
