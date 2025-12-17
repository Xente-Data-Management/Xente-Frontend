// ============================================
// UTILITY FUNCTIONS
// ============================================

export const exportToCSV = (data, filename) => {
  const headers = ['Name', 'Email', 'Phone', 'Position', 'Department', 'Ambassador', 'Date'];
  const rows = data.map(staff => [
    staff.name,
    staff.email,
    staff.phone,
    staff.position,
    staff.department,
    staff.ambassadorName,
    staff.onboardedDate
  ]);
  
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const filterStaff = (staff, filters) => {
  return staff.filter(s => {
    const matchesSearch = !filters.search || 
      s.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      s.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      s.position.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesAmbassador = filters.ambassadorId === 'all' || 
      s.ambassadorId === filters.ambassadorId;
    
    return matchesSearch && matchesAmbassador;
  });
};