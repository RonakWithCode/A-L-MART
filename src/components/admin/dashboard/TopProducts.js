export const TopProducts = () => {
    const products = [
        { name: 'Product 1', sales: 150, revenue: 15000 },
        { name: 'Product 2', sales: 120, revenue: 12000 },
        { name: 'Product 3', sales: 100, revenue: 10000 },
        { name: 'Product 4', sales: 80, revenue: 8000 },
        { name: 'Product 5', sales: 60, revenue: 6000 }
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Top Products</h3>
            <div className="space-y-4">
                {products.map((product) => (
                    <div
                        key={product.name}
                        className="flex items-center justify-between"
                    >
                        <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">
                                {product.sales} sales
                            </p>
                        </div>
                        <p className="text-green-600 font-medium">
                            ₹{product.revenue.toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}; 