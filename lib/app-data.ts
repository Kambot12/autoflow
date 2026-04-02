import { storage } from "@/lib/storage";
import { AppNotification, Listing, Message, User, Vehicle } from "@/lib/types";
import { brand } from "@/lib/brand";

export const ADMIN_EMAIL = "kamsichimere@gmail.com";
export const ADMIN_USER_ID = "admin-autoflow";

const palette = [
  ["#dc2626", "#fb7185"],
  ["#0f172a", "#2563eb"],
  ["#059669", "#14b8a6"],
  ["#7c3aed", "#ec4899"],
  ["#f97316", "#facc15"],
];

export const createAvatar = (name = `${brand.shortName} User`) => {
  const index = Math.abs(
    name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
  ) % palette.length;
  const [start, end] = palette[index];
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "AF";

  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
    initials
  )}&backgroundType=gradientLinear&backgroundColor=${start.replace(
    "#",
    ""
  )},${end.replace("#", "")}`;
};

export const normalizeUser = (user: User): User => ({
  ...user,
  avatar: user.avatar || user.image || createAvatar(user.name),
  image: user.image || user.avatar || createAvatar(user.name),
  phone: user.phone || "",
  address: user.address || "",
  bio: user.bio || "",
});

export const getUsers = (): User[] => {
  const users = storage.getUsers() as User[];
  return users.map(normalizeUser);
};

export const saveUsers = (users: User[]) => {
  storage.setUsers(users.map(normalizeUser));
};

export const upsertUser = (user: User) => {
  const normalized = normalizeUser(user);
  const users = getUsers();
  const nextUsers = users.some((entry) => entry.id === normalized.id)
    ? users.map((entry) => (entry.id === normalized.id ? normalized : entry))
    : [...users, normalized];

  saveUsers(nextUsers);
  storage.setUser(normalized);
  return normalized;
};

export const getCurrentUser = () => {
  const user = storage.getUser() as User | null;
  return user ? normalizeUser(user) : null;
};

export const ensureAdminUser = () => {
  const users = getUsers();
  const existing = users.find((user) => user.id === ADMIN_USER_ID);
  if (existing) {
    return existing;
  }

  const admin = normalizeUser({
    id: ADMIN_USER_ID,
    email: ADMIN_EMAIL,
    name: brand.supportName,
    role: "admin",
    createdAt: new Date().toISOString(),
  });

  saveUsers([...users, admin]);
  return admin;
};

export const getVehiclesForUser = (userId: string) =>
  (storage.getVehicles() as Vehicle[]).filter((vehicle) => vehicle.userId === userId);

export const saveVehicleForUser = (vehicle: Vehicle) => {
  const vehicles = storage.getVehicles() as Vehicle[];
  storage.setVehicles([...vehicles, vehicle]);
};

export const getListings = () => storage.getListings() as Listing[];

export const saveListings = (listings: Listing[]) => storage.setListings(listings);

export const getMessages = () => storage.getMessages() as Message[];

export const saveMessages = (messages: Message[]) => storage.setMessages(messages);

export const getNotifications = () =>
  storage.getNotifications() as AppNotification[];

export const saveNotifications = (notifications: AppNotification[]) =>
  storage.setNotifications(notifications);

const PRESENCE_KEY = "chatPresence";

const getPresenceStore = () => {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(PRESENCE_KEY) || "{}");
  } catch {
    return {};
  }
};

const savePresenceStore = (value: Record<string, any>) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PRESENCE_KEY, JSON.stringify(value));
};

export const updateUserActivity = (userId: string) => {
  const presence = getPresenceStore();
  presence[userId] = {
    ...(presence[userId] || {}),
    lastSeenAt: new Date().toISOString(),
  };
  savePresenceStore(presence);
};

export const setTypingStatus = ({
  actorId,
  threadUserId,
  isTyping,
}: {
  actorId: string;
  threadUserId: string;
  isTyping: boolean;
}) => {
  const presence = getPresenceStore();
  presence.typing = presence.typing || {};
  const key = `${actorId}:${threadUserId}`;
  presence.typing[key] = isTyping ? new Date().toISOString() : null;
  savePresenceStore(presence);
};

export const getTypingStatus = ({
  actorId,
  threadUserId,
}: {
  actorId: string;
  threadUserId: string;
}) => {
  const presence = getPresenceStore();
  const stamp = presence.typing?.[`${actorId}:${threadUserId}`];
  if (!stamp) return false;
  return Date.now() - new Date(stamp).getTime() < 4000;
};

export const getPresenceLabel = (userId: string) => {
  const presence = getPresenceStore();
  const stamp = presence[userId]?.lastSeenAt;
  if (!stamp) return "recently inactive";
  const diff = Date.now() - new Date(stamp).getTime();
  if (diff < 90 * 1000) return "online now";
  if (diff < 15 * 60 * 1000) return "active recently";
  return "offline";
};

export const getConversationMessages = (userId: string) =>
  getMessages()
    .filter(
      (message) =>
        message.type === "text" &&
        ((message.senderId === userId && message.recipientId === ADMIN_USER_ID) ||
          (message.senderId === ADMIN_USER_ID && message.recipientId === userId))
    )
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

export const markConversationRead = (userId: string, viewerId: string) => {
  const nextMessages = getMessages().map((message) => {
    if (
      viewerId === ADMIN_USER_ID &&
      message.senderId === userId &&
      message.recipientId === ADMIN_USER_ID
    ) {
      return { ...message, read: true };
    }

    if (
      viewerId === userId &&
      message.senderId === ADMIN_USER_ID &&
      message.recipientId === userId
    ) {
      return { ...message, read: true };
    }

    return message;
  });

  saveMessages(nextMessages);
  return nextMessages;
};

export const sendAdminReply = ({
  content,
  recipientId,
  image,
}: {
  content: string;
  recipientId: string;
  image?: string;
}) => {
  const messages = getMessages();
  const newMessage: Message = {
    id: `msg_${Math.random().toString(36).slice(2, 10)}`,
    senderId: ADMIN_USER_ID,
    senderName: brand.supportName,
    recipientId,
    content,
    image,
    type: "text",
    createdAt: new Date().toISOString(),
    read: false,
  };
  saveMessages([...messages, newMessage]);
  return newMessage;
};

export const sendSystemAlert = ({
  recipientId,
  content,
}: {
  recipientId: string;
  content: string;
}) => {
  return sendNotification({
    recipientId,
    title: `${brand.shortName} update`,
    content,
    category: "system",
  });
};

export const getAdminInboxThreads = () => {
  const users = getUsers().filter((user) => user.role !== "admin");
  const messages = getMessages();

  return users
    .map((user) => {
      const conversation = getConversationMessages(user.id);
      const latestMessage = conversation[conversation.length - 1] || null;
      const unreadCount = messages.filter(
        (message) =>
          message.senderId === user.id &&
          message.recipientId === ADMIN_USER_ID &&
          !message.read
      ).length;

      return {
        user,
        conversation,
        latestMessage,
        unreadCount,
      };
    })
    .filter((thread) => thread.conversation.length > 0)
    .sort((a, b) => {
      const aTime = a.latestMessage
        ? new Date(a.latestMessage.createdAt).getTime()
        : 0;
      const bTime = b.latestMessage
        ? new Date(b.latestMessage.createdAt).getTime()
        : 0;
      return bTime - aTime;
    });
};

export const sendAdminMessage = ({
  content,
  senderId,
  senderName,
  image,
}: {
  content: string;
  senderId: string;
  senderName: string;
  image?: string;
}) => {
  const messages = getMessages();
  const newMessage: Message = {
    id: `msg_${Math.random().toString(36).slice(2, 10)}`,
    senderId,
    senderName,
    recipientId: ADMIN_USER_ID,
    content,
    image,
    type: "text",
    createdAt: new Date().toISOString(),
    read: false,
  };
  saveMessages([...messages, newMessage]);
  sendNotification({
    recipientId: ADMIN_USER_ID,
    title: "New customer message",
    content: `${senderName} sent a new message.`,
    category: "message",
  });
  return newMessage;
};

export const sendNotification = ({
  recipientId,
  title,
  content,
  category,
}: {
  recipientId: string;
  title: string;
  content: string;
  category: AppNotification["category"];
}) => {
  const notifications = getNotifications();
  const newNotification: AppNotification = {
    id: `note_${Math.random().toString(36).slice(2, 10)}`,
    recipientId,
    title,
    content,
    category,
    createdAt: new Date().toISOString(),
    read: false,
  };
  saveNotifications([...notifications, newNotification]);
  return newNotification;
};

export const getNotificationsForUser = (recipientId: string) =>
  getNotifications()
    .filter((notification) => notification.recipientId === recipientId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

export const markNotificationsRead = (recipientId: string) => {
  const nextNotifications = getNotifications().map((notification) =>
    notification.recipientId === recipientId
      ? { ...notification, read: true }
      : notification
  );
  saveNotifications(nextNotifications);
  return nextNotifications;
};
