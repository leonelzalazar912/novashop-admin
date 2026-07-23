import {
  useEffect,
  useState,
} from "react";
import type { User } from "../data/usersData";
import {
  inviteUser as inviteUserService,
  loadUsers as loadUsersService,
  removeUser as removeUserService,
  updateUser as updateUserService,
} from "../services/usersService";

export type UserValidationResult =
  | {
      success: true;
      message?: string;
    }
  | {
      success: false;
      message: string;
    };

function sortUsers(
  users: User[]
): User[] {
  return [...users].sort(
    (firstUser, secondUser) =>
      firstUser.name.localeCompare(
        secondUser.name,
        "es"
      )
  );
}

export function useUsers() {
  const [users, setUsers] =
    useState<User[]>([]);

  const [storeId, setStoreId] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialUsers() {
      setLoading(true);
      setLoadError(null);

      const result =
        await loadUsersService();

      if (cancelled) {
        return;
      }

      if (!result.success) {
        setUsers([]);
        setLoadError(result.message);
        setLoading(false);
        return;
      }

      setStoreId(result.storeId);
      setUsers(
        sortUsers(result.users)
      );
      setLoading(false);
    }

    void loadInitialUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  async function reloadUsers(): Promise<UserValidationResult> {
    setLoading(true);
    setLoadError(null);

    const result =
      await loadUsersService(
        storeId ?? undefined
      );

    if (!result.success) {
      setLoadError(result.message);
      setLoading(false);

      return {
        success: false,
        message: result.message,
      };
    }

    setStoreId(result.storeId);
    setUsers(
      sortUsers(result.users)
    );
    setLoading(false);

    return {
      success: true,
    };
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
        user.email
          .trim()
          .toLowerCase() ===
          normalizedEmail
    );

    if (emailExists) {
      return {
        success: false,
        message:
          "Ya existe un usuario con ese correo electrónico.",
      };
    }

    return {
      success: true,
    };
  }

  async function addUser(
    user: Omit<User, "id">
  ): Promise<UserValidationResult> {
    const validation =
      validateUniqueUser(user.email);

    if (!validation.success) {
      return validation;
    }

    const result =
      await inviteUserService(
        {
          name: user.name,
          email: user.email,
          role: user.role,
          active: user.active,
        },
        storeId ?? undefined
      );

    if (!result.success) {
      return {
        success: false,
        message: result.message,
      };
    }

    setStoreId(result.storeId);

    setUsers((currentUsers) =>
      sortUsers([
        ...currentUsers,
        result.user,
      ])
    );

    return {
      success: true,
      message: result.message,
    };
  }

  async function updateUser(
    updatedUser: User
  ): Promise<UserValidationResult> {
    const currentUser = users.find(
      (user) =>
        user.id === updatedUser.id
    );

    if (!currentUser) {
      return {
        success: false,
        message:
          "No se encontró el usuario que intentás editar.",
      };
    }

    const currentEmail =
      currentUser.email
        .trim()
        .toLowerCase();

    const requestedEmail =
      updatedUser.email
        .trim()
        .toLowerCase();

    if (
      currentEmail !== requestedEmail
    ) {
      return {
        success: false,
        message:
          "El correo electrónico todavía no puede modificarse desde esta pantalla.",
      };
    }

    const result =
      await updateUserService(
        {
          id: updatedUser.id,
          name: updatedUser.name,
          role: updatedUser.role,
          active: updatedUser.active,
        },
        storeId ?? undefined
      );

    if (!result.success) {
      return {
        success: false,
        message: result.message,
      };
    }

    setStoreId(result.storeId);

    setUsers((currentUsers) =>
      sortUsers(
        currentUsers.map((user) =>
          user.id ===
          result.user.id
            ? {
                ...user,
                name:
                  result.user.name,
                role:
                  result.user.role,
                active:
                  result.user.active,
              }
            : user
        )
      )
    );

    return {
      success: true,
      message: result.message,
    };
  }

  async function deleteUser(
    id: string
  ): Promise<UserValidationResult> {
    const userToDelete =
      users.find(
        (user) => user.id === id
      );

    if (!userToDelete) {
      return {
        success: false,
        message:
          "No se encontró el usuario que intentás quitar.",
      };
    }

    const result =
      await removeUserService(
        id,
        storeId ?? undefined
      );

    if (!result.success) {
      return {
        success: false,
        message: result.message,
      };
    }

    setStoreId(result.storeId);

    setUsers((currentUsers) =>
      currentUsers.filter(
        (user) =>
          user.id !==
          result.removedUserId
      )
    );

    return {
      success: true,
      message: result.message,
    };
  }

  async function toggleUserStatus(
    id: string
  ): Promise<UserValidationResult> {
    const userToToggle =
      users.find(
        (user) => user.id === id
      );

    if (!userToToggle) {
      return {
        success: false,
        message:
          "No se encontró el usuario.",
      };
    }

    const result =
      await updateUserService(
        {
          id: userToToggle.id,
          name: userToToggle.name,
          role: userToToggle.role,
          active:
            !userToToggle.active,
        },
        storeId ?? undefined
      );

    if (!result.success) {
      return {
        success: false,
        message: result.message,
      };
    }

    setStoreId(result.storeId);

    setUsers((currentUsers) =>
      sortUsers(
        currentUsers.map((user) =>
          user.id ===
          result.user.id
            ? {
                ...user,
                name:
                  result.user.name,
                role:
                  result.user.role,
                active:
                  result.user.active,
              }
            : user
        )
      )
    );

    return {
      success: true,
      message: result.message,
    };
  }

  return {
    users,
    storeId,
    loading,
    loadError,
    reloadUsers,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
  };
}