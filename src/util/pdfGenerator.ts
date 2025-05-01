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
    // Before generating PDF, apply print-specific styling for better layout
    const originalStyle = element.getAttribute('style') || '';
    element.setAttribute('style', `${originalStyle}; background-color: white; padding: 20px; max-width: 800px;`);
    
    // Add a temporary class to help with PDF generation
    element.classList.add('pdf-optimized');

    // Create canvas from the element with improved settings
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200, // Fixed width for consistent rendering
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          // Apply specific styling to the clone for better PDF output
          clonedElement.style.padding = '30px';
          
          // Fix confidence badge alignment
          const confidenceBadge = clonedElement.querySelector('.confidence-badge');
          if (confidenceBadge) {
            (confidenceBadge as HTMLElement).style.display = 'inline-block';
            (confidenceBadge as HTMLElement).style.margin = '0 auto 20px auto';
          }
          
          // Improve macro circles alignment
          const macroCircles = clonedElement.querySelectorAll('.macro-circle-container');
          macroCircles.forEach(circle => {
            (circle as HTMLElement).style.display = 'flex';
            (circle as HTMLElement).style.flexDirection = 'column';
            (circle as HTMLElement).style.alignItems = 'center';
          });
          
          // Fix food item cards to avoid breaking across pages
          const foodCards = clonedElement.querySelectorAll('.food-item-card');
          foodCards.forEach(card => {
            (card as HTMLElement).style.pageBreakInside = 'avoid';
            (card as HTMLElement).style.marginBottom = '15px';
          });
        }
      }
    });
    
    // Remove the temporary class
    element.classList.remove('pdf-optimized');
    
    // Restore original styling
    element.setAttribute('style', originalStyle);
    
    // Calculate dimensions for PDF (A4 format)
    const imgWidth = 190; // A4 width in mm minus margins
    const pageHeight = 277; // A4 height in mm minus margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Create PDF with appropriate dimensions
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    let heightLeft = imgHeight;
    let position = 0;
    let pageCount = 0;
    
    // Calculate how much content can fit on each page
    while (heightLeft > 0) {
      // Add a new page for all pages after the first one
      if (pageCount > 0) {
        pdf.addPage();
      }
      
      // Calculate positions to properly split content between pages
      const heightToDraw = Math.min(pageHeight, heightLeft);
      const sourceY = pageCount * pageHeight * (canvas.width / imgWidth);
      
      // Fix: Use the correct approach for sourceY by using clip parameters
      pdf.addImage({
        imageData: canvas.toDataURL('image/png', 1.0),
        format: 'PNG',
        x: 10, // left margin
        y: 10, // top margin
        width: imgWidth,
        height: heightToDraw,
        compression: 'FAST',
        rotation: 0
      });
      
      heightLeft -= pageHeight;
      pageCount++;
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
  if (window.navigator && typeof (window.navigator as any).msSaveBlob === 'function') {
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
