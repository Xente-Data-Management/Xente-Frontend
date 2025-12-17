import React from 'react';
import { useAuth, useStaffManagement } from './hooks/hooks';
import { ROLES } from './constants';
import { LoginPage } from './Pages/LoginPage';
import { AdminDashboard } from './Pages/AdminDashboard';
import { AmbassadorDashboard } from './Pages/AmbassadorDashboard';

// ============================================
// MAIN APP COMPONENT
// ============================================
function App() {
  const { currentUser, login, logout } = useAuth();
  const staffManagement = useStaffManagement(currentUser);

  if (!currentUser) {
    return <LoginPage onLogin={login} />;
  }

  if (currentUser.role === ROLES.ADMIN) {
    return <AdminDashboard currentUser={currentUser} staffManagement={staffManagement} onLogout={logout} />;
  }

  return <AmbassadorDashboard currentUser={currentUser} staffManagement={staffManagement} onLogout={logout} />;
}

export default App;