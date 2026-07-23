"use client";

import React, { useMemo, useState, useEffect } from "react";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import { CircularProgress } from "@mui/material";

export const CalendarComponent = ({
  dateString,
  bookedDates
}: {
  dateString: string;
  bookedDates: any[];
}) => {
  const [isDark, setIsDark] = useState(false);

  // Theme observer for dark mode sync
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);


  const theme = useMemo(() => createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
      primary: { main: "#3b82f6" },
      background: { paper: "transparent", default: "transparent" },
    },
  }), [isDark]);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {!bookedDates ? <div className="w-full flex-col h-90 mb-5 gap-3 border-gray-600 rounded-2xl flex items-center justify-center text-green-500 text-center">
          <CircularProgress size={25} color="success" />
          Just a moment!
        </div> :
          <DateCalendar
            defaultValue={dayjs(dateString)}
            value={null}
            displayWeekNumber
            readOnly
            slotProps={{
              day: (ownerState) => ({
                // We inject the date string into a custom data attribute
                "data-date": ownerState.day.format("YYYY-MM-DD"),
              } as any),
            }}
            sx={{
              width: "100%",
              backgroundColor: "transparent",
              // Target any button that has a 'data-date' matching our booked list
              // This is the trick: We use a template literal to build a CSS selector
              ...bookedDates?.reduce((acc, date) => ({
                ...acc,
                [`& button[data-date="${date}"]`]: {
                  backgroundColor: "green !important",
                  color: "#ffffff !important",
                  borderRadius: "50%",
                  fontWeight: "bold",
                  opacity: "1 !important",
                  "&:hover": {
                    backgroundColor: "green !important",
                  },
                },
              }), {}),

              // Standard Theme Styles
              "& .MuiPickersCalendarHeader-label": { color: isDark ? "#f3f4f6" : "inherit" },
              "& .MuiTypography-root": { color: isDark ? "#f3f4f6" : "inherit" },
              "& .MuiDayCalendar-weekDayLabel": { color: isDark ? "#9ca3af" : "inherit" },
              "& .MuiPickersArrowSwitcher-root button": { color: isDark ? "#f3f4f6" : "inherit" }
            }}
          />}
      </LocalizationProvider>
    </ThemeProvider>
  );
};