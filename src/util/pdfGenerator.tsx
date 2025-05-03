import { FoodAnalysisResult } from '@/types';
import { pdf, Document, Page, View, Text, StyleSheet, PDFDownloadLink, Image, Font } from '@react-pdf/renderer';

// Register fonts (you should add these to your project)
// Font.register({
//   family: 'Roboto',
//   fonts: [
//     { src: '/fonts/Roboto-Regular.ttf' },
//     { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' },
//     { src: '/fonts/Roboto-Light.ttf', fontWeight: 'light' },
//   ],
// });

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    // fontFamily: 'Roboto',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  confidenceBadge: {
    padding: '4px 12px',
    borderRadius: 15,
    fontSize: 12,
    marginBottom: 20,
    alignSelf: 'center',
  },
  confidenceHigh: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  confidenceMedium: {
    backgroundColor: '#fef9c3',
    color: '#854d0e',
  },
  confidenceLow: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    border: '1px solid #e5e7eb',
  },
  macroSummary: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  calories: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  caloriesUnit: {
    fontSize: 12,
    color: '#6b7280',
  },
  macroCirclesContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  macroDetailGrid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroDetailItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  macroLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  foodItemCard: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 5,
    border: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
  },
  foodItemHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  foodItemName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  foodItemPortion: {
    fontSize: 10,
    color: '#6b7280',
  },
  foodItemCalories: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  foodItemMacros: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  disclaimer: {
    fontSize: 10,
    marginBottom: 10,
    color: '#b45309',
    padding: 10,
    backgroundColor: '#fef3c7',
    borderRadius: 5,
  },
  recommendationItem: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'flex-start',
  },
  recommendationNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    fontSize: 10,
    textAlign: 'center',
    marginRight: 5,
    padding: 5,
  },
  recommendationText: {
    fontSize: 11,
    flex: 1,
  },
});

// Component for the PDF document
const MealAnalysisPDF = ({ result, recommendations = [] }: { result: FoodAnalysisResult, recommendations?: string[] }) => {
  // Helper function to get confidence badge style
  const getConfidenceStyle = (level: string) => {
    switch (level) {
      case 'High': return { ...styles.confidenceBadge, ...styles.confidenceHigh };
      case 'Medium': return { ...styles.confidenceBadge, ...styles.confidenceMedium };
      case 'Low': return { ...styles.confidenceBadge, ...styles.confidenceLow };
      default: return styles.confidenceBadge;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Meal Analysis</Text>
          <Text style={getConfidenceStyle(result.confidenceLevel)}>
            {result.confidenceLevel} Confidence
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Total Macronutrients</Text>
          <View style={styles.card}>
            <View style={styles.macroSummary}>
              <Text>
                <Text style={styles.calories}>{Math.round(result.totalMacros.calories)}</Text>
                <Text style={styles.caloriesUnit}> kcal</Text>
              </Text>
            </View>

            <View style={styles.macroDetailGrid}>
              <View style={styles.macroDetailItem}>
                <Text style={styles.macroValue}>{Math.round(result.totalMacros.protein * 10) / 10}g</Text>
                <Text style={styles.macroLabel}>Protein</Text>
              </View>
              <View style={styles.macroDetailItem}>
                <Text style={styles.macroValue}>{Math.round(result.totalMacros.fat * 10) / 10}g</Text>
                <Text style={styles.macroLabel}>Fat</Text>
              </View>
              <View style={styles.macroDetailItem}>
                <Text style={styles.macroValue}>{Math.round(result.totalMacros.carbs * 10) / 10}g</Text>
                <Text style={styles.macroLabel}>Carbs</Text>
              </View>
              <View style={styles.macroDetailItem}>
                <Text style={styles.macroValue}>{Math.round(result.totalMacros.sugar * 10) / 10}g</Text>
                <Text style={styles.macroLabel}>Sugar</Text>
              </View>
              <View style={styles.macroDetailItem}>
                <Text style={styles.macroValue}>{Math.round(result.totalMacros.fiber * 10) / 10}g</Text>
                <Text style={styles.macroLabel}>Fiber</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Food Items</Text>
          {result.foodItems.map((item, index) => (
            <View key={`food-item-${index}`} style={styles.foodItemCard}>
              <View style={styles.foodItemHeader}>
                <View>
                  <Text style={styles.foodItemName}>{item.name}</Text>
                  <Text style={styles.foodItemPortion}>
                    {item.portion.humanReadable} | {item.portion.grams}g
                  </Text>
                </View>
                <Text style={styles.foodItemCalories}>{Math.round(item.macros.calories)} kcal</Text>
              </View>
              <View style={styles.foodItemMacros}>
                <View style={styles.macroDetailItem}>
                  <Text style={styles.macroValue}>{Math.round(item.macros.protein * 10) / 10}g</Text>
                  <Text style={styles.macroLabel}>Protein</Text>
                </View>
                <View style={styles.macroDetailItem}>
                  <Text style={styles.macroValue}>{Math.round(item.macros.fat * 10) / 10}g</Text>
                  <Text style={styles.macroLabel}>Fat</Text>
                </View>
                <View style={styles.macroDetailItem}>
                  <Text style={styles.macroValue}>{Math.round(item.macros.carbs * 10) / 10}g</Text>
                  <Text style={styles.macroLabel}>Carbs</Text>
                </View>
                <View style={styles.macroDetailItem}>
                  <Text style={styles.macroValue}>{Math.round(item.macros.sugar * 10) / 10}g</Text>
                  <Text style={styles.macroLabel}>Sugar</Text>
                </View>
                <View style={styles.macroDetailItem}>
                  <Text style={styles.macroValue}>{Math.round(item.macros.fiber * 10) / 10}g</Text>
                  <Text style={styles.macroLabel}>Fiber</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {recommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.recommendationsTitle}>Dietary Recommendations</Text>
            <Text style={styles.disclaimer}>
              These recommendations are for general guidance only and are not professional medical or nutritional advice.
              Please consult with a registered dietitian or healthcare provider for personalized advice.
            </Text>
            {recommendations.map((recommendation, index) => (
              <View key={`recommendation-${index}`} style={styles.recommendationItem}>
                <Text style={styles.recommendationNumber}>{index + 1}</Text>
                <Text style={styles.recommendationText}>{recommendation}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

// Generate and download PDF
export const generatePDF = async (elementId: string, fileName: string = 'meal-analysis.pdf', result: FoodAnalysisResult, recommendations: string[] = []): Promise<void> => {
  // We don't need the elementId anymore as we're generating the PDF programmatically
  // But we keep the parameter for backward compatibility

  // Get the data from the current page
  // This assumes the data is available in a global state or context
  // You'll need to modify this to get your actual data
  const analysisContentElement = document.getElementById(elementId);
  if (!analysisContentElement) {
    console.error(`Element with ID ${elementId} not found`);
    return;
  }

  // Extract data from the DOM (this is a simplification - you should use your state management)
  // const result = window.__MEAL_ANALYSIS_DATA__ || null;
  // const recommendations = window.__RECOMMENDATIONS_DATA__ || [];

  if (!result) {
    console.error('Could not find meal analysis data');
    return;
  }

  try {
    // Create the PDF document
    const pdfDoc = <MealAnalysisPDF result={result} recommendations={recommendations} />;

    // Generate PDF blob
    const blob = await pdf(pdfDoc).toBlob();

    // Create a download link and trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    // Append to the document temporarily to trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// React component to render a download link for the PDF
export const PDFDownloadButton = ({ result, recommendations = [], fileName = 'meal-analysis.pdf' }) => {
  return (
    <PDFDownloadLink
      document={<MealAnalysisPDF result={result} recommendations={recommendations} />}
      fileName={fileName}
      style={{ textDecoration: 'none' }}
    >
      {({ loading }) => loading ? 'Preparing PDF...' : 'Download PDF'}
    </PDFDownloadLink>
  );
};

export const generateCSV = (result: FoodAnalysisResult): string => {
  // Create CSV header row
  let csv = 'Food Item,Calories (kcal),Protein (g),Fat (g),Carbs (g),Sugar (g),Fiber (g)\n';

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
      (Math.round(macros.sugar * 10) / 10).toFixed(1),
      (Math.round(macros.fiber * 10) / 10).toFixed(1),
    ].join(',');

    csv += row + '\n';
  });

  // Add total macros as the final row
  const totalMacros = result.totalMacros;
  csv += `Total,${Math.round(totalMacros.calories)},${(Math.round(totalMacros.protein * 10) / 10).toFixed(1)},${(Math.round(totalMacros.fat * 10) / 10).toFixed(1)},${(Math.round(totalMacros.carbs * 10) / 10).toFixed(1)},${(Math.round(totalMacros.sugar * 10) / 10).toFixed(1)},${(Math.round(totalMacros.fiber * 10) / 10).toFixed(1)}\n`;

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
