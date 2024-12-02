import { useState } from "react";
import { Bell, Check, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New message received", description: "You have a new message from John Doe", time: "2 minutes ago", unread: true },
    { id: 2, title: "Project update", description: "Your project 'Awesome App' has been updated", time: "1 hour ago", unread: true },
    { id: 3, title: "Meeting reminder", description: "Team meeting starts in 30 minutes", time: "3 hours ago", unread: false },
    { id: 4, title: "Task completed", description: "You've completed the task 'Implement dark mode'", time: "Yesterday", unread: false },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const toggleRead = (id) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, unread: !n.unread } : n
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Notifications
          </h1>
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 rounded-full bg-blue-500 text-white">
              {unreadCount} unread
            </span>
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-gray-300 border border-gray-600 rounded-md hover:bg-gray-700 hover:text-white transition duration-300"
            >
              <Check className="inline h-5 w-5 mr-2" />
              Mark all as read
            </button>
          </div>
        </header>

        {/* Notifications */}
        <div className="bg-gray-800 border border-gray-700 rounded-md shadow-lg">
          <div className="border-b border-gray-700 px-4 py-2">
            <div className="text-xl text-white flex items-center">
              <Bell className="mr-2 h-6 w-6 text-blue-400" />
              Recent Notifications
            </div>
          </div>
          <div className="p-6 space-y-4">
            <AnimatePresence>
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className={`p-4 rounded-lg ${
                    notification.unread ? "bg-gray-700" : "bg-gray-800"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white flex items-center">
                        {notification.title}
                        {notification.unread && (
                          <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </h3>
                      <p className="text-gray-400 mt-1">
                        {notification.description}
                      </p>
                      <span className="text-xs text-gray-500 mt-2 block">
                        {notification.time}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleRead(notification.id)}
                        className={`p-2 rounded-md ${
                          notification.unread
                            ? "text-blue-400 hover:text-blue-300 hover:bg-blue-900"
                            : "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                        } transition`}
                      >
                        {notification.unread ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 rounded-md text-red-400 hover:text-red-300 hover:bg-red-900 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
