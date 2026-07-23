// app/(admin)/layout.tsx
import { BookingProvider } from "@/context/BookingContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { UserProvider } from "@/context/UserContext";
import { SidebarProvider } from "@/context/SidebarContext";
import React from "react";
import { AdminFleetProvider } from "@/context/AdminFleetContext";
import { AdminBookingProvider } from "@/context/AdminBookingContext";

export default function RootAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <UserProvider>
                <SettingsProvider>
                    <AdminFleetProvider>
                        <AdminBookingProvider>
                            <SidebarProvider>
                                {/* No UI elements here, just raw children */}
                                {children}
                            </SidebarProvider>
                        </AdminBookingProvider>
                    </AdminFleetProvider>
                </SettingsProvider>
        </UserProvider>
    );
}