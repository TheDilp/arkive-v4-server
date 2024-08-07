import { SelectExpression, SelectQueryBuilder } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { DB, DocumentTemplateFields } from "kysely-codegen";

import { MessageEnum } from "../../enums";
import { PermissionDecorationType } from "../../types/requestTypes";
import {
  GetEntityChildren,
  GetParents,
  GetRelatedEntityPermissionsAndRoles,
  TagQuery,
} from "../../utils/relationalQueryHelpers";
import { db } from "../db";
import { EntitiesWithChildren } from "../types";
import { ReadDocumentSchema } from "../validation";
import { checkEntityLevelPermission, getNestedReadPermission } from "./ownershipCheck";

type bodyTp = (typeof ReadDocumentSchema)["static"];

export async function readDocument(
  body: bodyTp,
  params: { id: string },
  permissions: PermissionDecorationType,
  isPublic: boolean,
) {
  let query = db
    .selectFrom("documents")
    .where("documents.id", "=", params.id)
    .select(body.fields.map((f) => `documents.${f}`) as SelectExpression<DB, "documents">[]);
  if (body?.relations) {
    if (body?.relations?.tags && permissions.all_permissions?.read_tags) {
      query = query.select((eb) =>
        TagQuery(eb, "_documentsTotags", "documents", permissions.is_project_owner, permissions.user_id),
      );
    }
    if (body?.relations?.alter_names) {
      query = query.select((eb) => {
        return jsonArrayFrom(
          eb.selectFrom("alter_names").select(["alter_names.id", "alter_names.title"]).where("parent_id", "=", params.id),
        ).as("alter_names");
      });
    }
    if (body?.relations?.image) {
      query = query.select((eb) => {
        let image_query = eb
          .selectFrom("images")
          .select(["images.id", "images.title"])
          .whereRef("images.id", "=", "documents.image_id");
        image_query = getNestedReadPermission(
          image_query,
          permissions.is_project_owner,
          permissions.user_id,
          "documents.image_id",
          "read_assets",
        );

        return jsonObjectFrom(image_query).as("image");
      });
    }
    if (body?.relations?.template_fields) {
      query = query.select((eb) => {
        let template_fields_query = eb
          .selectFrom("document_template_fields")
          .selectAll()
          .select((eb) =>
            jsonArrayFrom(
              eb
                .selectFrom("document_template_fields_characters")
                .select(["related_id"])
                .whereRef("document_template_fields_characters.field_id", "=", "document_template_fields.id")
                .union(
                  eb
                    .selectFrom("document_template_fields_blueprint_instances")
                    .select("related_id")
                    .whereRef("document_template_fields_blueprint_instances.field_id", "=", "document_template_fields.id"),
                )
                .union(
                  eb
                    .selectFrom("document_template_fields_documents")
                    .select(["related_id"])
                    .whereRef("document_template_fields_documents.field_id", "=", "document_template_fields.id"),
                )
                .union(
                  eb
                    .selectFrom("document_template_fields_maps")
                    .select("related_id")
                    .whereRef("document_template_fields_maps.field_id", "=", "document_template_fields.id"),
                )
                .union(
                  eb
                    .selectFrom("document_template_fields_map_pins")
                    .select("related_id")
                    .whereRef("document_template_fields_map_pins.field_id", "=", "document_template_fields.id"),
                )
                .union(
                  eb
                    .selectFrom("document_template_fields_graphs")
                    .select("related_id")
                    .whereRef("document_template_fields_graphs.field_id", "=", "document_template_fields.id"),
                )
                .union(
                  eb
                    .selectFrom("document_template_fields_events")
                    .select("related_id")
                    .whereRef("document_template_fields_events.field_id", "=", "document_template_fields.id"),
                )
                .union(
                  eb
                    .selectFrom("document_template_fields_words")
                    .select("related_id")
                    .whereRef("document_template_fields_words.field_id", "=", "document_template_fields.id"),
                )
                .union(
                  eb
                    .selectFrom("document_template_fields_random_tables")
                    .select("related_id")
                    .whereRef("document_template_fields_random_tables.field_id", "=", "document_template_fields.id"),
                ),
            ).as("related"),
          )
          .orderBy("sort asc")
          .where("document_template_fields.parent_id", "=", params.id);

        return jsonArrayFrom(template_fields_query).as("template_fields");
      });
    }
  }

  if (body?.relations?.children) {
    GetEntityChildren(query as SelectQueryBuilder<DB, EntitiesWithChildren, {}>, "documents");
  }

  if (permissions.is_project_owner) {
    query = query.leftJoin("entity_permissions", (join) => join.on("entity_permissions.related_id", "=", params.id));
  } else {
    query = checkEntityLevelPermission(query, permissions, "documents", params.id);
  }
  if (body.permissions) {
    query = GetRelatedEntityPermissionsAndRoles(query, permissions, "documents", params.id);
  }

  if (isPublic) {
    query = query.where("documents.is_public", "=", isPublic);
  }

  const data = await query.executeTakeFirst();

  if (data?.template_fields) {
    data.template_fields = data.template_fields.map(
      (field: DocumentTemplateFields & { related: { related_id: string }[] }) => ({
        ...field,
        related: field.related.map((r) => r.related_id),
      }),
    );
  }

  if (body?.relations?.parents && !!data) {
    const parents = await GetParents({ db, id: params.id, table_name: "documents" });
    data.parents = parents;

    return { data, message: MessageEnum.success, ok: true, role_access: true };
  }
  return { data, message: MessageEnum.success, ok: true, role_access: true };
}
