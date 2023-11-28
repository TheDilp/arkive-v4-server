SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: timescaledb; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS timescaledb WITH SCHEMA public;


--
-- Name: EXTENSION timescaledb; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION timescaledb IS 'Enables scalable inserts and complex queries for time-series data (Community Edition)';


--
-- Name: timescaledb_toolkit; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS timescaledb_toolkit WITH SCHEMA public;


--
-- Name: EXTENSION timescaledb_toolkit; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION timescaledb_toolkit IS 'Library of analytical hyperfunctions, time-series pipelining, and other SQL utilities';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: BlueprintFieldType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."BlueprintFieldType" AS ENUM (
    'text',
    'select',
    'select_multiple',
    'dice_roll',
    'date',
    'random_table',
    'documents_single',
    'documents_multiple',
    'images_single',
    'images_multiple',
    'locations_single',
    'locations_multiple',
    'characters_single',
    'characters_multiple',
    'number',
    'textarea',
    'blueprints_single',
    'blueprints_multiple',
    'boolean'
);


--
-- Name: ConversationMessageType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ConversationMessageType" AS ENUM (
    'character',
    'narration',
    'place'
);


--
-- Name: FieldType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."FieldType" AS ENUM (
    'text',
    'select',
    'select_multiple',
    'dice_roll',
    'date',
    'random_table',
    'documents_single',
    'documents_multiple',
    'images_single',
    'images_multiple',
    'locations_single',
    'locations_multiple',
    'number',
    'textarea',
    'blueprints_single',
    'blueprints_multiple',
    'boolean'
);


--
-- Name: FieldWidth; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."FieldWidth" AS ENUM (
    'half',
    'full'
);


--
-- Name: ImageType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ImageType" AS ENUM (
    'images',
    'map_images'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _blueprint_instancesTotags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."_blueprint_instancesTotags" (
    "A" uuid NOT NULL,
    "B" uuid NOT NULL
);


--
-- Name: _calendarsTotags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."_calendarsTotags" (
    "A" uuid NOT NULL,
    "B" uuid NOT NULL
);


--
-- Name: _calendarsTotimelines; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."_calendarsTotimelines" (
    "A" uuid NOT NULL,
    "B" uuid NOT NULL
);


--
-- Name: _character_fields_templatesTotags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."_character_fields_templatesTotags" (
    "A" uuid NOT NULL,
    "B" uuid NOT NULL
);


--
-- Name: _charactersToconversations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."_charactersToconversations" (
    "A" uuid NOT NULL,
    "B" uuid NOT NULL
);


--
-- Name: _charactersTodocuments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."_charactersTodocuments" (
    "A" uuid NOT NULL,
    "B" uuid NOT NULL
);


--
-- Name: _charactersToimages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."_charactersToimages" (
    "A" uuid NOT NULL,
    "B" uuid NOT NULL
);


--
-- Name: _charactersTotags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."_charactersTotags" (
    "A" uuid NOT NULL,
    "B" uuid NOT NULL
);


--
-- Name: _dictionariesTotags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."_dictionariesTotags" (
    "A" uuid NOT NULL,
    "B" uuid NOT NULL
);


--
-- Name: _documentsTotags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."_documentsTotags" (
    "A" uuid NOT NULL,
    "B" uuid NOT NULL
);


--
-- Name: _edgesTotags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."_edgesTotags" (
    "A" uuid NOT NULL,
    "B" uuid NOT NULL
);


--
-- Name: _eventsTotags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."_eventsTotags" (
    "A" uuid NOT NULL,
    "B" uuid NOT NULL
);


--
-- Name: _graphsTotags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."_graphsTotags" (
    "A" uuid NOT NULL,
    "B" uuid NOT NULL
);


--
-- Name: _map_pinsTotags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."_map_pinsTotags" (
    "A" uuid NOT NULL,
    "B" uuid NOT NULL
);


--
-- Name: _mapsTotags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."_mapsTotags" (
    "A" uuid NOT NULL,
    "B" uuid NOT NULL
);


--
-- Name: _nodesTotags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."_nodesTotags" (
    "A" uuid NOT NULL,
    "B" uuid NOT NULL
);


--
-- Name: _project_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._project_members (
    "A" uuid NOT NULL,
    "B" uuid NOT NULL
);


--
-- Name: alter_names; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alter_names (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text DEFAULT 'New Document'::text NOT NULL,
    project_id uuid NOT NULL,
    parent_id uuid NOT NULL
);


--
-- Name: blueprint_fields; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blueprint_fields (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    sort integer DEFAULT 0 NOT NULL,
    options jsonb,
    formula text,
    parent_id uuid,
    field_type public."BlueprintFieldType" NOT NULL,
    random_table_id uuid,
    calendar_id uuid,
    blueprint_id uuid
);


--
-- Name: blueprint_instance_blueprint_instances; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blueprint_instance_blueprint_instances (
    blueprint_instance_id uuid NOT NULL,
    blueprint_field_id uuid NOT NULL,
    related_id uuid NOT NULL
);


--
-- Name: blueprint_instance_calendars; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blueprint_instance_calendars (
    blueprint_instance_id uuid NOT NULL,
    blueprint_field_id uuid NOT NULL,
    related_id uuid NOT NULL,
    end_month_id uuid,
    start_month_id uuid,
    end_day integer,
    end_year integer,
    start_day integer,
    start_year integer
);


--
-- Name: blueprint_instance_characters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blueprint_instance_characters (
    blueprint_instance_id uuid NOT NULL,
    blueprint_field_id uuid NOT NULL,
    related_id uuid NOT NULL
);


--
-- Name: blueprint_instance_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blueprint_instance_documents (
    blueprint_instance_id uuid NOT NULL,
    blueprint_field_id uuid NOT NULL,
    related_id uuid NOT NULL
);


--
-- Name: blueprint_instance_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blueprint_instance_images (
    blueprint_instance_id uuid NOT NULL,
    blueprint_field_id uuid NOT NULL,
    related_id uuid NOT NULL
);


--
-- Name: blueprint_instance_map_pins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blueprint_instance_map_pins (
    blueprint_instance_id uuid NOT NULL,
    blueprint_field_id uuid NOT NULL,
    related_id uuid NOT NULL
);


--
-- Name: blueprint_instance_random_tables; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blueprint_instance_random_tables (
    blueprint_instance_id uuid NOT NULL,
    blueprint_field_id uuid NOT NULL,
    related_id uuid NOT NULL,
    option_id uuid,
    suboption_id uuid
);


--
-- Name: blueprint_instance_value; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blueprint_instance_value (
    blueprint_instance_id uuid NOT NULL,
    blueprint_field_id uuid NOT NULL,
    value jsonb
);


--
-- Name: blueprint_instances; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blueprint_instances (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    parent_id uuid NOT NULL,
    title text NOT NULL,
    ts tsvector GENERATED ALWAYS AS (to_tsvector('english'::regconfig, title)) STORED,
    is_public boolean
);


--
-- Name: blueprints; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blueprints (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    title text NOT NULL,
    project_id uuid NOT NULL,
    title_name text NOT NULL,
    icon text
);


--
-- Name: calendars; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.calendars (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    title text NOT NULL,
    project_id uuid NOT NULL,
    parent_id uuid,
    icon text,
    is_folder boolean,
    is_public boolean,
    "offset" integer DEFAULT 0 NOT NULL,
    hours integer,
    minutes integer,
    days text[]
);


--
-- Name: character_blueprint_instance_fields; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.character_blueprint_instance_fields (
    character_id uuid NOT NULL,
    character_field_id uuid NOT NULL,
    related_id uuid NOT NULL
);


--
-- Name: character_calendar_fields; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.character_calendar_fields (
    character_id uuid NOT NULL,
    character_field_id uuid NOT NULL,
    related_id uuid NOT NULL,
    end_month_id uuid,
    start_month_id uuid,
    end_day integer,
    end_year integer,
    start_day integer,
    start_year integer
);


--
-- Name: character_documents_fields; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.character_documents_fields (
    character_id uuid NOT NULL,
    character_field_id uuid NOT NULL,
    related_id uuid NOT NULL
);


--
-- Name: character_fields; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.character_fields (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    sort integer DEFAULT 0 NOT NULL,
    field_type text NOT NULL,
    formula text,
    random_table_id uuid,
    parent_id uuid,
    options jsonb,
    calendar_id uuid,
    blueprint_id uuid
);


--
-- Name: character_fields_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.character_fields_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    project_id uuid NOT NULL,
    sort integer DEFAULT 0 NOT NULL
);


--
-- Name: character_images_fields; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.character_images_fields (
    character_id uuid NOT NULL,
    character_field_id uuid NOT NULL,
    related_id uuid NOT NULL
);


--
-- Name: character_locations_fields; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.character_locations_fields (
    character_id uuid NOT NULL,
    character_field_id uuid NOT NULL,
    related_id uuid NOT NULL
);


--
-- Name: character_random_table_fields; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.character_random_table_fields (
    character_id uuid NOT NULL,
    character_field_id uuid NOT NULL,
    related_id uuid NOT NULL,
    option_id uuid,
    suboption_id uuid
);


--
-- Name: character_relationship_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.character_relationship_types (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    project_id uuid NOT NULL,
    ascendant_title text,
    descendant_title text
);


--
-- Name: character_value_fields; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.character_value_fields (
    character_id uuid NOT NULL,
    character_field_id uuid NOT NULL,
    value jsonb
);


--
-- Name: characters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.characters (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    project_id uuid NOT NULL,
    is_favorite boolean,
    first_name text NOT NULL,
    last_name text,
    nickname text,
    age integer,
    portrait_id uuid,
    ts tsvector GENERATED ALWAYS AS (to_tsvector('english'::regconfig, ((COALESCE(first_name, ''::text) || ' '::text) || COALESCE(last_name, ''::text)))) STORED,
    full_name text GENERATED ALWAYS AS (((COALESCE(first_name, ''::text) || ' '::text) || COALESCE(last_name, ''::text))) STORED,
    is_public boolean
);


--
-- Name: characters_relationships; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.characters_relationships (
    character_a_id uuid NOT NULL,
    character_b_id uuid NOT NULL,
    relation_type_id uuid NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: conversations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    project_id uuid NOT NULL
);


--
-- Name: dictionaries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dictionaries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    title text NOT NULL,
    project_id uuid NOT NULL,
    icon text,
    is_folder boolean,
    is_public boolean,
    parent_id uuid
);


--
-- Name: document_mentions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.document_mentions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    parent_document_id uuid NOT NULL,
    mention_id uuid NOT NULL
);


--
-- Name: documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    title text DEFAULT 'New Document'::text NOT NULL,
    content jsonb,
    icon text,
    is_folder boolean,
    is_public boolean,
    is_template boolean,
    properties jsonb,
    dice_color text,
    project_id uuid NOT NULL,
    parent_id uuid,
    image_id uuid,
    ts tsvector GENERATED ALWAYS AS (to_tsvector('english'::regconfig, title)) STORED
);


--
-- Name: edges; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.edges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    label text,
    curve_style text,
    line_style text,
    line_color text,
    line_fill text,
    line_opacity double precision,
    width integer,
    control_point_distances integer,
    control_point_weights double precision,
    taxi_direction text,
    taxi_turn integer,
    arrow_scale integer,
    target_arrow_shape text,
    target_arrow_fill text,
    target_arrow_color text,
    source_arrow_shape text,
    source_arrow_fill text,
    source_arrow_color text,
    mid_target_arrow_shape text,
    mid_target_arrlow_fill text,
    mid_target_arrlow_color text,
    mid_source_arrow_shape text,
    mid_source_arrow_fill text,
    mid_source_arrow_color text,
    font_size integer,
    font_color text,
    font_family text,
    z_index integer,
    source_id uuid NOT NULL,
    target_id uuid NOT NULL,
    parent_id uuid NOT NULL
);


--
-- Name: events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    is_public boolean,
    background_color text,
    text_color text,
    hours integer,
    minutes integer,
    document_id uuid,
    image_id uuid,
    parent_id uuid NOT NULL,
    end_day integer,
    end_month integer,
    end_year integer,
    start_day integer NOT NULL,
    start_month integer NOT NULL,
    start_year integer NOT NULL
);


--
-- Name: graphs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.graphs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    title text DEFAULT 'New graph'::text NOT NULL,
    is_folder boolean,
    is_public boolean,
    icon text,
    default_node_shape text DEFAULT 'rectangle'::text NOT NULL,
    default_node_color text DEFAULT '#595959'::text NOT NULL,
    default_edge_color text DEFAULT '#595959'::text NOT NULL,
    project_id uuid NOT NULL,
    parent_id uuid,
    ts tsvector GENERATED ALWAYS AS (to_tsvector('english'::regconfig, title)) STORED
);


--
-- Name: images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    project_id uuid,
    project_image_id uuid,
    character_id uuid,
    type public."ImageType" DEFAULT 'images'::public."ImageType" NOT NULL
);


--
-- Name: map_layers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.map_layers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text DEFAULT 'New Layer'::text NOT NULL,
    parent_id uuid NOT NULL,
    is_public boolean,
    image_id uuid NOT NULL
);


--
-- Name: map_pins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.map_pins (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text,
    parent_id uuid NOT NULL,
    lat double precision NOT NULL,
    lng double precision NOT NULL,
    color text,
    border_color text,
    background_color text,
    icon text,
    show_background boolean DEFAULT true NOT NULL,
    show_border boolean DEFAULT true NOT NULL,
    is_public boolean,
    map_link text,
    doc_id uuid,
    image_id uuid,
    character_id uuid
);


--
-- Name: maps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.maps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    title text DEFAULT 'New Map'::text NOT NULL,
    is_folder boolean,
    is_public boolean,
    cluster_pins boolean,
    icon text,
    project_id uuid NOT NULL,
    parent_id uuid,
    image_id uuid,
    ts tsvector GENERATED ALWAYS AS (to_tsvector('english'::regconfig, title)) STORED
);


--
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    content jsonb NOT NULL,
    sender_id uuid,
    type public."ConversationMessageType" NOT NULL,
    parent_id uuid NOT NULL
);


--
-- Name: months; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.months (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    days integer NOT NULL,
    sort integer DEFAULT 0 NOT NULL,
    parent_id uuid NOT NULL
);


--
-- Name: nodes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nodes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    label text,
    type text,
    width integer,
    height integer,
    x double precision,
    y double precision,
    font_size integer,
    font_color text,
    font_family text,
    text_v_align text,
    text_h_align text,
    background_color text,
    background_opacity double precision,
    is_locked boolean,
    is_template boolean,
    z_index integer,
    parent_id uuid NOT NULL,
    image_id uuid,
    doc_id uuid,
    character_id uuid,
    event_id uuid,
    map_id uuid,
    map_pin_id uuid,
    icon text
);


--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    title text DEFAULT 'New Project'::text NOT NULL,
    image_id uuid,
    owner_id uuid NOT NULL,
    default_dice_color text
);


--
-- Name: random_table_options; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.random_table_options (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    parent_id uuid NOT NULL,
    icon text,
    icon_color text
);


--
-- Name: random_table_suboptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.random_table_suboptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    parent_id uuid NOT NULL
);


--
-- Name: random_tables; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.random_tables (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    title text NOT NULL,
    description text,
    project_id uuid NOT NULL,
    parent_id uuid,
    icon text,
    is_folder boolean,
    is_public boolean
);


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying(128) NOT NULL
);


--
-- Name: tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tags (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    color text NOT NULL,
    project_id uuid NOT NULL
);


--
-- Name: timelines; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.timelines (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    title text NOT NULL,
    project_id uuid NOT NULL,
    parent_id uuid,
    icon text,
    is_folder boolean,
    is_public boolean
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    auth_id text,
    nickname text NOT NULL,
    email text NOT NULL,
    image text
);


--
-- Name: webhooks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.webhooks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    url text NOT NULL,
    user_id uuid NOT NULL
);


--
-- Name: words; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.words (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    translation text NOT NULL,
    parent_id uuid NOT NULL,
    ts tsvector GENERATED ALWAYS AS (to_tsvector('english'::regconfig, title)) STORED
);


--
-- Name: alter_names alter_names_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alter_names
    ADD CONSTRAINT alter_names_pkey PRIMARY KEY (id);


--
-- Name: blueprint_fields blueprint_fields_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_fields
    ADD CONSTRAINT blueprint_fields_pkey PRIMARY KEY (id);


--
-- Name: blueprint_instance_blueprint_instances blueprint_instance_blueprint_instances_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_blueprint_instances
    ADD CONSTRAINT blueprint_instance_blueprint_instances_pkey PRIMARY KEY (blueprint_instance_id, blueprint_field_id, related_id);


--
-- Name: blueprint_instance_calendars blueprint_instance_calendars_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_calendars
    ADD CONSTRAINT blueprint_instance_calendars_pkey PRIMARY KEY (blueprint_instance_id, blueprint_field_id, related_id);


--
-- Name: blueprint_instance_characters blueprint_instance_characters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_characters
    ADD CONSTRAINT blueprint_instance_characters_pkey PRIMARY KEY (blueprint_instance_id, blueprint_field_id, related_id);


--
-- Name: blueprint_instance_documents blueprint_instance_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_documents
    ADD CONSTRAINT blueprint_instance_documents_pkey PRIMARY KEY (blueprint_instance_id, blueprint_field_id, related_id);


--
-- Name: blueprint_instance_images blueprint_instance_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_images
    ADD CONSTRAINT blueprint_instance_images_pkey PRIMARY KEY (blueprint_instance_id, blueprint_field_id, related_id);


--
-- Name: blueprint_instance_map_pins blueprint_instance_map_pins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_map_pins
    ADD CONSTRAINT blueprint_instance_map_pins_pkey PRIMARY KEY (blueprint_instance_id, blueprint_field_id, related_id);


--
-- Name: blueprint_instance_random_tables blueprint_instance_random_tables_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_random_tables
    ADD CONSTRAINT blueprint_instance_random_tables_pkey PRIMARY KEY (blueprint_instance_id, blueprint_field_id, related_id);


--
-- Name: blueprint_instance_value blueprint_instance_value_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_value
    ADD CONSTRAINT blueprint_instance_value_pkey PRIMARY KEY (blueprint_instance_id, blueprint_field_id);


--
-- Name: blueprint_instances blueprint_instances_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instances
    ADD CONSTRAINT blueprint_instances_pkey PRIMARY KEY (id);


--
-- Name: blueprints blueprints_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprints
    ADD CONSTRAINT blueprints_pkey PRIMARY KEY (id);


--
-- Name: calendars calendars_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendars
    ADD CONSTRAINT calendars_pkey PRIMARY KEY (id);


--
-- Name: character_blueprint_instance_fields character_blueprint_instance_fields_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_blueprint_instance_fields
    ADD CONSTRAINT character_blueprint_instance_fields_pkey PRIMARY KEY (character_id, character_field_id, related_id);


--
-- Name: character_calendar_fields character_calendar_fields_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_calendar_fields
    ADD CONSTRAINT character_calendar_fields_pkey PRIMARY KEY (character_id, character_field_id, related_id);


--
-- Name: character_documents_fields character_documents_fields_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_documents_fields
    ADD CONSTRAINT character_documents_fields_pkey PRIMARY KEY (character_id, character_field_id, related_id);


--
-- Name: character_fields character_fields_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_fields
    ADD CONSTRAINT character_fields_pkey PRIMARY KEY (id);


--
-- Name: character_fields_templates character_fields_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_fields_templates
    ADD CONSTRAINT character_fields_templates_pkey PRIMARY KEY (id);


--
-- Name: character_images_fields character_images_fields_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_images_fields
    ADD CONSTRAINT character_images_fields_pkey PRIMARY KEY (character_id, character_field_id, related_id);


--
-- Name: character_locations_fields character_locations_fields_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_locations_fields
    ADD CONSTRAINT character_locations_fields_pkey PRIMARY KEY (character_id, character_field_id, related_id);


--
-- Name: character_random_table_fields character_random_table_fields_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_random_table_fields
    ADD CONSTRAINT character_random_table_fields_pkey PRIMARY KEY (character_id, character_field_id, related_id);


--
-- Name: character_relationship_types character_relationship_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_relationship_types
    ADD CONSTRAINT character_relationship_types_pkey PRIMARY KEY (id);


--
-- Name: character_value_fields character_value_fields_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_value_fields
    ADD CONSTRAINT character_value_fields_pkey PRIMARY KEY (character_id, character_field_id);


--
-- Name: characters characters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.characters
    ADD CONSTRAINT characters_pkey PRIMARY KEY (id);


--
-- Name: characters_relationships characters_relationships_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.characters_relationships
    ADD CONSTRAINT characters_relationships_pkey PRIMARY KEY (id);


--
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- Name: dictionaries dictionaries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dictionaries
    ADD CONSTRAINT dictionaries_pkey PRIMARY KEY (id);


--
-- Name: document_mentions document_mentions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.document_mentions
    ADD CONSTRAINT document_mentions_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: edges edges_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.edges
    ADD CONSTRAINT edges_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: graphs graphs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.graphs
    ADD CONSTRAINT graphs_pkey PRIMARY KEY (id);


--
-- Name: images images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- Name: map_layers map_layers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_layers
    ADD CONSTRAINT map_layers_pkey PRIMARY KEY (id);


--
-- Name: map_pins map_pins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_pins
    ADD CONSTRAINT map_pins_pkey PRIMARY KEY (id);


--
-- Name: maps maps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maps
    ADD CONSTRAINT maps_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: months months_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.months
    ADD CONSTRAINT months_pkey PRIMARY KEY (id);


--
-- Name: nodes nodes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT nodes_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: random_table_options random_table_options_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.random_table_options
    ADD CONSTRAINT random_table_options_pkey PRIMARY KEY (id);


--
-- Name: random_table_suboptions random_table_suboptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.random_table_suboptions
    ADD CONSTRAINT random_table_suboptions_pkey PRIMARY KEY (id);


--
-- Name: random_tables random_tables_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.random_tables
    ADD CONSTRAINT random_tables_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: timelines timelines_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timelines
    ADD CONSTRAINT timelines_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: webhooks webhooks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webhooks
    ADD CONSTRAINT webhooks_pkey PRIMARY KEY (id);


--
-- Name: words words_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.words
    ADD CONSTRAINT words_pkey PRIMARY KEY (id);


--
-- Name: _blueprint_instancesTotags_AB_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "_blueprint_instancesTotags_AB_unique" ON public."_blueprint_instancesTotags" USING btree ("A", "B");


--
-- Name: _blueprint_instancesTotags_B_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "_blueprint_instancesTotags_B_index" ON public."_blueprint_instancesTotags" USING btree ("B");


--
-- Name: _calendarsTotags_AB_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "_calendarsTotags_AB_unique" ON public."_calendarsTotags" USING btree ("A", "B");


--
-- Name: _calendarsTotags_B_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "_calendarsTotags_B_index" ON public."_calendarsTotags" USING btree ("B");


--
-- Name: _calendarsTotimelines_AB_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "_calendarsTotimelines_AB_unique" ON public."_calendarsTotimelines" USING btree ("A", "B");


--
-- Name: _calendarsTotimelines_B_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "_calendarsTotimelines_B_index" ON public."_calendarsTotimelines" USING btree ("B");


--
-- Name: _character_fields_templatesTotags_AB_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "_character_fields_templatesTotags_AB_unique" ON public."_character_fields_templatesTotags" USING btree ("A", "B");


--
-- Name: _character_fields_templatesTotags_B_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "_character_fields_templatesTotags_B_index" ON public."_character_fields_templatesTotags" USING btree ("B");


--
-- Name: _charactersToconversations_AB_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "_charactersToconversations_AB_unique" ON public."_charactersToconversations" USING btree ("A", "B");


--
-- Name: _charactersToconversations_B_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "_charactersToconversations_B_index" ON public."_charactersToconversations" USING btree ("B");


--
-- Name: _charactersTodocuments_AB_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "_charactersTodocuments_AB_unique" ON public."_charactersTodocuments" USING btree ("A", "B");


--
-- Name: _charactersTodocuments_B_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "_charactersTodocuments_B_index" ON public."_charactersTodocuments" USING btree ("B");


--
-- Name: _charactersToimages_AB_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "_charactersToimages_AB_unique" ON public."_charactersToimages" USING btree ("A", "B");


--
-- Name: _charactersToimages_B_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "_charactersToimages_B_index" ON public."_charactersToimages" USING btree ("B");


--
-- Name: _charactersTotags_AB_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "_charactersTotags_AB_unique" ON public."_charactersTotags" USING btree ("A", "B");


--
-- Name: _charactersTotags_B_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "_charactersTotags_B_index" ON public."_charactersTotags" USING btree ("B");


--
-- Name: _dictionariesTotags_AB_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "_dictionariesTotags_AB_unique" ON public."_dictionariesTotags" USING btree ("A", "B");


--
-- Name: _dictionariesTotags_B_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "_dictionariesTotags_B_index" ON public."_dictionariesTotags" USING btree ("B");


--
-- Name: _documentsTotags_AB_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "_documentsTotags_AB_unique" ON public."_documentsTotags" USING btree ("A", "B");


--
-- Name: _documentsTotags_B_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "_documentsTotags_B_index" ON public."_documentsTotags" USING btree ("B");


--
-- Name: _edgesTotags_AB_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "_edgesTotags_AB_unique" ON public."_edgesTotags" USING btree ("A", "B");


--
-- Name: _edgesTotags_B_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "_edgesTotags_B_index" ON public."_edgesTotags" USING btree ("B");


--
-- Name: _eventsTotags_AB_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "_eventsTotags_AB_unique" ON public."_eventsTotags" USING btree ("A", "B");


--
-- Name: _eventsTotags_B_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "_eventsTotags_B_index" ON public."_eventsTotags" USING btree ("B");


--
-- Name: _graphsTotags_AB_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "_graphsTotags_AB_unique" ON public."_graphsTotags" USING btree ("A", "B");


--
-- Name: _graphsTotags_B_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "_graphsTotags_B_index" ON public."_graphsTotags" USING btree ("B");


--
-- Name: _map_pinsTotags_AB_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "_map_pinsTotags_AB_unique" ON public."_map_pinsTotags" USING btree ("A", "B");


--
-- Name: _map_pinsTotags_B_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "_map_pinsTotags_B_index" ON public."_map_pinsTotags" USING btree ("B");


--
-- Name: _mapsTotags_AB_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "_mapsTotags_AB_unique" ON public."_mapsTotags" USING btree ("A", "B");


--
-- Name: _mapsTotags_B_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "_mapsTotags_B_index" ON public."_mapsTotags" USING btree ("B");


--
-- Name: _nodesTotags_AB_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "_nodesTotags_AB_unique" ON public."_nodesTotags" USING btree ("A", "B");


--
-- Name: _nodesTotags_B_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "_nodesTotags_B_index" ON public."_nodesTotags" USING btree ("B");


--
-- Name: _project_members_AB_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "_project_members_AB_unique" ON public._project_members USING btree ("A", "B");


--
-- Name: _project_members_B_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "_project_members_B_index" ON public._project_members USING btree ("B");


--
-- Name: alter_names_title_parent_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX alter_names_title_parent_id_key ON public.alter_names USING btree (title, parent_id);


--
-- Name: blueprint_instance_calendars_blueprint_instance_id_blueprin_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX blueprint_instance_calendars_blueprint_instance_id_blueprin_key ON public.blueprint_instance_calendars USING btree (blueprint_instance_id, blueprint_field_id, related_id);


--
-- Name: blueprint_instance_random_tables_blueprint_instance_id_blue_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX blueprint_instance_random_tables_blueprint_instance_id_blue_key ON public.blueprint_instance_random_tables USING btree (blueprint_instance_id, blueprint_field_id, related_id);


--
-- Name: bpi_ts_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bpi_ts_index ON public.blueprint_instances USING gin (ts);


--
-- Name: character_calendar_fields_character_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX character_calendar_fields_character_id_key ON public.character_calendar_fields USING btree (character_id, character_field_id, related_id);


--
-- Name: character_random_table_fields_character_id_blue_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX character_random_table_fields_character_id_blue_key ON public.character_random_table_fields USING btree (character_id, character_field_id, related_id);


--
-- Name: character_relationship_types_project_id_title_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX character_relationship_types_project_id_title_key ON public.character_relationship_types USING btree (project_id, title);


--
-- Name: character_ts_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX character_ts_index ON public.characters USING gin (ts);


--
-- Name: characters_relationships_character_a_id_character_b_id_rela_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX characters_relationships_character_a_id_character_b_id_rela_key ON public.characters_relationships USING btree (character_a_id, character_b_id, relation_type_id);


--
-- Name: dictionaries_project_id_title_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX dictionaries_project_id_title_key ON public.dictionaries USING btree (project_id, title);


--
-- Name: graphs_ts_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX graphs_ts_index ON public.graphs USING gin (ts);


--
-- Name: idx_characters_full_name_ilike; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_characters_full_name_ilike ON public.characters USING gin (full_name public.gin_trgm_ops);


--
-- Name: idx_documents_title_ilike; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_documents_title_ilike ON public.documents USING gin (title public.gin_trgm_ops);


--
-- Name: images_project_image_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX images_project_image_id_key ON public.images USING btree (project_image_id);


--
-- Name: maps_ts_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX maps_ts_index ON public.maps USING gin (ts);


--
-- Name: tags_title_project_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX tags_title_project_id_key ON public.tags USING btree (title, project_id);


--
-- Name: ts_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ts_idx ON public.documents USING gin (ts);


--
-- Name: users_auth_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_auth_id_key ON public.users USING btree (auth_id);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: webhooks_id_user_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX webhooks_id_user_id_key ON public.webhooks USING btree (id, user_id);


--
-- Name: words_title_translation_parent_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX words_title_translation_parent_id_key ON public.words USING btree (title, translation, parent_id);


--
-- Name: words_ts_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX words_ts_index ON public.words USING gin (ts);


--
-- Name: _blueprint_instancesTotags _blueprint_instancesTotags_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_blueprint_instancesTotags"
    ADD CONSTRAINT "_blueprint_instancesTotags_A_fkey" FOREIGN KEY ("A") REFERENCES public.blueprint_instances(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _blueprint_instancesTotags _blueprint_instancesTotags_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_blueprint_instancesTotags"
    ADD CONSTRAINT "_blueprint_instancesTotags_B_fkey" FOREIGN KEY ("B") REFERENCES public.tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _calendarsTotags _calendarsTotags_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_calendarsTotags"
    ADD CONSTRAINT "_calendarsTotags_A_fkey" FOREIGN KEY ("A") REFERENCES public.calendars(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _calendarsTotags _calendarsTotags_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_calendarsTotags"
    ADD CONSTRAINT "_calendarsTotags_B_fkey" FOREIGN KEY ("B") REFERENCES public.tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _calendarsTotimelines _calendarsTotimelines_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_calendarsTotimelines"
    ADD CONSTRAINT "_calendarsTotimelines_A_fkey" FOREIGN KEY ("A") REFERENCES public.calendars(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _calendarsTotimelines _calendarsTotimelines_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_calendarsTotimelines"
    ADD CONSTRAINT "_calendarsTotimelines_B_fkey" FOREIGN KEY ("B") REFERENCES public.timelines(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _character_fields_templatesTotags _character_fields_templatesTotags_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_character_fields_templatesTotags"
    ADD CONSTRAINT "_character_fields_templatesTotags_A_fkey" FOREIGN KEY ("A") REFERENCES public.character_fields_templates(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _character_fields_templatesTotags _character_fields_templatesTotags_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_character_fields_templatesTotags"
    ADD CONSTRAINT "_character_fields_templatesTotags_B_fkey" FOREIGN KEY ("B") REFERENCES public.tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _charactersToconversations _charactersToconversations_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_charactersToconversations"
    ADD CONSTRAINT "_charactersToconversations_A_fkey" FOREIGN KEY ("A") REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _charactersToconversations _charactersToconversations_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_charactersToconversations"
    ADD CONSTRAINT "_charactersToconversations_B_fkey" FOREIGN KEY ("B") REFERENCES public.conversations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _charactersTodocuments _charactersTodocuments_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_charactersTodocuments"
    ADD CONSTRAINT "_charactersTodocuments_A_fkey" FOREIGN KEY ("A") REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _charactersTodocuments _charactersTodocuments_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_charactersTodocuments"
    ADD CONSTRAINT "_charactersTodocuments_B_fkey" FOREIGN KEY ("B") REFERENCES public.documents(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _charactersToimages _charactersToimages_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_charactersToimages"
    ADD CONSTRAINT "_charactersToimages_A_fkey" FOREIGN KEY ("A") REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _charactersToimages _charactersToimages_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_charactersToimages"
    ADD CONSTRAINT "_charactersToimages_B_fkey" FOREIGN KEY ("B") REFERENCES public.images(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _charactersTotags _charactersTotags_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_charactersTotags"
    ADD CONSTRAINT "_charactersTotags_A_fkey" FOREIGN KEY ("A") REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _charactersTotags _charactersTotags_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_charactersTotags"
    ADD CONSTRAINT "_charactersTotags_B_fkey" FOREIGN KEY ("B") REFERENCES public.tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _dictionariesTotags _dictionariesTotags_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_dictionariesTotags"
    ADD CONSTRAINT "_dictionariesTotags_A_fkey" FOREIGN KEY ("A") REFERENCES public.dictionaries(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _dictionariesTotags _dictionariesTotags_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_dictionariesTotags"
    ADD CONSTRAINT "_dictionariesTotags_B_fkey" FOREIGN KEY ("B") REFERENCES public.tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _documentsTotags _documentsTotags_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_documentsTotags"
    ADD CONSTRAINT "_documentsTotags_A_fkey" FOREIGN KEY ("A") REFERENCES public.documents(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _documentsTotags _documentsTotags_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_documentsTotags"
    ADD CONSTRAINT "_documentsTotags_B_fkey" FOREIGN KEY ("B") REFERENCES public.tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _edgesTotags _edgesTotags_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_edgesTotags"
    ADD CONSTRAINT "_edgesTotags_A_fkey" FOREIGN KEY ("A") REFERENCES public.edges(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _edgesTotags _edgesTotags_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_edgesTotags"
    ADD CONSTRAINT "_edgesTotags_B_fkey" FOREIGN KEY ("B") REFERENCES public.tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _eventsTotags _eventsTotags_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_eventsTotags"
    ADD CONSTRAINT "_eventsTotags_A_fkey" FOREIGN KEY ("A") REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _eventsTotags _eventsTotags_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_eventsTotags"
    ADD CONSTRAINT "_eventsTotags_B_fkey" FOREIGN KEY ("B") REFERENCES public.tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _graphsTotags _graphsTotags_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_graphsTotags"
    ADD CONSTRAINT "_graphsTotags_A_fkey" FOREIGN KEY ("A") REFERENCES public.graphs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _graphsTotags _graphsTotags_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_graphsTotags"
    ADD CONSTRAINT "_graphsTotags_B_fkey" FOREIGN KEY ("B") REFERENCES public.tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _map_pinsTotags _map_pinsTotags_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_map_pinsTotags"
    ADD CONSTRAINT "_map_pinsTotags_A_fkey" FOREIGN KEY ("A") REFERENCES public.map_pins(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _map_pinsTotags _map_pinsTotags_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_map_pinsTotags"
    ADD CONSTRAINT "_map_pinsTotags_B_fkey" FOREIGN KEY ("B") REFERENCES public.tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _mapsTotags _mapsTotags_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_mapsTotags"
    ADD CONSTRAINT "_mapsTotags_A_fkey" FOREIGN KEY ("A") REFERENCES public.maps(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _mapsTotags _mapsTotags_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_mapsTotags"
    ADD CONSTRAINT "_mapsTotags_B_fkey" FOREIGN KEY ("B") REFERENCES public.tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _nodesTotags _nodesTotags_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_nodesTotags"
    ADD CONSTRAINT "_nodesTotags_A_fkey" FOREIGN KEY ("A") REFERENCES public.nodes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _nodesTotags _nodesTotags_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_nodesTotags"
    ADD CONSTRAINT "_nodesTotags_B_fkey" FOREIGN KEY ("B") REFERENCES public.tags(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _project_members _project_members_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._project_members
    ADD CONSTRAINT "_project_members_A_fkey" FOREIGN KEY ("A") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _project_members _project_members_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._project_members
    ADD CONSTRAINT "_project_members_B_fkey" FOREIGN KEY ("B") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: alter_names alter_names_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alter_names
    ADD CONSTRAINT alter_names_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.documents(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: alter_names alter_names_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alter_names
    ADD CONSTRAINT alter_names_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blueprint_fields blueprint_fields_blueprint_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_fields
    ADD CONSTRAINT blueprint_fields_blueprint_id_fkey FOREIGN KEY (blueprint_id) REFERENCES public.blueprints(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: blueprint_fields blueprint_fields_calendar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_fields
    ADD CONSTRAINT blueprint_fields_calendar_id_fkey FOREIGN KEY (calendar_id) REFERENCES public.calendars(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: blueprint_fields blueprint_fields_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_fields
    ADD CONSTRAINT blueprint_fields_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.blueprints(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blueprint_fields blueprint_fields_random_table_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_fields
    ADD CONSTRAINT blueprint_fields_random_table_id_fkey FOREIGN KEY (random_table_id) REFERENCES public.random_tables(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: blueprint_instance_blueprint_instances blueprint_instance_blueprint_instances_blueprint_field_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_blueprint_instances
    ADD CONSTRAINT blueprint_instance_blueprint_instances_blueprint_field_id_fkey FOREIGN KEY (blueprint_field_id) REFERENCES public.blueprint_fields(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blueprint_instance_blueprint_instances blueprint_instance_blueprint_instances_blueprint_instance__fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_blueprint_instances
    ADD CONSTRAINT blueprint_instance_blueprint_instances_blueprint_instance__fkey FOREIGN KEY (blueprint_instance_id) REFERENCES public.blueprint_instances(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blueprint_instance_blueprint_instances blueprint_instance_blueprint_instances_related_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_blueprint_instances
    ADD CONSTRAINT blueprint_instance_blueprint_instances_related_id_fkey FOREIGN KEY (related_id) REFERENCES public.blueprint_instances(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blueprint_instance_calendars blueprint_instance_calendars_blueprint_field_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_calendars
    ADD CONSTRAINT blueprint_instance_calendars_blueprint_field_id_fkey FOREIGN KEY (blueprint_field_id) REFERENCES public.blueprint_fields(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blueprint_instance_calendars blueprint_instance_calendars_blueprint_instance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_calendars
    ADD CONSTRAINT blueprint_instance_calendars_blueprint_instance_id_fkey FOREIGN KEY (blueprint_instance_id) REFERENCES public.blueprint_instances(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blueprint_instance_calendars blueprint_instance_calendars_end_month_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_calendars
    ADD CONSTRAINT blueprint_instance_calendars_end_month_id_fkey FOREIGN KEY (end_month_id) REFERENCES public.months(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: blueprint_instance_calendars blueprint_instance_calendars_related_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_calendars
    ADD CONSTRAINT blueprint_instance_calendars_related_id_fkey FOREIGN KEY (related_id) REFERENCES public.calendars(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blueprint_instance_calendars blueprint_instance_calendars_start_month_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_calendars
    ADD CONSTRAINT blueprint_instance_calendars_start_month_id_fkey FOREIGN KEY (start_month_id) REFERENCES public.months(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: blueprint_instance_characters blueprint_instance_characters_blueprint_field_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_characters
    ADD CONSTRAINT blueprint_instance_characters_blueprint_field_id_fkey FOREIGN KEY (blueprint_field_id) REFERENCES public.blueprint_fields(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blueprint_instance_characters blueprint_instance_characters_blueprint_instance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_characters
    ADD CONSTRAINT blueprint_instance_characters_blueprint_instance_id_fkey FOREIGN KEY (blueprint_instance_id) REFERENCES public.blueprint_instances(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blueprint_instance_characters blueprint_instance_characters_related_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_characters
    ADD CONSTRAINT blueprint_instance_characters_related_id_fkey FOREIGN KEY (related_id) REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blueprint_instance_documents blueprint_instance_documents_blueprint_field_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_documents
    ADD CONSTRAINT blueprint_instance_documents_blueprint_field_id_fkey FOREIGN KEY (blueprint_field_id) REFERENCES public.blueprint_fields(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blueprint_instance_documents blueprint_instance_documents_blueprint_instance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_documents
    ADD CONSTRAINT blueprint_instance_documents_blueprint_instance_id_fkey FOREIGN KEY (blueprint_instance_id) REFERENCES public.blueprint_instances(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blueprint_instance_documents blueprint_instance_documents_related_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_documents
    ADD CONSTRAINT blueprint_instance_documents_related_id_fkey FOREIGN KEY (related_id) REFERENCES public.documents(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blueprint_instance_images blueprint_instance_images_blueprint_field_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_images
    ADD CONSTRAINT blueprint_instance_images_blueprint_field_id_fkey FOREIGN KEY (blueprint_field_id) REFERENCES public.blueprint_fields(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blueprint_instance_images blueprint_instance_images_blueprint_instance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_images
    ADD CONSTRAINT blueprint_instance_images_blueprint_instance_id_fkey FOREIGN KEY (blueprint_instance_id) REFERENCES public.blueprint_instances(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blueprint_instance_images blueprint_instance_images_related_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_images
    ADD CONSTRAINT blueprint_instance_images_related_id_fkey FOREIGN KEY (related_id) REFERENCES public.images(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blueprint_instance_map_pins blueprint_instance_map_pins_blueprint_field_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_map_pins
    ADD CONSTRAINT blueprint_instance_map_pins_blueprint_field_id_fkey FOREIGN KEY (blueprint_field_id) REFERENCES public.blueprint_fields(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blueprint_instance_map_pins blueprint_instance_map_pins_blueprint_instance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_map_pins
    ADD CONSTRAINT blueprint_instance_map_pins_blueprint_instance_id_fkey FOREIGN KEY (blueprint_instance_id) REFERENCES public.blueprint_instances(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blueprint_instance_map_pins blueprint_instance_map_pins_related_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_map_pins
    ADD CONSTRAINT blueprint_instance_map_pins_related_id_fkey FOREIGN KEY (related_id) REFERENCES public.map_pins(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blueprint_instance_random_tables blueprint_instance_random_tables_blueprint_field_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_random_tables
    ADD CONSTRAINT blueprint_instance_random_tables_blueprint_field_id_fkey FOREIGN KEY (blueprint_field_id) REFERENCES public.blueprint_fields(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blueprint_instance_random_tables blueprint_instance_random_tables_blueprint_instance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_random_tables
    ADD CONSTRAINT blueprint_instance_random_tables_blueprint_instance_id_fkey FOREIGN KEY (blueprint_instance_id) REFERENCES public.blueprint_instances(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blueprint_instance_random_tables blueprint_instance_random_tables_option_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_random_tables
    ADD CONSTRAINT blueprint_instance_random_tables_option_id_fkey FOREIGN KEY (option_id) REFERENCES public.random_table_options(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: blueprint_instance_random_tables blueprint_instance_random_tables_related_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_random_tables
    ADD CONSTRAINT blueprint_instance_random_tables_related_id_fkey FOREIGN KEY (related_id) REFERENCES public.random_tables(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blueprint_instance_random_tables blueprint_instance_random_tables_suboption_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_random_tables
    ADD CONSTRAINT blueprint_instance_random_tables_suboption_id_fkey FOREIGN KEY (suboption_id) REFERENCES public.random_table_suboptions(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: blueprint_instance_value blueprint_instance_value_blueprint_field_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_value
    ADD CONSTRAINT blueprint_instance_value_blueprint_field_id_fkey FOREIGN KEY (blueprint_field_id) REFERENCES public.blueprint_fields(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blueprint_instance_value blueprint_instance_value_blueprint_instance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instance_value
    ADD CONSTRAINT blueprint_instance_value_blueprint_instance_id_fkey FOREIGN KEY (blueprint_instance_id) REFERENCES public.blueprint_instances(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blueprint_instances blueprint_instances_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprint_instances
    ADD CONSTRAINT blueprint_instances_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.blueprints(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blueprints blueprints_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blueprints
    ADD CONSTRAINT blueprints_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: calendars calendars_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendars
    ADD CONSTRAINT calendars_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.calendars(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: calendars calendars_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendars
    ADD CONSTRAINT calendars_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: character_blueprint_instance_fields character_blueprint_instance_fields_character_field_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_blueprint_instance_fields
    ADD CONSTRAINT character_blueprint_instance_fields_character_field_id_fkey FOREIGN KEY (character_field_id) REFERENCES public.character_fields(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: character_blueprint_instance_fields character_blueprint_instance_fields_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_blueprint_instance_fields
    ADD CONSTRAINT character_blueprint_instance_fields_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: character_blueprint_instance_fields character_blueprint_instance_fields_related_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_blueprint_instance_fields
    ADD CONSTRAINT character_blueprint_instance_fields_related_id_fkey FOREIGN KEY (related_id) REFERENCES public.blueprint_instances(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: character_calendar_fields character_calendar_fields_character_field_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_calendar_fields
    ADD CONSTRAINT character_calendar_fields_character_field_id_fkey FOREIGN KEY (character_field_id) REFERENCES public.character_fields(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: character_calendar_fields character_calendar_fields_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_calendar_fields
    ADD CONSTRAINT character_calendar_fields_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: character_calendar_fields character_calendar_fields_end_month_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_calendar_fields
    ADD CONSTRAINT character_calendar_fields_end_month_id_fkey FOREIGN KEY (end_month_id) REFERENCES public.months(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: character_calendar_fields character_calendar_fields_related_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_calendar_fields
    ADD CONSTRAINT character_calendar_fields_related_id_fkey FOREIGN KEY (related_id) REFERENCES public.calendars(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: character_calendar_fields character_calendar_fields_start_month_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_calendar_fields
    ADD CONSTRAINT character_calendar_fields_start_month_id_fkey FOREIGN KEY (start_month_id) REFERENCES public.months(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: character_documents_fields character_documents_fields_character_field_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_documents_fields
    ADD CONSTRAINT character_documents_fields_character_field_id_fkey FOREIGN KEY (character_field_id) REFERENCES public.character_fields(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: character_documents_fields character_documents_fields_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_documents_fields
    ADD CONSTRAINT character_documents_fields_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: character_documents_fields character_documents_fields_related_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_documents_fields
    ADD CONSTRAINT character_documents_fields_related_id_fkey FOREIGN KEY (related_id) REFERENCES public.documents(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: character_fields character_fields_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_fields
    ADD CONSTRAINT character_fields_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.character_fields_templates(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: character_fields_templates character_fields_templates_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_fields_templates
    ADD CONSTRAINT character_fields_templates_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: character_images_fields character_images_fields_character_field_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_images_fields
    ADD CONSTRAINT character_images_fields_character_field_id_fkey FOREIGN KEY (character_field_id) REFERENCES public.character_fields(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: character_images_fields character_images_fields_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_images_fields
    ADD CONSTRAINT character_images_fields_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: character_images_fields character_images_fields_related_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_images_fields
    ADD CONSTRAINT character_images_fields_related_id_fkey FOREIGN KEY (related_id) REFERENCES public.images(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: character_locations_fields character_locations_fields_character_field_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_locations_fields
    ADD CONSTRAINT character_locations_fields_character_field_id_fkey FOREIGN KEY (character_field_id) REFERENCES public.character_fields(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: character_locations_fields character_locations_fields_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_locations_fields
    ADD CONSTRAINT character_locations_fields_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: character_locations_fields character_locations_fields_related_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_locations_fields
    ADD CONSTRAINT character_locations_fields_related_id_fkey FOREIGN KEY (related_id) REFERENCES public.map_pins(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: character_random_table_fields character_random_table_fields_character_field_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_random_table_fields
    ADD CONSTRAINT character_random_table_fields_character_field_id_fkey FOREIGN KEY (character_field_id) REFERENCES public.character_fields(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: character_random_table_fields character_random_table_fields_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_random_table_fields
    ADD CONSTRAINT character_random_table_fields_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: character_random_table_fields character_random_table_fields_option_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_random_table_fields
    ADD CONSTRAINT character_random_table_fields_option_id_fkey FOREIGN KEY (option_id) REFERENCES public.random_table_options(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: character_random_table_fields character_random_table_fields_related_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_random_table_fields
    ADD CONSTRAINT character_random_table_fields_related_id_fkey FOREIGN KEY (related_id) REFERENCES public.random_tables(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: character_random_table_fields character_random_table_fields_suboption_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_random_table_fields
    ADD CONSTRAINT character_random_table_fields_suboption_id_fkey FOREIGN KEY (suboption_id) REFERENCES public.random_table_suboptions(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: character_relationship_types character_relationship_types_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_relationship_types
    ADD CONSTRAINT character_relationship_types_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: character_value_fields character_value_fields_character_field_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_value_fields
    ADD CONSTRAINT character_value_fields_character_field_id_fkey FOREIGN KEY (character_field_id) REFERENCES public.character_fields(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: character_value_fields character_value_fields_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.character_value_fields
    ADD CONSTRAINT character_value_fields_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: characters characters_portrait_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.characters
    ADD CONSTRAINT characters_portrait_id_fkey FOREIGN KEY (portrait_id) REFERENCES public.images(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: characters characters_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.characters
    ADD CONSTRAINT characters_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: characters_relationships characters_relationships_character_a_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.characters_relationships
    ADD CONSTRAINT characters_relationships_character_a_id_fkey FOREIGN KEY (character_a_id) REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: characters_relationships characters_relationships_character_b_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.characters_relationships
    ADD CONSTRAINT characters_relationships_character_b_id_fkey FOREIGN KEY (character_b_id) REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: characters_relationships characters_relationships_relation_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.characters_relationships
    ADD CONSTRAINT characters_relationships_relation_type_id_fkey FOREIGN KEY (relation_type_id) REFERENCES public.character_relationship_types(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: conversations conversations_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: dictionaries dictionaries_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dictionaries
    ADD CONSTRAINT dictionaries_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.dictionaries(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: dictionaries dictionaries_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dictionaries
    ADD CONSTRAINT dictionaries_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: documents documents_image_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_image_id_fkey FOREIGN KEY (image_id) REFERENCES public.images(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: documents documents_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.documents(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: documents documents_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: edges edges_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.edges
    ADD CONSTRAINT edges_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.graphs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: edges edges_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.edges
    ADD CONSTRAINT edges_source_id_fkey FOREIGN KEY (source_id) REFERENCES public.nodes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: edges edges_target_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.edges
    ADD CONSTRAINT edges_target_id_fkey FOREIGN KEY (target_id) REFERENCES public.nodes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: events events_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.documents(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: events events_image_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_image_id_fkey FOREIGN KEY (image_id) REFERENCES public.images(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: events events_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.calendars(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: graphs graphs_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.graphs
    ADD CONSTRAINT graphs_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.graphs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: graphs graphs_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.graphs
    ADD CONSTRAINT graphs_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: images images_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: images images_project_image_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_project_image_id_fkey FOREIGN KEY (project_image_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: map_layers map_layers_image_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_layers
    ADD CONSTRAINT map_layers_image_id_fkey FOREIGN KEY (image_id) REFERENCES public.images(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: map_layers map_layers_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_layers
    ADD CONSTRAINT map_layers_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.maps(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: map_pins map_pins_image_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_pins
    ADD CONSTRAINT map_pins_image_id_fkey FOREIGN KEY (image_id) REFERENCES public.images(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: map_pins map_pins_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_pins
    ADD CONSTRAINT map_pins_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.maps(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: maps maps_image_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maps
    ADD CONSTRAINT maps_image_id_fkey FOREIGN KEY (image_id) REFERENCES public.images(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: maps maps_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maps
    ADD CONSTRAINT maps_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.maps(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: maps maps_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.maps
    ADD CONSTRAINT maps_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: messages messages_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.conversations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: months months_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.months
    ADD CONSTRAINT months_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.calendars(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: nodes nodes_character_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT nodes_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: nodes nodes_doc_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT nodes_doc_id_fkey FOREIGN KEY (doc_id) REFERENCES public.documents(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: nodes nodes_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT nodes_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: nodes nodes_image_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT nodes_image_id_fkey FOREIGN KEY (image_id) REFERENCES public.images(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: nodes nodes_map_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT nodes_map_id_fkey FOREIGN KEY (map_id) REFERENCES public.maps(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: nodes nodes_map_pin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT nodes_map_pin_id_fkey FOREIGN KEY (map_pin_id) REFERENCES public.map_pins(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: nodes nodes_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nodes
    ADD CONSTRAINT nodes_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.graphs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: projects projects_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: random_table_options random_table_options_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.random_table_options
    ADD CONSTRAINT random_table_options_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.random_tables(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: random_table_suboptions random_table_suboptions_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.random_table_suboptions
    ADD CONSTRAINT random_table_suboptions_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.random_table_options(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: random_tables random_tables_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.random_tables
    ADD CONSTRAINT random_tables_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.random_tables(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: random_tables random_tables_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.random_tables
    ADD CONSTRAINT random_tables_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tags tags_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: timelines timelines_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timelines
    ADD CONSTRAINT timelines_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.timelines(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: timelines timelines_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timelines
    ADD CONSTRAINT timelines_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: webhooks webhooks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webhooks
    ADD CONSTRAINT webhooks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: words words_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.words
    ADD CONSTRAINT words_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.dictionaries(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20231112095433'),
    ('20231112190702'),
    ('20231112192351'),
    ('20231113075416'),
    ('20231113095003'),
    ('20231113095242'),
    ('20231113115145'),
    ('20231115075556'),
    ('20231115080322'),
    ('20231115084021'),
    ('20231115094355'),
    ('20231115094748'),
    ('20231115132655'),
    ('20231116133905'),
    ('20231116150742'),
    ('20231117074514'),
    ('20231117094721'),
    ('20231117104543'),
    ('20231118100320'),
    ('20231118112502'),
    ('20231120082407'),
    ('20231128071324');
