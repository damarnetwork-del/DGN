
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction, TransactionType, ExpenseCategory } from '../types';

interface ExpenseChartProps {
  transactions: Transaction[];
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4274', '#82ca9d', '#ca82c5'
];

const ExpenseChart: React.FC<ExpenseChartProps> = ({ transactions }) => {
  const expenseData = useMemo(() => {
    const categoryTotals: { [key in ExpenseCategory]?: number } = {};
    
    transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .forEach((t) => {
        if (t.category) {
          if (categoryTotals[t.category]) {
            categoryTotals[t.category]! += t.amount;
          } else {
            categoryTotals[t.category] = t.amount;
          }
        }
      });

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
    }));
  }, [transactions]);

  if (expenseData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-center h-full border">
        <p className="text-gray-500">Belum ada data pengeluaran untuk ditampilkan.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg h-full flex flex-col border">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Distribusi Pengeluaran</h3>
      <div className="flex-grow w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expenseData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius="80%"
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                return (
                  <text x={x} y={y} fill="#333" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
            >
              {expenseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderColor: '#ccc',
                borderRadius: '0.75rem',
              }}
              formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`}
            />
            <Legend wrapperStyle={{fontSize: '0.8rem'}} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseChart;