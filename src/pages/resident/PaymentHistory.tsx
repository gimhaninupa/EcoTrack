import React, { useState } from 'react';
import { DataTable } from '../../components/shared/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Download, CreditCard, Plus, DollarSign, CheckCircle, Loader2 } from 'lucide-react';
import { useService } from '../../context/ServiceContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export function ResidentPaymentHistory() {
  const { billing, addPaymentMethod, payBill } = useService();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'summary' | 'processing' | 'success'>('summary');

  // Generate and download receipt
  const handleDownloadReceipt = (transaction: any) => {
    try {
      const doc = new jsPDF();

      // Add Company Logo/Header
      doc.setFillColor(34, 139, 34); // Forest Green #228B22
      doc.rect(0, 0, 210, 40, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('EcoTrack Services', 20, 25);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Receipt', 180, 25, { align: 'right' });

      // Receipt Details
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(`Invoice ID: ${transaction.id}`, 20, 55);
      doc.text(`Date: ${transaction.date}`, 20, 60);
      doc.text(`Payment Method: ${transaction.method}`, 20, 65);
      doc.text(`Status: ${transaction.status}`, 20, 70);

      // Add Table
      autoTable(doc, {
        startY: 80,
        head: [['Description', 'Amount (LKR)']],
        body: [
          ['Waste Collection Services', Number(transaction.amount).toFixed(2)],
        ],
        foot: [['Total', Number(transaction.amount).toFixed(2)]],
        theme: 'grid',
        headStyles: { fillColor: [34, 139, 34], textColor: 255 },
        footStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold' }
      });

      // Footer
      const finalY = (doc as any).lastAutoTable.finalY || 100;
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Thank you for your business!', 105, finalY + 20, { align: 'center' });
      doc.text('EcoTrack Waste Management Systems', 105, finalY + 25, { align: 'center' });

      // Save
      doc.save(`Receipt_${transaction.id}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Failed to generate receipt. Please try again.");
    }
  };

  const handlePayClick = () => {
    setShowPaymentModal(true);
    setPaymentStep('summary');
  };

  const confirmPayment = async () => {
    setPaymentStep('processing');
    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      payBill(billing.balance);
      setIsProcessing(false);
      setPaymentStep('success');
    }, 2000);
  };

  const columns = [{
    header: 'Invoice',
    accessorKey: 'id' as const,
    cell: (item: any) => <span className="font-mono text-xs font-medium">{item.id}</span>
  }, {
    header: 'Date',
    accessorKey: 'date' as const
  }, {
    header: 'Amount',
    accessorKey: 'amount' as const,
    cell: (item: any) => <span className="font-mono">LKR {item.amount.toFixed(2)}</span>
  }, {
    header: 'Payment Method',
    accessorKey: 'method' as const,
    cell: (item: any) => <span className="text-neutral-500">{item.method}</span>
  }, {
    header: 'Status',
    accessorKey: 'status' as const,
    cell: (item: any) => <Badge variant="success">{item.status}</Badge>
  }, {
    header: 'Actions',
    accessorKey: 'id' as const,
    cell: (item: any) => <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDownloadReceipt(item)}>
      <Download className="h-4 w-4 text-neutral-500" />
    </Button>
  }];

  return <div className="space-y-6 relative">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Billing & Payments
        </h2>
        <p className="text-neutral-500">
          Manage your payments and view history.
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-neutral-500">
          <span className="font-medium">Current Balance</span>
        </div>
        <div>
          <div className="text-3xl font-bold text-neutral-900">LKR {billing.balance.toFixed(2)}</div>
        </div>
        <Button className="w-full" onClick={handlePayClick} disabled={billing.balance <= 0}>
          {billing.balance > 0 ? 'Pay Balance' : 'All Paid'}
        </Button>
      </Card>

      <Card className="p-6 md:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-500">
            <CreditCard className="h-5 w-5" />
            <span className="font-medium">Payment Methods</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => addPaymentMethod('Visa')}>
            <Plus className="h-4 w-4 mr-2" /> Add Method
          </Button>
        </div>

        <div className="space-y-3">
          {billing.paymentMethods.length === 0 ? (
            <p className="text-neutral-500 text-sm">No payment methods added.</p>
          ) : (
            billing.paymentMethods.map(method => (
              <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg bg-neutral-50/50">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-12 bg-forest-100 rounded flex items-center justify-center text-xs font-bold text-forest-700">
                    {method.type.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-sm">•••• •••• •••• {method.last4}</div>
                    <div className="text-xs text-neutral-500">Expires {method.expiry}</div>
                  </div>
                </div>
                {method.isDefault && <Badge variant="secondary">Default</Badge>}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>

    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Payment History</h3>
      <DataTable data={billing.history} columns={columns} />
    </div>

    {/* Payment Modal */}
    {showPaymentModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
          {paymentStep === 'summary' && (
            <div className="p-6 space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold">Confirm Payment</h3>
                <p className="text-neutral-500">Please review your payment details</p>
              </div>
              <div className="bg-neutral-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Total Amount</span>
                  <span className="font-semibold">LKR {billing.balance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Payment Method</span>
                  <span>Visa •••• 4242</span>
                </div>
                <div className="border-t border-neutral-200 pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>LKR {billing.balance.toFixed(2)}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => setShowPaymentModal(false)}>Cancel</Button>
                <Button onClick={confirmPayment}>Confirm Payment</Button>
              </div>
            </div>
          )}

          {paymentStep === 'processing' && (
            <div className="p-12 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-12 w-12 text-forest-600 animate-spin" />
              <h3 className="text-lg font-medium">Processing Payment...</h3>
              <p className="text-neutral-500 text-sm text-center">Please do not close this window.</p>
            </div>
          )}

          {paymentStep === 'success' && (
            <div className="p-8 flex flex-col items-center justify-center space-y-6 text-center">
              <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-neutral-900">Payment Successful!</h3>
                <p className="text-neutral-500">Your transaction has been completed.</p>
              </div>
              <div className="w-full space-y-3">
                {/* In a real app, we'd get the transaction ID from the response */}
                <Button variant="outline" className="w-full" onClick={() => handleDownloadReceipt(billing.history[0])}>
                  <Download className="h-4 w-4 mr-2" /> Download Receipt
                </Button>
                <Button className="w-full" onClick={() => setShowPaymentModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    )}
  </div>;
}