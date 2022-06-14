import { createCookieSessionStorage } from '@remix-run/node';
type APIMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/'
    : process.env.BASE_API_URL;

export const storage = createCookieSessionStorage({
  cookie: {
    name: 'blackstone',
    secrets: ['s3cret1'],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 0.5,
    httpOnly: true,
  },
});

export async function getJWT(request: Request) {
  const session = await storage.getSession(request?.headers.get('Cookie'));
  const token = await session.get('token');

  return token;
}

export async function getUser(request: Request) {
  const session = await storage.getSession(request?.headers.get('Cookie'));
  const userId = await session.get('userId');
  const jwt = await session.get('token');

  try {
    const isSessionActive =
      (await apiCall('auth/me', 'get', null, jwt)).status === 200;

    return { success: true, isSessionActive, userId, jwt };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Something unexpected happed',
    };
  }
}

export async function apiCall(
  endpoint: string,
  method: APIMethod = 'get',
  body?: object | null,
  token?: string
) {
  return fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : null,
  });
}
