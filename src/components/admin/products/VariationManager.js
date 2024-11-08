'use client';

export function VariationManager({ variations, onAdd, onChange, onRemove }) {
    return (
        <div className="space-y-4">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Product ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Product Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Weight
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Unit
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                MRP Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Selling Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {variations.map((variation, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                        type="text"
                                        className="w-32 px-2 py-1 border rounded-md"
                                        placeholder="Product ID"
                                        value={variation.productId || ''}
                                        onChange={(e) => onChange(index, 'productId', e.target.value)}
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                        type="text"
                                        className="w-40 px-2 py-1 border rounded-md"
                                        placeholder="Product Name"
                                        value={variation.productName || ''}
                                        onChange={(e) => onChange(index, 'productName', e.target.value)}
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                        type="number"
                                        className="w-24 px-2 py-1 border rounded-md"
                                        placeholder="Weight"
                                        value={variation.weight}
                                        onChange={(e) => onChange(index, 'weight', e.target.value)}
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        className="w-24 px-2 py-1 border rounded-md"
                                        value={variation.weightUnit}
                                        onChange={(e) => onChange(index, 'weightUnit', e.target.value)}
                                    >
                                        <option value="g">g</option>
                                        <option value="kg">kg</option>
                                        <option value="ml">ml</option>
                                        <option value="L">L</option>
                                        <option value="pieces">pieces</option>
                                        <option value="pack">pack</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                        type="number"
                                        className="w-24 px-2 py-1 border rounded-md"
                                        value={variation.mrpPrice}
                                        onChange={(e) => onChange(index, 'mrpPrice', e.target.value)}
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                        type="number"
                                        className="w-24 px-2 py-1 border rounded-md"
                                        value={variation.sellingPrice}
                                        onChange={(e) => onChange(index, 'sellingPrice', e.target.value)}
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                        type="number"
                                        className="w-24 px-2 py-1 border rounded-md"
                                        value={variation.stock}
                                        onChange={(e) => onChange(index, 'stock', e.target.value)}
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        type="button"
                                        onClick={() => onRemove(index)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button
                type="button"
                onClick={onAdd}
                className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Add Variation
            </button>
        </div>
    );
}
