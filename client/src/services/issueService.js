import api from './api';

// Remove empty values so we don't send ?status=&type=
const cleanParams = (params) =>
  Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v != null)
  );

export const fetchIssues = async (params = {}) => {
  const { data } = await api.get('/issues', { params: cleanParams(params) });
  return { issues: data.data.issues, pagination: data.pagination };
};

export const fetchIssue = async (id) => {
  const { data } = await api.get(`/issues/${id}`);
  return data.data.issue;
};

export const createIssue = async (payload) => {
  const { data } = await api.post('/issues', payload);
  return data.data.issue;
};

export const updateIssue = async (id, payload) => {
  const { data } = await api.put(`/issues/${id}`, payload);
  return data.data.issue;
};

export const deleteIssue = async (id) => {
  await api.delete(`/issues/${id}`);
};