// src/app/dashboard/invoices/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Mail, Printer, FileText, Calendar, User, Home, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';
// import { paymentService } from '@/services/payment.service';

export default function InvoicePage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoice();
  }, [params.id]);

  const loadInvoice = async () => {
    try {
      // In real implementation, you'd fetch from /api/invoices/:id
      const paymentData = localStorage.getItem('paymentData');
      const projectData = localStorage.getItem('projectPaymentData');
      
      if (paymentData) {
        const data = JSON.parse(paymentData);
        const project = projectData ? JSON.parse(projectData) : null;
        
        setInvoice({
          id: data.paymentId,
          type: data.type,
          amount: data.amount,
          customer: data.customer,
          timestamp: data.timestamp,
          plan: data.plan,
          addons: data.addons,
          project: project,
          status: 'PAID'
        });
      }
    } catch (error) {
      console.error('Error loading invoice:', error);
      toast.error('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // Generate PDF (you can use libraries like jsPDF, html2canvas, or @react-pdf/renderer)
      toast.success('PDF download started');
      // Implement PDF generation logic here
    } catch (error) {
      toast.error('Failed to download PDF');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResendEmail = async () => {
    try {
      // Call API to resend invoice email
      toast.success('Invoice email sent successfully');
    } catch (error) {
      toast.error('Failed to send email');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invoice Not Found</h2>
          <p className="text-gray-600 mb-6">The requested invoice could not be found.</p>
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 print:bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleResendEmail}
              className="flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Resend Email
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
            <Button
              onClick={handlePrint}
              className="flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
          </div>
        </div>

        {/* Invoice */}
        <Card className="print:shadow-none print:border-0">
          <CardContent className="p-8">
            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-8 pb-6 border-b">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {invoice.status}
                </Badge>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600">Invoice #</span>
                  <span className="font-mono font-medium">{invoice.id}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(invoice.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Company & Customer Info */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">From:</h3>
                <div className="text-gray-600">
                  <p className="font-semibold">Houspire Designs</p>
                  <p>123 Design Street</p>
                  <p>Creative City, CC 12345</p>
                  <p>support@houspire.com</p>
                  <p>+91-XXXXX-XXXXX</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
                <div className="text-gray-600">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4" />
                    <p className="font-semibold">{invoice.customer.name}</p>
                  </div>
                  <p>{invoice.customer.email}</p>
                  {invoice.project && (
                    <div className="flex items-center gap-2 mt-2">
                      <Home className="w-4 h-4" />
                      <span>{invoice.project.projectType} in {invoice.project.city}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Invoice Details</h3>
              
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-900">Description</th>
                      <th className="text-right p-4 font-semibold text-gray-900">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Package */}
                    {invoice.plan && (
                      <tr className="border-b">
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-gray-900">{invoice.plan}</p>
                            <p className="text-sm text-gray-600">Interior Design Package</p>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <p className="font-medium text-gray-900">
                            ₹{invoice.amount?.toLocaleString('en-IN')}
                          </p>
                        </td>
                      </tr>
                    )}
                    
                    {/* Addons */}
                    {invoice.addons?.map((addon, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-gray-900">{addon.name}</p>
                            <p className="text-sm text-gray-600">Additional Service</p>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <p className="font-medium text-gray-900">
                            +₹{addon.price?.toLocaleString('en-IN')}
                          </p>
                        </td>
                      </tr>
                    ))}
                    
                    {/* Total */}
                    <tr className="bg-gray-50">
                      <td className="p-4">
                        <p className="font-semibold text-gray-900">Total Amount</p>
                      </td>
                      <td className="p-4 text-right">
                        <p className="font-bold text-lg text-gray-900">
                          ₹{invoice.amount?.toLocaleString('en-IN')}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">Payment Method</h3>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <IndianRupee className="w-4 h-4 text-blue-600" />
                </div>
                <span>Razorpay • Paid on {new Date(invoice.timestamp).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Footer Notes */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-2 gap-8 text-sm text-gray-600">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Terms & Conditions</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Payment due upon receipt</li>
                    <li>All amounts in Indian Rupees</li>
                    <li>7-day money back guarantee</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Thank You</h4>
                  <p>Thank you for choosing Houspire for your interior design needs.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Info */}
        <div className="text-center mt-8 text-sm text-gray-500 print:hidden">
          <p>Need help? Contact our support team at support@houspire.com</p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:bg-white {
            background: white !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-0 {
            border: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}