// ============================================
// CONSTANTS
// ============================================
export const ROLES = {
  ADMIN: 'admin',
  AMBASSADOR: 'ambassador'
};

export const DEPARTMENTS = [
  'Sales', 
  'Marketing', 
  'Operations', 
  'Customer Service', 
  'IT', 
  'Finance', 
  'HR'
];

export const mockData = {
  users: {
    admin: { 
      id: 'admin-1', 
      name: 'Admin User', 
      email: 'admin@example.com', 
      role: ROLES.ADMIN 
    },
    ambassadors: [
      { id: 'amb-1', name: 'Oscar Okello', email: 'oscar@example.com', region: 'Northern' },
      { id: 'amb-2', name: 'Sarah Auma', email: 'sarah@example.com', region: 'Central' },
      { id: 'amb-3', name: 'John Mwine', email: 'john@example.com', region: 'Western' },
      { id: 'amb-4', name: 'Grace Namara', email: 'grace@example.com', region: 'Eastern' }
    ]
  },
  staff: [
    { id: 1, name: 'James Okot', email: 'james@example.com', phone: '+256 700 111111', position: 'Sales Rep', department: 'Sales', ambassadorId: 'amb-1', ambassadorName: 'Oscar Okello', onboardedDate: '2024-11-15' },
    { id: 2, name: 'Mary Akello', email: 'mary@example.com', phone: '+256 700 222222', position: 'Marketing Officer', department: 'Marketing', ambassadorId: 'amb-1', ambassadorName: 'Oscar Okello', onboardedDate: '2024-11-20' },
    { id: 3, name: 'Peter Opio', email: 'peter@example.com', phone: '+256 700 333333', position: 'Customer Service', department: 'Customer Service', ambassadorId: 'amb-2', ambassadorName: 'Sarah Auma', onboardedDate: '2024-12-01' },
    { id: 4, name: 'Jane Namukasa', email: 'jane@example.com', phone: '+256 700 444444', position: 'Operations Manager', department: 'Operations', ambassadorId: 'amb-2', ambassadorName: 'Sarah Auma', onboardedDate: '2024-12-05' },
    { id: 5, name: 'David Mugisha', email: 'david@example.com', phone: '+256 700 555555', position: 'IT Support', department: 'IT', ambassadorId: 'amb-3', ambassadorName: 'John Mwine', onboardedDate: '2024-12-10' },
    { id: 6, name: 'Ruth Nabirye', email: 'ruth@example.com', phone: '+256 700 666666', position: 'Finance Officer', department: 'Finance', ambassadorId: 'amb-4', ambassadorName: 'Grace Namara', onboardedDate: '2024-12-12' },
    { id: 7, name: 'Samuel Owino', email: 'samuel@example.com', phone: '+256 700 777777', position: 'Sales Rep', department: 'Sales', ambassadorId: 'amb-1', ambassadorName: 'Oscar Okello', onboardedDate: '2024-12-14' },
    { id: 8, name: 'Betty Nambi', email: 'betty@example.com', phone: '+256 700 888888', position: 'HR Officer', department: 'HR', ambassadorId: 'amb-2', ambassadorName: 'Sarah Auma', onboardedDate: '2024-12-15' }
  ]
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Filter staff based on search query
export const filterStaff = (staff, filters) => {
  const searchLower = filters.search.toLowerCase();
  return staff.filter(s => 
    s.name.toLowerCase().includes(searchLower) ||
    s.email.toLowerCase().includes(searchLower) ||
    s.position.toLowerCase().includes(searchLower) ||
    s.department.toLowerCase().includes(searchLower)
  );
};

// Export data to CSV
export const exportToCSV = (data, filename) => {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};

// Calculate growth rate
export const calculateGrowthRate = (currentCount, previousCount) => {
  if (previousCount === 0) return 0;
  return (((currentCount - previousCount) / previousCount) * 100).toFixed(1);
};

// Get monthly statistics
export const getMonthlyStats = (staff) => {
  const thisMonth = new Date().getMonth();
  const lastMonth = thisMonth - 1;
  
  const thisMonthCount = staff.filter(s => 
    new Date(s.onboardedDate).getMonth() === thisMonth
  ).length;
  
  const lastMonthCount = staff.filter(s => 
    new Date(s.onboardedDate).getMonth() === lastMonth
  ).length;
  
  const growthRate = calculateGrowthRate(thisMonthCount, lastMonthCount);
  
  return { thisMonthCount, lastMonthCount, growthRate };
};