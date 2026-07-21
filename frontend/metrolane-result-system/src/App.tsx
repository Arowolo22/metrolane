import { BrowserRouter, Route, Routes } from "react-router-dom"

import { AppLayout } from "@/components/layout/AppLayout"
import { CalculatorPage } from "@/features/calculator/pages/CalculatorPage"
import { PlaceholderPage } from "@/pages/PlaceholderPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<CalculatorPage />} />
          <Route
            path="student-records"
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
          <Route
            path="logout"
            element={
              <PlaceholderPage
                title="Logout"
                description="Authentication will be integrated when the backend is ready."
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
