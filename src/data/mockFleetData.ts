"use client";

export interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  color: string[];
  seats: number;
  category: string;
  owner: string;
  licensePlate: string;
  vin: string;
  nextServiceDue: string;
  status: "Available" | "Not Available";
  dailyRate: number;
  minRentalDays: number;
  imageUrl: string;
  location: string;
  transmission: string;
  group: string;
  description: string;
  driverType?: "Self Drive" | "Chauffeured";
  fuelType: "Petrol/Gasoline" | "Diesel" | "Hybrid" | "Electric" | "Petrol/Hybrid";
  tracker: {
    provider: string | null,
    trackingApiUrl: string | null,
  };

}

export interface Booking {
  tenantId: string,
  id: number;
  date: string;
  vehicleId: number;
  renterName: string;
  renterPhone: string;
  renterID: string;
  pickupLocation: string;
  dropoffLocation: string;
  rentalStart: string;
  rentalEnd: string;
  rentalTime: string;
  rentalDays: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentRef: string;
  bookingStatus: "Reserved" | "Booked" | "Completed" | "Active" | "Cancelled";
  priority?: "High Priority" | "Medium Priority" | "Low Priority";
  vehicleDetails: any; // This will be populated when merging with vehicles data
}

// export const vehicles: Vehicle[] = [
//   {
//     id: 1,
//     make: "Toyota",
//     model: "RAV4 Hybrid",
//     year: 2024,
//     color: ['Silver', 'Black'],
//     seats: 5,
//     category: "SUV",
//     owner: "Fleet Operations",
//     licensePlate: "KDW-123A",
//     vin: "RVJGERJKTH5TO1234",
//     nextServiceDue: "2026-04-10",
//     status: "Available",
//     dailyRate: 7000,
//     minRentalDays: 1,
//     imageUrl: "https://media.drive.com.au/obj/tx_rs:auto:1919:1080:1/driveau/upload/cms/uploads/7ffd7ed0-b2ab-572c-a072-178e89950000",
//     location: "Nairobi Depot",
//     transmission: "Automatic",
//     group: "SUV",
//     description: "The 2024 RAV4 Hybrid combines Toyota's legendary reliability with modern fuel efficiency. Perfect for urban commuting in Nairobi or long-distance travel, offering a spacious interior and advanced safety features. Ideal for clients looking for a sustainable yet powerful SUV experience.",
//     driverType: "Self Drive",
//     fuelType: "Petrol/Gasoline",
//     tracker: {
//       provider: null,
//       trackingApiUrl: null,
//     }
//   },
//   {
//     id: 2,
//     make: "Isuzu",
//     model: "D-Max",
//     year: 2023,
//     color: ['Red', 'Beige'],
//     seats: 5,
//     category: "Pickup",
//     owner: "Field Services",
//     licensePlate: "KBY-555B",
//     vin: "ISUZUDMAX00PICKUP",
//     nextServiceDue: "2025-12-15",
//     status: "Not Available",
//     dailyRate: 9200,
//     minRentalDays: 2,
//     imageUrl: "https://images.carexpert.com.au/crop/1200/630/cms/v1/media/2022-10-2023-isuzu-d-maxhero-3x2-1-1.jpg",
//     location: "Mombasa Yard",
//     transmission: "Manual",
//     group: "Pickup",
//     description: "A rugged workhorse built for tough terrains. This Isuzu D-Max is equipped for field services and heavy-duty logistics. It features a high ground clearance and a reinforced suspension system, making it the go-to choice for off-road projects or transporting cargo to remote locations.",
//     driverType: "Self Drive",
//     fuelType: "Petrol/Gasoline",
//     tracker: {
//       provider: null,
//       trackingApiUrl: null,
//     }
//   },
//   {
//     id: 3,
//     make: "Mercedes-Benz",
//     model: "C 200",
//     year: 2024,
//     color: ['Metallic Gray', 'Beige'],
//     seats: 5,
//     category: "Luxury",
//     owner: "Executive Fleet",
//     licensePlate: "KAK-812C",
//     vin: "MBZC200LUX2024",
//     nextServiceDue: "2026-01-20",
//     status: "Available",
//     dailyRate: 18500,
//     minRentalDays: 1,
//     imageUrl: "https://www.inghamdriven.nz/wp-content/files/stock/INN/11973/24254_01.jpg?width=2048&optimize=medium",
//     location: "Nairobi Executive Garage",
//     transmission: "Automatic",
//     group: "Sedan",
//     description: "The ultimate expression of executive style and comfort.\nThe C 200 offers a whisper-quiet cabin, premium leather upholstery, and state-of-the-art infotainment. Perfect for high-profile business meetings or weddings.",
//     driverType: "Self Drive",
//     fuelType: "Petrol/Gasoline",
//     tracker: {
//       provider: null,
//       trackingApiUrl: null,
//     }
//   },
//   {
//     id: 4,
//     make: "Nissan",
//     model: "Leaf",
//     year: 2025,
//     color: ['Pink', 'Beige'],
//     seats: 5,
//     category: "Electric",
//     owner: "Sustainable Travel",
//     licensePlate: "KBR-909D",
//     vin: "NISSANLEAF2025ELEC",
//     nextServiceDue: "2026-03-04",
//     status: "Not Available",
//     dailyRate: 8500,
//     minRentalDays: 1,
//     imageUrl: "https://images.carsguide.com.au/image/upload/c_fit,h_841,w_1490,f_auto,t_cg_base/v1/editorial/story/hero_image/2025-Nissan-Leaf-Best-Car-Web-1001x565-(1).jpg.jpg",
//     location: "Kisumu Service Center",
//     transmission: "Automatic",
//     group: "Electric",
//     description: "Lead the way in eco-friendly transportation. The 2025 Nissan Leaf is a fully electric hatchback offering instant torque and zero emissions. Ideal for city-based clients in Kisumu or Nairobi who want to minimize their carbon footprint without sacrificing modern tech.",
//     driverType: "Self Drive",
//     fuelType: "Petrol/Gasoline",
//     tracker: {
//       provider: null,
//       trackingApiUrl: null,
//     }
//   },
//   {
//     id: 5,
//     make: "Ford",
//     model: "Transit Custom",
//     year: 2022,
//     color: ['Silver', 'Beige'],
//     seats: 5,
//     category: "Minivan",
//     owner: "Logistics",
//     licensePlate: "KBZ-430E",
//     vin: "FORDTRANSITVAN2022",
//     nextServiceDue: "2025-11-08",
//     status: "Available",
//     dailyRate: 11000,
//     minRentalDays: 3,
//     imageUrl: "https://images.carexpert.com.au/resize/800/-/cms/v1/media/2026-01-ford-transitcustom-trail-19.jpg",
//     location: "Nakuru Warehouse",
//     transmission: "Automatic",
//     group: "Family Vans",
//     description: "Versatile and spacious, the Ford Transit Custom is designed for logistics and group travel. Whether moving equipment or taking the family on a trip, its modular interior and reliable diesel engine provide the efficiency and room you need for long-haul journeys.",
//     driverType: "Self Drive",
//     fuelType: "Petrol/Gasoline",
//     tracker: {
//       provider: null,
//       trackingApiUrl: null,
//     }
//   },
//   {
//     id: 6,
//     make: "Toyota",
//     model: "Corolla",
//     year: 2024,
//     color: ['White', 'Beige'],
//     seats: 5,
//     category: "Economy",
//     owner: "Corporate Rentals",
//     licensePlate: "KCN-199F",
//     vin: "TOYOCOROLLA2024SED",
//     nextServiceDue: "2026-02-18",
//     status: "Not Available",
//     dailyRate: 6500,
//     minRentalDays: 1,
//     imageUrl: "https://media.ed.edmunds-media.com/toyota/corolla/2023/oem/2023_toyota_corolla_sedan_xse_fq_oem_2_1600.jpg",
//     location: "Nairobi Central",
//     transmission: "Automatic",
//     group: "Sedan",
//     description: "The gold standard for corporate efficiency. This 2024 Corolla is reliable, fuel-efficient, and easy to drive in Nairobi's busy traffic. It provides a clean, professional look for corporate clients and daily commuters alike.",
//     driverType: "Self Drive",
//     fuelType: "Petrol/Gasoline",
//     tracker: {
//       provider: null,
//       trackingApiUrl: null,
//     }
//   },
//   {
//     id: 7,
//     make: "BMW",
//     model: "X4",
//     year: 2024,
//     color: ['White', 'Beige'],
//     seats: 5,
//     category: "SUV",
//     owner: "Premium Fleet",
//     licensePlate: "KDL-221G",
//     vin: "BMWX42024CROSS",
//     nextServiceDue: "2026-05-28",
//     status: "Available",
//     dailyRate: 16200,
//     minRentalDays: 1,
//     imageUrl: "https://kai-and-karo.ams3.cdn.digitaloceanspaces.com/media/vehicles/images/d92eef83-0027-44fe-8977-c49191990270.jpeg",
//     location: "Nairobi Premium Garage",
//     transmission: "Automatic",
//     group: "Crossover",
//     description: "The BMW X4 blends SUV capability with the sporty profile of a coupe. High performance meets high style, featuring xDrive all-wheel drive and a premium interior. A top-tier choice for clients who want to make a statement while enjoying a dynamic driving experience.",
//     driverType: "Self Drive",
//     fuelType: "Petrol/Gasoline",
//     tracker: {
//       provider: null,
//       trackingApiUrl: null,
//     }
//   },
//   {
//     id: 8,
//     make: "Toyota",
//     model: "Prado TX",
//     year: 2020,
//     color: ['Black', 'Red'],
//     seats: 7,
//     category: "Luxury",
//     owner: "Premium Fleet",
//     licensePlate: "KDW-221F",
//     vin: "TYTCTX2024CROSS",
//     nextServiceDue: "2026-05-28",
//     status: "Available",
//     dailyRate: 13200,
//     minRentalDays: 2,
//     imageUrl: "https://motorplug.co.ke/wp-content/uploads/2025/11/a644c586-0007-48f9-b6bd-093b01c1ceea.jpeg",
//     location: "Nairobi Premium Garage",
//     transmission: "Automatic",
//     group: "SUV",
//     description: "The king of Kenyan roads. The Land Cruiser Prado TX offers unparalleled 4x4 capability and luxury. With 7 seats, it is perfect for family safaris, VIP transport, or traversing rough terrain without compromising on passenger comfort and safety.",
//     driverType: "Chauffeured",
//     fuelType: "Petrol/Gasoline",
//     tracker: {
//       provider: null,
//       trackingApiUrl: null,
//     }
//   },
//   {
//     id: 9,
//     make: "Mazda",
//     model: "CX-5 Skyactiv TX",
//     year: 2020,
//     color: ['Red', 'Brown'],
//     seats: 5,
//     category: "SUV",
//     owner: "Premium Fleet",
//     licensePlate: "KDZ-721F",
//     vin: "TYTCTX2024CROSS",
//     nextServiceDue: "2026-06-28",
//     status: "Available",
//     dailyRate: 7200,
//     minRentalDays: 2,
//     imageUrl: "https://wehco.media.clients.ellingtoncms.com/timesfreepress/img/photos/2020/02/07/1581110150_IMG_6651_gs_t1200.jpg?57a0c2296240c280e9492005c3cad63e7cbe80f4",
//     location: "Nairobi Premium Garage",
//     transmission: "Automatic",
//     group: "SUV",
//     description: "The 2020 Mazda CX-5 finished in Soul Red Crystal Metallic is a highly popular, premium compact crossover SUV known for its striking look and upscale performance. Locally, ex-Japan and foreign-used models are readily available for purchase.",
//     driverType: "Self Drive",
//     fuelType: "Diesel",
//     tracker: {
//       provider: null,
//       trackingApiUrl: null,
//     }
//   },
//   {
//     "id": 10,
//     "make": "Nissan",
//     "model": "Note e-POWER",
//     "year": 2020,
//     "color": ["White", "Dark Blue"],
//     "seats": 5,
//     "category": "Economy",
//     "owner": "Premium Fleet",
//     "licensePlate": "KDH-412A",
//     "vin": "E12-610294NSNOTE",
//     "nextServiceDue": "2026-07-15",
//     "status": "Available",
//     "dailyRate": 4000,
//     "minRentalDays": 2,
//     "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaLjgKUcYrHhGhJtlIGkEntpF6tc52tIFL9A&s",
//     "location": "Thika Yard Main",
//     "transmission": "Automatic",
//     "group": "Hatchback",
//     "description": "The 2020 Nissan Note e-POWER offers an exceptionally smooth, electric motor drive experience powered by a highly efficient 1.2L gasoline engine acting as a generator. Ideal for urban commutes across Nairobi and Thika with unmatched fuel economy, premium safety features, and surprisingly spacious legroom.",
//     "driverType": "Self Drive",
//     "fuelType": "Petrol/Hybrid",
//     "tracker": {
//       "provider": null,
//       "trackingApiUrl": null
//     }
//   },
//   {
//     "id": 11,
//     "make": "Toyota",
//     "model": "Noah W×B III",
//     "year": 2019,
//     "color": ["White", "White Pearl"],
//     "seats": 8,
//     "category": "Minivan",
//     "owner": "Premium Fleet",
//     "licensePlate": "KDG-895C",
//     "vin": "ZRR80-039418TYNOAH",
//     "nextServiceDue": "2026-08-02",
//     "status": "Available",
//     "dailyRate": 7500,
//     "minRentalDays": 3,
//     "imageUrl": "https://gybird.co.ke/site/images/car_images/untitled-design-2026-03-13t163415-081-1773409350.jpg",
//     "location": "Thika Yard Main",
//     "transmission": "Automatic",
//     "group": "Family Fun",
//     "description": "The 2019 Toyota Noah W×B (White & Black edition) is a premium, high-spec 8-seater family van featuring a sleek dark chrome finish, luxurious half-leather seating, and dual automatic sliding doors. Outfitted with Toyota Safety Sense, it provides an exceptionally comfortable, secure, and reliable ride for long-distance group travel or family getaways.",
//     "driverType": "Self Drive",
//     "fuelType": "Petrol/Gasoline",
//     "tracker": {
//       "provider": null,
//       "trackingApiUrl": null
//     }
//   }
// ];

// export const bookings: Booking[] = [
//   {
//     id: 101,
//     date: '10-05-2026T10:00:00',
//     vehicleId: 2,
//     renterName: "Miriam Otieno",
//     renterPhone: "+254 712 345 678",
//     renterID: "87654321",
//     pickupLocation: "Mombasa Yard",
//     dropoffLocation: "Malindi Branch",
//     rentalStart: "2026-06-01",
//     rentalEnd: "2026-06-04",
//     rentalTime: '12:30',
//     rentalDays: 3,
//     discount: 0,
//     total: 27600,
//     paymentMethod: 'M-PESA',
//     paymentRef: 'QXR47579384XC38984',
//     bookingStatus: "Active",
//     priority: "High Priority",
//     vehicleDetails: null
//   },
//   {
//     id: 102,
//     date: '10-05-2026T10:00:00',
//     vehicleId: 6,
//     renterName: "David Mwangi",
//     renterPhone: "+254 733 456 789",
//     renterID: "12345678",
//     pickupLocation: "Nairobi Central",
//     dropoffLocation: "Nairobi Central",
//     rentalStart: "2026-06-05",
//     rentalEnd: "2026-06-08",
//     rentalTime: '06:00',
//     rentalDays: 3,
//     discount: 0,
//     total: 19500,
//     paymentMethod: 'M-PESA',
//     paymentRef: 'QXR47579384XC38984',
//     bookingStatus: "Active",
//     priority: "High Priority",
//     vehicleDetails: null
//   },
//   {
//     id: 103,
//     date: '10-05-2026T10:00:00',
//     vehicleId: 1,
//     renterName: "Sarah Njoroge",
//     renterPhone: "+254 722 123 456",
//     renterID: "56789012",
//     pickupLocation: "Nairobi Depot",
//     dropoffLocation: "Kisumu Branch",
//     rentalStart: "2026-06-10",
//     rentalEnd: "2026-06-14",
//     rentalTime: '10:00',
//     rentalDays: 4,
//     discount: 0,
//     total: 28000,
//     paymentMethod: 'M-PESA',
//     paymentRef: 'QXR47579384XC38984',
//     bookingStatus: "Reserved",
//     priority: "Medium Priority",
//     vehicleDetails: null
//   },
//   {
//     id: 104,
//     date: '10-05-2026T10:00:00',
//     vehicleId: 7,
//     renterName: "James Kariuki",
//     renterPhone: "+254 722 987 654",
//     renterID: "34567890",
//     pickupLocation: "Nairobi Premium Garage",
//     dropoffLocation: "Nairobi Premium Garage",
//     rentalStart: "2026-06-12",
//     rentalEnd: "2026-06-23",
//     rentalTime: '10:30',
//     rentalDays: 11,
//     discount: 0,
//     total: 178200,
//     paymentMethod: 'M-PESA',
//     paymentRef: 'QXR47579384XC38984',
//     bookingStatus: "Active",
//     priority: "High Priority",
//     vehicleDetails: null
//   },
//   {
//     id: 105,
//     date: '10-05-2026T10:00:00',
//     vehicleId: 5,
//     renterName: "Alicia Wanjiru",
//     renterPhone: "+254 721 555 333",
//     renterID: "78901234",
//     pickupLocation: "Nakuru Warehouse",
//     dropoffLocation: "Nakuru Warehouse",
//     rentalStart: "2026-06-02",
//     rentalEnd: "2026-06-05",
//     rentalTime: '09:30',
//     rentalDays: 3,
//     discount: 0,
//     total: 33000,
//     paymentMethod: 'M-PESA',
//     paymentRef: 'QXR47579384XC38984',
//     bookingStatus: "Completed",
//     priority: "Low Priority",
//     vehicleDetails: null
//   },
//   {
//     id: 106,
//     date: '16-05-2026T10:00:00',
//     vehicleId: 5,
//     renterName: "Alicia Wanjiru",
//     renterPhone: "+254 721 555 333",
//     renterID: "78901234",
//     pickupLocation: "Nakuru Warehouse",
//     dropoffLocation: "Nakuru Warehouse",
//     rentalStart: "2026-06-05",
//     rentalEnd: "2026-06-15",
//     rentalTime: '11:30',
//     rentalDays: 10,
//     discount: 0,
//     total: 33000,
//     paymentMethod: 'M-PESA',
//     paymentRef: 'QXR47579384XC38984',
//     bookingStatus: "Completed",
//     priority: "Low Priority",
//     vehicleDetails: null
//   },
// ];
