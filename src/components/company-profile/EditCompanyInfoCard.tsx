"use client";

import { fetchTenantDetails, updateTenantDetails } from "@/app/actions/tenant";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined"
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Button from "../ui/button/Button";
import { useToast } from "@/context/ToastContext";
import { CircularProgress } from "@mui/material";
import UpdateYardsModal from "../yards/UpdateYardsModal";
import { applyThemeVariables } from "../ThemeInitializer";
import { createClient } from "@/utils/supabase/client";
import Checkbox from "../form/input/Checkbox";
import { allCountriesDB, languages, timezones } from "@/data/globalExports";
import Select from "../form/Select";

export const allTimezones = () => {
  return timezones.flatMap(t =>
    t.regions.map(region => ({
      value: `(${t.timezone.replace('GMT', 'UTC')}) ${region}`,
      label: `(${t.timezone.replace('GMT', 'UTC')}) ${region}`
    }))
  );
};

export default function EditCompanyInfoCard() {
  const { profile } = useUser();
  const [company, setCompany] = useState<any>(null);
  const [loadingCompany, setLoadingCompany] = useState<boolean>(true);
  const [updatingCompany, setUpdatingCompany] = useState<boolean>(false);
  const [companyFormData, setCompanyFormData] = useState<any>(null);
  const { showToast } = useToast();
  const supabase = createClient();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);


  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    const handleModeChange = () => {
      checkDarkMode();
      const tiles = document.querySelectorAll(".leaflet-tile");
      tiles.forEach((tile) => {
        const img = tile as HTMLImageElement;
        if (isDarkMode) {
          img.style.filter = "invert(0.93) hue-rotate(180deg) saturate(0.9)";
        } else {
          img.style.filter = "none";
        }
      });
    };

    const observer = new MutationObserver(handleModeChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    handleModeChange();
    return () => observer.disconnect();
  }, [isDarkMode]);


  useEffect(() => {
    const getTenantDetails = async () => {
      if (!profile?.tenant_id) {
        setLoadingCompany(false);
        return;
      }
      if (profile?.tenant_id) {
        const res = await fetchTenantDetails(profile.tenant_id);

        setCompany(res.data);
        setCompanyFormData(res.data);
        if (res) {
          setLoadingCompany(false);
        }
      }
    };

    getTenantDetails();
  }, [profile?.tenant_id]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setCompanyFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if ((file.size / (1024 * 1024)) > 20) {
      showToast('Image file (PNG, WEBP, JPEG) must be 20MB or below!', 'error');
      return;
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      showToast('Please select a valid image file (PNG, WEBP, JPEG)!', 'error');
      return;
    }

    try {
      // 1. Upload file to Supabase bucket (replace 'your-bucket-name' with yours)
      const fileExt = file.name.split('.').pop();
      const fileName = `Images/${Math.random()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('fleetmaster_files')
        .upload(fileName, file);
      if (error) throw error;

      // 2. Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('fleetmaster_files')
        .getPublicUrl(fileName);

      handleInputChange("tenant_logo", publicUrl);


    } catch (error) {
      showToast(error.message, 'error')
      console.error('Error uploading image:', error.message);
    }
  };


  const handleSaveChanges = async () => {
    setUpdatingCompany(true);
    const { admins, yards, ...cleanData } = companyFormData;
    const res = await updateTenantDetails(profile.tenant_id, cleanData);

    if (res.success) {
      showToast("Company details updated successfully!", "success");
      setCompany(companyFormData); // Update the local state with the new data
      setUpdatingCompany(false);

      if (companyFormData?.color?.trim()) {
        applyThemeVariables(companyFormData?.color?.trim());

        localStorage.setItem("brand-color", companyFormData?.color?.trim());
      }
    } else {
      showToast(res.error.message || "Failed to update company details. Please try again.", "error");
      setUpdatingCompany(false);
    }
  }


  const handleDeleteYard = async (yard: any) => {
    if (!yard || !yard.title) {
      console.error("Invalid yard data for deletion:", yard);
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete the yard "${yard.title}"?`);
    if (!confirmDelete) return;

    const updatedYards = companyFormData.yards.filter((y: any) => y.title !== yard.title);

    const res = await updateTenantDetails(profile.tenant_id, { ...companyFormData, yards: updatedYards });
    if (res.success) {
      showToast(`Yard "${yard.title}" deleted successfully.`, "success");
      setCompanyFormData((prev: any) => ({ ...prev, yards: updatedYards }));
    } else {
      showToast("Failed to delete yard.", "error");
    }
  }

  const allCountries = () => {
    return allCountriesDB.flatMap(c => ({
      value: c.country,
      label: c.country
    })
    );
  };



  if (!profile || !profile.tenant_id || loadingCompany) {
    return (
      <div className="w-full mx-auto p-6 space-y-6 animate-pulse">
        <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-gray-200 rounded-md dark:bg-gray-600"></div>
            <div className="h-4 w-32 bg-gray-100 rounded-md dark:bg-gray-600"></div>
          </div>
          <div className="h-10 w-28 bg-gray-200 rounded-lg dark:bg-gray-600"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-5 border border-gray-100 dark:border-gray-700 rounded-xl space-y-3">
              <div className="h-4 w-34 bg-gray-100 rounded-md dark:bg-gray-600"></div>
              <div className="h-8 w-19 bg-gray-200 rounded-md dark:bg-gray-600"></div>
            </div>
          ))}
        </div>
        <div className="border border-gray-100 dark:border-gray-800 rounded-xl p-4 space-y-4">
          <div className="h-5 w-36 bg-gray-200 dark:bg-gray-500 rounded-md mb-2"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-600 last:border-0">
              <div className="flex items-center space-x-3 w-full">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full shrink-0"></div>
                <div className="space-y-2 w-full max-w-[60%]">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded-md w-3/4"></div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded-md w-1/2"></div>
                </div>
              </div>
              <div className="h-4 w-12 bg-gray-100 rounded-md dark:bg-gray-600"></div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center space-x-2 pt-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <span className="text-xs text-gray-400 font-medium pl-1">Syncing workspace...</span>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 min-h-[70vh]">
        <div className="text-4xl mb-4">🏢</div>
        <h3 className="text-lg font-semibold text-red-600">Company Not Found</h3>
        <p className="text-gray-500 max-w-sm mt-2">
          We couldn't locate a profile associated with your account. If you believe this is an error, please contact support.
        </p>
        <button onClick={() => window.location.reload()} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">


      {isOpen && (
        <UpdateYardsModal
          tenantId={profile?.tenant_id}
          isDarkMode={isDarkMode}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          yardDetails={selectedEvent}
          setCompanyFormData={setCompanyFormData}
          companyFormData={companyFormData}
        />
      )}


      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            {companyFormData.tenant_logo ? (
              <img src={companyFormData.tenant_logo} alt="" className="h-full w-full object-contain p-1 bg-white" />
            ) : (
              <span className="text-xl font-bold text-gray-400">{company.name?.charAt(0)}</span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{company.name}</h2>
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium text-gray-500">{companyFormData.slug}.fleetmaster.co.ke {company.website && ` - ${company.website}`}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        <ComponentCard title="Company Identity">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <EditableInput label="Slug (e.g., mycompanyslug.fleetmaster.co.ke)" value={companyFormData.slug} onChange={(v) => handleInputChange("slug", v.replace(' ', ''))} />
            <EditableInput label="Company Name" value={companyFormData.name} onChange={(v) => handleInputChange("name", v)} />

            {/* <EditableInput type="file" label="Company Logo" value={companyFormData.tenant_logo} onChange={(v) => handleInputChange("tenant_logo", v)} /> */}
            <div className="flex flex-col space-y-1">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Company Logo (PNG, JPG, WEBP, TIFF up to 2MB)</Label>
              <div className="flex items-center gap-4">
                <img src={companyFormData.tenant_logo} alt="" className="h-11 w-[30%] object-contain rounded p-1 px-2 bg-white" />

                <input type="file" accept="image/*"
                  onChange={handleFileUpload}
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 dark:border-gray-600"
                />
              </div>
            </div>
          </div>
        </ComponentCard>

        <ComponentCard title="Company About (Brief Overview)">
          <TextArea value={companyFormData.about || ''} onChange={(v) => handleInputChange("about", v)} className="text-sm text-gray-600 dark:text-gray-300" />
        </ComponentCard>

        <ComponentCard title="Company Description">
          <TextArea disabled={updatingCompany} value={companyFormData.description || ''} onChange={(v) => handleInputChange("description", v)} className="text-sm text-gray-600 dark:text-gray-300" />
        </ComponentCard>

        <ComponentCard title="Contact Information">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <EditableInput disabled={updatingCompany} type="email" label="Email Address" value={companyFormData.email} onChange={(v) => handleInputChange("email", v)} />
            <EditableInput disabled={updatingCompany} type="tel" label="Primary Phone Number" value={companyFormData.phone} onChange={(v) => handleInputChange("phone", v)} />
            <EditableInput disabled={updatingCompany} placeholder="Select Country" type="select" options={allCountries()} label="Country" value={companyFormData?.country} onChange={(v) => handleInputChange("country", v)} />
            <EditableInput disabled={updatingCompany} label="City" value={companyFormData.city} onChange={(v) => handleInputChange("city", v)} />
            <EditableInput disabled={updatingCompany} label="Zip Code" value={companyFormData.zip_code} onChange={(v) => handleInputChange("zip_code", v)} />
            <EditableInput disabled={updatingCompany} label="Main Office Address" value={companyFormData.address} onChange={(v) => handleInputChange("address", v)} />
          </div>
        </ComponentCard>

        <ComponentCard title="System Settings">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <EditableInput disabled={updatingCompany} placeholder="Select timezone" type="select" label="Timezone" options={allTimezones()} value={companyFormData?.timezone} onChange={(v) => handleInputChange("timezone", v)} />
            <EditableInput disabled={updatingCompany} placeholder="Select user primary language" type="select" options={languages} label="Language" value={companyFormData?.language} onChange={(v) => handleInputChange("language", v)} />
            <EditableInput disabled={updatingCompany} placeholder="Select currency" type="select" options={allCountriesDB.map(c => ({ value: c.currency, label: c.currency }))} label="Currency" value={companyFormData.currency} onChange={(v) => handleInputChange("currency", v)} />
            <EditableInput disabled={updatingCompany} type="number" label="Buffer (Hours)" value={companyFormData.buffer} onChange={(v) => handleInputChange("buffer", v)} />
            <EditableInput disabled={updatingCompany} type="number" label="Monthly Target" value={companyFormData.monthly_target} onChange={(v) => handleInputChange("monthly_target", v)} />
            <EditableInput disabled={updatingCompany} type="color" label="Color Preference" value={companyFormData.color} onChange={(v) => handleInputChange("color", v)} />
          </div>
        </ComponentCard>


        <ComponentCard title="Leasing Options">
          <div className="mt-auto p-6 flex flex-col sm:flex-row gap-3 items-center justify-between bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
            <Checkbox label='Allow leasing options?' checked={companyFormData?.leasing_accepted} onChange={(v) => handleInputChange("leasing_accepted", v)} />
          </div>
          <div className="text-red-600 text-sm mt-3">Changes may take up to a day to reflect across all devices!</div>
        </ComponentCard>

        {companyFormData.yards && companyFormData.yards.length > 0 && (
          <ComponentCard title="Yards & Depots">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {companyFormData.yards.map((yard: any, idx: number) => (
                <div key={idx} className="rounded-xl relative border border-gray-100 p-4 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                  <img
                    src={yard.imageUrl || "/images/brand/default-yard.png"}
                    alt={yard.title || "Yard"}
                    className="mb-2 h-auto aspect-video w-full rounded-lg object-cover"
                  />                  <p className="text-sm font-bold text-gray-900 dark:text-white">{yard.title}</p>
                  <p className="mt-1text-sm mb-2 mt-1 truncate text-gray-500 line-clamp-2">{yard.description}</p>
                  <p className="font-small text-xs text-gray-700 dark:text-gray-500">Lat: {yard.location?.[0]} | long: {yard.location?.[1]}</p>

                  <div className="p-2 flex gap-4 absolute top-5 right-5 bg-white/50 dark:bg-gray-800/50 rounded-lg z-3">
                    <BorderColorOutlinedIcon onClick={() => {
                      setSelectedEvent(yard);
                      setIsOpen(true);
                    }} fontSize="small" className="text-white cursor-pointer" />
                    <DeleteOutlinedIcon onClick={() => {
                      handleDeleteYard(yard);
                    }} fontSize="small" color="error" className="cursor-pointer" />
                  </div>
                </div>
              ))}
              <div onClick={() => setIsOpen(true)} className="rounded-xl aspect-16/12.5 border cursor-pointer flex flex-col gap-3 items-center justify-center border-gray-100 p-4 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                <AddOutlinedIcon className="border dark:border-gray-600 rounded-full p-2.5 text-[3rem]! text-gray-500 dark:text-gray-400" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Add New Yard</p>
              </div>
            </div>
          </ComponentCard>
        )}

      </div>
      <div className="flex items-center justify-end border-t border-gray-100 px-6 py-5 dark:border-gray-800">
        <Button disabled={updatingCompany} variant="primary" size="sm" onClick={handleSaveChanges}>
          {updatingCompany ? 'Saving ...' : 'Save Changes'} {updatingCompany && <CircularProgress size={16} />}
        </Button>
      </div>

    </div >
  );
}

function EditableInput({ label, value, onChange, type = "text", disabled, placeholder, options }: { label: string; value: string; onChange: (v: string) => void; type?: string; disabled?: boolean; placeholder?: string; options?: any[]; }) {
  return (
    <div className="col-span-2 lg:col-span-1 space-y-1 flex flex-col">
      <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">{label}</Label>
      {
        type === "select" ?
          <Select value={value || ""} defaultValue={value || ""} placeholder={placeholder} onChange={(e) => onChange(e)} options={(options || [])} />
          :
          <Input placeholder={placeholder} disabled={disabled} type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} className="h-9" />
      }
    </div >
  );
}
