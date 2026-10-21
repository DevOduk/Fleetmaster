import CallToAction from "@/components/marketing-components/CallToAction";
import SecondaryHero from "@/components/marketing-components/SecondaryHero";
import { Metadata } from "next";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

// MUI Icon Imports for Use Case Features
import ComputerOutlinedIcon from "@mui/icons-material/ComputerOutlined";
import CarRentalOutlinedIcon from "@mui/icons-material/CarRentalOutlined";
import HttpIcon from "@mui/icons-material/Http";
import SubtitlesOutlinedIcon from "@mui/icons-material/SubtitlesOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import NoCrashOutlinedIcon from "@mui/icons-material/NoCrashOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

// MUI Icon Imports for the Downward Stepper Workflow
import HowToRegIcon from "@mui/icons-material/HowToReg";
import DomainAddIcon from "@mui/icons-material/DomainAdd";
import LayersIcon from "@mui/icons-material/Layers";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import Link from "next/link";
import Image from "next/image";

export const UsageCases = [
  {
    imgSrc: "/images/product/3.webp",
    badgeText: "Overview",
    icon: ComputerOutlinedIcon,
    title: "0. Centralized Dispatch & Fleet Overview",
    description:
      "One single source of truth. Eliminate messy spreadsheets and scattered communication. Manage vehicle assignments, active rentals, invoicing, and contract history from a single, unified dashboard designed for quick decision-making.",
    imgClassName: "rounded-t-2xl mb-3 aspect-4/2 w-full object-cover",
  },
  {
    imgSrc: "/images/product/online.jpg",
    badgeText: "Online Booking",
    icon: CarRentalOutlinedIcon,
    title: "1. Advanced Online Booking & Reservation",
    description:
      "Make it easy for customers to see all vehicles and reserve vehicles online. Let them browse availability, choose their dates, and submit bookings anytime, while you keep reservations organized in one place.",
    imgClassName: "rounded-t-2xl mb-3 aspect-4/2 w-full object-cover",
  },
  {
    imgSrc: "/images/product/2.webp",
    badgeText: "Easy Setup",
    icon: HttpIcon,
    title: "2. Free Domain & Zero-Config",
    description:
      "We handle the infrastructure. Avoid the hidden costs of buying, configuring, and maintaining separate web domains. Launch instantly with a secure, fully-managed yourbrand.fleetmaster.com portal completely free.",
    imgClassName:
      "rounded-t-2xl bg-gray-200 mb-3 aspect-4/2 w-full object-cover",
  },
  {
    imgSrc: "/images/product/4.webp",
    badgeText: "Live Dashboard",
    icon: SubtitlesOutlinedIcon,
    title: "3. Live Fleet Telematics",
    description:
      "We help you setup Real-time tracking and other features. Monitor vehicle diagnostics, live locations, and battery health on a unified map. Catch mechanical issues and unauthorized route deviations instantly before they become costly repairs.",
    imgClassName:
      "rounded-t-2xl bg-gray-200 mb-3 aspect-4/2 w-full object-cover",
  },
  {
    imgSrc: "/images/product/5.webp",
    badgeText: "AI Automation",
    icon: VerifiedUserOutlinedIcon,
    title: "4. Automated Driver Vetting",
    description:
      "Security-first verification. Protect high-value vehicles from liability risks. The onboarding pipeline automatically scans and verifies driver's licenses and credentials before a vehicle can ever be booked.",
    imgClassName: "rounded-t-2xl mb-3 aspect-4/2 w-full object-cover",
  },
  {
    imgSrc: "/images/product/6.webp",
    badgeText: "Easy Management",
    icon: NoCrashOutlinedIcon,
    title: "5. Manage Bookings in One Place",
    description:
      "Easily view and manage all your vehicles on one place. Our live vehicle status checks lets clients know which cars are available and which are not. Preview all bookings before a booking even commence.",
    imgClassName: "rounded-t-2xl mb-3 aspect-4/2 w-full object-cover",
  },
  {
    imgSrc: "/images/product/1.webp",
    badgeText: "Save Time",
    icon: CalendarMonthIcon,
    title: "6. Saves you Time & Money",
    description:
      "Save time with our built in Calendar that helps you plan dropoffs and pickups helping you keep track of all pending bookings. All in one place!",
    imgClassName: "rounded-t-2xl mb-3 aspect-4/2 w-full object-cover",
  },
];