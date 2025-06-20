
import React, { useState } from "react";
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AdminSidebar } from "./AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex flex-col flex-1">
          <header className="bg-white border-b p-4 flex justify-between items-center">
            <div className="flex items-center">
              <SidebarTrigger />
              <h1 className="font-semibold text-lg ml-4">MediDelivery Admin</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Settings</Button>
              <Button variant="outline" size="sm">Profile</Button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-slate-50">
            {children}
          </main>
          <footer className="bg-white border-t p-4 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MediDelivery Admin. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};
