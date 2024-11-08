export const DashboardStats = ({ stats }) => {
    const statItems = [
        {
            title: 'Total Sales',
            value: `₹${stats.totalSales.toLocaleString()}`,
            icon: 'payments',
            color: 'bg-green-500'
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: 'shopping_cart',
            color: 'bg-blue-500'
        },
        {
            title: 'Total Products',
            value: stats.totalProducts,
            icon: 'inventory_2',
            color: 'bg-purple-500'
        },
        {
            title: 'Total Customers',
            value: stats.totalCustomers,
            icon: 'people',
            color: 'bg-yellow-500'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statItems.map((item) => (
                <div
                    key={item.title}
                    className="bg-white rounded-lg shadow-sm p-6"
                >
                    <div className="flex items-center">
                        <div className={`${item.color} p-3 rounded-lg`}>
                            <span className="material-icons text-white">
                                {item.icon}
                            </span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">{item.title}</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {item.value}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
