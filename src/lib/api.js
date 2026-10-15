/**
 * Spring Boot REST API Client for House of Soluper
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.warn(`[API] Request to ${endpoint} failed:`, error.message);
    throw error;
  }
}

export const api = {
  // System Health
  health: async () => {
    return request('/health');
  },

  // Solupers Directory
  getSolupers: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/solupers${query ? `?${query}` : ''}`);
  },

  getSoluperById: async (id) => {
    return request(`/solupers/${id}`);
  },

  createSoluper: async (soluperData) => {
    return request('/solupers', {
      method: 'POST',
      body: JSON.stringify(soluperData)
    });
  },

  // Authentication
  login: async (email, password) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  register: async ({ name, email, password, roleCode }) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, roleCode })
    });
  },

  getUsers: async () => {
    return request('/auth/users');
  },

  // Events Protocol
  getEvents: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/events${query ? `?${query}` : ''}`);
  },

  getEventById: async (id) => {
    return request(`/events/${id}`);
  },

  registerForEvent: async (eventId, { participantName, participantEmail }) => {
    return request(`/events/${eventId}/register`, {
      method: 'POST',
      body: JSON.stringify({ participantName, participantEmail })
    });
  },

  // Projects
  getProjects: async () => {
    return request('/projects');
  },

  // Notices
  getNotices: async (type) => {
    return request(`/notices${type ? `?type=${encodeURIComponent(type)}` : ''}`);
  },

  // Achievements
  getAchievements: async () => {
    return request('/achievements');
  },

  // Contact Transmissions
  sendContactMessage: async ({ name, email, message }) => {
    return request('/contact', {
      method: 'POST',
      body: JSON.stringify({ name, email, message })
    });
  },

  // DevBot AI Chat
  chatWithDevBot: async (message, theme) => {
    return request('/devbot/chat', {
      method: 'POST',
      body: JSON.stringify({ message, theme })
    });
  }
};

export default api;
