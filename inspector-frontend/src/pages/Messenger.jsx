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
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadConversations();
    loadContacts();
    
    // Simple polling for new messages every 10 seconds
    const interval = setInterval(() => {
        if (selectedConversation) {
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
    // Check if conversation already exists
    const existing = conversations.find(c => c.otherUserId === contact.id);
    if (existing) {
        selectConversation(existing);
    } else {
        // Just set temporary selected conversation state
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
    if (!newMessage.trim() && !uploading) return;

    try {
      const recipientId = selectedConversation.otherUserId;
      const res = await messagesApi.sendMessage(recipientId, newMessage);
      
      const sentMsg = res.data?.data;
      if (selectedConversation.temp) {
          // Refresh everything if it was a new thread
          await loadConversations();
          const newConv = conversations.find(c => c.otherUserId === recipientId);
          if (newConv) setSelectedConversation(newConv);
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
        alert("Failed to upload file. Please try again.");
    } finally {
        setUploading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="messenger-container">
      <header className="page-header">
        <div>
          <div className="page-title">Messenger</div>
          <div className="page-subtitle">Secure professional communication</div>
        </div>
        <div className="tab-switcher">
          <button 
            className={activeTab === "chats" ? "active" : ""} 
            onClick={() => setActiveTab("chats")}
          >
            Chats
          </button>
          <button 
            className={activeTab === "contacts" ? "active" : ""} 
            onClick={() => setActiveTab("contacts")}
          >
            Contacts
          </button>
        </div>
      </header>

      <div className="messenger-main-grid">
        {/* Sidebar */}
        <aside className="messenger-sidebar card">
          {activeTab === "chats" ? (
            <div className="conversation-list">
              {conversations.length === 0 ? (
                <div className="muted p-4 text-center">No conversations yet.</div>
              ) : (
                conversations.map(c => (
                  <div 
                    key={c.id} 
                    className={`conversation-item ${selectedConversation?.id === c.id ? 'active' : ''}`}
                    onClick={() => selectConversation(c)}
                  >
                    <div className="avatar">{c.otherUserName.charAt(0)}</div>
                    <div className="details">
                      <div className="name-row">
                        <strong>{c.otherUserName}</strong>
                        {c.unreadCount > 0 && <span className="unread-badge">{c.unreadCount}</span>}
                      </div>
                      <div className="last-msg text-truncate">{c.lastMessage}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="contact-list">
              {contacts.length === 0 ? (
                <div className="muted p-4 text-center">No contacts found in your jurisdiction.</div>
              ) : (
                contacts.map(contact => (
                  <div 
                    key={contact.id} 
                    className="contact-item"
                    onClick={() => selectContact(contact)}
                  >
                    <div className="avatar contact">{contact.name.charAt(0)}</div>
                    <div className="details">
                      <strong>{contact.name}</strong>
                      <div className="role-tag">{contact.role}</div>
                      <div className="footer text-small muted">{contact.details}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </aside>

        {/* Chat window */}
        <main className="chat-window card">
          {selectedConversation ? (
            <>
              <header className="chat-header">
                <div className="avatar">{selectedConversation.otherUserName.charAt(0)}</div>
                <div>
                  <strong>{selectedConversation.otherUserName}</strong>
                  <div className="status">{selectedConversation.otherUserRole}</div>
                </div>
              </header>

              <div className="message-history">
                {messages.map(m => {
                  const isOwn = m.senderId !== selectedConversation.otherUserId;
                  return (
                    <div key={m.id} className={`message-row ${isOwn ? 'own' : 'other'}`}>
                      <div className="bubble">
                        {m.content && <p>{m.content}</p>}
                        {m.fileUrl && (
                          <div className="file-attachment">
                            <div className="file-icon">📄</div>
                            <div className="file-info">
                              <div className="file-name">{m.fileName}</div>
                              <a 
                                href={`http://localhost:8081${m.fileUrl}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="download-btn"
                              >
                                Download
                              </a>
                            </div>
                          </div>
                        )}
                        <span className="timestamp">
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form className="message-input-area" onSubmit={handleSend}>
                <button 
                    type="button" 
                    className="icon-btn" 
                    onClick={() => fileInputRef.current.click()}
                    disabled={uploading}
                >
                  <span title="Attach file">📎</span>
                </button>
                <input 
                    type="file" 
                    hidden 
                    ref={fileInputRef} 
                    onChange={handleFileUpload}
                />
                
                <input 
                  type="text" 
                  placeholder={uploading ? "Uploading file..." : "Type your message..."}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={uploading}
                />
                
                <button type="submit" className="send-btn" disabled={uploading}>
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="chat-placeholder">
              <h3>Select a conversation to start chatting</h3>
              <p className="muted">Use the contacts tab to find professionals in your area.</p>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .messenger-container {
          height: calc(100vh - 40px);
          display: flex;
          flex-direction: column;
        }

        .tab-switcher {
          display: flex;
          gap: 10px;
          background: rgba(255,255,255,0.05);
          padding: 4px;
          border-radius: 12px;
        }

        .tab-switcher button {
          padding: 6px 16px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: white;
          cursor: pointer;
          font-weight: 500;
          transition: 0.2s;
        }

        .tab-switcher button.active {
          background: var(--primary);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .messenger-main-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 20px;
          flex: 1;
          margin-top: 20px;
          overflow: hidden;
        }

        .messenger-sidebar {
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          padding: 0;
        }

        .conversation-item, .contact-item {
          display: flex;
          gap: 12px;
          padding: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          cursor: pointer;
          transition: 0.2s;
        }

        .conversation-item:hover, .contact-item:hover {
          background: rgba(255,255,255,0.03);
        }

        .conversation-item.active {
          background: rgba(99, 102, 241, 0.1);
          border-left: 3px solid var(--primary);
        }

        .avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--primary-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          flex-shrink: 0;
        }

        .avatar.contact {
            background: #475569;
        }

        .details {
          flex: 1;
          min-width: 0;
        }

        .name-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .unread-badge {
          background: #ef4444;
          color: white;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 18px;
          text-align: center;
        }

        .last-msg {
          font-size: 13px;
          color: #94a3b8;
        }

        .chat-window {
          display: flex;
          flex-direction: column;
          padding: 0;
          overflow: hidden;
        }

        .chat-header {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255,255,255,0.02);
        }

        .status {
          font-size: 12px;
          color: #94a3b8;
        }

        .message-history {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #0f172a;
        }

        .message-row {
          display: flex;
          width: 100%;
        }

        .message-row.own {
          justify-content: flex-end;
        }

        .bubble {
          max-width: 70%;
          padding: 10px 16px;
          border-radius: 18px;
          position: relative;
        }

        .message-row.other .bubble {
          background: #1e293b;
          border-bottom-left-radius: 4px;
        }

        .message-row.own .bubble {
          background: var(--primary-gradient);
          border-bottom-right-radius: 4px;
        }

        .bubble p {
          margin: 0;
          line-height: 1.5;
        }

        .timestamp {
          font-size: 10px;
          opacity: 0.5;
          margin-top: 4px;
          display: block;
          text-align: right;
        }

        .message-input-area {
          padding: 16px 20px;
          background: #1e293b;
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .message-input-area input[type="text"] {
          flex: 1;
          background: #0f172a;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 10px 16px;
          border-radius: 20px;
          color: white;
          outline: none;
        }

        .icon-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 20px;
          cursor: pointer;
        }

        .send-btn {
          background: var(--primary);
          border: none;
          padding: 10px 24px;
          border-radius: 20px;
          color: white;
          font-weight: 500;
          cursor: pointer;
        }

        .file-attachment {
          background: rgba(0,0,0,0.1);
          padding: 8px 12px;
          border-radius: 8px;
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 8px;
        }

        .file-icon {
          font-size: 24px;
        }

        .file-name {
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .download-btn {
          font-size: 11px;
          color: #93c5fd;
          text-decoration: none;
        }

        .chat-placeholder {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #475569;
        }

        .role-tag {
            font-size: 10px;
            background: rgba(255,255,255,0.1);
            padding: 2px 6px;
            border-radius: 4px;
            display: inline-block;
            margin-top: 4px;
        }
      `}</style>
    </div>
  );
}
