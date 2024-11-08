import { Header } from '@/components/layout/Header/Header';
import './globals.css';

export const metadata = {
    title: 'Quick Commerce',
    description: 'Your local grocery delivery platform in Alwar',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link
                    href="https://fonts.googleapis.com/icon?family=Material+Icons"
                    rel="stylesheet"
                />
            </head>
            <body className="min-h-screen bg-gray-50">
                {children}
            </body>
        </html>
    );
}
