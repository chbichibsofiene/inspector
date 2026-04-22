import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getNotifications, markAsRead, markAllAsRead } from "../api/notifications";
import { Bell, CheckSquare, Calendar, ClipboardList, AlertCircle, Info } from "lucide-react";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // 30s polling
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      const notifs = res.data?.data || [];
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.isRead).length);
    } catch (e) {
      console.error("Failed to fetch notifications");
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await markAsRead(notif.id);
        setUnreadCount(prev => Math.max(0, prev - 1));
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
      } catch (e) {
        console.error("Failed to mark as read");
      }
    }
    setOpen(false);
    if (notif.targetUrl) {
      navigate(notif.targetUrl);
    }
  };

  const handleMarkAllAsRead = async (e) => {
    e.stopPropagation();
    try {
      await markAllAsRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {}
  };

  const getIcon = (type) => {
    switch(type) {
      case "QUIZ_ASSIGNED": return <ClipboardList size={18} color="#3b82f6" />;
      case "QUIZ_SUBMITTED": return <CheckSquare size={18} color="#10b981" />;
      case "ACTIVITY_INVITE":
      case "ACTIVITY_REMINDER": return <Calendar size={18} color="#8b5cf6" />;
      default: return <Info size={18} color="#64748b" />;
    }
  };

  const formatTimeAgo = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMins = Math.floor((now - d) / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return `${Math.floor(diffHrs / 24)}d ago`;
  };

  return (
    <div className="notification-wrapper" ref={dropdownRef}>
      <button className="bell-trigger" onClick={() => setOpen(!open)}>
        <Bell size={20} />
        {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="notification-dropdown">
          <div className="dropdown-header">
            <h4>Notifications</h4>
            {unreadCount > 0 && (
              <button className="mark-all-btn" onClick={handleMarkAllAsRead}>Mark all as read</button>
            )}
          </div>
          
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="empty-notifs">
                <AlertCircle size={24} />
                <p>You have no notifications</p>
              </div>
            ) : (
              notifications.slice(0, 15).map(n => (
                <div 
                  key={n.id} 
                  className={`notif-item ${!n.isRead ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(n)}
                >
                  <div className="notif-icon-wrapper">
                    {getIcon(n.type)}
                  </div>
                  <div className="notif-content">
                    <h5>{n.title}</h5>
                    <p>{n.message}</p>
                    <span className="time">{formatTimeAgo(n.createdAt)}</span>
                  </div>
                  {!n.isRead && <div className="unread-dot"></div>}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .notification-wrapper {
          position: relative;
          margin-right: 1.5rem;
          display: flex;
          align-items: center;
        }
        .bell-trigger {
          background: transparent;
          border: none;
          color: #475569;
          cursor: pointer;
          position: relative;
          padding: 8px;
          border-radius: 50%;
          transition: background 0.2s, color 0.2s;
          display: flex;
        }
        .bell-trigger:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
        .unread-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background: #ef4444;
          color: white;
          font-size: 0.65rem;
          font-weight: bold;
          min-width: 16px;
          height: 16px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          border: 2px solid white;
        }
        .notification-dropdown {
          position: absolute;
          top: 120%;
          right: 0;
          width: 340px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05);
          border: 1px solid #e2e8f0;
          z-index: 1000;
          overflow: hidden;
          animation: slideDown 0.2s ease-out forwards;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dropdown-header {
          padding: 12px 16px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8fafc;
        }
        .dropdown-header h4 {
          margin: 0;
          font-size: 0.95rem;
          color: #1e293b;
        }
        .mark-all-btn {
          background: none;
          border: none;
          color: #3b82f6;
          font-size: 0.75rem;
          cursor: pointer;
          font-weight: 600;
        }
        .mark-all-btn:hover { text-decoration: underline; }
        .notification-list {
          max-height: 400px;
          overflow-y: auto;
        }
        .empty-notifs {
          padding: 40px 20px;
          text-align: center;
          color: #94a3b8;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
        }
        .notif-item {
          padding: 16px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
          transition: background 0.2s;
          position: relative;
        }
        .notif-item:hover { background: #f8fafc; }
        .notif-item.unread { background: #eff6ff; }
        .notif-item.unread:hover { background: #e0f2fe; }
        .notif-icon-wrapper {
          background: white;
          padding: 8px;
          border-radius: 50%;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .notif-content { flex: 1; min-width: 0; }
        .notif-content h5 {
          margin: 0 0 4px;
          font-size: 0.85rem;
          color: #0f172a;
          font-weight: 600;
        }
        .notif-content p {
          margin: 0 0 6px;
          font-size: 0.8rem;
          color: #64748b;
          line-height: 1.4;
        }
        .notif-content .time {
          font-size: 0.7rem;
          color: #94a3b8;
          font-weight: 500;
        }
        .unread-dot {
          width: 8px;
          height: 8px;
          background: #3b82f6;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 6px;
        }
      `}} />
    </div>
  );
}
