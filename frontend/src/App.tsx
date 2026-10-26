import Dashboard from "./components/dashboard";
import { DashboardProvider } from "./context";

export default function App() {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  );
}
