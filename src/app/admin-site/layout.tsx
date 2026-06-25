// app/(admin)/layout.tsx
import { BookingProvider } from "@/context/BookingContext";
import { FleetProvider } from "@/context/FleetContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { UserProvider } from "@/context/UserContext";
import { SidebarProvider } from "@/context/SidebarContext";
import React from "react";
import { AdminProvider } from "@/context/AdminContext";

export default function RootAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <UserProvider>
            <AdminProvider>
                <SettingsProvider>
                    <FleetProvider>
                        <BookingProvider>
                            <SidebarProvider>
                                {/* No UI elements here, just raw children */}
                                {children}
                            </SidebarProvider>
                        </BookingProvider>
                    </FleetProvider>
                </SettingsProvider>
            </AdminProvider>
        </UserProvider>
    );
}