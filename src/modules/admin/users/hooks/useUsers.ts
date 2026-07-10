import { useState } from "react";
import { initialUsers, type User } from "../data/usersData";

export type UserValidationResult =
  | { success: true }
  | { success: false; message: string };

export function useUsers() {
  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem("users");

    if (!stored) return initialUsers;

    try {
      return JSON.parse(stored);
    } catch {
      return initialUsers;
    }
  });

  function saveUsers(nextUsers: User[]) {
    setUsers(nextUsers);
    localStorage.setItem("users", JSON.stringify(nextUsers));
  }

  function validateUniqueUser(
    email: string,
    username: string,
    ignoredUserId?: number
  ): UserValidationResult {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();

    const emailExists = users.some(
      (user) =>
        user.id !== ignoredUserId &&
        user.email.trim().toLowerCase() === normalizedEmail
    );

    if (emailExists) {
      return {
        success: false,
        message: "Ya existe un usuario con ese correo electrónico.",
      };
    }

    const usernameExists = users.some(
      (user) =>
        user.id !== ignoredUserId &&
        user.username.trim().toLowerCase() === normalizedUsername
    );

    if (usernameExists) {
      return {
        success: false,
        message: "Ya existe un usuario con ese nombre de usuario.",
      };
    }

    return { success: true };
  }

  function addUser(user: Omit<User, "id">): UserValidationResult {
    const validation = validateUniqueUser(user.email, user.username);

    if (!validation.success) {
      return validation;
    }

    const newUser: User = {
      ...user,
      id: Date.now(),
    };

    saveUsers([...users, newUser]);

    return { success: true };
  }

  function updateUser(updatedUser: User): UserValidationResult {
    const validation = validateUniqueUser(
      updatedUser.email,
      updatedUser.username,
      updatedUser.id
    );

    if (!validation.success) {
      return validation;
    }

    saveUsers(
      users.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      )
    );

    return { success: true };
  }

  function deleteUser(id: number) {
    saveUsers(users.filter((user) => user.id !== id));
  }

  function toggleUserStatus(id: number) {
    saveUsers(
      users.map((user) =>
        user.id === id
          ? { ...user, active: !user.active }
          : user
      )
    );
  }

  return {
    users,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
  };
}