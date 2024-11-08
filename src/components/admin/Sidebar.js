'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ADMIN_LINKS = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { href: '/admin/products', label: 'Products', icon: 'shopping_bag' },
    { href: '/admin/categories', label: 'Categories', icon: 'category' },
    { href: '/admin/brands', label: 'Brands', icon: 'branding_watermark' },
    { href: '/admin/orders', label: 'Orders', icon: 'receipt' },
    { href: '/admin/users', label: 'Users', icon: 'people' }
];

export const AdminSidebar = () => {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex md:flex-shrink-0">
            <div className="flex flex-col w-64">
                <div className="flex flex-col h-0 flex-1 bg-gray-800">
                    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                        <div className="flex items-center flex-shrink-0 px-4">
                            <Link href="/admin/dashboard" className="text-white text-xl font-bold">
                                Quick Commerce
                            </Link>
                        </div>
                        <nav className="mt-5 flex-1 px-2 space-y-1">
                            {ADMIN_LINKS.map(({ href, label, icon }) => {
                                const isActive = pathname === href;
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        className={`${
                                            isActive
                                                ? 'bg-gray-900 text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                                    >
                                        <span className="material-icons mr-3 flex-shrink-0 h-6 w-6">
                                            {icon}
                                        </span>
                                        {label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </div>
        </aside>
    );
};
