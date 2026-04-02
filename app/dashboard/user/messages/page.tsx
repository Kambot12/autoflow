"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ImagePlus, Search, Send } from "lucide-react";
import toast from "react-hot-toast";
import { brand } from "@/lib/brand";
import {
  getConversationMessages,
  getCurrentUser,
  getTypingStatus,
  markConversationRead,
  sendAdminMessage,
  setTypingStatus,
  updateUserActivity,
} from "@/lib/app-data";

export default function UserMessagesPage() {
  const [content, setContent] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [image, setImage] = useState("");
  const [adminTyping, setAdminTyping] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      window.location.href = "/auth/login";
      return;
    }
    setCurrentUser(user);
    setMessages(getConversationMessages(user.id));
  }, []);

  const unreadCount = useMemo(
    () => messages.filter((message) => !message.read && message.recipientId === currentUser?.id).length,
    [messages, currentUser]
  );

  const handleSend = () => {
    if ((!content.trim() && !image) || !currentUser) {
      return;
    }
    const sent = sendAdminMessage({
      content: content.trim() || "Image attachment",
      senderId: currentUser.id,
      senderName: currentUser.name,
      image,
    });
    setMessages((current) => [...current, sent]);
    setContent("");
    setImage("");
    setTypingStatus({
      actorId: currentUser.id,
      threadUserId: currentUser.id,
      isTyping: false,
    });
    toast.success("Message sent to admin");
  };

  const filteredMessages = useMemo(
    () =>
      messages.filter((message) =>
        [message.content, message.senderName]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [messages, query]
  );

  useEffect(() => {
    if (!currentUser) return;
    const syncConversation = () => {
      markConversationRead(currentUser.id, currentUser.id);
      setMessages(getConversationMessages(currentUser.id));
      setAdminTyping(
        getTypingStatus({
          actorId: "admin-autoflow",
          threadUserId: currentUser.id,
        })
      );
      updateUserActivity(currentUser.id);
    };

    syncConversation();

    const interval = window.setInterval(syncConversation, 1200);
    const onStorage = (event: StorageEvent) => {
      if (event.key === "messages") {
        syncConversation();
      }
    };

    window.addEventListener("storage", onStorage);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("storage", onStorage);
    };
  }, [currentUser]);

  const onImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className="chat-shell min-h-screen">
      <header className="chat-topbar border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard/user" className="text-[color:var(--muted)] hover:text-[color:var(--foreground)]">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold">{brand.shortName} Messages</h1>
            <p className="text-sm text-[color:var(--muted)]">
              Direct support line for bookings, marketplace, and repairs.
            </p>
          </div>
          <div className="ml-auto rounded-full border px-4 py-2 text-xs font-medium text-[color:var(--muted)] border-[color:var(--border)] bg-[color:var(--surface-soft)]">
            {adminTyping ? `${brand.shortName} is typing...` : `Stored chat with ${brand.shortName}`}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-4 text-sm text-[color:var(--muted)]">
          {unreadCount > 0 ? `${unreadCount} new reply${unreadCount > 1 ? "ies" : ""}` : "All caught up"}
        </div>
        <div className="chat-frame rounded-[30px] overflow-hidden">
          <div className="chat-sidebar border-b p-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--muted)]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search this conversation"
                className="chat-search w-full rounded-3xl px-11 py-3"
              />
            </div>
          </div>
          <div className="chat-thread min-h-[560px] p-4 md:p-6">
            <div className="space-y-4">
              {filteredMessages.length === 0 ? (
                <div className="chat-empty rounded-3xl border border-dashed p-10 text-center text-[color:var(--muted)]">
                  {`Start the conversation with ${brand.shortName}.`}
                </div>
              ) : (
                filteredMessages.map((message, index) => {
                  const mine = message.senderId === currentUser?.id;
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className={`chat-row ${mine ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`chat-bubble ${mine ? "chat-bubble-outgoing" : "chat-bubble-incoming"}`}>
                        <p className="text-[11px] uppercase tracking-[0.24em] mb-2 opacity-65">
                          {mine ? "You" : brand.shortName}
                        </p>
                        <p className="leading-7">{message.content}</p>
                        {message.image ? (
                          <img
                            src={message.image}
                            alt="Message attachment"
                            className="mt-3 rounded-2xl max-h-64 w-full object-cover border border-white/10"
                          />
                        ) : null}
                        <p className="mt-3 text-[11px] opacity-60">
                          {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              )}
              {adminTyping ? (
                <div className="chat-row justify-start">
                  <div className="chat-bubble chat-bubble-incoming">
                    <div className="chat-typing">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className="chat-composer border-t p-4 md:p-5">
            <div className="flex gap-3 items-end">
              <textarea
                value={content}
                onChange={(e) => {
                  const nextValue = e.target.value;
                  setContent(nextValue);
                  if (currentUser) {
                    setTypingStatus({
                      actorId: currentUser.id,
                      threadUserId: currentUser.id,
                      isTyping: nextValue.trim().length > 0,
                    });
                  }
                }}
                className="chat-input flex-1 rounded-3xl px-5 py-4"
                placeholder="Ask about a booking, listing approval, or repair update..."
                rows={2}
              />
              <label className="chat-action rounded-3xl px-4 flex items-center cursor-pointer h-[56px]">
                <ImagePlus className="w-5 h-5" />
                <input type="file" accept="image/*" className="hidden" onChange={onImageUpload} />
              </label>
              <button onClick={handleSend} className="chat-send rounded-3xl h-[56px] px-5 font-semibold">
                <Send className="w-5 h-5" />
              </button>
            </div>
            {image ? (
              <img
                src={image}
                alt="Pending upload"
                className="mt-3 rounded-2xl max-h-44 object-cover border border-[color:var(--border)]"
              />
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
