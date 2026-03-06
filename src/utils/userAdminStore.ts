export type LocalManagedUser = {
  username: string;
  role: 'admin' | 'invitado';
  disabled: boolean;
  createdAt: string;
};

const STORAGE_KEY = 'managed_users';

export function getManagedUsers(): LocalManagedUser[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as LocalManagedUser[];
  } catch {
    return [];
  }
}

export function saveManagedUsers(users: LocalManagedUser[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function upsertManagedUser(user: LocalManagedUser) {
  const users = getManagedUsers();
  const index = users.findIndex((u) => u.username === user.username);

  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }

  saveManagedUsers(users);
}

export function setUserDisabled(username: string, disabled: boolean) {
  const users = getManagedUsers().map((u) =>
    u.username === username ? { ...u, disabled } : u
  );
  saveManagedUsers(users);
}

export function getManagedUser(username: string) {
  return getManagedUsers().find((u) => u.username === username) ?? null;
}