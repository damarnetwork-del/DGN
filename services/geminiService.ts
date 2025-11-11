
import { GoogleGenAI } from "@google/genai";
import { Transaction } from '../types';

export const getFinancialSummary = async (transactions: Transaction[]): Promise<string> => {
  // Per guidelines, API key must be available. This check provides a graceful fallback.
  if (!process.env.API_KEY) {
    console.warn("API_KEY is not set. AI features will be disabled.");
    return "Fitur AI dinonaktifkan karena API Key tidak ditemukan.";
  }
  
  if (transactions.length === 0) {
    return "Belum ada transaksi untuk dianalisis. Silakan tambahkan beberapa transaksi terlebih dahulu.";
  }

  // FIX: Initialize GoogleGenAI inside the function when API key is confirmed to exist,
  // and use process.env.API_KEY directly as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash';

  const formattedTransactions = transactions.map(t => 
    `- ${t.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}: ${t.description} - Rp ${t.amount.toLocaleString('id-ID')} pada ${new Date(t.date).toLocaleDateString('id-ID')}`
  ).join('\n');

  const prompt = `
    Anda adalah seorang penasihat keuangan pribadi yang ramah dan cerdas. Berdasarkan daftar transaksi berikut, berikan ringkasan singkat (2-3 kalimat) mengenai kebiasaan pengeluaran pengguna dan satu saran praktis yang dapat segera diterapkan untuk meningkatkan kesehatan finansial mereka. Gunakan format Markdown.

    Data Transaksi:
    ${formattedTransactions}

    Format Jawaban:
    **Ringkasan Keuangan:**
    [Tulis ringkasan di sini]

    **Saran Praktis:**
    [Tulis satu saran di sini]
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching financial summary:", error);
    return "Maaf, terjadi kesalahan saat mencoba menganalisis keuangan Anda. Silakan coba lagi nanti.";
  }
};