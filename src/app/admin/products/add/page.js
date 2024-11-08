'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { productService } from '@/lib/appwrite/services/product.service';
import { VariationManager } from '@/components/admin/products/VariationManager';
import { toast } from 'react-hot-toast';
import { storage } from '@/lib/appwrite/client';
import { ID } from 'appwrite';
import Image from 'next/image';

const PRODUCT_TYPES = [
    { id: 'food', label: 'Food & Beverages' },
    { id: 'kitchen', label: 'Kitchen & Dining' },
    { id: 'household', label: 'Household Items' },
    { id: 'personal', label: 'Personal Care' },
    { id: 'others', label: 'Others' }
];

const WEIGHT_UNITS = ['g', 'kg', 'ml', 'L', 'pieces', 'pack'];

// Image Preview Component
const ImagePreview = ({ src, alt, onRemove, isNew = false }) => (
    <div className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <div className="w-full h-32 relative">
            <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-200 group-hover:scale-105"
                priority={isNew}
                onError={(e) => {
                    e.target.src = '/placeholder-image.jpg';
                }}
            />
        </div>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <button
                type="button"
                onClick={onRemove}
                className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transform transition-all duration-200 hover:scale-110"
                title="Remove image"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        {isNew && (
            <span className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                New
            </span>
        )}
    </div>
);

// Main Image Section
const ProductImages = () => (
    <div className="space-y-4">
        {/* Preview Images */}
        {previewImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {previewImages.map((preview, index) => (
                    <ImagePreview
                        key={`preview-${index}`}
                        src={preview.preview}
                        alt={`Preview ${index + 1}`}
                        onRemove={() => handleRemovePreview(index)}
                        isNew
                    />
                ))}
            </div>
        )}

        {/* Uploaded Images */}
        {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((imageId, index) => (
                    <ImagePreview
                        key={imageId}
                        src={`${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${imageId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`}
                        alt={`Product image ${index + 1}`}
                        onRemove={() => handleImageRemove(index)}
                    />
                ))}
            </div>
        )}

        {/* Upload Button */}
        {(images.length + previewImages.length) < 8 && (
            <label className="cursor-pointer block">
                <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm text-gray-500">Add Image</span>
                    <span className="text-xs text-gray-400 mt-1">
                        {8 - (images.length + previewImages.length)} remaining
                    </span>
                </div>
                <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={loading}
                    multiple
                />
            </label>
        )}

        {/* Image Guidelines */}
        <div className="text-sm text-gray-500 space-y-1">
            <div className="flex flex-wrap gap-4">
                <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Max 8 images
                </span>
                <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    JPG, PNG only
                </span>
                <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Max 5MB each
                </span>
            </div>
        </div>

        {/* Error Message */}
        {error && (
            <div className="text-sm text-red-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
            </div>
        )}
    </div>
);

export default function ProductAdd() {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [hasVariations, setHasVariations] = useState(false);
    const [variations, setVariations] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [previewImages, setPreviewImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        mrpPrice: '',
        purchasePrice: '',
        sellingPrice: '',
        discount: '',
        weight: '',
        weightUnit: 'g',
        categoryId: '',
        brandId: '',
        productType: '',
        isFoodItem: false,
        fssaiLicense: '',
        foodType: '',
        nutritionalInfo: '',
        ingredients: '',
        preparationTime: '',
        servingSize: '',
        dietaryInfo: '',
        countryOfOrigin: 'India',
        manufacturerInfo: '',
        importerInfo: '',
        packagingType: '',
        shelfLife: '',
        expiryDate: '',
        isLive: true,
        stock: '',
        minOrderQuantity: '1',
        maxOrderQuantity: '',
        barcode: '',
        hsnCode: '',
        tags: '',
        features: '',
        storageInstructions: '',
        allergyInfo: ''
    });

    useEffect(() => {
        loadFormData();
    }, []);

    const loadFormData = async () => {
        try {
            const [categoriesData, brandsData] = await Promise.all([
                productService.getAllCategories(),
                productService.getAllBrands()
            ]);
            setCategories(categoriesData.documents);
            setBrands(brandsData.documents);
        } catch (error) {
            setError('Failed to load categories and brands');
            toast.error('Failed to load form data');
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Create preview URLs and store files
        const newPreviews = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setPreviewImages([...previewImages, ...newPreviews]);
        setSelectedFiles([...selectedFiles, ...files]);
    };

    const handleRemovePreview = (index) => {
        // Revoke object URL to prevent memory leaks
        URL.revokeObjectURL(previewImages[index].preview);
        
        setPreviewImages(previewImages.filter((_, i) => i !== index));
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    };

    const handleImageRemove = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleVariationAdd = () => {
        setVariations([...variations, {
            productId: '',
            productName: '',
            name: formData.name,
            weight: '',
            weightUnit: formData.weightUnit,
            mrpPrice: '',
            sellingPrice: '',
            stock: ''
        }]);
    };

    const handleVariationChange = (index, field, value) => {
        const newVariations = [...variations];
        newVariations[index][field] = value;
        setVariations(newVariations);
    };

    const handleVariationRemove = (index) => {
        setVariations(variations.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validate required fields
            if (!formData.name || !formData.categoryId || !formData.productType) {
                throw new Error('Please fill all required fields');
            }

            // Validate food-specific fields
            if (formData.isFoodItem && !formData.fssaiLicense) {
                throw new Error('FSSAI License is required for food items');
            }

            // Upload images if there are any selected files
            let uploadedImageIds = [...images]; // Start with existing uploaded images
            if (selectedFiles.length > 0) {
                const uploadPromises = selectedFiles.map(async (file) => {
                    const response = await storage.createFile(
                        process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
                        ID.unique(),
                        file
                    );
                    return response.$id;
                });

                const newUploadedImageIds = await Promise.all(uploadPromises);
                uploadedImageIds = [...uploadedImageIds, ...newUploadedImageIds];
            }

            const productData = {
                ...formData,
                images: uploadedImageIds,
                variations: hasVariations ? variations : [],
                status: formData.isLive ? 'active' : 'inactive',
                createdAt: new Date().toISOString()
            };

            await productService.createProduct(productData);
            
            // Clear previews after successful upload
            previewImages.forEach(preview => URL.revokeObjectURL(preview.preview));
            setPreviewImages([]);
            setSelectedFiles([]);
            
            toast.success('Product created successfully');
            router.push('/admin/products');
        } catch (error) {
            setError(error.message || 'Failed to create product');
            toast.error(error.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Fill in the details below to add a new product to your inventory.
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                    <p className="font-medium">Error</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Type Selection */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Product Type</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {PRODUCT_TYPES.map(type => (
                            <button
                                key={type.id}
                                type="button"
                                onClick={() => {
                                    setFormData({
                                        ...formData,
                                        productType: type.id,
                                        isFoodItem: type.id === 'food'
                                    });
                                }}
                                className={`p-3 text-sm rounded-lg border ${
                                    formData.productType === type.id
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Basic Information */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product Name*
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Enter product name"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description*
                            </label>
                            <textarea
                                required
                                rows={3}
                                placeholder="Enter product description"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category*
                            </label>
                            <select
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.categoryId}
                                onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category.$id} value={category.$id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Brand
                            </label>
                            <select
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.brandId}
                                onChange={(e) => setFormData({...formData, brandId: e.target.value})}
                            >
                                <option value="">Select Brand</option>
                                {brands.map(brand => (
                                    <option key={brand.$id} value={brand.$id}>
                                        {brand.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Pricing Information */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Pricing Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                MRP Price*
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                placeholder="₹0.00"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.mrpPrice}
                                onChange={(e) => setFormData({...formData, mrpPrice: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Purchase Price*
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                placeholder="₹0.00"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.purchasePrice}
                                onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Selling Price*
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                placeholder="₹0.00"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.sellingPrice}
                                onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                {/* Weight and Units */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Weight and Units</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Weight*
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                placeholder="Enter weight"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.weight}
                                onChange={(e) => setFormData({...formData, weight: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Unit*
                            </label>
                            <select
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.weightUnit}
                                onChange={(e) => setFormData({...formData, weightUnit: e.target.value})}
                            >
                                {WEIGHT_UNITS.map(unit => (
                                    <option key={unit} value={unit}>
                                        {unit}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Food-specific Information */}
                {formData.isFoodItem && (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Food Product Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    FSSAI License Number*
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter FSSAI license number"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.fssaiLicense}
                                    onChange={(e) => setFormData({...formData, fssaiLicense: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Food Type*
                                </label>
                                <select
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.foodType}
                                    onChange={(e) => setFormData({...formData, foodType: e.target.value})}
                                >
                                    <option value="">Select Food Type</option>
                                    <option value="veg">Vegetarian</option>
                                    <option value="non-veg">Non-Vegetarian</option>
                                    <option value="egg">Contains Egg</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ingredients
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="List main ingredients"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.ingredients}
                                    onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nutritional Information
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Enter nutritional values"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.nutritionalInfo}
                                    onChange={(e) => setFormData({...formData, nutritionalInfo: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Shelf Life
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., 12 months"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.shelfLife}
                                    onChange={(e) => setFormData({...formData, shelfLife: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Expiry Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.expiryDate}
                                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Stock Management */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Stock Management</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Stock*
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                placeholder="Enter stock quantity"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.stock}
                                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Min Order Quantity
                            </label>
                            <input
                                type="number"
                                min="1"
                                placeholder="Minimum order quantity"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.minOrderQuantity}
                                onChange={(e) => setFormData({...formData, minOrderQuantity: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Max Order Quantity
                            </label>
                            <input
                                type="number"
                                min="1"
                                placeholder="Maximum order quantity"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={formData.maxOrderQuantity}
                                onChange={(e) => setFormData({...formData, maxOrderQuantity: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Product Images</h2>
                    
                    {/* Upload Area */}
                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                </svg>
                                <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 800x400px)</p>
                            </div>
                            <input 
                                type="file" 
                                className="hidden" 
                                multiple 
                                accept="image/*"
                                onChange={handleFileSelect}
                                disabled={loading}
                            />
                        </label>
                    </div>

                    {/* Preview Section */}
                    {previewImages.length > 0 && (
                        <div className="mt-6 space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {previewImages.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={preview.preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemovePreview(index)}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Uploaded Images */}
                    {images.length > 0 && (
                        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {images.map((imageId, index) => (
                                <div key={imageId} className="relative group">
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${imageId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`}
                                        alt={`Product image ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleImageRemove(index)}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Variations */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium text-gray-900">Product Variations</h2>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="hasVariations"
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                checked={hasVariations}
                                onChange={(e) => setHasVariations(e.target.checked)}
                            />
                            <label htmlFor="hasVariations" className="text-sm text-gray-600">
                                This product has variations
                            </label>
                        </div>
                    </div>
                    
                    {hasVariations && (
                        <VariationManager
                            variations={variations}
                            onAdd={handleVariationAdd}
                            onChange={handleVariationChange}
                            onRemove={handleVariationRemove}
                        />
                    )}
                </div>

                {/* Product Status */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                id="isLive"
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                checked={formData.isLive}
                                onChange={(e) => setFormData({...formData, isLive: e.target.checked})}
                            />
                            <label htmlFor="isLive" className="text-sm font-medium text-gray-700">
                                Product is Live
                            </label>
                        </div>
                        <p className="text-sm text-gray-500">
                            Product will be visible to customers when live
                        </p>
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="\ bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                    <div className="max-w-4xl mx-auto flex justify-end space-x-3">
                        <button
                            type="button"
                            className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={() => router.push('/admin/products')}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
