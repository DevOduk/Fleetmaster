"use client";

import React, { useEffect, useState } from "react";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Select from "../../form/Select";
import Fade from "@mui/material/Fade";
import { TransitionProps } from "@mui/material/transitions";
import {
  Alert,
  Snackbar,
} from "@mui/material";
import { useTheme } from "@/context/ThemeContext";
import Checkbox from "../../form/input/Checkbox";
import { languages } from "@/data/globalExports";
import { useToast } from "@/context/ToastContext";
import handleProfileUpdate from "@/utils/clients/handleProfileUpdate";
import handleAdminProfileUpdate from "@/utils/admins/handleProfileUpdate";
import handleSystemAdminProfileUpdate from "@/utils/system-admins/handleProfileUpdate";
import { Backdrop, CircularProgress } from "@mui/material";



export default function Preferences(
  { profile, loading }: { profile?: any; loading?: boolean } = {
    profile: null,
    loading: false,
  },
) {
  const [newProfile, setNewProfile] = useState<any>(profile);
  const [isSaving, setIsSaving] = useState(false);
  const [open, setIsOpen] = useState(false);
  const { showToast, position, setPosition } = useToast();
  const [preferredPopupPosition, setPreferredPopupPosition] = useState<['top' | 'bottom', 'left' | 'center' | 'right']>(position);
  const [size] = useState<"small" | "medium" | "large">("medium");
  const { theme, setUserTheme } = useTheme();

  useEffect(() => {
    if (!profile || loading) return;
    setNewProfile(profile);
  }, [profile]);


  // If your Select component passes an object or value directly:
  const handleThemeChange = (selectedOption: any) => {
    // Gracefully handle whatever structure your Select library returns
    const value = selectedOption?.value || selectedOption;
    if (value === "light" || value === "dark" || value === "system") {
      setUserTheme(value);
    }
  };

  const [state, setState] = React.useState<{
    open: boolean;
    Transition: React.ComponentType<
      TransitionProps & {
        children: React.ReactElement<any, any>;
      }
    >;
  }>({
    open: false,
    Transition: Fade,
  });

  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
  };
  const handleSave = async () => {
    if (profile.role === 'Client') {
      handleProfileUpdate(profile.id, newProfile, setIsSaving, showToast, setNewProfile);
    } else if (profile.role === 'System Administrator') {
      handleSystemAdminProfileUpdate(profile.id, newProfile, setIsSaving, showToast, setNewProfile);
    } else {
      handleAdminProfileUpdate(profile.id, newProfile, setIsSaving, showToast, setNewProfile);
    }
  };


  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={isSaving}
        onClick={() => null}
      >
        <CircularProgress color="inherit" />
      </Backdrop>


      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setIsOpen(false)}
        anchorOrigin={{ vertical: preferredPopupPosition[0], horizontal: preferredPopupPosition[1] }}
        sx={{ zIndex: 100000 }}
      >
        <Alert
          onClose={() => setIsOpen(false)}
          severity={'success'}
          variant="filled"
          sx={{ width: "100%", borderRadius: "8px", fontWeight: 500 }}
        >
          This is how your toast notifications will appear!
        </Alert>
      </Snackbar>

      {/* Preferences Section */}
      <div className="no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-4 lg:p-8 dark:bg-gray-900">
        <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
          Preferences
        </h3>

        <div className="space-y-4 lg:space-y-5">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
            <div>
              <Label className="mb-3" htmlFor="language">
                Language
              </Label>
              <Select
                options={languages}
                defaultValue={newProfile?.language}
                placeholder="Select an option"
                onChange={(e) =>
                  setNewProfile((prev) => ({ ...prev, language: e }))
                }
                className="dark:bg-dark-900"
              />
            </div>

            <div>
              <Label className="mb-3" htmlFor="theme">
                Theme
              </Label>
              <Select
                options={[
                  { value: "light", label: "Light" },
                  { value: "dark", label: "Dark" },
                  { value: "system", label: "System Default" },
                ]}
                // Keep the select UI synced with the active theme state
                defaultValue={theme}
                placeholder="Select an option"
                onChange={handleThemeChange}
                className="dark:bg-dark-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="no-scrollbar relative w-full space-y-6 overflow-y-auto rounded-3xl bg-white p-4 lg:p-8 dark:bg-gray-900">
        <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
          Notifications
        </h3>

        <div className="relative w-full flex-1 space-y-4 lg:space-y-5">
          <p className="font-medium text-gray-900 dark:text-white">
            Toast Notifications
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Get real-time alerts for important updates and messages. Choose how
            your popups appear: Placement, size, etc.
          </p>

          <div className="grid grid-cols-2 gap-3 py-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              "top-left",
              "top-center",
              "top-right",
              "bottom-right",
              "bottom-center",
              "bottom-left",
            ].map((pos) => (
              <Button
                className="px-6! py-3! text-nowrap!"
                size="sm"
                key={pos}
                variant={
                  preferredPopupPosition?.join("-") === pos
                    ? "success-outline"
                    : "primary-outline"
                }
                onClick={() => {
                  setPosition(
                    pos.split("-") as ["top" | "bottom", "left" | "center" | "right"]
                  );
                  setPreferredPopupPosition(
                    pos.split("-") as ["top" | "bottom", "left" | "center" | "right"]
                  );

                  setIsOpen(true);

                  localStorage.setItem("preferredPopupPosition", JSON.stringify([
                    pos.split("-")[0] as "top" | "bottom",
                    pos.split("-")[1] as "left" | "center" | "right"
                  ]));
                }}
              >
                {pos.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </Button>
            ))}
          </div>

          <div>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Current Settings:</span>{" "}
              {position[0]}-{position[1]}, {size} size
            </p>
          </div>
        </div>
        {
          [
            {
              name: "popup",
              label: "Popup Notifications",
              description: "Receive updates about your account activity",
            },
            {
              name: "notify",
              label: "Email Notifications",
              description: "Receive updates about your account activity",
            },
            {
              name: "newsletter",
              label: "Newsletter",
              description: "Subscribe to our weekly newsletter for updates and features",
            },
          ].map((notification, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/40">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {notification.label}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {notification.description}
                </p>
              </div>
              <Checkbox
                checked={newProfile?.[notification.name]}
                onChange={(e) => setNewProfile((prev) => ({ ...prev, [notification.name]: e }))}
                className="accent-brand-500 h-5 w-5 cursor-pointer rounded border-gray-300"
              />
            </div>
          ))
        }

        <Button disabled={(profile === newProfile)} variant="primary" size="sm" onClick={handleSave} className="bg-brand-600 border-brand-600 text-theme-sm hover:bg-brand-700 mt-3 flex w-full items-center justify-center rounded-lg border p-2 px-4 font-medium text-nowrap text-white">
          <svg
            className="h-4 w-4 fill-current"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
            />
          </svg>
          &nbsp; {isSaving ? 'Saving ...' : "Save Preferences"}
        </Button>
      </div>

      {/* Simulated Alert Popup */}
      <Snackbar
        open={state.open}
        onClose={handleClose}
        slots={{ transition: state.Transition }}
        message="I love snacks"
        key={state.Transition.name}
        autoHideDuration={1200}
      />
    </div >
  );
}
