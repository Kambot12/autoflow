export const carMakes = [
  "Toyota",
  "Honda",
  "Lexus",
  "Mercedes-Benz",
  "BMW",
  "Audi",
  "Volkswagen",
  "Ford",
  "Chevrolet",
  "Hyundai",
  "Kia",
  "Nissan",
  "Peugeot",
  "Mazda",
  "Suzuki",
  "Land Rover",
  "Tesla",
  "Volvo",
  "Jeep",
  "Mitsubishi",
  "Subaru",
];

export const carModels: Record<string, string[]> = {
  Toyota: ["Camry", "Corolla", "RAV4", "Highlander", "Prius", "Yaris"],
  Honda: ["Civic", "Accord", "CR-V", "Pilot", "Fit", "Odyssey"],
  Lexus: ["RX", "ES", "NX", "IS", "UX", "GX"],
  "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLE", "GLC", "A-Class"],
  BMW: ["3 Series", "5 Series", "7 Series", "X3", "X5", "X7"],
  Audi: ["A3", "A4", "A6", "Q3", "Q5", "Q7"],
  Volkswagen: ["Golf", "Passat", "Tiguan", "Jetta", "Atlas", "Touareg"],
  Ford: ["Mustang", "F-150", "Focus", "Escape", "Edge", "Explorer"],
  Chevrolet: ["Cruze", "Malibu", "Equinox", "Tahoe", "Silverado", "Traverse"],
  Hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Venue", "Kona"],
  Kia: ["Forte", "Optima", "Sportage", "Sorento", "Telluride", "Niro"],
  Nissan: ["Altima", "Maxima", "Rogue", "Pathfinder", "Sentra", "Versa"],
  Peugeot: ["208", "308", "3008", "5008", "2008", "e-2008"],
  Mazda: ["Mazda2", "Mazda3", "Mazda6", "CX-3", "CX-5", "CX-9"],
  Suzuki: ["Swift", "Baleno", "Vitara", "S-Cross", "Jimny", "Ertiga"],
  "Land Rover": ["Discovery", "Defender", "Range Rover Evoque", "Range Rover Sport", "Freelander", "Velar"],
  Tesla: ["Model 3", "Model S", "Model X", "Model Y", "Cybertruck"],
  Volvo: ["S60", "S90", "XC40", "XC60", "XC90", "V60"],
  Jeep: ["Wrangler", "Cherokee", "Grand Cherokee", "Compass", "Renegade", "Gladiator"],
  Mitsubishi: ["Lancer", "Outlander", "Pajero", "ASX", "Eclipse Cross", "Triton"],
  Subaru: ["Impreza", "Legacy", "Forester", "Outback", "XV", "WRX"],
};

export const serviceTypes = [
  "Engine Repair",
  "Oil Change",
  "Brake Service",
  "Transmission Repair",
  "AC Repair",
  "Electrical Diagnostics",
  "Tire Replacement",
  "General Servicing",
  "Battery Replacement",
  "Suspension Work",
];

export const appointmentStatuses = [
  "Pending",
  "Confirmed",
  "In Progress",
  "Completed",
  "Cancelled",
];

export const repairStatuses = ["Pending", "In Progress", "Completed"];

export const repairWorkflowStages = [
  "Pending",
  "Estimate Preparation In Progress",
  "Awaiting Approval",
  "Awaiting Payment",
  "Workshop Repair In Progress",
  "Job Completed",
  "Awaiting Collection",
];
