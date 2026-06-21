/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/modules/Students';
import Attendance from './pages/modules/Attendance';
import Examination from './pages/modules/Examination';
import Timetable from './pages/modules/Timetable';
import Fees from './pages/modules/Fees';
import Sports from './pages/modules/Sports';
import Library from './pages/modules/Library';
import Hostel from './pages/modules/Hostel';
import Notifications from './pages/modules/Notifications';
import Reports from './pages/modules/Reports';
import AcademicCalendar from './pages/modules/AcademicCalendar';
import Profile from './pages/modules/Profile';
import Certificates from './pages/modules/Certificates';
import Placement from './pages/modules/Placement';
import Unauthorized from './pages/Unauthorized';
import { useAuth } from './contexts/AuthContext';
import { Role } from './types';

interface GuardProps {
  roles: Role[];
  element: React.ReactElement;
}

function RoleGuard({ roles, element }: GuardProps) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return element;
}

export default function App() {
  const allRoles = Object.values(Role);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={
            <RoleGuard 
              roles={[Role.ADMIN, Role.PRINCIPAL, Role.HOD, Role.FACULTY]} 
              element={<Students />} 
            />
          } />
          <Route path="attendance" element={
            <RoleGuard 
              roles={[Role.ADMIN, Role.HOD, Role.FACULTY, Role.STUDENT, Role.PARENT]} 
              element={<Attendance />} 
            />
          } />
          <Route path="marks" element={
            <RoleGuard 
              roles={allRoles} 
              element={<Examination />} 
            />
          } />
          <Route path="examination" element={
            <RoleGuard 
              roles={allRoles} 
              element={<Examination />} 
            />
          } />
          <Route path="timetable" element={
            <RoleGuard 
              roles={allRoles} 
              element={<Timetable />} 
            />
          } />
          <Route path="fees" element={
            <RoleGuard 
              roles={[Role.ADMIN, Role.ACCOUNTANT, Role.STUDENT, Role.PARENT]} 
              element={<Fees />} 
            />
          } />
          <Route path="sports" element={
            <RoleGuard 
              roles={[Role.ADMIN, Role.SPORTS_COORDINATOR, Role.STUDENT]} 
              element={<Sports />} 
            />
          } />
          <Route path="library" element={
            <RoleGuard 
              roles={[Role.ADMIN, Role.LIBRARIAN, Role.STUDENT, Role.FACULTY]} 
              element={<Library />} 
            />
          } />
          <Route path="hostel" element={
            <RoleGuard 
              roles={[Role.ADMIN, Role.HOSTEL_WARDEN, Role.STUDENT]} 
              element={<Hostel />} 
            />
          } />
          <Route path="notifications" element={
            <RoleGuard 
              roles={allRoles} 
              element={<Notifications />} 
            />
          } />
          <Route path="reports" element={
            <RoleGuard 
              roles={[Role.ADMIN, Role.PRINCIPAL, Role.HOD]} 
              element={<Reports />} 
            />
          } />
          <Route path="academic-calendar" element={
            <RoleGuard 
              roles={allRoles} 
              element={<AcademicCalendar />} 
            />
          } />
          <Route path="profile" element={
            <RoleGuard 
              roles={allRoles} 
              element={<Profile />} 
            />
          } />
          <Route path="certificates" element={
            <RoleGuard 
              roles={allRoles} 
              element={<Certificates />} 
            />
          } />
          <Route path="placement" element={
            <RoleGuard 
              roles={allRoles} 
              element={<Placement />} 
            />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
