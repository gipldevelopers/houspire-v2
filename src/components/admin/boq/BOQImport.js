// src\components\admin\boq\BOQImport.js
'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, Download, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

const BOQImport = ({ isOpen, onClose, onImportComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [importedData, setImportedData] = useState(null);
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

  const processFile = (file) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Invalid File', {
        description: 'Please upload an Excel file (.xlsx or .xls)'
      });
      return;
    }

    setLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const processedData = processExcelData(jsonData);
        setImportedData(processedData);
        
        toast.success('File Imported', {
          description: `Successfully imported ${processedData.categories.length} categories with ${processedData.totalItems} items`
        });
      } catch (error) {
        console.error('Error processing file:', error);
        toast.error('Import Failed', {
          description: error.message || 'Failed to process the Excel file. Please check the format.'
        });
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      toast.error('File Error', {
        description: 'Failed to read the file'
      });
      setLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const processExcelData = (excelData) => {
    if (excelData.length < 2) {
      throw new Error('Excel file is empty or has insufficient data');
    }

    const headers = excelData[0].map(h => h?.toString().toLowerCase().trim());
    
    const requiredColumns = ['category', 'description', 'unit', 'quantity', 'rate'];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    
    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    const categories = {};
    let totalItems = 0;

    for (let i = 1; i < excelData.length; i++) {
      const row = excelData[i];
      if (!row || row.length === 0) continue;

      const categoryIndex = headers.indexOf('category');
      const descriptionIndex = headers.indexOf('description');
      const unitIndex = headers.indexOf('unit');
      const quantityIndex = headers.indexOf('quantity');
      const rateIndex = headers.indexOf('rate');

      const category = row[categoryIndex]?.toString().trim();
      const description = row[descriptionIndex]?.toString().trim();
      const unit = row[unitIndex]?.toString().trim();
      const quantity = parseFloat(row[quantityIndex]) || 0;
      const rate = parseFloat(row[rateIndex]) || 0;
      const amount = quantity * rate;

      if (!category || !description || !unit) {
        continue;
      }

      if (!categories[category]) {
        categories[category] = [];
      }

      categories[category].push({
        id: `imported_${Date.now()}_${i}`,
        description,
        unit,
        quantity,
        rate,
        amount
      });

      totalItems++;
    }

    if (totalItems === 0) {
      throw new Error('No valid data found in the Excel file');
    }

    return {
      categories,
      totalItems,
      totalCategories: Object.keys(categories).length
    };
  };

  const handleImport = () => {
    if (importedData) {
      onImportComplete(importedData);
      resetImport();
      onClose();
    }
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      ['Category', 'Description', 'Unit', 'Quantity', 'Rate', 'Amount (Auto-calculated)'],
      ['Electrical', 'Wiring and switches', 'lump', 1, 25000, '=D2*E2'],
      ['Electrical', 'Light points installation', 'nos', 15, 800, '=D3*E3'],
      ['Paintwork', 'Wall painting', 'sft', 1200, 25, '=D4*E4'],
      ['Carpentry', 'Wardrobe', 'sft', 80, 450, '=D5*E5'],
      ['Plumbing', 'Pipeline installation', 'lump', 1, 15000, '=D6*E6']
    ];

    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'BOQ Template');
    
    const colWidths = [
      { wch: 15 },
      { wch: 25 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 15 }
    ];
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, 'BOQ_Template.xlsx');
  };

  const resetImport = () => {
    setImportedData(null);
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
            <Upload className="w-5 h-5" />
            Import BOQ from Excel
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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
                Use our template to ensure proper formatting for BOQ import.
              </p>
              <Button onClick={handleDownloadTemplate} variant="outline" size="sm" className="border-green-600 text-green-600 hover:bg-green-50">
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
              
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 text-sm mb-2">Template Guidelines:</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• <strong>Category:</strong> Work category (Electrical, Paintwork, etc.)</li>
                  <li>• <strong>Description:</strong> Item description</li>
                  <li>• <strong>Unit:</strong> sft, nos, lump, etc.</li>
                  <li>• <strong>Quantity:</strong> Number of units</li>
                  <li>• <strong>Rate:</strong> Price per unit (₹)</li>
                  <li>• <strong>Amount:</strong> Auto-calculated</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4" />
                Upload Your Excel File
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!importedData ? (
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
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-green-900 text-sm">Import Successful!</h4>
                        <div className="flex items-center gap-4 mt-1 text-xs text-green-700">
                          <span>{importedData.totalCategories} categories</span>
                          <span>•</span>
                          <span>{importedData.totalItems} items</span>
                        </div>
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

                  {/* Categories Preview */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground text-sm">Imported Categories:</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(importedData.categories).map(category => (
                        <Badge key={category} variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                          {category} ({importedData.categories[category].length})
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button variant="outline" onClick={handleClose} size="sm">
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={!importedData || loading}
              className="bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Import Data
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BOQImport;