'use client';

import { useState, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

// Navigation Links Configuration
const NAV_LINKS = [
    { href: '/products', label: 'Products' },
    { href: '/categories', label: 'Categories' },
    { href: '/offers', label: 'Offers' }
];

// Memoized Navigation Link Component
const NavLink = memo(({ href, label, mobile }) => (
    <Link
        href={href}
        className={`${mobile 
            ? 'block pl-3 pr-4 py-2 text-base' 
            : 'inline-flex items-center px-1 pt-1 text-sm'
        } font-medium text-gray-900 hover:text-blue-600 ${
            !mobile && 'border-b-2 border-transparent hover:border-blue-600'
        }`}
    >
        {label}
    </Link>
));

NavLink.displayName = 'NavLink';

// Cart Icon Component
const CartIcon = memo(() => (
    <svg
        className="h-6 w-6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
));

CartIcon.displayName = 'CartIcon';

// User Menu Component
const UserMenu = memo(({ user, onLogout }) => (
    <div className="relative group">
        <button className="flex items-center space-x-2 text-gray-900 hover:text-blue-600">
            <span className="text-sm font-medium">{user.name}</span>
            <Image
                src={user.profilePic || '/default-avatar.png'}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full object-cover"
            />
        </button>
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block">
            {['Profile', 'Orders'].map((item) => (
                <Link
                    key={item}
                    href={`/${item.toLowerCase()}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                    {item}
                </Link>
            ))}
            <button
                onClick={onLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
                Logout
            </button>
        </div>
    </div>
));

UserMenu.displayName = 'UserMenu';

// Mobile Menu Button Component
const MenuButton = memo(({ isOpen, onClick }) => (
    <button
        onClick={onClick}
        className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:text-blue-600 hover:bg-gray-100"
        aria-label="Toggle menu"
    >
        <svg
            className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
            />
        </svg>
        <svg
            className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
            />
        </svg>
    </button>
));

MenuButton.displayName = 'MenuButton';

// Main Header Component
export const Header = memo(() => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and Primary Navigation */}
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <Image
                                src="/logo.png"
                                alt="Alwar Mart"
                                width={40}
                                height={40}
                                className="h-10 w-auto"
                                priority
                            />
                            <span className="ml-2 text-xl font-bold text-gray-900">
                                Alwar Mart
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:ml-6 md:flex md:space-x-8">
                            {NAV_LINKS.map(link => (
                                <NavLink key={link.href} {...link} />
                            ))}
                        </div>
                    </div>

                    {/* Desktop Right Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-6">
                        {user ? (
                            <>
                                <Link
                                    href="/shop/cart"
                                    className="relative inline-flex items-center text-gray-900 hover:text-blue-600"
                                >
                                    <CartIcon />
                                </Link>
                                <UserMenu user={user} onLogout={handleLogout} />
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/auth/login"
                                    className="text-gray-900 hover:text-blue-600 font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <MenuButton 
                            isOpen={isMenuOpen} 
                            onClick={() => setIsMenuOpen(!isMenuOpen)} 
                        />
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="pt-2 pb-3 space-y-1">
                            {NAV_LINKS.map(link => (
                                <NavLink key={link.href} {...link} mobile />
                            ))}
                        </div>

                        {user ? (
                            <div className="pt-4 pb-3 border-t border-gray-200">
                                <div className="flex items-center px-4">
                                    <Image
                                        src={user.profilePic || '/default-avatar.png'}
                                        alt="Profile"
                                        width={40}
                                        height={40}
                                        className="rounded-full object-cover"
                                    />
                                    <div className="ml-3">
                                        <div className="text-base font-medium text-gray-900">
                                            {user.name}
                                        </div>
                                        <div className="text-sm font-medium text-gray-500">
                                            {user.email}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 space-y-1">
                                    {['Profile', 'Orders'].map((item) => (
                                        <Link
                                            key={item}
                                            href={`/${item.toLowerCase()}`}
                                            className="block px-4 py-2 text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-100"
                                        >
                                            {item}
                                        </Link>
                                    ))}
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="pt-4 pb-3 border-t border-gray-200">
                                <div className="space-y-1">
                                    {['Login', 'Register'].map((item) => (
                                        <Link
                                            key={item}
                                            href={`/auth/${item.toLowerCase()}`}
                                            className="block px-4 py-2 text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-100"
                                        >
                                            {item}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
});

Header.displayName = 'Header';
