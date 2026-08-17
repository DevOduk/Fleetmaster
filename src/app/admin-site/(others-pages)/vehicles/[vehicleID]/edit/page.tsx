"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import VehicleNotFound from "@/components/vehicles/NotFound";
import { ChevronLeftIcon } from "@/icons";
import { Backdrop, Box, Chip, CircularProgress } from "@mui/material";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import LocalGasStationOutlinedIcon from "@mui/icons-material/LocalGasStationOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import {
  deleteVehicle,
  fetchVehicleDetails,
  updateVehicleDetails,
} from "@/app/actions/vehicles";
import { useAdminFleet } from "@/context/AdminFleetContext";
import { useToast } from "@/context/ToastContext";
import { AdminCalendarWrapper } from "@/components/calendar/AdminCalendarWrapper";
import { useUser } from "@/context/UserContext";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import CarModelsByBrand from "@/data/carMakeModels";
import { handleImageFileUpload } from "@/utils/uploads/imageUpload";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import { useAdminBooking } from "@/context/AdminBookingContext";

interface VehiclePageProps {
  params: Promise<{ vehicleID: string }>;
}

const EditVehiclePage = ({ params }: VehiclePageProps) => {
  const { setVehicles } = useAdminFleet();
  const { showToast } = useToast();
  const resolvedParams = use(params);
  const vehicleID = resolvedParams.vehicleID;
  const { profile } = useUser();
  const [loadingVehicle, setLoadingVehicle] = useState(false);
  const [backDrop, setBackDrop] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [VehicleDetails, setVehicleDetails] = useState<any>(null);
  const [originalVehicleDetails, setOriginalVehicleDetails] =
    useState<any>(null);
  const { isOpen, openModal: openDeleteModal, closeModal } = useModal();
  const { bookings, loading } = useAdminBooking();

  useEffect(() => {
    if (!vehicleID) return;
    document.title = "Edit Vehicle " + vehicleID + " | FleetMaster";

    async function fetchAllVehicles() {
      setLoadingVehicle(true);
      try {
        const response = await fetchVehicleDetails(Number(vehicleID));

        if (!response.error) {
          setVehicleDetails(response.data);
          setOriginalVehicleDetails(response.data);
        } else {
          console.error("API Error fetching vehicle detailss:", response.error);
        }
      } catch (err) {
        console.error("Network connection failure:", err);
      } finally {
        setLoadingVehicle(false);
      }
    }

    fetchAllVehicles();
  }, [vehicleID]);

  const breadcrumbItems = [
    { label: "Vehicles", href: "/vehicles" },
    {
      label: VehicleDetails?.make + " " + VehicleDetails?.model,
      href: "/vehicles/" + vehicleID,
    },
  ];

  const updateVehicle = async () => {
    setDisableButton(true);
    setBackDrop(true);

    const res = await updateVehicleDetails(Number(vehicleID), VehicleDetails);

    if (res.success) {
      // Use .map to replace ONLY the vehicle that matches the ID
      setVehicles((prevVehicles) =>
        prevVehicles.map((v) =>
          v.id === parseInt(vehicleID) ? { ...VehicleDetails } : v,
        ),
      );

      setVehicleDetails(VehicleDetails);
      setOriginalVehicleDetails(VehicleDetails);

      setTimeout(() => {
        showToast("Vehicle details updated successfully", "success");
        setDisableButton(false);
        setBackDrop(false);
      }, 3000);
    } else {
      setTimeout(() => {
        showToast(res.error.message, "error");
        setDisableButton(false);
        setBackDrop(false);
      }, 3000);
    }
  };

  const updateAvailability = async (status: string) => {
    setBackDrop(true);
    const res = await updateVehicleDetails(VehicleDetails?.id, {
      ...VehicleDetails,
      status: status,
    });

    if (res.success) {
      showToast("Vehicle status updated successfully", "success");
      setVehicleDetails((prev: any) => ({
        ...prev,
        status: status,
      }));
      setOriginalVehicleDetails((prev: any) => ({
        ...prev,
        status: status,
      }));
      setBackDrop(false);
    } else {
      showToast("An error ocuured while updating vehicle status!", "error");
      setBackDrop(false);
    }
  };

  const deleteVehicleItem = async () => {
    setIsDeleting(true);

    const res = await deleteVehicle(VehicleDetails?.id, profile);

    if (res.success) {
      showToast("Vehicle deleted successfully", "success");

      window.location.href = "/vehicles";
    } else {
      showToast(
        res.error.message || "An error ocuured while deleting vehicle!",
        "error",
      );
      setIsDeleting(false);
    }
  };

  if (loadingVehicle) {
    return <div>Fetching vehicle details</div>;
  }
  if (!VehicleDetails) {
    return <VehicleNotFound />;
  }

  return (
    <main className="space-y-6 p-6">
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={backDrop}
        onClick={() => 2}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-146 p-5 lg:p-10"
      >
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
          Confirm Deletion
        </h4>
        <p className="text-sm text-black dark:text-white">
          Are you sure you want to delete this vehicle? This action is
          irreverssible. Ensure there is no pending or active rental.
        </p>
        <div className="mt-6 flex w-full items-center justify-end gap-3">
          <Button
            size="sm"
            variant="outline"
            type="button"
            onClick={closeModal}
          >
            Close
          </Button>
          <Button
            size="sm"
            variant="danger"
            type="submit"
            disabled={isDeleting}
            onClick={deleteVehicleItem}
          >
            {isDeleting ? (
              <>
                Deleting ... <CircularProgress color="inherit" size={14} />{" "}
              </>
            ) : (
              "Confirm Deletion"
            )}
          </Button>
        </div>
      </Modal>
      <PageBreadcrumb
        items={breadcrumbItems}
        pageTitle={`Edit ${VehicleDetails?.make} ${VehicleDetails?.model}`}
      />

      <div className="mb-4 flex items-center gap-3">
        <Link href={"/vehicles/" + vehicleID} className="mr-2">
          <Button size="sm" variant="danger-outline">
            <ChevronLeftIcon />
            Back to Vehicle
          </Button>
        </Link>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Edit Vehicle {VehicleDetails?.licensePlate}
        </h3>
      </div>
      <div className="grid grid-cols-12 gap-6">
        {/* Calendar Section: col-span-5 */}
        <div className="col-span-12 lg:col-span-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex flex-col-reverse items-center justify-between xl:flex-row">
              <div className="px-4 pt-4">
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  Service Schedule
                </h3>
                <p className="font-small text-sm text-gray-600 dark:text-gray-400">
                  Find a snapshot of vehicles calendar booking status.
                </p>
              </div>
              {VehicleDetails?.status === "Available" ? (
                <Button
                  size="sm"
                  variant="danger"
                  className="w-full text-nowrap xl:w-fit"
                  onClick={() => updateAvailability("Not Available")}
                >
                  Mark Unavailable
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="success"
                  className="w-full text-nowrap xl:w-fit"
                  onClick={() => updateAvailability("Available")}
                >
                  Mark Available
                </Button>
              )}
            </div>
            <AdminCalendarWrapper
              bookings={bookings.filter(
                (b) => b.vehicle_id === Number(vehicleID),
              )}
              loading={loading}
              isMarkedUnavailable={VehicleDetails?.status === "Not Available"}
              vehicleId={parseInt(vehicleID)}
              dateString={new Date().toISOString().split("T")[0]}
            />
            {VehicleDetails?.status === "Available" ? (
              <div className="mb-2 text-center text-sm text-green-500">
                This vehicle is now available for bookings!
              </div>
            ) : (
              <div className="mb-2 text-center text-sm text-red-500">
                This vehicle will NOT be available for bookings!
              </div>
            )}
          </div>

          <Button
            onClick={openDeleteModal}
            variant="danger"
            className="mt-5 w-full"
            size="sm"
          >
            Delete Vehicle
          </Button>
        </div>

        {/* Details Section: col-span-7 */}
        <div className="col-span-12 space-y-6 lg:col-span-7">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {VehicleDetails?.make} {VehicleDetails?.model}{" "}
                  {VehicleDetails?.year}
                </h2>
                <p className="text-gray-500">
                  Body Type: {VehicleDetails?.body_type} | Category:{" "}
                  {VehicleDetails?.category}{" "}
                </p>
              </div>
              <div>
                <span
                  className={`font-sm mt-2 mb-1 rounded-full px-3 py-1 text-xs ${
                    VehicleDetails?.status === "Available"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {VehicleDetails?.status}
                </span>
                <span
                  className="font-sm ms-3 mt-2 mb-1 rounded-full bg-green-100 px-3 py-1 text-xs text-green-700"
                  color="success"
                >
                  {VehicleDetails?.driver_type}
                </span>
              </div>
            </div>

            <div className="relative">
              <Box
                className="flex gap-2"
                sx={{ position: "absolute", top: 10, right: 10 }}
              >
                <Chip
                  sx={{ px: 1 }}
                  variant="filled"
                  color="primary"
                  icon={<LocalGasStationOutlinedIcon fontSize="small" />}
                  label={VehicleDetails?.fuel_type}
                />
                <Chip
                  sx={{ px: 1 }}
                  variant="filled"
                  color="primary"
                  icon={<PeopleAltOutlinedIcon fontSize="small" />}
                  label={VehicleDetails?.seats + " Seats"}
                />
              </Box>
              <label
                htmlFor="img"
                className="absolute right-3 bottom-3 flex cursor-pointer items-center gap-2 rounded-lg border-0 bg-black/50 p-2 px-3 text-sm text-white outline-0"
              >
                <input
                  id="img"
                  className="hidden"
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    setBackDrop(true);
                    const image = await handleImageFileUpload(e, showToast);

                    setVehicleDetails((prev) => ({
                      ...prev,
                      image_url: image,
                    }));
                    setBackDrop(false);
                  }}
                />
                <AddPhotoAlternateOutlinedIcon /> Change Photo
              </label>
              <img
                src={VehicleDetails?.image_url}
                alt={`${VehicleDetails?.make} ${VehicleDetails?.model}`}
                className="mb-8 aspect-video w-full rounded-xl object-cover"
              />
            </div>

            <div className="p-2">
              <p className="text-gray-400">Description</p>
              <TextArea
                value={VehicleDetails?.description}
                className="mt-3"
                onChange={(e) =>
                  setVehicleDetails((prev: any) => ({
                    ...prev,
                    description: e,
                  }))
                }
                rows={4}
              />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-y-4">
              <div className="p-2">
                <p className="text-gray-400">Make</p>
                <Select
                  options={Object.keys(CarModelsByBrand || {}).map((brand) => ({
                    value: brand,
                    label: brand,
                  }))}

                  defaultValue={VehicleDetails?.make}
                  value={VehicleDetails?.make}
                  placeholder="Change make"
                  onChange={(e) =>
                    setVehicleDetails((prev: any) => ({
                      ...prev,
                      make: e,
                    }))
                  }
                  className="dark:bg-dark-900 mt-3"
                />
              </div>
              <div className="p-2">
                <p className="text-gray-400">Model</p>

                <Select
                  options={CarModelsByBrand[VehicleDetails?.make].map(
                    (model) => ({
                      value: model,
                      label: model,
                    }),
                  )}

                  defaultValue={VehicleDetails?.model}
                  value={VehicleDetails?.model}
                  placeholder="Change model and trim"
                  onChange={(e) =>
                    setVehicleDetails((prev: any) => ({
                      ...prev,
                      model: e,
                    }))
                  }
                  className="dark:bg-dark-900 mt-3"
                />
              </div>

              <div className="p-2">
                <p className="text-gray-400">Category</p>
                <Input
                  id="category"
                  list="categories-list" // Links to the datalist id
                  className="mt-3"
                  step={1}
                  value={VehicleDetails?.category} // Fixed bug (was .year)
                  type="text"
                  placeholder="e.g Economy"
                  onChange={(e) =>
                    setVehicleDetails((prev: any) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                />
                <datalist id="categories-list">
                  {/* Standard Industry Categories */}
                  <option value="Mini" />
                  <option value="Economy" />
                  <option value="Compact" />
                  <option value="Intermediate / Midsize" />
                  <option value="Standard" />
                  <option value="Full-Size" />
                  <option value="Premium" />
                  <option value="Luxury / Exotic" />
                  <option value="Compact SUV" />
                  <option value="Intermediate SUV" />
                  <option value="Full-Size SUV" />
                  <option value="Minivan / Passenger Van" />
                  <option value="Pickup Truck" />
                  <option value="Convertible" />
                  <option value="Electric Vehicle (EV)" />
                </datalist>
              </div>
              <div className="p-2">
                <p className="text-gray-400">Body Type</p>
                <Input
                  id="body"
                  list="body-types-list" // Links to the datalist id
                  className="mt-3"
                  value={VehicleDetails?.body_type}
                  type="text"
                  placeholder="e.g Sedan"
                  onChange={(e) =>
                    setVehicleDetails((prev: any) => ({
                      ...prev,
                      body_type: e.target.value,
                    }))
                  }
                />
                <datalist id="body-types-list">
                  <option value="Sedan" />
                  <option value="SUV" />
                  <option value="Hatchback" />
                  <option value="Coupe" />
                  <option value="Convertible" />
                  <option value="Station Wagon" />
                  <option value="Minivan" />
                  <option value="Pickup Truck" />
                  <option value="Van" />
                </datalist>
              </div>

              <div className="p-2">
                <p className="text-gray-400">Year</p>
                <Input
                  id="minDays"
                  className="mt-3"
                  step={1}
                  value={VehicleDetails?.year}
                  type="number"
                  onChange={(e) =>
                    setVehicleDetails((prev: any) => ({
                      ...prev,
                      year: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="p-2">
                <p className="text-gray-400">Seats</p>
                <Input
                  id="minDays"
                  className="mt-3"
                  step={1}
                  value={VehicleDetails?.seats}
                  type="number"
                  onChange={(e) =>
                    setVehicleDetails((prev: any) => ({
                      ...prev,
                      seats: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="p-2">
                <p className="text-gray-400">Exterrior Color</p>
                <Input
                  id="license_plate"
                  className="mt-3"
                  step={100}
                  value={VehicleDetails?.color?.[0]}
                  type="text"
                  onChange={(e) =>
                    setVehicleDetails((prev: any) => ({
                      ...prev,
                      color: [e.target.value, VehicleDetails.color?.[1]],
                    }))
                  }
                />{" "}
              </div>
              <div className="p-2">
                <p className="text-gray-400">Interrior Color</p>
                <Input
                  id="license_plate"
                  className="mt-3"
                  step={100}
                  value={VehicleDetails?.color?.[1]}
                  type="text"
                  onChange={(e) =>
                    setVehicleDetails((prev: any) => ({
                      ...prev,
                      color: [VehicleDetails.color?.[0], e.target.value],
                    }))
                  }
                />
              </div>
              <div className="p-2">
                <p className="text-gray-400">Transmission</p>
                <div className="font-sm mt-2 mb-1 flex gap-3 dark:text-white">
                  {["Automatic", "Manual", "Automatic/Manual"].map((t) => (
                    <span
                    key={t}
                      className={`cursor-pointer rounded-lg px-4 py-2 text-sm ${t === VehicleDetails?.transmission ? "bg-brand-500 text-white" : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}
                      onClick={() =>
                        setVehicleDetails((prev: any) => ({
                          ...prev,
                          transmission: t,
                        }))
                      }
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-2">
                <p className="text-gray-400">Driver Type</p>
                <div className="font-sm mt-2 mb-1 flex gap-3 dark:text-white">
                  {["Self Drive", "Chauffeured"].map((t) => (
                    <span
                    key={t}
                      className={`cursor-pointer rounded-lg px-4 py-2 text-sm ${t === VehicleDetails?.driver_type ? "bg-brand-500 text-white" : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}
                      onClick={() =>
                        setVehicleDetails((prev: any) => ({
                          ...prev,
                          driver_type: t,
                        }))
                      }
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-2">
                <p className="text-gray-400">License Plate</p>
                <Input
                  id="license_plate"
                  className="mt-3"
                  step={100}
                  value={VehicleDetails?.license_plate.toUpperCase()}
                  type="text"
                  onChange={(e) =>
                    setVehicleDetails((prev: any) => ({
                      ...prev,
                      license_plate: e.target.value.toUpperCase(),
                    }))
                  }
                />
              </div>
              <div className="p-2">
                <p className="text-gray-400">VIN</p>

                <Input
                  id="vin"
                  className="mt-3"
                  step={100}
                  value={VehicleDetails?.vin.toUpperCase()}
                  type="text"
                  onChange={(e) =>
                    setVehicleDetails((prev: any) => ({
                      ...prev,
                      vin: e.target.value.toUpperCase(),
                    }))
                  }
                />
              </div>
              <div className="p-2">
                <p className="text-gray-400">Change Daily Rate</p>
                <Input
                  id="minDays"
                  className="mt-3"
                  step={100}
                  value={VehicleDetails?.daily_rate}
                  type="number"
                  onChange={(e) =>
                    setVehicleDetails((prev: any) => ({
                      ...prev,
                      daily_rate: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="p-2">
                <p className="text-gray-400">Location</p>
                <Select
                  options={profile?.fleetmaster_tenants?.yards
                    ?.map((y) => `${y.title}`)
                    .map((l) => {
                      return {
                        value: l,
                        label: l,
                      };
                    })}

                  defaultValue={VehicleDetails?.location}
                  value={VehicleDetails?.location}
                  placeholder="Change location"
                  onChange={(e) =>
                    setVehicleDetails((prev: any) => ({
                      ...prev,
                      location: e,
                    }))
                  }
                  className="dark:bg-dark-900 mt-3"
                />
              </div>

              <div className="p-2">
                <p className="text-gray-400">Next Service Due</p>
                <Input
                  id="nextService"
                  className="mt-3"
                  value={VehicleDetails?.next_service_due}
                  type="date"
                  onChange={(e) =>
                    setVehicleDetails((prev: any) => ({
                      ...prev,
                      next_service_due: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="p-2">
                <p className="text-gray-400">Minimum Rental Days</p>
                <Input
                  id="minDays"
                  className="mt-3"
                  value={VehicleDetails?.min_rental_days}
                  type="number"
                  onChange={(e) =>
                    setVehicleDetails((prev: any) => ({
                      ...prev,
                      min_rental_days: Number(e.target.value),
                    }))
                  }
                />{" "}
              </div>

              <div className="hidden p-2">
                <p className="text-gray-400">Tracking Provider</p>
                <Select
                  options={[
                    {
                      value: "Tramigo",
                      label: "Tramigo",
                    },
                    {
                      value: "Karooooo",
                      label: "Karooooo",
                    },
                  ]}
                  placeholder="Select a provider"
                  defaultValue={VehicleDetails?.tracker?.provider || ""}
                  onChange={(e) =>
                    setVehicleDetails((prev: any) => ({
                      ...prev,
                      tracker: {
                        provider: e,
                        trackingApiUrl: null,
                      },
                    }))
                  }
                  className="dark:bg-dark-900 mt-3"
                />{" "}
              </div>
            </div>

            <div
              className={
                "mt-3 " +
                (VehicleDetails?.tracker.provider !== null ? "" : "hidden")
              }
            >
              <p className="text-gray-400">Tracking API</p>
              <Input
                id="minDays"
                className="mt-3"
                placeholder="https://example.cpm/api/v1"
                value={VehicleDetails?.tracker?.trackingApiUrl || ""}
                type="text"
                onChange={(e) =>
                  setVehicleDetails((prev: any) => ({
                    ...prev,
                    tracker: {
                      provider: VehicleDetails?.tracker?.provider,
                      trackingApiUrl: e.target.value,
                    },
                  }))
                }
              />{" "}
            </div>
            <Button
              onClick={updateVehicle}
              disabled={
                disableButton || VehicleDetails === originalVehicleDetails
              }
              className="mt-5 w-full"
              size="sm"
            >
              Update Vehicle
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EditVehiclePage;
