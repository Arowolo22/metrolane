import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { AppLayout } from "@/components/layout/AppLayout"
import { CalculatorPage } from "@/features/calculator/pages/CalculatorPage"
import { AuthLayout } from "@/features/auth/components/AuthLayout"
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute"
import { AuthProvider } from "@/features/auth/context/AuthContext"
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage"
import { LoginPage } from "@/features/auth/pages/LoginPage"
import { RegisterPage } from "@/features/auth/pages/RegisterPage"
import { ResetPasswordPage } from "@/features/auth/pages/ResetPasswordPage"
import { ResetSuccessPage } from "@/features/auth/pages/ResetSuccessPage"
import { StudentRecordDetailPage } from "@/features/student-records/pages/StudentRecordDetailPage"
import { StudentRecordsPage } from "@/features/student-records/pages/StudentRecordsPage"
import { PlaceholderPage } from "@/pages/PlaceholderPage"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/forgot-password/success"
              element={<ResetSuccessPage />}
            />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/student-records" element={<StudentRecordsPage />} />
              <Route
                path="/student-records/:id"
                element={<StudentRecordDetailPage />}
              />
              <Route
                path="settings"
                element={
                  <PlaceholderPage
                    title="Settings"
                    description="System settings will be available here in a future release."
                  />
                }
              />
              <Route
                path="support"
                element={
                  <PlaceholderPage
                    title="Support"
                    description="Contact support resources will be available here."
                  />
                }
              />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
