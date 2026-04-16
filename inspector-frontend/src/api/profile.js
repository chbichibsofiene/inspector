import http from './http';

const profileApi = {
  // Inspector Profile
  getInspectorProfile: () => http.get('/inspector/profile'),
  completeInspectorProfile: (data) => http.post('/inspector/profile', data),
  updateInspectorProfile: (data) => http.put('/inspector/profile', data),
  
  // Teacher Profile
  getTeacherProfile: () => http.get('/teacher/profile'),
  completeTeacherProfile: (data) => http.post('/teacher/profile', data),
  updateTeacherProfile: (data) => http.put('/teacher/profile', data),

  // Reference Data
  getRanks: () => http.get('/inspector/profile/ranks'),
  getSubjects: () => http.get('/inspector/profile/subjects'),
  getSchoolLevels: () => http.get('/inspector/profile/school-levels'),
  getDelegations: () => http.get('/inspector/profile/delegations'),
  getDependencies: (delegationId) => http.get(`/inspector/profile/dependencies?delegationId=${delegationId}`),
  getDepartments: (delegationId) => http.get(`/inspector/profile/departments?delegationId=${delegationId}`),
  getEtablissements: (dependencyId, schoolLevel = '') => 
    http.get(`/inspector/profile/etablissements?dependencyId=${dependencyId}&schoolLevel=${schoolLevel}`),
};

export default profileApi;
