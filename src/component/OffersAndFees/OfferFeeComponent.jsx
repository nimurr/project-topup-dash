import React from 'react';

const OfferFeeComponent = () => {
    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-semibold">Offers & Fees</h2>
                <p className="text-sm text-gray-500">Set your commission for top-ups and gift cards</p>

                <div className="mt-4 rounded-lg grid md:grid-cols-3 gap-2">
                    <table className="w-full bg-[#F0F9FF] table-auto text-left md:col-span-1 rounded-lg text-base">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 text-base font-semibold">Fee Type</th>
                                <th className="py-2 px-4 text-base font-semibold text-center">Percentage Input (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Top-Up Fee Row */}
                            <tr>
                                <td className="py-2 px-4">Top-Up Fee</td>
                                <td className="py-2 px-4">
                                    <input
                                        type="text"
                                        className="bg-[#ffffff] py-2 ring-0 focus:outline-none w-full text-center"
                                        defaultValue={5}
                                    />
                                </td>
                            </tr>

                            {/* Gift Card Fee Row */}
                            <tr>
                                <td className="py-2 px-4">Gift Card Fee</td>
                                <td className="py-2 px-4">
                                    <input
                                        type="text"
                                        className="bg-[#ffffff] py-2 ring-0 focus:outline-none w-full text-center"
                                        defaultValue={10}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <table
                        border={1}
                        className="w-full md:col-span-2 !border-2 !rounded-lg border-[#F0F9FF] table-auto text-left border-collapse"
                    >
                        <thead>
                            <tr className="border-b border-[#F0F9FF]">
                                <th className="py-2 px-4 text-base font-semibold">Fee Type</th>
                                <th className="py-2 px-4 text-base font-semibold">Percentage Input (%)</th>
                                <th className="py-2 px-4 text-base font-semibold">Transaction Amount</th>
                                <th className="py-2 px-4 text-base font-semibold">Fee Percentage</th>
                                <th className="py-2 px-4 text-base font-semibold">Total Price</th>
                                <th className="py-2 px-4 text-base font-semibold">Your Earnings</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Top-Up Fee Row */}
                            <tr className="bg-white border-b border-[#F0F9FF]">
                                <td className="py-2 px-4 border-r border-[#F0F9FF]">Top-Up Fee</td>
                                <td className="py-2 px-4 text-center border-r border-[#F0F9FF]">5</td>
                                <td className="py-2 px-4 border-r border-[#F0F9FF]">$100 Top-Up</td>
                                <td className="py-2 px-4 border-r border-[#F0F9FF]">5%</td>
                                <td className="py-2 px-4 border-r border-[#F0F9FF]">
                                    $100
                                </td>
                                <td className="py-2 px-4">$451</td>
                            </tr>

                            {/* Gift Card Fee Row */}
                            <tr className="bg-white">
                                <td className="py-2 px-4 border-r border-[#F0F9FF]">Gift Card Fee</td>
                                <td className="py-2 px-4 text-center border-r border-[#F0F9FF]">10</td>
                                <td className="py-2 px-4 border-r border-[#F0F9FF]">$100 Gift Card</td>
                                <td className="py-2 px-4 border-r border-[#F0F9FF]">10%</td>
                                <td className="py-2 px-4 border-r border-[#F0F9FF]">
                                    $100
                                </td>
                                <td className="py-2 px-4">$451</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}

export default OfferFeeComponent;
