"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ImagePlus, Search, Send } from "lucide-react";
import { brand } from "@/lib/brand";
import {
  getAdminInboxThreads,
  getConversationMessages,
  getPresenceLabel,
  getTypingStatus,
  markConversationRead,
  sendAdminReply,
  setTypingStatus,
  updateUserActivity,
} from "@/lib/app-data";

export default function AdminMessagesPage() {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [reply, setReply] = useState("");
  const [threads, setThreads] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [messageQuery, setMessageQuery] = useState("");
  const [image, setImage] = useState("");
  const [userTyping, setUserTyping] = useState(false);

  useEffect(() => {
    const syncThreads = () => {
      const nextThreads = getAdminInboxThreads();
      setThreads(nextThreads);
      if (!selectedUserId && nextThreads[0]) {
        setSelectedUserId(nextThreads[0].user.id);
      }
    };

    syncThreads();
    updateUserActivity("admin-autoflow");

    const interval = window.setInterval(syncThreads, 1200);
    const onStorage = (event: StorageEvent) => {
      if (event.key === "messages") {
        syncThreads();
      }
    };

    window.addEventListener("storage", onStorage);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("storage", onStorage);
    };
  }, [selectedUserId]);

  useEffect(() => {
    if (selectedUserId) {
      markConversationRead(selectedUserId, "admin-autoflow");
      setThreads(getAdminInboxThreads());
      setUserTyping(
        getTypingStatus({
          actorId: selectedUserId,
          threadUserId: selectedUserId,
        })
      );
    }
  }, [selectedUserId]);

  const filteredThreads = useMemo(
    () =>
      threads.filter((thread) =>
        [thread.user.name, thread.user.email, thread.latestMessage?.content]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [threads, query]
  );

  const selectedThread = useMemo(
    () => threads.find((thread) => thread.user.id === selectedUserId) || null,
    [threads, selectedUserId]
  );
  const conversation = useMemo(
    () => (selectedUserId ? getConversationMessages(selectedUserId) : []),
    [selectedUserId, threads]
  );
  const filteredConversation = useMemo(
    () =>
      conversation.filter((message) =>
        [message.content, message.senderName]
          .join(" ")
          .toLowerCase()
          .includes(messageQuery.toLowerCase())
      ),
    [conversation, messageQuery]
  );

  const sendReply = () => {
    if ((!reply.trim() && !image) || !selectedUserId) return;
    sendAdminReply({
      content: reply.trim() || "Image attachment",
      recipientId: selectedUserId,
      image,
    });
    setThreads(getAdminInboxThreads());
    setReply("");
    setImage("");
    setTypingStatus({
      actorId: "admin-autoflow",
      threadUserId: selectedUserId,
      isTyping: false,
    });
  };

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
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard/admin" className="text-[color:var(--muted)] hover:text-[color:var(--foreground)]">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{brand.shortName} Inbox</h1>
            <p className="text-sm text-[color:var(--muted)]">Respond to users from one clean inbox.</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-[320px,1fr] gap-6">
        <aside className="chat-sidebar rounded-[28px] p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--muted)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search inbox"
              className="chat-search w-full rounded-3xl px-11 py-3"
            />
          </div>
          {filteredThreads.map((thread) => (
            <button
              key={thread.user.id}
              onClick={() => setSelectedUserId(thread.user.id)}
              className={`w-full text-left rounded-[24px] p-4 transition-all ${
                selectedUserId === thread.user.id ? "chat-thread-card-active" : "chat-thread-card"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={thread.user.avatar}
                    alt={thread.user.name}
                    className="w-12 h-12 rounded-full object-cover border border-[color:var(--border)]"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{thread.user.name}</p>
                    <p className="text-sm opacity-70 truncate">{thread.latestMessage?.content || thread.user.email}</p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[11px] opacity-60">
                    {thread.latestMessage
                      ? new Date(thread.latestMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      : ""}
                  </p>
                  {thread.unreadCount > 0 ? (
                    <span className="mt-2 inline-flex min-w-6 h-6 items-center justify-center rounded-full bg-red-500 px-2 text-xs font-bold text-white">
                      {thread.unreadCount}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="mt-2 pl-[60px]">
                <p className="text-xs opacity-60">{thread.user.email}</p>
                <p className="text-xs opacity-60 mt-1">{getPresenceLabel(thread.user.id)}</p>
              </div>
            </button>
          ))}
        </aside>

        <section className="chat-frame rounded-[28px] overflow-hidden">
          <div className="chat-topbar border-b p-5">
            <h2 className="text-lg font-bold">
              {selectedThread?.user.name || "Select a user"}
            </h2>
            <p className="text-sm text-[color:var(--muted)]">
              {selectedThread?.user.email || "Open any thread from the inbox to reply"}
            </p>
            {selectedThread ? (
              <p className="text-xs text-[color:var(--muted)] mt-1">
                {getPresenceLabel(selectedThread.user.id)}
              </p>
            ) : null}
            <div className="relative mt-4">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--muted)]" />
              <input
                value={messageQuery}
                onChange={(e) => setMessageQuery(e.target.value)}
                placeholder="Search inside this conversation"
                className="chat-search w-full rounded-3xl px-11 py-3"
              />
            </div>
          </div>
          <div className="chat-thread min-h-[460px] p-4 md:p-6">
            <div className="space-y-4">
            {filteredConversation.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className={`chat-row ${message.senderId === "admin-autoflow" ? "justify-end" : "justify-start"}`}
              >
                <div className={`chat-bubble ${message.senderId === "admin-autoflow" ? "chat-bubble-outgoing" : "chat-bubble-incoming"}`}>
                  <p className="text-xs uppercase tracking-[0.2em] opacity-70 mb-2">
                    {message.senderId === "admin-autoflow" ? brand.shortName : message.senderName || "User"}
                  </p>
                  <p className="leading-7">{message.content}</p>
                  {message.image ? (
                    <img
                      src={message.image}
                      alt="Message attachment"
                      className="mt-3 rounded-2xl max-h-64 object-cover border border-black/10"
                    />
                  ) : null}
                  <p className="mt-3 text-[11px] opacity-60">
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
            </div>
          </div>
          {userTyping ? (
            <div className="px-6 pb-2">
              <div className="chat-bubble chat-bubble-incoming max-w-[220px]">
                <div className="chat-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          ) : null}

          <div className="chat-composer border-t p-4 md:p-5">
            <div className="flex gap-3 items-end">
            <textarea
              value={reply}
              onChange={(e) => {
                const nextValue = e.target.value;
                setReply(nextValue);
                if (selectedUserId) {
                  setTypingStatus({
                    actorId: "admin-autoflow",
                    threadUserId: selectedUserId,
                    isTyping: nextValue.trim().length > 0,
                  });
                }
              }}
              className="chat-input flex-1 rounded-3xl px-5 py-4"
              placeholder="Reply to the selected user..."
              rows={2}
            />
            <label className="chat-action rounded-3xl px-4 flex items-center cursor-pointer h-[56px]">
              <ImagePlus className="w-5 h-5" />
              <input type="file" accept="image/*" className="hidden" onChange={onImageUpload} />
            </label>
            <button onClick={sendReply} className="chat-send rounded-3xl px-5 text-white h-[56px]">
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
        </section>
      </main>
    </div>
  );
}
