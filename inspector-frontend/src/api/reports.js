import http from './http';

// Inspector specific endpoints
export const getReports = async (activityId) => {
    let url = '/inspector/reports';
    if (activityId) {
        url += `?activityId=${activityId}`;
    }
    return await http.get(url);
};

export const createReport = async (payload) => {
    return await http.post('/inspector/reports', payload);
};

export const updateReport = async (id, payload) => {
    return await http.put(`/inspector/reports/${id}`, payload);
};

export const deleteReport = async (id) => {
    return await http.delete(`/inspector/reports/${id}`);
};

export const downloadReportPdf = async (reportId, filename) => {
    const response = await http.get(`/inspector/reports/${reportId}/pdf`, {
        responseType: 'blob',
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename || `report-${reportId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    return response;
};

export const importReportPdf = async (reportId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return await http.post(`/inspector/reports/${reportId}/pdf-import`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// Teacher specific endpoints
const reportsApi = {
    getMyReports: async () => {
        const response = await http.get('/teacher/reports');
        return response.data;
    },

    downloadReportPdf: async (reportId, filename) => {
        const response = await http.get(`/teacher/reports/${reportId}/pdf`, {
            responseType: 'blob',
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename || `report-${reportId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
};

export default reportsApi;
