// Storage service for localStorage management
const DATA_NAMESPACE = "autoflow-reset-2026-03-31";
const dataKey = (key: string) => `${DATA_NAMESPACE}:${key}`;

export const storage = {
  // Auth
  setUser: (user: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  },
  getUser: () => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("user");
      return data ? JSON.parse(data) : null;
    }
    return null;
  },
  clearUser: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("sessionToken");
      localStorage.removeItem("adminToken");
    }
  },

  setUsers: (users: any[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(dataKey("users"), JSON.stringify(users));
    }
  },
  getUsers: () => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(dataKey("users"));
      return data ? JSON.parse(data) : [];
    }
    return [];
  },

  // Vehicles
  setVehicles: (vehicles: any[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(dataKey("vehicles"), JSON.stringify(vehicles));
    }
  },
  getVehicles: () => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(dataKey("vehicles"));
      return data ? JSON.parse(data) : [];
    }
    return [];
  },

  // Appointments
  setAppointments: (appointments: any[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(dataKey("appointments"), JSON.stringify(appointments));
    }
  },
  getAppointments: () => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(dataKey("appointments"));
      return data ? JSON.parse(data) : [];
    }
    return [];
  },

  // Repairs
  setRepairs: (repairs: any[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(dataKey("repairs"), JSON.stringify(repairs));
    }
  },
  getRepairs: () => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(dataKey("repairs"));
      return data ? JSON.parse(data) : [];
    }
    return [];
  },

  // Messages
  setMessages: (messages: any[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(dataKey("messages"), JSON.stringify(messages));
    }
  },
  getMessages: () => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(dataKey("messages"));
      return data ? JSON.parse(data) : [];
    }
    return [];
  },

  // Notifications
  setNotifications: (notifications: any[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(dataKey("notifications"), JSON.stringify(notifications));
    }
  },
  getNotifications: () => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(dataKey("notifications"));
      return data ? JSON.parse(data) : [];
    }
    return [];
  },

  // Emails
  setEmails: (emails: any[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(dataKey("emails"), JSON.stringify(emails));
    }
  },
  getEmails: () => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(dataKey("emails"));
      return data ? JSON.parse(data) : [];
    }
    return [];
  },

  // Listings
  setListings: (listings: any[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(dataKey("listings"), JSON.stringify(listings));
    }
  },
  getListings: () => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(dataKey("listings"));
      return data ? JSON.parse(data) : [];
    }
    return [];
  },

  // Receipts
  setReceipts: (receipts: any[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(dataKey("receipts"), JSON.stringify(receipts));
    }
  },
  getReceipts: () => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(dataKey("receipts"));
      return data ? JSON.parse(data) : [];
    }
    return [];
  },
};
