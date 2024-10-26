import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage/HomePage";
import BabyPage from "./pages/BabyPage/BabyPage";
import ArrangementPage from "./pages/ArrangementPage/ArrangementPage";
import { ToastContainer } from "react-toastify";
import ServicePackagePage from "./pages/ServicePackagePage/ServicePackagePage";
import { FilterProvider } from "./context/Filter/FilterProvider";
import ReportPage from "./pages/ReportPage/ReportPage";

function App() {
  return (
    <>
      <FilterProvider>
        <ToastContainer />
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="/baby" element={<BabyPage />} />
              <Route path="/service-package" element={<ServicePackagePage />} />
              <Route path="/arrangement" element={<ArrangementPage />} />
              <Route path="/report" element={<ReportPage />} />
            </Route>
          </Routes>
        </Router>
      </FilterProvider>
    </>
  );
}

export default App;
