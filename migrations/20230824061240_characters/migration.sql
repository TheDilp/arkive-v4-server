-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "auth_id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL DEFAULT 'New Project',
    "image_id" TEXT,
    "owner_id" TEXT NOT NULL,
    "default_dice_color" TEXT,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'image',
    "project_id" TEXT,
    "project_image_id" TEXT,
    "character_id" TEXT,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "characters" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_id" TEXT NOT NULL,
    "is_favorite" BOOLEAN,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "nickname" TEXT,
    "age" INTEGER,
    "portrait_id" TEXT,
    "map_id" TEXT,

    CONSTRAINT "characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character_fields" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "field_type" TEXT NOT NULL,
    "options" TEXT[],
    "formula" TEXT,
    "random_table_id" TEXT,
    "parent_id" TEXT NOT NULL,

    CONSTRAINT "character_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character_fields_templates" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "character_fields_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "characters_to_character_fields" (
    "character_id" TEXT NOT NULL,
    "character_field_id" TEXT NOT NULL,
    "value" JSONB,

    CONSTRAINT "characters_to_character_fields_pkey" PRIMARY KEY ("character_id","character_field_id")
);

-- CreateTable
CREATE TABLE "character_relationship_types" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "character_relationship_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "characters_relationships" (
    "character_a_id" TEXT NOT NULL,
    "character_b_id" TEXT NOT NULL,
    "relation_type" TEXT NOT NULL,

    CONSTRAINT "characters_relationships_pkey" PRIMARY KEY ("character_a_id","character_b_id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL DEFAULT 'New Document',
    "content" JSONB,
    "icon" TEXT,
    "is_folder" BOOLEAN,
    "is_public" BOOLEAN,
    "is_template" BOOLEAN,
    "properties" JSONB,
    "dice_color" TEXT,
    "project_id" TEXT NOT NULL,
    "parent_id" TEXT,
    "image_id" TEXT,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alter_names" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL DEFAULT 'New Document',
    "project_id" TEXT NOT NULL,
    "parent_id" TEXT NOT NULL,

    CONSTRAINT "alter_names_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maps" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL DEFAULT 'New Map',
    "is_folder" BOOLEAN,
    "is_public" BOOLEAN,
    "cluster_pins" BOOLEAN,
    "icon" TEXT,
    "project_id" TEXT NOT NULL,
    "parent_id" TEXT,
    "image_id" TEXT,

    CONSTRAINT "maps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "map_pins" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT,
    "parent_id" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "color" TEXT,
    "border_color" TEXT,
    "background_color" TEXT,
    "icon" TEXT,
    "show_background" BOOLEAN NOT NULL DEFAULT true,
    "show_border" BOOLEAN NOT NULL DEFAULT true,
    "is_public" BOOLEAN,
    "map_link" TEXT,
    "doc_id" TEXT,
    "image_id" TEXT,

    CONSTRAINT "map_pins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "map_layers" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL DEFAULT 'New Layer',
    "parent_id" TEXT NOT NULL,
    "is_public" BOOLEAN,
    "image_id" TEXT NOT NULL,

    CONSTRAINT "map_layers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boards" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL DEFAULT 'New Board',
    "is_folder" BOOLEAN,
    "is_public" BOOLEAN,
    "icon" TEXT,
    "default_node_shape" TEXT NOT NULL DEFAULT 'rectangle',
    "default_node_color" TEXT NOT NULL DEFAULT '#595959',
    "default_edge_color" TEXT NOT NULL DEFAULT '#595959',
    "project_id" TEXT NOT NULL,
    "parent_id" TEXT,

    CONSTRAINT "boards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nodes" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "label" TEXT,
    "type" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "x" DOUBLE PRECISION,
    "y" DOUBLE PRECISION,
    "font_size" INTEGER,
    "font_color" TEXT,
    "font_family" TEXT,
    "text_v_align" TEXT,
    "text_h_align" TEXT,
    "background_color" TEXT,
    "background_opacity" DOUBLE PRECISION,
    "is_locked" BOOLEAN,
    "is_template" BOOLEAN,
    "z_index" INTEGER,
    "parent_id" TEXT NOT NULL,
    "image_id" TEXT,
    "doc_id" TEXT,
    "character_id" TEXT,
    "event_id" TEXT,
    "map_id" TEXT,
    "map_pin_id" TEXT,

    CONSTRAINT "nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "edges" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "label" TEXT,
    "curve_style" TEXT,
    "line_style" TEXT,
    "line_color" TEXT,
    "line_fill" TEXT,
    "line_opacity" DOUBLE PRECISION,
    "width" INTEGER,
    "control_point_distances" INTEGER,
    "control_point_weights" DOUBLE PRECISION,
    "taxi_direction" TEXT,
    "taxi_turn" INTEGER,
    "arrow_scale" INTEGER,
    "target_arrow_shape" TEXT,
    "target_arrow_fill" TEXT,
    "target_arrow_color" TEXT,
    "source_arrow_shape" TEXT,
    "source_arrow_fill" TEXT,
    "source_arrow_color" TEXT,
    "mid_target_arrow_shape" TEXT,
    "mid_target_arrlow_fill" TEXT,
    "mid_target_arrlow_color" TEXT,
    "mid_source_arrow_shape" TEXT,
    "mid_source_arrow_fill" TEXT,
    "mid_source_arrow_color" TEXT,
    "font_size" INTEGER,
    "font_color" TEXT,
    "font_family" TEXT,
    "z_index" INTEGER,
    "source_id" TEXT NOT NULL,
    "target_id" TEXT NOT NULL,
    "parent_id" TEXT NOT NULL,

    CONSTRAINT "edges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "screens" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL DEFAULT 'New Screen',
    "project_id" TEXT NOT NULL,
    "parent_id" TEXT,
    "icon" TEXT NOT NULL,
    "is_folder" BOOLEAN NOT NULL DEFAULT false,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "section_size" TEXT NOT NULL DEFAULT 'md',

    CONSTRAINT "screens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sections" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "card_size" TEXT NOT NULL DEFAULT 'md',
    "parent_id" TEXT,

    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cards" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "sort" INTEGER NOT NULL DEFAULT 0,
    "document_id" TEXT NOT NULL,
    "parent_id" TEXT,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dictionaries" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "icon" TEXT,
    "is_folder" BOOLEAN NOT NULL DEFAULT false,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "parent_id" TEXT,

    CONSTRAINT "dictionaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "words" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "translation" TEXT NOT NULL,
    "parent_id" TEXT NOT NULL,

    CONSTRAINT "words_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendars" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "parent_id" TEXT,
    "icon" TEXT,
    "is_folder" BOOLEAN,
    "is_public" BOOLEAN,
    "offset" INTEGER NOT NULL DEFAULT 0,
    "hours" INTEGER,
    "minutes" INTEGER,
    "days" TEXT[],

    CONSTRAINT "calendars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "months" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "days" INTEGER NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "parent_id" TEXT NOT NULL,

    CONSTRAINT "months_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "background_color" TEXT,
    "text_color" TEXT,
    "year" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "hours" INTEGER,
    "minutes" INTEGER,
    "calendar_id" TEXT,
    "document_id" TEXT,
    "month_id" TEXT NOT NULL,
    "image_id" TEXT,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timelines" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "parent_id" TEXT,
    "icon" TEXT,
    "is_folder" BOOLEAN,
    "is_public" BOOLEAN,

    CONSTRAINT "timelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "random_tables" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "project_id" TEXT NOT NULL,
    "parent_id" TEXT,
    "icon" TEXT,
    "is_folder" BOOLEAN,
    "is_public" BOOLEAN,

    CONSTRAINT "random_tables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "random_table_options" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "parent_id" TEXT NOT NULL,
    "icon" TEXT,
    "icon_color" TEXT,

    CONSTRAINT "random_table_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "random_table_suboptions" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "parent_id" TEXT NOT NULL,

    CONSTRAINT "random_table_suboptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhooks" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "webhooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_characters_to_images" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_charactersTodocuments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_charactersTotags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_documentsTotags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_mapsTotags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_map_pinsTotags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_boardsTotags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_nodesTotags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_edgesTotags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_screensTotags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_cardsTotags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_dictionariesTotags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_calendarsTotags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_calendarsTotimelines" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_eventsTotags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_auth_id_key" ON "users"("auth_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "images_project_image_id_key" ON "images"("project_image_id");

-- CreateIndex
CREATE UNIQUE INDEX "alter_names_title_parent_id_key" ON "alter_names"("title", "parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "edges_source_id_target_id_key" ON "edges"("source_id", "target_id");

-- CreateIndex
CREATE UNIQUE INDEX "cards_parent_id_document_id_key" ON "cards"("parent_id", "document_id");

-- CreateIndex
CREATE UNIQUE INDEX "dictionaries_project_id_title_key" ON "dictionaries"("project_id", "title");

-- CreateIndex
CREATE UNIQUE INDEX "words_title_translation_parent_id_key" ON "words"("title", "translation", "parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_title_project_id_key" ON "tags"("title", "project_id");

-- CreateIndex
CREATE UNIQUE INDEX "webhooks_id_user_id_key" ON "webhooks"("id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "_characters_to_images_AB_unique" ON "_characters_to_images"("A", "B");

-- CreateIndex
CREATE INDEX "_characters_to_images_B_index" ON "_characters_to_images"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_charactersTodocuments_AB_unique" ON "_charactersTodocuments"("A", "B");

-- CreateIndex
CREATE INDEX "_charactersTodocuments_B_index" ON "_charactersTodocuments"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_charactersTotags_AB_unique" ON "_charactersTotags"("A", "B");

-- CreateIndex
CREATE INDEX "_charactersTotags_B_index" ON "_charactersTotags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_documentsTotags_AB_unique" ON "_documentsTotags"("A", "B");

-- CreateIndex
CREATE INDEX "_documentsTotags_B_index" ON "_documentsTotags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_mapsTotags_AB_unique" ON "_mapsTotags"("A", "B");

-- CreateIndex
CREATE INDEX "_mapsTotags_B_index" ON "_mapsTotags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_map_pinsTotags_AB_unique" ON "_map_pinsTotags"("A", "B");

-- CreateIndex
CREATE INDEX "_map_pinsTotags_B_index" ON "_map_pinsTotags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_boardsTotags_AB_unique" ON "_boardsTotags"("A", "B");

-- CreateIndex
CREATE INDEX "_boardsTotags_B_index" ON "_boardsTotags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_nodesTotags_AB_unique" ON "_nodesTotags"("A", "B");

-- CreateIndex
CREATE INDEX "_nodesTotags_B_index" ON "_nodesTotags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_edgesTotags_AB_unique" ON "_edgesTotags"("A", "B");

-- CreateIndex
CREATE INDEX "_edgesTotags_B_index" ON "_edgesTotags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_screensTotags_AB_unique" ON "_screensTotags"("A", "B");

-- CreateIndex
CREATE INDEX "_screensTotags_B_index" ON "_screensTotags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_cardsTotags_AB_unique" ON "_cardsTotags"("A", "B");

-- CreateIndex
CREATE INDEX "_cardsTotags_B_index" ON "_cardsTotags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_dictionariesTotags_AB_unique" ON "_dictionariesTotags"("A", "B");

-- CreateIndex
CREATE INDEX "_dictionariesTotags_B_index" ON "_dictionariesTotags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_calendarsTotags_AB_unique" ON "_calendarsTotags"("A", "B");

-- CreateIndex
CREATE INDEX "_calendarsTotags_B_index" ON "_calendarsTotags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_calendarsTotimelines_AB_unique" ON "_calendarsTotimelines"("A", "B");

-- CreateIndex
CREATE INDEX "_calendarsTotimelines_B_index" ON "_calendarsTotimelines"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_eventsTotags_AB_unique" ON "_eventsTotags"("A", "B");

-- CreateIndex
CREATE INDEX "_eventsTotags_B_index" ON "_eventsTotags"("B");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_project_image_id_fkey" FOREIGN KEY ("project_image_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_portrait_id_fkey" FOREIGN KEY ("portrait_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "maps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_fields" ADD CONSTRAINT "character_fields_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_fields" ADD CONSTRAINT "character_fields_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "character_fields_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_fields_templates" ADD CONSTRAINT "character_fields_templates_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characters_to_character_fields" ADD CONSTRAINT "characters_to_character_fields_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characters_to_character_fields" ADD CONSTRAINT "characters_to_character_fields_character_field_id_fkey" FOREIGN KEY ("character_field_id") REFERENCES "character_fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_relationship_types" ADD CONSTRAINT "character_relationship_types_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characters_relationships" ADD CONSTRAINT "characters_relationships_character_a_id_fkey" FOREIGN KEY ("character_a_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characters_relationships" ADD CONSTRAINT "characters_relationships_character_b_id_fkey" FOREIGN KEY ("character_b_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alter_names" ADD CONSTRAINT "alter_names_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alter_names" ADD CONSTRAINT "alter_names_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maps" ADD CONSTRAINT "maps_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maps" ADD CONSTRAINT "maps_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maps" ADD CONSTRAINT "maps_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "maps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "map_pins" ADD CONSTRAINT "map_pins_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "maps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "map_pins" ADD CONSTRAINT "map_pins_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "map_layers" ADD CONSTRAINT "map_layers_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "map_layers" ADD CONSTRAINT "map_layers_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "maps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boards" ADD CONSTRAINT "boards_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boards" ADD CONSTRAINT "boards_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "maps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_map_pin_id_fkey" FOREIGN KEY ("map_pin_id") REFERENCES "map_pins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edges" ADD CONSTRAINT "edges_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edges" ADD CONSTRAINT "edges_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edges" ADD CONSTRAINT "edges_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "screens" ADD CONSTRAINT "screens_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "screens" ADD CONSTRAINT "screens_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "screens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "screens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dictionaries" ADD CONSTRAINT "dictionaries_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dictionaries" ADD CONSTRAINT "dictionaries_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "dictionaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "words" ADD CONSTRAINT "words_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "dictionaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendars" ADD CONSTRAINT "calendars_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendars" ADD CONSTRAINT "calendars_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "calendars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "months" ADD CONSTRAINT "months_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "calendars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_calendar_id_fkey" FOREIGN KEY ("calendar_id") REFERENCES "calendars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_month_id_fkey" FOREIGN KEY ("month_id") REFERENCES "months"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timelines" ADD CONSTRAINT "timelines_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timelines" ADD CONSTRAINT "timelines_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "timelines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "random_tables" ADD CONSTRAINT "random_tables_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "random_tables" ADD CONSTRAINT "random_tables_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "random_tables"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "random_table_options" ADD CONSTRAINT "random_table_options_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "random_tables"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "random_table_suboptions" ADD CONSTRAINT "random_table_suboptions_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "random_table_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhooks" ADD CONSTRAINT "webhooks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_characters_to_images" ADD CONSTRAINT "_characters_to_images_A_fkey" FOREIGN KEY ("A") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_characters_to_images" ADD CONSTRAINT "_characters_to_images_B_fkey" FOREIGN KEY ("B") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_charactersTodocuments" ADD CONSTRAINT "_charactersTodocuments_A_fkey" FOREIGN KEY ("A") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_charactersTodocuments" ADD CONSTRAINT "_charactersTodocuments_B_fkey" FOREIGN KEY ("B") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_charactersTotags" ADD CONSTRAINT "_charactersTotags_A_fkey" FOREIGN KEY ("A") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_charactersTotags" ADD CONSTRAINT "_charactersTotags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_documentsTotags" ADD CONSTRAINT "_documentsTotags_A_fkey" FOREIGN KEY ("A") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_documentsTotags" ADD CONSTRAINT "_documentsTotags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_mapsTotags" ADD CONSTRAINT "_mapsTotags_A_fkey" FOREIGN KEY ("A") REFERENCES "maps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_mapsTotags" ADD CONSTRAINT "_mapsTotags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_map_pinsTotags" ADD CONSTRAINT "_map_pinsTotags_A_fkey" FOREIGN KEY ("A") REFERENCES "map_pins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_map_pinsTotags" ADD CONSTRAINT "_map_pinsTotags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_boardsTotags" ADD CONSTRAINT "_boardsTotags_A_fkey" FOREIGN KEY ("A") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_boardsTotags" ADD CONSTRAINT "_boardsTotags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_nodesTotags" ADD CONSTRAINT "_nodesTotags_A_fkey" FOREIGN KEY ("A") REFERENCES "nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_nodesTotags" ADD CONSTRAINT "_nodesTotags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_edgesTotags" ADD CONSTRAINT "_edgesTotags_A_fkey" FOREIGN KEY ("A") REFERENCES "edges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_edgesTotags" ADD CONSTRAINT "_edgesTotags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_screensTotags" ADD CONSTRAINT "_screensTotags_A_fkey" FOREIGN KEY ("A") REFERENCES "screens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_screensTotags" ADD CONSTRAINT "_screensTotags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_cardsTotags" ADD CONSTRAINT "_cardsTotags_A_fkey" FOREIGN KEY ("A") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_cardsTotags" ADD CONSTRAINT "_cardsTotags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_dictionariesTotags" ADD CONSTRAINT "_dictionariesTotags_A_fkey" FOREIGN KEY ("A") REFERENCES "dictionaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_dictionariesTotags" ADD CONSTRAINT "_dictionariesTotags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_calendarsTotags" ADD CONSTRAINT "_calendarsTotags_A_fkey" FOREIGN KEY ("A") REFERENCES "calendars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_calendarsTotags" ADD CONSTRAINT "_calendarsTotags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_calendarsTotimelines" ADD CONSTRAINT "_calendarsTotimelines_A_fkey" FOREIGN KEY ("A") REFERENCES "calendars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_calendarsTotimelines" ADD CONSTRAINT "_calendarsTotimelines_B_fkey" FOREIGN KEY ("B") REFERENCES "timelines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_eventsTotags" ADD CONSTRAINT "_eventsTotags_A_fkey" FOREIGN KEY ("A") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_eventsTotags" ADD CONSTRAINT "_eventsTotags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
