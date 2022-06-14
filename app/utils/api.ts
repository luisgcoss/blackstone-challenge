import { createCookieSessionStorage, redirect } from '@remix-run/node';
import type { Todo } from '~/types';

type APIMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/'
    : process.env.BASE_API_URL;

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

export async function singIn(
  route: string,
  payload: { username: string; password: string }
): Promise<{
  success: boolean;
  accessToken?: string | undefined;
  userId?: number | undefined;
  message?: string | undefined;
}> {
  const req = await apiCall(route, 'post', payload);

  if (req.status !== 201) {
    return {
      success: false,
      message:
        (await req.json().then((data) => data.message)) ||
        'Password or username incorrects',
    };
  } else {
    const { accessToken, userId } = await req.json();
    return {
      success: true,
      accessToken,
      userId,
    };
  }
}

export async function setTokenInstance(token: string, userId: number) {
  const session = await storage.getSession();
  session.set('userId', userId);
  session.set('token', token);

  return redirect('/todos', {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  });
}

export async function logOut(request: Request) {
  const session = await storage.getSession(request?.headers.get('Cookie'));
  session.unset('token');
  session.unset('userId');
  return redirect('/', {
    headers: { 'Set-Cookie': await storage.commitSession(session) },
  });
}

export async function getJWT(request: Request) {
  const session = await storage.getSession(request?.headers.get('Cookie'));
  const token = await session.get('token');

  return token;
}

export async function getUserCredentials(request: Request) {
  const session = await storage.getSession(request?.headers.get('Cookie'));
  const userId = await session.get('userId');
  const jwt = await session.get('token');
  return { isSessionActive: userId && jwt, userId, jwt };
}

export async function createTodo(
  payload: Pick<Todo, 'endDate' | 'title'>,
  request: Request
) {
  const { userId, jwt } = await getUserCredentials(request);
  return await apiCall(`user/${userId}/todos`, 'post', payload, jwt);
}

export async function getUserTodos(request: Request) {
  const { userId, jwt } = await getUserCredentials(request);
  return await (await apiCall(`user/${userId}/todos`, 'get', null, jwt))
    .json()
    .catch((e) => console.log(e));
}

export async function updateTodo(payload: Partial<Todo>, request: Request) {
  const { id, ...rest } = payload;
  const { jwt } = await getUserCredentials(request);
  return await apiCall(`todo/${id}`, 'patch', rest, jwt);
}

export async function updateManyTodos(todosList: number[], request: Request) {
  const { jwt } = await getUserCredentials(request);
  return await apiCall(`todo`, 'patch', todosList, jwt);
}

export async function deleteTodo(id: number, request: Request) {
  const { jwt } = await getUserCredentials(request);
  return await apiCall(`todo/${id}`, 'delete', null, jwt);
}

export async function deleteManyTodos(todosList: number[], request: Request) {
  const { jwt } = await getUserCredentials(request);
  return await apiCall(`todo`, 'delete', todosList, jwt);
}
