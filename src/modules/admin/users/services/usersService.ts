import { supabase } from "../../../../lib/supabase";
import type {
  User,
  UserRole,
} from "../data/usersData";

type ManageUsersAction =
  | "list"
  | "invite"
  | "update"
  | "remove";

type ManageUsersRequestBody = {
  action: ManageUsersAction;
  storeId?: string;
  user?: unknown;
};

type ServiceFailure = {
  success: false;
  message: string;
};

type InvokeManageUsersResult =
  | {
      success: true;
      response: Record<string, unknown>;
    }
  | ServiceFailure;

export type InviteUserInput = {
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
};

export type UpdateUserInput = {
  id: string;
  name: string;
  role: UserRole;
  active: boolean;
};

export type UpdatedUser = Pick<
  User,
  "id" | "name" | "role" | "active"
>;

export type LoadUsersResult =
  | {
      success: true;
      storeId: string;
      users: User[];
    }
  | ServiceFailure;

export type InviteUserResult =
  | {
      success: true;
      storeId: string;
      invitationSent: boolean;
      message: string;
      user: User;
    }
  | ServiceFailure;

export type UpdateUserResult =
  | {
      success: true;
      storeId: string;
      message: string;
      user: UpdatedUser;
    }
  | ServiceFailure;

export type RemoveUserResult =
  | {
      success: true;
      storeId: string;
      message: string;
      removedUserId: string;
    }
  | ServiceFailure;

const USER_ROLES: readonly UserRole[] = [
  "Propietario",
  "Administrador",
  "Empleado",
  "Vendedor",
];

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isUserRole(
  value: unknown
): value is UserRole {
  return (
    typeof value === "string" &&
    USER_ROLES.includes(
      value as UserRole
    )
  );
}

function isUser(
  value: unknown
): value is User {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.email === "string" &&
    isUserRole(value.role) &&
    typeof value.active === "boolean"
  );
}

function isUpdatedUser(
  value: unknown
): value is UpdatedUser {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    isUserRole(value.role) &&
    typeof value.active === "boolean"
  );
}

function invalidResponse(): ServiceFailure {
  return {
    success: false,
    message:
      "La función no devolvió una respuesta válida.",
  };
}

function createRequestBody(
  action: ManageUsersAction,
  storeId?: string,
  user?: unknown
): ManageUsersRequestBody {
  const body: ManageUsersRequestBody = {
    action,
  };

  const normalizedStoreId =
    storeId?.trim();

  if (normalizedStoreId) {
    body.storeId = normalizedStoreId;
  }

  if (user !== undefined) {
    body.user = user;
  }

  return body;
}

async function getFunctionErrorMessage(
  error: unknown,
  fallbackMessage: string
): Promise<string> {
  if (
    typeof error !== "object" ||
    error === null ||
    !("context" in error)
  ) {
    return fallbackMessage;
  }

  const context = (
    error as {
      context?: Response;
    }
  ).context;

  if (!context) {
    return fallbackMessage;
  }

  try {
    const responseBody = (await context
      .clone()
      .json()) as {
      message?: unknown;
    };

    if (
      typeof responseBody.message ===
        "string" &&
      responseBody.message.trim() !== ""
    ) {
      return responseBody.message;
    }
  } catch {
    // La respuesta no contenía JSON válido.
  }

  return fallbackMessage;
}

async function invokeManageUsers(
  body: ManageUsersRequestBody,
  fallbackMessage: string
): Promise<InvokeManageUsersResult> {
  try {
    const { data, error } =
      await supabase.functions.invoke(
        "manage-users",
        {
          body,
        }
      );

    if (error) {
      return {
        success: false,
        message:
          await getFunctionErrorMessage(
            error,
            fallbackMessage
          ),
      };
    }

    if (!isRecord(data)) {
      return invalidResponse();
    }

    if (data.success !== true) {
      if (
        data.success === false &&
        typeof data.message === "string" &&
        data.message.trim() !== ""
      ) {
        return {
          success: false,
          message: data.message,
        };
      }

      return invalidResponse();
    }

    return {
      success: true,
      response: data,
    };
  } catch (caughtError) {
    console.error(caughtError);

    return {
      success: false,
      message: fallbackMessage,
    };
  }
}

export async function loadUsers(
  storeId?: string
): Promise<LoadUsersResult> {
  const result =
    await invokeManageUsers(
      createRequestBody(
        "list",
        storeId
      ),
      "Ocurrió un error inesperado al cargar los usuarios."
    );

  if (!result.success) {
    return result;
  }

  const {
    storeId: responseStoreId,
    users,
  } = result.response;

  if (
    typeof responseStoreId !==
      "string" ||
    !Array.isArray(users) ||
    !users.every(isUser)
  ) {
    return invalidResponse();
  }

  return {
    success: true,
    storeId: responseStoreId,
    users,
  };
}

export async function inviteUser(
  input: InviteUserInput,
  storeId?: string
): Promise<InviteUserResult> {
  const result =
    await invokeManageUsers(
      createRequestBody(
        "invite",
        storeId,
        {
          name: input.name.trim(),
          email: input.email
            .trim()
            .toLowerCase(),
          role: input.role,
          active: input.active,
        }
      ),
      "Ocurrió un error inesperado al invitar al usuario."
    );

  if (!result.success) {
    return result;
  }

  const {
    storeId: responseStoreId,
    invitationSent,
    message,
    user,
  } = result.response;

  if (
    typeof responseStoreId !==
      "string" ||
    typeof invitationSent !==
      "boolean" ||
    typeof message !== "string" ||
    !isUser(user)
  ) {
    return invalidResponse();
  }

  return {
    success: true,
    storeId: responseStoreId,
    invitationSent,
    message,
    user,
  };
}

export async function updateUser(
  input: UpdateUserInput,
  storeId?: string
): Promise<UpdateUserResult> {
  const result =
    await invokeManageUsers(
      createRequestBody(
        "update",
        storeId,
        {
          id: input.id.trim(),
          name: input.name.trim(),
          role: input.role,
          active: input.active,
        }
      ),
      "Ocurrió un error inesperado al actualizar el usuario."
    );

  if (!result.success) {
    return result;
  }

  const {
    storeId: responseStoreId,
    message,
    user,
  } = result.response;

  if (
    typeof responseStoreId !==
      "string" ||
    typeof message !== "string" ||
    !isUpdatedUser(user)
  ) {
    return invalidResponse();
  }

  return {
    success: true,
    storeId: responseStoreId,
    message,
    user,
  };
}

export async function removeUser(
  userId: string,
  storeId?: string
): Promise<RemoveUserResult> {
  const result =
    await invokeManageUsers(
      createRequestBody(
        "remove",
        storeId,
        {
          id: userId.trim(),
        }
      ),
      "Ocurrió un error inesperado al quitar el usuario."
    );

  if (!result.success) {
    return result;
  }

  const {
    storeId: responseStoreId,
    message,
    removedUserId,
  } = result.response;

  if (
    typeof responseStoreId !==
      "string" ||
    typeof message !== "string" ||
    typeof removedUserId !==
      "string"
  ) {
    return invalidResponse();
  }

  return {
    success: true,
    storeId: responseStoreId,
    message,
    removedUserId,
  };
}