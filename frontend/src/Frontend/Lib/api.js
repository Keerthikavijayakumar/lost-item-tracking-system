export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const API_ROUTES = {
    LOST_ITEMS: `${API_BASE_URL}/lost-items`,
    ALERTS: `${API_BASE_URL}/alerts`,
    UPLOAD: `${API_BASE_URL}/upload`,
    USER_DASHBOARD: `${API_BASE_URL}/user/dashboard`,
    USER: `${API_BASE_URL}/user`,
    ALERT_OWNER: `${API_BASE_URL}/alert-owner`,
};
