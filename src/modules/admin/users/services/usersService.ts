import { supabase } from "../../../../lib/supabase";
import type { User } from "../data/usersData";

type ManageUsersSuccessResponse = {
  success: true;
  storeId: string;
  users: User[];
};

type ManageUsersErrorResponse = {
  success: false;
  message: string;
};

type ManageUsersResponse =
  | ManageUsersSuccessResponse
  | ManageUsersErrorResponse;

export type LoadUsersResult =
  | {
      success: true;
      storeId: string;
      users: User[];
    }
  | {
      success: false;
      message: string;
    };

async function getFunctionErrorMessage(
  error: unknown
): Promise<string> {
  if (
    typeof error !== "object" ||
    error === null ||
    !("context" in error)
  ) {
    return "No se pudieron cargar los usuarios.";
  }

  const context = (
    error as {
      context?: Response;
    }
  ).context;

  if (!context) {
    return "No se pudieron cargar los usuarios.";
  }

  try {
    const responseBody = (await context
      .clone()
      .json()) as {
      message?: unknown;
    };

    if (
      typeof responseBody.message === "string" &&
      responseBody.message.trim() !== ""
    ) {
      return responseBody.message;
    }
  } catch {
    // La respuesta no contenía un cuerpo JSON válido.
  }

  return "No se pudieron cargar los usuarios.";
}

export async function loadUsers(): Promise<LoadUsersResult> {
  try {
    const { data, error } =
      await supabase.functions.invoke(
        "manage-users",
        {
          body: {
            action: "list",
          },
        }
      );

    if (error) {
      return {
        success: false,
        message:
          await getFunctionErrorMessage(error),
      };
    }

    const response =
      data as ManageUsersResponse | null;

    if (!response) {
      return {
        success: false,
        message:
          "La función no devolvió una respuesta válida.",
      };
    }

    if (!response.success) {
      return {
        success: false,
        message: response.message,
      };
    }

    return {
      success: true,
      storeId: response.storeId,
      users: response.users,
    };
  } catch (caughtError) {
    console.error(caughtError);

    return {
      success: false,
      message:
        "Ocurrió un error inesperado al cargar los usuarios.",
    };
  }
}