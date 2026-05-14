import http from './http';

const messagesApi = {
  getConversations: () => http.get('/messages/conversations'),
  
  getContacts: () => http.get('/messages/contacts'),
  
  getMessages: (conversationId) => http.get(`/messages/conversations/${conversationId}`),
  
  sendMessage: (recipientId, content, fileUrl = null, fileName = null, fileType = null) => 
    http.post('/messages', { recipientId, content, fileUrl, fileName, fileType }),
    
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return http.post('/messages/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default messagesApi;
