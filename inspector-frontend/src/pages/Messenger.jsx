import { useState, useEffect, useRef } from "react";
import messagesApi from "../api/messages";
import { Link } from "react-router-dom";

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
              <button className="circle-btn" onClick={() => setActiveTab(activeTab === "chats" ? "contacts" : "chats")}>
                {activeTab === "chats" ? "👥" : "💬"}
              </button>
            </div>
          </div>
          <div className="search-container">
            <span className="search-icon">🔍</span>
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
                <div className="avatar large grey">{contact.name.charAt(0)}</div>
                <div className="inbox-info">
                  <span className="name">{contact.name}</span>
                  <span className="role-snippet">{contact.role} • {contact.details}</span>
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
                              <img src={`http://localhost:8081${m.fileUrl}`} alt={m.fileName} className="chat-image" />
                            </div>
                          ) : (
                            <div className="file-box">
                              <div className="file-icon">📄</div>
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

            <footer className="chat-footer">
              <div className="footer-actions">
                <button 
                  className="circle-btn primary-action" 
                  onClick={() => fileInputRef.current.click()}
                  title="Attach file"
                >
                  ➕
                </button>
                <input type="file" hidden ref={fileInputRef} onChange={handleFileUpload} />
              </div>
              <form className="input-pills" onSubmit={handleSend}>
                <input 
                  type="text" 
                  placeholder="Aa" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="send-icon" disabled={!newMessage.trim()}>
                  {newMessage.trim() ? "🚀" : "👍"}
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="fb-placeholder">
            <div className="avatar xlarge">?</div>
            <h2>Welcome to Messenger</h2>
            <p>Select a chat or find a contact to start messaging.</p>
          </div>
        )}
      </main>

      <style>{`
        :root {
          --fb-blue: #0084ff;
          --fb-grey: #f0f2f5;
          --fb-border: #e5e7eb;
          --text-main: #050505;
          --text-muted: #65676b;
        }

        .fb-messenger {
          display: flex;
          height: 100vh;
          background: white;
          color: var(--text-main);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        /* Sidebar */
        .fb-sidebar {
          width: 360px;
          border-right: 1px solid var(--fb-border);
          display: flex;
          flex-direction: column;
          background: white;
        }

        .sidebar-header {
          padding: 16px;
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .header-top h1 {
          font-size: 24px;
          font-weight: 800;
          margin: 0;
        }

        .search-container {
          background: var(--fb-grey);
          border-radius: 20px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .search-icon { color: var(--text-muted); font-size: 14px; }

        .search-container input {
          background: transparent;
          border: none;
          outline: none;
          flex: 1;
          font-size: 15px;
        }

        .inbox-list {
          flex: 1;
          overflow-y: auto;
          padding: 8px;
        }

        .inbox-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s;
          position: relative;
        }

        .inbox-item:hover { background: var(--fb-grey); }
        .inbox-item.selected { background: #e7f3ff; }

        .avatar-wrapper { position: relative; }
        .avatar {
          border-radius: 50%;
          background: var(--fb-blue);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          flex-shrink: 0;
        }

        .avatar.large { width: 56px; height: 56px; font-size: 20px; }
        .avatar.medium { width: 40px; height: 40px; font-size: 16px; }
        .avatar.small { width: 28px; height: 28px; font-size: 12px; }
        .avatar.xlarge { width: 100px; height: 100px; font-size: 36px; margin-bottom: 16px; }
        .avatar.grey { background: #bcc0c4; }

        .status-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 14px;
          height: 14px;
          background: #31a24c;
          border: 2px solid white;
          border-radius: 50%;
        }

        .inbox-info { flex: 1; min-width: 0; }
        .name-time { display: flex; justify-content: space-between; align-items: baseline; }
        .name { font-weight: 500; font-size: 15px; }
        .time { font-size: 12px; color: var(--text-muted); }

        .snippet { display: flex; justify-content: space-between; align-items: center; margin-top: 2px; }
        .snippet .text {
          font-size: 13px;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .unread .name { font-weight: 700; }
        .unread .text { color: var(--text-main) !important; font-weight: 600; }
        .unread-dot {
          width: 12px;
          height: 12px;
          background: var(--fb-blue);
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* Main Chat Area */
        .fb-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: white;
        }

        .chat-header {
          padding: 10px 16px;
          border-bottom: 1px solid var(--fb-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        .user-info { display: flex; align-items: center; gap: 12px; }
        .chat-details { display: flex; flex-direction: column; }
        .chat-details .status { font-size: 12px; color: var(--text-muted); }

        .messages-flow {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
        }

        .user-profile-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 0;
          text-align: center;
        }

        .view-profile-btn {
          margin-top: 12px;
          background: var(--fb-grey);
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }

        .msg-row {
          display: flex;
          margin-bottom: 2px;
          max-width: 70%;
        }

        .msg-row.group-start { margin-top: 12px; }
        .msg-row.own { align-self: flex-end; flex-direction: row-reverse; }
        .msg-row.other { align-self: flex-start; }

        .avatar-spacer { width: 28px; flex-shrink: 0; margin-right: 8px; }
        .msg-row.other .avatar { margin-right: 8px; }

        .bubble {
          padding: 8px 12px;
          border-radius: 18px;
          font-size: 15px;
          line-height: 1.4;
          position: relative;
        }

        .msg-row.other .bubble {
          background: var(--fb-grey);
          border-top-left-radius: 4px;
        }
        .msg-row.other.group-start .bubble { border-top-left-radius: 18px; }

        .msg-row.own .bubble {
          background: var(--fb-blue);
          color: white;
          border-top-right-radius: 4px;
        }
        .msg-row.own.group-start .bubble { border-top-right-radius: 18px; }

        .file-box {
          display: flex;
          gap: 10px;
          background: rgba(0,0,0,0.05);
          padding: 8px;
          border-radius: 8px;
          align-items: center;
        }

        .file-box a { color: inherit; font-size: 12px; text-decoration: underline; }

        .image-container {
          margin-top: 4px;
        }

        .chat-image {
          max-width: 100%;
          max-height: 250px;
          border-radius: 12px;
          display: block;
          object-fit: cover;
        }

        .chat-footer {
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer-actions { display: flex; gap: 8px; }
        .input-pills {
          flex: 1;
          background: var(--fb-grey);
          border-radius: 20px;
          padding: 4px 12px;
          display: flex;
          align-items: center;
        }

        .input-pills input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 8px 0;
          font-size: 15px;
        }

        .circle-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: var(--fb-grey);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 18px;
          transition: all 0.2s ease;
        }

        .circle-btn:hover { background: #e4e6eb; }
        
        .circle-btn.primary-action {
          color: var(--fb-blue);
          font-weight: bold;
          font-size: 20px;
        }
        
        .circle-btn.primary-action:hover {
          background: #e7f3ff;
          transform: scale(1.05);
        }

        .send-icon {
            background: transparent;
            border: none;
            font-size: 20px;
            cursor: pointer;
            margin-left: 8px;
            transition: transform 0.2s;
        }
        
        .send-icon:hover {
          transform: scale(1.1);
        }

        .fb-placeholder {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: var(--text-muted);
        }

        .role-snippet { font-size: 12px; color: var(--text-muted); }
      `}</style>
    </div>
  );
}
