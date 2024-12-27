import { Box } from '@chakra-ui/react';
import { EmptyState } from './EmptyState';
import { Chart, registerables } from "chart.js";
import { useRef, useEffect, useMemo } from 'react';

Chart.register(...registerables);

export const WeeklyView = ({ transactions }) => {
    const chartRef = useRef(null);
    const BAR_PERCENTAGE = 0.5

    const currentWeekTransactions = useMemo(() => {
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1)); // Get Monday of the current week
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        return transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.date);
            return transactionDate >= startOfWeek && transactionDate <= endOfWeek;
        });
    }, [transactions]);

    useEffect(() => {
        if (!chartRef.current) return;
        const ctx = chartRef.current.getContext("2d");

        const getWeeklyData = (transactions) => {
            const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
            const weeklyTotals = Array(7).fill(0);
            const weeklyDates = Array(7).fill(null);

            transactions.forEach((transaction) => {
                const transactionDate = new Date(transaction.date);
                const dayIndex = (transactionDate.getDay() + 6) % 7; // Adjust for Monday as the first day
                weeklyTotals[dayIndex] += transaction.amount;
                weeklyDates[dayIndex] = transaction.date;
            });

            return {
                labels: weekDays,
                data: weeklyTotals,
                dates: weeklyDates
            };
        };

        const weeklyData = getWeeklyData(currentWeekTransactions);

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
                    backgroundColor: (ctx) => {
                        const maxValue = Math.max(...weeklyData.data);
                        return weeklyData.data.map((value) =>
                            value === maxValue ? "rgba(255, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.6)"
                        );
                    },
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
                            return `$${context.raw}`;
                        },
                    },
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
                    // const activeDate = weeklyData.dates[index];
                    // onChangeActiveDay(activeDate);
                    chart.data.datasets[1].backgroundColor = chart.data.datasets[1].data.map((_, i) =>
                        i === index ? "rgba(255, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.6)"
                    );
                    chart.update();
                }
            },
        };

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
    }, [currentWeekTransactions]);

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