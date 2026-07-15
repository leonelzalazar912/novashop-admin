import { useState } from "react";
import {
  initialUsers,
  type User,
} from "../data/usersData";

export type UserValidationResult =
  | { success: true }
  | { success: false; message: string };

export function useUsers() {
  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem("users");

    if (!stored) {
      return initialUsers;
    }

    try {
      return JSON.parse(stored) as User[];
    } catch {
      return initialUsers;
    }
  });

  function saveUsers(nextUsers: User[]) {
    setUsers(nextUsers);

    localStorage.setItem(
      "users",
      JSON.stringify(nextUsers)
    );
  }

  function validateUniqueUser(
    email: string,
    ignoredUserId?: string
  ): UserValidationResult {
    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const emailExists = users.some(
      (user) =>
        user.id !== ignoredUserId &&
        user.email.trim().toLowerCase() ===
          normalizedEmail
    );

    if (emailExists) {
      return {
        success: false,
        message:
          "Ya existe un usuario con ese correo electrónico.",
      };
    }

    return { success: true };
  }

  function addUser(
    user: Omit<User, "id">
  ): UserValidationResult {
    const validation = validateUniqueUser(
      user.email
    );

    if (!validation.success) {
      return validation;
    }

    const newUser: User = {
      ...user,
      id: crypto.randomUUID(),
    };

    saveUsers([...users, newUser]);

    return { success: true };
  }

  function updateUser(
    updatedUser: User
  ): UserValidationResult {
    const currentUser = users.find(
      (user) => user.id === updatedUser.id
    );

    if (!currentUser) {
      return {
        success: false,
        message:
          "No se encontró el usuario que intentás editar.",
      };
    }

    const validation = validateUniqueUser(
      updatedUser.email,
      updatedUser.id
    );

    if (!validation.success) {
      return validation;
    }

    const isRemovingActiveOwner =
      currentUser.role === "Propietario" &&
      currentUser.active &&
      (updatedUser.role !== "Propietario" ||
        !updatedUser.active);

    if (isRemovingActiveOwner) {
      const otherActiveOwners = users.filter(
        (user) =>
          user.id !== currentUser.id &&
          user.role === "Propietario" &&
          user.active
      );

      if (otherActiveOwners.length === 0) {
        return {
          success: false,
          message:
            "No se puede cambiar el rol ni desactivar al último propietario activo.",
        };
      }
    }

    const isRemovingActiveAdministrator =
      currentUser.role === "Administrador" &&
      currentUser.active &&
      (updatedUser.role !== "Administrador" ||
        !updatedUser.active);

    if (isRemovingActiveAdministrator) {
      const otherActiveAdministrators =
        users.filter(
          (user) =>
            user.id !== currentUser.id &&
            user.role === "Administrador" &&
            user.active
        );

      if (
        otherActiveAdministrators.length === 0
      ) {
        return {
          success: false,
          message:
            "No se puede cambiar el rol ni desactivar al último administrador activo.",
        };
      }
    }

    saveUsers(
      users.map((user) =>
        user.id === updatedUser.id
          ? updatedUser
          : user
      )
    );

    return { success: true };
  }

  function deleteUser(
    id: string
  ): UserValidationResult {
    const userToDelete = users.find(
      (user) => user.id === id
    );

    if (!userToDelete) {
      return {
        success: false,
        message:
          "No se encontró el usuario que intentás eliminar.",
      };
    }

    if (userToDelete.role === "Propietario") {
      const owners = users.filter(
        (user) =>
          user.role === "Propietario"
      );

      if (owners.length === 1) {
        return {
          success: false,
          message:
            "No se puede eliminar al último propietario.",
        };
      }
    }

    if (
      userToDelete.role === "Administrador"
    ) {
      const administrators = users.filter(
        (user) =>
          user.role === "Administrador"
      );

      if (administrators.length === 1) {
        return {
          success: false,
          message:
            "No se puede eliminar al último administrador.",
        };
      }
    }

    saveUsers(
      users.filter((user) => user.id !== id)
    );

    return { success: true };
  }

  function toggleUserStatus(
    id: string
  ): UserValidationResult {
    const userToToggle = users.find(
      (user) => user.id === id
    );

    if (!userToToggle) {
      return {
        success: false,
        message: "No se encontró el usuario.",
      };
    }

    if (
      userToToggle.role === "Propietario" &&
      userToToggle.active
    ) {
      const activeOwners = users.filter(
        (user) =>
          user.role === "Propietario" &&
          user.active
      );

      if (activeOwners.length === 1) {
        return {
          success: false,
          message:
            "No se puede desactivar al último propietario activo.",
        };
      }
    }

    if (
      userToToggle.role === "Administrador" &&
      userToToggle.active
    ) {
      const activeAdministrators =
        users.filter(
          (user) =>
            user.role === "Administrador" &&
            user.active
        );

      if (
        activeAdministrators.length === 1
      ) {
        return {
          success: false,
          message:
            "No se puede desactivar al último administrador activo.",
        };
      }
    }

    saveUsers(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              active: !user.active,
            }
          : user
      )
    );

    return { success: true };
  }

  return {
    users,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
  };
}