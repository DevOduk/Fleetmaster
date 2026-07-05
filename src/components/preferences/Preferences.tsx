"use client";
import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import Select from "../form/Select";
import { Snackbar, Alert, ToggleButton, ToggleButtonGroup, Box, MenuItem, TextField, CircularProgress } from "@mui/material";
import Fade from '@mui/material/Fade';
import { TransitionProps } from '@mui/material/transitions';
import { toast } from 'sonner';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { useSettings } from "@/context/SettingsContext";
import { useTheme } from "@/context/ThemeContext";
import Input from "../form/input/InputField";
import { useUser } from "@/context/UserContext";
import Checkbox from "../form/input/Checkbox";



export default function Preferences() {
  const { profile, loading } = useUser();
  const [formData, setFormData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { position: preferredPopupPosition, setPosition } = useSettings();

  useEffect(() => {
    if (!profile || loading) return;
    setFormData(profile);
  }, [profile])

  // States for the popup simulator
  const [vertical, setVertical] = useState<'top' | 'bottom'>('top');
  const [horizontal, setHorizontal] = useState<'left' | 'center' | 'right'>('right');
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');
  const { theme, setUserTheme } = useTheme();

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


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
  };
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
  };


  return (
    <div className="space-y-6">
      {/* Preferences Section */}
      <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-8">
        <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
          Preferences
        </h3>

        <div className="space-y-4 lg:space-y-5">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
            <div>
              <Label className="mb-3" htmlFor="language">Language</Label>
              {/* <p className="mt-1 text-sm font-medium text-gray-800 dark:text-white/90">
                {formData.language}
              </p> */}
              <Select
                options={[
                  { value: "english-us", label: "English (US)" },
                  { value: "english-uk", label: "English (UK)" },
                ]}
                // Keep the select UI synced with the active theme state
                defaultValue={formData?.language}
                placeholder="Select an option"
                onChange={(e) => setFormData((prev) => ({ ...prev, language: e }))}
                className="dark:bg-dark-900"
              />
            </div>
            {/* <div>
              <Label className="mb-3" htmlFor="timezone">Timezone</Label>
              <Select
                options={[
                  // Operations Default
                  { value: "Africa/Nairobi", label: "Nairobi (EAT - UTC+3)" },

                  // Global/Common Timezones
                  { value: "UTC", label: "Coordinated Universal Time (UTC)" },
                  { value: "Europe/London", label: "London (GMT/BST)" },
                  { value: "America/New_York", label: "New York (EST/EDT)" },
                  { value: "America/Chicago", label: "Chicago (CST/CDT)" },
                  { value: "America/Los_Angeles", label: "Los Angeles (PST/PDT)" },
                  { value: "Europe/Paris", label: "Paris (CET/CEST)" },
                  { value: "Asia/Dubai", label: "Dubai (GST - UTC+4)" },
                  { value: "Asia/Singapore", label: "Singapore (SGT - UTC+8)" },
                  { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)" },
                ]}
                defaultValue={formData.timezone || "Africa/Nairobi"}
                placeholder="Select a timezone"
                onChange={(e) => setFormData((prev) => ({ ...prev, timezone: e }))}
                className="dark:bg-dark-900"
              />
            </div> */}


            <div>
              <Label className="mb-3" htmlFor="theme">Theme</Label>
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
      <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-8 space-y-6">
        <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
          Notifications
        </h3>

        <div className="flex-1 relative w-full space-y-4 lg:space-y-5">
          <p className="font-medium text-gray-900 dark:text-white">
            Toast Notifications</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Get real-time alerts for important updates and messages.
            Choose how your popups appear: Placement, size, etc.
          </p>

          <div className="flex gap-3 py-4 flex-wrap">
            {
              ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'].map((pos) => (
                <Button className="text-nowrap! px-6! py-3!" size="sm" key={pos}
                  // turn green bg if selected 
                  variant={preferredPopupPosition === pos ? 'success-outline' : 'primary-outline'}
                  onClick={() => {
                    setPosition(pos as 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center');

                    toast(
                      <div className="flex gap-2 font-bold items-center"><TaskAltIcon style={{ width: 16, height: 16 }} /> New Notification!</div>,
                      {
                        description: (
                          <span className="font-sm">
                            Your popup notifications will now look like this.
                          </span>
                        ),
                        // Adding custom colors via style or className
                        style: {
                          padding: '10px 12px',
                          color: 'green', // Dark green text
                        },
                      }
                    );
                    localStorage.setItem('preferredPopupPosition', pos)
                  }}
                >
                  {pos.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </Button>
              ))
            }

          </div>

          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              <span className="font-semibold">Current Settings:</span> {vertical}-{horizontal}, {size} size
            </p>
          </div>
        </div>


            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Popup Notifications</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Receive updates about your account activity
                </p>
              </div>
              <Checkbox
                checked={formData?.popup}
                onChange={(e) => setFormData((prev) => ({ ...prev, popup: e }))}
                className="h-5 w-5 cursor-pointer rounded border-gray-300 accent-brand-500"
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Receive updates about your account activity
                </p>
              </div>

              <Checkbox
                checked={false}
                onChange={(e) => setFormData((prev) => ({ ...prev, email_notify: e }))}
                className="h-5 w-5 cursor-pointer rounded border-gray-300 accent-brand-500"
              />
            </div>

            
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Newsletter</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Subscribe to our weekly newsletter for updates and features
                </p>
              </div>

              <Checkbox
                checked={formData?.newsletter || false}
                onChange={(e) => setFormData((prev) => ({ ...prev, email_notify: e }))}
                className="h-5 w-5 cursor-pointer rounded border-gray-300 accent-brand-500"
              />
            </div>

        <Button size="sm" onClick={handleCancel} variant="outline" className="ms-auto mt-5 mr-3">
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
          Cancel
        </Button>
        <Button size="sm" onClick={handleSave} variant="primary" className="ms-auto mt-5">
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
          Save Preferences
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
    </div>
  );
}