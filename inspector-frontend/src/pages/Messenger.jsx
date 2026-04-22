import { useState, useEffect, useRef } from "react";
import messagesApi from "../api/messages";
import { Link } from "react-router-dom";
import { MessageCircle, Search, Paperclip, Send, ThumbsUp, Users, ChevronLeft, Image as ImageIcon, FileText, Info, User } from "lucide-react";

export default function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activeTab, setActiveTab] = useState("chats"); // "chats" or "contacts"
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [inspectedImage, setInspectedImage] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadConversations();
    loadContacts();
    
    const interval = setInterval(() => {
        if (selectedConversation && !selectedConversation.temp) {
            loadMessages(selectedConversation.id);
        }
        loadConversations();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      const res = await messagesApi.getConversations();
      setConversations(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load conversations", err);
    }
  };

  const loadContacts = async () => {
    try {
      const res = await messagesApi.getContacts();
      setContacts(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load contacts", err);
    }
  };

  const loadMessages = async (id) => {
    try {
      const res = await messagesApi.getMessages(id);
      setMessages(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  const selectConversation = (conv) => {
    setSelectedConversation(conv);
    loadMessages(conv.id);
  };

  const selectContact = async (contact) => {
    const existing = conversations.find(c => c.otherUserId === contact.id);
    if (existing) {
        selectConversation(existing);
    } else {
        setSelectedConversation({
            temp: true,
            otherUserId: contact.id,
            otherUserName: contact.name,
            otherUserRole: contact.role
        });
        setMessages([]);
    }
    setActiveTab("chats");
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const recipientId = selectedConversation.otherUserId;
      const res = await messagesApi.sendMessage(recipientId, newMessage);
      
      const sentMsg = res.data?.data;
      if (selectedConversation.temp) {
          await loadConversations();
          // We'll find the new conv ID after reload
      }
      
      setMessages([...messages, sentMsg]);
      setNewMessage("");
      loadConversations();
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
        const uploadRes = await messagesApi.uploadFile(file);
        const { fileUrl, fileName, fileType } = uploadRes.data.data;
        
        const recipientId = selectedConversation.otherUserId;
        const msgRes = await messagesApi.sendMessage(recipientId, "", fileUrl, fileName, fileType);
        
        setMessages([...messages, msgRes.data.data]);
        loadConversations();
    } catch (err) {
        console.error("Upload failed", err);
    } finally {
        setUploading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredConversations = conversations.filter(c => 
    c.otherUserName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fb-messenger">
      {/* Sidebar */}
      <aside className="fb-sidebar">
        <header className="sidebar-header">
          <div className="header-top">
            <h1>Chats</h1>
            <div className="header-actions">
              <Link to="/" className="circle-btn" title="Back to Dashboard">
                <ChevronLeft size={20} />
              </Link>
            </div>
          </div>
          
          <div className="messenger-tabs">
            <button 
              className={`msg-tab ${activeTab === "chats" ? "active" : ""}`} 
              onClick={() => setActiveTab("chats")}
            >
              <MessageCircle size={16} /> Chats
            </button>
            <button 
              className={`msg-tab ${activeTab === "contacts" ? "active" : ""}`} 
              onClick={() => setActiveTab("contacts")}
            >
              <Users size={16} /> Contacts
            </button>
          </div>

          <div className="search-container" style={{ marginTop: '12px' }}>
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search Messenger" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        <div className="inbox-list">
          {activeTab === "chats" ? (
            filteredConversations.length > 0 ? (
                filteredConversations.map(c => (
                <div 
                  key={c.id} 
                  className={`inbox-item ${selectedConversation?.id === c.id ? 'selected' : ''} ${c.unreadCount > 0 ? 'unread' : ''}`}
                  onClick={() => selectConversation(c)}
                >
                  <div className="avatar-wrapper">
                    <div className="avatar large">{c.otherUserName.charAt(0)}</div>
                    <div className="status-dot online"></div>
                  </div>
                  <div className="inbox-info">
                    <div className="name-time">
                      <span className="name">{c.otherUserName}</span>
                      <span className="time">{new Date(c.lastMessageTime).toLocaleDateString() === new Date().toLocaleDateString() 
                        ? new Date(c.lastMessageTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) 
                        : new Date(c.lastMessageTime).toLocaleDateString([], {month:'short', day:'numeric'})}
                      </span>
                    </div>
                    <div className="snippet">
                      <span className="text">{c.lastMessage || "No messages yet"}</span>
                      {c.unreadCount > 0 && <span className="unread-dot"></span>}
                    </div>
                  </div>
                </div>
              ))
            ) : (
                <div className="empty-state">No chats found. Try starting a conversation from Contacts.</div>
            )
          ) : (
            contacts.map(contact => (
              <div key={contact.id} className="inbox-item contact" onClick={() => selectContact(contact)}>
                <div className="avatar large contact-avatar">{contact.name.charAt(0)}</div>
                <div className="inbox-info">
                  <span className="name">{contact.name}</span>
                  <span className="role-snippet"><User size={12} /> {contact.role} • {contact.details}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="fb-main">
        {selectedConversation ? (
          <>
            <header className="chat-header">
              <div className="user-info">
                <div className="avatar medium">{selectedConversation.otherUserName.charAt(0)}</div>
                <div className="chat-details">
                  <span className="name">{selectedConversation.otherUserName}</span>
                  <span className="status">Active now</span>
                </div>
              </div>
            </header>

            <div className="messages-flow">
              <div className="user-profile-center">
                 <div className="avatar xlarge">{selectedConversation.otherUserName.charAt(0)}</div>
                 <h2>{selectedConversation.otherUserName}</h2>
                 <p className="muted">{selectedConversation.otherUserRole} on Inspector Platform</p>
                 <button className="view-profile-btn">View Profile</button>
              </div>

              {messages.map((m, index) => {
                const isOwn = m.senderId !== selectedConversation.otherUserId;
                const prevMsg = messages[index - 1];
                const isGroupStart = !prevMsg || prevMsg.senderId !== m.senderId;
                
                return (
                  <div key={m.id} className={`msg-row ${isOwn ? 'own' : 'other'} ${isGroupStart ? 'group-start' : ''}`}>
                    {!isOwn && isGroupStart && <div className="avatar small">{selectedConversation.otherUserName.charAt(0)}</div>}
                    {!isOwn && !isGroupStart && <div className="avatar-spacer" />}
                    
                    <div className="bubble">
                        {m.content && <div className="text-content">{m.content}</div>}
                        {m.fileUrl && (
                          m.fileType && m.fileType.startsWith('image/') ? (
                            <div className="image-container">
                              <img 
                                src={`http://localhost:8081${m.fileUrl}`} 
                                alt={m.fileName} 
                                className="chat-image selectable" 
                                onClick={() => setInspectedImage({url: m.fileUrl, name: m.fileName})}
                              />
                            </div>
                          ) : (
                            <div className="file-box">
                              <div className="file-icon"><FileText size={24} /></div>
                              <div className="file-details">
                                <span className="filename">{m.fileName}</span>
                                <a href={`http://localhost:8081${m.fileUrl}`} target="_blank" rel="noreferrer">Download</a>
                              </div>
                            </div>
                          )
                        )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <footer className="chat-footer glass-effect">
              <div className="footer-actions">
                <button 
                  type="button"
                  className="attach-file-btn" 
                  onClick={() => fileInputRef.current.click()}
                  title="Attach file"
                >
                  <Paperclip size={18} />
                  <span className="attach-text">Attach</span>
                </button>
                <input type="file" hidden ref={fileInputRef} onChange={handleFileUpload} />
              </div>
              <form className="input-pills hover-ring" onSubmit={handleSend}>
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className={`send-icon ${newMessage.trim() ? 'active' : ''}`} disabled={!newMessage.trim()}>
                  {newMessage.trim() ? <Send size={20} /> : <ThumbsUp size={20} />}
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="fb-placeholder">
            <div className="placeholder-icon-wrapper">
               <MessageCircle size={64} className="placeholder-icon" />
            </div>
            <h2>Welcome to Messenger</h2>
            <p className="muted">Select a chat or find a contact to start messaging.</p>
          </div>
        )}
      </main>

      {/* Image Inspection Overlay */}
      {inspectedImage && (
        <div className="image-overlay" onClick={() => setInspectedImage(null)}>
          <div className="overlay-header">
            <span className="overlay-filename">{inspectedImage.name}</span>
            <div className="overlay-actions">
              <a 
                href={`http://localhost:8081${inspectedImage.url}`} 
                target="_blank" 
                rel="noreferrer" 
                className="overlay-download-btn"
                onClick={(e) => e.stopPropagation()}
              >
                Download
              </a>
              <button 
                className="overlay-close-btn" 
                onClick={() => setInspectedImage(null)}
              >
                ✕
              </button>
            </div>
          </div>
          <div className="overlay-content-wrapper">
            <img 
              src={`http://localhost:8081${inspectedImage.url}`} 
              alt={inspectedImage.name} 
              className="overlay-image" 
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <style>{`
        :root {
          --fb-blue: #3b82f6;
          --fb-blue-gradient: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          --fb-grey: #f8fafc;
          --fb-hover: #f1f5f9;
          --fb-border: #e2e8f0;
          --text-main: #0f172a;
          --text-muted: #64748b;
          --glass-bg: rgba(255, 255, 255, 0.85);
          --glass-border: rgba(255, 255, 255, 0.4);
        }

        .fb-messenger {
          display: flex;
          height: 100vh;
          background: #fdfdfd;
          color: var(--text-main);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        /* Animations */
        @keyframes messagePop {
          0% { opacity: 0; transform: translateY(10px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes pulseSoft {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }

        /* Sidebar */
        .fb-sidebar {
          width: 380px;
          border-right: 1px solid var(--fb-border);
          display: flex;
          flex-direction: column;
          background: white;
          box-shadow: 4px 0 24px rgba(0,0,0,0.02);
          z-index: 10;
        }

        .sidebar-header {
          padding: 24px 20px 16px;
          border-bottom: 1px solid transparent;
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .header-top h1 {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin: 0;
          color: #1e293b;
        }

        .messenger-tabs {
          display: flex;
          gap: 8px;
          background: var(--fb-grey);
          padding: 6px;
          border-radius: 12px;
          margin-bottom: 8px;
        }
        
        .msg-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px;
          border: none;
          background: transparent;
          border-radius: 8px;
          font-weight: 700;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
        }

        .msg-tab.active {
          background: white;
          color: var(--fb-blue);
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .search-container {
          background: var(--fb-grey);
          border-radius: 16px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid var(--fb-border);
          transition: all 0.3s ease;
        }

        .search-container:focus-within {
          background: white;
          border-color: var(--fb-blue);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .search-icon { color: var(--text-muted); }

        .search-container input {
          background: transparent;
          border: none;
          outline: none;
          flex: 1;
          font-size: 15px;
          color: var(--text-main);
        }

        .inbox-list {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
        }

        .inbox-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          margin-bottom: 4px;
          border: 1px solid transparent;
        }

        .inbox-item:hover { 
          background: var(--fb-hover); 
          border-color: #f1f5f9;
        }
        
        .inbox-item.selected { 
          background: #eff6ff; 
          border-color: #bfdbfe;
        }

        .avatar-wrapper { position: relative; }
        .avatar {
          border-radius: 16px;
          background: var(--fb-blue-gradient);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
        }

        .avatar.contact-avatar {
          background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
          box-shadow: 0 4px 12px rgba(100, 116, 139, 0.2);
        }

        .avatar.large { width: 56px; height: 56px; font-size: 20px; }
        .avatar.medium { width: 44px; height: 44px; font-size: 16px; border-radius: 12px; }
        .avatar.small { width: 32px; height: 32px; font-size: 12px; border-radius: 10px; }
        .avatar.xlarge { width: 88px; height: 88px; font-size: 32px; margin-bottom: 16px; border-radius: 24px; }

        .status-dot {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 16px;
          height: 16px;
          background: #10b981;
          border: 3px solid white;
          border-radius: 50%;
        }

        .inbox-info { flex: 1; min-width: 0; }
        .name-time { display: flex; justify-content: space-between; align-items: baseline; }
        .name { font-weight: 600; font-size: 15px; letter-spacing: -0.2px; }
        .time { font-size: 12px; color: var(--text-muted); font-weight: 600; }

        .snippet { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }
        .snippet .text {
          font-size: 13px;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .unread .name { font-weight: 800; color: #0f172a; }
        .unread .text { color: #1e293b !important; font-weight: 700; }
        .unread-dot {
          width: 10px;
          height: 10px;
          background: var(--fb-blue);
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 0 4px #eff6ff;
        }

        /* Main Chat Area */
        .fb-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
          position: relative;
        }

        .glass-effect {
          background: var(--glass-bg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        .chat-header {
          padding: 16px 24px;
          border-bottom: 1px solid var(--fb-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: absolute;
          top: 0; left: 0; right: 0;
          z-index: 20;
        }

        .user-info { display: flex; align-items: center; gap: 16px; }
        .chat-details { display: flex; flex-direction: column; }
        .chat-details .name { font-weight: 700; font-size: 1.1rem; }
        .chat-details .status { font-size: 13px; color: #10b981; font-weight: 600; }

        .messages-flow {
          flex: 1;
          overflow-y: auto;
          padding: 100px 24px 24px;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
        }

        .user-profile-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 0;
          text-align: center;
          margin-bottom: 2rem;
        }

        .user-profile-center h2 { margin: 0 0 8px; font-weight: 800; }
        .view-profile-btn {
          margin-top: 16px;
          background: white;
          border: 1px solid var(--fb-border);
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-main);
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 5px rgba(0,0,0,0.02);
        }
        .view-profile-btn:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .msg-row {
          display: flex;
          margin-bottom: 4px;
          max-width: 75%;
          animation: messagePop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1);
        }

        .msg-row.group-start { margin-top: 16px; }
        .msg-row.own { align-self: flex-end; flex-direction: row-reverse; }
        .msg-row.other { align-self: flex-start; }

        .avatar-spacer { width: 32px; flex-shrink: 0; margin-right: 12px; }
        .msg-row.other .avatar { margin-right: 12px; }

        .bubble {
          padding: 12px 18px;
          border-radius: 24px;
          font-size: 15px;
          line-height: 1.5;
          position: relative;
          box-shadow: 0 2px 5px rgba(0,0,0,0.02);
        }

        .msg-row.other .bubble {
          background: white;
          border: 1px solid var(--fb-border);
          border-top-left-radius: 6px;
          color: #1e293b;
        }
        .msg-row.other.group-start .bubble { border-top-left-radius: 24px; }

        .msg-row.own .bubble {
          background: var(--fb-blue-gradient);
          color: white;
          border-top-right-radius: 6px;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }
        .msg-row.own.group-start .bubble { border-top-right-radius: 24px; }

        .file-box {
          display: flex;
          gap: 12px;
          background: rgba(0,0,0,0.05);
          padding: 12px;
          border-radius: 12px;
          align-items: center;
        }

        .msg-row.other .file-box { background: #f1f5f9; }

        .file-icon { color: inherit; opacity: 0.8; }
        .file-details { display: flex; flex-direction: column; gap: 4px; }
        .file-details .filename { font-weight: 600; font-size: 0.9rem; }
        .file-details a { color: inherit; font-size: 0.8rem; font-weight: 700; text-decoration: none; opacity: 0.8; }
        .file-details a:hover { opacity: 1; text-decoration: underline; }

        .image-container { margin-top: 4px; }
        .chat-image {
          max-width: 100%;
          max-height: 280px;
          border-radius: 16px;
          display: block;
          object-fit: cover;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .chat-footer {
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          border-top: 1px solid rgba(255,255,255,0.5);
          position: absolute;
          bottom: 0; left: 0; right: 0;
        }

        .footer-actions { display: flex; gap: 8px; }
        
        .attach-file-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: 1px solid var(--fb-border);
          padding: 8px 16px;
          border-radius: 20px;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
        }

        .attach-file-btn:hover {
          background: var(--fb-hover);
          color: var(--fb-blue);
          border-color: #cbd5e1;
        }

        .input-pills {
          flex: 1;
          background: white;
          border-radius: 24px;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          border: 1px solid var(--fb-border);
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          transition: all 0.3s ease;
        }

        .input-pills.hover-ring:focus-within {
          border-color: #93c5fd;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .input-pills input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 8px 0;
          font-size: 15px;
          color: var(--text-main);
        }

        .circle-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: var(--fb-grey);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .circle-btn:hover { 
          background: #e2e8f0; 
          color: #1e293b;
        }
        
        .circle-btn.primary-action {
          color: white;
          background: var(--fb-blue-gradient);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        
        .circle-btn.primary-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
        }

        .send-icon {
            background: transparent;
            border: none;
            color: #94a3b8;
            cursor: pointer;
            margin-left: 8px;
            padding: 8px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .send-icon.active { color: var(--fb-blue); }
        .send-icon:hover { background: #f1f5f9; }
        .send-icon.active:hover { background: #eff6ff; transform: scale(1.1) rotate(-10deg); }

        .fb-placeholder {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .placeholder-icon-wrapper {
          width: 120px;
          height: 120px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          margin-bottom: 2rem;
          color: #cbd5e1;
          animation: messagePop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.2);
        }

        .fb-placeholder h2 { font-weight: 800; font-size: 1.75rem; margin-bottom: 0.5rem; }
        .muted { color: #64748b; }

        .role-snippet { font-size: 12px; color: #94a3b8; font-weight: 500; }

        /* Image Inspection Overlay */
        .chat-image.selectable {
          cursor: pointer;
          transition: transform 0.3s;
        }
        .chat-image.selectable:hover { transform: scale(0.98); }

        .image-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          animation: messagePop 0.2s ease-out;
        }

        .overlay-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 32px;
          color: white;
        }

        .overlay-filename { font-weight: 600; font-size: 1.1rem; }

        .overlay-actions { display: flex; align-items: center; gap: 20px; }

        .overlay-download-btn {
          color: white;
          text-decoration: none;
          background: rgba(255, 255, 255, 0.1);
          padding: 8px 24px;
          border-radius: 30px;
          font-weight: 700;
          font-size: 0.9rem;
          transition: all 0.2s;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .overlay-download-btn:hover { background: white; color: black; }

        .overlay-close-btn {
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          width: 40px; height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .overlay-close-btn:hover { background: #ef4444; }

        .overlay-content-wrapper {
          flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px;
        }

        .overlay-image {
          max-width: 100%; max-height: 100%; object-fit: contain;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
}
