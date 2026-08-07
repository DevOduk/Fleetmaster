// app/(admin)/layout.tsx
import { BookingProvider } from "@/context/BookingContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { UserProvider } from "@/context/UserContext";
import { SidebarProvider } from "@/context/SidebarContext";
import React from "react";
import { AdminFleetProvider } from "@/context/AdminFleetContext";
import { AdminBookingProvider } from "@/context/AdminBookingContext";
import { headers } from "next/headers";

export default async function RootAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const headerList = await headers();
    const tenantDataRaw = headerList.get('x-tenant-data');

    // 1. Resolve tenant details instantly on the server
    const tenantData = JSON.parse(tenantDataRaw);

    return (
        <UserProvider initialUser={tenantData}>
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