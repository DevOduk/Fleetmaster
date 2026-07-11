import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CompanyInfoCard from "@/components/company-profile/CompanyInfoCard";
import CompanySubscriptionsCard from "@/components/company-profile/CompanySubscriptionsCard";

// 1. Generate dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Your Subscriptions | FleetMaster Admin Dashboard",
        description: "View and manage your company profile information.",
    };
}


export default async function CompanyProfile() {

    return (
        <div>
            <PageBreadcrumb pageTitle="Subscriptions" />

            <div className="space-y-6">
                <CompanySubscriptionsCard />
            </div>
        </div>
    );
}


