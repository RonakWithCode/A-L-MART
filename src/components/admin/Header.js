'use client';

import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';

export const AdminHeader = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-semibold text-gray-900">
                            Admin Dashboard
                        </h1>
                    </div>

                    <div className="flex items-center">
                        <div className="relative group">
                            <button className="flex items-center space-x-3 text-gray-700 hover:text-gray-900">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-medium">
                                        {user?.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        Admin
                                    </span>
                                </div>
                                <Image
                                    src={user?.profilePic || '/default-avatar.png'}
                                    alt="Profile"
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                />
                            </button>
                            
                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block">
                                <button
                                    onClick={logout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
