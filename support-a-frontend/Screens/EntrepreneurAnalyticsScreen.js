import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const screenWidth = Dimensions.get('window').width;

const EntrepreneurAnalyticsScreen = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            { data: [] }
        ],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Order'));
                let monthTotals = {};
                querySnapshot.forEach(doc => {
                    const order = doc.data();
                    const month = new Date(order.OrderDate).getMonth();
                    if (!monthTotals[month]) {
                        monthTotals[month] = {
                            totalProfit: 0,
                            count: 0
                        };
                    }
                    monthTotals[month].totalProfit += parseFloat(order.TotalPrice);
                    monthTotals[month].count += 1;
                });

                const labels = [];
                const data = [];
                for (let month in monthTotals) {
                    labels.push(new Date(0, month).toLocaleString('default', { month: 'short' }));
                    data.push(monthTotals[month].totalProfit);
                }

                setChartData({
                    labels: labels,
                    datasets: [{ data: data }]
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const chartConfig = {
        backgroundGradientFrom: '#DFF2E3',
        backgroundGradientTo: '#DFF2E3',
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        barPercentage: 0.5,
        decimalPlaces: 0,
        useShadowColorFromDataset: false,
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Sales Analytics</Text>
            <BarChart
                style={styles.chart}
                data={chartData}
                width={screenWidth - 16}
                height={220}
                yAxisLabel="$"
                chartConfig={chartConfig}
                verticalLabelRotation={30}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
        backgroundColor: '#ffffff',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    }
});

export default EntrepreneurAnalyticsScreen;
