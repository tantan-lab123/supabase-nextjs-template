import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AuthLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const productName = "LeadAlert";

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8" dir="rtl">
            <Link
                href="/"
                className="absolute right-8 top-8 flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
                <ArrowRight className="w-4 h-4 ml-2" />
                חזרה לדף הבית
            </Link>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    {productName}
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {children}
                </div>
            </div>
        </div>
    );
}