"use client";

import React, { useMemo, useState, useEffect } from "react";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import { bookings } from "@/data/mockFleetData";

export const CalendarWrapper = ({
  isMarkedUnavailable,
  dateString,
  vehicleId
}: {
  isMarkedUnavailable: boolean;
  dateString: string;
  vehicleId: number;
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

  // Calculate all booked date strings for this vehicle
  const bookedDates = useMemo(() => {
    const vehicleBookings = bookings.filter((b) => b.vehicleId === vehicleId);

    return vehicleBookings.flatMap((booking) => {
      const start = dayjs(booking.rentalStart);
      const end = dayjs(booking.rentalEnd);
      const days = [];
      let current = start;

      while (current.isBefore(end) || current.isSame(end, "day")) {
        days.push(current.format("YYYY-MM-DD"));
        current = current.add(1, "day");
      }
      return days;
    });
  }, [vehicleId]);


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
            // MuiButtonBase-root MuiPickerDay-root css-1cqb494-MuiButtonBase-root-MuiPickerDay-root
            ...(isMarkedUnavailable && {
              "& .MuiPickerDay-root": {
                backgroundColor: "#ff00003f !important", // Tailwind red-500
                borderRadius: "50%",
                opacity: "1 !important",
                "&:hover": {
                  backgroundColor: "#ff000060 !important", // Tailwind red-600
                },
              },
            }),
            // Target any button that has a 'data-date' matching our booked list
            // This is the trick: We use a template literal to build a CSS selector
            ...bookedDates.reduce((acc, date) => ({
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
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};