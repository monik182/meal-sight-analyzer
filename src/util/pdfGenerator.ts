
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { FoodAnalysisResult, FoodItem } from '@/types';

export const generatePDF = async (elementId: string, fileName: string = 'meal-analysis.pdf'): Promise<void> => {
  // Get the HTML element to convert
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID ${elementId} not found`);
    return;
  }

  try {
    // Before generating PDF, apply print-specific styling to ensure proper layout
    const originalStyle = element.getAttribute('style') || '';
    element.setAttribute('style', `${originalStyle}; background-color: white; padding: 20px; max-width: 800px;`);

    // Create canvas from the element with higher quality settings
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200, // Fixed width to ensure consistent rendering
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          // Improve spacing in the cloned element
          clonedElement.style.padding = '20px';
          
          // Ensure text is properly aligned
          const textElements = clonedElement.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
          textElements.forEach((el) => {
            (el as HTMLElement).style.margin = '8px 0';
          });
        }
      }
    });
    
    // Restore original styling
    element.setAttribute('style', originalStyle);
    
    // Calculate dimensions for PDF (A4 format)
    const imgWidth = 190; // A4 width in mm minus margins
    const pageHeight = 277; // A4 height in mm minus margins
    const margin = 10; // 10mm margin
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Create new PDF with margins
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Add image to PDF with margins
    let heightLeft = imgHeight;
    let position = 0;
    
    // Add first page (with top margin)
    pdf.addImage(
      canvas.toDataURL('image/png'), 
      'PNG', 
      margin, // left margin
      margin, // top margin
      imgWidth, 
      imgHeight
    );
    
    heightLeft -= pageHeight;
    
    // Add additional pages if needed
    while (heightLeft >= 0) {
      // Calculate position to avoid cutting content
      position = heightLeft - imgHeight + margin; // Add margin offset
      
      pdf.addPage();
      pdf.addImage(
        canvas.toDataURL('image/png'), 
        'PNG', 
        margin, // left margin 
        position, 
        imgWidth, 
        imgHeight
      );
      
      heightLeft -= (pageHeight - (2 * margin)); // Account for margins in pagination
    }
    
    // Save PDF
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

export const generateCSV = (result: FoodAnalysisResult): string => {
  // Create CSV header row
  let csv = 'Food Item,Calories (kcal),Protein (g),Fat (g),Carbs (g),Sugar (g)\n';
  
  // Add data for each food item
  result.foodItems.forEach(item => {
    const { name, macros } = item;
    // Format each value and escape commas in the food name
    const escapedName = name.includes(',') ? `"${name}"` : name;
    const row = [
      escapedName,
      Math.round(macros.calories),
      (Math.round(macros.protein * 10) / 10).toFixed(1),
      (Math.round(macros.fat * 10) / 10).toFixed(1),
      (Math.round(macros.carbs * 10) / 10).toFixed(1),
      (Math.round(macros.sugar * 10) / 10).toFixed(1)
    ].join(',');
    
    csv += row + '\n';
  });
  
  // Add total macros as the final row
  const totalMacros = result.totalMacros;
  csv += `Total,${Math.round(totalMacros.calories)},${(Math.round(totalMacros.protein * 10) / 10).toFixed(1)},${(Math.round(totalMacros.fat * 10) / 10).toFixed(1)},${(Math.round(totalMacros.carbs * 10) / 10).toFixed(1)},${(Math.round(totalMacros.sugar * 10) / 10).toFixed(1)}\n`;

  return csv;
};

export const downloadCSV = (csvContent: string, fileName: string = 'meal-analysis.csv'): void => {
  // Create a Blob containing the CSV data
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a download link and trigger the download
  const link = document.createElement('a');
  
  // Check if the browser supports the download attribute
  // Use proper type checking for the msSaveBlob method
  if (window.navigator && 'msSaveBlob' in window.navigator) {
    // For IE and legacy Edge
    (window.navigator as any).msSaveBlob(blob, fileName);
    return;
  }
  
  // For other browsers
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute('download', fileName);
  
  // Append to the document temporarily to trigger the download
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
