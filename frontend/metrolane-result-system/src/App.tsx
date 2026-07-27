import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { AppLayout } from "@/components/layout/AppLayout"
import { CalculatorPage } from "@/features/calculator/pages/CalculatorPage"
import { AuthLayout } from "@/features/auth/components/AuthLayout"
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage"
import { LoginPage } from "@/features/auth/pages/LoginPage"
import { RegisterPage } from "@/features/auth/pages/RegisterPage"
import { ResetPasswordPage } from "@/features/auth/pages/ResetPasswordPage"
import { ResetSuccessPage } from "@/features/auth/pages/ResetSuccessPage"
import { PlaceholderPage } from "@/pages/PlaceholderPage"

function App() {
  return (
    <BrowserRouter>
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

        <Route element={<AppLayout />}>
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route
            path="/student-records"
            element={
              <PlaceholderPage
                title="Student Records"
                description="This section will display student records once the backend is connected."
              />
            }
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
          <Route path="logout" element={<Navigate to="/login" replace />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
