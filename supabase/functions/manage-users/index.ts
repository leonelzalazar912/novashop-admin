import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

const ROLE_CODE_BY_NAME = {
  Propietario: "owner",
  Administrador: "admin",
  Empleado: "employee",
  Vendedor: "seller",
} as const;

type UserRoleName =
  keyof typeof ROLE_CODE_BY_NAME;

type RequestBody = {
  action?: unknown;
  storeId?: unknown;
  user?: unknown;
};

type InviteUserInput = {
  name: string;
  email: string;
  role: UserRoleName;
  active: boolean;
};

type UpdateUserInput = {
  id: string;
  name: string;
  role: UserRoleName;
  active: boolean;
};

type RemoveUserInput = {
  id: string;
};

type StoreMemberRow = {
  id: string;
  store_id: string;
  user_id: string;
  role_id: string;
  active: boolean;
};

type ProfileRow = {
  id: string;
  full_name: string | null;
};

type RoleRow = {
  id: string;
  code: string;
  name: string;
};

type AuthUserData = {
  id: string;
  email: string;
  emailConfirmedAt: string | null;
};

type InviteUserParseResult =
  | {
      success: true;
      value: InviteUserInput;
    }
  | {
      success: false;
      message: string;
    };

type UpdateUserParseResult =
  | {
      success: true;
      value: UpdateUserInput;
    }
  | {
      success: false;
      message: string;
    };

type RemoveUserParseResult =
  | {
      success: true;
      value: RemoveUserInput;
    }
  | {
      success: false;
      message: string;
    };

function errorResponse(
  message: string,
  status: number
): Response {
  return Response.json(
    {
      success: false,
      message,
    },
    {
      status,
    }
  );
}

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isUserRoleName(
  value: unknown
): value is UserRoleName {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(
      ROLE_CODE_BY_NAME,
      value
    )
  );
}

function parseInviteUser(
  value: unknown
): InviteUserParseResult {
  if (!isRecord(value)) {
    return {
      success: false,
      message:
        "Los datos del usuario no son válidos.",
    };
  }

  const name =
    typeof value.name === "string"
      ? value.name.trim()
      : "";

  const email =
    typeof value.email === "string"
      ? value.email.trim().toLowerCase()
      : "";

  const role = value.role;

  const active =
    value.active === undefined
      ? true
      : value.active;

  if (!name) {
    return {
      success: false,
      message:
        "El nombre del usuario es obligatorio.",
    };
  }

  if (name.length > 150) {
    return {
      success: false,
      message:
        "El nombre del usuario es demasiado largo.",
    };
  }

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !email ||
    email.length > 320 ||
    !emailPattern.test(email)
  ) {
    return {
      success: false,
      message:
        "El correo electrónico no es válido.",
    };
  }

  if (!isUserRoleName(role)) {
    return {
      success: false,
      message:
        "El rol seleccionado no es válido.",
    };
  }

  if (typeof active !== "boolean") {
    return {
      success: false,
      message:
        "El estado del usuario no es válido.",
    };
  }

  return {
    success: true,
    value: {
      name,
      email,
      role,
      active,
    },
  };
}

function parseUpdateUser(
  value: unknown
): UpdateUserParseResult {
  if (!isRecord(value)) {
    return {
      success: false,
      message:
        "Los datos del usuario no son válidos.",
    };
  }

  const id =
    typeof value.id === "string"
      ? value.id.trim()
      : "";

  const name =
    typeof value.name === "string"
      ? value.name.trim()
      : "";

  const role = value.role;
  const active = value.active;

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(id)) {
    return {
      success: false,
      message:
        "El identificador del usuario no es válido.",
    };
  }

  if (!name) {
    return {
      success: false,
      message:
        "El nombre del usuario es obligatorio.",
    };
  }

  if (name.length > 150) {
    return {
      success: false,
      message:
        "El nombre del usuario es demasiado largo.",
    };
  }

  if (!isUserRoleName(role)) {
    return {
      success: false,
      message:
        "El rol seleccionado no es válido.",
    };
  }

  if (typeof active !== "boolean") {
    return {
      success: false,
      message:
        "El estado del usuario no es válido.",
    };
  }

  return {
    success: true,
    value: {
      id,
      name,
      role,
      active,
    },
  };
}

function parseRemoveUser(
  value: unknown
): RemoveUserParseResult {
  if (!isRecord(value)) {
    return {
      success: false,
      message:
        "Los datos del usuario no son válidos.",
    };
  }

  const id =
    typeof value.id === "string"
      ? value.id.trim()
      : "";

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(id)) {
    return {
      success: false,
      message:
        "El identificador del usuario no es válido.",
    };
  }

  return {
    success: true,
    value: {
      id,
    },
  };
}

export default {
  fetch: withSupabase(
    { auth: "user" },
    async (request, context) => {
      if (request.method !== "POST") {
        return Response.json(
          {
            success: false,
            message:
              "Método no permitido. Utilizá una solicitud POST.",
          },
          {
            status: 405,
            headers: {
              Allow: "POST",
            },
          }
        );
      }

      let body: RequestBody;

      try {
        body =
          (await request.json()) as RequestBody;
      } catch {
        return errorResponse(
          "El cuerpo de la solicitud no es válido.",
          400
        );
      }

      if (
        body.action !== "list" &&
        body.action !== "invite" &&
        body.action !== "update" &&
        body.action !== "remove"
      ) {
        return errorResponse(
          "La acción solicitada no está disponible.",
          400
        );
      }

      const callerId =
        context.userClaims?.id;

      if (!callerId) {
        return errorResponse(
          "No se pudo identificar al usuario autenticado.",
          401
        );
      }

      const requestedStoreId =
        typeof body.storeId === "string" &&
        body.storeId.trim() !== ""
          ? body.storeId.trim()
          : null;

      try {
        const {
          data: callerMembershipData,
          error: callerMembershipError,
        } = await context.supabaseAdmin
          .from("store_members")
          .select(
            "id, store_id, user_id, role_id, active"
          )
          .eq("user_id", callerId)
          .eq("active", true);

        if (callerMembershipError) {
          console.error(
            callerMembershipError
          );

          return errorResponse(
            "No se pudo comprobar la membresía del usuario.",
            500
          );
        }

        const callerMemberships =
          (callerMembershipData ??
            []) as StoreMemberRow[];

        if (
          callerMemberships.length === 0
        ) {
          return errorResponse(
            "El usuario no pertenece a una tienda activa.",
            403
          );
        }

        let selectedMembership:
          | StoreMemberRow
          | undefined;

        if (requestedStoreId) {
          selectedMembership =
            callerMemberships.find(
              (membership) =>
                membership.store_id ===
                requestedStoreId
            );

          if (!selectedMembership) {
            return errorResponse(
              "No tenés acceso a la tienda solicitada.",
              403
            );
          }
        } else if (
          callerMemberships.length === 1
        ) {
          selectedMembership =
            callerMemberships[0];
        } else {
          return errorResponse(
            "El usuario pertenece a más de una tienda. Es necesario indicar la tienda activa.",
            400
          );
        }

        const {
          data: callerRoleData,
          error: callerRoleError,
        } = await context.supabaseAdmin
          .from("roles")
          .select("id, code, name")
          .eq(
            "id",
            selectedMembership.role_id
          )
          .eq(
            "store_id",
            selectedMembership.store_id
          )
          .maybeSingle();

        if (callerRoleError) {
          console.error(callerRoleError);

          return errorResponse(
            "No se pudo comprobar el rol del usuario.",
            500
          );
        }

        const callerRole =
          callerRoleData as RoleRow | null;

        if (!callerRole) {
          return errorResponse(
            "No se encontró el rol del usuario.",
            403
          );
        }

        const canManageUsers =
          callerRole.code === "owner" ||
          callerRole.code === "admin";

        if (!canManageUsers) {
          return errorResponse(
            "No tenés permisos para administrar usuarios.",
            403
          );
        }

        if (body.action === "list") {
          const {
            data: membersData,
            error: membersError,
          } = await context.supabaseAdmin
            .from("store_members")
            .select(
              "id, store_id, user_id, role_id, active"
            )
            .eq(
              "store_id",
              selectedMembership.store_id
            )
            .order("created_at", {
              ascending: true,
            });

          if (membersError) {
            console.error(membersError);

            return errorResponse(
              "No se pudieron cargar los miembros de la tienda.",
              500
            );
          }

          const members =
            (membersData ??
              []) as StoreMemberRow[];

          if (members.length === 0) {
            return Response.json({
              success: true,
              storeId:
                selectedMembership.store_id,
              users: [],
            });
          }

          const userIds = [
            ...new Set(
              members.map(
                (membership) =>
                  membership.user_id
              )
            ),
          ];

          const roleIds = [
            ...new Set(
              members.map(
                (membership) =>
                  membership.role_id
              )
            ),
          ];

          const {
            data: profilesData,
            error: profilesError,
          } = await context.supabaseAdmin
            .from("profiles")
            .select("id, full_name")
            .in("id", userIds);

          if (profilesError) {
            console.error(profilesError);

            return errorResponse(
              "No se pudieron cargar los perfiles.",
              500
            );
          }

          const {
            data: rolesData,
            error: rolesError,
          } = await context.supabaseAdmin
            .from("roles")
            .select("id, code, name")
            .eq(
              "store_id",
              selectedMembership.store_id
            )
            .in("id", roleIds);

          if (rolesError) {
            console.error(rolesError);

            return errorResponse(
              "No se pudieron cargar los roles.",
              500
            );
          }

          const profiles =
            (profilesData ??
              []) as ProfileRow[];

          const roles =
            (rolesData ?? []) as RoleRow[];

          const authUsers: AuthUserData[] =
            await Promise.all(
              userIds.map(
                async (userId) => {
                  const {
                    data: authUserData,
                    error: authUserError,
                  } =
                    await context.supabaseAdmin.auth.admin.getUserById(
                      userId
                    );

                  if (
                    authUserError ||
                    !authUserData.user
                  ) {
                    console.error(
                      authUserError
                    );

                    throw new Error(
                      `No se pudo cargar el usuario de Auth: ${userId}`
                    );
                  }

                  return {
                    id: userId,
                    email:
                      authUserData.user
                        .email ?? "",
                    emailConfirmedAt:
                      authUserData.user
                        .email_confirmed_at ??
                      null,
                  };
                }
              )
            );

          const profilesById = new Map(
            profiles.map((profile) => [
              profile.id,
              profile,
            ])
          );

          const rolesById = new Map(
            roles.map((role) => [
              role.id,
              role,
            ])
          );

          const authUsersById = new Map(
            authUsers.map((authUser) => [
              authUser.id,
              authUser,
            ])
          );

          const users = members
            .map((membership) => {
              const profile =
                profilesById.get(
                  membership.user_id
                );

              const role = rolesById.get(
                membership.role_id
              );

              const authUser =
                authUsersById.get(
                  membership.user_id
                );

              if (!role) {
                throw new Error(
                  `No se encontró el rol de la membresía: ${membership.id}`
                );
              }

              const email =
                authUser?.email.trim() ??
                "";

              const name =
                profile?.full_name?.trim() ||
                email ||
                "Usuario sin nombre";

              return {
                id: membership.user_id,
                name,
                email,
                role: role.name,
                active:
                  membership.active,
              };
            })
            .sort(
              (
                firstUser,
                secondUser
              ) =>
                firstUser.name.localeCompare(
                  secondUser.name,
                  "es"
                )
            );

          return Response.json({
            success: true,
            storeId:
              selectedMembership.store_id,
            users,
          });
        }

        if (body.action === "update") {
          const parsedUser =
            parseUpdateUser(body.user);

          if (!parsedUser.success) {
            return errorResponse(
              parsedUser.message,
              400
            );
          }

          const updateUser =
            parsedUser.value;

          const {
            data: targetMembershipData,
            error: targetMembershipError,
          } = await context.supabaseAdmin
            .from("store_members")
            .select(
              "id, store_id, user_id, role_id, active"
            )
            .eq(
              "store_id",
              selectedMembership.store_id
            )
            .eq(
              "user_id",
              updateUser.id
            )
            .maybeSingle();

          if (targetMembershipError) {
            console.error(
              targetMembershipError
            );

            return errorResponse(
              "No se pudo comprobar la membresía del usuario.",
              500
            );
          }

          const targetMembership =
            targetMembershipData as
              | StoreMemberRow
              | null;

          if (!targetMembership) {
            return errorResponse(
              "El usuario no pertenece a esta tienda.",
              404
            );
          }

          const {
            data: targetRoleData,
            error: targetRoleError,
          } = await context.supabaseAdmin
            .from("roles")
            .select("id, code, name")
            .eq(
              "id",
              targetMembership.role_id
            )
            .eq(
              "store_id",
              selectedMembership.store_id
            )
            .maybeSingle();

          if (targetRoleError) {
            console.error(
              targetRoleError
            );

            return errorResponse(
              "No se pudo comprobar el rol actual del usuario.",
              500
            );
          }

          const targetRole =
            targetRoleData as
              | RoleRow
              | null;

          if (!targetRole) {
            return errorResponse(
              "No se encontró el rol actual del usuario.",
              500
            );
          }

          if (
            targetRole.code === "owner" &&
            callerRole.code !== "owner"
          ) {
            return errorResponse(
              "Solamente un propietario puede modificar a otro propietario.",
              403
            );
          }

          const requestedRoleCode =
            ROLE_CODE_BY_NAME[
              updateUser.role
            ];

          if (
            requestedRoleCode === "owner" &&
            callerRole.code !== "owner"
          ) {
            return errorResponse(
              "Solamente un propietario puede asignar el rol Propietario.",
              403
            );
          }

          const {
            data: requestedRoleData,
            error: requestedRoleError,
          } = await context.supabaseAdmin
            .from("roles")
            .select("id, code, name")
            .eq(
              "store_id",
              selectedMembership.store_id
            )
            .eq(
              "code",
              requestedRoleCode
            )
            .maybeSingle();

          if (requestedRoleError) {
            console.error(
              requestedRoleError
            );

            return errorResponse(
              "No se pudo comprobar el rol seleccionado.",
              500
            );
          }

          const requestedRole =
            requestedRoleData as
              | RoleRow
              | null;

          if (!requestedRole) {
            return errorResponse(
              "El rol seleccionado no existe en esta tienda.",
              400
            );
          }

          const removesActiveOwner =
            targetRole.code === "owner" &&
            targetMembership.active &&
            (
              requestedRole.code !== "owner" ||
              !updateUser.active
            );

          if (removesActiveOwner) {
            const {
              count: otherActiveOwners,
              error: ownersCountError,
            } = await context.supabaseAdmin
              .from("store_members")
              .select("id", {
                count: "exact",
                head: true,
              })
              .eq(
                "store_id",
                selectedMembership.store_id
              )
              .eq(
                "role_id",
                targetRole.id
              )
              .eq("active", true)
              .neq(
                "user_id",
                updateUser.id
              );

            if (ownersCountError) {
              console.error(
                ownersCountError
              );

              return errorResponse(
                "No se pudo comprobar la cantidad de propietarios activos.",
                500
              );
            }

            if (
              (otherActiveOwners ?? 0) === 0
            ) {
              return errorResponse(
                "No se puede cambiar el rol ni desactivar al último propietario activo.",
                409
              );
            }
          }

          const removesActiveAdministrator =
            targetRole.code === "admin" &&
            targetMembership.active &&
            (
              requestedRole.code !== "admin" ||
              !updateUser.active
            );

          if (
            removesActiveAdministrator
          ) {
            const {
              count:
                otherActiveAdministrators,
              error:
                administratorsCountError,
            } = await context.supabaseAdmin
              .from("store_members")
              .select("id", {
                count: "exact",
                head: true,
              })
              .eq(
                "store_id",
                selectedMembership.store_id
              )
              .eq(
                "role_id",
                targetRole.id
              )
              .eq("active", true)
              .neq(
                "user_id",
                updateUser.id
              );

            if (
              administratorsCountError
            ) {
              console.error(
                administratorsCountError
              );

              return errorResponse(
                "No se pudo comprobar la cantidad de administradores activos.",
                500
              );
            }

            if (
              (
                otherActiveAdministrators ??
                0
              ) === 0
            ) {
              return errorResponse(
                "No se puede cambiar el rol ni desactivar al último administrador activo.",
                409
              );
            }
          }

          const {
            data: currentProfileData,
            error: currentProfileError,
          } = await context.supabaseAdmin
            .from("profiles")
            .select("id, full_name")
            .eq("id", updateUser.id)
            .maybeSingle();

          if (currentProfileError) {
            console.error(
              currentProfileError
            );

            return errorResponse(
              "No se pudo comprobar el perfil del usuario.",
              500
            );
          }

          const currentProfile =
            currentProfileData as
              | ProfileRow
              | null;

          const {
            error: profileUpsertError,
          } = await context.supabaseAdmin
            .from("profiles")
            .upsert(
              {
                id: updateUser.id,
                full_name:
                  updateUser.name,
              },
              {
                onConflict: "id",
              }
            );

          if (profileUpsertError) {
            console.error(
              profileUpsertError
            );

            return errorResponse(
              "No se pudo actualizar el perfil del usuario.",
              500
            );
          }

          const {
            data: updatedMembershipData,
            error: membershipUpdateError,
          } = await context.supabaseAdmin
            .from("store_members")
            .update({
              role_id: requestedRole.id,
              active: updateUser.active,
            })
            .eq(
              "id",
              targetMembership.id
            )
            .eq(
              "store_id",
              selectedMembership.store_id
            )
            .select(
              "id, store_id, user_id, role_id, active"
            )
            .single();

          if (
            membershipUpdateError ||
            !updatedMembershipData
          ) {
            console.error(
              membershipUpdateError
            );

            if (currentProfile) {
              const {
                error:
                  profileRollbackError,
              } = await context.supabaseAdmin
                .from("profiles")
                .update({
                  full_name:
                    currentProfile.full_name,
                })
                .eq(
                  "id",
                  updateUser.id
                );

              if (
                profileRollbackError
              ) {
                console.error(
                  "No se pudo revertir el perfil:",
                  profileRollbackError
                );
              }
            } else {
              const {
                error:
                  profileRollbackError,
              } = await context.supabaseAdmin
                .from("profiles")
                .delete()
                .eq(
                  "id",
                  updateUser.id
                );

              if (
                profileRollbackError
              ) {
                console.error(
                  "No se pudo revertir el perfil creado:",
                  profileRollbackError
                );
              }
            }

            return errorResponse(
              "No se pudo actualizar la membresía del usuario.",
              500
            );
          }

          const updatedMembership =
            updatedMembershipData as
              StoreMemberRow;

          return Response.json({
            success: true,
            storeId:
              selectedMembership.store_id,
            message:
              "El usuario fue actualizado correctamente.",
            user: {
              id: updateUser.id,
              name: updateUser.name,
              role: requestedRole.name,
              active:
                updatedMembership.active,
            },
          });
        }

        if (body.action === "remove") {
          const parsedUser =
            parseRemoveUser(body.user);

          if (!parsedUser.success) {
            return errorResponse(
              parsedUser.message,
              400
            );
          }

          const removeUser =
            parsedUser.value;

          if (removeUser.id === callerId) {
            return errorResponse(
              "No podés quitar tu propia membresía desde la administración de usuarios.",
              409
            );
          }

          const {
            data: targetMembershipData,
            error: targetMembershipError,
          } = await context.supabaseAdmin
            .from("store_members")
            .select(
              "id, store_id, user_id, role_id, active"
            )
            .eq(
              "store_id",
              selectedMembership.store_id
            )
            .eq(
              "user_id",
              removeUser.id
            )
            .maybeSingle();

          if (targetMembershipError) {
            console.error(
              targetMembershipError
            );

            return errorResponse(
              "No se pudo comprobar la membresía del usuario.",
              500
            );
          }

          const targetMembership =
            targetMembershipData as
              | StoreMemberRow
              | null;

          if (!targetMembership) {
            return errorResponse(
              "El usuario no pertenece a esta tienda.",
              404
            );
          }

          const {
            data: targetRoleData,
            error: targetRoleError,
          } = await context.supabaseAdmin
            .from("roles")
            .select("id, code, name")
            .eq(
              "id",
              targetMembership.role_id
            )
            .eq(
              "store_id",
              selectedMembership.store_id
            )
            .maybeSingle();

          if (targetRoleError) {
            console.error(
              targetRoleError
            );

            return errorResponse(
              "No se pudo comprobar el rol actual del usuario.",
              500
            );
          }

          const targetRole =
            targetRoleData as
              | RoleRow
              | null;

          if (!targetRole) {
            return errorResponse(
              "No se encontró el rol actual del usuario.",
              500
            );
          }

          if (
            targetRole.code === "owner" &&
            callerRole.code !== "owner"
          ) {
            return errorResponse(
              "Solamente un propietario puede quitar a otro propietario.",
              403
            );
          }

          if (
            targetRole.code === "owner" &&
            targetMembership.active
          ) {
            const {
              count: otherActiveOwners,
              error: ownersCountError,
            } = await context.supabaseAdmin
              .from("store_members")
              .select("id", {
                count: "exact",
                head: true,
              })
              .eq(
                "store_id",
                selectedMembership.store_id
              )
              .eq(
                "role_id",
                targetRole.id
              )
              .eq("active", true)
              .neq(
                "user_id",
                removeUser.id
              );

            if (ownersCountError) {
              console.error(
                ownersCountError
              );

              return errorResponse(
                "No se pudo comprobar la cantidad de propietarios activos.",
                500
              );
            }

            if (
              (otherActiveOwners ?? 0) === 0
            ) {
              return errorResponse(
                "No se puede quitar al último propietario activo.",
                409
              );
            }
          }

          if (
            targetRole.code === "admin" &&
            targetMembership.active
          ) {
            const {
              count:
                otherActiveAdministrators,
              error:
                administratorsCountError,
            } = await context.supabaseAdmin
              .from("store_members")
              .select("id", {
                count: "exact",
                head: true,
              })
              .eq(
                "store_id",
                selectedMembership.store_id
              )
              .eq(
                "role_id",
                targetRole.id
              )
              .eq("active", true)
              .neq(
                "user_id",
                removeUser.id
              );

            if (
              administratorsCountError
            ) {
              console.error(
                administratorsCountError
              );

              return errorResponse(
                "No se pudo comprobar la cantidad de administradores activos.",
                500
              );
            }

            if (
              (
                otherActiveAdministrators ??
                0
              ) === 0
            ) {
              return errorResponse(
                "No se puede quitar al último administrador activo.",
                409
              );
            }
          }

          const {
            data: removedMembershipData,
            error: membershipDeleteError,
          } = await context.supabaseAdmin
            .from("store_members")
            .delete()
            .eq(
              "id",
              targetMembership.id
            )
            .eq(
              "store_id",
              selectedMembership.store_id
            )
            .select("id, user_id")
            .single();

          if (
            membershipDeleteError ||
            !removedMembershipData
          ) {
            console.error(
              membershipDeleteError
            );

            return errorResponse(
              "No se pudo quitar al usuario de la tienda.",
              500
            );
          }

          return Response.json({
            success: true,
            storeId:
              selectedMembership.store_id,
            message:
              "El usuario fue quitado de la tienda correctamente.",
            removedUserId:
              removeUser.id,
          });
        }

        const parsedUser =
          parseInviteUser(body.user);

        if (!parsedUser.success) {
          return errorResponse(
            parsedUser.message,
            400
          );
        }

        const inviteUser =
          parsedUser.value;

        const requestedRoleCode =
          ROLE_CODE_BY_NAME[
            inviteUser.role
          ];

        if (
          requestedRoleCode === "owner" &&
          callerRole.code !== "owner"
        ) {
          return errorResponse(
            "Solamente un propietario puede asignar el rol Propietario.",
            403
          );
        }

        const {
          data: requestedRoleData,
          error: requestedRoleError,
        } = await context.supabaseAdmin
          .from("roles")
          .select("id, code, name")
          .eq(
            "store_id",
            selectedMembership.store_id
          )
          .eq(
            "code",
            requestedRoleCode
          )
          .maybeSingle();

        if (requestedRoleError) {
          console.error(
            requestedRoleError
          );

          return errorResponse(
            "No se pudo comprobar el rol seleccionado.",
            500
          );
        }

        const requestedRole =
          requestedRoleData as
            | RoleRow
            | null;

        if (!requestedRole) {
          return errorResponse(
            "El rol seleccionado no existe en esta tienda.",
            400
          );
        }

        async function findAuthUserByEmail(
          email: string
        ): Promise<AuthUserData | null> {
          const perPage = 1000;
          let page = 1;

          while (true) {
            const {
              data: authUsersData,
              error: authUsersError,
            } =
              await context.supabaseAdmin.auth.admin.listUsers(
                {
                  page,
                  perPage,
                }
              );

            if (authUsersError) {
              console.error(
                authUsersError
              );

              throw new Error(
                "No se pudo consultar el directorio de usuarios."
              );
            }

            const matchingUser =
              authUsersData.users.find(
                (authUser) =>
                  authUser.email
                    ?.trim()
                    .toLowerCase() ===
                  email
              );

            if (matchingUser) {
              return {
                id: matchingUser.id,
                email:
                  matchingUser.email ??
                  email,
                emailConfirmedAt:
                  matchingUser
                    .email_confirmed_at ??
                  null,
              };
            }

            if (
              authUsersData.users.length <
              perPage
            ) {
              return null;
            }

            page += 1;
          }
        }

        let existingAuthUser:
          | AuthUserData
          | null;

        try {
          existingAuthUser =
            await findAuthUserByEmail(
              inviteUser.email
            );
        } catch {
          return errorResponse(
            "No se pudo verificar si el correo ya está registrado.",
            500
          );
        }

        if (existingAuthUser) {
          const {
            data: existingMembership,
            error:
              existingMembershipError,
          } = await context.supabaseAdmin
            .from("store_members")
            .select("id")
            .eq(
              "store_id",
              selectedMembership.store_id
            )
            .eq(
              "user_id",
              existingAuthUser.id
            )
            .maybeSingle();

          if (
            existingMembershipError
          ) {
            console.error(
              existingMembershipError
            );

            return errorResponse(
              "No se pudo comprobar si el usuario ya pertenece a la tienda.",
              500
            );
          }

          if (existingMembership) {
            return errorResponse(
              "El usuario ya pertenece a esta tienda.",
              409
            );
          }
        }

        let authUser =
          existingAuthUser;

        let invitationSent = false;

        if (!authUser) {
          const {
            data: invitationData,
            error: invitationError,
          } =
            await context.supabaseAdmin.auth.admin.inviteUserByEmail(
              inviteUser.email,
              {
                data: {
                  full_name:
                    inviteUser.name,
                },
              }
            );

          if (
            invitationError ||
            !invitationData.user
          ) {
            console.error(
              invitationError
            );

            return errorResponse(
              "No se pudo enviar la invitación al usuario.",
              500
            );
          }

          authUser = {
            id: invitationData.user.id,
            email:
              invitationData.user.email ??
              inviteUser.email,
            emailConfirmedAt:
              invitationData.user
                .email_confirmed_at ??
              null,
          };

          invitationSent = true;
        }

        async function rollbackInvitedUser() {
          if (!invitationSent) {
            return;
          }

          const {
            error: deleteAuthUserError,
          } =
            await context.supabaseAdmin.auth.admin.deleteUser(
              authUser.id
            );

          if (deleteAuthUserError) {
            console.error(
              "No se pudo revertir el usuario invitado:",
              deleteAuthUserError
            );
          }
        }

        const {
          data: existingProfileData,
          error: existingProfileError,
        } = await context.supabaseAdmin
          .from("profiles")
          .select("id, full_name")
          .eq("id", authUser.id)
          .maybeSingle();

        if (existingProfileError) {
          console.error(
            existingProfileError
          );

          await rollbackInvitedUser();

          return errorResponse(
            "No se pudo comprobar el perfil del usuario.",
            500
          );
        }

        const existingProfile =
          existingProfileData as
            | ProfileRow
            | null;

        const existingProfileName =
          existingProfile?.full_name?.trim() ??
          "";

        const effectiveName =
          existingProfileName ||
          inviteUser.name;

        const now =
          new Date().toISOString();

        const {
          data: createdMembershipData,
          error: membershipInsertError,
        } = await context.supabaseAdmin
          .from("store_members")
          .insert({
            store_id:
              selectedMembership.store_id,
            user_id: authUser.id,
            role_id: requestedRole.id,
            active: inviteUser.active,
            invited_at: invitationSent
              ? now
              : null,
            joined_at: invitationSent
              ? null
              : now,
          })
          .select(
            "id, store_id, user_id, role_id, active"
          )
          .single();

        if (
          membershipInsertError ||
          !createdMembershipData
        ) {
          console.error(
            membershipInsertError
          );

          await rollbackInvitedUser();

          if (
            membershipInsertError?.code ===
            "23505"
          ) {
            return errorResponse(
              "El usuario ya pertenece a esta tienda.",
              409
            );
          }

          return errorResponse(
            "No se pudo agregar el usuario a la tienda.",
            500
          );
        }

        const createdMembership =
          createdMembershipData as
            StoreMemberRow;

        const shouldWriteProfile =
          !existingProfile ||
          !existingProfileName;

        if (shouldWriteProfile) {
          const {
            error: profileUpsertError,
          } = await context.supabaseAdmin
            .from("profiles")
            .upsert(
              {
                id: authUser.id,
                full_name:
                  inviteUser.name,
              },
              {
                onConflict: "id",
              }
            );

          if (profileUpsertError) {
            console.error(
              profileUpsertError
            );

            const {
              error:
                membershipRollbackError,
            } =
              await context.supabaseAdmin
                .from("store_members")
                .delete()
                .eq(
                  "id",
                  createdMembership.id
                )
                .eq(
                  "store_id",
                  selectedMembership.store_id
                );

            if (
              membershipRollbackError
            ) {
              console.error(
                "No se pudo revertir la membresía:",
                membershipRollbackError
              );
            }

            await rollbackInvitedUser();

            return errorResponse(
              "No se pudo guardar el perfil del usuario.",
              500
            );
          }
        }

        return Response.json(
          {
            success: true,
            storeId:
              selectedMembership.store_id,
            invitationSent,
            message: invitationSent
              ? "La invitación fue enviada correctamente."
              : "El usuario existente fue agregado a la tienda.",
            user: {
              id: authUser.id,
              name: effectiveName,
              email:
                authUser.email.trim() ||
                inviteUser.email,
              role: requestedRole.name,
              active:
                createdMembership.active,
            },
          },
          {
            status: 201,
          }
        );
      } catch (caughtError) {
        console.error(caughtError);

        const unexpectedErrorMessage =
          body.action === "invite"
            ? "Ocurrió un error inesperado al agregar el usuario."
            : body.action === "update"
              ? "Ocurrió un error inesperado al actualizar el usuario."
              : body.action === "remove"
                ? "Ocurrió un error inesperado al quitar el usuario."
                : "Ocurrió un error inesperado al cargar los usuarios.";

        return errorResponse(
          unexpectedErrorMessage,
          500
        );
      }
    }
  ),
};