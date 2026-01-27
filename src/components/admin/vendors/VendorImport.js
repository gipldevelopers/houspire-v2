// src/components/admin/vendors/VendorImport.js
'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, Download, X, CheckCircle2, AlertCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { vendorService } from '@/services/vendor.service';

const VendorImport = ({ isOpen, onClose, onImportComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = async (file) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Invalid File', {
        description: 'Please upload an Excel file (.xlsx or .xls)'
      });
      return;
    }

    setLoading(true);
    try {
      const result = await vendorService.importVendors(file);
      
      if (result.success) {
        setImportResults(result.data);
        toast.success('Import Completed', {
          description: `Processed ${result.data.total} vendors: ${result.data.successful} successful, ${result.data.failed} failed`
        });
      } else {
        toast.error('Import Failed', {
          description: result.message
        });
      }
    } catch (error) {
      toast.error('Import Failed', {
        description: error.message || 'Failed to process the file'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = () => {
    if (importResults && onImportComplete) {
      onImportComplete(importResults);
    }
    resetImport();
    onClose();
  };

  const handleDownloadTemplate = async () => {
    try {
      const result = await vendorService.downloadTemplate();
      if (result.success) {
        toast.success('Template Downloaded', {
          description: 'Vendor import template downloaded successfully'
        });
      } else {
        toast.error('Download Failed', {
          description: result.message
        });
      }
    } catch (error) {
      toast.error('Download Failed', {
        description: error.message || 'Failed to download template'
      });
    }
  };

  const resetImport = () => {
    setImportResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetImport();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Import Vendors from Excel
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">

          {/* File Upload */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4" />
                Upload Your Excel File
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!importResults ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                    isDragging 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-border hover:border-blue-400 hover:bg-blue-50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <div className="space-y-3">
                    <div className="mx-auto w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Upload className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {loading ? 'Processing...' : 'Upload Excel File'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Drag & drop or click to upload .xlsx or .xls file
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Import Summary */}
                  <div className={`border rounded-lg p-4 ${
                    importResults.failed === 0 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-yellow-50 border-yellow-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      {importResults.failed === 0 ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h4 className={`font-semibold text-sm ${
                          importResults.failed === 0 ? 'text-green-900' : 'text-yellow-900'
                        }`}>
                          Import {importResults.failed === 0 ? 'Successful' : 'Completed with Issues'}
                        </h4>
                        <div className="flex items-center gap-4 mt-1 text-xs">
                          <span className={importResults.failed === 0 ? 'text-green-700' : 'text-yellow-700'}>
                            Total: {importResults.total} | 
                            Successful: {importResults.successful} | 
                            Failed: {importResults.failed}
                          </span>
                        </div>
                        {importResults.successful > 0 && (
                          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                            <p className="text-xs text-green-700">
                              All {importResults.successful} vendors have been set as Active and Verified
                            </p>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetImport}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Error Details */}
                  {importResults.errors.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground text-sm">Import Errors:</h4>
                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {importResults.errors.map((error, index) => (
                          <div key={index} className="bg-red-50 border border-red-200 rounded p-2">
                            <p className="text-xs text-red-700">
                              <strong>Row {error.row}:</strong> {error.vendor} - {error.error}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Download Template */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Download className="w-4 h-4" />
                Download Excel Template
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Use our template to ensure proper formatting for vendor import.
              </p>
              <Button 
                onClick={handleDownloadTemplate} 
                variant="outline" 
                size="sm" 
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button variant="outline" onClick={handleClose} size="sm">
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={!importResults || loading}
              className="bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Complete Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VendorImport;