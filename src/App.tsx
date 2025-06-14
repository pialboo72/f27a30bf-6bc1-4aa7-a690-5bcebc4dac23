
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { FileProvider } from "@/contexts/FileContext";
import "./App.css";

import Index from "@/pages/Index";
import Admin from "@/pages/Admin";
import ProgramManagement from "@/pages/ProgramManagement";
import ActivityManagement from "@/pages/ActivityManagement";
import Programs from "@/pages/Programs";
import Activity from "@/pages/Activity";
import ActivityList from "@/pages/ActivityList";
import DocumentTemplate from "@/pages/DocumentTemplate";
import FileManagement from "@/pages/FileManagement";
import Settings from "@/pages/Settings";
import Statistics from "@/pages/Statistics";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import ApplicationTracking from "@/pages/ApplicationTracking";
import UserManagement from "@/pages/UserManagement";
import UnitManagement from "@/pages/UnitManagement";
import SystemLogs from "@/pages/SystemLogs";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FileProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/programs" element={<ProgramManagement />} />
              <Route path="/admin/activities" element={<ActivityManagement />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/activities" element={<ActivityList />} />
              <Route path="/activity/:id?" element={<Activity />} />
              <Route path="/document-template" element={<DocumentTemplate />} />
              <Route path="/files" element={<FileManagement />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/tracking" element={<ApplicationTracking />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/admin/units" element={<UnitManagement />} />
              <Route path="/logs" element={<SystemLogs />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster />
        </Router>
      </FileProvider>
    </QueryClientProvider>
  );
}

export default App;
