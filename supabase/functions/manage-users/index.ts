import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

type RequestBody = {
  action?: unknown;
  storeId?: unknown;
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
        body = (await request.json()) as RequestBody;
      } catch {
        return errorResponse(
          "El cuerpo de la solicitud no es válido.",
          400
        );
      }

      if (body.action !== "list") {
        return errorResponse(
          "La acción solicitada no está disponible.",
          400
        );
      }

      const callerId = context.userClaims?.id;

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
          console.error(callerMembershipError);

          return errorResponse(
            "No se pudo comprobar la membresía del usuario.",
            500
          );
        }

        const callerMemberships =
          (callerMembershipData ??
            []) as StoreMemberRow[];

        if (callerMemberships.length === 0) {
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
          .eq("id", selectedMembership.role_id)
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
          (membersData ?? []) as StoreMemberRow[];

        if (members.length === 0) {
          return Response.json({
            success: true,
            storeId: selectedMembership.store_id,
            users: [],
          });
        }

        const userIds = [
          ...new Set(
            members.map(
              (membership) => membership.user_id
            )
          ),
        ];

        const roleIds = [
          ...new Set(
            members.map(
              (membership) => membership.role_id
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
          (profilesData ?? []) as ProfileRow[];

        const roles =
          (rolesData ?? []) as RoleRow[];

        const authUsers: AuthUserData[] =
          await Promise.all(
            userIds.map(async (userId) => {
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
                console.error(authUserError);

                throw new Error(
                  `No se pudo cargar el usuario de Auth: ${userId}`
                );
              }

              return {
                id: userId,
                email:
                  authUserData.user.email ?? "",
              };
            })
          );

        const profilesById = new Map(
          profiles.map((profile) => [
            profile.id,
            profile,
          ])
        );

        const rolesById = new Map(
          roles.map((role) => [role.id, role])
        );

        const authUsersById = new Map(
          authUsers.map((authUser) => [
            authUser.id,
            authUser,
          ])
        );

        const users = members
          .map((membership) => {
            const profile = profilesById.get(
              membership.user_id
            );

            const role = rolesById.get(
              membership.role_id
            );

            const authUser = authUsersById.get(
              membership.user_id
            );

            if (!role) {
              throw new Error(
                `No se encontró el rol de la membresía: ${membership.id}`
              );
            }

            const email =
              authUser?.email.trim() ?? "";

            const name =
              profile?.full_name?.trim() ||
              email ||
              "Usuario sin nombre";

            return {
              id: membership.user_id,
              name,
              email,
              role: role.name,
              active: membership.active,
            };
          })
          .sort((firstUser, secondUser) =>
            firstUser.name.localeCompare(
              secondUser.name,
              "es"
            )
          );

        return Response.json({
          success: true,
          storeId: selectedMembership.store_id,
          users,
        });
      } catch (caughtError) {
        console.error(caughtError);

        return errorResponse(
          "Ocurrió un error inesperado al cargar los usuarios.",
          500
        );
      }
    }
  ),
};