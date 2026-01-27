import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    borderBottom: '1px solid #E5E7EB',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    color: '#6B7280',
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoItem: {
    fontSize: 10,
    color: '#374151',
  },
  infoLabel: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
  },
  categoryLetter: {
    width: 20,
    height: 20,
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 8,
    border: '1px solid #E5E7EB',
    borderBottom: 'none',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    border: '1px solid #E5E7EB',
    borderTop: 'none',
    padding: 8,
    fontSize: 10,
  },
  col1: { width: '8%' },
  col2: { width: '42%' },
  col3: { width: '16%' },
  col4: { width: '16%' },
  col5: { width: '9%' },
  col6: { width: '9%' },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 6,
    marginTop: 20,
    color: '#FFFFFF',
  },
  totalText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  footer: {
    textAlign: 'center',
    marginTop: 20,
    paddingTop: 10,
    borderTop: '1px solid #E5E7EB',
    fontSize: 8,
    color: '#6B7280',
  },
});

const BOQPDFDocument = ({ boq }) => {
  const categories = Object.entries(boq.categories || {});
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Budget Breakdown</Text>
          <Text style={styles.subtitle}>{boq.title}</Text>
          
          <View style={styles.infoGrid}>
            <View>
              <Text style={styles.infoLabel}>Client</Text>
              <Text style={styles.infoItem}>{boq.user.name}</Text>
            </View>
            <View>
              <Text style={styles.infoLabel}>Project</Text>
              <Text style={styles.infoItem}>{boq.projectTitle}</Text>
            </View>
            <View>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoItem}>
                {new Date(boq.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Categories and Items */}
        {categories.map(([category, items], categoryIndex) => {
          const categoryLetter = String.fromCharCode(65 + categoryIndex);
          
          return (
            <View key={category} wrap={false}>
              {/* Category Header */}
              <View style={styles.categoryHeader}>
                <View style={styles.categoryLetter}>
                  <Text>{categoryLetter}</Text>
                </View>
                <Text style={styles.categoryName}>{category}</Text>
              </View>

              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={styles.col1}>S.no</Text>
                <Text style={styles.col2}>Description</Text>
                <Text style={styles.col3}>Unit</Text>
                <Text style={styles.col4}>Qty</Text>
                <Text style={styles.col5}>Rate</Text>
                <Text style={styles.col6}>Amount</Text>
              </View>

              {/* Items */}
              {items.map((item, itemIndex) => (
                <View key={item.id} style={styles.tableRow}>
                  <Text style={styles.col1}>
                    {categoryLetter}.{itemIndex + 1}
                  </Text>
                  <Text style={styles.col2}>
                    {item.customName || item.description || 'No description'}
                  </Text>
                  <Text style={styles.col3}>
                    {item.customUnit || item.unit || 'unit'}
                  </Text>
                  <Text style={styles.col4}>
                    {Number(item.quantity || 0).toLocaleString('en-IN')}
                  </Text>
                  <Text style={styles.col5}>
                    ₹{Number(item.rate || 0).toLocaleString('en-IN')}
                  </Text>
                  <Text style={styles.col6}>
                    ₹{Number(item.amount || 0).toLocaleString('en-IN')}
                  </Text>
                </View>
              ))}
            </View>
          );
        })}

        {/* Grand Total */}
        <View style={styles.totalSection}>
          <View>
            <Text style={styles.totalText}>Project Total</Text>
            <Text style={styles.totalText}>Inclusive of all taxes</Text>
          </View>
          <Text style={styles.totalAmount}>
            ₹{boq.totalAmount.toLocaleString('en-IN')}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by Houspire Interior Design</Text>
          <Text>
            For queries: support@houspire.com | BOQ ID: {boq.publicId}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default BOQPDFDocument;