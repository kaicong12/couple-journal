import { 
    Box, 
    Text,
} from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

export const ExpenseBreakdown = ({ transactions }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!transactions || transactions.length === 0) return;
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            // Group expenses by category and calculate totals
            const expensesByCategory = transactions.reduce((acc, transaction) => {
                acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
                return acc;
            }, {});

            const labels = Object.keys(expensesByCategory);
            const data = Object.values(expensesByCategory);

            // Create the doughnut chart
            const chartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels,
                    datasets: [
                        {
                            label: 'Expense Breakdown',
                            data,
                            backgroundColor: [
                                '#FF6384',
                                '#36A2EB',
                                '#FFCE56',
                                '#4BC0C0',
                                '#9966FF',
                                '#FF9F40',
                            ],
                            hoverOffset: 4,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    return `${label}: $${value.toFixed(2)}`;
                                },
                            },
                        },
                    },
                },
            });

            return () => {
                chartInstance.destroy(); // Cleanup chart instance on component unmount
            };
        }
    }, [transactions]);

    return (
        <Box padding="10px 30px" mt="10px">
            <Text fontWeight="600" fontSize="16px" textAlign="left" mb="16px">Expense Breakdown</Text>
            <Box width="300px" height="300px" mx="auto">
                <canvas ref={chartRef}></canvas>
            </Box>
        </Box>
    )
}