"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell } from "lucide-react";
import {
  getNotificationsForUser,
  markNotificationsRead,
} from "@/lib/app-data";

export function NotificationCenter({ recipientId }: { recipientId: string }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const syncNotifications = () => {
      setNotifications(getNotificationsForUser(recipientId));
    };

    syncNotifications();
    const onStorage = (event: StorageEvent) => {
      if (event.key === "notifications") {
        syncNotifications();
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [recipientId]);

  useEffect(() => {
    if (open) {
      const next = markNotificationsRead(recipientId);
      setNotifications(
        next.filter((notification) => notification.recipientId === recipientId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      );
    }
  }, [open, recipientId]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-[color:var(--foreground)]"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 ? (
          <span className="absolute -top-2 -right-2 min-w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold inline-flex items-center justify-center px-1">
            {unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 mt-3 w-[340px] max-w-[calc(100vw-2rem)] rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-2xl p-4 z-50">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="font-semibold">Notifications</h3>
            <span className="text-xs text-[color:var(--muted)]">
              {notifications.length} total
            </span>
          </div>
          <div className="space-y-3 max-h-[360px] overflow-y-auto">
            {notifications.length ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4"
                >
                  <p className="font-semibold text-sm">{notification.title}</p>
                  <p className="text-sm text-[color:var(--muted)] mt-1">
                    {notification.content}
                  </p>
                  <p className="text-xs text-[color:var(--muted)] mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-[20px] border border-dashed border-[color:var(--border)] p-4 text-sm text-[color:var(--muted)]">
                No notifications yet.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
