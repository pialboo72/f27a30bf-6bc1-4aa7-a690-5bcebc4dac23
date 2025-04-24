
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FileProvider } from "@/contexts/FileContext";
import Index from "./pages/Index";
import ActivityList from "./pages/ActivityList";
import Activity from "./pages/Activity";
import Programs from "./pages/Programs";
import ApplicationTracking from "./pages/ApplicationTracking";
import Statistics from "./pages/Statistics";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProgramManagement from "./pages/ProgramManagement";
import FileManagement from "./pages/FileManagement";
import UserManagement from "./pages/UserManagement";
import SystemLogs from "./pages/SystemLogs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FileProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/activities" element={<ActivityList />} />
            <Route path="/activity/:id" element={<Activity />} />
            <Route path="/activity/new" element={<Activity />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/applications" element={<ApplicationTracking />} />
            <Route path="/applications/new" element={<ApplicationTracking />} />
            <Route path="/files" element={<FileManagement />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/programs" element={<ProgramManagement />} />
            <Route path="/logs" element={<SystemLogs />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FileProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
