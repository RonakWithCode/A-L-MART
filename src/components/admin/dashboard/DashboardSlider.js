'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const SLIDER_ITEMS = [
    {
        id: 1,
        title: 'Welcome to Quick Commerce Admin',
        description: 'Manage your products, orders, and customers all in one place',
        image: '/admin/slider/dashboard.jpg'
    },
    {
        id: 2,
        title: 'Track Your Sales',
        description: 'Monitor your business performance with detailed analytics',
        image: '/admin/slider/sales.jpg'
    },
    {
        id: 3,
        title: 'Manage Products',
        description: 'Add, edit, and organize your product catalog easily',
        image: '/admin/slider/products.jpg'
    }
];

export const DashboardSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => 
                prev === SLIDER_ITEMS.length - 1 ? 0 : prev + 1
            );
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-64 rounded-lg overflow-hidden">
            {SLIDER_ITEMS.map((item, index) => (
                <div
                    key={item.id}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40">
                        <div className="flex flex-col justify-center h-full px-8 text-white">
                            <h2 className="text-3xl font-bold mb-2">
                                {item.title}
                            </h2>
                            <p className="text-lg">{item.description}</p>
                        </div>
                    </div>
                </div>
            ))}
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {SLIDER_ITEMS.map((_, index) => (
                    <button
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                            index === currentSlide 
                                ? 'bg-white' 
                                : 'bg-white bg-opacity-50'
                        }`}
                        onClick={() => setCurrentSlide(index)}
                    />
                ))}
            </div>
        </div>
    );
};