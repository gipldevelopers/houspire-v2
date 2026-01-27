import BOQPDFDocument from '@/components/admin/boq/BOQPDFDocument';
import { pdf } from '@react-pdf/renderer';


export const downloadBOQAsPDF = async (boqData, filename = 'BOQ.pdf') => {
  try {
    const blob = await pdf(<BOQPDFDocument boq={boqData} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};