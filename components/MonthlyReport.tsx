import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, PaymentMethod } from '../types';
import DownloadIcon from './icons/DownloadIcon';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// FIX: The module augmentation for 'jspdf' was removed because it caused a
// compile error when TypeScript could not find the module's type definitions.
// By removing it, 'jspdf' is implicitly treated as 'any', which allows the
// 'autoTable' method from the plugin to be called without type errors.

interface MonthlyReportProps {
  transactions: Transaction[];
}

const MonthlyReport: React.FC<MonthlyReportProps> = ({ transactions }) => {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const reportData = useMemo(() => {
    if (!selectedMonth) return null;

    const [year, month] = selectedMonth.split('-').map(Number);

    const filtered = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1;
    });

    let totalIncome = 0;
    let totalExpense = 0;
    let totalTransfer = 0;
    let totalCash = 0;

    filtered.forEach(t => {
      if (t.type === TransactionType.INCOME) {
        totalIncome += t.amount;
      } else {
        totalExpense += t.amount;
      }
      if (t.paymentMethod === PaymentMethod.TRANSFER) {
        totalTransfer += t.amount;
      } else {
        totalCash += t.amount;
      }
    });

    const balance = totalIncome - totalExpense;
    const partners = ['Mardi Jayadi', 'Daden', 'Hamdan', 'Umi'];
    const profitShare = balance > 0 ? balance / partners.length : 0;

    return {
      transactions: filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      totalIncome,
      totalExpense,
      balance,
      totalTransfer,
      totalCash,
      monthName: new Date(year, month - 1).toLocaleString('id-ID', { month: 'long', year: 'numeric' }),
      partners,
      profitShare,
    };
  }, [selectedMonth, transactions]);

  const handleDownloadPDF = () => {
    if (!reportData) return;

    const doc = new jsPDF();
    const { 
        totalIncome, totalExpense, balance, 
        totalTransfer, totalCash, transactions, 
        monthName, partners, profitShare 
    } = reportData;

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Damar Global Network', 14, 22);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Jl. Raya Cadas - Kukun, Kp. Korod, Ds. Pangadegan, Kec. Pasar kemis', 14, 30);
    doc.line(14, 34, 196, 34);

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Laporan Keuangan Bulanan - ${monthName}`, 105, 45, { align: 'center' });

    (doc as any).autoTable({
      startY: 55,
      head: [['Deskripsi', 'Jumlah']],
      body: [
        ['Total Pemasukan', `Rp ${totalIncome.toLocaleString('id-ID')}`],
        ['Total Pengeluaran', `Rp ${totalExpense.toLocaleString('id-ID')}`],
        ['Saldo Akhir (Laba/Rugi)', `Rp ${balance.toLocaleString('id-ID')}`],
        ['Total via Transfer', `Rp ${totalTransfer.toLocaleString('id-ID')}`],
        ['Total via Tunai', `Rp ${totalCash.toLocaleString('id-ID')}`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [30, 41, 59] },
    });

    let lastY = (doc as any).lastAutoTable.finalY;

    if (balance > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Rincian Bagi Hasil', 14, lastY + 10);
      const profitShareBody = partners.map(p => [
          p, `Rp ${profitShare.toLocaleString('id-ID', { minimumFractionDigits: 2 })}`
      ]);
      (doc as any).autoTable({
          startY: lastY + 15,
          head: [['Nama', 'Jumlah Diterima']],
          body: profitShareBody,
          theme: 'striped',
          headStyles: { fillColor: [51, 65, 85] },
      });
      lastY = (doc as any).lastAutoTable.finalY;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Rincian Transaksi', 14, lastY + 10);
    (doc as any).autoTable({
        startY: lastY + 15,
        head: [['Tanggal', 'Deskripsi', 'Metode', 'Pemasukan', 'Pengeluaran']],
        body: transactions.map(t => [
          new Date(t.date).toLocaleDateString('id-ID'),
          t.description,
          t.paymentMethod,
          t.type === 'income' ? `Rp ${t.amount.toLocaleString('id-ID')}` : '-',
          t.type === 'expense' ? `Rp ${t.amount.toLocaleString('id-ID')}` : '-',
        ]),
        theme: 'grid'
    });
    
    lastY = (doc as any).lastAutoTable.finalY + 20;

    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    doc.setFontSize(11);
    doc.text(`Tangerang, ${today}`, 196, lastY, { align: 'right' });
    doc.text('Direktur Utama', 196, lastY + 20, { align: 'right' });
    doc.text('Mardi Jayadi', 196, lastY + 40, { align: 'right' });

    doc.save(`Laporan_Keuangan_${selectedMonth}.pdf`);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h3 className="text-xl font-bold text-gray-900">Laporan Keuangan Bulanan</h3>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full sm:w-auto bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          />
          <button
            onClick={handleDownloadPDF}
            disabled={!reportData}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Unduh Laporan"
          >
            <DownloadIcon className="w-4 h-4" />
            Unduh PDF
          </button>
        </div>
      </div>

      {!reportData || reportData.transactions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Tidak ada data transaksi untuk bulan {reportData?.monthName || 'yang dipilih'}.</p>
      ) : (
        <div className="space-y-6">
          {/* Summary Section */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-semibold text-gray-900 text-lg mb-2">Rekapitulasi {reportData.monthName}</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
              <div className="p-2 bg-white rounded border"><p className="text-sm text-gray-500">Pemasukan</p><p className="font-bold text-green-500">Rp {reportData.totalIncome.toLocaleString('id-ID')}</p></div>
              <div className="p-2 bg-white rounded border"><p className="text-sm text-gray-500">Pengeluaran</p><p className="font-bold text-red-500">Rp {reportData.totalExpense.toLocaleString('id-ID')}</p></div>
              <div className="p-2 bg-white rounded border"><p className="text-sm text-gray-500">Saldo</p><p className={`font-bold ${reportData.balance >= 0 ? 'text-teal-500' : 'text-red-500'}`}>Rp {reportData.balance.toLocaleString('id-ID')}</p></div>
              <div className="p-2 bg-white rounded border"><p className="text-sm text-gray-500">Via Transfer</p><p className="font-bold text-gray-900">Rp {reportData.totalTransfer.toLocaleString('id-ID')}</p></div>
              <div className="p-2 bg-white rounded border"><p className="text-sm text-gray-500">Via Tunai</p><p className="font-bold text-gray-900">Rp {reportData.totalCash.toLocaleString('id-ID')}</p></div>
            </div>
          </div>
          
          {/* Profit Sharing Section */}
          {reportData.balance > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="font-semibold text-gray-900 text-lg mb-2">Rincian Bagi Hasil</h4>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {reportData.partners.map(partner => (
                        <div key={partner} className="p-2 bg-white rounded border">
                            <p className="text-sm text-gray-500">{partner}</p>
                            <p className="font-semibold text-gray-900">Rp {reportData.profitShare.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</p>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {/* Transaction Table */}
          <div>
            <h4 className="font-semibold text-gray-900 text-lg mb-2">Rincian Transaksi</h4>
            <div className="max-h-96 overflow-y-auto overflow-x-auto pr-2">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs text-gray-500 uppercase bg-gray-100 sticky top-0">
                  <tr>
                    <th scope="col" className="px-4 py-3">Tanggal</th>
                    <th scope="col" className="px-4 py-3">Deskripsi</th>
                    <th scope="col" className="px-4 py-3">Metode</th>
                    <th scope="col" className="px-4 py-3 text-right">Pemasukan</th>
                    <th scope="col" className="px-4 py-3 text-right">Pengeluaran</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.transactions.map(t => (
                    <tr key={t.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-2">{new Date(t.date).toLocaleDateString('id-ID')}</td>
                      <td className="px-4 py-2">{t.description}</td>
                      <td className="px-4 py-2">{t.paymentMethod}</td>
                      <td className="px-4 py-2 text-right text-green-500">{t.type === 'income' ? `Rp ${t.amount.toLocaleString('id-ID')}` : '-'}</td>
                      <td className="px-4 py-2 text-right text-red-500">{t.type === 'expense' ? `Rp ${t.amount.toLocaleString('id-ID')}` : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyReport;