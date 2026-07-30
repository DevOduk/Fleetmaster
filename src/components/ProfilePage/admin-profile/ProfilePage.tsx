"use client"
import UserInfoCard from "@/components/ProfilePage/client-profile/UserInfoCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useUser } from '@/context/UserContext';
import UserMetaCard from "./UserMetaCard";
import UserAddressCard from "./UserAddressCard";
import UserDocumentsCard from "./UserDocumentsCard";


function ProfilePage() {
    const { profile, loading } = useUser();

    if (loading) {
        return <div className="container min-h-[80vh] mx-auto p-5 text-gray-400">Loading profile ...</div>
    } else if (!profile) {
        window.location.href = '/signin';
        return <div className="container min-h-[80vh] mx-auto p-5 text-gray-400">Redirecting to signin ...</div>
    }

    return (
        <div>
            <div className="container m-auto min-h-screen">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">

                    <PageBreadcrumb pageTitle="View Profile" />

                    <div className="space-y-6">
                        <UserMetaCard />
                        <UserInfoCard />
                        <UserAddressCard />
                        <UserDocumentsCard />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
