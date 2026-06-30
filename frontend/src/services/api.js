import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getErrorMessage = (error, fallbackMessage) => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }

  if (error.code === 'ECONNABORTED') {
    return 'Request timed out. Please try again.';
  }

  if (error.message === 'Network Error') {
    return 'Cannot reach backend server. Please ensure backend is running on port 8000.';
  }

  return fallbackMessage;
};

export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Backend health check failed.'));
  }
};

/**
 * Upload CSV file to backend
 * @param {File} file - The CSV file to upload
 * @returns {Promise<{job_id: string, message: string}>}
 */
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Upload failed.'));
  }
};

/**
 * Check job status
 * @param {string} jobId - The job ID to check
 * @returns {Promise<{job_id: string, status: string, progress: number, metrics: object, comparison: object, preview: object, error: string}>}
 */
export const checkStatus = async (jobId) => {
  try {
    const response = await api.get(`/status/${jobId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Failed to fetch job status.'));
  }
};

/**
 * Download synthetic CSV file
 * @param {string} jobId - The job ID
 * @returns {Promise<Blob>}
 */
export const downloadFile = async (jobId) => {
  try {
    const response = await api.get(`/download/${jobId}`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'synthetic_data.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Download failed.'));
  }
};

export default api;
