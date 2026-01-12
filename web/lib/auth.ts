/**
 * Authentication utilities
 */

export function setAuthToken(token: string) {
  localStorage.setItem('auth_token', token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function removeAuthToken() {
  localStorage.removeItem('auth_token');
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export function getUserFromToken(): { email: string; userId: string } | null {
  const token = getAuthToken();
  if (!token) return null;

  try {
    // Decode JWT payload (middle part)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      email: payload.email || '',
      userId: payload.sub || ''
    };
  } catch (e) {
    console.error('Failed to decode token:', e);
    return null;
  }
}

export function getUserInitials(email: string): string {
  if (!email) return '?';
  const name = email.split('@')[0];
  return name.substring(0, 2).toUpperCase();
}
