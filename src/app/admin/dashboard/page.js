'use client';

import Link from 'next/link';

const ADMIN_ACTIONS = [
    {
        title: 'Product Management',
        items: [
            { name: 'Add New Product', href: '/admin/products/add', icon: 'add_box' },
            { name: 'View All Products', href: '/admin/products', icon: 'inventory_2' }
        ]
    },
    {
        title: 'Category Management',
        items: [
            { name: 'Add Category', href: '/admin/categories/add', icon: 'create_new_folder' },
            { name: 'Add Sub Category', href: '/admin/categories/sub/add', icon: 'subdirectory_arrow_right' },
            { name: 'View Categories', href: '/admin/categories', icon: 'category' }
        ]
    }, 
    {
        title: 'Brand Management',
        items: [
            { name: 'Add New Brand', href: '/admin/brands/add', icon: 'add_business' },
            { name: 'View All Brands', href: '/admin/brands', icon: 'branding_watermark' }
        ]
    },
    {
        title: 'Inventory',
        items: [
            { name: 'Stock Management', href: '/admin/inventory', icon: 'inventory' },
            { name: 'Low Stock Alerts', href: '/admin/inventory/alerts', icon: 'warning' }
        ]
    }
];

export default function AdminHomePage() {
    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">Manage your products, categories, and brands</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ADMIN_ACTIONS.map((section) => (
                    <div 
                        key={section.title} 
                        className="bg-white rounded-lg shadow overflow-hidden"
                    >
                        <div className="bg-gray-50 px-4 py-3 border-b">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {section.title}
                            </h2>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-1 gap-4">
                                {section.items.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors border"
                                    >
                                        <span className="material-icons text-gray-600 mr-3">
                                            {item.icon}
                                        </span>
                                        <span className="text-gray-700 font-medium">
                                            {item.name}
                                        </span>
                                        <span className="material-icons text-gray-400 ml-auto">
                                            arrow_forward
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Quick Actions
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            href="/admin/products/add"
                            className="flex items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            <span className="material-icons text-blue-600 mr-2">
                                add_circle
                            </span>
                            <span className="text-blue-700 font-medium">
                                Add Product
                            </span>
                        </Link>
                        <Link
                            href="/admin/categories/add"
                            className="flex items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                        >
                            <span className="material-icons text-green-600 mr-2">
                                add_circle
                            </span>
                            <span className="text-green-700 font-medium">
                                Add Category
                            </span>
                        </Link>
                        <Link
                            href="/admin/brands/add"
                            className="flex items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                        >
                            <span className="material-icons text-purple-600 mr-2">
                                add_circle
                            </span>
                            <span className="text-purple-700 font-medium">
                                Add Brand
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
