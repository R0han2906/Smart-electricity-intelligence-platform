import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingSection } from "./sections/Landing/LandingSection";
import CreateUserSection from "./sections/CreateUser/CreateUserSection";
import SelectUserSection from "./sections/SelectUser/SelectUserSection";
import AddConsumptionSection from "./sections/AddConsumption/AddConsumptionSection";
import DashboardSection from "./sections/Dashboard/DashboardSection";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingSection />} />
        <Route path="/create-user" element={<CreateUserSection />} />
        <Route path="/select-user" element={<SelectUserSection />} />
        <Route path="/add-consumption" element={<AddConsumptionSection />} />
        <Route path="/dashboard" element={<DashboardSection />} />
      </Routes>
    </BrowserRouter>
  );
}
