import { Box } from '@chakra-ui/react';
import { EmptyState } from './EmptyState';
import { Chart, registerables } from "chart.js";
import { useRef, useEffect, useMemo } from 'react';

Chart.register(...registerables);

export const WeeklyView = ({ transactions, setActiveDate }) => {
    const chartRef = useRef(null);
    const BAR_PERCENTAGE = 0.5

    const past7DaysTransactions = useMemo(() => {
        const now = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 6); // Calculate the date 6 days ago
        sevenDaysAgo.setHours(0, 0, 0, 0);

        return transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.date);
            return transactionDate >= sevenDaysAgo && transactionDate <= now;
        });
    }, [transactions]);

    useEffect(() => {
        if (!chartRef.current) return;
        const ctx = chartRef.current.getContext("2d");

        const getPast7DaysData = (transactions) => {
            const now = new Date();
            const dailyTotals = Array(7).fill(0);
            const formattedDates = Array(7).fill(null);
            const actualDates = Array(7).fill(null);

            for (let i = 0; i < 7; i++) {
                const date = new Date();
                date.setDate(now.getDate() - (6 - i)); // Generate the past 7 days in order
                date.setHours(0, 0, 0, 0);
                formattedDates[i] = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                actualDates[i] = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
            }

            transactions.forEach((transaction) => {
                const transactionDate = new Date(transaction.date);
                const diffDays = Math.floor((transactionDate - (new Date(actualDates[0]))) / (1000 * 60 * 60 * 24));
                if (diffDays >= 0 && diffDays < 7) {
                    dailyTotals[diffDays] += transaction.amount;
                }
            });

            return {
                labels: formattedDates,
                data: dailyTotals,
                dates: actualDates
            };
        };

        const weeklyData = getPast7DaysData(past7DaysTransactions);

        const chartData = {
            labels: weeklyData.labels,
            datasets: [
                {
                    label: "Background",
                    data: Array(7).fill(Math.max(...weeklyData.data) || 300), // Set to max or 300
                    backgroundColor: "rgba(200, 200, 200, 0.3)",
                    borderRadius: 10,
                    barPercentage: BAR_PERCENTAGE,
                    categoryPercentage: 1.0,
                },
                {
                    label: "Expenses",
                    data: weeklyData.data,
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    borderRadius: 10,
                    barPercentage: BAR_PERCENTAGE,
                    categoryPercentage: 1.0,
                    hoverBackgroundColor: "#ff0000",
                },
            ],
        };

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: "Past Week Expenses",
                    font: {
                        size: 16,
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            if (context.datasetIndex === 1) {
                                return `$${context.raw}`;
                            }
                            return null;
                        },
                    },
                    filter: function (tooltipItem) {
                        return tooltipItem.datasetIndex === 1;
                    }
                },
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { display: true },
                    border: { display: false },
                    stacked: true,
                },
                y: {
                    beginAtZero: true,
                    grid: { display: false },
                    ticks: { display: false },
                    border: { display: false },
                },
            },
            onClick: (e, activeElements, chart) => {
                if (activeElements.length) {
                    const index = activeElements[0].index;
                    const activeDate = weeklyData.dates[index];
                    setActiveDate(activeDate);
                    chart.data.datasets[1].backgroundColor = chart.data.datasets[1].data.map((_, i) =>
                        i === index ? "rgba(255, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.6)"
                    );
                    chart.update();
                } else {
                    setActiveDate(null);
                    chart.data.datasets[1].backgroundColor = chart.data.datasets[1].data.map(() => "rgba(0, 0, 0, 0.6)");
                    chart.update();
                }
            },
        };

        const createChart = () => {
            // Destroy the chart instance if it already exists
            if (chartRef.current._chartInstance) {
                chartRef.current._chartInstance.destroy();
            }

            // Create the Chart instance
            chartRef.current._chartInstance = new Chart(ctx, {
                type: "bar",
                data: chartData,
                options: chartOptions,
            });
        }
        createChart();
    }, [past7DaysTransactions, setActiveDate]);

    return (
        <Box>
            { transactions.length < 2 ? (
                <EmptyState />
            ) : (
                <Box minH="250px">
                    <canvas ref={chartRef}></canvas>
                </Box>
            )  }
        </Box>
    )
}