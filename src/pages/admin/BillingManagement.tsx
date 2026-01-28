import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Download, Search, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useAdmin, Invoice } from '../../context/AdminContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function AdminBillingManagement() {
    const { invoices, generateMonthlyStatement, addInvoice, residents } = useAdmin();
    const [searchTerm, setSearchTerm] = useState('');

    // Filter invoices based on search
    const filteredInvoices = invoices.filter(inv =>
        inv.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleStatementRun = () => {
        if (confirm('Are you sure you want to run the monthly statement generation for all residents?')) {
            generateMonthlyStatement();
            alert('Monthly statements generated successfully!');
        }
    };

    const handleGenerateInvoice = () => {
        // Simple mock implementation for generating a single invoice
        // In a real app, this would be a modal form
        const resident = residents[0]; // Pick first resident for demo
        if (!resident) {
            alert('No residents found to generate invoice for.');
            return;
        }

        if (confirm(`Generate a new invoice for ${resident.name}?`)) {
            addInvoice({
                residentId: resident.id,
                residentName: resident.name,
                date: new Date().toISOString().split('T')[0],
                amount: resident.type === 'Commercial' ? 5000 : 750,
                status: 'Pending',
                method: 'Bank Transfer',
                items: [{ description: 'Ad-hoc Waste Removal', amount: resident.type === 'Commercial' ? 5000 : 750 }]
            });
            alert('New invoice generated!');
        }
    };

    const generatePDF = (invoice: Invoice, type: 'Invoice' | 'Receipt') => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(34, 139, 34); // Forest Green
        doc.text('EcoTrack', 14, 20);

        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text('Waste Management Services', 14, 28);

        // Document Info
        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.text(type.toUpperCase(), 140, 20);

        doc.setFontSize(10);
        doc.text(`No: ${invoice.id}`, 140, 28);
        doc.text(`Date: ${invoice.date}`, 140, 33);

        // Resident Info
        doc.text('Bill To:', 14, 45);
        doc.setFontSize(12);
        doc.text(invoice.residentName, 14, 52);
        doc.setFontSize(10);
        doc.text(`Resident ID: ${invoice.residentId}`, 14, 58);

        // Table
        const tableColumn = ["Description", "Amount (LKR)"];
        const tableRows = invoice.items.map(item => [item.description, item.amount.toFixed(2)]);

        // Add total row
        tableRows.push(['', '']);
        tableRows.push(['Total', invoice.amount.toFixed(2)]);

        autoTable(doc, {
            startY: 65,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: [34, 139, 34] },
            columnStyles: {
                0: { cellWidth: 120 },
                1: { cellWidth: 50, halign: 'right' }
            }
        });

        // Footer
        const finalY = (doc as any).lastAutoTable.finalY || 150;
        doc.setFontSize(10);
        doc.setTextColor(100);

        if (type === 'Receipt') {
            doc.text(`Payment Method: ${invoice.method}`, 14, finalY + 10);
            doc.text('Thank you for your payment!', 14, finalY + 20);
        } else {
            doc.text('Please make payment within 14 days.', 14, finalY + 10);
        }

        doc.save(`${type}_${invoice.id}.pdf`);
    };

    // Calculate Dynamic Stats
    const totalRevenue = invoices
        .filter(inv => inv.status === 'Paid')
        .reduce((sum, inv) => sum + inv.amount, 0);

    const pendingPayments = invoices
        .filter(inv => inv.status === 'Pending')
        .reduce((sum, inv) => sum + inv.amount, 0);

    const overdueCount = invoices
        .filter(inv => inv.status === 'Overdue').length;

    const formatCurrency = (amount: number) => {
        if (amount >= 1000000) {
            return `LKR ${(amount / 1000000).toFixed(1)}M`;
        }
        return `LKR ${amount.toLocaleString()}`;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Billing & Revenue</h2>
                    <p className="text-neutral-500">Manage invoices, payments, and financial reports.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleStatementRun}>Statement Run</Button>
                    <Button onClick={handleGenerateInvoice}>Generate Invoice</Button>
                </div>
            </div>

            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-forest-600 text-white border-forest-500">
                    <CardContent className="p-6">
                        <div className="text-forest-100 text-sm font-medium mb-1">Total Revenue (YTD)</div>
                        <div className="text-3xl font-bold">{formatCurrency(totalRevenue)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="text-neutral-500 text-sm font-medium mb-1">Pending Payments</div>
                        <div className="text-3xl font-bold text-amber-600">LKR {pendingPayments.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="text-neutral-500 text-sm font-medium mb-1">Overdue Invoices</div>
                        <div className="text-3xl font-bold text-red-600">{overdueCount}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Transactions Table */}
            <Card>
                <div className="p-4 border-b border-neutral-100 flex justify-between items-center gap-4">
                    <h3 className="font-semibold text-lg">Recent Transactions</h3>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <Input
                            placeholder="Search invoice or resident..."
                            className="pl-9 h-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-neutral-50/50 text-neutral-500 uppercase text-xs font-medium">
                            <tr>
                                <th className="px-6 py-3">Invoice ID</th>
                                <th className="px-6 py-3">Resident</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {filteredInvoices.length > 0 ? (
                                filteredInvoices.map(inv => (
                                    <tr key={inv.id} className="hover:bg-neutral-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-neutral-500">{inv.id}</td>
                                        <td className="px-6 py-4 font-medium">{inv.residentName}</td>
                                        <td className="px-6 py-4 text-neutral-500">{inv.date}</td>
                                        <td className="px-6 py-4 font-bold">LKR {inv.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <Badge variant={
                                                inv.status === 'Paid' ? 'success' :
                                                    inv.status === 'Overdue' ? 'destructive' : 'warning'
                                            } className="flex w-fit items-center gap-1">
                                                {inv.status === 'Paid' ? <CheckCircle2 className="h-3 w-3" /> :
                                                    inv.status === 'Overdue' ? <AlertCircle className="h-3 w-3" /> :
                                                        <Clock className="h-3 w-3" />
                                                }
                                                {inv.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {inv.status === 'Paid' ? (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-neutral-400 hover:text-forest-600"
                                                        title="Download Receipt"
                                                        onClick={() => generatePDF(inv, 'Receipt')}
                                                    >
                                                        <CheckCircle2 className="h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-neutral-400 hover:text-forest-600"
                                                        title="Download Invoice"
                                                        onClick={() => generatePDF(inv, 'Invoice')}
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">
                                        No invoices found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
