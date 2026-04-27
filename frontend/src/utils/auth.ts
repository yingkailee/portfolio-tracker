export const getToken = () => localStorage.getItem('token');

export const setToken = (token: string) => localStorage.setItem('token', token);

export const removeToken = () => localStorage.removeItem('token');

export const getUserId = (): number | null => {
  const id = localStorage.getItem('userId');
  return id ? parseInt(id) : null;
};

export const setUserId = (userId: string) => localStorage.setItem('userId', userId);

export const setUserIdAsNumber = (userId: number) => localStorage.setItem('userId', userId.toString());

export const isLoggedIn = () => !!getToken();