--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1 (Debian 16.1-1.pgdg120+1)
-- Dumped by pg_dump version 16.2

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
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, auth_id, email, feature_flags, updated_at) FROM stdin;
715f9042-bbef-4115-8e1d-9d605a886f77	user_2dJOJVH8YxKGpWOG0Osr6I3UoLl	mihailobeograd.dilparic@gmail.com	{"maps_enabled": true, "graphs_enabled": true, "calendars_enabled": true, "documents_enabled": true, "blueprints_enabled": true, "characters_enabled": true, "dictionaries_enabled": true, "random_tables_enabled": true, "show_eras_in_calendars": false, "show_eras_in_timelines": true, "maps_create_notification": true, "maps_delete_notification": true, "maps_update_notification": true, "sort_tags_alphabetically": true, "tags_create_notification": true, "tags_delete_notification": true, "tags_update_notification": true, "edges_create_notification": true, "edges_delete_notification": true, "edges_update_notification": true, "group_events_in_timelines": true, "nodes_create_notification": true, "nodes_delete_notification": true, "nodes_update_notification": true, "words_create_notification": true, "words_delete_notification": true, "words_update_notification": true, "events_create_notification": true, "events_delete_notification": true, "events_update_notification": true, "graphs_create_notification": true, "graphs_delete_notification": true, "graphs_update_notification": true, "screens_create_notification": true, "screens_delete_notification": true, "screens_update_notification": true, "map_pins_create_notification": true, "map_pins_delete_notification": true, "map_pins_update_notification": true, "calendars_create_notification": true, "calendars_delete_notification": true, "calendars_update_notification": true, "documents_create_notification": true, "documents_delete_notification": true, "documents_update_notification": true, "blueprints_create_notification": true, "blueprints_delete_notification": true, "blueprints_update_notification": true, "characters_create_notification": true, "characters_delete_notification": true, "characters_update_notification": true, "map_layers_create_notification": true, "map_layers_delete_notification": true, "map_layers_update_notification": true, "dictionaries_create_notification": true, "dictionaries_delete_notification": true, "dictionaries_update_notification": true, "conversations_create_notification": true, "conversations_delete_notification": true, "conversations_update_notification": true, "character_fields_templates_enabled": true, "character_fields_create_notification": true, "character_fields_delete_notification": true, "character_fields_update_notification": true, "blueprint_instances_create_notification": true, "blueprint_instances_delete_notification": true, "blueprint_instances_update_notification": true, "character_fields_templates_create_notification": true, "character_fields_templates_delete_notification": true, "character_fields_templates_update_notification": true}	2024-03-06 10:57:23.544
00fb25f1-2f47-40e3-bcaf-35d303c10207	user_2O4ZK45PLvS7yfHuRXpGws71upC	mihailo.dilparic@gmail.com	{"maps_enabled": true, "graphs_enabled": true, "calendars_enabled": true, "documents_enabled": true, "blueprints_enabled": true, "characters_enabled": true, "dictionaries_enabled": true, "random_tables_enabled": true, "show_eras_in_timelines": true, "sort_tags_alphabetically": true, "characters_create_notification": false, "character_fields_templates_enabled": true}	2024-05-02 10:46:21.997
5d89de13-a71e-409e-8817-10763812e82d	user_2bJrrE9vulJzAsUhk6URmYFS2eT	tca6379@gmail.com 	{"maps_enabled": true, "graphs_enabled": true, "calendars_enabled": true, "documents_enabled": true, "blueprints_enabled": true, "characters_enabled": true, "dictionaries_enabled": true, "random_tables_enabled": true, "show_eras_in_timelines": true, "sort_tags_alphabetically": true, "characters_create_notification": false, "character_fields_templates_enabled": true}	2024-01-22 18:04:08.149
05cf043c-52f2-4f02-bcaf-37672b32510c	user_2UCfazP3oEgyxjxQJQYf2wreL1U	recruiteremail@gmail.com	{"maps_enabled": true, "graphs_enabled": true, "calendars_enabled": true, "documents_enabled": true, "blueprints_enabled": true, "characters_enabled": true, "dictionaries_enabled": true, "random_tables_enabled": false, "show_eras_in_timelines": true, "sort_tags_alphabetically": true, "characters_create_notification": false, "character_fields_templates_enabled": true}	2024-02-16 10:26:38.33
6f30b03e-a9c0-4b82-b046-504367e98081	user_2P7KgKt2vVny6TlcnYRdzoubxPv	marija.vilimonovic@yahoo.com	{"maps_enabled": true, "graphs_enabled": true, "calendars_enabled": true, "documents_enabled": true, "blueprints_enabled": true, "characters_enabled": true, "dictionaries_enabled": true, "random_tables_enabled": true, "show_eras_in_calendars": false, "show_eras_in_timelines": true, "maps_create_notification": true, "maps_delete_notification": true, "maps_update_notification": true, "sort_tags_alphabetically": true, "tags_create_notification": true, "tags_delete_notification": true, "tags_update_notification": true, "edges_create_notification": true, "edges_delete_notification": true, "edges_update_notification": true, "group_events_in_timelines": true, "nodes_create_notification": true, "nodes_delete_notification": true, "nodes_update_notification": true, "words_create_notification": true, "words_delete_notification": true, "words_update_notification": true, "events_create_notification": true, "events_delete_notification": true, "events_update_notification": true, "graphs_create_notification": true, "graphs_delete_notification": true, "graphs_update_notification": true, "screens_create_notification": true, "screens_delete_notification": true, "screens_update_notification": true, "map_pins_create_notification": true, "map_pins_delete_notification": true, "map_pins_update_notification": true, "calendars_create_notification": true, "calendars_delete_notification": true, "calendars_update_notification": true, "documents_create_notification": true, "documents_delete_notification": true, "documents_update_notification": true, "blueprints_create_notification": true, "blueprints_delete_notification": true, "blueprints_update_notification": true, "characters_create_notification": true, "characters_delete_notification": true, "characters_update_notification": true, "map_layers_create_notification": true, "map_layers_delete_notification": true, "map_layers_update_notification": true, "dictionaries_create_notification": true, "dictionaries_delete_notification": true, "dictionaries_update_notification": true, "conversations_create_notification": true, "conversations_delete_notification": true, "conversations_update_notification": true, "character_fields_templates_enabled": true, "character_fields_create_notification": true, "character_fields_delete_notification": true, "character_fields_update_notification": true, "blueprint_instances_create_notification": true, "blueprint_instances_delete_notification": true, "blueprint_instances_update_notification": true, "character_fields_templates_create_notification": true, "character_fields_templates_delete_notification": true, "character_fields_templates_update_notification": true}	2024-05-02 10:18:13.851
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, created_at, title, image_id, owner_id, default_dice_color) FROM stdin;
43e1c879-415b-4394-95ad-f9a4c42a43c5	2023-09-21 11:37:00	Chronicles of Salaraan	681f05b3-3720-4c1b-b807-a34c14920221	00fb25f1-2f47-40e3-bcaf-35d303c10207	#047857
eb68433a-64b2-4bf9-92a8-5625f46ad59f	2024-01-13 12:49:23.073	Chronicles of Salaraan: Frontier	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
77cb0278-b9c7-43b5-bd30-e72022eacf11	2024-01-30 19:35:12.901	Game of thrones	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
dcd1d7c5-4096-47bf-8214-337e5a596306	2024-01-22 17:38:30.787	Novel Planning	ac4fed8d-fedd-4503-93b3-3ae33912d52d	5d89de13-a71e-409e-8817-10763812e82d	\N
\.


--
-- Data for Name: blueprints; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blueprints (id, created_at, updated_at, title, project_id, title_name, icon, owner_id, deleted_at) FROM stdin;
07490b86-d82d-449f-bfc2-8154bcf3c560	2023-11-13 07:31:31.099	2024-03-28 15:42:35.922	Organization	43e1c879-415b-4394-95ad-f9a4c42a43c5	Title	game-icons:organigram	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
b4a5a3ac-ccca-4522-8f9e-27fa1faeb37f	2023-12-20 22:49:57.631	2024-03-28 15:42:35.922	Language	43e1c879-415b-4394-95ad-f9a4c42a43c5	Name	game-icons:book-cover	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
452867c0-ba7e-42ce-a8c7-0a01103e819e	2024-01-07 09:54:31.95	2024-03-28 15:42:35.922	Plant	43e1c879-415b-4394-95ad-f9a4c42a43c5	Name	game-icons:plant-roots	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
30091ef1-6bf6-4215-b256-57622fe7c645	2024-02-10 10:38:12.797	2024-03-28 15:42:35.922	Great House	77cb0278-b9c7-43b5-bd30-e72022eacf11	Name	game-icons:bolt-shield	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
0e7b37e1-97d9-497f-b4e5-8b0aed78c6ce	2024-03-03 11:45:50.95	2024-03-28 15:42:35.922	Important families	43e1c879-415b-4394-95ad-f9a4c42a43c5	Name	game-icons:family-tree	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
cc93b9b9-56f6-4cc9-b8f0-9e6df8604afc	2024-02-23 12:00:20.796	2024-03-28 15:42:35.922	Origin	43e1c879-415b-4394-95ad-f9a4c42a43c5	Name	game-icons:abstract-047	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
d3579cde-a472-4869-acaa-77949885744b	2024-04-05 18:33:13.657	2024-04-05 18:58:29.684	Weapon	43e1c879-415b-4394-95ad-f9a4c42a43c5	Name	game-icons:crossed-swords	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
44598285-2999-4846-a6e3-1c746ed886ab	2024-04-05 19:01:10.532	2024-04-05 19:01:23.891	Title	43e1c879-415b-4394-95ad-f9a4c42a43c5	Name	game-icons:sport-medal	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
618ab39e-1dc9-4612-a4ba-7679064018bc	2024-04-05 19:00:48.645	2024-04-05 19:03:10.761	Country	43e1c879-415b-4394-95ad-f9a4c42a43c5	Name	game-icons:flying-flag	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
0f1930b1-44c5-4a76-8125-beb31612bb12	2024-04-15 08:18:45.346	2024-04-15 08:18:45.346	Weapons	eb68433a-64b2-4bf9-92a8-5625f46ad59f	Name	game-icons:crossed-swords	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
95f8881b-9517-419e-9cc3-c9d6092ef0a2	2024-04-15 08:16:36.205	2024-04-15 08:19:39.086	Settlements	eb68433a-64b2-4bf9-92a8-5625f46ad59f	Name	game-icons:village	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
b4405bec-f165-461b-9ba1-0ebfd9121b13	2024-04-15 08:21:41.583	2024-04-15 08:21:41.583	Alchemy ingredients	eb68433a-64b2-4bf9-92a8-5625f46ad59f	Name	game-icons:fire-bottle	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
0e424e1c-896c-4831-b50e-2f6671c382ae	2024-04-15 08:17:21.646	2024-04-15 08:23:37.567	Shops	eb68433a-64b2-4bf9-92a8-5625f46ad59f	Name	game-icons:scales	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
\.


--
-- Data for Name: blueprint_instances; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blueprint_instances (id, created_at, updated_at, parent_id, title, is_public, owner_id, deleted_at) FROM stdin;
c2a73823-6116-4d67-9ec2-3c4b2102d22c	2024-01-07 09:56:30.377	2024-04-05 16:25:24.948	452867c0-ba7e-42ce-a8c7-0a01103e819e	Wisteria	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
2b272f40-2fc9-43db-b497-d484b9defb31	2024-01-12 09:01:46.464	2024-04-05 18:28:58.551	b4a5a3ac-ccca-4522-8f9e-27fa1faeb37f	High elvish	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
e3c43417-2afc-4175-b176-0065866aeb85	2024-03-04 14:08:54.368	2024-04-05 18:29:25.512	b4a5a3ac-ccca-4522-8f9e-27fa1faeb37f	Do'rau	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
b2ce1e15-3070-4edf-9bb8-12b20def6166	2024-03-04 11:21:19.363	2024-03-28 15:42:35.922	cc93b9b9-56f6-4cc9-b8f0-9e6df8604afc	Imperial (Capital)	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
85cb7d4f-fd39-4a6f-8b59-68e490af507a	2024-03-04 11:27:02.944	2024-03-28 15:42:35.922	cc93b9b9-56f6-4cc9-b8f0-9e6df8604afc	Imperial (Atrisian)	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
50d76389-1a03-4a41-9d09-61c5aa320e5a	2024-03-04 11:27:14.923	2024-03-28 15:42:35.922	cc93b9b9-56f6-4cc9-b8f0-9e6df8604afc	Imperial (Phymon)	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
584248e6-793b-4533-a04b-4c68feda6861	2024-03-04 11:27:53.325	2024-03-28 15:42:35.922	cc93b9b9-56f6-4cc9-b8f0-9e6df8604afc	Imperial (Siratian)	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
aceddc8b-d563-4629-9ddc-4f8e4951c058	2024-03-04 11:28:05.011	2024-03-28 15:42:35.922	cc93b9b9-56f6-4cc9-b8f0-9e6df8604afc	Imperial (Xulanese)	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
652a30ba-8eec-421a-b9ec-8689f7c857b9	2024-03-04 11:28:18.536	2024-03-28 15:42:35.922	cc93b9b9-56f6-4cc9-b8f0-9e6df8604afc	Imperial (Rothromian)	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
6ecaf253-ffe7-4288-8332-917cdc582657	2024-03-04 14:06:54.227	2024-03-28 15:42:35.922	b4a5a3ac-ccca-4522-8f9e-27fa1faeb37f	Xafian	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
ecc18941-4797-4a3a-add7-ade393379dee	2024-03-04 14:07:42.393	2024-03-28 15:42:35.922	b4a5a3ac-ccca-4522-8f9e-27fa1faeb37f	Tarnesian	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
f137c4c0-ecd3-4fca-b437-ef3a91be3ce0	2024-03-04 14:07:51.046	2024-03-28 15:42:35.922	b4a5a3ac-ccca-4522-8f9e-27fa1faeb37f	Majoretten	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
2c09cad8-af31-4d48-b557-6dc1cbe7dbb4	2024-01-12 09:02:13.028	2024-03-28 15:42:35.922	b4a5a3ac-ccca-4522-8f9e-27fa1faeb37f	Sarthian	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
bd3c0476-6b82-48fe-bf4e-4c97b269248e	2024-01-12 09:02:00.973	2024-03-28 15:42:35.922	b4a5a3ac-ccca-4522-8f9e-27fa1faeb37f	Old Imperial	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
7050c210-f1cf-4b26-819c-89dbce83f956	2024-01-12 09:01:54.738	2024-03-28 15:42:35.922	b4a5a3ac-ccca-4522-8f9e-27fa1faeb37f	Imperial	f	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
5d783765-c735-4b3b-80e3-787b52b49ff2	2024-03-06 21:28:56.906	2024-03-28 15:42:35.922	cc93b9b9-56f6-4cc9-b8f0-9e6df8604afc	Sarthian (South)	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
3d4b00e9-c35d-416d-98b1-78a79ef21e40	2023-11-13 07:31:42.287	2024-03-28 15:42:35.922	07490b86-d82d-449f-bfc2-8154bcf3c560	Inquisition	f	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
de06bae2-5397-4603-8b67-6b660efd094f	2024-03-06 21:29:18.533	2024-03-28 15:42:35.922	cc93b9b9-56f6-4cc9-b8f0-9e6df8604afc	Sarthian (North)	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
b89c3ff8-9170-4dc8-b80a-7b9fa69b333b	2024-03-06 21:33:28.141	2024-03-28 15:42:35.922	cc93b9b9-56f6-4cc9-b8f0-9e6df8604afc	Majoretten	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
78e4174a-d8e7-4d2d-baa6-03115d8f8d91	2024-01-16 21:06:20.243	2024-03-28 15:42:35.922	07490b86-d82d-449f-bfc2-8154bcf3c560	The Imperial Senate	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
0b217ff3-d94f-405e-ae4a-2b7a2c6cc7bd	2024-01-17 07:41:21.037	2024-03-28 15:42:35.922	452867c0-ba7e-42ce-a8c7-0a01103e819e	Hydra plant	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
22f2ea97-1863-47e8-859e-ef9dfe54b199	2024-01-17 07:42:02.287	2024-03-28 15:42:35.922	452867c0-ba7e-42ce-a8c7-0a01103e819e	Pulian berry	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
d3d44c5e-9e80-4a01-9f36-cbcabd50bec6	2024-02-12 14:56:41.894	2024-03-28 15:42:35.922	30091ef1-6bf6-4215-b256-57622fe7c645	House Arryn	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
066c7b8f-76bd-44dd-900e-be09a7891196	2024-02-12 14:49:28.356	2024-03-28 15:42:35.922	30091ef1-6bf6-4215-b256-57622fe7c645	House Lannister	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
956534d8-d111-44c5-a793-68e78a0c4af7	2024-02-13 07:28:00.383	2024-03-28 15:42:35.922	30091ef1-6bf6-4215-b256-57622fe7c645	House Martell	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
36bae4e6-7aa3-4375-b1fe-637e2bb83cb2	2024-02-10 10:39:06.834	2024-03-28 15:42:35.922	30091ef1-6bf6-4215-b256-57622fe7c645	House Stark	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
7b0ac83d-15d1-4a49-ad76-dcf172753a10	2024-02-13 07:19:29.351	2024-03-28 15:42:35.922	30091ef1-6bf6-4215-b256-57622fe7c645	House Tyrell	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
e4549663-03a4-4fc8-ac4e-9da36b9b5c11	2024-02-13 08:17:56.915	2024-03-28 15:42:35.922	30091ef1-6bf6-4215-b256-57622fe7c645	House Tully	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
485a5879-3bfe-40f5-b1f8-51d3958ca4f7	2024-02-13 09:03:18.394	2024-03-28 15:42:35.922	30091ef1-6bf6-4215-b256-57622fe7c645	House Targaryen	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
e8901f1d-9435-4c8f-b2d7-278b5e5c7f7d	2024-02-13 07:50:15.514	2024-03-28 15:42:35.922	30091ef1-6bf6-4215-b256-57622fe7c645	House Baratheon	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
033e4b64-ee3c-4f45-b4fc-b28e7a0aa5df	2024-02-23 12:00:35.01	2024-03-28 15:42:35.922	cc93b9b9-56f6-4cc9-b8f0-9e6df8604afc	Naar elf	t	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
d56448de-874f-4173-9533-1c81b3b811c1	2024-02-24 21:26:46.849	2024-03-28 15:42:35.922	b4a5a3ac-ccca-4522-8f9e-27fa1faeb37f	Naarsung	t	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
bd2471a2-8a0d-4437-9814-f83e25a7137a	2024-03-03 11:47:13.708	2024-03-28 15:42:35.922	0e7b37e1-97d9-497f-b4e5-8b0aed78c6ce	Carters	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
7f9f1633-71af-4fba-8c81-81c628f30c21	2024-04-05 18:28:18.609	2024-04-05 18:28:18.609	b4a5a3ac-ccca-4522-8f9e-27fa1faeb37f	Infernal	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
67249904-7f29-489d-b61c-df3f57a67acf	2024-04-05 18:28:34.62	2024-04-05 18:28:34.62	b4a5a3ac-ccca-4522-8f9e-27fa1faeb37f	Celestial	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
ebdaafa6-5f70-4bed-aca3-62d0f0aca6cc	2024-04-05 18:34:21.513	2024-04-05 18:35:16.843	d3579cde-a472-4869-acaa-77949885744b	Rykeford's Curse	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
597c9659-8151-459c-a1f7-e35060407fee	2024-04-05 18:36:20.329	2024-04-05 18:36:20.329	d3579cde-a472-4869-acaa-77949885744b	Eskalad	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
79dcda36-292f-4b6b-b555-0d0c760d0360	2024-04-05 18:36:37.159	2024-04-05 18:36:37.159	d3579cde-a472-4869-acaa-77949885744b	Fury	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
f56e9300-9e36-479f-b001-8a475edc29a3	2024-04-05 18:36:42.413	2024-04-05 18:36:42.413	d3579cde-a472-4869-acaa-77949885744b	Esfahil	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
66fb4390-0fc2-4dce-8840-e744171f1d7d	2024-04-05 18:36:49.267	2024-04-05 18:36:49.267	d3579cde-a472-4869-acaa-77949885744b	Reaver's Edge	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
93f9860e-9875-488f-8df7-e297746c78a0	2024-04-05 18:36:56.629	2024-04-05 18:36:56.629	d3579cde-a472-4869-acaa-77949885744b	Helena's Ire	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
946c2993-6893-4e04-abe2-7dad0f115eb8	2024-04-05 18:42:29.269	2024-04-05 18:42:29.269	d3579cde-a472-4869-acaa-77949885744b	Greta's Tooth	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
f886d899-a0ac-4b90-8ec2-9daa08d46926	2024-04-05 18:42:34.629	2024-04-05 18:42:34.629	d3579cde-a472-4869-acaa-77949885744b	Gautcha	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
3400134a-1d11-410b-9e1d-c9c7dd31c7bd	2024-04-05 18:42:40.299	2024-04-05 18:42:40.299	d3579cde-a472-4869-acaa-77949885744b	Orienna	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
4cde42c9-11da-4134-9c96-776d777e818b	2024-04-05 18:45:32.284	2024-04-05 18:45:32.284	d3579cde-a472-4869-acaa-77949885744b	Offenbach's Blade	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
e82fb25c-3677-4188-a2c6-c9100edbbe51	2024-04-05 18:44:35.396	2024-04-05 18:58:46.469	d3579cde-a472-4869-acaa-77949885744b	Boiling Blood	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
485359ba-643a-40f2-bb7d-cde04dd1b19f	2024-04-08 11:25:38.389	2024-05-02 09:11:12.191	44598285-2999-4846-a6e3-1c746ed886ab	Exiled Lord	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
39cfee77-7c80-4361-b8bf-2b2cfa26272d	2024-04-05 18:42:19.202	2024-04-05 18:59:25.046	d3579cde-a472-4869-acaa-77949885744b	Norendil	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
8056e39e-be0b-4bd9-bf16-324dabfba71d	2024-04-05 19:01:48.621	2024-04-05 19:01:48.621	44598285-2999-4846-a6e3-1c746ed886ab	Archdevil's Bane	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
122de938-df41-4d57-ae24-1cb87b7c29f5	2024-04-05 19:02:57.621	2024-05-02 10:46:06.95	618ab39e-1dc9-4612-a4ba-7679064018bc	Pheagon Empire	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
140b7862-d550-47fd-a7bc-5c26a17f0d30	2024-04-05 19:02:23.463	2024-04-05 19:04:09.91	44598285-2999-4846-a6e3-1c746ed886ab	Pride of Atris	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
faf276f4-f7d8-4e9e-8994-bae9d2922f8d	2024-04-05 19:04:32.181	2024-04-05 19:04:32.181	44598285-2999-4846-a6e3-1c746ed886ab	Sovereign's Blade	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
b9cb6274-c52b-4044-ba3b-00f10bcc9d7c	2024-04-15 08:22:21.465	2024-04-15 08:22:21.465	b4405bec-f165-461b-9ba1-0ebfd9121b13	Ghost leaf	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
39eeee12-df28-40a7-918c-c0b6cb423ad1	2024-04-15 08:25:01.805	2024-04-15 08:25:01.805	b4405bec-f165-461b-9ba1-0ebfd9121b13	Fire leaf	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
cf7a34a4-6282-4fc1-a59e-6dda8aedcd96	2024-04-15 08:23:00.626	2024-04-15 08:25:11.156	0e424e1c-896c-4831-b50e-2f6671c382ae	Enchanted Essences Emporium	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
0ab3d98c-c460-4981-a24b-d687cf33fe84	2024-04-15 08:18:58.397	2024-04-17 07:20:41.033	95f8881b-9517-419e-9cc3-c9d6092ef0a2	Fort Gundor	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
4c4453e5-d49f-45bf-9aeb-cd1112c69718	2024-04-26 10:13:24.349	2024-04-26 10:13:24.349	cc93b9b9-56f6-4cc9-b8f0-9e6df8604afc	High elf	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
a50b660d-3527-4fab-acac-74ca48097458	2024-04-26 10:13:41.532	2024-04-26 10:13:41.532	cc93b9b9-56f6-4cc9-b8f0-9e6df8604afc	Do'rau	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
88fd2056-61b7-4d0f-85bb-9fd2e03f66b6	2024-04-26 10:38:54.357	2024-05-02 07:23:50.841	cc93b9b9-56f6-4cc9-b8f0-9e6df8604afc	Mist elf	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
27aefc7c-0126-4a43-9ee5-417238ca48b4	2024-05-02 07:25:08.666	2024-05-02 07:25:08.666	cc93b9b9-56f6-4cc9-b8f0-9e6df8604afc	Tarnesian	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
c8c2a24b-16c5-4d7b-a5e3-abb8974543fc	2024-05-02 07:25:20.04	2024-05-02 07:25:20.04	cc93b9b9-56f6-4cc9-b8f0-9e6df8604afc	Kharsenian	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
76afbe8d-2584-4cfa-9b2a-01060784b176	2024-05-02 07:36:22.583	2024-05-02 07:36:22.583	b4a5a3ac-ccca-4522-8f9e-27fa1faeb37f	Kharsonese	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tags (id, title, color, project_id, owner_id, deleted_at) FROM stdin;
9115e202-076f-4aa3-9ef5-f7ea24f9bc81	Paragons	#eab308	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
91112450-ea37-4f99-9bb4-48e9565778aa	Naar elf	#ffffff	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
0a8c500a-736f-42af-a260-f55c9335a818	Inquisition	#000000	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
435c8c1a-8e51-4abd-bcf3-d713b98abb89	Imperial	#2e1065	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
2293781d-595a-4a2f-871e-aedc5f4b3282	Sarthian	#1d4ed8	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
1bede0be-5468-422f-a558-69670ace38dd	Xaf	#991b1b	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
92a0daec-53a9-4b95-abd4-979dc6458e12	Elvish diarchy	#facc15	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
b162a18c-5c17-485b-bf84-c923a5ae194d	Arlonian	#b91c1c	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
8979b014-d2fa-4b2e-ace9-a63744ef4b62	Pheagon sovereign	#2e1065	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
421445db-6adf-4006-9aaf-85629fc73871	High spirits	#ffffff	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
931d31b0-2a85-40df-86ba-d06bb031504e	High demons	#000000	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
1a419de4-95ce-4e4f-9d80-a25ec09c4280	Carter	#38bdf8	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
006367d7-64d8-4560-9fa8-78c962a402bf	House of Kyton	#facc15	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
a430f511-5672-4e51-b9f8-fd59d90a6eaa	House of Rodanon	#450a0a	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
62962fb0-81cf-42d8-b4ef-7d35635b7e75	House of Syris	#14532d	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
ad96f73a-92a1-44d2-b976-6f2e1bba098f	House of Anona	#06b6d4	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
e4076a67-b9f1-4c10-8812-3176af6eff9d	High elf	#facc15	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
4cc2ef17-b41a-4143-985e-5ecc7a14299d	Do'Rau	#1e1b4b	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
909ea1cc-c71c-4d40-81e2-abed37095457	Mist elves	#064e3b	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
c5a4726b-24aa-4cd9-b42c-386523f7a083	Demon	#000000	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
2e379e87-4c4f-4db6-ad55-97b208d0a874	Character	#047857	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
b63bce1f-f252-41cb-a8da-dce373223800	Pheagon dynasty	#2e1065	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
9b343da2-6772-41c2-9cef-50b3dd6aeee0	Plants	#052e16	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
8dda18a7-1b4e-4176-90bf-c0bf0651e0d7	Spirits	#ffffff	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
e655f329-0eb9-477e-aaee-cceb827895eb	Demons	#000000	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
58d34ccb-2da8-4387-b2bf-f3f256a1bee9	Archmage	#2dd4bf	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
d57ffe19-2bab-4a72-b25d-77b1a084edee	Outsiders	#374151	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
bfae5171-e779-42c5-8eb2-6a857ea99642	House Stark	#ffffff	77cb0278-b9c7-43b5-bd30-e72022eacf11	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
d6f5d87b-d051-4164-bfae-986ccd9fbb52	Great House	#fbbf24	77cb0278-b9c7-43b5-bd30-e72022eacf11	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
69a1554c-e5db-459f-bd4d-a87526063b9a	House Lannister	#b91c1c	77cb0278-b9c7-43b5-bd30-e72022eacf11	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
40c8549a-571d-4779-b04e-ac832af9fc92	House Tully	#1d4ed8	77cb0278-b9c7-43b5-bd30-e72022eacf11	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
07e98515-a7d2-4d2d-8a71-361d35ac1c0f	House Arryn	#06b6d4	77cb0278-b9c7-43b5-bd30-e72022eacf11	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
c651c3b3-7dc0-4840-97ac-b126d1a9297e	House Greyjoy	#eab308	77cb0278-b9c7-43b5-bd30-e72022eacf11	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
e3000318-21b1-46ff-9513-3d90eabefb7b	House Martell	#c2410c	77cb0278-b9c7-43b5-bd30-e72022eacf11	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
8f584ebc-882d-480f-93a1-b7cf9f91e7e9	House Tyrell	#16a34a	77cb0278-b9c7-43b5-bd30-e72022eacf11	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
857e434c-c699-4348-813b-611f8cb60502	King of the Seven Kingdoms	#374151	77cb0278-b9c7-43b5-bd30-e72022eacf11	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
57c29d99-667e-4609-a7ec-4651d345b684	Hand of the King	#fbbf24	77cb0278-b9c7-43b5-bd30-e72022eacf11	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
8ac6b34e-782c-41c2-a97c-e1c614d156da	House Baratheon	#eab308	77cb0278-b9c7-43b5-bd30-e72022eacf11	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
c5135c95-bc91-4c10-a2dc-c8f58a165d69	House Targaryen	#000000	77cb0278-b9c7-43b5-bd30-e72022eacf11	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
52692fb2-43e0-41df-af09-c4228b465bb2	Celestial body	#ffffff	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
b2e0ee0e-6966-41d5-b7ab-d2cc803e3918	Imperial officer	#581c87	eb68433a-64b2-4bf9-92a8-5625f46ad59f	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
90bac4d1-c1ce-449e-99e7-a6b0fff71b53	Count	#7e22ce	eb68433a-64b2-4bf9-92a8-5625f46ad59f	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
2a681547-302d-47b7-8f86-28edde9fc7d2	Mage	#38bdf8	eb68433a-64b2-4bf9-92a8-5625f46ad59f	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
05f67808-fb09-459f-ac82-afacb897e33e	Motus mage	#1e1b4b	eb68433a-64b2-4bf9-92a8-5625f46ad59f	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
9fcbe734-2846-4fd8-801d-4887d9b0684c	Viridian pathfinders	#84cc16	eb68433a-64b2-4bf9-92a8-5625f46ad59f	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
17ed4a5a-9d62-4a67-a919-d755f28ba177	Mage	#0284c7	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
83e4f1da-ce3a-4aef-aaf8-ae3add84ddf5	Motus magic	#000000	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
8c90c960-898a-4543-a788-5261c4e9135e	War magic	#b91c1c	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
a1e28458-ff99-4081-8327-f73c42a3d4f0	Divination magic	#fbbf24	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
124737d2-4baf-461c-9008-7c0d4ac6a58f	Field magic	#14532d	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
81411426-d407-43a6-8d77-da2bcf843343	Restoration magic	#16a34a	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
944ea7a6-b9dd-4c87-a267-2556ae7293cf	Mistbending	#2dd4bf	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
e48d7069-9afd-431d-8eba-375e16ead9f0	Necromancy	#1d4ed8	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
eb894b27-1222-402b-9fb3-ee8fb14366ab	Summoning magic	#4a044e	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
dfec923a-821b-4719-a212-347f90d99db4	Cleric	#eab308	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
b0816256-c25a-4064-a90c-a8c3484ef83a	Priest/ess	#ffffff	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
90c92df2-9995-4187-9d74-ea27d32b3051	Lunar blade	#ffffff	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
5b475e5d-1e51-4677-b308-6aa057ede61e	Red lunar blade	#b91c1c	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
9bc80aaf-ca55-40b6-8f62-b64985013c66	Blue lunar blade	#06b6d4	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
0aaf1e63-9dd0-4bb5-8a7f-b392c7e61575	Purple lunar blade	#3b0764	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
87588112-f157-42b8-ad82-b4e3fc2ccf4b	Dragon	#3f3f46	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
fb83a004-380f-47ce-9315-c939928caa3e	Red dragon	#b91c1c	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
a79be0ac-bc8f-47a4-a862-b0063fc02ec7	Blue dragon	#1e3a8a	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
bf9ce153-2383-43ac-9d76-66dd0750d961	Green dragon	#3f6212	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
cdaec0dd-8a78-4226-8882-af68d9c61fe6	White dragon	#ffffff	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
8fcce26c-41f6-49fe-a8d2-2dc67615c2bb	Purple dragon	#2e1065	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
3d14ee92-152e-48cd-a109-4b981385b1c3	Gold dragon	#f59e0b	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
3b44e5c4-916f-415f-90cf-d557eed3d571	Brass dragon	#854d0e	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
0c67f806-ea66-4f10-8d60-04b1227d42ad	Bronze dragon	#a16207	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
ab1afbb2-9c74-4b3a-9e15-7d03c4b31cef	Silver dragon	#595959	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
0d3df4a0-b20f-4137-87be-492b7b5027c4	Copper dragon	#ea580c	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
dc32bd95-9008-49da-a737-0ebcca59e5a0	Black dragon	#000000	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
0218e767-88fe-48d8-9057-3f87b7549a2e	Pheagon Empire	#2e1065	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
e166b701-6972-400e-99bb-7e92ef923fda	Tarnet	#166534	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
e62aa20e-eb7e-424f-ac3c-fd1dc2828dd1	Kharsen	#c2410c	43e1c879-415b-4394-95ad-f9a4c42a43c5	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
\.


--
-- Data for Name: _blueprint_instancesTotags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_blueprint_instancesTotags" ("A", "B") FROM stdin;
\.


--
-- Data for Name: calendars; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.calendars (id, created_at, updated_at, title, project_id, parent_id, icon, is_folder, is_public, hours, minutes, days, starts_on_day, owner_id, deleted_at) FROM stdin;
4e26a73d-46ef-467d-80f5-5d8f7374c491	2024-01-21 20:36:33.924	2024-03-28 15:42:35.922	Imperial calendar	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	game-icons:eagle-emblem	\N	\N	24	60	{Erstdei,Sendei,Dritdei,Ferdei,Midwor,Yuldei,Trillar,Randei,Vorletz,Letzwor}	0	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
\.


--
-- Data for Name: _calendarsTotags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_calendarsTotags" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _calendarsTotimelines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_calendarsTotimelines" ("A", "B") FROM stdin;
\.


--
-- Data for Name: character_fields_templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.character_fields_templates (id, title, project_id, sort, owner_id, deleted_at) FROM stdin;
f63e41f7-71cf-4d5c-8c1b-1124b18f1faa	Paragon	43e1c879-415b-4394-95ad-f9a4c42a43c5	0	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
08721a0e-b39e-4aec-8906-3860dbf11422	Pheagon Sovereign	43e1c879-415b-4394-95ad-f9a4c42a43c5	0	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
770eacc4-ae00-4672-a651-9ac8c0ebea4b	Great House	77cb0278-b9c7-43b5-bd30-e72022eacf11	0	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
7f961c9b-10a6-4035-952f-588f7e74aa18	Biography	43e1c879-415b-4394-95ad-f9a4c42a43c5	0	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
e2075df9-d892-4939-9ed9-a820b4c8c3a7	Inquisitor	43e1c879-415b-4394-95ad-f9a4c42a43c5	0	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
\.


--
-- Data for Name: _character_fields_templatesTotags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_character_fields_templatesTotags" ("A", "B") FROM stdin;
f63e41f7-71cf-4d5c-8c1b-1124b18f1faa	9115e202-076f-4aa3-9ef5-f7ea24f9bc81
08721a0e-b39e-4aec-8906-3860dbf11422	8979b014-d2fa-4b2e-ace9-a63744ef4b62
7f961c9b-10a6-4035-952f-588f7e74aa18	2e379e87-4c4f-4db6-ad55-97b208d0a874
770eacc4-ae00-4672-a651-9ac8c0ebea4b	bfae5171-e779-42c5-8eb2-6a857ea99642
770eacc4-ae00-4672-a651-9ac8c0ebea4b	69a1554c-e5db-459f-bd4d-a87526063b9a
770eacc4-ae00-4672-a651-9ac8c0ebea4b	8ac6b34e-782c-41c2-a97c-e1c614d156da
770eacc4-ae00-4672-a651-9ac8c0ebea4b	07e98515-a7d2-4d2d-8a71-361d35ac1c0f
770eacc4-ae00-4672-a651-9ac8c0ebea4b	8f584ebc-882d-480f-93a1-b7cf9f91e7e9
770eacc4-ae00-4672-a651-9ac8c0ebea4b	40c8549a-571d-4779-b04e-ac832af9fc92
770eacc4-ae00-4672-a651-9ac8c0ebea4b	e3000318-21b1-46ff-9513-3d90eabefb7b
770eacc4-ae00-4672-a651-9ac8c0ebea4b	c5135c95-bc91-4c10-a2dc-c8f58a165d69
e2075df9-d892-4939-9ed9-a820b4c8c3a7	0a8c500a-736f-42af-a260-f55c9335a818
\.


--
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.images (id, title, project_id, project_image_id, character_id, type, is_public, owner_id) FROM stdin;
c413a3f2-bc17-4ae2-a27c-7a70c96d7cf5	Layla Cliffheart.webp	eb68433a-64b2-4bf9-92a8-5625f46ad59f	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
99b53bca-96bf-4bd6-9e57-a6f9d726d266	Keira Night.webp	eb68433a-64b2-4bf9-92a8-5625f46ad59f	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
b3086406-9576-47e1-80d3-f6116a920ee6	Segomo.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
1bc85f54-00a1-43d1-9977-415a0da54f44	Countess Kyra Macris.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
af73726a-d1d5-4454-a9df-aad1ce04c0bd	Tosorith.jpg	eb68433a-64b2-4bf9-92a8-5625f46ad59f	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
376ccd27-2d28-47d2-aee6-be97ecf62892	Badax_portrait.png	eb68433a-64b2-4bf9-92a8-5625f46ad59f	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
9fe61186-f363-400c-8328-f5fc83906b0c	Apollo.png	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
15db40af-fd5c-498a-8a4c-766dfc574fe8	Viscount Servus.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
a7b60fd6-6955-4d28-8e1f-bb57194a605b	The Runemaker.png	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
da10c571-337d-47f0-a468-66c16ffa55cf	Vorth.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
e0b88373-7b1a-4ff9-bfe8-5159ae020c7f	Thalia.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
4b89c7b1-2f1e-4e43-843a-238d01e306c2	Joann.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
14b97d61-c9a4-45d8-8f64-33d0f7459541	Lierin.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
585e2813-85e1-4470-b888-3ee83c2b9100	Pentius.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
4c552934-0bdf-4aab-a5b4-bc6149ef608e	Zeke Graff.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
34b8a45b-80b3-4d6a-8c7c-4a9f8ba2a286	Quirina Viari.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
9ae4bb0c-eb15-4457-ae3f-2eb944000d3b	Isabel Baxter.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
635aea48-a4f1-49b5-b4a3-ce7fdbd71400	Winona Mograine.jpeg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
da6d0b65-c676-478a-81e8-be56849b446f	Anylyth.png	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	t	00fb25f1-2f47-40e3-bcaf-35d303c10207
4637abc1-8cce-465d-9736-3d3bc5ff550b	TheShatteredKing.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
d704949e-aa6b-4822-9f00-30a66a0b91c4	Minoru_Hinata_1	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
fbf86383-434c-40c5-a4e6-cb5013a1aaa3	Minoru_Hinata_2	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
11af3d99-9a1e-4436-b4f0-c641bd0ba979	Uri5	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
655d7d26-8a03-488e-ad6e-2f1639db16f2	UriProfile	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
94359479-a682-40ec-8b8b-7d65dacf4c2e	Aurelian.jpeg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
fd2f576c-ea4d-4e1d-95d1-7cb778992a56	Yaris III.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
6fc6b2d7-83f9-4906-a599-96469b1e763f	Kyton IV.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
a775a0dd-cd00-475a-b767-07edc5031bbe	Orid IV.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
b6ecbe73-7f4e-4ac5-8797-54b01bdb0385	Banis VI.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
89178a32-ad8f-4e11-a046-d0a680b951b6	LuciusPheagon	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
a16bd9dd-c6c0-4aba-bee2-a32719e6681b	Ref1	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
e85988b6-56f1-4482-bfc5-cef7941cd710	Matthew_Carter_Portrait	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
1038a46c-c8c9-4396-bf3b-ddad84d7b45e	Alaric Sarthis.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
baaeb8fc-b816-4170-923c-a791b9ffbcc3	aldem_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
14f13bc5-8dd2-43e3-a9af-4385e75f70ff	Alexius Rodanon, the Golden.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
c1d66be3-c5c4-4d9e-aa1e-113d2eef4552	Andra I.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
232f0393-9a80-4dac-b0e2-2f7bac7e5d95	Andra III.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
a296beb0-814c-4586-a3b0-11d9d0d1ceae	Anona I.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
d3f6770e-049b-4030-92dd-e6f8d4cbdb8c	Anona II.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
a14ab673-6a01-48e4-9336-804c1d0f5128	Armand Kyton.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
ba9ae1d6-e226-4138-94c0-bf885a199415	athran_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
24e855f5-6bc2-4e18-bb4f-4dfbbfce2f90	Aton.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
3958bb9a-5456-4338-b3e1-2d70f363ce5d	atris_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
467b5988-de6c-4f51-8dcf-b20aa4971675	August-Marais.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
5a105763-2ba7-4602-a902-327c06ac6a23	BBEG.jpeg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
5e19b5b6-5f39-4699-bf9b-5b1d8adf0115	Avek Pheagon.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
d737ee1b-4282-43a1-8e86-e9ef960279a9	Banis I.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
a999aff2-0836-42cc-83fb-535be8257ae0	Banis II.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
9eafdc5d-fbba-427e-8c2e-49df0276d7dd	Banis III.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
1fece120-7f7e-4ae1-95cd-eaffe1ba9567	Banis IV.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
e8bfe8b7-0d39-46aa-b455-e01a52ab8181	Banis V.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
4453c7aa-9f63-4375-8399-e6099a265905	banves_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
547ea2c8-8375-4e80-9a4f-b7acd0346ecd	belador_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
86488f80-bdf1-45ad-9b52-eb73ff390cc4	buron_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
19631689-8788-4f65-b683-57f4efc84d27	capital_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
126057a0-0b3d-4952-a343-d462c818d08d	carter_flag.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
febb9182-bba8-488d-b5b6-c3b813aa2913	Cecilia.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
b9014e29-3c36-4913-a913-af4f9c85a998	Cedric I Kyton, the Magnificent.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
7f105f9a-bd28-440f-ab13-635db6a13b16	Celine Kyton.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
a1e873ef-2569-41b8-88e5-2ece07f43f51	Ceridan Pheagon.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
82a301e1-0e56-47c4-8351-ae7e78b2f25e	cerynal_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
fc67ec79-dd51-4f65-9c31-4e7c0a6d4df3	charent_flag.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
cde6e777-6fd5-4fc7-88ae-dbfb18825f42	crystalline_luminara.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
e5f88813-052c-47d8-974f-613e9aa0d502	dardoth_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
e99ba6f2-8ae8-4359-9264-949e1a4f96ca	draos_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
4bf4a1d7-026a-4182-8e93-bc5e79d73e68	earthimg.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
462d6cdb-7490-4743-a2c7-a28b16fa2c54	Edward I Rodanon.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
4dfed31d-5c1f-4b71-9d1a-4516b9ea0dac	eldvor_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
1a957b4b-2c92-4f80-988f-b3c48cc7bfcc	Elirah I.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
b9157766-bda5-43b9-be7a-e4d19b7e7424	Elirah II.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
ec8ce0e6-e8da-423e-ac51-f7cedd61c648	Elrad I.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
b2a67bdb-1080-4f44-a3a7-8cde4a4bf2e4	elven_diarchy_flag.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
3b715173-31a0-4890-8ad6-4f8b6e1e6414	Elys.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
2c7295f2-b46d-4eb4-94fe-52d6b68315e8	Emilia Kyton.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
b55ac5d4-106f-4a17-88c7-9fe2d6c75bae	Enthiro.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
63307f86-5834-4030-b057-54c4fa313842	ferhu_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
386f1936-b272-4fb6-afb0-fa137b835e76	flag.png	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
7cadcae3-3365-491f-b329-6a357df81324	Francis.jpeg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
87a80213-8fe1-4562-bbdf-0734d9f89d0e	Gan I.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
7721bf52-17a7-4d6d-bb25-cc40d0329dd8	Gan II.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
7badcd47-3464-4e0d-8f12-e71ae07422cc	golden_horizon_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
bf4723a8-81fc-4ded-b0e2-cc603646ec9b	golden_wisteria.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
4236ced1-b2b7-446c-8165-a68c1a73357e	UriRef4	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
1627dceb-beca-4bda-b164-4ce3952099c0	Aldeem Pheagon	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
624a3a6a-a948-45ae-bce8-b21d3a0c35ba	Gwenael Gauthier.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
d626dbed-39b8-44c2-9257-fb2c66ad69db	hinor_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
9dbf1ff3-d1bb-436d-8fec-9f87b74ceb90	Hugo Windslich.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
d20440cd-6822-4d3a-8462-db260103cb22	idatha_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
9ac13ba2-05e3-448c-a60c-8db30b92d323	iminn_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
a41d1673-aeae-4ac6-80b1-7e1919524e4b	Inquisitor_background.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
a26ab63f-5ce4-41bf-8bd2-cb151fa5e9df	ivory knights.png	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
a55114f5-3452-42a9-94d6-e017d7b954fe	James I Rodanon.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
c839aad4-db2c-4561-bef6-a2027efe0fb3	Jamila the Fair.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
d1a5308b-a9cc-4451-9f54-09e4e25964a2	juliettecomtois.png	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
cd0ac208-e4d5-4e73-924c-ebad59486395	kaernthen_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
fe8b59fd-d53d-4a37-8540-83e6c3e44994	kalem_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
4d23a735-73c7-416d-a2fe-c593b632b3d8	kineen_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
3c43b983-2cca-4462-a3ba-d0cf2fa85218	Kyton I.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
f9a6f9c4-7488-4f79-a4f5-81008e2f29b8	Kyton II.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
9b653bdc-ed7b-4518-8063-089b40e10467	Kyton III.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
ebfff8ed-de5d-44ff-ba12-4fd543dbe2bc	Lerima I.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
0ee91c23-b1d6-4794-87c9-ead02dd887ca	Lerima II.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
681f05b3-3720-4c1b-b807-a34c14920221	Logo.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
fa0b447b-89cc-4a84-adb8-c8d3254ea654	Lutia I.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
a5750b1d-95ff-45fb-9951-d1259212b1e5	Lutia II.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
ee0488c3-8034-4f9c-b420-6bb932c69a75	Lutia III.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
13ef28c4-7a9f-42d5-bece-ad42de52c2dd	majorette_flag.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
47ac18ab-2b31-4713-93f0-8f4cbc532bc3	Marcel.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
4f1c3fa8-8a7b-476e-a358-ed12f22d87ee	Maxim Marais.jpeg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
05c6bc94-d7fd-4077-952d-3b03f3b71542	Morin-Dale.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
f0a6637e-2925-431e-914d-d5cc6a5f71bd	Naltor II.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
93998d5c-d7b7-48d3-9042-e466b6923a07	Narik.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
2a77a381-9e2a-491d-892c-780dde27d184	Nathaniel Kyton.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
71df79f2-8a8c-4342-95e8-b9697ee383fc	Niya I.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
2404d3ed-d7ca-4688-a402-08414dfeed03	Niya II.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
b8c11829-987f-4ab5-b7b7-1d7d71e61e85	Niya III.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
33486499-54c7-4ba9-aa2f-35a85e773186	Niya IV.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
a785e717-94de-4894-a79a-882053cd40f6	nytia_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
4cb6768c-be1c-4431-a2ef-65e482f4a994	Old Haven.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
ed866f9e-9d2a-4917-9c65-a22d27ae7c98	onys_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
54a7e7bd-246b-441f-a39b-bfdedd838d4d	Oradro Kyton.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
f9314a15-95bc-4337-899b-c5bddd8f8db8	Orid I.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
acd41597-1f1a-4db4-99b6-ac66213e8635	Orid II.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
5c1398ee-3160-42dd-bcd8-e2043273e42a	Orid III.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
909ee492-950c-43ad-84ab-3523f2b55fae	orskel_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
eeb0d791-ce91-4cb1-87b7-946edc66cda8	Paus I.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
ccfca6ea-a51f-43bb-8d26-a3a29d792d23	Paus II.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
7d1b059d-6301-414e-9f94-06191cfed228	Paus III.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
e5ae2f28-9f3f-474f-808b-3757f2df28e6	Pheagon Flag.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
e35d6993-f3a1-4767-b3c4-bb9aa7807cdc	phymon_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
6c1b1466-15c6-4c9f-9ede-09f4ed91f228	quathor_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
5a83fb9f-f97b-4e7c-a0a6-8041c7d03c39	Quimus Pheagon.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
65d83c56-a452-4062-bca9-dba4b6eb8284	Radekai.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
ea6ea809-f3c9-4d21-9558-011dd3593aae	rakton_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
a1257cb6-388f-44f0-b564-419d23d60c46	red_wisteria.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
da14211f-beff-4673-9224-573b9df95981	Rhevor.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
6683f40c-782c-4a18-b520-a6889d0a5d20	Rhys I Rodanon, the Mage.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
b017fdb8-f886-4d4c-ac4f-c4bbf9b6afbe	Riordan Kyton.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
7f849e5c-d642-4e6a-8f2c-e480dad02e65	Robert I Rodanon.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
011f0e99-8c1d-407a-9060-9c3f7f156540	Rodanon I Pheagon.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
0e1c7856-dd58-4aee-8ed4-7a74f689ecf0	Rodanon I Rodanon, the Strong.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
155faccb-b88a-4a9c-9aaa-c60354ceee76	Rodanon II.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
dd3f46b9-a636-4f3a-af19-364309563602	Rodanon III.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
9ca9daa1-5c38-40fe-a5ca-f8e0c79c42c0	Rodanon IV.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
17cc960a-3956-4a34-b91b-a1f023087723	rothania_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
1d79c292-c34f-46db-9651-673eb771b5bf	rothden_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
ce9a0bfc-f1cb-4166-90fe-2daf70f77a08	rothrom_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
ead544ed-0af4-4309-b95c-403fb306071f	Salaraan provinces.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
2e9e3866-6257-4d21-a538-df3e310b5664	Sarth Flag.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
345f6d3a-e358-4958-9242-c9cfa556a9ab	Sebastien Marais.jpeg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
f80bee82-92c3-4d78-b06a-29d334ad8b24	Sen Pheagon.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
f5776816-70c5-4f5e-a6e9-da7fe6896688	SennPheagon.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
fe9c6609-b0a0-465c-b7d6-b66fbb4a2aa5	sirat_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
56e321a5-e28d-4137-bd45-e96c5ded2ff8	spider_plant.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
0293a163-6a76-4487-b6b9-40f8800a5af5	Swamp1.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
e8579f2a-2d4b-46be-9dcf-d7b5ba459596	Swamp2.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
8e7d1f88-6bc4-4b16-af82-11971eaef88a	Syris I.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
430a411a-d286-46d4-a527-ac5f16d8d2af	Syris II.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
fa272775-c253-43c2-a883-7bb876ece27a	Syris III.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
b4a3dffa-d176-4af8-bd68-5c7697da757c	Syris IV.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
51f5d26c-904e-4fe3-b7e8-a8eb15c1d5e7	tarnet_flag.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
ef85d32d-6fd2-43e9-a033-3ceeac6af073	The carters.png	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
d940929c-e935-4a85-90aa-3675060668bc	The Karrowac.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
8402a451-8f74-4f65-8dd3-e5335069bc28	The Pheagon.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
c627ac01-4f5f-4fdf-b5fe-fa067b2b23f1	Theo Devereux.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
e5008aeb-4930-4a90-bfd6-08e2c6a8ab58	Theros.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
f857a089-8775-45b8-9020-a7096b300903	Timothee Marais.jpeg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
331d9737-fb7c-4a59-b3c6-52b31e07a41d	Titus Kyton, the Banished.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
2b74fc84-fb6c-4e06-b21d-1c62b55b3fa5	toret_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
5d70f02a-809d-4ff4-b7af-43f847875d38	Treno.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
d9e54dd5-4135-4377-9261-8d4ae2a9659b	Trezar.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
84150fac-2a31-44d5-833d-03d68587bdbd	Trilia I.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
365a1b0c-3d0a-419c-b696-9e0cd141b032	Trilia II.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
a1b34793-6d9c-4bc8-8289-c011406df499	Turis I.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
ea627cf9-eab4-46d6-b6aa-a09ad5d65cdd	Turis II.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
03e2ac4e-b629-4b9b-9cb6-5bd3b085d29e	Turis III.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
4b5367c0-9925-47ea-8817-48cd9651f12b	tynura_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
5b91dbb1-d04d-4a5a-8a5a-ccde5474f7f6	uleri_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
f46452e5-5121-41bc-8a54-ebcfe5c55a83	Umdara.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
008c9ed5-80fd-4751-ba32-3d9e923a0200	urdan_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
8a3af7fc-1e99-4643-8c3d-b19538776cd2	ustmor_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
5c1b5af9-478e-45cf-9bb3-bc18fcc4ad4c	versam_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
cdca9f79-50c5-48d3-bbbb-bc8b7f8b177e	Vesris Pheagon.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
f0880d29-4197-4c61-bef8-a74593217797	Vivienne.jpeg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
724a7038-64a0-49b3-a9c8-2e94ac105533	Waridan Pheagon.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
a3dc932b-ef38-4598-95d6-3c412603e128	wartia_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
fd8a1516-8e9a-4463-81c2-b7ba9eca9b07	welham_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
ebe366d7-7a2b-4c40-810e-880aef966743	white_wisteria.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
b9c81493-2a5d-40e1-9f01-2f420bbac8b3	woress_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
cd515f70-d3c4-4219-8a7c-ec07e29ab923	xaf_flag.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
b32f468f-0eab-4dd3-b802-3b77cdb70088	xulan_emblem.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
57743987-252f-4eee-a353-fa894918c910	Yaris I.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
0c275b4a-83cc-4408-a310-0ba2c786227a	Yaris II.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
4dd0f375-756a-4441-92ac-56da69f56a02	Yeraso.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
defc4859-f824-4937-a82b-9bb15554928d	Yvette.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
150bb843-55a1-4644-a29c-0ada5b99ae2b	Vesris Pheagon (adult)	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
ef12d3bf-59b0-4847-a67f-b19b701204bd	Delilah.jpeg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
e1a7eda4-fb96-45e9-9db5-6c09d1258b9c	SalaKeeperMap.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	map_images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
700ac562-6206-4a81-9e30-be2835346c02	CopperDragon.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
c8f6abc9-fe84-404f-bfe3-d7160b5d8869	Duty-3.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
4a935355-3c4e-4294-a2df-8e15a4773cfc	Sincerity.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
e2ad5cea-7405-45d9-8f8d-dc82a0b06690	Knowledge.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
30f039e8-9e05-4f71-8f04-14177fe8d2c7	Bravery.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
6678486d-c1b6-4d06-9d19-bfa564fff165	Sethikiel	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
22cdad74-e9e4-43f3-ade9-7d13a281103a	Obraxas.gif	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
bc381b3c-5a82-4426-9906-ea86f45bd505	pulian_berry.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
4358cc56-c95f-4acc-a170-8e357459caa7	spider_plant.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
f655c9c8-b39d-475a-94cd-b1b092523064	hydra_plant.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
856dd74b-80f7-4177-a04e-c9449d1083c9	al.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
af311dc0-b52d-4b5d-9a2a-48391d2a6233	UriStylized2	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
d3665498-3ede-4588-9c15-a951af597faf	OakFather.jpeg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
10366868-c711-478c-8fc2-98e7b38e1b8e	Ashara	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
5e5b0dae-a011-4031-9eb8-44ea3cb6c0a3	UriStylized	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
740f5d25-5945-4c30-81a5-09141b07826f	MatthewSurprised.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
ed280fdd-3bd4-4d77-ac25-57541bfe4fda	UriRef3	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	t	00fb25f1-2f47-40e3-bcaf-35d303c10207
1d7d9f3a-1da6-4abb-99c4-2823d7084fc6	UriRef10	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	t	00fb25f1-2f47-40e3-bcaf-35d303c10207
4fd466d7-fb9f-489c-97b4-af4dfd78593e	UriRef4	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
08ad3aa7-9855-4ae6-9d01-3a771d9734a1	UriRef5	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
79ee16a5-ea78-4a82-8c23-a02834604b6c	Rhaegar_Targaryen.jpg	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
51cc3e1e-31f2-49e2-a2a7-fe289cfa565c	UriRef7	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
ad4e0e64-9780-4499-ad5e-c6fa11259d58	UriRef8	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
c550520f-4dbd-4a2a-a5d7-a45ec838ae5c	UriRef9	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
e2a61a66-c323-4c68-a6d9-56e7ef1110f3	altered.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
67ebf24c-701f-4c3f-9017-9ce995e0790a	MattRefBuff	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
fc87c592-9517-4179-a22a-c06375508b4a	MatthewAlt	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
fa2fbab7-4d4f-4e7a-88a6-093aa0a49a7f	MattAlt2	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
f5081561-191f-42f5-ba70-0ffb859121af	MattAlt4	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
e06f92e1-cb04-4370-854c-17f4d5732277	Robin.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
3d74d5b5-ce3b-4898-a4b8-c1c69474b6f9	The Entombed One.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
90f9188f-a171-439c-b991-a23d82d9276b	LutzSchafer.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
59650b8d-6fe8-42c1-872e-c7fdc1bc46a1	ShadeActress.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
9d3d73ff-d46e-4de9-a93a-4471435647c7	ShadeProfile.webp	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
ac4fed8d-fedd-4503-93b3-3ae33912d52d	Lighthouse.jfif	dcd1d7c5-4096-47bf-8214-337e5a596306	\N	\N	images	\N	5d89de13-a71e-409e-8817-10763812e82d
9e6c6677-7501-4284-9088-48212daf728d	Eddard.webp	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
949de602-21a8-4a66-a269-85d3b215ea8e	Robb.webp	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
c1d47e17-3aca-4b63-af01-feb292e4994c	Catelyn.webp	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
b3f02034-9454-4086-a5fb-611e02032cf3	Bran.jpeg	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
22d32dcd-7d0b-409c-97d0-656cb3808d5b	Tywin.webp	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
a30ae867-dcdf-4db1-b74b-dcd9eb62cc3f	Cersei.jpg	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
7cefd70f-e913-4448-8cba-a73ecbd9b9d5	Jon Snow.png	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
46293e00-a26e-4fdf-bfc5-fa83f2bf1945	Rickon.webp	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
37a3cb63-4f65-407b-b88f-f7a30343d190	Arya.webp	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
dab7bbc0-18c1-4162-b608-e8750367bba2	Sansa.webp	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
99a557d7-8ca9-4d90-a811-e5786504efa3	Jamie.webp	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
807eb29c-9245-494c-bf9c-1959371a19df	Tyrion.webp	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
2cb5e90c-fd8c-4299-9eb3-f3b6faba13ce	Joanna.webp	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
5298e789-4a93-45a5-80f6-76b7ab5204cf	Hoster.jpg	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
07491746-4ae6-451f-8f68-ad5a733291db	Brynden.webp	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
006dcc53-0c6e-4226-b870-8c2987fe5e90	Lysa.webp	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
e99ca9f1-7840-4450-9ea0-4170e8fc0f22	Edmure.webp	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
83b31112-753b-4315-85dd-dc7ae2704444	Robin Arryn.webp	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
b6e98648-cecc-4cbe-84e4-debe6d2fc780	Jon Arryn.webp	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
4c4dc7f3-2956-4123-bc28-cbbb417d66b2	Robert Baratheon.webp	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
27cd8fef-fea0-4779-9324-5af0931d9b92	House Stark.webp	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
e2951f29-532a-445a-b8aa-a2b4f3fa701f	lannister_banner.webp	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
80b47bd9-fa80-4b73-9ccb-590e4615f22d	Arryn_flag.png	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
4f3556bb-7fe2-4bc5-b069-a0360e81fa36	Loras Tyrell.webp	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
68effc48-6c5b-4336-8f41-d1c356336632	Margery.jpeg	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
f79e0222-8a5d-402a-ba94-8be00c436b98	Olenna.jpeg	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
238befa3-b484-4a82-80c0-abd386a3540b	Mace.webp	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
4c5e0786-691c-420a-8297-a281e25f6a1d	TyrellEmblem.png	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
be68a0f1-378b-4471-ac77-cc51033cb4cf	Doran.webp	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
63bfa303-14f7-43b1-b683-98ac556614b2	Ellaria.jpeg	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
210b1e2e-e40d-4123-8bc3-1674dee25b8a	Oberyn.webp	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
e561b55c-33a6-4049-9765-651f01c68f7d	MartellEmblem.png	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
939a9a23-f286-46bf-b7c2-63f1dd8caec2	House Baratheon.png	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
860c9a54-183f-405f-891c-78486273d0a6	Renly.jpeg	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
a90d91eb-291b-475f-b6f0-e4c56a1a4a4d	Stannis Baratheon.webp	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
4c56758e-de44-4126-aca6-663e6ff41984	Gendry.webp	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
fc9a26e7-5361-4280-8b92-34dd35c57cdb	Joffrey Baratheon.webp	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
d910d122-ffb0-4a22-a32a-0981755f86f2	Tommen.webp	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
804c2074-5da7-4d49-aa5a-23a70471a1e1	TullyEmblem.png	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
ecf5f7d9-54f0-4ed8-9945-eebc2d4daf86	Qyburn.webp	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
641817a0-b682-43ee-8b96-9d433208d2f4	Aerys II.webp	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
88b517f4-8b17-4ec6-b07f-5a295d55903f	Daenerys.webp	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
0330649c-fb47-4944-82f5-bf6acf8628d7	Viserys.webp	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
a8d5d991-955f-4eeb-8db1-c173bf39f02b	House Targaryen.jpeg	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	images	\N	05cf043c-52f2-4f02-bcaf-37672b32510c
2bd891e2-ebb0-4565-82a3-f64d51068b9e	Torenai.jpeg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
b90bb48b-5655-4dec-b501-b25701d34d87	UriTuxRef.jpeg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
1ffb2448-0432-4b4b-bab1-ead2f8114281	Cedric Thornvale.jpeg	eb68433a-64b2-4bf9-92a8-5625f46ad59f	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
70593bd0-c426-42f1-97c1-d59bb4b72fda	Rowan Fairfax.jpeg	eb68433a-64b2-4bf9-92a8-5625f46ad59f	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
255f3b8c-b7aa-404d-bfda-529fe8ee74c4	Helen Dyre - The Dagger .jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
a9f0e185-e823-48c3-b1f8-90e81a99a7e4	Slink.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
51973eaa-2a77-42de-802d-bd6172db05e1	Sena.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
f8e4354e-968c-4158-9fa6-b6f13c30aa89	Otisior.jpg	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	images	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
\.


--
-- Data for Name: characters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.characters (id, created_at, updated_at, project_id, is_favorite, first_name, last_name, nickname, age, portrait_id, is_public, biography, owner_id, deleted_at) FROM stdin;
551597eb-86e7-406c-897e-63be470898af	2024-03-31 15:55:38.264	2024-03-31 17:41:48.142	eb68433a-64b2-4bf9-92a8-5625f46ad59f	f	Keira	Knight	\N	\N	99b53bca-96bf-4bd6-9e57-a6f9d726d266	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
4f8cc7e3-c83b-4e1a-be07-64267dac1fba	2024-04-05 17:19:06.266	2024-04-05 17:19:06.266	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Joann	\N	\N	\N	4b89c7b1-2f1e-4e43-843a-238d01e306c2	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
75cf0640-2d57-4eb5-8340-7bd816551733	2024-04-05 17:25:23.261	2024-04-05 17:35:19.601	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Exodus	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
00e5e5d0-8763-4e6a-a11a-8950811c7ed3	2024-04-11 07:29:12.043	2024-04-11 07:39:35.393	eb68433a-64b2-4bf9-92a8-5625f46ad59f	\N	Tosorith	\N	\N	\N	af73726a-d1d5-4454-a9df-aad1ce04c0bd	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
60600919-d5b5-49f8-8bb8-1cda143c7759	2023-09-30 11:19:58.318	2024-04-22 16:47:20.018	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Winona	Mograine	\N	\N	635aea48-a4f1-49b5-b4a3-ce7fdbd71400	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
4f7fe214-265c-48dd-b8d6-dbf416a28917	2023-09-30 11:19:51.971	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Kain	Mograine	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
29bc458c-feaa-4d70-b9a9-afc5cdb60ded	2024-03-31 15:57:23.415	2024-03-31 15:57:23.415	eb68433a-64b2-4bf9-92a8-5625f46ad59f	\N	Layla	Cliffheart	\N	\N	c413a3f2-bc17-4ae2-a27c-7a70c96d7cf5	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
a0cb5bd0-799c-459c-abb4-5547c31ebbfe	2023-10-07 20:30:36.392	2024-04-05 17:19:29.227	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Quirina	Viari	\N	\N	34b8a45b-80b3-4d6a-8c7c-4a9f8ba2a286	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
8c79d399-96f6-469e-9948-ad3baa8ce483	2023-09-28 10:21:57.229	2024-04-05 19:08:20.753	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Ashara	Mograine	Ash	\N	10366868-c711-478c-8fc2-98e7b38e1b8e	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
836feb12-4be9-4ef9-bfc2-04b89c82d785	2023-09-30 14:53:33.953	2024-04-22 20:06:01.244	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Robert	Pheagon	\N	\N	011f0e99-8c1d-407a-9060-9c3f7f156540	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
b62fe6c0-0e2f-46a9-85d6-8b2223ec403e	2023-09-30 16:37:21.397	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Trezar	Pheagon	the Greedy	\N	d9e54dd5-4135-4377-9261-8d4ae2a9659b	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
43855f00-564a-4d7c-873d-b4260954b14d	2023-09-30 16:47:53.443	2024-04-05 16:33:05.729	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Helena	Pheagon	\N	\N	c1d66be3-c5c4-4d9e-aa1e-113d2eef4552	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
56dd317f-acbd-4f9d-9b10-eee0637d511e	2024-04-05 17:20:01.609	2024-04-05 17:20:01.609	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Thalia	\N	\N	\N	e0b88373-7b1a-4ff9-bfe8-5159ae020c7f	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
e3ed0281-2ad7-4471-9ab2-68922b423e42	2024-04-05 18:15:45.495	2024-04-05 18:15:45.495	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Isabel	Baxter	\N	43	9ae4bb0c-eb15-4457-ae3f-2eb944000d3b	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
b0330d43-f062-4d77-b91b-280ab8356d09	2024-04-29 07:32:48.879	2024-04-29 07:32:58.097	eb68433a-64b2-4bf9-92a8-5625f46ad59f	\N	Badax	\N	\N	\N	376ccd27-2d28-47d2-aee6-be97ecf62892	\N	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Badax was pushed out of his home by some harpies and their matriarch. He has been wandering about with his two wolves ever since. This happened a few months ago.", "type": "text"}]}]}	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
a14e372a-dac3-44f9-9c3a-7e0b4419db2c	2023-09-30 18:03:08.036	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Emilia III	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
f183375b-c3ac-40a7-a72a-fee05a008267	2023-09-30 18:03:33.011	2024-04-05 16:33:32.867	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Petra	Pheagon		\N	232f0393-9a80-4dac-b0e2-2f7bac7e5d95	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
5e9a744b-2640-4db9-8651-1c27e59e8425	2024-04-05 17:20:54.252	2024-04-05 17:20:54.252	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Slink	\N	\N	\N	a9f0e185-e823-48c3-b1f8-90e81a99a7e4	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
73125719-319c-430f-88d9-5cda7dc72eb1	2024-04-05 18:35:59.672	2024-04-05 18:39:45.572	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Temris	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
a2e6e181-0843-428e-9610-14d7ac80f6e4	2023-10-01 10:36:53.101	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Cedric	Anona	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
32be8979-fe27-4c3f-9a08-8acec68b5439	2023-10-01 10:40:45.537	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Edward	Rodanon	the Uplifted	\N	462d6cdb-7490-4743-a2c7-a28b16fa2c54	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
a4863ad6-985a-46e3-aeaf-5ce290375c25	2023-10-01 10:34:41.876	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Emilia	Kyton	\N	\N	2c7295f2-b46d-4eb4-94fe-52d6b68315e8	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
65a41a03-063a-4bb8-99f9-4f1eae0d7d4a	2023-12-30 14:19:33.047	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Ulundir	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
7e3fdbe9-60a2-42b4-b11f-7cfb9df4768c	2024-04-05 17:21:40.658	2024-04-05 17:21:40.658	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Servus	\N	\N	\N	15db40af-fd5c-498a-8a4c-766dfc574fe8	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
320bb6f9-b920-4302-9e6b-584c48c9c1e1	2024-04-05 18:37:35.092	2024-04-05 18:37:35.092	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Obraxas	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
5889baaf-1c5a-4087-a4b7-24d583395413	2023-09-22 20:35:04.506	2024-04-28 09:10:21.539	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	David	Pheagon		\N	fd2f576c-ea4d-4e1d-95d1-7cb778992a56	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
5406eb64-c41f-4345-8bd0-7069eb0e6562	2024-04-05 17:16:39.662	2024-04-28 17:24:36.579	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Anylyth	\N	\N	\N	da6d0b65-c676-478a-81e8-be56849b446f	t	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
972e40bf-c301-4b1e-81be-81dc2a03ab65	2023-09-30 14:50:46.865	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Treno	Pheagon	the Bloody	\N	5d70f02a-809d-4ff4-b7af-43f847875d38	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
de4f42ba-615d-4c68-a631-4f2434779bcd	2023-09-23 10:45:05.33	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Alisha	Gates	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
be9944bd-083b-4f82-ae7f-16ce579b3a74	2023-09-30 14:50:53.187	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Indra	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
4c7062f3-c0c3-47fc-b5ed-af609bde881d	2023-09-23 11:45:42.777	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Arillia	\N	the Red Witch	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
d5cce706-aab4-4390-8f2c-9aa8135f4bf4	2023-09-30 14:52:50.297	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Perliana	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
5185926a-6761-40d6-941f-6909d2f393c0	2023-09-30 14:53:04.6	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Waridan	Pheagon	the Knight	\N	724a7038-64a0-49b3-a9c8-2e94ac105533	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
51a05454-1f30-4c98-b976-25e26217ac60	2023-09-30 11:19:43.452	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Joaquin	Mograine	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
45a3b9cc-c971-462f-b85c-df8f678b17fc	2023-09-30 14:54:03.951	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Miyala	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
edba5cb4-6a02-4405-b37b-3852eb449940	2023-09-30 14:54:07.625	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Nyren	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
54ffebb4-a35e-417d-828a-8faade3fbb75	2023-09-30 14:40:07.427	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Yaris II	Pheagon	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
80567cab-aa4b-4a7c-8d02-9f31709a66ff	2024-02-24 21:17:00.228	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Sadiq	Ma'arri		\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
c12df5fb-1beb-4450-97db-ba9636468d4f	2024-03-03 10:16:08.703	2024-03-31 10:16:51.331	eb68433a-64b2-4bf9-92a8-5625f46ad59f	\N	Cedric	Thornevale	\N	\N	1ffb2448-0432-4b4b-bab1-ead2f8114281	f	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
99d12537-6723-4317-8056-cc20cfb47c52	2023-09-23 12:05:20.55	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Verelia III	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
9a25c621-d46a-493c-b876-dab5a639c0c9	2023-09-30 14:45:38.229	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Carinna	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
420c052c-e3f9-4cde-b3b0-8bb5ab115a6c	2023-09-23 11:45:23.712	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Orid IV	Pheagon	\N	\N	a775a0dd-cd00-475a-b767-07edc5031bbe	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
fce94a81-baa3-4dbd-9d9b-98e0d28db9c8	2023-09-23 11:45:31.328	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Ingonia		\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
9de5bc1e-0d41-45c4-bf79-9a1cda287f07	2023-09-23 09:50:24.235	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Jerome	Collins	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
2c33829d-3908-4190-8159-65b900b030d5	2023-09-25 14:59:24.663	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Gilaenna	Termur	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
a48a1161-f834-4296-a955-c01c8a8e7cc6	2023-09-23 11:43:13.773	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Merissa	Teal		\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
02ef72f7-2ba3-49a1-885b-f780a74cb7ef	2023-09-22 20:36:06.197	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Hyrora		\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
1911b480-54b9-4ea2-967c-95f201f5ea67	2024-03-03 10:23:56.537	2024-03-31 11:30:01.958	eb68433a-64b2-4bf9-92a8-5625f46ad59f	\N	Rowan	Fairfax	\N	\N	70593bd0-c426-42f1-97c1-d59bb4b72fda	t	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Rowan is the motus mage responsible for, among other locations, fort Gundor, making deliveries at the start of every week.", "type": "text"}]}]}	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
b80fc657-51d1-4fd8-9183-02ec5582c473	2024-04-05 17:17:17.506	2024-04-05 17:17:17.506	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Helen	Dyer	\N	\N	255f3b8c-b7aa-404d-bfda-529fe8ee74c4	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
facdf9fc-cf1a-49cb-b058-df3486b68e97	2024-04-05 17:22:03.882	2024-04-05 17:22:03.882	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Kyra	Macris	\N	\N	1bc85f54-00a1-43d1-9977-415a0da54f44	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
26b0e421-3bd0-4c8f-a719-2d3a3427ca85	2024-04-05 18:41:04.484	2024-04-05 18:41:04.484	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Sena	\N	\N	\N	51973eaa-2a77-42de-802d-bd6172db05e1	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
eae334ab-dbf6-47b2-916a-95c77902723b	2023-09-21 17:27:48.329	2024-04-05 19:13:11.542	43e1c879-415b-4394-95ad-f9a4c42a43c5	t	Uriel	Weiss	Uri	16	655d7d26-8a03-488e-ad6e-2f1639db16f2	t	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Uriel Weiss is a ", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "033e4b64-ee3c-4f45-b4fc-b28e7a0aa5df", "icon": "game-icons:abstract-047", "name": "blueprint_instances", "label": "Naar elf", "alterId": null, "parentId": "cc93b9b9-56f6-4cc9-b8f0-9e6df8604afc", "projectId": "43e1c879-415b-4394-95ad-f9a4c42a43c5"}}, {"text": "  who is a member of the ", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "3d4b00e9-c35d-416d-98b1-78a79ef21e40", "icon": "game-icons:organigram", "name": "blueprint_instances", "label": "Inquisition", "alterId": null, "parentId": "07490b86-d82d-449f-bfc2-8154bcf3c560", "projectId": "43e1c879-415b-4394-95ad-f9a4c42a43c5"}}, {"text": ".", "type": "text"}]}]}	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
a0622aaa-b8f5-4717-87af-cca2c540a232	2023-09-25 16:29:01.01	2024-04-22 08:39:03.475	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	James	Rhys	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
cde91141-356d-4bdc-9ed6-095f9971df4c	2023-09-30 14:55:55.831	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Linlera	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
58fc3988-e686-41fc-b62b-a10c0416ac44	2023-09-30 14:49:16.185	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Turis I	Pheagon	\N	\N	a1b34793-6d9c-4bc8-8289-c011406df499	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
64571933-d64d-40ff-8708-91543f9355e3	2023-09-30 14:50:30.432	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Selutia	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
f3d7e4b2-ade4-4da4-83ad-2f007746395a	2023-09-30 14:39:14.766	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Orid III	Pheagon	the Reluctant	\N	5c1398ee-3160-42dd-bcd8-e2043273e42a	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
eec884b6-89b5-46b1-b342-af07bd253719	2023-09-30 14:53:59.273	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Keianos	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
ca84cf36-c80a-4674-8ac3-f628a42aa560	2023-09-30 14:51:11.561	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Niya	Pheagon	the Unworthy	\N	71df79f2-8a8c-4342-95e8-b9697ee383fc	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
939fbb69-bf03-4e1a-97e7-8f987d1fcb80	2023-09-30 14:53:50.201	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Yeraso	Pheagon	the Honorable	\N	4dd0f375-756a-4441-92ac-56da69f56a02	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
d2fb5503-3f99-41cb-9e1a-a20b72417567	2023-09-30 14:50:25.837	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Narik	Pheagon	\N	\N	93998d5c-d7b7-48d3-9042-e466b6923a07	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
e9ec7008-a4f7-4f11-a648-6fd118f1d374	2023-09-30 14:56:29.156	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Itone	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
aaa02323-5478-4373-9e25-bb1735c00e0e	2023-09-30 14:48:47.071	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	The Pheagon	\N	\N	\N	8402a451-8f74-4f65-8dd3-e5335069bc28	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
4aa9136c-ce33-4290-90a0-327cf44f925d	2023-09-30 15:35:23.107	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Merielle	of Thawn	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
5f874844-c636-460f-bf39-134faa548624	2023-09-22 20:33:04.206	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Lucius	Pheagon	\N	46	89178a32-ad8f-4e11-a046-d0a680b951b6	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
8e89ad04-5a59-4fb5-922f-8a37a374511e	2023-09-30 15:37:55.417	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Zorah	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
7e903b3f-5ade-4990-be1b-d945891aa802	2023-09-30 16:35:19.257	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Elvira	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
5bcadcd6-1639-461c-9d1b-a88a9615a030	2023-09-30 15:38:07.509	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Turis III	Pheagon	\N	\N	03e2ac4e-b629-4b9b-9cb6-5bd3b085d29e	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
e0a57db4-960d-4175-8466-7bdb16bb975d	2023-09-30 15:35:12.983	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Turis II	Pheagon	the Liberator	\N	ea627cf9-eab4-46d6-b6aa-a09ad5d65cdd	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
a8ac515d-8f56-4673-aa40-436d36a3622e	2023-09-30 15:37:48.497	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Deinara	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
b8569e15-dae4-484f-8ce5-d76ecebff7bd	2023-09-28 09:48:37.758	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Matthew	Carter	Matt	\N	e85988b6-56f1-4482-bfc5-cef7941cd710	t	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
66fc9c8e-78b2-437a-9972-7189dd1665e1	2023-09-22 20:45:20.909	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Alexius	Pheagon		\N	6fc6b2d7-83f9-4906-a599-96469b1e763f	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
72254500-1ef4-4b8d-940b-b9a059b74b5f	2023-09-30 14:50:16.421	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Julius	Pheagon	\N	\N	24e855f5-6bc2-4e18-bb4f-4dfbbfce2f90	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
446bbfe5-c3ba-4de1-8cae-db4fc1206c15	2023-09-30 14:55:47.937	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Edducar	Pheagon		\N	d737ee1b-4282-43a1-8e86-e9ef960279a9	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
d05651da-7e14-4429-88d2-e1bcf6997290	2023-09-23 12:04:20.166	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Carrick	Pheagon	\N	\N	b6ecbe73-7f4e-4ac5-8797-54b01bdb0385	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
61fa5f6a-cae3-48aa-bcbf-b10351299d23	2023-09-30 14:54:19.095	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Margarett	Pheagon	\N	\N	1a957b4b-2c92-4f80-988f-b3c48cc7bfcc	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
d760c6fb-9376-4551-94a0-4b16e85e96ac	2023-09-30 16:42:20.984	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Augusta	Pheagon		\N	b9157766-bda5-43b9-be7a-e4d19b7e7424	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
af75eb77-c24c-485a-a7cb-483ca778cd66	2023-09-30 14:53:22.613	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Harold	Pheagon		\N	87a80213-8fe1-4562-bbdf-0734d9f89d0e	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
6e79865e-cc81-4da7-9be0-8674932413b0	2023-09-30 15:58:25.8	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Edward	Pheagon		\N	7721bf52-17a7-4d6d-bb25-cc40d0329dd8	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
7680246a-a1d5-40c7-9628-3a366c47a2c1	2023-09-30 15:58:29.925	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Hatni	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
3cfb4abf-2ead-466d-88ca-4761ecdbeda0	2023-09-30 16:04:11.193	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Theros	Pheagon	\N	\N	e5008aeb-4930-4a90-bfd6-08e2c6a8ab58	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
715b3d8a-9faf-46b6-ab1b-bf1138bc7134	2023-09-30 15:59:20.757	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Etanna	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
77a419bb-fe76-424c-88db-cac29199f0d6	2023-09-30 15:59:28.147	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Andra		\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
1beb584e-8cb0-41b3-90ad-b8fc51e4030e	2023-09-30 16:01:47.423	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Sarilla	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
ac451175-aa47-4d8a-9dfd-2dbd35fdf2bd	2023-09-30 16:00:36.473	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Sen	Pheagon	\N	\N	f80bee82-92c3-4d78-b06a-29d334ad8b24	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
b0e84648-a6d0-4e53-b90b-d249508a7a29	2023-09-30 16:03:06.422	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Nathaniella	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
c2eaf201-61ab-46dc-83c2-0cf0654553b1	2023-09-30 16:35:12.495	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Syris II	Pheagon	the Amused Reformer	\N	430a411a-d286-46d4-a527-ac5f16d8d2af	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
fdfd317b-451e-4600-a9af-cf648f9500dc	2023-09-30 16:37:07.732	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Oleandra	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
7638c01b-b48e-435e-8103-a35c4d08a4b3	2023-09-30 16:40:28.199	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Lyanna	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
4b409c17-b35c-4c94-a5c6-c5f996589eb9	2023-09-30 16:41:40.908	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Gerion	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
38bfff68-291d-4221-8de6-3073a5b0082a	2023-09-30 16:42:27.937	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Brandor	\N	the Wise	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
26005085-8938-47bd-8928-85df8e8afdb6	2023-09-30 16:42:57.621	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Syris III	Pheagon	the Martyr	\N	fa272775-c253-43c2-a883-7bb876ece27a	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
f6b6c4c3-31a3-4a7d-8376-82319f31c4c8	2023-09-30 16:41:59.19	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Lutia I	Pheagon	the Weak	\N	fa0b447b-89cc-4a84-adb8-c8d3254ea654	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
90f10a2e-fb73-4830-8306-41f5e2b0d612	2023-09-30 16:41:03.332	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Niya II	Pheagon	the Patron	\N	2404d3ed-d7ca-4688-a402-08414dfeed03	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
f03fb0cd-5640-4a78-a029-1d9c2ffa7a84	2023-09-30 16:40:46.645	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Lerima I	Pheagon	the Scholar	\N	ebfff8ed-de5d-44ff-ba12-4fd543dbe2bc	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
f7b9f2e6-60eb-401b-ab89-195b41835a5f	2023-09-30 16:39:56.727	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Orid I	Pheagon	\N	\N	f9314a15-95bc-4337-899b-c5bddd8f8db8	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
4573aa15-33e0-46dc-bb32-20de8b68bd88	2023-09-30 15:37:35.333	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Trillia I	Pheagon	the Reformer	\N	84150fac-2a31-44d5-833d-03d68587bdbd	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
f068b802-732a-4bbd-b423-5cc9f404434f	2023-09-30 15:35:49.731	2024-04-22 20:15:58.45	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	David	Pheagon		\N	155faccb-b88a-4a9c-9aaa-c60354ceee76	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
eff224bc-c8ab-46f1-844c-9df1d28609d2	2023-09-30 16:04:00.185	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Marcel	Pheagon	\N	\N	47ac18ab-2b31-4713-93f0-8f4cbc532bc3	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
55c882ad-8311-4e43-96b7-e995928f73dc	2023-09-30 15:59:11.821	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Trillia II	Pheagon	Savior of Salaraan	\N	365a1b0c-3d0a-419c-b696-9e0cd141b032	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
992cb4e3-ccc3-4c82-8172-3135e85e4099	2023-09-30 15:37:42.41	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Ceridan	Pheagon	\N	\N	a1e873ef-2569-41b8-88e5-2ece07f43f51	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
b5ca043c-f6c0-4224-b772-ad0fe1c84f21	2023-09-30 16:02:24.633	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Syris I	Pheagon	\N	\N	8e7d1f88-6bc4-4b16-af82-11971eaef88a	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
ea64ffaf-8dea-40fa-b089-083931d21858	2023-09-30 15:35:29.751	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Thymos	Pheagon	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
fa75b650-b6ab-4763-a86e-a16e25ecd5af	2023-09-30 16:02:16.029	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Aldra	\N		\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
330498d4-c160-4c73-a8d4-b8b45cf81815	2023-09-30 16:45:55.237	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Trettir	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
0632b05b-b6ca-4cb6-95d3-269b3822336c	2023-09-30 16:46:56.354	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Stannus	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
cf8d67e7-054e-4400-b4ab-7cdb70f84154	2023-09-30 16:47:42.363	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Catalin-Alenna	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
948a8aa0-8386-4c0f-b715-8cd0c7609d6b	2023-09-30 16:48:29.901	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Radalia	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
1feca789-8251-4766-9c7b-e7e1fe6cc004	2023-09-30 16:49:30.565	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Gelaryn	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
db31376a-f4ea-49af-a494-32b6efa38001	2023-09-30 16:50:31.953	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Essa	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
af42cb03-c6fb-40c0-87c7-d12901b630d4	2023-09-30 16:50:46.407	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Risalia	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
14d640fb-761f-44a2-9868-164eb1a618e8	2023-09-30 16:52:34.989	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Hellen	of Yarlen	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
0dc49010-17d4-493d-9853-1d19927f10ac	2023-09-30 16:53:06.263	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Vesilia II	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
1ba5fd05-db0c-4e0d-b89c-52eb728f6b9d	2023-09-30 16:53:26.493	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Syris IV	Pheagon	\N	\N	b4a3dffa-d176-4af8-bd68-5c7697da757c	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
48aa1ba9-fc92-4b3f-859b-f3284e35436e	2023-09-30 16:54:07.846	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Irecia	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
ca088a1a-8fcd-430f-b3c9-7ba6446477a8	2023-09-30 17:57:56.018	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Rillia	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
b06f48da-8761-4eab-92d5-37fccad058fd	2023-09-30 17:57:51.21	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Niya IV	Pheagon	the Exhausted	\N	33486499-54c7-4ba9-aa2f-35a85e773186	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
bea58ad5-ee6e-4b88-9548-c38578f0dd7d	2023-09-30 17:58:30.264	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Lutia III	Pheagon	\N	\N	ee0488c3-8034-4f9c-b420-6bb932c69a75	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
518bd02d-52c9-4d20-bcca-bee6233665a8	2023-09-30 18:01:48.785	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Andra	Pheagon	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
fda0bcb5-a0eb-42a7-a0cd-4c7d85dba6b3	2023-09-30 18:01:59.641	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Tornren	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
8611ab61-310c-4c11-80d9-53e814012d6f	2023-09-30 16:03:51.085	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Rhiannon	Pheagon		\N	a296beb0-814c-4586-a3b0-11d9d0d1ceae	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
ddb2f771-f6e2-492a-81bd-d9c8af8fd15e	2023-09-30 16:43:22.751	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Mirella	Pheagon		\N	d3f6770e-049b-4030-92dd-e6f8d4cbdb8c	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
089ebc15-1543-4d92-b077-7bd832eb2a79	2023-09-30 14:56:21.304	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Carlisle	Pheagon	\N	\N	a999aff2-0836-42cc-83fb-535be8257ae0	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
78529628-b5cf-4d05-a8c3-2f651fa56391	2023-09-30 16:48:21.277	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Otto	Pheagon		\N	9eafdc5d-fbba-427e-8c2e-49df0276d7dd	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
05a62bbb-6fa4-46b0-ae14-4115937b9f5e	2023-09-30 16:52:56.197	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Charles	Pheagon	\N	\N	1fece120-7f7e-4ae1-95cd-eaffe1ba9567	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
2ae57613-1a15-432b-ab75-57dc566a8fed	2023-09-30 16:54:00.196	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Stewart	Pheagon		\N	e8bfe8b7-0d39-46aa-b455-e01a52ab8181	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
430cda7d-8ab9-43fc-a8cb-8e69a0220a5f	2023-09-30 14:56:11.532	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Leopold	Pheagon		\N	ec8ce0e6-e8da-423e-ac51-f7cedd61c648	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
b75309d2-b3aa-467e-9e85-8b9983feb9c2	2023-09-30 16:03:32.364	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Elliot	Pheagon		\N	3b715173-31a0-4890-8ad6-4f8b6e1e6414	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
c4b9d2e3-64ab-4ba3-97c9-241b7b6d4698	2023-09-30 20:34:55.047	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Edna	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
71e2652e-2255-4eba-8199-ca20e579cfe6	2023-09-30 16:51:04.642	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Orid II	Pheagon	Lightbringer	\N	acd41597-1f1a-4db4-99b6-ac66213e8635	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
19078d30-d5fe-4e39-8190-afbb41a35f28	2023-09-30 16:51:25.722	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Asynia	Krill	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
6881540b-9f07-43af-931b-7afdf5bb1e36	2023-09-30 16:45:48.705	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Lerima II	Pheagon	the Warmonger	\N	0ee91c23-b1d6-4794-87c9-ead02dd887ca	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
a9568fde-8334-472e-8438-b3fa3c5635e4	2023-09-30 21:12:09.725	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Yvora	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
d4253843-b4b2-4136-a25d-e6fccb7cc72a	2023-09-30 21:12:59.619	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Illaran	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
5084316b-bcab-4881-bc38-bd912acf71ea	2023-09-30 16:52:12.118	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Niya III	Pheagon	\N	\N	b8c11829-987f-4ab5-b7b7-1d7d71e61e85	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
551bd74b-964d-4c9e-98f3-6ccce8724046	2023-10-01 10:32:50.485	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Thereena	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
3384123d-7dc1-4728-a320-1ffb905b7d98	2023-10-01 10:33:03.109	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Jamila	\N	the Fair	\N	c839aad4-db2c-4561-bef6-a2027efe0fb3	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
ae44fc3e-571d-4c58-a028-5183f94815f6	2023-09-30 20:35:42.136	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Yaris I	Pheagon	the Accursed	\N	57743987-252f-4eee-a353-fa894918c910	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
abcfe56e-d89b-47b5-a248-d58a2a9ddf7a	2023-09-30 18:02:49.132	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Cecilia	Pheagon	the Priestess	\N	febb9182-bba8-488d-b5b6-c3b813aa2913	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
f9b13f77-6319-4225-9910-2b6a64652fb6	2023-10-01 10:33:52.13	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Celine	Kyton	\N	\N	7f105f9a-bd28-440f-ab13-635db6a13b16	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
47b28ed9-edc3-4ce6-ae53-8b59b46db787	2023-09-30 16:47:28.772	2024-04-22 20:02:30.51	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Oreleth	Pheagon		\N	eeb0d791-ce91-4cb1-87b7-946edc66cda8	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
65a03f79-1467-49e4-b5d6-be4f297426fa	2023-09-30 16:02:54.671	2024-04-22 20:16:44.22	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Octavian	Pheagon	\N	\N	dd3f46b9-a636-4f3a-af19-364309563602	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
ee9aeef6-bb12-492d-8c65-4c6541a97e3c	2023-09-30 16:50:13.819	2024-04-22 20:17:42.94	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Sextus	Pheagon		\N	9ca9daa1-5c38-40fe-a5ca-f8e0c79c42c0	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
a316698a-b376-4d07-acec-1c4fa859b3e5	2023-09-30 16:46:12.678	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Lutia II	Pheagon	the Blind	\N	a5750b1d-95ff-45fb-9951-d1259212b1e5	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
d2006ddc-4d99-4dfd-a55d-b425410243e4	2023-09-30 16:03:17.826	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Naltor I	Pheagon	Lawgiver	\N	f0a6637e-2925-431e-914d-d5cc6a5f71bd	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
74e65ead-4b87-4092-a9a8-29ac04ec5551	2023-09-30 16:51:49.774	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Naltor II	Pheagon	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
22fcff15-630a-4fe7-8aa9-893f52e13b74	2023-10-01 10:33:30.349	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Oradro	Kython	\N	\N	54a7e7bd-246b-441f-a39b-bfdedd838d4d	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
52df46d6-8765-44e5-91c0-bc873903b914	2023-09-30 16:49:48.191	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Quimus	Pheagon	the Forgotten	\N	5a83fb9f-f97b-4e7c-a0a6-8041c7d03c39	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
5cc32e0d-2ec1-460e-87b0-9bf6e3ee6ea0	2023-09-30 16:51:16.476	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Umdara	Pheagon	the Night Empress	\N	f46452e5-5121-41bc-8a54-ebcfe5c55a83	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
f9671ab8-4d1c-4d45-8b3c-5eb9ebe723dc	2023-10-01 10:34:02.873	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Hugo	Windslich	\N	\N	9dbf1ff3-d1bb-436d-8fec-9f87b74ceb90	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
7b6c828c-8d97-48be-a237-d1e0611aa6a4	2023-10-01 10:34:49.377	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Victoria	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
2a6fa77a-79fc-41b7-a6d2-77dc5c8706be	2023-10-01 10:37:16.411	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Telrisen	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
b29ba856-37ef-4541-baf3-58fa8a96f60e	2023-10-04 20:50:48.333	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Verumal	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
206608a7-3c83-4600-8da1-994b085b63d6	2023-10-04 20:58:29.223	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Vivus	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
d43fef12-98fe-4592-abcd-bd3e228cea46	2023-10-04 21:04:52.729	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Lacuno	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
605ebbe6-f5b9-4f5a-9e5c-6f08743aef50	2023-10-04 21:26:16.274	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Medela	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
91b6ee36-49e6-421b-b60f-eb30d8fb33e9	2023-10-04 21:26:26.482	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Fiducia	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
4f833928-cf94-4691-b5db-3d7da93f0da4	2023-10-04 21:26:35.322	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Trisitia	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
806c2666-004b-4356-af39-ed8b1c570769	2023-10-04 21:27:43.755	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Obscurum	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
fb1962c6-b829-4edc-b8f3-a66a909a1934	2023-10-04 21:27:52.412	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Umbra	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
72627abe-3988-41ab-80fd-e56e58642101	2023-10-04 21:29:53.101	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Mersus	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
247a295c-4c35-4381-a0f5-c6416cd40203	2023-10-04 21:30:01.129	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Mevor	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
ab4d5708-4598-4caa-aa54-4317a57ad15e	2023-10-04 21:30:10.223	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Morbus	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
c677283d-0b6b-4f78-99ce-efbe1c706053	2023-10-04 21:30:16.859	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Fragor	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
b5b89d35-6cc0-4d6c-a8b1-66f463ab335a	2023-10-04 21:30:31.045	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Iraqunda	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
1830ab6b-8213-4579-814a-c5841d52c36f	2023-10-04 20:50:40.685	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Lux	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
115322e3-8301-4ba3-876b-9a9f51e20edc	2023-09-30 16:46:39.249	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Avek	Pheagon	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
423e057a-c207-4b91-9521-a00b0f89ee4f	2023-10-01 10:35:51.683	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Armand	Kyton	\N	\N	a14ab673-6a01-48e4-9336-804c1d0f5128	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
80128878-7e33-49a5-80ae-024a0719da19	2023-10-05 19:11:16.033	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Delilah	Comtois	\N	\N	ef12d3bf-59b0-4847-a67f-b19b701204bd	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
e6c24860-6b48-4397-9f27-d1bbbd2fa392	2023-10-05 19:13:52.126	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Maxim	Marais	\N	\N	4f1c3fa8-8a7b-476e-a358-ed12f22d87ee	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
de9254e6-c737-4460-9121-011550b0a6c5	2023-10-05 19:13:30.643	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	August	Marais	\N	\N	467b5988-de6c-4f51-8dcf-b20aa4971675	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
0963a01c-c27f-4d9f-baf1-c5ec5219db98	2023-10-05 19:16:53.247	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Juliette	Comtois	\N	\N	d1a5308b-a9cc-4451-9f54-09e4e25964a2	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
d93f996f-ee86-4e7e-82c1-1ddf49bcb044	2023-10-05 19:38:13.903	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Yvette	Comtois	\N	\N	defc4859-f824-4937-a82b-9bb15554928d	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
2837d3a8-a626-49c3-9ede-03af36f9e490	2023-10-05 19:13:17.233	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Vivienne	Comtois	\N	\N	f0880d29-4197-4c61-bef8-a74593217797	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
88bed265-2b87-41b0-839c-86195b193be0	2023-10-05 19:16:31.473	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Francis	Marais	\N	\N	7cadcae3-3365-491f-b329-6a357df81324	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
2ddefdce-7d00-4668-988c-53d24d79e056	2023-09-30 16:48:57.833	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Jakshir	Pheagon	\N	\N	f9a6f9c4-7488-4f79-a4f5-81008e2f29b8	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
0f916460-8c32-443c-912a-842207838174	2023-09-30 21:11:31.751	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Devon	Pheagon		\N	3c43b983-2cca-4462-a3ba-d0cf2fa85218	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
5c191811-99dd-4487-aae1-5eab69c35358	2023-10-01 10:36:31.219	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Cedric I	Kyton	the Magnificent	\N	b9014e29-3c36-4913-a913-af4f9c85a998	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
e962a0e7-3467-4abd-9167-fd35508c99aa	2023-10-01 10:39:02.8	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Alexius	Rodanon	the Golden	\N	14f13bc5-8dd2-43e3-a9af-4385e75f70ff	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
3cf1a90e-7475-419a-9290-2e8d727432c9	2023-10-01 10:37:35.27	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Lewis I	Anona	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
4c41a048-adec-4ec4-8b52-b976eb3be723	2023-10-01 10:35:09.987	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Nathaniel	Kyton	\N	\N	2a77a381-9e2a-491d-892c-780dde27d184	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
9db21149-f9c2-4817-b501-b7a35def7c42	2023-10-01 10:39:31.988	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Rhys I	Rodanon	the Mage	\N	6683f40c-782c-4a18-b520-a6889d0a5d20	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
3b84aabb-8086-419a-88a1-fa6991150583	2023-10-01 10:34:24.535	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Riordan	Kyton	the Bold	\N	b017fdb8-f886-4d4c-ac4f-c4bbf9b6afbe	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
6a314fe0-050b-4e56-a4d7-689120560568	2023-10-01 10:39:50.887	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Robert I	Rodanon	\N	\N	7f849e5c-d642-4e6a-8f2c-e480dad02e65	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
c69ecc10-7730-4d55-aa95-c4c2cd65617a	2023-10-01 10:38:16.785	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Rodanon I	Rodanon	the Strong	\N	0e1c7856-dd58-4aee-8ed4-7a74f689ecf0	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
9d6c5ab5-9b67-4153-a75c-ae73efa4fcdc	2023-10-01 10:46:24.099	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Theodore I	Syris	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
86c5a4ec-a058-4c91-8937-cc71f0f7af77	2023-10-01 10:35:31.591	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Titus	Kyton	the Banished	\N	331d9737-fb7c-4a59-b3c6-52b31e07a41d	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
37e08cba-2320-4e1b-b564-adff5c764884	2023-10-04 20:50:23.339	2024-04-05 17:38:41.139	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Theya	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
9d10a90f-76bc-41b3-ad15-48e943af147b	2023-10-09 07:14:36.143	2024-04-20 17:28:55.328	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Zachary	Graff	\N	\N	4c552934-0bdf-4aab-a5b4-bc6149ef608e	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
e5bad67a-1212-4999-80a8-0e3f267f3246	2023-09-30 18:02:21.175	2024-04-22 20:03:28.118	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Clement	Pheagon	\N	\N	ccfca6ea-a51f-43bb-8d26-a3a29d792d23	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
9aa07364-9dd2-4227-a62e-998e792e4b8a	2023-10-01 10:37:50.997	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Tristan	Anona	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
65b58ba7-5dab-4f61-9bf5-3bddadbbe8be	2023-10-01 10:40:19.877	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	James I	Rodanon	\N	\N	a55114f5-3452-42a9-94d6-e017d7b954fe	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
92672947-0693-480e-b64e-0aef04cf1f50	2023-10-09 19:48:28.755	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Daniel	Weiss	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
a528b7ed-d4ba-4b2e-9ee8-86f1c63c458b	2023-10-13 19:22:02.41	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Cornelius	Tonkin	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
7f30a6e6-af28-47d9-9ac6-5e39fa80472c	2023-10-31 16:46:38.392	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Jacques	Matthiu	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
c5fc22dc-9451-4d2d-b563-2d2bf9bb4193	2023-09-30 15:59:46.919	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Vesris	\N	\N	\N	cdca9f79-50c5-48d3-bbbb-bc8b7f8b177e	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
f2a2663e-dedc-465d-ba79-f845235d4748	2023-09-30 16:01:37.773	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Aldeem	Pheagon	the Explorer	\N	1627dceb-beca-4bda-b164-4ce3952099c0	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
1f51093a-6482-474d-ab0a-660b16763ba8	2023-11-22 07:57:11.042	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Lucius	Thoran	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
27a4a371-45e1-45f2-acf2-d5fbd36e32f4	2023-09-30 16:54:45.054	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Connor	Pheagon	\N	\N	9b653bdc-ed7b-4518-8063-089b40e10467	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
528539ff-3cc2-4462-a5a4-e8f36b7a0cb6	2023-12-24 09:06:26.387	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Orid	Kyton	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
a40c1aaa-a3b3-40a8-94d2-0826a52b5281	2023-09-21 13:48:06.471	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Noah	Courage	\N	17	d704949e-aa6b-4822-9f00-30a66a0b91c4	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
53a9de7f-3379-4522-a70a-af2041a6d8e7	2023-09-30 10:55:00.712	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Mist	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
e1943b46-b616-4649-a01e-e8dcdf0d6b2b	2023-11-22 07:57:32.714	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Franz	Schafer	\N	38	90f9188f-a171-439c-b991-a23d82d9276b	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
20157e84-ee22-4bc3-aa22-fa4261b9dc42	2023-11-25 15:04:58.318	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Robin	Har-???	Blackbird	22	e06f92e1-cb04-4370-854c-17f4d5732277	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
b0b33ba5-6367-4f7f-9f5e-44cad8b94973	2024-01-16 21:07:33.765	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Matthew II	Carter	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
49df0b28-cfb2-4a8d-bda2-bc30d9e29198	2023-12-24 09:03:55.245	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Otis	\N	\N	2	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
3c9ef747-bf4c-44ff-8a71-6648fc1c8642	2024-02-10 09:48:47.59	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Robb	Stark	The Wolf Pup	\N	949de602-21a8-4a66-a269-85d3b215ea8e	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
2dc1216a-2a31-4a74-8387-4acbd9556599	2023-10-05 20:43:50.369	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Gazza	LaRoux	Doc	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
71675486-ae62-42b6-968e-d1b1ef917ef0	2023-12-30 14:19:14.206	2024-03-28 15:42:35.922	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Alaric	Sarthis	\N	\N	1038a46c-c8c9-4396-bf3b-ddad84d7b45e	f	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
a50a4981-40e4-44ae-82ff-27b6c4077ac2	2024-02-10 09:45:04.166	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Eddard	Stark	Ned	\N	9e6c6677-7501-4284-9088-48212daf728d	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
9a68e881-000e-4de6-9408-7b3ff632f9ad	2024-02-10 09:55:14.931	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Rickon	Stark	\N	\N	46293e00-a26e-4fdf-bfc5-fa83f2bf1945	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
64aaa1af-aae7-40b4-95fd-316cbd2c349b	2024-02-10 09:54:55.448	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Sansa	Stark	\N	\N	dab7bbc0-18c1-4162-b608-e8750367bba2	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
85e203a8-a394-4067-8fa1-b94c34e2691e	2024-02-13 07:13:02.543	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Loras	Tyrell	Knight of the Flowers	\N	4f3556bb-7fe2-4bc5-b069-a0360e81fa36	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
aef4bc03-5e7f-44fa-b102-e53135db421a	2024-02-10 09:55:25.448	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Jon	Snow	\N	\N	7cefd70f-e913-4448-8cba-a73ecbd9b9d5	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
796c16ad-9145-4ffc-a762-19f517ba0e4d	2024-02-10 10:06:53.964	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Tyrion	Lannister	\N	\N	807eb29c-9245-494c-bf9c-1959371a19df	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
1d9aa594-c04d-4c38-937c-0323be8162e4	2024-02-13 07:16:47.598	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Margery	Tyrell	\N	\N	68effc48-6c5b-4336-8f41-d1c356336632	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
a65dcee1-3bf5-4b1a-bf50-d19cce624d53	2024-02-13 08:27:17.539	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Qyburn	\N	\N	\N	ecf5f7d9-54f0-4ed8-9945-eebc2d4daf86	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
a9d3a726-203f-4dd6-ad59-36793c483d91	2024-02-13 07:13:40.462	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Olenna	Tyrell	Queen of Thornes	\N	f79e0222-8a5d-402a-ba94-8be00c436b98	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
5bc05aaa-cae5-40ac-b780-54929639f310	2024-02-10 09:49:36.969	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Catelyn 	Stark	\N	\N	c1d47e17-3aca-4b63-af01-feb292e4994c	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
18edfff6-5e09-4028-8085-96aeacf96280	2024-02-10 10:16:07.849	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Edmure	Tully	\N	\N	e99ca9f1-7840-4450-9ea0-4170e8fc0f22	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
334f3518-9237-41a9-8d2d-b005d25aa13b	2024-02-13 07:16:27.914	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Mace	Tyrell	\N	\N	238befa3-b484-4a82-80c0-abd386a3540b	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
719a9ed5-849f-46d1-80c8-5a45b7513b53	2024-02-10 10:15:48.028	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Lysa	Arryn	\N	\N	006dcc53-0c6e-4226-b870-8c2987fe5e90	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
35f92ae8-889c-4f94-80a7-be21f444823d	2024-02-10 10:15:26.661	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Hoster	Tully	\N	\N	5298e789-4a93-45a5-80f6-76b7ab5204cf	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
db26d940-9cb1-475b-ba46-53d108d9479a	2024-02-10 10:21:52.739	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Robin	Arryn	\N	\N	83b31112-753b-4315-85dd-dc7ae2704444	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
2eccad6c-c292-43fa-8cb3-9f5c241b53ea	2024-02-13 09:03:56.725	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Aeryis II	Targaryen	The Mad King	\N	641817a0-b682-43ee-8b96-9d433208d2f4	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
53eb4f51-9933-4425-a7fd-f07476229e4a	2023-10-07 20:31:01.643	2024-04-05 16:35:14.66	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Apollo	Artemis	\N	\N	9fe61186-f363-400c-8328-f5fc83906b0c	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
06d43ae7-a804-4072-aa37-14800b4b13f1	2023-10-07 20:29:00.203	2024-04-05 18:31:02.141	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Sicarius	\N	The Entombed One	\N	3d74d5b5-ce3b-4898-a4b8-c1c69474b6f9	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
0996efd2-e65c-454e-ba59-d33569b7e648	2023-10-09 19:49:45.017	2024-04-05 18:16:13.327	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Isabel	Weiss	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
6053d298-c0f6-431f-8e7e-c1aec7924c88	2023-09-27 20:42:48.896	2024-04-05 18:23:39.37	43e1c879-415b-4394-95ad-f9a4c42a43c5	f	Alphonse	Matthiu	Al	\N	856dd74b-80f7-4177-a04e-c9449d1083c9	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
565e7175-64d0-4cab-85b2-c88d7adc966f	2023-09-22 19:41:48.472	2024-04-05 19:08:35.591	43e1c879-415b-4394-95ad-f9a4c42a43c5	t	Aurelian	Pheagon		30	94359479-a682-40ec-8b8b-7d65dacf4c2e	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
01815aa3-06d4-45ec-aeb7-a91ed879f3bb	2023-12-09 17:39:10.676	2024-04-05 19:08:46.343	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Karen	Graves	Shade	30	9d3d73ff-d46e-4de9-a93a-4471435647c7	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
58a77df8-abf5-41f7-8c57-1e2a5d6fcc15	2023-12-24 09:04:03.262	2024-04-22 20:04:19.048	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Otisior	Brandais	\N	\N	f8e4354e-968c-4158-9fa6-b6f13c30aa89	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
474d03c5-18a1-4e0e-a298-9e479fe64df6	2024-02-10 09:53:05.086	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Cersei	Lannister	\N	\N	a30ae867-dcdf-4db1-b74b-dcd9eb62cc3f	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
b184a4d0-6b5d-4672-8343-0dda42f129ed	2024-02-10 10:05:20.232	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Jamie	Lannister	Kingslayer	\N	99a557d7-8ca9-4d90-a811-e5786504efa3	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
51622f08-c61f-4c22-8258-e2dd5b9c10f5	2024-02-10 10:08:11.345	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Joanna	Lannister	\N	\N	2cb5e90c-fd8c-4299-9eb3-f3b6faba13ce	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
3dc7880d-a137-4e9a-9f3f-a55023b63f9c	2024-02-10 09:55:05.547	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Arya	Stark	\N	\N	37a3cb63-4f65-407b-b88f-f7a30343d190	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
19e9dba3-b166-4a5c-9e16-1749dfbde91e	2024-02-13 07:33:14.17	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Ellaria	Sand	\N	\N	63bfa303-14f7-43b1-b683-98ac556614b2	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
cf716320-8fed-4f2d-b438-defe0d3177ea	2024-02-13 07:31:56.154	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Oberyn	Martell	The Red Viper	\N	210b1e2e-e40d-4123-8bc3-1674dee25b8a	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
7119b36f-c49a-4d30-b7ac-89a366340fbc	2024-02-13 07:35:05.51	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Doran	Martell	\N	\N	be68a0f1-378b-4471-ac77-cc51033cb4cf	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
4eb3f9fd-e0c6-4e66-b293-b1a51f0db477	2024-02-13 07:55:20.095	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Renly	Baratheon	\N	\N	860c9a54-183f-405f-891c-78486273d0a6	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
7dff96b1-fe62-4bd5-b04c-849ae0d9dba8	2024-02-13 07:57:03.34	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Stannis	Baratheon	\N	\N	a90d91eb-291b-475f-b6f0-e4c56a1a4a4d	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
c74d538a-212e-4e59-9f3e-eb5a70f9fd93	2024-02-13 07:58:31.147	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Gendry	Baratheon	\N	\N	4c56758e-de44-4126-aca6-663e6ff41984	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
ced1866a-f8e3-470f-aa6a-f94c6d2374bc	2024-02-13 07:59:51.301	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Joffrey	Baratheon	\N	\N	fc9a26e7-5361-4280-8b92-34dd35c57cdb	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
38d318b0-6457-4974-af45-b0db8381d460	2024-02-13 08:21:31.504	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Tommen	Baratheon	\N	\N	d910d122-ffb0-4a22-a32a-0981755f86f2	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
8ba83857-85b7-4d26-8918-3a92b6e6069e	2024-02-10 10:21:32.461	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Jon	Arryn	\N	\N	b6e98648-cecc-4cbe-84e4-debe6d2fc780	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
56abc767-1971-43fb-a08e-878aaab783b1	2024-02-10 09:53:31.834	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Tywin	Lannister	\N	\N	22d32dcd-7d0b-409c-97d0-656cb3808d5b	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
7296e38f-f51b-4357-bfb0-f82a737b662a	2024-02-10 09:51:19.906	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Bran	Stark	\N	\N	b3f02034-9454-4086-a5fb-611e02032cf3	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
aec562ba-d1bc-4849-a50f-a1e369a6ace6	2024-02-10 10:17:02.903	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Brynden	Tully	Blackfish	\N	07491746-4ae6-451f-8f68-ad5a733291db	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
dc7d21d1-0a0d-4e4a-aaaa-d970c7da3825	2024-02-10 10:25:25.175	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Robert	Baratheon	\N	\N	4c4dc7f3-2956-4123-bc28-cbbb417d66b2	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
e273762b-0b47-44fa-a942-694461d12565	2024-02-13 09:06:16.084	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Daenerys	Targaryen		\N	88b517f4-8b17-4ec6-b07f-5a295d55903f	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
d0506f08-8bad-4924-b75d-26888a3bceaa	2024-02-13 09:07:30.802	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Viserys	Targaryen	\N	\N	0330649c-fb47-4944-82f5-bf6acf8628d7	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
bb3c5c51-c52d-4ce2-9c63-42d9cef75a3d	2024-02-13 09:09:53.763	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Rhaegar	Targaryen	The Last Dragon	\N	79ee16a5-ea78-4a82-8c23-a02834604b6c	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
98655876-fa94-4fe1-b139-5497c323c280	2024-02-15 09:04:02.82	2024-03-28 15:42:35.922	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	Wylla	\N	\N	\N	\N	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
766833de-3846-45a5-ad47-ff09b5ac6c79	2024-04-05 17:18:41.581	2024-04-05 17:18:41.581	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Segomo	\N	\N	\N	b3086406-9576-47e1-80d3-f6116a920ee6	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
f1b90b1a-9e3f-419e-bd92-162bbf01845c	2024-04-05 17:23:38.801	2024-04-05 17:24:49.066	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Pentius	\N	\N	\N	585e2813-85e1-4470-b888-3ee83c2b9100	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
84f9f03d-241d-41a1-9fa6-7a13c39c9608	2024-04-05 19:10:13.101	2024-04-05 19:10:13.101	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	Celbrion	\N	of Kos'trashar	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
\.


--
-- Data for Name: conversations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.conversations (id, title, created_at, updated_at, project_id) FROM stdin;
a69a1978-966a-4a45-a85f-61cbbbdd4e10	Disciplining	2023-10-15 08:13:18.326	2023-10-15 08:13:18.326	43e1c879-415b-4394-95ad-f9a4c42a43c5
f06bf1bd-d3ab-45e4-b7fc-8a1dcfa1a5a4	The mission plan discussion	2023-10-14 17:08:25.466	2023-10-14 17:08:25.466	43e1c879-415b-4394-95ad-f9a4c42a43c5
da010cf6-c874-472d-80ad-f1c63139fa8e	Mission plan	2023-11-14 07:03:04.514	2023-11-14 07:03:04.514	43e1c879-415b-4394-95ad-f9a4c42a43c5
\.


--
-- Data for Name: _charactersToconversations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_charactersToconversations" ("A", "B") FROM stdin;
565e7175-64d0-4cab-85b2-c88d7adc966f	da010cf6-c874-472d-80ad-f1c63139fa8e
eae334ab-dbf6-47b2-916a-95c77902723b	da010cf6-c874-472d-80ad-f1c63139fa8e
0963a01c-c27f-4d9f-baf1-c5ec5219db98	da010cf6-c874-472d-80ad-f1c63139fa8e
b8569e15-dae4-484f-8ce5-d76ecebff7bd	da010cf6-c874-472d-80ad-f1c63139fa8e
\.


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documents (id, created_at, updated_at, title, content, icon, is_folder, is_public, is_template, properties, dice_color, project_id, parent_id, image_id, owner_id, deleted_at) FROM stdin;
9637deb5-3a93-4568-a607-af6c254a5669	2023-11-12 21:42:10.067	2024-03-28 15:42:35.922	War of the Night Empress	{"type": "doc", "content": [{"type": "heading", "attrs": {"id": "5f24f012-1fa0-48e3-af0b-27700b3fd33d", "level": 1, "style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "This is about the war of the Night Empress", "type": "text"}]}]}	\N	\N	\N	\N	\N	\N	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
fa187855-eaa0-455d-afe2-60efcb4a5192	2024-03-07 07:18:51.871	2024-03-28 15:42:35.922	Random ideas	{"type": "doc", "content": [{"type": "bulletList", "content": [{"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Tamers of various creatures", "type": "text"}]}]}]}]}	\N	\N	\N	\N	\N	\N	eb68433a-64b2-4bf9-92a8-5625f46ad59f	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
af59a143-4214-4477-b607-3e0a7cb3376b	2024-03-24 08:22:35.641	2024-03-28 15:42:35.922	Twelve Cities	\N	\N	t	\N	\N	\N	\N	43e1c879-415b-4394-95ad-f9a4c42a43c5	ab9e715f-9442-4b21-8ce5-865cf665d9d1	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
643fa781-8337-4717-a31b-cbff458f34be	2023-11-17 12:46:44.99	2024-03-28 15:42:35.922	Eternal War	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}}]}	\N	\N	\N	\N	\N	\N	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
e0638435-8f3f-46f1-92ad-408a3c959c02	2023-11-12 09:25:18.281	2024-03-28 15:42:35.922	Wisteria	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Wisteria ", "type": "text", "marks": [{"type": "bold"}]}, {"text": "(from ", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "0e848229-1db7-4ae0-b85a-1fd66ab30d60", "icon": "", "name": "words", "label": "Weissteria", "alterId": null, "parentId": "", "projectId": "43e1c879-415b-4394-95ad-f9a4c42a43c5"}}, {"text": " ) is a plant, native to Xaf, known for its pleasant and calming smell, alongside its poisonous seeds and petals. ", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Originally growing in a white color, it has since spread across Salaraan, and diversified into a couple of subspecies, each in its own color and differing properties. It is not recommended to pick wisteria plants without proper knowledge or guidance from a herbalist or alchemist.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}}, {"type": "heading", "attrs": {"id": "be757cf6-17d0-4286-95e3-65cfd3777435", "level": 2, "style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "White wisteria", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"type": "image", "attrs": {"id": "", "alt": "white_wisteria.webp", "src": "https://the-arkive-v3.nyc3.cdn.digitaloceanspaces.com/assets/43e1c879-415b-4394-95ad-f9a4c42a43c5/images/ebe366d7-7a2b-4c40-810e-880aef966743.webp", "crop": null, "title": "white_wisteria.webp", "width": 166, "height": 166, "rotate": null, "fileName": null, "resizable": false}}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "White wisteria is native to southern Xaf and its surrounding regions (Phymon in particular), and grows well in temperate climates with above average precipitation.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "It is mildly toxic when ingested, particularly the seeds and petals are known to cause irritation around the lips, gums, nausea, vomiting, headaches, dizziness and, in extreme cases, a loss of consciousness. There are no known deaths caused by this variety. It is estimated that the amount needed to be ingested to cause organ failure or death is a quarter of the average humanoid's weight, making it highly unlikely.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "It has been used in low doses to treat mild skin irritation. ", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}}, {"type": "heading", "attrs": {"id": "73893162-99a4-4f28-a8b6-cc807ae52962", "level": 2, "style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Red wisteria", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"type": "image", "attrs": {"id": "", "alt": "red_wisteria.webp", "src": "https://the-arkive-v3.nyc3.cdn.digitaloceanspaces.com/assets/43e1c879-415b-4394-95ad-f9a4c42a43c5/images/a1257cb6-388f-44f0-b564-419d23d60c46.webp", "crop": null, "title": "red_wisteria.webp", "width": 168, "height": 168, "rotate": null, "fileName": null, "resizable": false}}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Red wisteria is also known as \\"Bloody wisteria\\" or \\"Tainted wisteria\\" is a highly toxic variety, which grows in the southern coasts of the Mistlands.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "The seeds of this variety are harmless, but the petals can cause burns equivalent to acids of medium strength. Ingesting them is very dangerous and can cause extreme damage to the inner lining of the stomach and intestines. Smelling the plant has been known to cause burning of the lungs and even death.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Spirits are notably highly vulnerable to its effects, while dark elves seem to have a slightly higher tolerance than other humanoids.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}}, {"type": "heading", "attrs": {"id": "f7df07ed-1d2e-440d-9ed8-f3c0d6d9fc3b", "level": 2, "style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Golden wisteria", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"type": "image", "attrs": {"id": "", "alt": "golden_wisteria.webp", "src": "https://the-arkive-v3.nyc3.cdn.digitaloceanspaces.com/assets/43e1c879-415b-4394-95ad-f9a4c42a43c5/images/bf4723a8-81fc-4ded-b0e2-cc603646ec9b.webp", "crop": null, "title": "golden_wisteria.webp", "width": 165, "height": 165, "rotate": null, "fileName": null, "resizable": false}}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Golden wisteria is native to the sunny regions of the central Empire, most notably Rothrom and Rothania. Its scent is similar to that of honey and is highly favored by bees and other honey making insects.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "This variety is known to be highly toxic to high elves, while having soothing properties for other humanoids in low doses, commonly used in the form of tea as a sleep aid in the regions where it is cultivated.", "type": "text"}]}]}	\N	\N	t	\N	\N	\N	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
e30ec9a1-f057-4c07-8078-dd044c516966	2023-11-22 15:11:22.072	2024-03-28 15:42:35.922	Book 3	{"type": "doc", "content": [{"type": "heading", "attrs": {"id": "e63740cb-84c4-4a15-959e-446642666ce7", "level": 2, "style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Verse 12", "type": "text"}]}, {"type": "blockquote", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Not only great powers,", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "But burdens too.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Heavy is that number", "type": "text"}, {"type": "hardBreak"}, {"text": "Of six and two.", "type": "text"}]}]}]}	\N	\N	\N	\N	\N	\N	43e1c879-415b-4394-95ad-f9a4c42a43c5	e8c91ffb-ec7d-445d-8ca6-5de4b4531cee	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
6195d8a2-0521-4db4-a72c-d1c010145564	2023-11-13 10:58:12.507	2024-03-28 15:42:35.922	Yular	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"type": "mentionAtom", "attrs": {"id": "565e7175-64d0-4cab-85b2-c88d7adc966f", "icon": null, "name": "characters", "label": "Aurelian Pheagon", "alterId": null, "parentId": null, "projectId": "43e1c879-415b-4394-95ad-f9a4c42a43c5"}}, {"text": " ", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "8c79d399-96f6-469e-9948-ad3baa8ce483", "icon": null, "name": "characters", "label": "Ashara Mograine", "alterId": null, "parentId": null, "projectId": "43e1c879-415b-4394-95ad-f9a4c42a43c5"}}, {"text": " ", "type": "text"}]}]}	game-icons:fragmented-sword	\N	\N	\N	\N	\N	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
78f83861-1801-4e70-8f7b-6240a4a137df	2024-02-23 20:55:59.862	2024-03-28 15:42:35.922	Radekai	\N	ph:moon-fill	\N	\N	\N	\N	\N	43e1c879-415b-4394-95ad-f9a4c42a43c5	acff8290-90d4-4d25-bd86-be08bbf113ba	65d83c56-a452-4062-bca9-dba4b6eb8284	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
6e9a511e-ea64-4bbd-8bf6-d0bba57c698a	2024-02-19 11:53:57.078	2024-04-05 16:49:29.041	Mages of the Empire	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "People born with a natural aptitude for magic are rare. Proper use of serious magical spells and incantations requires years of careful, meticulous study. The resources for such grand explorations of the arcane can, and often do, get quite expensive. As such, the Pheagon Empire  has established schools in several provinces, geared towards guiding and advancing the field of magic.  ", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}}, {"type": "heading", "attrs": {"id": "fac9b399-f90c-4532-a80c-0aea818fadf3", "level": 1, "style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Schools of Magic", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Several basic schools of magic have been formed and formalized over time within the arcane school circles of the Empire. Overlap between schools exists, between some more-so than others.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}}, {"type": "orderedList", "attrs": {"order": 1}, "content": [{"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "War (Battle) Magic ", "type": "text", "marks": [{"type": "bold"}]}, {"text": "- magic used in a destructive manner on the front lines, often in the form of fiery explosions, destructive bolts of electricity, etc.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Motus magic ", "type": "text", "marks": [{"type": "bold"}]}, {"text": "- spells which transport objects and people, most commonly used by post offices in the largest cities, important institutions and individuals who can hire mages using personal funds. Spells that deal with magical storage also fall under this school", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Divination magic - ", "type": "text", "marks": [{"type": "bold"}]}, {"text": "magic of fortune-telling, prediction, prophecies and communion with divine forces", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Field magic ", "type": "text", "marks": [{"type": "bold"}]}, {"text": "- magic used to help crops grow, rid them of disease and pests; this is the most common type of magic practiced", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Restoration - ", "type": "text", "marks": [{"type": "bold"}]}, {"text": "the type of magic focused on restoring a creature to a healthy state as well as restoring items to an undamaged state", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Summoning - ", "type": "text", "marks": [{"type": "bold"}]}, {"text": "summoning creatures from the demonic and spirit realms, and beyond, and binding them to the caster's will", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Mistbending - ", "type": "text", "marks": [{"type": "bold"}]}, {"text": "magic which can alter properties of reality (changing one material to another, the shapes of objects, etc)", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Necromancy - ", "type": "text", "marks": [{"type": "bold"}]}, {"text": "magic of reanimating and resurrecting the dead; banned within the Empire after the ", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "42334e0b-7e47-48da-9f8b-83c33434e733", "icon": "", "name": "documents", "label": "War of the Night Empress", "alterId": null, "parentId": "", "projectId": "e62dcb5f-16c3-48c8-8b5b-3a8360208cf9"}}, {"text": " ", "type": "text"}]}]}]}]}	\N	\N	t	\N	\N	\N	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
62b120c5-585a-4a6f-9c90-6c976c3aaebd	2024-01-18 21:42:34.074	2024-04-29 08:11:56.094	Session notes	{"type": "doc", "content": [{"type": "tableofcontents"}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}}, {"type": "heading", "attrs": {"id": "777d7949-0fa1-4276-a0f0-4162d7125083", "level": 2, "style": "", "nodeIndent": 0, "nodeLineHeight": 1.38, "nodeTextAlignment": ""}, "content": [{"text": "Session 1 - The Tower of Kaj (04.02.2024.)", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "bulletList", "content": [{"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": 1.38, "nodeTextAlignment": ""}, "content": [{"text": "Inquisitors looking for ", "type": "text"}, {"text": "Hannibal", "type": "text", "marks": [{"type": "bold"}]}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": 1.38, "nodeTextAlignment": ""}, "content": [{"text": "Dante sends letter to the Count of the region; uses family crest, name, mentions mother; ", "type": "text"}, {"text": "Persuasion check: 20", "type": "text", "marks": [{"type": "bold"}]}]}, {"type": "bulletList", "content": [{"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": 1.38, "nodeTextAlignment": ""}, "content": [{"text": "Count is responsible for allocating resources to Fort Gundor; Dante was asking for more books on: “Mistlandian cultures and settlements, monsters and threats, plus flora and fauna”", "type": "text"}]}]}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": 1.38, "nodeTextAlignment": ""}, "content": [{"text": "Cleaning/Healing/Disinfecting pool", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": 1.38, "nodeTextAlignment": ""}, "content": [{"text": "Mist elves use little shrines dedicated to nature spirits as well as waypoints", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": 1.38, "nodeTextAlignment": ""}, "content": [{"text": "These ones were dedicated to ", "type": "text"}, {"text": "Rekshan’sur,", "type": "text", "marks": [{"type": "italic"}]}, {"text": " lord of rock", "type": "text"}]}]}]}]}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}}, {"type": "heading", "attrs": {"id": "152e4b91-d683-4f60-bab5-20a63dba8c0c", "level": 3, "style": "", "nodeIndent": 0, "nodeLineHeight": 1.38, "nodeTextAlignment": ""}, "content": [{"text": "Questions", "type": "text"}]}, {"type": "orderedList", "attrs": {"order": 1}, "content": [{"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": 1.38, "nodeTextAlignment": ""}, "content": [{"text": "Count name - ", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "c12df5fb-1beb-4450-97db-ba9636468d4f", "icon": "", "name": "characters", "label": "Cedric Thornevale", "alterId": null, "parentId": "", "projectId": "eb68433a-64b2-4bf9-92a8-5625f46ad59f"}}, {"text": " ", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": 1.38, "nodeTextAlignment": ""}, "content": [{"text": "What did Hannibal do? Blood ritual taking the lives of multiple people ", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": 1.38, "nodeTextAlignment": ""}, "content": [{"text": "Who is the motus mage for the fort? ", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "1911b480-54b9-4ea2-967c-95f201f5ea67", "icon": "", "name": "characters", "label": "Rowan Fairfax", "alterId": null, "parentId": "", "projectId": "eb68433a-64b2-4bf9-92a8-5625f46ad59f"}}, {"text": " ", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": 1.38, "nodeTextAlignment": ""}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": 1.38, "nodeTextAlignment": ""}}]}]}, {"type": "heading", "attrs": {"id": "165c0af2-4083-49e7-bed4-50aca99cdd91", "level": 2, "style": "", "nodeIndent": 0, "nodeLineHeight": 1.38, "nodeTextAlignment": ""}, "content": [{"text": "Session 2 - \\"Milf Elves\\" (18.02.2024.)", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "heading", "attrs": {"id": "77fd8f6b-fc29-481f-8dcc-a4a604e23420", "level": 3, "style": "", "nodeIndent": 0, "nodeLineHeight": 1.38, "nodeTextAlignment": ""}, "content": [{"text": "Questions", "type": "text"}]}, {"type": "orderedList", "attrs": {"order": 1}, "content": [{"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": 1.38, "nodeTextAlignment": ""}, "content": [{"text": "Book of bread recipes", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": 1.38, "nodeTextAlignment": ""}, "content": [{"text": "Elashor Preszumin", "type": "text", "marks": [{"type": "bold"}]}, {"text": " - artist who made the painting of psychedelic landscape in the tower of Kaj", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": 1.38, "nodeTextAlignment": ""}, "content": [{"text": "Vials of strong acid - ", "type": "text"}, {"text": "4d6", "type": "text", "marks": [{"type": "link", "attrs": {"auto": true, "href": "//4d6", "class": "dice-roll", "target": null}}]}, {"text": " acid damage", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": 1.38, "nodeTextAlignment": ""}, "content": [{"text": "Goblins moved into the tomb", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": 1.38, "nodeTextAlignment": ""}, "content": [{"text": "Missing person from the classroom portrait?", "type": "text"}]}]}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": 1.38, "nodeTextAlignment": ""}}, {"type": "heading", "attrs": {"id": "4643aaad-062b-4127-b5ae-7885b2ed698a", "level": 2, "style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Session 3 (03.03.2024.)", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "heading", "attrs": {"id": "77fd8f6b-fc29-481f-8dcc-a4a604e23420", "level": 3, "style": "", "nodeIndent": 0, "nodeLineHeight": 1.38, "nodeTextAlignment": "start"}, "content": [{"text": "Questions", "type": "text", "marks": [{"type": "bold"}]}]}, {"type": "orderedList", "attrs": {"order": 1}, "content": [{"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Dante asked Cedric Silvertongue for a pearl worth 100 GP", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Dante asked Cedric Silvertongue to ask around for an art collector to sell a painting to", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Rhiannon paid 70 gold to Cedric Silvertongue to get a pack mule to Fort Gundor", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "New people arrive in the fort?", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Owlbear feathers for alchemy?", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Professor Rumin invented astrology", "type": "text"}]}]}]}, {"type": "heading", "attrs": {"id": "4643aaad-062b-4127-b5ae-7885b2ed698a", "level": 2, "style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}, "content": [{"type": "hardBreak", "marks": [{"type": "bold"}]}, {"text": "Session 4 (17.03.2024.)", "type": "text", "marks": [{"type": "bold"}]}]}, {"type": "horizontalRule"}, {"type": "heading", "attrs": {"id": "77fd8f6b-fc29-481f-8dcc-a4a604e23420", "level": 3, "style": "", "nodeIndent": 0, "nodeLineHeight": 1.38, "nodeTextAlignment": "start"}, "content": [{"text": "Questions", "type": "text", "marks": [{"type": "bold"}]}]}, {"type": "bulletList", "content": [{"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Mirror from the tomb isn't magical", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Gilgolf is the leader of the goblins - will ask for 250 gold next month", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Dante brokered a deal with them and Fort Gundor for safe passage for the Viridian Pathfinders", "type": "text"}]}]}]}]}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}}, {"type": "heading", "attrs": {"id": "11e9ae2f-63d9-43ab-90b2-bf474ca80d88", "level": 2, "style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Session 5 (31.03.2024.)", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "bulletList", "content": [{"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Someone freed Fililrun by breaking the seal of his sarcophagus ", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "There is a teleportation circle in the tomb", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 1, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "LEADS TO WHERE?", "type": "text", "marks": [{"type": "bold"}]}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 1, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Dante copied the circle", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Someone was in the room but not recently", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "WHO?", "type": "text", "marks": [{"type": "bold"}]}]}]}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Dragon's name is ", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "00e5e5d0-8763-4e6a-a11a-8950811c7ed3", "icon": "", "name": "characters", "label": "Tosorith ", "alterId": "", "parentId": "", "projectId": "eb68433a-64b2-4bf9-92a8-5625f46ad59f"}}]}]}]}]}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "WHERE DID YUAN TI COME FROM ? ", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": null}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": null}}]}]}, {"type": "heading", "attrs": {"id": "11e9ae2f-63d9-43ab-90b2-bf474ca80d88", "level": 2, "style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}, "content": [{"text": "Session 6 (14.04.2024.)", "type": "text", "marks": [{"type": "bold"}]}]}, {"type": "horizontalRule"}, {"type": "bulletList", "content": [{"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Make recipe for Hyperia mushroom", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Tash -> add new stock to blacksmith thanks to him", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Add more survival encounters in the wild options", "type": "text"}]}]}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}}, {"type": "heading", "attrs": {"id": "11e9ae2f-63d9-43ab-90b2-bf474ca80d88", "level": 2, "style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}, "content": [{"text": "Session 7 (28.04.2024.)", "type": "text", "marks": [{"type": "bold"}]}]}, {"type": "horizontalRule"}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}}, {"type": "heading", "attrs": {"id": "11e9ae2f-63d9-43ab-90b2-bf474ca80d88", "level": 2, "style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}, "content": [{"text": "Session 8 (?.?.2024.)", "type": "text", "marks": [{"type": "bold"}]}]}, {"type": "horizontalRule"}, {"type": "bulletList", "content": [{"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Tash has helped with making some armors", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "He has also brought knowledge about blasting powder and how to make it ", "type": "text"}]}]}]}]}]}]}	\N	\N	\N	\N	\N	\N	eb68433a-64b2-4bf9-92a8-5625f46ad59f	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
19a96d00-e811-4b39-aea2-b9b4ca7e7196	2024-02-03 18:12:25.649	2024-04-05 19:12:17.217	Lunar blades	{"type": "doc", "content": [{"type": "tableofcontents"}, {"type": "heading", "attrs": {"id": "8a39e890-7749-4757-afb3-0043113d7373", "level": 2, "style": "", "nodeIndent": 0, "nodeLineHeight": 1.33333, "nodeTextAlignment": "start"}, "content": [{"type": "hardBreak", "marks": [{"type": "bold"}]}, {"text": "Creation", "type": "text", "marks": [{"type": "bold"}]}]}, {"type": "horizontalRule"}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}, "content": [{"text": "Lunar blades, Luna blades, or Umbrian steel (occasionally called Chetuari swords) are swords forged at night under the light of one or both full moons. Because time to craft such a blade is limited and is dependent to a large extent on weather conditions, the preparation process is done months in advance and involves the use of powerful weather control magic to ensure a successful outcome. Several special things are required to craft these blades.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}, "content": [{"text": "First, a special forge is required, one which possesses focusing mirrors capable of concentrating moonlight. These forges are quite rare in the west of Salaraan, mostly located in the Elven Diarchy, though smiths capable of utilizing them are even rarer.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}, "content": [{"text": "Second, a large amount of moon dust, of Torenai, Radekai, or both, is needed to be melted down with the forge and fused with pure steel and made into a blade. Blades produced in this manner take on the color of the moon dust that was used - blue for Torenai, red for Radekai, and purple if both are used.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}, "content": [{"text": "Development of techniques, both ancient and more recent, for smithing a sword with different concentrations of moonlight and moon dust have not yielded any fruitful results. The specific amount and combination of moonlight and dust to create purple blades are unknown. An incorrect formula leads to weapons that are too brittle to be useful in any scenario.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}}, {"type": "heading", "attrs": {"id": "382682d5-bf74-4665-91b3-b4d175aa3324", "level": 2, "style": "", "nodeIndent": 0, "nodeLineHeight": 1.33333, "nodeTextAlignment": "start"}, "content": [{"text": "Types of blades", "type": "text", "marks": [{"type": "bold"}]}]}, {"type": "horizontalRule"}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}}, {"type": "heading", "attrs": {"id": "46f5337a-8561-4778-bd98-2656b2f90999", "level": 4, "style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Purple blades", "type": "text", "marks": [{"type": "bold"}]}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}, "content": [{"text": "The rarest and most difficult to make are the purple blades, and only 5 are known to have been made. The current location of three of these blades lies unknown. Both full moons must be out on a cloudless night, with a large amount of both blue and red moon dust used in the special forge in order to create these blades.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}, "content": [{"text": "These blades are extremely powerful against spirits, particularly those associated with the sun, light, and daytime. They also have some of the most powerful anti-illusion capabilities and energy absorption abilities, again particularly against light in any form.", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "One was fashioned by Temris, a mythical figure, said to be the original maker of all three types of lunar blades. This sword is currently in the possession of the ", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1", "icon": "", "name": "graphs", "label": "Pheagon Dynasty", "alterId": "", "parentId": "", "projectId": "43e1c879-415b-4394-95ad-f9a4c42a43c5"}}, {"text": ".", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "A purple lunar blade is in the possession of the Katavari Conclave, who grant its use to their leader, in their \\"holy fight against the dawn.\\" The maker and origins of this blade are unknown.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}}]}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}}, {"type": "heading", "attrs": {"id": "79cbced6-097c-476b-9d75-d3d1bb4e34ce", "level": 4, "style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Red blades", "type": "text", "marks": [{"type": "bold"}]}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}, "content": [{"text": "These blades must be made when Radekai is in the Lantern phase and Torenai is not visible, under a clear night sky. A large amount of red moon dust is needed.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}, "content": [{"text": "Red blades are powerful absorbers of fire and heat and can release the absorbed energy at a later point. They've been used to control and extinguish entire forest fires in short notice. They are effective against ice elementals, mephits, imps, yetis, and white dragons.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}, "content": [{"text": "The exact number of red blades (sometimes called \\"Thorns of Radekai\\") is unknown. Most reputable counts put the number at 13, while the highest counts go up to 23. While the location of eight blades is known to historians, the rest remain a mystery.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": " ", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}, "content": [{"text": "The locations of the red blades ", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "79dcda36-292f-4b6b-b555-0d0c760d0360", "icon": "game-icons:crossed-swords", "name": "blueprint_instances", "label": "Fury", "alterId": "", "parentId": "", "projectId": "43e1c879-415b-4394-95ad-f9a4c42a43c5"}}, {"text": ", ", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "f56e9300-9e36-479f-b001-8a475edc29a3", "icon": "game-icons:crossed-swords", "name": "blueprint_instances", "label": "Esfahil", "alterId": "", "parentId": "", "projectId": "43e1c879-415b-4394-95ad-f9a4c42a43c5"}}, {"text": ", ", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "66fb4390-0fc2-4dce-8840-e744171f1d7d", "icon": "game-icons:crossed-swords", "name": "blueprint_instances", "label": "Reaver's Edge", "alterId": "", "parentId": "", "projectId": "43e1c879-415b-4394-95ad-f9a4c42a43c5"}}, {"text": ", and 2 unnamed ones are currently unknown.", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"type": "mentionAtom", "attrs": {"id": "4cde42c9-11da-4134-9c96-776d777e818b", "icon": "game-icons:crossed-swords", "name": "blueprint_instances", "label": "Offenbach's Blade", "alterId": "", "parentId": "", "projectId": "43e1c879-415b-4394-95ad-f9a4c42a43c5"}}, {"text": " - the blade is in the possession of a former noble family from Aldon, in the southern Empire. The maker of the blade is unknown.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"type": "mentionAtom", "attrs": {"id": "93f9860e-9875-488f-8df7-e297746c78a0", "icon": "game-icons:crossed-swords", "name": "blueprint_instances", "label": "Helena's Ire", "alterId": "", "parentId": "", "projectId": "43e1c879-415b-4394-95ad-f9a4c42a43c5"}}, {"text": " - a blade in the possession of the descendants of Helena of Irkvale, a knight in the War of the Night Empress, who used it against the night side of the war.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"type": "mentionAtom", "attrs": {"id": "ebdaafa6-5f70-4bed-aca3-62d0f0aca6cc", "icon": "game-icons:crossed-swords", "name": "blueprint_instances", "label": "Rykeford's Curse", "alterId": "", "parentId": "", "projectId": "43e1c879-415b-4394-95ad-f9a4c42a43c5"}}, {"text": " - the small village of Rykeford has a statue to an unknown warrior which holds a red blade in its hands. In the past, many attempts at taking the blade were made but all who tried were met with a gruesome and horrid fate, thus earning the blade its name. Attempts to steal it are very rare due to the blade's reputation. It is currently unknown whether the blade is truly cursed, or if these are simply local legends.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"type": "mentionAtom", "attrs": {"id": "597c9659-8151-459c-a1f7-e35060407fee", "icon": "game-icons:crossed-swords", "name": "blueprint_instances", "label": "Eskalad", "alterId": "", "parentId": "", "projectId": "43e1c879-415b-4394-95ad-f9a4c42a43c5"}}, {"text": " - the red blade is in the possession of a lesser Xafian nobleman, near the border with the Empire (Phymon).", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "The wizard ", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "84f9f03d-241d-41a1-9fa6-7a13c39c9608", "icon": "", "name": "characters", "label": "Celbrion ", "alterId": "", "parentId": "", "projectId": "43e1c879-415b-4394-95ad-f9a4c42a43c5"}}, {"text": "of Kos'thrashar in the Diarchy is in the possession of a red blade.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"type": "mentionAtom", "attrs": {"id": "e82fb25c-3677-4188-a2c6-c9100edbbe51", "icon": "game-icons:crossed-swords", "name": "blueprint_instances", "label": "Boiling Blood", "alterId": "", "parentId": "", "projectId": "43e1c879-415b-4394-95ad-f9a4c42a43c5"}}, {"text": " - A red blade that was in the possession of Kyton IV Pheagon, Whitehair, who was also the maker of the blade. It's currently held by ", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "565e7175-64d0-4cab-85b2-c88d7adc966f", "icon": "", "name": "characters", "label": "Aurelian Pheagon", "alterId": "", "parentId": "", "projectId": "43e1c879-415b-4394-95ad-f9a4c42a43c5"}}, {"text": ".", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "A red blade is in the possession of the Imperial War Museum in Wartia. The maker of the blade is ", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "73125719-319c-430f-88d9-5cda7dc72eb1", "icon": "", "name": "characters", "label": "Temris ", "alterId": "", "parentId": "", "projectId": "43e1c879-415b-4394-95ad-f9a4c42a43c5"}}, {"text": "and is one of the original three blades that were made.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "A red blade is located (amongst other possessions) in the hoard of the red dragon  Obraxas, who resides in the lava pits in the deserts of Ulundir.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}}]}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}}, {"type": "heading", "attrs": {"id": "2bf7bf03-d9d0-4889-b461-b01466dce442", "level": 4, "style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Blue blades", "type": "text", "marks": [{"type": "bold"}]}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}, "content": [{"text": "Blue blades can only be made while Torenai is in its Eye phase, while Radekai is not visible, under a clear night sky, and using a sufficient amount of blue moon dust.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}, "content": [{"text": "These blades can emit a specific type of light which dispels illusions and clears the mind of any kind of psychomancy spells and effects. They are most effective against any type of obscura demons.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}, "content": [{"text": "The exact number of these blades is also unknown, with some estimates putting the count as high as 15.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}, "content": [{"text": "The locations of the blades ", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "39cfee77-7c80-4361-b8bf-2b2cfa26272d", "icon": "game-icons:crossed-swords", "name": "blueprint_instances", "label": "Norendil", "alterId": "", "parentId": "", "projectId": "43e1c879-415b-4394-95ad-f9a4c42a43c5"}}, {"text": " (one of the original three made by Temris), ", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "946c2993-6893-4e04-abe2-7dad0f115eb8", "icon": "game-icons:crossed-swords", "name": "blueprint_instances", "label": "Greta's Tooth", "alterId": "", "parentId": "", "projectId": "43e1c879-415b-4394-95ad-f9a4c42a43c5"}}, {"text": ", ", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "f886d899-a0ac-4b90-8ec2-9daa08d46926", "icon": "game-icons:crossed-swords", "name": "blueprint_instances", "label": "Gautcha", "alterId": "", "parentId": "", "projectId": "43e1c879-415b-4394-95ad-f9a4c42a43c5"}}, {"text": ", ", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "3400134a-1d11-410b-9e1d-c9c7dd31c7bd", "icon": "game-icons:crossed-swords", "name": "blueprint_instances", "label": "Orienna", "alterId": "", "parentId": "", "projectId": "43e1c879-415b-4394-95ad-f9a4c42a43c5"}}, {"text": ", and 7 others are currently unknown.", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "One blade is located in a white dragon's hoard in the Sarthian Wastes, amongst other treasures.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "A blade lies somewhere at the bottom of Lake Argyris, lost during a storm which destroyed an Imperial merchant ship.            ", "type": "text"}]}]}]}]}	game-icons:fragmented-sword	\N	t	\N	\N	\N	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
7dde2c9c-fe5b-4e6f-a392-a9696dec3742	2024-03-24 08:08:27.741	2024-03-28 15:42:35.922	Campaign Guide	\N	\N	t	\N	\N	\N	\N	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
c652e616-77f4-456d-b5d4-7f064028a88e	2024-03-24 08:23:00.066	2024-03-28 15:42:35.922	Thessapolis	\N	game-icons:floating-platforms	\N	\N	\N	\N	\N	43e1c879-415b-4394-95ad-f9a4c42a43c5	af59a143-4214-4477-b607-3e0a7cb3376b	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
acff8290-90d4-4d25-bd86-be08bbf113ba	2024-01-22 08:22:49.248	2024-03-28 15:42:35.922	Celestial bodies	\N	\N	t	f	\N	\N	\N	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
9afb41f7-b413-4950-90ff-9893066daf77	2024-01-12 18:53:46.866	2024-04-26 11:03:16.721	Divine hierarchy	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "While different in essence, both spirits and demons mirror each other in many ways. One such parallel is the structure of their hierarchies.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}}, {"type": "tableofcontents"}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}}, {"type": "heading", "attrs": {"id": "c9168ee8-d0d9-42ac-b4dc-35107e41932a", "level": 1, "style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "The Divine", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "The Divine are beings of such inordinate power that they are revered as gods not just amongst mortals but amongst their own kind as well. They embody large pantheons, under which other members of the hierarchy fall under, such as ", "type": "text"}, {"text": "light ", "type": "text", "marks": [{"type": "italic"}]}, {"text": "or ", "type": "text"}, {"text": "darkness. ", "type": "text", "marks": [{"type": "italic"}]}, {"text": "They are often referred to as ", "type": "text"}, {"text": "High Spirits ", "type": "text", "marks": [{"type": "italic"}]}, {"text": "or ", "type": "text"}, {"text": "High Demons", "type": "text", "marks": [{"type": "italic"}]}, {"text": ", indicating their risen status within the hierarchy.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}}, {"type": "blockquote", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "What is power but the ability to choose another's fate?", "type": "text", "marks": [{"type": "bold"}]}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "    ", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "    -Keltren Filmore, priest of Fragor", "type": "text", "marks": [{"type": "italic"}]}]}]}, {"type": "heading", "attrs": {"id": "588ee340-af06-414a-a098-0540d0d466c0", "level": 1, "style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}}, {"type": "heading", "attrs": {"id": "75fe97be-4ade-4cf1-9218-5d47d6833cc7", "level": 1, "style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Archangels and Archdevils", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Archangels and Archdevils are one step below the gods themselves, often considered the right hand of their respective deity or even a god-candidate, the next in line to take over the position in the Pantheon. They often hold the trust of the god they serve, commanding entire legions or having permission to engage in high level contracts with mortals. They are often revered in their own right, with lesser cults and temples spread throughout the world. ", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Famous examples include ", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "06d43ae7-a804-4072-aa37-14800b4b13f1", "icon": "", "name": "characters", "label": "Sicarius ", "alterId": null, "parentId": "", "projectId": "43e1c879-415b-4394-95ad-f9a4c42a43c5"}}, {"text": " ", "type": "text"}, {"text": "(The Scythe of Mersus).", "type": "text", "marks": [{"type": "italic"}]}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}}, {"type": "heading", "attrs": {"id": "e7d40b7f-f812-490f-b643-8cdef2f82e27", "level": 2, "style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Deathwalkers", "type": "text"}]}]}	game-icons:angel-outfit	\N	t	\N	\N	\N	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
2e38077e-c0ad-4938-b41e-3e90a108f5ff	2023-12-26 18:13:07.513	2024-04-20 17:40:58.988	Ektnaar elves	{"type": "doc", "content": [{"type": "heading", "attrs": {"id": "477d8b2c-c69e-48ab-9367-fbce4f70a52b", "level": 2, "style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Clans", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "The Ektnaar elves are divided into ten clans. They are not formed based on blood relations. Rather, a person can move to different clans throughout their life, based on merit and various trials which are held within each of the clan grounds. Ascending to a clan of higher status is seen as a great honor, while falling down the ranks is considered a disgrace.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Ektnaar elves typically fashion their full names as \\"", "type": "text"}, {"text": "clan name,", "type": "text", "marks": [{"type": "italic"}]}, {"text": " ", "type": "text"}, {"text": "first name", "type": "text", "marks": [{"type": "italic"}]}, {"text": ", ", "type": "text"}, {"text": "family name", "type": "text", "marks": [{"type": "italic"}]}, {"text": "\\". For example: ", "type": "text"}, {"text": "Brannmur Kjal, Valiss. ", "type": "text", "marks": [{"type": "italic"}]}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "The clans are:", "type": "text"}]}, {"type": "orderedList", "attrs": {"order": 1}, "content": [{"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Dörr", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Svärd", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Sundqvist", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Malmqvist", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Källström", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Forslund", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Drakberg", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Brannmur", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Iggdreper", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Formynder", "type": "text"}]}]}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}}, {"type": "heading", "attrs": {"id": "f024402a-d782-46fe-a46d-d0bda9de641f", "level": 2, "style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Religion", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "The Ektnaar elves follow a religion in which they worship ", "type": "text"}, {"text": "Vårdnadshavare", "type": "text", "marks": [{"type": "spoiler"}]}, {"text": "  - elves who were selected to act as guardians in the lowest levels, serving until the end of their days as wards against the ", "type": "text"}, {"text": "Iglarkung", "type": "text", "marks": [{"type": "spoiler"}]}, {"text": ". They are usually selected from amongst the strongest and wisest members of the top three clans, to venture forth into the depths below the tenth level, and face their enemy, joining the fallen until the end times come, when they will be called to battle one last time.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Descendants of these guardians take great pride in their heritage, some even going to state it before their own name (but always strictly after the clan name).", "type": "text"}]}]}	\N	\N	t	\N	\N	\N	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
11b6875d-fff6-4034-83fd-dffcb48f1f0c	2024-03-24 08:22:49.165	2024-03-28 15:42:35.922	Maat'len	\N	game-icons:floating-platforms	\N	\N	\N	\N	\N	43e1c879-415b-4394-95ad-f9a4c42a43c5	af59a143-4214-4477-b607-3e0a7cb3376b	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
e8c91ffb-ec7d-445d-8ca6-5de4b4531cee	2023-11-22 15:07:27.263	2024-03-28 15:42:35.922	Prophecies of the Red Witch	\N	\N	t	\N	\N	\N	\N	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
3cf3265f-b9c8-4b35-9bd9-572e79e0472c	2023-11-22 15:07:37.725	2024-03-28 15:42:35.922	Book 24	{"type": "doc", "content": [{"type": "tableofcontents"}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}}, {"type": "heading", "attrs": {"id": "c33be636-b230-442d-a92d-d556df50b32e", "level": 2, "style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Verse 1", "type": "text"}]}, {"type": "heading", "attrs": {"id": "5da12732-bbbd-4fc6-8e21-53d40443b6e3", "level": 2, "style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Verse 2", "type": "text"}]}, {"type": "blockquote", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Neither angel nor devil,", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "But worse than hell.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "A being of soul,", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "And its bloody well.", "type": "text"}]}]}]}	\N	\N	\N	\N	\N	\N	43e1c879-415b-4394-95ad-f9a4c42a43c5	e8c91ffb-ec7d-445d-8ca6-5de4b4531cee	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
5fdf54cd-4857-4e28-b5c6-890b8e641ba5	2024-03-24 09:21:14.359	2024-03-28 15:42:35.922	Prophecies	{"type": "doc", "content": [{"type": "blockquote", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "The gods made no man,", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Man made the gods.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Canvases painted, at first blank", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Now opposed forever, until time comes back.", "type": "text"}]}]}, {"type": "blockquote", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Love killed love, and nightmare took form.", "type": "text"}]}]}, {"type": "blockquote", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Love makes time.", "type": "text"}]}]}, {"type": "blockquote", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Strings pulled from the birth of time,", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "From love to courage and the rest.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Is it worth persisting?", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "The world repeats its eternal test.", "type": "text"}]}]}, {"type": "blockquote", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "The dragonkin were first,", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Now twisted to a different breed.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "They weep with tears of sorrow", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "For having betrayed their creed.", "type": "text"}]}]}, {"type": "blockquote", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "The final battle is not the end.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "A change of kind to make her repent.", "type": "text"}]}]}, {"type": "blockquote", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Three ages shall there be.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "One for man.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "One for god.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "One for all the rest.", "type": "text"}]}]}, {"type": "blockquote", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "He will die many times, ", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "As many will she rise.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Together they will try to unite,", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "There will be no light, no light.", "type": "text"}]}]}, {"type": "blockquote", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Numbers more than divine make up all.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Eight, three, twelve and four.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "No more, no more.", "type": "text"}]}]}, {"type": "blockquote", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "How can it be that only you can see? ", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Cursed with sight, which sets others free", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Trapped because of blood - a pity, a pity.", "type": "text"}]}]}, {"type": "blockquote", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "I cry each day, for the eye in the sky.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Its heart numb with nothing in it.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "It wants to go free, but it cannot see,", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "The wish keeps it trapped, not we.", "type": "text"}]}]}, {"type": "blockquote", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "When the dead are given voice through living flesh,", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Not as echoes but in their true form,", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "The world will lose all norm.", "type": "text"}]}]}, {"type": "blockquote", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "She died saying truth, now bound in chains", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "From which she tried to free them.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Cast out, roaming, without a home", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "They give her no rest, for she is wicked.", "type": "text"}]}]}, {"type": "blockquote", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Three brothers and a sister", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "At war they will be.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Bloody is the answer.", "type": "text"}]}]}, {"type": "blockquote", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "In the coldest reach", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "A dragon's mountain lies.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "In it the questions", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "No one knew were asked.", "type": "text"}]}]}, {"type": "blockquote", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "One still flies and makes magic seep.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Thoughts around it liquid, float up from the deep.", "type": "text"}]}]}, {"type": "blockquote", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Can you see it? The strings pulled in jest.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "A key found in the forest, it's all a test.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "She placed it there knowing", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "The lover seeks him out,", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Though completely unaware.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "A brother in doubt,", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "One he cannot scare.", "type": "text"}]}]}, {"type": "blockquote", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "What is her worth in the end?", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Her purpose was known at birth.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Is this all she is?", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Or will she prove more than her?", "type": "text"}]}]}, {"type": "blockquote", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Not only great power", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "But burdens too.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Heavy is that number,", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Of six and two.", "type": "text"}]}]}, {"type": "blockquote", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "An eye for an eye,", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "A heart for a heart.", "type": "text"}]}]}, {"type": "blockquote", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Only love can kill love.", "type": "text"}]}]}, {"type": "blockquote", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "After fire shall come ice.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "When love kills love once more,", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "The final crown will fall.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "The second battle, but not the end.", "type": "text"}]}]}, {"type": "blockquote", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "With each beginning", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Must come an end.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "With each end ", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "A chance to amend.", "type": "text"}]}]}, {"type": "blockquote", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Neither angel or devil", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "But worse than hell.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "A being of soul,", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "And its bloody well.", "type": "text"}]}]}]}	\N	\N	\N	\N	\N	\N	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
6347c93f-d5d1-470e-b23d-e2f5527869ff	2024-03-24 08:11:01.941	2024-03-28 15:42:35.922	The Gods	{"type": "doc", "content": [{"type": "blockquote", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": "center"}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "\\"", "type": "text"}, {"text": "The gods made no man,", "type": "text", "marks": [{"type": "italic"}]}, {"type": "hardBreak", "marks": [{"type": "italic"}]}, {"text": "Man made the gods.", "type": "text", "marks": [{"type": "italic"}]}, {"text": "\\"", "type": "text"}]}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}}, {"type": "heading", "attrs": {"id": "20c37e74-4545-413c-8336-6b1f0c3d7cd2", "level": 1, "style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Origins", "type": "text"}]}, {"type": "horizontalRule"}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Near the end of the age of Man, various scientific experiments were conducted, their claimed goal to bring prosperity and progress to all. They were attempts at advancing the technology of flight to reach even greater heights, medicine to cure the incurable, alchemical concoctions that sped up the growth of crops and kept pests at bay. At least, those were the ones shown and displayed to the public. In reality, it was an arms race among the twelve flying cities, seeking to dominate and rule the rest.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Among these cities, ", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "11b6875d-fff6-4034-83fd-dffcb48f1f0c", "icon": "", "name": "documents", "label": "Maat'len", "alterId": null, "parentId": "", "projectId": "43e1c879-415b-4394-95ad-f9a4c42a43c5"}}, {"text": " was, by all contemporary accounts, chief in every aspect. It's size and populace eclipsed the next couple of cities combined, its resources vast, weapons of mightiest caliber, magic of world changing might, and more. It was these and other aspects that led to them believing to be ", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "ac9104a8-99e8-4f48-bcaf-9ff11eb0c02b", "icon": "", "name": "words", "label": "Sol'aren", "alterId": null, "parentId": "", "projectId": "43e1c879-415b-4394-95ad-f9a4c42a43c5"}}, {"text": " , going so far as to state that they alone had the cosmic mandate to rule. The rest only saw this as blundering hubris, and nothing more.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "The chief scientists of Maat'len, however, sought to transform word into action. They build ", "type": "text"}, {"text": "The Helix", "type": "text", "marks": [{"type": "italic"}]}, {"text": ", a towering, multikilometer tall tower in the shape of a helix, made entirely of gold and brass, pointing to the heavens themselves. The contraption's intended purpose was to transport them to worlds which orbited around the distant stars, to spread their might beyond the mere confines of this single world.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "At the same time, another, world altering experiment was being conducted. The scientists sought to unshackle themselves and their people, to remove the internal limitations of ", "type": "text"}, {"text": "morality ", "type": "text", "marks": [{"type": "italic"}]}, {"text": "that they believed were limiting them. To do so, they split their souls into three components. One would become the first ", "type": "text"}, {"text": "spirits, ", "type": "text", "marks": [{"type": "italic"}]}, {"text": "the other the first ", "type": "text"}, {"text": "demons", "type": "text", "marks": [{"type": "italic"}]}, {"text": " and what was left were called ", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "a2ca36bb-1a3a-4843-913c-72a6abb3fb32", "icon": "", "name": "words", "label": "Artifex", "alterId": null, "parentId": "", "projectId": "43e1c879-415b-4394-95ad-f9a4c42a43c5"}}, {"text": " , and would later be scorned as those that brought the downfall of the age of man.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "These newly created beings were blank, impressionable canvases. At first, they had no opinions, no personality, no reactions to events that unfolded around them. Over time, however, they were exposed to various aspects of mortal lives - birth, death, love, loss, hatred, friendship, justice, injustice, sickness, recovery and so on, as well as natural phenomena such as darkness, light, nature, wildlife, etc. and how those affected the mortals. This would lead them to absorb and embody these various aspects, gaining metaphysical abilities to control these elements of reality and bend them to their wills. This was the birth of the first gods.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "The Spirits and Demons of old would come to clash with their creators and mankind as a whole. They were opposed to the creation of the Helix, deeming it a threat to not only themselves, but their creators, and sought to curtail their hubris and ambitions to conquer the stars. This led to the conflict, known as the _______________, which would lead to the fall of the twelve cities, both metaphorically and physically (The site of Maat'len's fall would become Lilac bay). This marked the fall of the age of man, and the beginning of the age of the gods.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}}]}	game-icons:angel-outfit	\N	t	\N	\N	\N	43e1c879-415b-4394-95ad-f9a4c42a43c5	7dde2c9c-fe5b-4e6f-a392-a9696dec3742	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
593f8e49-dbc5-4875-98ec-47556411b981	2024-02-23 21:02:50.569	2024-03-28 15:42:35.922	Torenai	\N	\N	\N	\N	\N	\N	\N	43e1c879-415b-4394-95ad-f9a4c42a43c5	acff8290-90d4-4d25-bd86-be08bbf113ba	2bd891e2-ebb0-4565-82a3-f64d51068b9e	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
0de85fe9-ff3c-4b71-a069-5e64ab389be0	2024-02-23 21:05:00.849	2024-03-28 15:42:35.922	Historic figures	\N	\N	t	\N	\N	\N	\N	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
2ab7fa61-c9af-4cb9-8ff7-28687b906456	2024-03-03 10:02:49.697	2024-03-31 11:33:46.224	Books sent to Dante by count	{"type": "doc", "content": [{"type": "orderedList", "attrs": {"order": 1}, "content": [{"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "\\"Codex Arcanum: Creatures of the Enchanted Realm\\"", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "\\"Beastiary of Eldritch Wonders\\"", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "\\"Floral Chronicles: A Garden of Mystical Blooms\\"", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "\\"Monstrous Mosaics: Tales of Legendary Beasts\\"", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "\\"Fauna Fantasia: Creatures from Realm Unknown\\"", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "\\"Secrets of the Sylvan Bestiary\\"", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "\\"The Alchemist's Guide to Mythical Plants\\"", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "\\"A Compendium of Elemental Creatures\\"", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "\\"Lore of the Cryptid Kingdoms\\"", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "\\"The Elysian Codex: Guardians of Nature\\"", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "\\"Legends Among Leaves: Tales of Fantastic Flora\\"", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "\\"Mystic Menagerie: Beasts Beyond Belief\\"", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "\\"Wonders of the Wilderness: A Guide to Fantastical Fauna\\"", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "\\"Beasts and Blossoms: Chronicles of an Enchanted Ecology\\"", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "\\"The Rustic Atlas: Creatures of the Rusting Realms\\"", "type": "text"}]}]}]}]}	\N	\N	t	\N	\N	\N	eb68433a-64b2-4bf9-92a8-5625f46ad59f	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
3177e2ac-9ffa-43af-bef3-ef4f20d14a2e	2023-11-22 14:24:38.008	2024-03-28 15:42:35.922	Random facts	{"type": "doc", "content": [{"type": "orderedList", "attrs": {"order": 1}, "content": [{"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Only one Sovereign held the title of Archmage.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "There are two statues in Old Haven its founders, one with the symbol of a heart, the other of the sun.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "There can only be one of each Paragon.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "The position of Prime of the Imperial Council (and consequently the Council itself) was created because the Emperor at the time was bored.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "There are two types of werewolves: true and curseborn.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": " Juliette's theme song is \\"Provocateur\\" by ZHU. ", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "The \\"Prophecies of the Red Witch\\" are divided into 36 tomes, containing about 4300 prophecies of varying lengths.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Adopted children are seen as equal to biological children in the eyes of Imperial law.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "\\" ", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "0cb87e5a-ee9f-4154-b48a-c049ba9ec26b", "icon": "", "name": "documents", "label": "Maat'len", "alterId": "", "parentId": "", "projectId": "43e1c879-415b-4394-95ad-f9a4c42a43c5"}}, {"text": " \\" means \\"House of Order\\" in Elvish.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Imperial citizens can be stripped of their citizenship only by a decision from the Imperial High Court. ", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "The city of Galaron is named after Galaron the bold, a knight who fought in the War of the Night Empress.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Yuldei is named after Yular,  a knight who fought in the War of the Night Empress.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"type": "mentionAtom", "attrs": {"id": "aaa02323-5478-4373-9e25-bb1735c00e0e", "icon": "", "name": "characters", "label": "The Pheagon ", "alterId": "", "parentId": "", "projectId": "43e1c879-415b-4394-95ad-f9a4c42a43c5"}}, {"text": "is a near mythical figure and founder of the Pheagon Kingdom, which grew into the Empire that is today.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Sarthians are mostly atheists (attributing no divinity to the High Spirits and Demons).", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Imperial citizens cannot be executed, unless stripped of their citizenship.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "There are many families related to the Pheagons.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Members of the Pheagon dynasty are forbidden, by law, to adopt children.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "In the Imperial province of Onys it is illegal to throw away potatoes.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Senators of the Imperial Senate serve for 15 years, and can serve only once.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Viscounts are elected officials who govern the provinces of the Empire.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Aurelian Pheagon middle name is Marcus.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "The people of Ulundir worship half-mortal half-animal gods, of which there are eight.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Soul fire or soul flame cannot be put out by normal means.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "There are very few individuals who can produce soul fire.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "The three most powerful types of magic are song magic, soul magic and will magic.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "The Imperial Capital is divided into 18 wards, each with its own mayor.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Ektnaar elves are thought to be the most capable practitioners of song magic.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "High elves are, on average, the least proficient in magic.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "The Elvish Diarchy is ruled by a High elven King and Do'Rau queen, making a tense union.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "\\"The Dance\\" is the grand political game of Sarth, where everyone competes for power and prestige.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "A common Xafian saying is that a person is \\"never more than a hundred steps from the nearest vampire\\".", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Metallic and chromatic dragons are the result of dragonkin interbreeding with spirits and demons.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Each year, many lives are lost due to expeditions to the Mistlands.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "There are 10 paths, each with 10 forms, that the  has practiced.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "The Path of Soul is considered to be the hardest path of the Way of the Thousand souls to master.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "There are no orders dedicated to the Path of Soul, most likely due to its difficulty.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "A Paragon of Love can die of old age, disease or curses.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "The Paragon of Sincerity has appeared the fewest times over recorded history (three times) of all the Paragons.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "There have only been four Paragons of Knowledge.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Some Prophecies of the Red Witch speak of the past, others of the future. The rest - unknown.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "No one has returned from a voyage to the continent of Turaan.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "The city of Vesris  was named after Vesris Pheagon, following his death/sacrifice.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "During the age of Maat'len, people could freely change their appearance/shape; the degree to which they could do so varied from person to person.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "The Empire is comprised of 38 provinces, each varying in culture, language or dialect, religion etc.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "The war between the Empire and Arlonian kingdoms is referred to as \\"The Long war\\".", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "The war between the Empire and Sarth is referred to as \\"The Eternal War\\" and \\"Neverending Clash\\".", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Inquisitors compete for \\"the Sovereign's favor\\", which is granted once every ten years.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Both spirits and demons offer contracts to people, despite the common belief that only devils do so.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "The Shattered Coast in the Western Empire was not always shattered.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Spirit/Mortal and Demon/Mortal children are most often stillborn.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "The official title of the ruler of the Pheagon Empire is \\"Sovereign\\".", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "\\"", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "c52a229e-8b07-4b33-80a4-a4aa6b41cc6d", "icon": null, "name": "words", "label": "Pheagon", "alterId": null, "parentId": null, "projectId": "43e1c879-415b-4394-95ad-f9a4c42a43c5"}}, {"text": "\\" is a title, not a last name.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Members of the Pheagon dynasty technically do not have a last name.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "The High King/Queen of Arlon is often involved in a power struggle with the rulers of Sarth and Xaf.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Maat'len was one of twleve flying cities that existed in its time.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "There are two types of vampires: demonic and curseborn.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Only demonic vampires can have thralls and create vampire servants.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Tel'Vandor Athrell (\\"Forest of many places\\" in elvish) is a forest that can transport a person to any region of the world, but only if it so chooses.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Within the Empire, the Imperial language is sometimes referred to as the \\"Sovereign's tongue\\".", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "\\"Pheagon\\" means protector in Old Imperial.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Spirits and Demons speak languages related to Old Imperial; they are somewhat mutually intelligible.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "The Ercaryn were elves who could access the memories of others.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Naar elves practice a form of magic called the \\"Stonesong\\".", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "There are only 2 Skyports within the Pheagon Empire - In the Capital and Hilus.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "High elves are considered the most capable inventors in the world.", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "High elves are considered the creators of many inventions - skyships, hovercraft, automatons of various kinds...", "type": "text"}]}]}, {"type": "listItem", "attrs": {"closed": false, "nested": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": ""}, "content": [{"text": "Imperials whose ancestors have been stripped of their citizenship, but are citizens themselves, have the \\"____\\" prefix added to their last name.", "type": "text"}]}]}]}]}	\N	\N	t	\N	\N	\N	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
02172720-1e3d-4b9f-a214-3c407bacc3ac	2024-01-23 12:18:34.241	2024-03-28 15:42:35.922	Scrap planning	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "sjea", "type": "text"}]}]}	\N	\N	\N	\N	\N	#eab308	dcd1d7c5-4096-47bf-8214-337e5a596306	\N	\N	5d89de13-a71e-409e-8817-10763812e82d	\N
c3511f25-4abd-4a3b-8381-75591a83c9bd	2024-02-10 10:24:26.206	2024-03-28 15:42:35.922	Eddard Stark	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"type": "mentionAtom", "attrs": {"id": "a50a4981-40e4-44ae-82ff-27b6c4077ac2", "icon": "", "name": "characters", "label": "Eddard Stark", "alterId": "", "parentId": "", "projectId": "77cb0278-b9c7-43b5-bd30-e72022eacf11"}}, {"text": ", commonly known as Ned, is a central character in both the \\"A Song of Ice and Fire\\" book series by George R.R. Martin and the television adaptation, \\"Game of Thrones.\\" He is the head of ", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "36bae4e6-7aa3-4375-b1fe-637e2bb83cb2", "icon": "game-icons:bolt-shield", "name": "blueprint_instances", "label": "House Stark", "alterId": "", "parentId": "", "projectId": "77cb0278-b9c7-43b5-bd30-e72022eacf11"}}, {"text": ", one of the Great Houses of Westeros, and rules the North from his ancestral seat, Winterfell.", "type": "text"}, {"type": "hardBreak"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}, "content": [{"text": "Ned is characterized by his strong sense of honor and duty. He is a skilled and respected warrior, having earned a reputation for his martial prowess during Robert's Rebellion. He is known for wielding the greatsword \\"Ice\\" and has a direwolf named Grey Wind as his companion.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}, "content": [{"type": "hardBreak"}, {"text": "Ned's life takes a significant turn when his friend, King ", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "dc7d21d1-0a0d-4e4a-aaaa-d970c7da3825", "icon": "", "name": "characters", "label": "Robert Baratheon", "alterId": "", "parentId": "", "projectId": "77cb0278-b9c7-43b5-bd30-e72022eacf11"}}, {"text": ", asks him to serve as the Hand of the King after the previous Hand's suspicious death. Reluctantly leaving Winterfell, Ned becomes embroiled in the political intrigues of King's Landing.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}, "content": [{"type": "hardBreak"}, {"text": "Despite his commitment to honor and justice, Ned faces numerous challenges in the capital. He uncovers dark secrets about the Baratheon lineage, leading to conflicts with powerful houses like the Lannisters. Ultimately, Ned's unwavering principles lead to his downfall, and he faces tragic consequences for his attempts to uphold justice in the treacherous game of thrones.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}, "content": [{"type": "hardBreak"}, {"text": "Eddard Stark's legacy continues to influence the events of Westeros long after his death, and his honor becomes a defining aspect of his children's journeys throughout the series.  ", "type": "text"}]}]}	game-icons:wolf-head	\N	\N	\N	\N	\N	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
ab9e715f-9442-4b21-8ce5-865cf665d9d1	2024-03-24 08:22:27.187	2024-03-28 15:42:35.922	Locations	\N	\N	t	\N	\N	\N	\N	43e1c879-415b-4394-95ad-f9a4c42a43c5	7dde2c9c-fe5b-4e6f-a392-a9696dec3742	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
8af66f86-3211-49f2-87e9-ce7a8ccd9a0b	2024-02-10 10:28:37.892	2024-03-28 15:42:35.922	Robert Baratheon	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"type": "mentionAtom", "attrs": {"id": "dc7d21d1-0a0d-4e4a-aaaa-d970c7da3825", "icon": "", "name": "characters", "label": "Robert Baratheon", "alterId": "", "parentId": "", "projectId": "77cb0278-b9c7-43b5-bd30-e72022eacf11"}}, {"text": ", a key figure in both the \\"A Song of Ice and Fire\\" book series by George R.R. Martin and its television adaptation, \\"Game of Thrones,\\" is a central character whose actions shape the destiny of Westeros.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}, "content": [{"text": "Born into ", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "e8901f1d-9435-4c8f-b2d7-278b5e5c7f7d", "icon": "game-icons:bolt-shield", "name": "blueprint_instances", "label": "House Baratheon", "alterId": "", "parentId": "", "projectId": "77cb0278-b9c7-43b5-bd30-e72022eacf11"}}, {"text": ", Robert was a charismatic and formidable warrior during Robert's Rebellion, a conflict aimed at overthrowing the Mad King Aerys Targaryen. Known for wielding his war hammer in battle, Robert played a crucial role in securing victory for the rebels.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}, "content": [{"text": "Following the rebellion's success, Robert claimed the Iron Throne and became the ruler of the Seven Kingdoms. He married ", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "474d03c5-18a1-4e0e-a298-9e479fe64df6", "icon": "", "name": "characters", "label": "Cersei Lannister", "alterId": "", "parentId": "", "projectId": "77cb0278-b9c7-43b5-bd30-e72022eacf11"}}, {"text": " to secure a political alliance with ", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "066c7b8f-76bd-44dd-900e-be09a7891196", "icon": "", "name": "blueprint_instances", "label": "House Lannister", "alterId": "", "parentId": "", "projectId": "77cb0278-b9c7-43b5-bd30-e72022eacf11"}}, {"text": ", but their marriage was strained due to Cersei's secret relationship with her brother Jaime.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}, "content": [{"text": "Robert's reign is marked by political unrest, corruption, and economic challenges. He is more interested in revelry and hunting than in the intricacies of ruling, delegating many responsibilities to his Hand, ", "type": "text"}, {"type": "mentionAtom", "attrs": {"id": "a50a4981-40e4-44ae-82ff-27b6c4077ac2", "icon": "", "name": "characters", "label": "Eddard Stark", "alterId": "", "parentId": "", "projectId": "77cb0278-b9c7-43b5-bd30-e72022eacf11"}}, {"text": ".", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}, "content": [{"text": "Tragically, Robert meets his end in a hunting accident, orchestrated by his wife and her allies. His death sets off a chain of events that leads to the War of the Five Kings and the broader conflicts depicted in the series.", "type": "text"}]}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}}, {"type": "paragraph", "attrs": {"style": "", "nodeIndent": 0, "nodeLineHeight": null, "nodeTextAlignment": "start"}, "content": [{"text": "Robert Baratheon is remembered as a mighty warrior and a charismatic leader who played a pivotal role in the history of Westeros, though his reign ultimately proved tumultuous and short-lived.     ", "type": "text"}]}]}	game-icons:stag-head	\N	\N	\N	\N	\N	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
be0ae1bf-36ec-4a1c-9758-eca66bf44c25	2024-04-15 08:14:58.071	2024-04-29 07:35:39.985	To do	{"type": "doc", "content": [{"type": "taskList", "content": [{"type": "taskListItem", "attrs": {"checked": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Add more survival options to table", "type": "text"}]}]}, {"type": "taskListItem", "attrs": {"checked": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Create table in the Arkive for weather options", "type": "text"}]}]}, {"type": "taskListItem", "attrs": {"checked": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Greywick shops", "type": "text"}]}]}, {"type": "taskListItem", "attrs": {"checked": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Add new stock to Gundor blacksmith (because of Tash)", "type": "text"}]}]}, {"type": "taskListItem", "attrs": {"checked": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "What does spider venom do? (Got 3 vials of sword spider venom from cave)", "type": "text"}]}]}, {"type": "taskListItem", "attrs": {"checked": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Underwater caverns", "type": "text"}]}, {"type": "taskList", "content": [{"type": "taskListItem", "attrs": {"checked": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Mage built a tower underwater with the fish people (Lich?)", "type": "text"}]}]}, {"type": "taskListItem", "attrs": {"checked": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Potion of water breathing", "type": "text"}]}]}]}]}, {"type": "taskListItem", "attrs": {"checked": false}, "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Add more stuff to Filvarel Clalaeth's shop", "type": "text"}]}]}]}]}	\N	\N	\N	\N	\N	\N	eb68433a-64b2-4bf9-92a8-5625f46ad59f	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
\.


--
-- Data for Name: _charactersTodocuments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_charactersTodocuments" ("A", "B", is_main_page) FROM stdin;
a50a4981-40e4-44ae-82ff-27b6c4077ac2	c3511f25-4abd-4a3b-8381-75591a83c9bd	\N
dc7d21d1-0a0d-4e4a-aaaa-d970c7da3825	8af66f86-3211-49f2-87e9-ce7a8ccd9a0b	\N
\.


--
-- Data for Name: _charactersToimages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_charactersToimages" ("A", "B") FROM stdin;
eae334ab-dbf6-47b2-916a-95c77902723b	11af3d99-9a1e-4436-b4f0-c641bd0ba979
eae334ab-dbf6-47b2-916a-95c77902723b	af311dc0-b52d-4b5d-9a2a-48391d2a6233
eae334ab-dbf6-47b2-916a-95c77902723b	5e5b0dae-a011-4031-9eb8-44ea3cb6c0a3
eae334ab-dbf6-47b2-916a-95c77902723b	ed280fdd-3bd4-4d77-ac25-57541bfe4fda
eae334ab-dbf6-47b2-916a-95c77902723b	4236ced1-b2b7-446c-8165-a68c1a73357e
b8569e15-dae4-484f-8ce5-d76ecebff7bd	740f5d25-5945-4c30-81a5-09141b07826f
eae334ab-dbf6-47b2-916a-95c77902723b	1d7d9f3a-1da6-4abb-99c4-2823d7084fc6
eae334ab-dbf6-47b2-916a-95c77902723b	c550520f-4dbd-4a2a-a5d7-a45ec838ae5c
eae334ab-dbf6-47b2-916a-95c77902723b	ad4e0e64-9780-4499-ad5e-c6fa11259d58
eae334ab-dbf6-47b2-916a-95c77902723b	51cc3e1e-31f2-49e2-a2a7-fe289cfa565c
eae334ab-dbf6-47b2-916a-95c77902723b	4fd466d7-fb9f-489c-97b4-af4dfd78593e
eae334ab-dbf6-47b2-916a-95c77902723b	08ad3aa7-9855-4ae6-9d01-3a771d9734a1
b8569e15-dae4-484f-8ce5-d76ecebff7bd	67ebf24c-701f-4c3f-9017-9ce995e0790a
b8569e15-dae4-484f-8ce5-d76ecebff7bd	fc87c592-9517-4179-a22a-c06375508b4a
b8569e15-dae4-484f-8ce5-d76ecebff7bd	fa2fbab7-4d4f-4e7a-88a6-093aa0a49a7f
b8569e15-dae4-484f-8ce5-d76ecebff7bd	f5081561-191f-42f5-ba70-0ffb859121af
01815aa3-06d4-45ec-aeb7-a91ed879f3bb	59650b8d-6fe8-42c1-872e-c7fdc1bc46a1
eae334ab-dbf6-47b2-916a-95c77902723b	b90bb48b-5655-4dec-b501-b25701d34d87
\.


--
-- Data for Name: _charactersTotags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_charactersTotags" ("A", "B") FROM stdin;
eae334ab-dbf6-47b2-916a-95c77902723b	0a8c500a-736f-42af-a260-f55c9335a818
a40c1aaa-a3b3-40a8-94d2-0826a52b5281	0a8c500a-736f-42af-a260-f55c9335a818
565e7175-64d0-4cab-85b2-c88d7adc966f	8979b014-d2fa-4b2e-ace9-a63744ef4b62
eae334ab-dbf6-47b2-916a-95c77902723b	91112450-ea37-4f99-9bb4-48e9565778aa
565e7175-64d0-4cab-85b2-c88d7adc966f	0a8c500a-736f-42af-a260-f55c9335a818
565e7175-64d0-4cab-85b2-c88d7adc966f	9115e202-076f-4aa3-9ef5-f7ea24f9bc81
5f874844-c636-460f-bf39-134faa548624	8979b014-d2fa-4b2e-ace9-a63744ef4b62
66fc9c8e-78b2-437a-9972-7189dd1665e1	8979b014-d2fa-4b2e-ace9-a63744ef4b62
66fc9c8e-78b2-437a-9972-7189dd1665e1	9115e202-076f-4aa3-9ef5-f7ea24f9bc81
420c052c-e3f9-4cde-b3b0-8bb5ab115a6c	8979b014-d2fa-4b2e-ace9-a63744ef4b62
d05651da-7e14-4429-88d2-e1bcf6997290	8979b014-d2fa-4b2e-ace9-a63744ef4b62
b8569e15-dae4-484f-8ce5-d76ecebff7bd	1a419de4-95ce-4e4f-9d80-a25ec09c4280
b8569e15-dae4-484f-8ce5-d76ecebff7bd	0a8c500a-736f-42af-a260-f55c9335a818
b8569e15-dae4-484f-8ce5-d76ecebff7bd	9115e202-076f-4aa3-9ef5-f7ea24f9bc81
51a05454-1f30-4c98-b976-25e26217ac60	9115e202-076f-4aa3-9ef5-f7ea24f9bc81
aaa02323-5478-4373-9e25-bb1735c00e0e	8979b014-d2fa-4b2e-ace9-a63744ef4b62
aaa02323-5478-4373-9e25-bb1735c00e0e	9115e202-076f-4aa3-9ef5-f7ea24f9bc81
58fc3988-e686-41fc-b62b-a10c0416ac44	8979b014-d2fa-4b2e-ace9-a63744ef4b62
72254500-1ef4-4b8d-940b-b9a059b74b5f	8979b014-d2fa-4b2e-ace9-a63744ef4b62
eae334ab-dbf6-47b2-916a-95c77902723b	9115e202-076f-4aa3-9ef5-f7ea24f9bc81
972e40bf-c301-4b1e-81be-81dc2a03ab65	8979b014-d2fa-4b2e-ace9-a63744ef4b62
ca84cf36-c80a-4674-8ac3-f628a42aa560	8979b014-d2fa-4b2e-ace9-a63744ef4b62
5185926a-6761-40d6-941f-6909d2f393c0	8979b014-d2fa-4b2e-ace9-a63744ef4b62
836feb12-4be9-4ef9-bfc2-04b89c82d785	8979b014-d2fa-4b2e-ace9-a63744ef4b62
939fbb69-bf03-4e1a-97e7-8f987d1fcb80	8979b014-d2fa-4b2e-ace9-a63744ef4b62
e0a57db4-960d-4175-8466-7bdb16bb975d	8979b014-d2fa-4b2e-ace9-a63744ef4b62
f068b802-732a-4bbd-b423-5cc9f404434f	8979b014-d2fa-4b2e-ace9-a63744ef4b62
5bcadcd6-1639-461c-9d1b-a88a9615a030	8979b014-d2fa-4b2e-ace9-a63744ef4b62
55c882ad-8311-4e43-96b7-e995928f73dc	8979b014-d2fa-4b2e-ace9-a63744ef4b62
ac451175-aa47-4d8a-9dfd-2dbd35fdf2bd	8979b014-d2fa-4b2e-ace9-a63744ef4b62
65a03f79-1467-49e4-b5d6-be4f297426fa	8979b014-d2fa-4b2e-ace9-a63744ef4b62
b75309d2-b3aa-467e-9e85-8b9983feb9c2	8979b014-d2fa-4b2e-ace9-a63744ef4b62
c2eaf201-61ab-46dc-83c2-0cf0654553b1	8979b014-d2fa-4b2e-ace9-a63744ef4b62
f7b9f2e6-60eb-401b-ab89-195b41835a5f	8979b014-d2fa-4b2e-ace9-a63744ef4b62
f03fb0cd-5640-4a78-a029-1d9c2ffa7a84	8979b014-d2fa-4b2e-ace9-a63744ef4b62
90f10a2e-fb73-4830-8306-41f5e2b0d612	8979b014-d2fa-4b2e-ace9-a63744ef4b62
f6b6c4c3-31a3-4a7d-8376-82319f31c4c8	8979b014-d2fa-4b2e-ace9-a63744ef4b62
26005085-8938-47bd-8928-85df8e8afdb6	8979b014-d2fa-4b2e-ace9-a63744ef4b62
6881540b-9f07-43af-931b-7afdf5bb1e36	8979b014-d2fa-4b2e-ace9-a63744ef4b62
47b28ed9-edc3-4ce6-ae53-8b59b46db787	8979b014-d2fa-4b2e-ace9-a63744ef4b62
43855f00-564a-4d7c-873d-b4260954b14d	8979b014-d2fa-4b2e-ace9-a63744ef4b62
78529628-b5cf-4d05-a8c3-2f651fa56391	8979b014-d2fa-4b2e-ace9-a63744ef4b62
71e2652e-2255-4eba-8199-ca20e579cfe6	8979b014-d2fa-4b2e-ace9-a63744ef4b62
05a62bbb-6fa4-46b0-ae14-4115937b9f5e	8979b014-d2fa-4b2e-ace9-a63744ef4b62
1ba5fd05-db0c-4e0d-b89c-52eb728f6b9d	8979b014-d2fa-4b2e-ace9-a63744ef4b62
2ae57613-1a15-432b-ab75-57dc566a8fed	8979b014-d2fa-4b2e-ace9-a63744ef4b62
27a4a371-45e1-45f2-acf2-d5fbd36e32f4	8979b014-d2fa-4b2e-ace9-a63744ef4b62
b06f48da-8761-4eab-92d5-37fccad058fd	8979b014-d2fa-4b2e-ace9-a63744ef4b62
bea58ad5-ee6e-4b88-9548-c38578f0dd7d	8979b014-d2fa-4b2e-ace9-a63744ef4b62
518bd02d-52c9-4d20-bcca-bee6233665a8	8979b014-d2fa-4b2e-ace9-a63744ef4b62
f183375b-c3ac-40a7-a72a-fee05a008267	8979b014-d2fa-4b2e-ace9-a63744ef4b62
6053d298-c0f6-431f-8e7e-c1aec7924c88	9115e202-076f-4aa3-9ef5-f7ea24f9bc81
8c79d399-96f6-469e-9948-ad3baa8ce483	9115e202-076f-4aa3-9ef5-f7ea24f9bc81
8c79d399-96f6-469e-9948-ad3baa8ce483	0a8c500a-736f-42af-a260-f55c9335a818
37e08cba-2320-4e1b-b564-adff5c764884	421445db-6adf-4006-9aaf-85629fc73871
1830ab6b-8213-4579-814a-c5841d52c36f	421445db-6adf-4006-9aaf-85629fc73871
b29ba856-37ef-4541-baf3-58fa8a96f60e	421445db-6adf-4006-9aaf-85629fc73871
206608a7-3c83-4600-8da1-994b085b63d6	421445db-6adf-4006-9aaf-85629fc73871
d43fef12-98fe-4592-abcd-bd3e228cea46	421445db-6adf-4006-9aaf-85629fc73871
6053d298-c0f6-431f-8e7e-c1aec7924c88	b162a18c-5c17-485b-bf84-c923a5ae194d
605ebbe6-f5b9-4f5a-9e5c-6f08743aef50	421445db-6adf-4006-9aaf-85629fc73871
91b6ee36-49e6-421b-b60f-eb30d8fb33e9	421445db-6adf-4006-9aaf-85629fc73871
4f833928-cf94-4691-b5db-3d7da93f0da4	421445db-6adf-4006-9aaf-85629fc73871
806c2666-004b-4356-af39-ed8b1c570769	931d31b0-2a85-40df-86ba-d06bb031504e
fb1962c6-b829-4edc-b8f3-a66a909a1934	931d31b0-2a85-40df-86ba-d06bb031504e
72627abe-3988-41ab-80fd-e56e58642101	931d31b0-2a85-40df-86ba-d06bb031504e
247a295c-4c35-4381-a0f5-c6416cd40203	931d31b0-2a85-40df-86ba-d06bb031504e
ab4d5708-4598-4caa-aa54-4317a57ad15e	931d31b0-2a85-40df-86ba-d06bb031504e
c677283d-0b6b-4f78-99ce-efbe1c706053	931d31b0-2a85-40df-86ba-d06bb031504e
b5b89d35-6cc0-4d6c-a8b1-66f463ab335a	931d31b0-2a85-40df-86ba-d06bb031504e
8611ab61-310c-4c11-80d9-53e814012d6f	8979b014-d2fa-4b2e-ace9-a63744ef4b62
115322e3-8301-4ba3-876b-9a9f51e20edc	8979b014-d2fa-4b2e-ace9-a63744ef4b62
423e057a-c207-4b91-9521-a00b0f89ee4f	006367d7-64d8-4560-9fa8-78c962a402bf
0f916460-8c32-443c-912a-842207838174	8979b014-d2fa-4b2e-ace9-a63744ef4b62
0f916460-8c32-443c-912a-842207838174	006367d7-64d8-4560-9fa8-78c962a402bf
80128878-7e33-49a5-80ae-024a0719da19	2293781d-595a-4a2f-871e-aedc5f4b3282
80128878-7e33-49a5-80ae-024a0719da19	b162a18c-5c17-485b-bf84-c923a5ae194d
2837d3a8-a626-49c3-9ede-03af36f9e490	2293781d-595a-4a2f-871e-aedc5f4b3282
2837d3a8-a626-49c3-9ede-03af36f9e490	b162a18c-5c17-485b-bf84-c923a5ae194d
e6c24860-6b48-4397-9f27-d1bbbd2fa392	2293781d-595a-4a2f-871e-aedc5f4b3282
e6c24860-6b48-4397-9f27-d1bbbd2fa392	b162a18c-5c17-485b-bf84-c923a5ae194d
de9254e6-c737-4460-9121-011550b0a6c5	2293781d-595a-4a2f-871e-aedc5f4b3282
de9254e6-c737-4460-9121-011550b0a6c5	b162a18c-5c17-485b-bf84-c923a5ae194d
88bed265-2b87-41b0-839c-86195b193be0	2293781d-595a-4a2f-871e-aedc5f4b3282
88bed265-2b87-41b0-839c-86195b193be0	b162a18c-5c17-485b-bf84-c923a5ae194d
0963a01c-c27f-4d9f-baf1-c5ec5219db98	2293781d-595a-4a2f-871e-aedc5f4b3282
0963a01c-c27f-4d9f-baf1-c5ec5219db98	0a8c500a-736f-42af-a260-f55c9335a818
0963a01c-c27f-4d9f-baf1-c5ec5219db98	b162a18c-5c17-485b-bf84-c923a5ae194d
d93f996f-ee86-4e7e-82c1-1ddf49bcb044	2293781d-595a-4a2f-871e-aedc5f4b3282
d93f996f-ee86-4e7e-82c1-1ddf49bcb044	b162a18c-5c17-485b-bf84-c923a5ae194d
54ffebb4-a35e-417d-828a-8faade3fbb75	8979b014-d2fa-4b2e-ace9-a63744ef4b62
ae44fc3e-571d-4c58-a028-5183f94815f6	8979b014-d2fa-4b2e-ace9-a63744ef4b62
2dc1216a-2a31-4a74-8387-4acbd9556599	9115e202-076f-4aa3-9ef5-f7ea24f9bc81
2dc1216a-2a31-4a74-8387-4acbd9556599	2293781d-595a-4a2f-871e-aedc5f4b3282
2dc1216a-2a31-4a74-8387-4acbd9556599	b162a18c-5c17-485b-bf84-c923a5ae194d
446bbfe5-c3ba-4de1-8cae-db4fc1206c15	8979b014-d2fa-4b2e-ace9-a63744ef4b62
abcfe56e-d89b-47b5-a248-d58a2a9ddf7a	8979b014-d2fa-4b2e-ace9-a63744ef4b62
a2e6e181-0843-428e-9610-14d7ac80f6e4	ad96f73a-92a1-44d2-b976-6f2e1bba098f
f9b13f77-6319-4225-9910-2b6a64652fb6	006367d7-64d8-4560-9fa8-78c962a402bf
992cb4e3-ccc3-4c82-8172-3135e85e4099	8979b014-d2fa-4b2e-ace9-a63744ef4b62
32be8979-fe27-4c3f-9a08-8acec68b5439	a430f511-5672-4e51-b9f8-fd59d90a6eaa
d760c6fb-9376-4551-94a0-4b16e85e96ac	8979b014-d2fa-4b2e-ace9-a63744ef4b62
61fa5f6a-cae3-48aa-bcbf-b10351299d23	8979b014-d2fa-4b2e-ace9-a63744ef4b62
430cda7d-8ab9-43fc-a8cb-8e69a0220a5f	8979b014-d2fa-4b2e-ace9-a63744ef4b62
a4863ad6-985a-46e3-aeaf-5ce290375c25	006367d7-64d8-4560-9fa8-78c962a402bf
af75eb77-c24c-485a-a7cb-483ca778cd66	8979b014-d2fa-4b2e-ace9-a63744ef4b62
5c191811-99dd-4487-aae1-5eab69c35358	006367d7-64d8-4560-9fa8-78c962a402bf
e962a0e7-3467-4abd-9167-fd35508c99aa	a430f511-5672-4e51-b9f8-fd59d90a6eaa
06d43ae7-a804-4072-aa37-14800b4b13f1	c5a4726b-24aa-4cd9-b42c-386523f7a083
2dc1216a-2a31-4a74-8387-4acbd9556599	c5a4726b-24aa-4cd9-b42c-386523f7a083
a0cb5bd0-799c-459c-abb4-5547c31ebbfe	435c8c1a-8e51-4abd-bcf3-d713b98abb89
53eb4f51-9933-4425-a7fd-f07476229e4a	e4076a67-b9f1-4c10-8812-3176af6eff9d
ddb2f771-f6e2-492a-81bd-d9c8af8fd15e	8979b014-d2fa-4b2e-ace9-a63744ef4b62
089ebc15-1543-4d92-b077-7bd832eb2a79	8979b014-d2fa-4b2e-ace9-a63744ef4b62
eae334ab-dbf6-47b2-916a-95c77902723b	435c8c1a-8e51-4abd-bcf3-d713b98abb89
565e7175-64d0-4cab-85b2-c88d7adc966f	435c8c1a-8e51-4abd-bcf3-d713b98abb89
9d10a90f-76bc-41b3-ad15-48e943af147b	0a8c500a-736f-42af-a260-f55c9335a818
9d10a90f-76bc-41b3-ad15-48e943af147b	435c8c1a-8e51-4abd-bcf3-d713b98abb89
6e79865e-cc81-4da7-9be0-8674932413b0	8979b014-d2fa-4b2e-ace9-a63744ef4b62
65b58ba7-5dab-4f61-9bf5-3bddadbbe8be	a430f511-5672-4e51-b9f8-fd59d90a6eaa
4f7fe214-265c-48dd-b8d6-dbf416a28917	435c8c1a-8e51-4abd-bcf3-d713b98abb89
2ddefdce-7d00-4668-988c-53d24d79e056	8979b014-d2fa-4b2e-ace9-a63744ef4b62
3cf1a90e-7475-419a-9290-2e8d727432c9	ad96f73a-92a1-44d2-b976-6f2e1bba098f
a316698a-b376-4d07-acec-1c4fa859b3e5	8979b014-d2fa-4b2e-ace9-a63744ef4b62
eff224bc-c8ab-46f1-844c-9df1d28609d2	8979b014-d2fa-4b2e-ace9-a63744ef4b62
53a9de7f-3379-4522-a70a-af2041a6d8e7	0a8c500a-736f-42af-a260-f55c9335a818
d2006ddc-4d99-4dfd-a55d-b425410243e4	8979b014-d2fa-4b2e-ace9-a63744ef4b62
74e65ead-4b87-4092-a9a8-29ac04ec5551	8979b014-d2fa-4b2e-ace9-a63744ef4b62
d2fb5503-3f99-41cb-9e1a-a20b72417567	8979b014-d2fa-4b2e-ace9-a63744ef4b62
4c41a048-adec-4ec4-8b52-b976eb3be723	006367d7-64d8-4560-9fa8-78c962a402bf
5084316b-bcab-4881-bc38-bd912acf71ea	8979b014-d2fa-4b2e-ace9-a63744ef4b62
22fcff15-630a-4fe7-8aa9-893f52e13b74	006367d7-64d8-4560-9fa8-78c962a402bf
f3d7e4b2-ade4-4da4-83ad-2f007746395a	8979b014-d2fa-4b2e-ace9-a63744ef4b62
e5bad67a-1212-4999-80a8-0e3f267f3246	8979b014-d2fa-4b2e-ace9-a63744ef4b62
52df46d6-8765-44e5-91c0-bc873903b914	8979b014-d2fa-4b2e-ace9-a63744ef4b62
9db21149-f9c2-4817-b501-b7a35def7c42	a430f511-5672-4e51-b9f8-fd59d90a6eaa
3b84aabb-8086-419a-88a1-fa6991150583	006367d7-64d8-4560-9fa8-78c962a402bf
6a314fe0-050b-4e56-a4d7-689120560568	a430f511-5672-4e51-b9f8-fd59d90a6eaa
c69ecc10-7730-4d55-aa95-c4c2cd65617a	a430f511-5672-4e51-b9f8-fd59d90a6eaa
ee9aeef6-bb12-492d-8c65-4c6541a97e3c	8979b014-d2fa-4b2e-ace9-a63744ef4b62
ee9aeef6-bb12-492d-8c65-4c6541a97e3c	a430f511-5672-4e51-b9f8-fd59d90a6eaa
b5ca043c-f6c0-4224-b772-ad0fe1c84f21	8979b014-d2fa-4b2e-ace9-a63744ef4b62
9d6c5ab5-9b67-4153-a75c-ae73efa4fcdc	62962fb0-81cf-42d8-b4ef-7d35635b7e75
3cfb4abf-2ead-466d-88ca-4761ecdbeda0	8979b014-d2fa-4b2e-ace9-a63744ef4b62
ea64ffaf-8dea-40fa-b089-083931d21858	8979b014-d2fa-4b2e-ace9-a63744ef4b62
86c5a4ec-a058-4c91-8937-cc71f0f7af77	006367d7-64d8-4560-9fa8-78c962a402bf
b62fe6c0-0e2f-46a9-85d6-8b2223ec403e	8979b014-d2fa-4b2e-ace9-a63744ef4b62
4573aa15-33e0-46dc-bb32-20de8b68bd88	8979b014-d2fa-4b2e-ace9-a63744ef4b62
9aa07364-9dd2-4227-a62e-998e792e4b8a	ad96f73a-92a1-44d2-b976-6f2e1bba098f
5cc32e0d-2ec1-460e-87b0-9bf6e3ee6ea0	8979b014-d2fa-4b2e-ace9-a63744ef4b62
60600919-d5b5-49f8-8bb8-1cda143c7759	e4076a67-b9f1-4c10-8812-3176af6eff9d
55c882ad-8311-4e43-96b7-e995928f73dc	9115e202-076f-4aa3-9ef5-f7ea24f9bc81
92672947-0693-480e-b64e-0aef04cf1f50	91112450-ea37-4f99-9bb4-48e9565778aa
0996efd2-e65c-454e-ba59-d33569b7e648	91112450-ea37-4f99-9bb4-48e9565778aa
e1943b46-b616-4649-a01e-e8dcdf0d6b2b	0a8c500a-736f-42af-a260-f55c9335a818
e1943b46-b616-4649-a01e-e8dcdf0d6b2b	435c8c1a-8e51-4abd-bcf3-d713b98abb89
1f51093a-6482-474d-ab0a-660b16763ba8	2293781d-595a-4a2f-871e-aedc5f4b3282
1f51093a-6482-474d-ab0a-660b16763ba8	b162a18c-5c17-485b-bf84-c923a5ae194d
20157e84-ee22-4bc3-aa22-fa4261b9dc42	435c8c1a-8e51-4abd-bcf3-d713b98abb89
20157e84-ee22-4bc3-aa22-fa4261b9dc42	0a8c500a-736f-42af-a260-f55c9335a818
01815aa3-06d4-45ec-aeb7-a91ed879f3bb	0a8c500a-736f-42af-a260-f55c9335a818
01815aa3-06d4-45ec-aeb7-a91ed879f3bb	435c8c1a-8e51-4abd-bcf3-d713b98abb89
eae334ab-dbf6-47b2-916a-95c77902723b	2e379e87-4c4f-4db6-ad55-97b208d0a874
f2a2663e-dedc-465d-ba79-f845235d4748	8979b014-d2fa-4b2e-ace9-a63744ef4b62
565e7175-64d0-4cab-85b2-c88d7adc966f	b63bce1f-f252-41cb-a8da-dce373223800
71675486-ae62-42b6-968e-d1b1ef917ef0	9115e202-076f-4aa3-9ef5-f7ea24f9bc81
71675486-ae62-42b6-968e-d1b1ef917ef0	2293781d-595a-4a2f-871e-aedc5f4b3282
65a41a03-063a-4bb8-99f9-4f1eae0d7d4a	9115e202-076f-4aa3-9ef5-f7ea24f9bc81
b8569e15-dae4-484f-8ce5-d76ecebff7bd	435c8c1a-8e51-4abd-bcf3-d713b98abb89
565e7175-64d0-4cab-85b2-c88d7adc966f	2e379e87-4c4f-4db6-ad55-97b208d0a874
e1943b46-b616-4649-a01e-e8dcdf0d6b2b	2e379e87-4c4f-4db6-ad55-97b208d0a874
a40c1aaa-a3b3-40a8-94d2-0826a52b5281	2e379e87-4c4f-4db6-ad55-97b208d0a874
a40c1aaa-a3b3-40a8-94d2-0826a52b5281	435c8c1a-8e51-4abd-bcf3-d713b98abb89
b8569e15-dae4-484f-8ce5-d76ecebff7bd	2e379e87-4c4f-4db6-ad55-97b208d0a874
06d43ae7-a804-4072-aa37-14800b4b13f1	2e379e87-4c4f-4db6-ad55-97b208d0a874
8c79d399-96f6-469e-9948-ad3baa8ce483	435c8c1a-8e51-4abd-bcf3-d713b98abb89
8c79d399-96f6-469e-9948-ad3baa8ce483	2e379e87-4c4f-4db6-ad55-97b208d0a874
20157e84-ee22-4bc3-aa22-fa4261b9dc42	2e379e87-4c4f-4db6-ad55-97b208d0a874
53eb4f51-9933-4425-a7fd-f07476229e4a	58d34ccb-2da8-4387-b2bf-f3f256a1bee9
53eb4f51-9933-4425-a7fd-f07476229e4a	435c8c1a-8e51-4abd-bcf3-d713b98abb89
b0b33ba5-6367-4f7f-9f5e-44cad8b94973	435c8c1a-8e51-4abd-bcf3-d713b98abb89
b0b33ba5-6367-4f7f-9f5e-44cad8b94973	1a419de4-95ce-4e4f-9d80-a25ec09c4280
49df0b28-cfb2-4a8d-bda2-bc30d9e29198	d57ffe19-2bab-4a72-b25d-77b1a084edee
49df0b28-cfb2-4a8d-bda2-bc30d9e29198	2e379e87-4c4f-4db6-ad55-97b208d0a874
2dc1216a-2a31-4a74-8387-4acbd9556599	2e379e87-4c4f-4db6-ad55-97b208d0a874
a50a4981-40e4-44ae-82ff-27b6c4077ac2	bfae5171-e779-42c5-8eb2-6a857ea99642
3c9ef747-bf4c-44ff-8a71-6648fc1c8642	bfae5171-e779-42c5-8eb2-6a857ea99642
5bc05aaa-cae5-40ac-b780-54929639f310	bfae5171-e779-42c5-8eb2-6a857ea99642
7296e38f-f51b-4357-bfb0-f82a737b662a	bfae5171-e779-42c5-8eb2-6a857ea99642
474d03c5-18a1-4e0e-a298-9e479fe64df6	69a1554c-e5db-459f-bd4d-a87526063b9a
56abc767-1971-43fb-a08e-878aaab783b1	69a1554c-e5db-459f-bd4d-a87526063b9a
64aaa1af-aae7-40b4-95fd-316cbd2c349b	bfae5171-e779-42c5-8eb2-6a857ea99642
3dc7880d-a137-4e9a-9f3f-a55023b63f9c	bfae5171-e779-42c5-8eb2-6a857ea99642
9a68e881-000e-4de6-9408-7b3ff632f9ad	bfae5171-e779-42c5-8eb2-6a857ea99642
b184a4d0-6b5d-4672-8343-0dda42f129ed	69a1554c-e5db-459f-bd4d-a87526063b9a
796c16ad-9145-4ffc-a762-19f517ba0e4d	69a1554c-e5db-459f-bd4d-a87526063b9a
51622f08-c61f-4c22-8258-e2dd5b9c10f5	69a1554c-e5db-459f-bd4d-a87526063b9a
35f92ae8-889c-4f94-80a7-be21f444823d	40c8549a-571d-4779-b04e-ac832af9fc92
719a9ed5-849f-46d1-80c8-5a45b7513b53	07e98515-a7d2-4d2d-8a71-361d35ac1c0f
719a9ed5-849f-46d1-80c8-5a45b7513b53	40c8549a-571d-4779-b04e-ac832af9fc92
5bc05aaa-cae5-40ac-b780-54929639f310	40c8549a-571d-4779-b04e-ac832af9fc92
18edfff6-5e09-4028-8085-96aeacf96280	40c8549a-571d-4779-b04e-ac832af9fc92
aec562ba-d1bc-4849-a50f-a1e369a6ace6	40c8549a-571d-4779-b04e-ac832af9fc92
8ba83857-85b7-4d26-8918-3a92b6e6069e	07e98515-a7d2-4d2d-8a71-361d35ac1c0f
db26d940-9cb1-475b-ba46-53d108d9479a	07e98515-a7d2-4d2d-8a71-361d35ac1c0f
dc7d21d1-0a0d-4e4a-aaaa-d970c7da3825	8ac6b34e-782c-41c2-a97c-e1c614d156da
85e203a8-a394-4067-8fa1-b94c34e2691e	8f584ebc-882d-480f-93a1-b7cf9f91e7e9
a9d3a726-203f-4dd6-ad59-36793c483d91	8f584ebc-882d-480f-93a1-b7cf9f91e7e9
334f3518-9237-41a9-8d2d-b005d25aa13b	8f584ebc-882d-480f-93a1-b7cf9f91e7e9
1d9aa594-c04d-4c38-937c-0323be8162e4	8f584ebc-882d-480f-93a1-b7cf9f91e7e9
cf716320-8fed-4f2d-b438-defe0d3177ea	e3000318-21b1-46ff-9513-3d90eabefb7b
19e9dba3-b166-4a5c-9e16-1749dfbde91e	e3000318-21b1-46ff-9513-3d90eabefb7b
7119b36f-c49a-4d30-b7ac-89a366340fbc	e3000318-21b1-46ff-9513-3d90eabefb7b
4eb3f9fd-e0c6-4e66-b293-b1a51f0db477	8ac6b34e-782c-41c2-a97c-e1c614d156da
7dff96b1-fe62-4bd5-b04c-849ae0d9dba8	8ac6b34e-782c-41c2-a97c-e1c614d156da
c74d538a-212e-4e59-9f3e-eb5a70f9fd93	8ac6b34e-782c-41c2-a97c-e1c614d156da
ced1866a-f8e3-470f-aa6a-f94c6d2374bc	8ac6b34e-782c-41c2-a97c-e1c614d156da
38d318b0-6457-4974-af45-b0db8381d460	8ac6b34e-782c-41c2-a97c-e1c614d156da
dc7d21d1-0a0d-4e4a-aaaa-d970c7da3825	857e434c-c699-4348-813b-611f8cb60502
ced1866a-f8e3-470f-aa6a-f94c6d2374bc	857e434c-c699-4348-813b-611f8cb60502
38d318b0-6457-4974-af45-b0db8381d460	857e434c-c699-4348-813b-611f8cb60502
8ba83857-85b7-4d26-8918-3a92b6e6069e	57c29d99-667e-4609-a7ec-4651d345b684
a50a4981-40e4-44ae-82ff-27b6c4077ac2	57c29d99-667e-4609-a7ec-4651d345b684
56abc767-1971-43fb-a08e-878aaab783b1	57c29d99-667e-4609-a7ec-4651d345b684
796c16ad-9145-4ffc-a762-19f517ba0e4d	57c29d99-667e-4609-a7ec-4651d345b684
a65dcee1-3bf5-4b1a-bf50-d19cce624d53	57c29d99-667e-4609-a7ec-4651d345b684
2eccad6c-c292-43fa-8cb3-9f5c241b53ea	c5135c95-bc91-4c10-a2dc-c8f58a165d69
e273762b-0b47-44fa-a942-694461d12565	c5135c95-bc91-4c10-a2dc-c8f58a165d69
d0506f08-8bad-4924-b75d-26888a3bceaa	c5135c95-bc91-4c10-a2dc-c8f58a165d69
bb3c5c51-c52d-4ce2-9c63-42d9cef75a3d	c5135c95-bc91-4c10-a2dc-c8f58a165d69
80567cab-aa4b-4a7c-8d02-9f31709a66ff	0a8c500a-736f-42af-a260-f55c9335a818
c12df5fb-1beb-4450-97db-ba9636468d4f	b2e0ee0e-6966-41d5-b7ab-d2cc803e3918
c12df5fb-1beb-4450-97db-ba9636468d4f	90bac4d1-c1ce-449e-99e7-a6b0fff71b53
1911b480-54b9-4ea2-967c-95f201f5ea67	05f67808-fb09-459f-ac82-afacb897e33e
1911b480-54b9-4ea2-967c-95f201f5ea67	2a681547-302d-47b7-8f86-28edde9fc7d2
551597eb-86e7-406c-897e-63be470898af	9fcbe734-2846-4fd8-801d-4887d9b0684c
29bc458c-feaa-4d70-b9a9-afc5cdb60ded	9fcbe734-2846-4fd8-801d-4887d9b0684c
53eb4f51-9933-4425-a7fd-f07476229e4a	17ed4a5a-9d62-4a67-a919-d755f28ba177
53eb4f51-9933-4425-a7fd-f07476229e4a	8c90c960-898a-4543-a788-5261c4e9135e
60600919-d5b5-49f8-8bb8-1cda143c7759	17ed4a5a-9d62-4a67-a919-d755f28ba177
60600919-d5b5-49f8-8bb8-1cda143c7759	8c90c960-898a-4543-a788-5261c4e9135e
b80fc657-51d1-4fd8-9183-02ec5582c473	0a8c500a-736f-42af-a260-f55c9335a818
b80fc657-51d1-4fd8-9183-02ec5582c473	435c8c1a-8e51-4abd-bcf3-d713b98abb89
766833de-3846-45a5-ad47-ff09b5ac6c79	e4076a67-b9f1-4c10-8812-3176af6eff9d
766833de-3846-45a5-ad47-ff09b5ac6c79	dfec923a-821b-4719-a212-347f90d99db4
56dd317f-acbd-4f9d-9b10-eee0637d511e	435c8c1a-8e51-4abd-bcf3-d713b98abb89
56dd317f-acbd-4f9d-9b10-eee0637d511e	e4076a67-b9f1-4c10-8812-3176af6eff9d
56dd317f-acbd-4f9d-9b10-eee0637d511e	17ed4a5a-9d62-4a67-a919-d755f28ba177
56dd317f-acbd-4f9d-9b10-eee0637d511e	a1e28458-ff99-4081-8327-f73c42a3d4f0
5e9a744b-2640-4db9-8651-1c27e59e8425	435c8c1a-8e51-4abd-bcf3-d713b98abb89
7e3fdbe9-60a2-42b4-b11f-7cfb9df4768c	435c8c1a-8e51-4abd-bcf3-d713b98abb89
facdf9fc-cf1a-49cb-b058-df3486b68e97	435c8c1a-8e51-4abd-bcf3-d713b98abb89
f1b90b1a-9e3f-419e-bd92-162bbf01845c	c5a4726b-24aa-4cd9-b42c-386523f7a083
f1b90b1a-9e3f-419e-bd92-162bbf01845c	e655f329-0eb9-477e-aaee-cceb827895eb
75cf0640-2d57-4eb5-8340-7bd816551733	931d31b0-2a85-40df-86ba-d06bb031504e
75cf0640-2d57-4eb5-8340-7bd816551733	c5a4726b-24aa-4cd9-b42c-386523f7a083
75cf0640-2d57-4eb5-8340-7bd816551733	e655f329-0eb9-477e-aaee-cceb827895eb
e3ed0281-2ad7-4471-9ab2-68922b423e42	435c8c1a-8e51-4abd-bcf3-d713b98abb89
0996efd2-e65c-454e-ba59-d33569b7e648	2e379e87-4c4f-4db6-ad55-97b208d0a874
6053d298-c0f6-431f-8e7e-c1aec7924c88	2e379e87-4c4f-4db6-ad55-97b208d0a874
320bb6f9-b920-4302-9e6b-584c48c9c1e1	87588112-f157-42b8-ad82-b4e3fc2ccf4b
320bb6f9-b920-4302-9e6b-584c48c9c1e1	fb83a004-380f-47ce-9315-c939928caa3e
73125719-319c-430f-88d9-5cda7dc72eb1	87588112-f157-42b8-ad82-b4e3fc2ccf4b
73125719-319c-430f-88d9-5cda7dc72eb1	8fcce26c-41f6-49fe-a8d2-2dc67615c2bb
26b0e421-3bd0-4c8f-a719-2d3a3427ca85	87588112-f157-42b8-ad82-b4e3fc2ccf4b
26b0e421-3bd0-4c8f-a719-2d3a3427ca85	8fcce26c-41f6-49fe-a8d2-2dc67615c2bb
84f9f03d-241d-41a1-9fa6-7a13c39c9608	4cc2ef17-b41a-4143-985e-5ecc7a14299d
84f9f03d-241d-41a1-9fa6-7a13c39c9608	17ed4a5a-9d62-4a67-a919-d755f28ba177
84f9f03d-241d-41a1-9fa6-7a13c39c9608	8c90c960-898a-4543-a788-5261c4e9135e
5889baaf-1c5a-4087-a4b7-24d583395413	8979b014-d2fa-4b2e-ace9-a63744ef4b62
\.


--
-- Data for Name: dictionaries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dictionaries (id, created_at, updated_at, title, project_id, icon, is_folder, is_public, parent_id, owner_id, deleted_at) FROM stdin;
2673920c-ec23-44e5-b218-47494075573a	2023-09-22 08:21:32.851	2024-03-28 15:42:35.922	Elvish	43e1c879-415b-4394-95ad-f9a4c42a43c5	game-icons:healing-shield	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
b51209b4-bd17-4b45-932d-0b95d77132a5	2023-10-16 18:52:03.884	2024-03-28 15:42:35.922	Old Imperial	43e1c879-415b-4394-95ad-f9a4c42a43c5	game-icons:chained-heart	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
fde18d14-aa78-489a-93aa-48e4d7b3f427	2023-11-08 21:05:08.831	2024-03-28 15:42:35.922	Xafian	43e1c879-415b-4394-95ad-f9a4c42a43c5	game-icons:eagle-emblem	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
\.


--
-- Data for Name: _dictionariesTotags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_dictionariesTotags" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _documentsTotags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_documentsTotags" ("A", "B") FROM stdin;
643fa781-8337-4717-a31b-cbff458f34be	b162a18c-5c17-485b-bf84-c923a5ae194d
9afb41f7-b413-4950-90ff-9893066daf77	421445db-6adf-4006-9aaf-85629fc73871
9afb41f7-b413-4950-90ff-9893066daf77	931d31b0-2a85-40df-86ba-d06bb031504e
9afb41f7-b413-4950-90ff-9893066daf77	8dda18a7-1b4e-4176-90bf-c0bf0651e0d7
9afb41f7-b413-4950-90ff-9893066daf77	e655f329-0eb9-477e-aaee-cceb827895eb
c3511f25-4abd-4a3b-8381-75591a83c9bd	bfae5171-e779-42c5-8eb2-6a857ea99642
c3511f25-4abd-4a3b-8381-75591a83c9bd	57c29d99-667e-4609-a7ec-4651d345b684
78f83861-1801-4e70-8f7b-6240a4a137df	52692fb2-43e0-41df-af09-c4228b465bb2
593f8e49-dbc5-4875-98ec-47556411b981	52692fb2-43e0-41df-af09-c4228b465bb2
\.


--
-- Data for Name: months; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.months (id, title, days, sort, parent_id) FROM stdin;
f4a1c779-21fe-4a4f-9e2f-44e34d8b1ac9	Lariq	30	0	4e26a73d-46ef-467d-80f5-5d8f7374c491
a3356772-322a-4cd1-a15e-12237c1c7b74	Ukarn	30	1	4e26a73d-46ef-467d-80f5-5d8f7374c491
e7a17301-5d71-4c79-aa20-7dec700441b4	Vineth	30	2	4e26a73d-46ef-467d-80f5-5d8f7374c491
229bb222-38bc-4670-ace5-9584f14ccd30	Miroch	30	3	4e26a73d-46ef-467d-80f5-5d8f7374c491
83e8ec8e-efae-458d-bea8-8afb42638d8c	Levid	30	4	4e26a73d-46ef-467d-80f5-5d8f7374c491
a2b48f53-7919-4504-a5d5-87b1a4d2724d	Feril	30	5	4e26a73d-46ef-467d-80f5-5d8f7374c491
b3ffd40a-7711-45d2-9563-3c6d46fd4a8d	Flett	30	6	4e26a73d-46ef-467d-80f5-5d8f7374c491
464541fb-b785-4c5e-8e92-84cf5744b933	Orlyth	30	7	4e26a73d-46ef-467d-80f5-5d8f7374c491
36e74e96-a81e-4385-892b-408a1e82dd6b	Iuveq	30	8	4e26a73d-46ef-467d-80f5-5d8f7374c491
62a35051-363c-4550-a8e5-e5fbfa648386	Miu	30	9	4e26a73d-46ef-467d-80f5-5d8f7374c491
46b9e803-06d1-4d49-a6b4-f94d14e52890	Mivatar	30	10	4e26a73d-46ef-467d-80f5-5d8f7374c491
10a45d0e-c775-481a-bdc3-6dab8ff49f84	Elmoss	30	11	4e26a73d-46ef-467d-80f5-5d8f7374c491
d99c6efe-2068-406e-8a20-644428c9e5f6	Mirelen	30	12	4e26a73d-46ef-467d-80f5-5d8f7374c491
12e18746-8287-4f5a-b571-0beae09b7760	Tirn	30	13	4e26a73d-46ef-467d-80f5-5d8f7374c491
c8a376eb-73ac-4767-b729-dd881dbd3889	Dafoth	30	14	4e26a73d-46ef-467d-80f5-5d8f7374c491
6821a97c-fcb0-45fb-b6ea-7ca7c4faa47e	Malum	30	15	4e26a73d-46ef-467d-80f5-5d8f7374c491
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events (id, title, description, is_public, background_color, text_color, document_id, image_id, parent_id, end_day, end_month, end_year, start_day, start_month, start_year, updated_at, start_month_id, end_month_id, start_hours, start_minutes, end_hours, end_minutes, deleted_at, owner_id) FROM stdin;
88b15ef0-bc44-4d88-adde-b352fd70c02a	Founding of Old Haven	\N	\N	\N	\N	\N	\N	4e26a73d-46ef-467d-80f5-5d8f7374c491	\N	\N	\N	26	2	1	2024-04-06 08:34:05.455	e7a17301-5d71-4c79-aa20-7dec700441b4	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
432c4f04-bd61-4e5f-b5ce-db4a2e36d07e	The Pheagon (reign)	\N	\N	#3b0764	\N	\N	\N	4e26a73d-46ef-467d-80f5-5d8f7374c491	27	13	15	1	2	1	2024-04-06 08:34:05.455	e7a17301-5d71-4c79-aa20-7dec700441b4	12e18746-8287-4f5a-b571-0beae09b7760	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
85496c2c-7114-4e60-9abe-ba25eeddb360	Turis I Pheagon (reign)	\N	\N	#2e1065	\N	\N	\N	4e26a73d-46ef-467d-80f5-5d8f7374c491	4	11	27	27	14	15	2024-04-06 08:34:05.455	c8a376eb-73ac-4767-b729-dd881dbd3889	10a45d0e-c775-481a-bdc3-6dab8ff49f84	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
a7d59de4-9b54-44af-8832-9ac3e4b5117a	Pennisular war	\N	\N	#7f1d1d	\N	\N	\N	4e26a73d-46ef-467d-80f5-5d8f7374c491	17	2	14	13	14	5	2024-04-06 08:34:05.455	c8a376eb-73ac-4767-b729-dd881dbd3889	e7a17301-5d71-4c79-aa20-7dec700441b4	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
6122be9d-5bcd-4835-be1a-2dc75dbc76a1	Three cities war	\N	\N	#991b1b	\N	\N	\N	4e26a73d-46ef-467d-80f5-5d8f7374c491	2	3	7	13	14	4	2024-04-06 08:34:05.455	c8a376eb-73ac-4767-b729-dd881dbd3889	229bb222-38bc-4670-ace5-9584f14ccd30	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
7422fc2c-0c71-44a7-ad48-b093ce607904	Aton Pheagon (reign)	\N	\N	#2e1065	\N	\N	\N	4e26a73d-46ef-467d-80f5-5d8f7374c491	13	3	42	4	11	27	2024-04-06 08:34:05.455	f4a1c779-21fe-4a4f-9e2f-44e34d8b1ac9	229bb222-38bc-4670-ace5-9584f14ccd30	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
\.


--
-- Data for Name: graphs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.graphs (id, created_at, updated_at, title, is_folder, is_public, icon, default_node_shape, default_node_color, default_edge_color, project_id, parent_id, owner_id, deleted_at) FROM stdin;
2e24bb7b-2121-458b-9058-3173dec8b408	2024-02-15 09:05:35.177	2024-03-28 15:42:35.922	Relationship tree of Catelyn Stark	\N	\N	\N	rectangle	#595959	#595959	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
37362901-1a7a-45e9-ae15-dbe95cf50535	2024-02-15 09:06:23.477	2024-03-28 15:42:35.922	Relationship tree of Aeryis II Targaryen	\N	\N	\N	rectangle	#595959	#595959	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
c4e76e21-d296-4552-a654-0cd7735a82ed	2024-02-15 09:06:43.258	2024-03-28 15:42:35.922	Relationship tree of Tyrion Lannister	\N	\N	\N	rectangle	#595959	#595959	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
14b0d12b-72de-4a00-9c00-c89e49055116	2024-02-15 09:18:10.545	2024-03-28 15:42:35.922	The Seven Kingdoms	\N	\N	\N	heptagon	#595959	#595959	77cb0278-b9c7-43b5-bd30-e72022eacf11	\N	05cf043c-52f2-4f02-bcaf-37672b32510c	\N
81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7	2024-03-06 21:35:31.705	2024-03-28 15:42:35.922	Divine hierarchy	\N	\N	\N	rectangle	#595959	#595959	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	2024-01-16 21:11:38.811	2024-05-02 10:23:16.385	Pheagon Dynasty	\N	t	\N	rectangle	#595959	#595959	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
\.


--
-- Data for Name: map_pin_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.map_pin_types (id, project_id, title, default_icon, default_icon_color) FROM stdin;
\.


--
-- Data for Name: maps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.maps (id, created_at, updated_at, title, is_folder, is_public, cluster_pins, icon, project_id, parent_id, image_id, owner_id, deleted_at) FROM stdin;
9d76e82c-a0cf-4d25-9e5f-a2f7412d2451	2023-10-23 19:07:27.499	2024-03-28 15:42:35.922	Salaraan	\N	t	t	\N	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	e1a7eda4-fb96-45e9-9db5-6c09d1258b9c	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
\.


--
-- Data for Name: map_pins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.map_pins (id, title, parent_id, lat, lng, color, border_color, background_color, icon, show_background, show_border, is_public, map_link, doc_id, image_id, character_id, map_pin_type_id, deleted_at, owner_id) FROM stdin;
2762b247-c0d0-4bfe-9246-96657c031c36	\N	9d76e82c-a0cf-4d25-9e5f-a2f7412d2451	1808.625	1608.59375	#ffffff	#ffffff	#000000	\N	t	t	\N	\N	\N	\N	eae334ab-dbf6-47b2-916a-95c77902723b	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
c186ca8e-23e2-4ccd-82f3-e0febc0664be	\N	9d76e82c-a0cf-4d25-9e5f-a2f7412d2451	1808.5	1608.53125	#ffffff	#ffffff	#000000	\N	t	t	\N	\N	\N	\N	20157e84-ee22-4bc3-aa22-fa4261b9dc42	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
7453df24-ee03-48a8-aa9a-610337e68833	The Capital	9d76e82c-a0cf-4d25-9e5f-a2f7412d2451	2434	974	#ffffff	#ffffff	#000000	game-icons:crowned-heart	t	t	\N	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
7290a5f8-365d-45d6-918c-229fca54bc8a	\N	9d76e82c-a0cf-4d25-9e5f-a2f7412d2451	2414.625	994.84375	#ffffff	#ffffff	#000000	\N	t	t	\N	\N	\N	\N	01815aa3-06d4-45ec-aeb7-a91ed879f3bb	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
2f9b1f50-aa4f-4f7e-b433-8d08045d4525	\N	9d76e82c-a0cf-4d25-9e5f-a2f7412d2451	2414.65625	994.9375	#ffffff	#ffffff	#000000	\N	t	t	\N	\N	\N	\N	5f874844-c636-460f-bf39-134faa548624	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
193736ca-b0e0-4add-a5d2-6266e4d652bc	Naar elves	9d76e82c-a0cf-4d25-9e5f-a2f7412d2451	2828	2624	#0ea5e9	#ffffff	#000000	game-icons:elf-ear	t	t	\N	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
a40b3485-cb9f-4a72-95d2-080ff140b1cd	Noswe mountains	9d76e82c-a0cf-4d25-9e5f-a2f7412d2451	2798	2577	#ffffff	#ffffff	#000000	game-icons:mountains	t	t	\N	\N	\N	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
2429dc24-d96c-4a1a-94f8-2d3f91891389	\N	9d76e82c-a0cf-4d25-9e5f-a2f7412d2451	1808	1609.5	#ffffff	#ffffff	#000000	\N	t	t	\N	\N	\N	\N	e1943b46-b616-4649-a01e-e8dcdf0d6b2b	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
35727231-7173-4315-a5ed-8292b8a83a1f	\N	9d76e82c-a0cf-4d25-9e5f-a2f7412d2451	1808.6731195166403	1608.0471936542901	#ffffff	#ffffff	#000000	\N	t	t	\N	\N	\N	\N	a40c1aaa-a3b3-40a8-94d2-0826a52b5281	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
9b528dc5-2ec3-47a5-81bb-d81c029eb3c7	\N	9d76e82c-a0cf-4d25-9e5f-a2f7412d2451	2650.6940507874124	1466.6971095239983	#ffffff	#ffffff	#000000	\N	t	t	\N	\N	\N	\N	8c79d399-96f6-469e-9948-ad3baa8ce483	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
32285c88-c49b-46ca-aff1-1166a4240428	\N	9d76e82c-a0cf-4d25-9e5f-a2f7412d2451	2201.216126171588	1234.3909180329283	#ffffff	#ffffff	#000000	\N	t	t	\N	\N	\N	\N	565e7175-64d0-4cab-85b2-c88d7adc966f	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
\.


--
-- Data for Name: nodes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nodes (id, label, type, width, height, x, y, font_size, font_color, font_family, text_v_align, text_h_align, background_color, background_opacity, is_locked, is_template, z_index, parent_id, image_id, doc_id, character_id, event_id, map_id, map_pin_id, icon) FROM stdin;
d8f1ebfd-f345-42cf-8a35-d50956c946c1	Treno the Bloody Pheagon	\N	\N	\N	875	475	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	972e40bf-c301-4b1e-81be-81dc2a03ab65	\N	\N	\N	\N
272b51ff-d790-4ca1-aa51-0b411ef9f10c	Nyren	\N	\N	\N	525	1025	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	edba5cb4-6a02-4405-b37b-3852eb449940	\N	\N	\N	\N
467cfa56-52d1-4517-a5b3-b58a164f3987	Linlera	\N	\N	\N	575	1175	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	cde91141-356d-4bdc-9ed6-095f9971df4c	\N	\N	\N	\N
7d739fbb-239f-4c07-9918-cc8044573480	Aton Pheagon	\N	\N	\N	1025	325	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	72254500-1ef4-4b8d-940b-b9a059b74b5f	\N	\N	\N	\N
351f94c6-a609-4721-8c86-38b380fdfbeb	Selutia	\N	\N	\N	1375	325	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	64571933-d64d-40ff-8708-91543f9355e3	\N	\N	\N	\N
e8343d02-08b6-46fa-a062-54660ae48dbd	Elirah I Pheagon	\N	\N	\N	975	1025	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	61fa5f6a-cae3-48aa-bcbf-b10351299d23	\N	\N	\N	\N
9ebe2615-683b-43a9-b822-e8dd117f826e	Banis I the Great Pheagon	\N	\N	\N	875	1175	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	446bbfe5-c3ba-4de1-8cae-db4fc1206c15	\N	\N	\N	\N
d47d78ed-70c3-4760-aeef-a244306229e9	Narik Pheagon	\N	\N	\N	1225	475	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	d2fb5503-3f99-41cb-9e1a-a20b72417567	\N	\N	\N	\N
a8a3df67-6136-4493-a734-5cde290ed59e	Itone	\N	\N	\N	475	1325	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	e9ec7008-a4f7-4f11-a648-6fd118f1d374	\N	\N	\N	\N
a6f13fb9-823f-41dc-89a4-5ca89dd487ce	Gan II Conqueror of Taeth Pheagon	\N	\N	\N	175	2175	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	6e79865e-cc81-4da7-9be0-8674932413b0	\N	\N	\N	\N
66c53d31-fbbf-45a5-b9b6-032f18b186b8	Merielle of Thawn	\N	\N	\N	75	1525	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	4aa9136c-ce33-4290-90a0-327cf44f925d	\N	\N	\N	\N
029cb737-f278-49bb-81db-e7c3f46cb0b7	Zorah	\N	\N	\N	175	1875	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	8e89ad04-5a59-4fb5-922f-8a37a374511e	\N	\N	\N	\N
ebfa2b63-c80a-409a-b3ad-c637f3cfc0a6	Turis III Pheagon	\N	\N	\N	275	2025	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	5bcadcd6-1639-461c-9d1b-a88a9615a030	\N	\N	\N	\N
24df029c-3185-45a8-a00b-3987812318e2	Turis II the Liberator Pheagon	\N	\N	\N	575	1525	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	e0a57db4-960d-4175-8466-7bdb16bb975d	\N	\N	\N	\N
c9750237-f839-46d0-a551-0ed54e053266	Elirah II the Great Pheagon	\N	\N	\N	275	3875	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	d760c6fb-9376-4551-94a0-4b16e85e96ac	\N	\N	\N	\N
76fcf4b6-0d2d-486f-865e-670289b4dc10	Trezar the Greedy Pheagon	\N	\N	\N	75	3375	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	b62fe6c0-0e2f-46a9-85d6-8b2223ec403e	\N	\N	\N	\N
deaeea6d-df72-45de-8794-236a75c92d71	Hatni	\N	\N	\N	775	2025	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	7680246a-a1d5-40c7-9628-3a366c47a2c1	\N	\N	\N	\N
8e49d834-109a-4340-adfd-3f1bc7461f36	Andra	\N	\N	\N	525	2375	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	77a419bb-fe76-424c-88db-cac29199f0d6	\N	\N	\N	\N
15acbb68-aa44-40dd-afbd-304b15ac4d71	Sarilla	\N	\N	\N	425	2375	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	1beb584e-8cb0-41b3-90ad-b8fc51e4030e	\N	\N	\N	\N
79524660-e0c7-4977-a9bf-611ec2895c2b	Sen Pheagon	\N	\N	\N	325	2525	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	ac451175-aa47-4d8a-9dfd-2dbd35fdf2bd	\N	\N	\N	\N
b559a066-3d11-4761-a8f5-fd535f52ca6b	Syris II the Amused Reformer Pheagon	\N	\N	\N	225	3175	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	c2eaf201-61ab-46dc-83c2-0cf0654553b1	\N	\N	\N	\N
b7f8c6d5-1938-4614-8424-05471d5336f0	Oleandra	\N	\N	\N	475	3175	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	fdfd317b-451e-4600-a9af-cf648f9500dc	\N	\N	\N	\N
5a9ff93d-23e8-4936-b553-8809db07b8ad	Lyanna	\N	\N	\N	175	3375	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	7638c01b-b48e-435e-8103-a35c4d08a4b3	\N	\N	\N	\N
6ad3969f-7490-4d4c-bf94-96bbeb4fc0a4	Syris III the Martyr Pheagon	\N	\N	\N	475	4075	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	26005085-8938-47bd-8928-85df8e8afdb6	\N	\N	\N	\N
7ff85ed0-6e83-4394-9cd2-af175d6edd3d	Elrad I Conqueror of Xaf Pheagon	\N	\N	\N	875	1325	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	430cda7d-8ab9-43fc-a8cb-8e69a0220a5f	\N	\N	\N	\N
86f200e4-3dba-4170-860e-bc5d3fc27080	Lutia I the Weak Pheagon	\N	\N	\N	175	3725	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	f6b6c4c3-31a3-4a7d-8376-82319f31c4c8	\N	\N	\N	\N
2ff0cdee-4493-4628-a750-207c169e4f42	Niya II the Patron Pheagon	\N	\N	\N	275	3525	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	90f10a2e-fb73-4830-8306-41f5e2b0d612	\N	\N	\N	\N
0b976f81-b585-4874-a777-83ded588e046	Lerima I the Scholar Pheagon	\N	\N	\N	425	3525	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	f03fb0cd-5640-4a78-a029-1d9c2ffa7a84	\N	\N	\N	\N
eb5bb472-259d-4f38-90e7-e7da9accabf4	Orid I Pheagon	\N	\N	\N	425	3375	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	f7b9f2e6-60eb-401b-ab89-195b41835a5f	\N	\N	\N	\N
a977bba0-a9f4-4c04-bdad-2ed02d904372	Marcel Pheagon	\N	\N	\N	425	3025	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	eff224bc-c8ab-46f1-844c-9df1d28609d2	\N	\N	\N	\N
006689df-2206-4b06-ac81-689d533759c6	Trillia II Savior of Salaraan Pheagon	\N	\N	\N	575	2175	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	55c882ad-8311-4e43-96b7-e995928f73dc	\N	\N	\N	\N
e470d9e6-5aa9-4453-a295-cefb642e17a4	Ceridan Pheagon	\N	\N	\N	375	1875	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	992cb4e3-ccc3-4c82-8172-3135e85e4099	\N	\N	\N	\N
9a3ba972-4d65-4243-a152-d7a8e0cb8e8a	Banis II Pheagon	\N	\N	\N	675	1325	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	089ebc15-1543-4d92-b077-7bd832eb2a79	\N	\N	\N	\N
cf44e6b1-09f0-499e-92b2-e962a1b470e4	Aldra	\N	\N	\N	575	2525	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	fa75b650-b6ab-4763-a86e-a16e25ecd5af	\N	\N	\N	\N
41248846-c23c-4605-8442-13f4cf05f144	Yeraso the Honorable Pheagon	\N	\N	\N	525	925	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	939fbb69-bf03-4e1a-97e7-8f987d1fcb80	\N	\N	\N	\N
46ea7677-3504-4c62-83b0-b7e0ff5dd436	Waridan the Knight Pheagon	\N	\N	\N	625	775	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	5185926a-6761-40d6-941f-6909d2f393c0	\N	\N	\N	\N
32803220-2e1b-4bd4-a4b2-bbed02ea3679	Rodanon II the Handsome Pheagon	\N	\N	\N	175	1675	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	f068b802-732a-4bbd-b423-5cc9f404434f	\N	\N	\N	\N
8682c917-99ab-4414-93cf-383f4d3d39cd	Rodanon III Pheagon	\N	\N	\N	375	2675	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	65a03f79-1467-49e4-b5d6-be4f297426fa	\N	\N	\N	\N
4320e38d-4c26-40d5-8f45-9e5956d384fc	Syris I Pheagon	\N	\N	\N	525	2675	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	b5ca043c-f6c0-4224-b772-ad0fe1c84f21	\N	\N	\N	\N
46a82caf-816e-4b2c-913f-721ea43f5979	Elvira	\N	\N	\N	75	3025	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	7e903b3f-5ade-4990-be1b-d945891aa802	\N	\N	\N	\N
2b4fd322-8781-4b49-8ca8-073fb1b654aa	Brandor the Wise	\N	\N	\N	525	3875	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	38bfff68-291d-4221-8de6-3073a5b0082a	\N	\N	\N	\N
0136cd16-e2ef-4048-8999-4481ed38f4dc	Elys the Bloody Pheagon	\N	\N	\N	225	3025	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	b75309d2-b3aa-467e-9e85-8b9983feb9c2	\N	\N	\N	\N
c38be8c6-6e85-4bde-b908-554299c6af9b	Theros Pheagon	\N	\N	\N	325	3025	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	3cfb4abf-2ead-466d-88ca-4761ecdbeda0	\N	\N	\N	\N
2174fa8c-6dff-4d64-9370-cdfdbc80c41f	Gerion	\N	\N	\N	75	3525	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	4b409c17-b35c-4c94-a5c6-c5f996589eb9	\N	\N	\N	\N
01980fb8-4518-4afd-b2a0-b36fb0d22daa	Stannus	\N	\N	\N	775	4375	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	0632b05b-b6ca-4cb6-95d3-269b3822336c	\N	\N	\N	\N
c401865d-a67d-4e97-8dbd-f907c123f4f1	Carinna	\N	\N	\N	-375	6275	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	9a25c621-d46a-493c-b876-dab5a639c0c9	\N	\N	\N	\N
a14c2cc2-acee-4602-a025-dc9c7f2e99d3	Turis I Pheagon	\N	\N	\N	1025	175	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	58fc3988-e686-41fc-b62b-a10c0416ac44	\N	\N	\N	\N
d53961c5-44b2-4646-8979-3357f170e86d	Ingonia	\N	\N	\N	-775	6425	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	fce94a81-baa3-4dbd-9d9b-98e0d28db9c8	\N	\N	\N	\N
bb4aba80-89a2-40a4-aad8-23b5d8956f7b	Merissa Teal	\N	\N	\N	-675	6625	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	a48a1161-f834-4296-a955-c01c8a8e7cc6	\N	\N	\N	\N
7b49f0fe-e358-4e7a-a0d1-ff76ec6cccab	The Pheagon	\N	\N	\N	1025	25	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	aaa02323-5478-4373-9e25-bb1735c00e0e	\N	\N	\N	\N
0ab4d7c5-1a9f-4e3b-9525-8a22650e249a	Anona II the Just Pheagon	\N	\N	\N	175	4075	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	ddb2f771-f6e2-492a-81bd-d9c8af8fd15e	\N	\N	\N	\N
170a167f-0c0d-405f-8a53-7d1c759daa80	Orid IV Pheagon	\N	\N	\N	-425	6425	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	420c052c-e3f9-4cde-b3b0-8bb5ab115a6c	\N	\N	\N	\N
9ff45d94-6863-4705-95aa-b610d1de2946	Thymos Pheagon	\N	\N	\N	325	1675	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	ea64ffaf-8dea-40fa-b089-083931d21858	\N	\N	\N	\N
2e446bc8-4422-4c85-82db-61306109a4f5	Deinara	\N	\N	\N	575	1675	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	a8ac515d-8f56-4673-aa40-436d36a3622e	\N	\N	\N	\N
c97a7c08-0b95-42dc-a826-de60a243cb33	Indra	\N	\N	\N	1025	475	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	be9944bd-083b-4f82-ae7f-16ce579b3a74	\N	\N	\N	\N
940d4f47-e9cb-4d9c-bd1e-c7e7740c7cf8	Etanna	\N	\N	\N	275	2175	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	715b3d8a-9faf-46b6-ab1b-bf1138bc7134	\N	\N	\N	\N
7c94c396-d04a-48b7-ab25-36bf0be35bc4	Morbus	rectangle	100	100	1775	1025	\N	\N	\N	\N	\N	#595959	\N	t	\N	\N	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7	\N	\N	\N	\N	\N	\N	\N
6787dede-e88c-4cc1-ba18-8296d6e90a40	Obscurum	rectangle	100	100	1275	1025	\N	\N	\N	\N	\N	#595959	\N	t	\N	\N	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7	\N	\N	\N	\N	\N	\N	\N
a312eaeb-24cb-4b59-80d1-61c5e45c0999	Mevor	rectangle	100	100	1525	1025	\N	\N	\N	\N	\N	#595959	\N	t	\N	\N	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7	\N	\N	\N	\N	\N	\N	\N
6b1eda94-7f01-4533-8169-a449e5fa2f16	Umbra	rectangle	100	100	1025	1025	\N	\N	\N	\N	\N	#595959	\N	t	\N	\N	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7	\N	\N	\N	\N	\N	\N	\N
52207f9a-e7b2-4903-ba95-d55c19590ef7	Banis III the Unready Pheagon	\N	\N	\N	375	4725	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	78529628-b5cf-4d05-a8c3-2f651fa56391	\N	\N	\N	\N
4edcaafe-cb97-4ec5-83ba-0acf15c1a9f8	Rhiannon Pheagon	\N	\N	\N	575	3025	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	8611ab61-310c-4c11-80d9-53e814012d6f	\N	\N	\N	\N
033605a1-6240-4c22-acfb-2fcb74c7f8a1	Paus I the Philosopher King Pheagon	\N	\N	\N	675	4575	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	47b28ed9-edc3-4ce6-ae53-8b59b46db787	\N	\N	\N	\N
cf3cd5f7-8323-4a02-b839-826d8d951302	Lerima II the Warmonger Pheagon	\N	\N	\N	575	4225	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	6881540b-9f07-43af-931b-7afdf5bb1e36	\N	\N	\N	\N
044ef346-ae7f-402c-9d3c-2e853ec45909	Riordan the Bold Kyton	\N	\N	\N	2195	4735	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	3b84aabb-8086-419a-88a1-fa6991150583	\N	\N	\N	\N
1a81a934-cfce-4c13-a76a-2ca35d557827	Naltor I Lawgiver Pheagon	\N	\N	\N	475	2825	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	d2006ddc-4d99-4dfd-a55d-b425410243e4	\N	\N	\N	\N
8f7495aa-c434-44db-aa83-9196cceb8cb1	Mersus	rectangle	100	100	775	1025	\N	\N	\N	\N	\N	#595959	\N	t	\N	\N	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7	\N	\N	\N	\N	\N	\N	\N
2462c18f-3e19-4ddf-a405-f829fe591ae2	Fragor	rectangle	100	100	275	1025	\N	\N	\N	\N	\N	#595959	\N	t	\N	\N	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7	\N	\N	\N	\N	\N	\N	\N
46803a5f-42f3-4aae-8c39-ed7292824d6c	Sicarius	rectangle	50	\N	875	875	\N	\N	\N	\N	\N	#595959	\N	t	\N	\N	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7	\N	\N	06d43ae7-a804-4072-aa37-14800b4b13f1	\N	\N	\N	\N
359039a6-e9d2-440e-b3ac-cf0eb5d00db0	Aldeem the Explorer Pheagon	\N	\N	\N	225	2375	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	f2a2663e-dedc-465d-ba79-f845235d4748	\N	\N	\N	\N
0b8e4a10-ac6f-414f-86d9-4073c92c5eb1	Lutia II the Blind Pheagon	\N	\N	\N	575	4375	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	a316698a-b376-4d07-acec-1c4fa859b3e5	\N	\N	\N	\N
df19c5d1-23a2-4c8e-b5d6-5ae3b64f6bbc	Devon Pheagon	\N	\N	\N	875	4225	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	0f916460-8c32-443c-912a-842207838174	\N	\N	\N	\N
d51cbfba-b69a-4bae-86f3-614fb32d92e2	Avek Pheagon	\N	\N	\N	425	4375	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	115322e3-8301-4ba3-876b-9a9f51e20edc	\N	\N	\N	\N
abcee563-1562-4070-93b7-6fca396eef8d	Jamila the Fair	\N	\N	\N	1075	4375	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	3384123d-7dc1-4728-a320-1ffb905b7d98	\N	\N	\N	\N
a89678b8-2057-4f7b-b775-d508cd05fbe0	Thereena	\N	\N	\N	1075	4225	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	551bd74b-964d-4c9e-98f3-6ccce8724046	\N	\N	\N	\N
3933b53b-30ec-4f17-867f-99cb50c91648	Edward the Uplifted Rodanon	\N	\N	\N	775	5025	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	32be8979-fe27-4c3f-9a08-8acec68b5439	\N	\N	\N	\N
e9028c87-a7d0-4229-9ac7-1ffabb816cde	Catalin-Alenna	\N	\N	\N	525	4575	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	cf8d67e7-054e-4400-b4ab-7cdb70f84154	\N	\N	\N	\N
cf091493-585a-4992-a55a-f1c28262e989	Rhys I the Mage Rodanon	\N	\N	\N	975	5025	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	9db21149-f9c2-4817-b501-b7a35def7c42	\N	\N	\N	\N
bb715c2b-b4af-449f-a8df-d5c6f2a67f5a	Oradro Kython	\N	\N	\N	975	4375	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	22fcff15-630a-4fe7-8aa9-893f52e13b74	\N	\N	\N	\N
1d9168fb-1275-4874-8c44-fc743c689a6d	Andra I Pheagon	\N	\N	\N	175	4725	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	43855f00-564a-4d7c-873d-b4260954b14d	\N	\N	\N	\N
cee1530a-c13a-4ac9-a336-afb5eb12ffec	Robert I Rodanon	\N	\N	\N	1075	5025	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	6a314fe0-050b-4e56-a4d7-689120560568	\N	\N	\N	\N
832463f3-1e14-44ad-8a6a-28ef165d7041	Rodanon I the Strong Rodanon	\N	\N	\N	1175	5025	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	c69ecc10-7730-4d55-aa95-c4c2cd65617a	\N	\N	\N	\N
eae33757-f5ee-472c-be0d-59ea52a6f39c	Quimus the Forgotten Pheagon	\N	\N	\N	75	4925	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	52df46d6-8765-44e5-91c0-bc873903b914	\N	\N	\N	\N
53b57035-53e2-4686-9a28-f830d5336262	Hellen of Yarlen	\N	\N	\N	-375	5325	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	14d640fb-761f-44a2-9868-164eb1a618e8	\N	\N	\N	\N
a7cbc3e3-48a1-4cc1-833a-31a3bfa4e655	Banis IV Pheagon	\N	\N	\N	-325	5475	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	05a62bbb-6fa4-46b0-ae14-4115937b9f5e	\N	\N	\N	\N
6f8eec7b-3357-469e-bb5e-84df95f42fce	Vesilia II	\N	\N	\N	-225	5475	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	0dc49010-17d4-493d-9853-1d19927f10ac	\N	\N	\N	\N
654c399d-27d9-4fdd-addc-a1b490e6cee1	Syris IV Pheagon	\N	\N	\N	-125	5475	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	1ba5fd05-db0c-4e0d-b89c-52eb728f6b9d	\N	\N	\N	\N
c84b3940-fbd0-44ed-9446-e1c9dd276784	Risalia	\N	\N	\N	275	4925	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	af42cb03-c6fb-40c0-87c7-d12901b630d4	\N	\N	\N	\N
7b9bb329-ab0b-4b82-91b8-b6e6dc093ad8	James I Rodanon	\N	\N	\N	1275	5025	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	65b58ba7-5dab-4f61-9bf5-3bddadbbe8be	\N	\N	\N	\N
49bd8cc3-ef09-4c9e-bb3a-5a6375eb8e4a	Armand Kyton	\N	\N	\N	1525	4725	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	423e057a-c207-4b91-9521-a00b0f89ee4f	\N	\N	\N	\N
585f6177-2bea-459c-b006-24cf04830134	Cedric I the Magnificent Kyton	\N	\N	\N	1625	4725	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	5c191811-99dd-4487-aae1-5eab69c35358	\N	\N	\N	\N
7a98732b-2937-4f60-b31c-5110ca4dbdcc	Nathaniel Kyton	\N	\N	\N	1475	4575	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	4c41a048-adec-4ec4-8b52-b976eb3be723	\N	\N	\N	\N
7668dea5-eaeb-45ef-aeb0-dfcdf91b3e2d	Titus the Banished Kyton	\N	\N	\N	1175	4575	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	86c5a4ec-a058-4c91-8937-cc71f0f7af77	\N	\N	\N	\N
a8ba19da-2d79-4ab5-b92e-80276db5dd1c	Victoria	\N	\N	\N	1675	4575	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	7b6c828c-8d97-48be-a237-d1e0611aa6a4	\N	\N	\N	\N
c71c93cc-6267-41b5-9e51-595f9cb87c44	Jakshir Pheagon	\N	\N	\N	525	4875	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	2ddefdce-7d00-4668-988c-53d24d79e056	\N	\N	\N	\N
7f5fac11-8e92-40d4-9e81-8c24d49e15e7	Radalia	\N	\N	\N	675	4725	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	948a8aa0-8386-4c0f-b715-8cd0c7609d6b	\N	\N	\N	\N
580a9edd-1cf8-4b81-a6bf-9d9e97fe068d	Celine Kyton	\N	\N	\N	1925	4575	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	f9b13f77-6319-4225-9910-2b6a64652fb6	\N	\N	\N	\N
069b2c8f-447b-4223-b409-7625f83b1832	Hugo Windslich	\N	\N	\N	2075	4575	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	f9671ab8-4d1c-4d45-8b3c-5eb9ebe723dc	\N	\N	\N	\N
25a8dafe-8785-42be-8d15-479e0595919a	Illaran	\N	\N	\N	375	3725	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	d4253843-b4b2-4136-a25d-e6fccb7cc72a	\N	\N	\N	\N
f30897f3-4c51-43fc-ae3c-0504249786ef	Vesris	\N	\N	\N	625	2375	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	c5fc22dc-9451-4d2d-b563-2d2bf9bb4193	\N	\N	\N	\N
ae9a38cb-0684-4f53-9c2e-427c05274bb7	Gelaryn	\N	\N	\N	-25	4725	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	1feca789-8251-4766-9c7b-e7e1fe6cc004	\N	\N	\N	\N
ecb82a20-fb86-4600-bfe5-20e5401e8cff	Rodanon IV the Bull Pheagon	\N	\N	\N	825	4825	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	ee9aeef6-bb12-492d-8c65-4c6541a97e3c	\N	\N	\N	\N
29e61c9f-efeb-4664-8fa6-cbf5d30bdad5	Emilia Kyton	\N	\N	\N	1875	4725	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	a4863ad6-985a-46e3-aeaf-5ce290375c25	\N	\N	\N	\N
42386017-1f2f-4910-a70d-7926ba0edea1	Alexius the Golden Rodanon	\N	\N	\N	875	5025	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	e962a0e7-3467-4abd-9167-fd35508c99aa	\N	\N	\N	\N
ad2826c5-d984-4435-b87a-1109b49653b3	Trillia I the Reformer Pheagon	\N	\N	\N	525	1875	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	4573aa15-33e0-46dc-bb32-20de8b68bd88	\N	\N	\N	\N
e76dd6f6-fefc-424d-8fc8-739bb6026c23	Perliana	\N	\N	\N	425	775	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	d5cce706-aab4-4390-8f2c-9aa8135f4bf4	\N	\N	\N	\N
b4d09aba-203c-4644-b4dc-b33ed41ec160	Miyala	\N	\N	\N	875	775	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	45a3b9cc-c971-462f-b85c-df8f678b17fc	\N	\N	\N	\N
4e612c0d-dd18-43f3-9382-19bd437eb882	Rodanon I Pheagon	\N	\N	\N	1075	775	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	836feb12-4be9-4ef9-bfc2-04b89c82d785	\N	\N	\N	\N
ac2a4196-1f45-437b-a219-40b79c358c50	Keianos	\N	\N	\N	925	625	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	eec884b6-89b5-46b1-b342-af07bd253719	\N	\N	\N	\N
23e8b8bf-1821-421d-8e40-28fc52bcd1c3	Niya the Unworthy Pheagon	\N	\N	\N	1125	625	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	ca84cf36-c80a-4674-8ac3-f628a42aa560	\N	\N	\N	\N
02b1c948-28b1-4b04-8d1f-8a074e1a5127	Gan I the Short Pheagon	\N	\N	\N	1275	775	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	af75eb77-c24c-485a-a7cb-483ca778cd66	\N	\N	\N	\N
df42fe7a-fb1e-4b70-8514-4d65f4b9a6e6	Lewis I Anona	\N	\N	\N	125	4375	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	3cf1a90e-7475-419a-9290-2e8d727432c9	\N	\N	\N	\N
1c7e75a4-21d0-40a8-bc74-d1a4ab2fe83d	Tristan Anona	\N	\N	\N	225	4375	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	9aa07364-9dd2-4227-a62e-998e792e4b8a	\N	\N	\N	\N
2c5987e1-0538-48e8-a9f1-6dfe27bc93b1	Orid III the Reluctant Pheagon	\N	\N	\N	-275	6275	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	f3d7e4b2-ade4-4da4-83ad-2f007746395a	\N	\N	\N	\N
0984a719-0e41-4796-b569-bb91b0d0eb5b	Banis V the Magnificent Pheagon	\N	\N	\N	-275	5625	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	2ae57613-1a15-432b-ab75-57dc566a8fed	\N	\N	\N	\N
371d218f-daa9-483e-bdd0-7cd3c10deef9	Irecia	\N	\N	\N	-175	5625	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	48aa1ba9-fc92-4b3f-859b-f3284e35436e	\N	\N	\N	\N
fd444292-6ef1-496d-9f06-f401cc658bde	Rillia	\N	\N	\N	-425	5775	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	ca088a1a-8fcd-430f-b3c9-7ba6446477a8	\N	\N	\N	\N
f69074e8-934e-45cf-94a5-d324cca7f2fc	Asynia Krill	\N	\N	\N	-25	5125	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	19078d30-d5fe-4e39-8190-afbb41a35f28	\N	\N	\N	\N
7ab7057b-42b4-4bdf-9740-03c9a44e7a64	Andra II the Drunk Pheagon	\N	\N	\N	-125	6275	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	f183375b-c3ac-40a7-a72a-fee05a008267	\N	\N	\N	\N
8ca2c3e0-3dac-48c5-a3c3-140078541f7c	Niya III Pheagon	\N	\N	\N	-225	5325	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	5084316b-bcab-4881-bc38-bd912acf71ea	\N	\N	\N	\N
66da6a6c-024b-411f-8cf5-70b0ca3843f7	Yaris I the Accursed Pheagon	\N	\N	\N	25	6275	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	ae44fc3e-571d-4c58-a028-5183f94815f6	\N	\N	\N	\N
7d4d2d6c-710b-4a01-98b5-9fc013dfaa33	Naltor II Pheagon	\N	\N	\N	-125	5325	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	74e65ead-4b87-4092-a9a8-29ac04ec5551	\N	\N	\N	\N
e90cea06-a4f2-480a-9f39-6e79658fc395	Paus II Pheagon	\N	\N	\N	-175	6125	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	e5bad67a-1212-4999-80a8-0e3f267f3246	\N	\N	\N	\N
0d3f5eb0-6051-4b27-b033-f098891c614c	Umdara the Night Empress Pheagon	\N	\N	\N	275	5125	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	5cc32e0d-2ec1-460e-87b0-9bf6e3ee6ea0	\N	\N	\N	\N
7fe4f848-8adc-427f-8fd0-8f6160faf609	Theodore I Syris	\N	\N	\N	-25	5625	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	9d6c5ab5-9b67-4153-a75c-ae73efa4fcdc	\N	\N	\N	\N
862e8fc0-1bbf-45c5-9e12-7f3315cc4458	Connor Pheagon	\N	\N	\N	-225	5775	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	27a4a371-45e1-45f2-acf2-d5fbd36e32f4	\N	\N	\N	\N
757febff-a930-434d-814b-42bbc25e97ea	Essa	\N	\N	\N	1025	4825	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	db31376a-f4ea-49af-a494-32b6efa38001	\N	\N	\N	\N
a7830d4e-6dee-42f3-b9fc-f6c43584c5cc	Yaris III Pheagon	\N	\N	\N	-575	6775	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	5889baaf-1c5a-4087-a4b7-24d583395413	\N	\N	\N	\N
9e161f26-5abb-4d02-92fe-4698bb0b9fc3	Iraqunda	rectangle	100	100	525	1025	\N	\N	\N	\N	\N	#595959	\N	t	\N	\N	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7	\N	\N	\N	\N	\N	\N	\N
04960607-5632-4d1c-934d-15dac2eac3f9	Niya IV the Exhausted Pheagon	\N	\N	\N	-275	5925	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	b06f48da-8761-4eab-92d5-37fccad058fd	\N	\N	\N	\N
e7e2fdfd-0b62-4abe-9b23-015957f211bc	Banis VI Pheagon	\N	\N	\N	-825	6625	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	d05651da-7e14-4429-88d2-e1bcf6997290	\N	\N	\N	\N
62ff6a9e-62c7-49f0-9f6e-ffbfa8cc6e8b	Arillia the Red Witch	\N	\N	\N	-925	6625	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	4c7062f3-c0c3-47fc-b5ed-af609bde881d	\N	\N	\N	\N
f65bbe59-1ac5-43a2-bad8-e017ff9b2058	Yaris II Pheagon	\N	\N	\N	-225	6425	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	54ffebb4-a35e-417d-828a-8faade3fbb75	\N	\N	\N	\N
fd675a68-d77a-452a-bb9d-dd14e1b49d19	Catelyn  Stark	\N	\N	\N	175	225	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2e24bb7b-2121-458b-9058-3173dec8b408	\N	\N	5bc05aaa-cae5-40ac-b780-54929639f310	\N	\N	\N	\N
06fd0180-796d-4a6f-94ce-a4417fd9ba36	Hoster Tully	\N	\N	\N	325	75	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2e24bb7b-2121-458b-9058-3173dec8b408	\N	\N	35f92ae8-889c-4f94-80a7-be21f444823d	\N	\N	\N	\N
92ca44f2-1b75-446c-89e0-fdf12121824e	Tornren	\N	\N	\N	125	5925	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	fda0bcb5-a0eb-42a7-a0cd-4c7d85dba6b3	\N	\N	\N	\N
640a02fb-b40f-4dc7-9069-c276e15648b1	Eddard Stark	\N	\N	\N	325	225	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2e24bb7b-2121-458b-9058-3173dec8b408	\N	\N	a50a4981-40e4-44ae-82ff-27b6c4077ac2	\N	\N	\N	\N
d8041238-70d5-4650-abc4-bfc86ce9e872	Lysa Arryn	\N	\N	\N	425	225	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2e24bb7b-2121-458b-9058-3173dec8b408	\N	\N	719a9ed5-849f-46d1-80c8-5a45b7513b53	\N	\N	\N	\N
90104b25-a4a8-4cea-a36e-cc6d1232b74c	Emilia III	\N	\N	\N	-425	6125	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	a14e372a-dac3-44f9-9c3a-7e0b4419db2c	\N	\N	\N	\N
c2aafd50-38ec-4641-a569-143b21d5a605	Cecilia the Priestess Pheagon	\N	\N	\N	75	6125	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	abcfe56e-d89b-47b5-a248-d58a2a9ddf7a	\N	\N	\N	\N
7a4791d3-8fbc-4bad-816e-8a1f2025f323	Lutia III Pheagon	\N	\N	\N	-575	5925	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	bea58ad5-ee6e-4b88-9548-c38578f0dd7d	\N	\N	\N	\N
3526e662-1808-4805-8512-740aa7aba713	Andra Pheagon	\N	\N	\N	-475	5925	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	518bd02d-52c9-4d20-bcca-bee6233665a8	\N	\N	\N	\N
756090be-37ea-41d7-861d-03923919ab9e	Lucius Pheagon	\N	\N	\N	-675	6925	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	5f874844-c636-460f-bf39-134faa548624	\N	\N	\N	\N
9cf82e6d-72d3-476d-a537-92eb2fafc0a0	Edmure Tully	\N	\N	\N	525	225	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2e24bb7b-2121-458b-9058-3173dec8b408	\N	\N	18edfff6-5e09-4028-8085-96aeacf96280	\N	\N	\N	\N
10540af3-ed32-493b-ab4b-2a79a9b12d59	Alexius Pheagon	\N	\N	\N	-425	6625	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	66fc9c8e-78b2-437a-9972-7189dd1665e1	\N	\N	\N	\N
8160db1c-b309-4ed7-bdb1-b1c934e12533	Aurelian Pheagon	\N	\N	\N	-375	6925	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	565e7175-64d0-4cab-85b2-c88d7adc966f	\N	\N	\N	\N
fc2784a3-8dab-4dba-b165-93e1445fc50c	Hyrora	\N	\N	\N	-475	6775	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	02ef72f7-2ba3-49a1-885b-f780a74cb7ef	\N	\N	\N	\N
fd9a016c-f3f9-44f0-8c87-46415c3892a5	Cedric Anona	\N	\N	\N	25	4225	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	a2e6e181-0843-428e-9610-14d7ac80f6e4	\N	\N	\N	\N
7783cb28-a18f-48b3-9340-7e7e3c970929	Orid II Lightbringer Pheagon	\N	\N	\N	-325	5125	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	71e2652e-2255-4eba-8199-ca20e579cfe6	\N	\N	\N	\N
90136c60-83c6-4128-ad22-e01c609969f2	Telrisen	\N	\N	\N	325	4225	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	\N	\N	2a6fa77a-79fc-41b7-a6d2-77dc5c8706be	\N	\N	\N	\N
9e2a16e8-1ab2-4a67-9ff3-b0fb5d9465ae	Aeryis II Targaryen	\N	\N	\N	225	75	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	37362901-1a7a-45e9-ae15-dbe95cf50535	\N	\N	2eccad6c-c292-43fa-8cb3-9f5c241b53ea	\N	\N	\N	\N
33cf6d06-bc6c-4c3b-8510-4adbb721ff2c	Daenerys Targaryen	\N	\N	\N	75	225	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	37362901-1a7a-45e9-ae15-dbe95cf50535	\N	\N	e273762b-0b47-44fa-a942-694461d12565	\N	\N	\N	\N
79719154-4325-4d1d-b76d-b712f9383ef4	Viserys Targaryen	\N	\N	\N	225	225	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	37362901-1a7a-45e9-ae15-dbe95cf50535	\N	\N	d0506f08-8bad-4924-b75d-26888a3bceaa	\N	\N	\N	\N
fef23410-b70b-4839-9287-85a726153050	Rhaegar Targaryen	\N	\N	\N	375	225	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	37362901-1a7a-45e9-ae15-dbe95cf50535	\N	\N	bb3c5c51-c52d-4ce2-9c63-42d9cef75a3d	\N	\N	\N	\N
8ef06fc4-6455-4392-983e-58a7c6e836e9	Robb Stark	\N	\N	\N	75	375	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2e24bb7b-2121-458b-9058-3173dec8b408	\N	\N	3c9ef747-bf4c-44ff-8a71-6648fc1c8642	\N	\N	\N	\N
f5d0f41a-9405-4cfb-bc4a-243f2956791b	Rickon Stark	\N	\N	\N	175	375	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2e24bb7b-2121-458b-9058-3173dec8b408	\N	\N	9a68e881-000e-4de6-9408-7b3ff632f9ad	\N	\N	\N	\N
5bbf5234-c705-4efa-b460-f047ad42e2de	Sansa Stark	\N	\N	\N	275	375	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2e24bb7b-2121-458b-9058-3173dec8b408	\N	\N	64aaa1af-aae7-40b4-95fd-316cbd2c349b	\N	\N	\N	\N
cf7a97af-9a9f-4387-a5ee-62e1330e1cf8	Bran Stark	\N	\N	\N	425	375	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2e24bb7b-2121-458b-9058-3173dec8b408	\N	\N	7296e38f-f51b-4357-bfb0-f82a737b662a	\N	\N	\N	\N
57950476-e96f-48e5-96c8-cd2fc4fbd8eb	Arya Stark	\N	\N	\N	525	375	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2e24bb7b-2121-458b-9058-3173dec8b408	\N	\N	3dc7880d-a137-4e9a-9f3f-a55023b63f9c	\N	\N	\N	\N
97557dac-bd49-4e25-904c-9d2f351c7320	Joanna Lannister	\N	\N	\N	75	75	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	c4e76e21-d296-4552-a654-0cd7735a82ed	\N	\N	51622f08-c61f-4c22-8258-e2dd5b9c10f5	\N	\N	\N	\N
01185907-4aa6-42d6-aa64-e9f6d104f947	Tywin Lannister	\N	\N	\N	375	75	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	c4e76e21-d296-4552-a654-0cd7735a82ed	\N	\N	56abc767-1971-43fb-a08e-878aaab783b1	\N	\N	\N	\N
76099c15-01ac-42e5-809e-04af29c6ae71	Jamie Lannister	\N	\N	\N	375	225	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	c4e76e21-d296-4552-a654-0cd7735a82ed	\N	\N	b184a4d0-6b5d-4672-8343-0dda42f129ed	\N	\N	\N	\N
2d0cb16e-8093-4867-a5de-122a86c382a3	Cersei Lannister	\N	\N	\N	225	225	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	c4e76e21-d296-4552-a654-0cd7735a82ed	\N	\N	474d03c5-18a1-4e0e-a298-9e479fe64df6	\N	\N	\N	\N
cd88656a-d5b9-43d7-b1b1-fba7c44918a6	Tyrion Lannister	\N	\N	\N	75	225	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	c4e76e21-d296-4552-a654-0cd7735a82ed	\N	\N	796c16ad-9145-4ffc-a762-19f517ba0e4d	\N	\N	\N	\N
6f8eed19-0bb2-4163-a0ee-1ee20270ab9d	The North	\N	200	215	575	225	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	14b0d12b-72de-4a00-9c00-c89e49055116	27cd8fef-fea0-4779-9324-5af0931d9b92	\N	\N	\N	\N	\N	\N
3d3ea5c8-68a4-4f90-a2a6-f024fd9877c7	The Westerlands	\N	200	215	1025	225	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	14b0d12b-72de-4a00-9c00-c89e49055116	e2951f29-532a-445a-b8aa-a2b4f3fa701f	\N	\N	\N	\N	\N	\N
652014d0-1a16-49c8-bc00-8fcaeed544b7	Winona Mograine	rectangle	50	50	1125	875	16	#ffffff	Lato	top	center	#595959	1	t	f	1	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7	635aea48-a4f1-49b5-b4a3-ce7fdbd71400	\N	60600919-d5b5-49f8-8bb8-1cda143c7759	\N	\N	\N	\N
d7563518-25d8-4551-a4d8-36c8e03db83e	Exodus	rectangle	100	100	1025	1225	\N	\N	\N	bottom	\N	#595959	\N	t	\N	\N	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7	\N	\N	\N	\N	\N	\N	\N
91961a17-8461-46da-9629-c38db6e108fd	Theya	rectangle	100	100	1025	325	\N	\N	\N	\N	\N	\N	\N	t	\N	\N	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7	\N	\N	\N	\N	\N	\N	\N
611c4d66-1bd4-44e0-8cc8-10493bb6ad4d	Lux	rectangle	100	100	1025	525	\N	\N	\N	\N	\N	\N	\N	t	\N	\N	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7	\N	\N	\N	\N	\N	\N	\N
3a882cce-2a6c-46ac-bd1a-aa7182fe33c3	Vivus	rectangle	100	100	875	525	\N	\N	\N	\N	\N	#595959	\N	t	\N	\N	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7	\N	\N	\N	\N	\N	\N	\N
231103c6-f46f-4767-ae5e-d403400e7e4f	Lacuno	rectangle	100	100	725	525	\N	\N	\N	\N	\N	#595959	\N	t	\N	\N	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7	\N	\N	\N	\N	\N	\N	\N
11788484-c3d7-4955-af56-3f210d49719c	Trisitia	rectangle	100	100	575	525	\N	\N	\N	\N	\N	#595959	\N	t	\N	\N	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7	\N	\N	\N	\N	\N	\N	\N
dcda9fb2-4a99-46a5-b22d-e10c126f77c9	Medela	rectangle	100	100	1475	525	\N	\N	\N	\N	\N	#595959	\N	t	\N	\N	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7	\N	\N	\N	\N	\N	\N	\N
9916704a-0643-4570-a43b-5f5f592170dd	Fiducia	rectangle	100	100	1325	525	\N	\N	\N	\N	\N	#595959	\N	t	\N	\N	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7	\N	\N	\N	\N	\N	\N	\N
e9c97ed1-3d9a-4323-8691-fb586b3f2744	Verumal	rectangle	100	100	1175	525	\N	\N	\N	\N	\N	#595959	\N	t	\N	\N	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: edges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.edges (id, label, curve_style, line_style, line_color, line_fill, line_opacity, width, control_point_distances, control_point_weights, taxi_direction, taxi_turn, arrow_scale, target_arrow_shape, target_arrow_fill, target_arrow_color, source_arrow_shape, source_arrow_fill, source_arrow_color, mid_target_arrow_shape, mid_target_arrow_fill, mid_target_arrow_color, mid_source_arrow_shape, mid_source_arrow_fill, mid_source_arrow_color, font_size, font_color, font_family, z_index, source_id, target_id, parent_id) FROM stdin;
5a425f4e-54f7-48d2-a1ba-37fd4e56c873	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	c401865d-a67d-4e97-8dbd-f907c123f4f1	170a167f-0c0d-405f-8a53-7d1c759daa80	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
db7d2e23-12f2-42cf-850a-f7ab13300a4e	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2c5987e1-0538-48e8-a9f1-6dfe27bc93b1	170a167f-0c0d-405f-8a53-7d1c759daa80	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
a463aafc-d4f5-4f51-bf5e-88efb0f0a382	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	170a167f-0c0d-405f-8a53-7d1c759daa80	10540af3-ed32-493b-ab4b-2a79a9b12d59	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
1f349674-e5c8-4f4e-98cd-4666f5dda592	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	170a167f-0c0d-405f-8a53-7d1c759daa80	e7e2fdfd-0b62-4abe-9b23-015957f211bc	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
ad2c500f-1c31-4966-a3ef-9241592c9a63	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	170a167f-0c0d-405f-8a53-7d1c759daa80	62ff6a9e-62c7-49f0-9f6e-ffbfa8cc6e8b	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
e772b53e-4fe1-4a76-8411-22d408895d29	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	d53961c5-44b2-4646-8979-3357f170e86d	10540af3-ed32-493b-ab4b-2a79a9b12d59	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
f8c98c10-7004-47d4-8d7e-f94fab953fbb	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	bb4aba80-89a2-40a4-aad8-23b5d8956f7b	a7830d4e-6dee-42f3-b9fc-f6c43584c5cc	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
d857080d-3ee3-42cf-bf5a-e9dcb3ccf2ff	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7d739fbb-239f-4c07-9918-cc8044573480	d8f1ebfd-f345-42cf-8a35-d50956c946c1	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
400f821c-a1b0-4593-a59c-6ce3ea0c8a16	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	c97a7c08-0b95-42dc-a826-de60a243cb33	23e8b8bf-1821-421d-8e40-28fc52bcd1c3	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
ba37e1ba-0fb2-439b-b5a4-74491b212ec1	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	23e8b8bf-1821-421d-8e40-28fc52bcd1c3	46ea7677-3504-4c62-83b0-b7e0ff5dd436	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
b8b479f5-7b9b-49f8-831a-f2cf44b03d10	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ac2a4196-1f45-437b-a219-40b79c358c50	46ea7677-3504-4c62-83b0-b7e0ff5dd436	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
78eb21d2-9bd5-4be4-b921-c49103a0b3a5	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	46ea7677-3504-4c62-83b0-b7e0ff5dd436	41248846-c23c-4605-8442-13f4cf05f144	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
4c670b4b-c9b5-4622-9824-8b3525196690	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	a7830d4e-6dee-42f3-b9fc-f6c43584c5cc	756090be-37ea-41d7-861d-03923919ab9e	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
9c35327e-be40-4494-b3ca-ffe98d5dbc5e	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	a7830d4e-6dee-42f3-b9fc-f6c43584c5cc	8160db1c-b309-4ed7-bdb1-b1c934e12533	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
cfd3e79a-7084-4824-baed-78b8e1571384	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	b4d09aba-203c-4644-b4dc-b33ed41ec160	e8343d02-08b6-46fa-a062-54660ae48dbd	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
7dfa86b7-a367-4f71-86ce-46a90b123e60	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	272b51ff-d790-4ca1-aa51-0b411ef9f10c	9ebe2615-683b-43a9-b822-e8dd117f826e	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
ae0e8325-1cf2-4622-854d-90da380b19f3	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2c5987e1-0538-48e8-a9f1-6dfe27bc93b1	f65bbe59-1ac5-43a2-bad8-e017ff9b2058	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
592c59f4-3117-43fd-aa6e-42517aa52979	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	23e8b8bf-1821-421d-8e40-28fc52bcd1c3	4e612c0d-dd18-43f3-9382-19bd437eb882	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
4ce99f2a-8a6b-4ccc-a07b-ac8fcf9babdc	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ac2a4196-1f45-437b-a219-40b79c358c50	4e612c0d-dd18-43f3-9382-19bd437eb882	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
5e560871-d67b-48de-b54e-503d2b64500d	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	4e612c0d-dd18-43f3-9382-19bd437eb882	e8343d02-08b6-46fa-a062-54660ae48dbd	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
05a6c166-5915-480d-979d-8172f4ad5442	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	467cfa56-52d1-4517-a5b3-b58a164f3987	9a3ba972-4d65-4243-a152-d7a8e0cb8e8a	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
c3c51081-12db-424f-b29b-a5ebcd35257c	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7b49f0fe-e358-4e7a-a0d1-ff76ec6cccab	a14c2cc2-acee-4602-a025-dc9c7f2e99d3	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
e7578e1c-2e6b-4911-a61d-f8a404cc2b19	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	a14c2cc2-acee-4602-a025-dc9c7f2e99d3	7d739fbb-239f-4c07-9918-cc8044573480	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
d9ff29f6-90f5-419b-bbb7-bd94728c4900	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7d739fbb-239f-4c07-9918-cc8044573480	d47d78ed-70c3-4760-aeef-a244306229e9	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
c97c26fd-9fd8-4419-bc41-ff9aabc11e2f	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	351f94c6-a609-4721-8c86-38b380fdfbeb	d47d78ed-70c3-4760-aeef-a244306229e9	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
0c800d85-2136-4398-bd1f-fccda7395d8a	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	e90cea06-a4f2-480a-9f39-6e79658fc395	2c5987e1-0538-48e8-a9f1-6dfe27bc93b1	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
8e4f2972-07a5-4e01-8eb9-3aa23f755aac	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	90104b25-a4a8-4cea-a36e-cc6d1232b74c	2c5987e1-0538-48e8-a9f1-6dfe27bc93b1	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
8494d165-99ea-4863-8c96-81f208b787c1	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	d47d78ed-70c3-4760-aeef-a244306229e9	23e8b8bf-1821-421d-8e40-28fc52bcd1c3	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
a3b439e9-5b5f-49a0-8255-fab063bdb4c5	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	23e8b8bf-1821-421d-8e40-28fc52bcd1c3	02b1c948-28b1-4b04-8d1f-8a074e1a5127	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
995d4296-e47d-4d39-89b8-45ffce317c74	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	e76dd6f6-fefc-424d-8fc8-739bb6026c23	41248846-c23c-4605-8442-13f4cf05f144	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
a8de7f79-e497-44b5-8cf1-285a3caf2f99	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	e8343d02-08b6-46fa-a062-54660ae48dbd	9ebe2615-683b-43a9-b822-e8dd117f826e	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
552b8267-a1c1-4402-b9d5-5576ae0a72c2	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	9ebe2615-683b-43a9-b822-e8dd117f826e	9a3ba972-4d65-4243-a152-d7a8e0cb8e8a	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
fb848e8f-83fb-4b71-800a-6c851936acb7	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	9ebe2615-683b-43a9-b822-e8dd117f826e	7ff85ed0-6e83-4394-9cd2-af175d6edd3d	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
769ccd7c-4fe0-49cc-8bcc-47d8dbd33e42	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	a8a3df67-6136-4493-a734-5cde290ed59e	24df029c-3185-45a8-a00b-3987812318e2	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
bef90390-28bd-46ff-8df4-6dd36bb58ce1	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ebfa2b63-c80a-409a-b3ad-c637f3cfc0a6	a6f13fb9-823f-41dc-89a4-5ca89dd487ce	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
5afc5c6c-abdc-4ae6-bab3-d02e1eaba507	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	deaeea6d-df72-45de-8794-236a75c92d71	a6f13fb9-823f-41dc-89a4-5ca89dd487ce	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
6bcea5bc-ed7a-4e3f-9451-58dbc4f558c4	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	a6f13fb9-823f-41dc-89a4-5ca89dd487ce	359039a6-e9d2-440e-b3ac-cf0eb5d00db0	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
973802a6-327b-4eb0-ab3d-10d07496e6b4	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	66c53d31-fbbf-45a5-b9b6-032f18b186b8	9ff45d94-6863-4705-95aa-b610d1de2946	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
e4b8c419-aa68-4cf7-889c-e2894009a554	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	fc2784a3-8dab-4dba-b165-93e1445fc50c	756090be-37ea-41d7-861d-03923919ab9e	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
c9a8ab1c-d904-4dd3-83e1-07393ec7ce21	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	24df029c-3185-45a8-a00b-3987812318e2	32803220-2e1b-4bd4-a4b2-bbed02ea3679	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
d8c50e32-b45e-456e-ade9-253db808e62b	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	029cb737-f278-49bb-81db-e7c3f46cb0b7	ebfa2b63-c80a-409a-b3ad-c637f3cfc0a6	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
2d24b9af-f7e7-437d-985e-082c94042464	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	46a82caf-816e-4b2c-913f-721ea43f5979	b559a066-3d11-4761-a8f5-fd535f52ca6b	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
30e0f5bd-3a5c-43a1-bc48-2838f0385884	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	e470d9e6-5aa9-4453-a295-cefb642e17a4	ebfa2b63-c80a-409a-b3ad-c637f3cfc0a6	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
fd842760-20bc-4b2e-967a-aaf40863c59e	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ebfa2b63-c80a-409a-b3ad-c637f3cfc0a6	006689df-2206-4b06-ac81-689d533759c6	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
43e6cc0d-3a9b-425e-bdda-313a5daa08fe	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	9a3ba972-4d65-4243-a152-d7a8e0cb8e8a	24df029c-3185-45a8-a00b-3987812318e2	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
6e0d7de0-da7d-4803-b235-3d38f89b04e2	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	24df029c-3185-45a8-a00b-3987812318e2	9ff45d94-6863-4705-95aa-b610d1de2946	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
4ac84124-37d7-47c1-a27a-c31fa6a80267	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	86f200e4-3dba-4170-860e-bc5d3fc27080	c9750237-f839-46d0-a551-0ed54e053266	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
df3d1a7e-2a86-4a95-9fe7-0504bef59b29	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	25a8dafe-8785-42be-8d15-479e0595919a	c9750237-f839-46d0-a551-0ed54e053266	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
e0f44773-5744-460a-bbdf-4fe7278a3d03	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	c9750237-f839-46d0-a551-0ed54e053266	6ad3969f-7490-4d4c-bf94-96bbeb4fc0a4	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
3f7d3ca4-e6b6-47b6-ab2d-90dfb2a02649	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	c9750237-f839-46d0-a551-0ed54e053266	0ab4d7c5-1a9f-4e3b-9525-8a22650e249a	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
05069a5c-1384-4c25-994c-8077c8d97c98	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2e446bc8-4422-4c85-82db-61306109a4f5	e470d9e6-5aa9-4453-a295-cefb642e17a4	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
94fce718-b120-4b8b-8c24-42e04079c41c	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2e446bc8-4422-4c85-82db-61306109a4f5	ad2826c5-d984-4435-b87a-1109b49653b3	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
c5af031c-696d-4a40-a90a-5df76633ba86	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	b559a066-3d11-4761-a8f5-fd535f52ca6b	76fcf4b6-0d2d-486f-865e-670289b4dc10	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
094e0d97-29e7-48db-9d1d-d7d781182089	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	deaeea6d-df72-45de-8794-236a75c92d71	006689df-2206-4b06-ac81-689d533759c6	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
ced99462-9478-4b6a-97ea-ce6cff0b589a	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1a81a934-cfce-4c13-a76a-2ca35d557827	c38be8c6-6e85-4bde-b908-554299c6af9b	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
a6c9d973-5c1b-4a89-9796-5fe85d11fc5a	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	940d4f47-e9cb-4d9c-bd1e-c7e7740c7cf8	359039a6-e9d2-440e-b3ac-cf0eb5d00db0	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
049f22c2-899b-4dd1-9877-f2c974a89fc2	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	006689df-2206-4b06-ac81-689d533759c6	8e49d834-109a-4340-adfd-3f1bc7461f36	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
ffc1aea7-b8d6-4d2c-a244-047658f70143	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	15acbb68-aa44-40dd-afbd-304b15ac4d71	79524660-e0c7-4977-a9bf-611ec2895c2b	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
300b48a8-89c3-4a94-b56e-71e9fee52a38	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	359039a6-e9d2-440e-b3ac-cf0eb5d00db0	79524660-e0c7-4977-a9bf-611ec2895c2b	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
62472d6d-cb6c-4b37-8d46-b7536656bf9b	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	79524660-e0c7-4977-a9bf-611ec2895c2b	4320e38d-4c26-40d5-8f45-9e5956d384fc	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
94e63d35-b29d-461e-b868-af399c4e3ccb	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	79524660-e0c7-4977-a9bf-611ec2895c2b	8682c917-99ab-4414-93cf-383f4d3d39cd	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
afbbd19b-7988-462e-b56f-3173549223fd	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1a81a934-cfce-4c13-a76a-2ca35d557827	0136cd16-e2ef-4048-8999-4481ed38f4dc	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
7a91962c-7614-448e-8db0-0aef238a2912	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0136cd16-e2ef-4048-8999-4481ed38f4dc	b559a066-3d11-4761-a8f5-fd535f52ca6b	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
e31f71d0-a880-4810-a40a-232e9909923d	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	b559a066-3d11-4761-a8f5-fd535f52ca6b	eb5bb472-259d-4f38-90e7-e7da9accabf4	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
272cdf9d-4cdd-45af-8965-6f58672469bf	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	b7f8c6d5-1938-4614-8424-05471d5336f0	eb5bb472-259d-4f38-90e7-e7da9accabf4	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
c29cfcfd-e6c6-4609-a61f-61223399664f	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	5a9ff93d-23e8-4936-b553-8809db07b8ad	2ff0cdee-4493-4628-a750-207c169e4f42	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
a327f9d7-af0e-41d9-bf92-1470de04c453	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2174fa8c-6dff-4d64-9370-cdfdbc80c41f	86f200e4-3dba-4170-860e-bc5d3fc27080	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
0eb4434e-b513-4386-8318-5ca438c1434a	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2b4fd322-8781-4b49-8ca8-073fb1b654aa	6ad3969f-7490-4d4c-bf94-96bbeb4fc0a4	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
856ba5bc-f62e-42f6-885c-2ff6a3e2e24a	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2b4fd322-8781-4b49-8ca8-073fb1b654aa	0ab4d7c5-1a9f-4e3b-9525-8a22650e249a	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
0c4a3c4e-6865-4418-ac86-f8ede270e5f9	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	6ad3969f-7490-4d4c-bf94-96bbeb4fc0a4	cf3cd5f7-8323-4a02-b839-826d8d951302	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
f5e31f06-7310-4462-ae9d-3f91d2de30b6	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	6ad3969f-7490-4d4c-bf94-96bbeb4fc0a4	df19c5d1-23a2-4c8e-b5d6-5ae3b64f6bbc	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
94a6866e-c357-43c3-b38c-9ff65ac67b1d	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2ff0cdee-4493-4628-a750-207c169e4f42	86f200e4-3dba-4170-860e-bc5d3fc27080	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
db71ec22-9eec-4b44-9af1-a2df09f63517	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	eb5bb472-259d-4f38-90e7-e7da9accabf4	2ff0cdee-4493-4628-a750-207c169e4f42	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
3200daad-83e9-47af-8ea0-23920a2bc39f	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	eb5bb472-259d-4f38-90e7-e7da9accabf4	0b976f81-b585-4874-a777-83ded588e046	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
160828ef-9c64-49cb-8a05-35358a73c39f	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1a81a934-cfce-4c13-a76a-2ca35d557827	a977bba0-a9f4-4c04-bdad-2ed02d904372	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
bf23d302-60ca-45a3-9cc4-a60faae84add	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	006689df-2206-4b06-ac81-689d533759c6	f30897f3-4c51-43fc-ae3c-0504249786ef	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
35748295-6575-4923-8914-2ff14c939811	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	9ff45d94-6863-4705-95aa-b610d1de2946	e470d9e6-5aa9-4453-a295-cefb642e17a4	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
88605000-c38a-413f-8045-af03e3ba5aaa	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0ab4d7c5-1a9f-4e3b-9525-8a22650e249a	fd9a016c-f3f9-44f0-8c87-46415c3892a5	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
f5b622f7-580b-4a83-978f-1a72ccb24acf	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	cf44e6b1-09f0-499e-92b2-e962a1b470e4	4320e38d-4c26-40d5-8f45-9e5956d384fc	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
eb206c09-8c41-459e-a447-aed86e473516	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	4320e38d-4c26-40d5-8f45-9e5956d384fc	1a81a934-cfce-4c13-a76a-2ca35d557827	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
b50d0ee2-e653-4d61-a6d1-6e877cac9769	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	01980fb8-4518-4afd-b2a0-b36fb0d22daa	033605a1-6240-4c22-acfb-2fcb74c7f8a1	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
a4f51148-9fe6-48ef-8325-4392e4137252	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	e9028c87-a7d0-4229-9ac7-1ffabb816cde	52207f9a-e7b2-4903-ba95-d55c19590ef7	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
029f62ca-5b60-4801-997a-e558ba3db319	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	e9028c87-a7d0-4229-9ac7-1ffabb816cde	ecb82a20-fb86-4600-bfe5-20e5401e8cff	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
017f8978-8b9d-447d-899f-44523a03c805	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	033605a1-6240-4c22-acfb-2fcb74c7f8a1	52207f9a-e7b2-4903-ba95-d55c19590ef7	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
eef743a8-a1a9-4ac6-ae42-93eccc56c13d	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	52207f9a-e7b2-4903-ba95-d55c19590ef7	c71c93cc-6267-41b5-9e51-595f9cb87c44	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
e6acb085-c2ed-4fae-85b7-4943e20bbe70	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ae9a38cb-0684-4f53-9c2e-427c05274bb7	eae33757-f5ee-472c-be0d-59ea52a6f39c	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
da6bab3c-f1f6-4888-9631-bbd1166ea296	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	c84b3940-fbd0-44ed-9446-e1c9dd276784	7783cb28-a18f-48b3-9340-7e7e3c970929	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
2ac03e21-76c2-4300-9e9e-d74cdb0ab41e	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	53b57035-53e2-4686-9a28-f830d5336262	a7cbc3e3-48a1-4cc1-833a-31a3bfa4e655	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
09a024d4-ecd3-4cd0-a9f8-6ccd611f9fbe	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	53b57035-53e2-4686-9a28-f830d5336262	654c399d-27d9-4fdd-addc-a1b490e6cee1	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
f3824b44-542d-4c14-828e-d0035105dae6	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7d4d2d6c-710b-4a01-98b5-9fc013dfaa33	a7cbc3e3-48a1-4cc1-833a-31a3bfa4e655	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
68bdd937-140c-4878-9d48-e554e03352a8	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	a7cbc3e3-48a1-4cc1-833a-31a3bfa4e655	0984a719-0e41-4796-b569-bb91b0d0eb5b	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
18b19cc2-e1bd-4bce-81b8-aca7b1831817	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	6f8eec7b-3357-469e-bb5e-84df95f42fce	0984a719-0e41-4796-b569-bb91b0d0eb5b	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
ff92042d-5eb5-4db0-813c-31ab5544d37b	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7d4d2d6c-710b-4a01-98b5-9fc013dfaa33	654c399d-27d9-4fdd-addc-a1b490e6cee1	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
78182461-4891-40d7-a680-170644bedac5	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	654c399d-27d9-4fdd-addc-a1b490e6cee1	7fe4f848-8adc-427f-8fd0-8f6160faf609	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
a6c1fbb6-af9a-41ac-a312-cbc32c0044a1	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0984a719-0e41-4796-b569-bb91b0d0eb5b	862e8fc0-1bbf-45c5-9e12-7f3315cc4458	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
911df970-406e-4d58-ba7b-e653728107aa	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	371d218f-daa9-483e-bdd0-7cd3c10deef9	862e8fc0-1bbf-45c5-9e12-7f3315cc4458	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
f6a34efd-85ab-40fa-82d8-68cd5507ec61	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	fd444292-6ef1-496d-9f06-f401cc658bde	04960607-5632-4d1c-934d-15dac2eac3f9	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
267255f8-fb9a-4e4d-a787-7bf7c2686b9b	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	862e8fc0-1bbf-45c5-9e12-7f3315cc4458	04960607-5632-4d1c-934d-15dac2eac3f9	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
340a2d42-408f-4e69-bc71-b8be5983dac3	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	04960607-5632-4d1c-934d-15dac2eac3f9	e90cea06-a4f2-480a-9f39-6e79658fc395	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
8ab22cf3-f0ea-4777-a620-4bc3f5efb650	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	04960607-5632-4d1c-934d-15dac2eac3f9	c2aafd50-38ec-4641-a569-143b21d5a605	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
04ff200d-f101-492d-8841-049cf1146471	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	862e8fc0-1bbf-45c5-9e12-7f3315cc4458	7a4791d3-8fbc-4bad-816e-8a1f2025f323	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
9ec65586-407e-4d36-8fe2-6403ed29c899	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	862e8fc0-1bbf-45c5-9e12-7f3315cc4458	3526e662-1808-4805-8512-740aa7aba713	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
00e94ca2-5df5-4f07-a7b4-dc776b1701d1	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	92ca44f2-1b75-446c-89e0-fdf12121824e	e90cea06-a4f2-480a-9f39-6e79658fc395	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
f69f5fb3-dac5-4262-9cb0-29587cf73d18	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1a81a934-cfce-4c13-a76a-2ca35d557827	4edcaafe-cb97-4ec5-83ba-0acf15c1a9f8	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
036d7896-9b19-42bc-ae0c-3fa74fc5895a	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	eae33757-f5ee-472c-be0d-59ea52a6f39c	7783cb28-a18f-48b3-9340-7e7e3c970929	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
1b7b76be-095e-4e12-9876-281d3009ab05	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7783cb28-a18f-48b3-9340-7e7e3c970929	7d4d2d6c-710b-4a01-98b5-9fc013dfaa33	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
ad334e64-390f-4cff-aca2-3686e3507e7c	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7783cb28-a18f-48b3-9340-7e7e3c970929	8ca2c3e0-3dac-48c5-a3c3-140078541f7c	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
9ed2d445-9e70-419d-9876-f729b849bb2e	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	033605a1-6240-4c22-acfb-2fcb74c7f8a1	ecb82a20-fb86-4600-bfe5-20e5401e8cff	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
a0582186-6197-4bbc-8bc2-a3ea078cffca	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ecb82a20-fb86-4600-bfe5-20e5401e8cff	832463f3-1e14-44ad-8a6a-28ef165d7041	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
581adff9-49c5-4b00-b678-fbf42bd6490d	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ecb82a20-fb86-4600-bfe5-20e5401e8cff	42386017-1f2f-4910-a70d-7926ba0edea1	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
1c2009f7-309e-4935-bccf-b31d08bf7b51	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ecb82a20-fb86-4600-bfe5-20e5401e8cff	cf091493-585a-4992-a55a-f1c28262e989	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
7cb3f5fc-c3c3-41db-8000-62d241d1b212	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ecb82a20-fb86-4600-bfe5-20e5401e8cff	cee1530a-c13a-4ac9-a336-afb5eb12ffec	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
4d82c2a2-25d3-4473-9f66-5d7166c37893	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ecb82a20-fb86-4600-bfe5-20e5401e8cff	7b9bb329-ab0b-4b82-91b8-b6e6dc093ad8	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
b73a3670-d3ba-43d5-8c44-93f491870c70	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ecb82a20-fb86-4600-bfe5-20e5401e8cff	3933b53b-30ec-4f17-867f-99cb50c91648	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
68952099-75b0-4d65-9a5c-e954ff13f842	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f69074e8-934e-45cf-94a5-d324cca7f2fc	7d4d2d6c-710b-4a01-98b5-9fc013dfaa33	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
28a98dff-9e76-4608-b024-467205af8cce	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0b8e4a10-ac6f-414f-86d9-4073c92c5eb1	033605a1-6240-4c22-acfb-2fcb74c7f8a1	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
a13d72db-9400-4bfe-94d7-9921b669e6d6	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	033605a1-6240-4c22-acfb-2fcb74c7f8a1	1d9168fb-1275-4874-8c44-fc743c689a6d	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
80f93f4d-f229-4b2d-8a77-71806e0ff178	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	e90cea06-a4f2-480a-9f39-6e79658fc395	7ab7057b-42b4-4bdf-9740-03c9a44e7a64	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
4d930f23-39e2-421d-94ac-6dcb7b48973e	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	cf3cd5f7-8323-4a02-b839-826d8d951302	0b8e4a10-ac6f-414f-86d9-4073c92c5eb1	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
1484bd51-e1b4-481d-b453-0eff12d1184e	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	cf3cd5f7-8323-4a02-b839-826d8d951302	d51cbfba-b69a-4bae-86f3-614fb32d92e2	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
75a93c9f-d837-4694-b7b8-62f8a8828130	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	a89678b8-2057-4f7b-b775-d508cd05fbe0	bb715c2b-b4af-449f-a8df-d5c6f2a67f5a	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
72896d3e-b640-4e34-9d90-fb70de174fb6	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	abcee563-1562-4070-93b7-6fca396eef8d	580a9edd-1cf8-4b81-a6bf-9d9e97fe068d	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
71342269-796b-4078-90a5-2346f95f2611	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	abcee563-1562-4070-93b7-6fca396eef8d	7a98732b-2937-4f60-b31c-5110ca4dbdcc	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
b3f9f5a9-c0ee-4a9f-a6ab-0b8568788df0	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	e90cea06-a4f2-480a-9f39-6e79658fc395	66da6a6c-024b-411f-8cf5-70b0ca3843f7	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
c34f1149-2300-4656-88e1-149a57f1b551	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	bb715c2b-b4af-449f-a8df-d5c6f2a67f5a	580a9edd-1cf8-4b81-a6bf-9d9e97fe068d	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
5548fe5e-2ee5-4059-b39d-c913123db25d	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	580a9edd-1cf8-4b81-a6bf-9d9e97fe068d	044ef346-ae7f-402c-9d3c-2e853ec45909	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
974e8bd3-2d7b-4457-9278-9b0af74f1f4e	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	580a9edd-1cf8-4b81-a6bf-9d9e97fe068d	29e61c9f-efeb-4664-8fa6-cbf5d30bdad5	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
9e7f8d79-d47b-45e5-9b66-a2fff3543607	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	df19c5d1-23a2-4c8e-b5d6-5ae3b64f6bbc	bb715c2b-b4af-449f-a8df-d5c6f2a67f5a	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
8efd32d9-9f08-4d1a-9aa6-e43a7b1a8f99	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	bb715c2b-b4af-449f-a8df-d5c6f2a67f5a	7a98732b-2937-4f60-b31c-5110ca4dbdcc	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
4786a911-4c55-4f45-99f6-6b42c1613316	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	bb715c2b-b4af-449f-a8df-d5c6f2a67f5a	7668dea5-eaeb-45ef-aeb0-dfcdf91b3e2d	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
18e90d61-41f7-4d82-b9a6-3957bd1dc9d7	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1d9168fb-1275-4874-8c44-fc743c689a6d	eae33757-f5ee-472c-be0d-59ea52a6f39c	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
dac9450b-4eb1-4a52-b1dd-f84ccf675204	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	eae33757-f5ee-472c-be0d-59ea52a6f39c	0d3f5eb0-6051-4b27-b033-f098891c614c	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
3565c904-c591-420b-b8ea-0c60a0bf2ae1	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a98732b-2937-4f60-b31c-5110ca4dbdcc	49bd8cc3-ef09-4c9e-bb3a-5a6375eb8e4a	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
998c5631-9361-40d4-80fb-7558b65c0613	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	a8ba19da-2d79-4ab5-b92e-80276db5dd1c	49bd8cc3-ef09-4c9e-bb3a-5a6375eb8e4a	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
5fbf7547-8708-4557-8bb2-6ab36bffac8e	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7f5fac11-8e92-40d4-9e81-8c24d49e15e7	c71c93cc-6267-41b5-9e51-595f9cb87c44	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
98aae6bd-e103-4650-80e7-ef9e3af38163	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	fd9a016c-f3f9-44f0-8c87-46415c3892a5	df42fe7a-fb1e-4b70-8514-4d65f4b9a6e6	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
5a6d42f5-7bf8-4bbe-93ab-1f915e5669b3	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	fd9a016c-f3f9-44f0-8c87-46415c3892a5	1c7e75a4-21d0-40a8-bc74-d1a4ab2fe83d	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
ff0f7444-ebaa-4c64-921e-752291beb86e	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	757febff-a930-434d-814b-42bbc25e97ea	3933b53b-30ec-4f17-867f-99cb50c91648	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
76072662-d3b1-401e-8574-32825a00f713	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	069b2c8f-447b-4223-b409-7625f83b1832	29e61c9f-efeb-4664-8fa6-cbf5d30bdad5	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
f790c0f9-e0a3-4ecc-a22a-4859ec8074f5	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	7a98732b-2937-4f60-b31c-5110ca4dbdcc	585f6177-2bea-459c-b006-24cf04830134	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
83c58e74-b465-437f-b901-57e9e435c7b7	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	a8ba19da-2d79-4ab5-b92e-80276db5dd1c	585f6177-2bea-459c-b006-24cf04830134	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
7393d20c-5565-4418-9baf-97de8dba420d	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	757febff-a930-434d-814b-42bbc25e97ea	42386017-1f2f-4910-a70d-7926ba0edea1	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
d0af0de0-2afc-4624-81da-899ef4df87e4	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	90136c60-83c6-4128-ad22-e01c609969f2	df42fe7a-fb1e-4b70-8514-4d65f4b9a6e6	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
c4eaf5b7-e94e-4ea7-8cef-1b7d3ba5e0f5	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	757febff-a930-434d-814b-42bbc25e97ea	cf091493-585a-4992-a55a-f1c28262e989	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
9d5e4c9a-f00a-4b88-b76f-5a47edbbb5d1	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	069b2c8f-447b-4223-b409-7625f83b1832	044ef346-ae7f-402c-9d3c-2e853ec45909	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
ed3ee0e3-6306-462d-b46f-1b611da46aa0	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	757febff-a930-434d-814b-42bbc25e97ea	cee1530a-c13a-4ac9-a336-afb5eb12ffec	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
cd502867-d71f-4e93-8e74-88375094911d	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	757febff-a930-434d-814b-42bbc25e97ea	832463f3-1e14-44ad-8a6a-28ef165d7041	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
c05da3bb-4e37-484b-b061-d4c856ba00ed	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	90136c60-83c6-4128-ad22-e01c609969f2	1c7e75a4-21d0-40a8-bc74-d1a4ab2fe83d	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
094b77d2-7477-4d5a-94d8-71ea33980c11	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	757febff-a930-434d-814b-42bbc25e97ea	7b9bb329-ab0b-4b82-91b8-b6e6dc093ad8	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
02292696-47a0-4ebc-94c1-024605071a9e	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	fc2784a3-8dab-4dba-b165-93e1445fc50c	8160db1c-b309-4ed7-bdb1-b1c934e12533	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
a6d79174-095f-439f-952f-2856a58c5dd5	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	fd675a68-d77a-452a-bb9d-dd14e1b49d19	8ef06fc4-6455-4392-983e-58a7c6e836e9	2e24bb7b-2121-458b-9058-3173dec8b408
e0b0b455-d0b2-4d29-ac2b-7194887b57d6	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	640a02fb-b40f-4dc7-9069-c276e15648b1	8ef06fc4-6455-4392-983e-58a7c6e836e9	2e24bb7b-2121-458b-9058-3173dec8b408
8251e168-3ac0-46e0-a054-fc119cf6f7c4	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	fd675a68-d77a-452a-bb9d-dd14e1b49d19	f5d0f41a-9405-4cfb-bc4a-243f2956791b	2e24bb7b-2121-458b-9058-3173dec8b408
d8191373-cd7b-4c93-a70c-1ffe6ee9e130	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	640a02fb-b40f-4dc7-9069-c276e15648b1	f5d0f41a-9405-4cfb-bc4a-243f2956791b	2e24bb7b-2121-458b-9058-3173dec8b408
e9639f87-adf2-4bbd-839f-c8377d68b8d5	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	fd675a68-d77a-452a-bb9d-dd14e1b49d19	5bbf5234-c705-4efa-b460-f047ad42e2de	2e24bb7b-2121-458b-9058-3173dec8b408
03c1fdd0-fbee-4fe2-a052-de21ad38dd26	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	640a02fb-b40f-4dc7-9069-c276e15648b1	5bbf5234-c705-4efa-b460-f047ad42e2de	2e24bb7b-2121-458b-9058-3173dec8b408
e80f52d8-49d0-4d0e-bfe7-a344f70eb46e	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	06fd0180-796d-4a6f-94ce-a4417fd9ba36	fd675a68-d77a-452a-bb9d-dd14e1b49d19	2e24bb7b-2121-458b-9058-3173dec8b408
43e7747d-1839-431c-9ceb-d3c9f2b80981	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	fd675a68-d77a-452a-bb9d-dd14e1b49d19	cf7a97af-9a9f-4387-a5ee-62e1330e1cf8	2e24bb7b-2121-458b-9058-3173dec8b408
b6696121-770b-404c-9369-c6c9158e84d5	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	fd675a68-d77a-452a-bb9d-dd14e1b49d19	57950476-e96f-48e5-96c8-cd2fc4fbd8eb	2e24bb7b-2121-458b-9058-3173dec8b408
31e2ebf2-f87d-4dec-9d2b-4b6a23c58a18	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	06fd0180-796d-4a6f-94ce-a4417fd9ba36	d8041238-70d5-4650-abc4-bfc86ce9e872	2e24bb7b-2121-458b-9058-3173dec8b408
8f3cad1c-c15c-459c-96c1-e5ca024c22fd	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	06fd0180-796d-4a6f-94ce-a4417fd9ba36	9cf82e6d-72d3-476d-a537-92eb2fafc0a0	2e24bb7b-2121-458b-9058-3173dec8b408
8e60df30-4a67-4c4a-81e1-e7a5393fa7a1	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	640a02fb-b40f-4dc7-9069-c276e15648b1	57950476-e96f-48e5-96c8-cd2fc4fbd8eb	2e24bb7b-2121-458b-9058-3173dec8b408
3dd13eb6-0158-4ca0-8c92-1373bc7d46c9	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	640a02fb-b40f-4dc7-9069-c276e15648b1	cf7a97af-9a9f-4387-a5ee-62e1330e1cf8	2e24bb7b-2121-458b-9058-3173dec8b408
c605f7c6-ca51-47d8-82b5-e67b7806a62f	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	9e2a16e8-1ab2-4a67-9ff3-b0fb5d9465ae	33cf6d06-bc6c-4c3b-8510-4adbb721ff2c	37362901-1a7a-45e9-ae15-dbe95cf50535
ce0024fa-836d-4459-b9fe-8a7f42172172	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	9e2a16e8-1ab2-4a67-9ff3-b0fb5d9465ae	79719154-4325-4d1d-b76d-b712f9383ef4	37362901-1a7a-45e9-ae15-dbe95cf50535
2283a40a-4177-44ae-9761-412c9166d619	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	9e2a16e8-1ab2-4a67-9ff3-b0fb5d9465ae	fef23410-b70b-4839-9287-85a726153050	37362901-1a7a-45e9-ae15-dbe95cf50535
2175a094-7f6b-4123-9994-1a0c4bda9e6b	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	01185907-4aa6-42d6-aa64-e9f6d104f947	cd88656a-d5b9-43d7-b1b1-fba7c44918a6	c4e76e21-d296-4552-a654-0cd7735a82ed
3804da48-a9e1-456b-956f-42e2e6d788f1	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	97557dac-bd49-4e25-904c-9d2f351c7320	cd88656a-d5b9-43d7-b1b1-fba7c44918a6	c4e76e21-d296-4552-a654-0cd7735a82ed
eb19c6e2-dab8-421e-8e7f-7bbcd901bbe3	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	97557dac-bd49-4e25-904c-9d2f351c7320	2d0cb16e-8093-4867-a5de-122a86c382a3	c4e76e21-d296-4552-a654-0cd7735a82ed
4dc134ce-7ae7-4f1c-ae45-2071f6c18639	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	97557dac-bd49-4e25-904c-9d2f351c7320	76099c15-01ac-42e5-809e-04af29c6ae71	c4e76e21-d296-4552-a654-0cd7735a82ed
52b01dc1-a527-45e9-9752-d58327ffc5ff	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	01185907-4aa6-42d6-aa64-e9f6d104f947	2d0cb16e-8093-4867-a5de-122a86c382a3	c4e76e21-d296-4552-a654-0cd7735a82ed
31e7118f-4f6e-4323-ad87-2671a060ae21	\N	taxi	\N	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	01185907-4aa6-42d6-aa64-e9f6d104f947	76099c15-01ac-42e5-809e-04af29c6ae71	c4e76e21-d296-4552-a654-0cd7735a82ed
3e885fce-0a2d-41f0-b158-3e6d20ac9a2d	\N	taxi	\N	#595959	\N	\N	\N	\N	\N	downward	\N	\N	\N	\N	#595959	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	91961a17-8461-46da-9629-c38db6e108fd	231103c6-f46f-4767-ae5e-d403400e7e4f	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7
44e8db47-bf9d-44a1-8220-89500246f47b	\N	taxi	\N	#595959	\N	\N	\N	\N	\N	downward	\N	\N	\N	\N	#595959	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	91961a17-8461-46da-9629-c38db6e108fd	3a882cce-2a6c-46ac-bd1a-aa7182fe33c3	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7
facab12f-04ad-42e5-a088-ec0e15d55d73	\N	taxi	\N	#595959	\N	\N	\N	\N	\N	downward	\N	\N	\N	\N	#595959	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	91961a17-8461-46da-9629-c38db6e108fd	611c4d66-1bd4-44e0-8cc8-10493bb6ad4d	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7
860e24d5-7933-4d9a-8a78-3e5e87876853	\N	taxi	\N	#595959	\N	\N	\N	\N	\N	downward	\N	\N	\N	\N	#595959	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	91961a17-8461-46da-9629-c38db6e108fd	e9c97ed1-3d9a-4323-8691-fb586b3f2744	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7
384279fc-51bf-4cb0-9cc7-b6eb735e1cf2	\N	taxi	\N	#595959	\N	\N	\N	\N	\N	downward	\N	\N	\N	\N	#595959	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	91961a17-8461-46da-9629-c38db6e108fd	dcda9fb2-4a99-46a5-b22d-e10c126f77c9	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7
143f2352-9b58-4eaa-9cb7-91a88dc5eb4d	\N	taxi	\N	#595959	\N	\N	\N	\N	\N	downward	\N	\N	\N	\N	#595959	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	91961a17-8461-46da-9629-c38db6e108fd	9916704a-0643-4570-a43b-5f5f592170dd	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7
619ccac8-d4ed-4afc-9180-6db8699efe0b	\N	taxi	\N	#595959	\N	\N	\N	\N	\N	downward	\N	\N	\N	\N	#595959	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	91961a17-8461-46da-9629-c38db6e108fd	11788484-c3d7-4955-af56-3f210d49719c	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7
0bcba7b1-e22c-49bd-87ad-5da68dc63674	\N	taxi	\N	#595959	\N	\N	\N	\N	\N	upward	\N	\N	\N	\N	#595959	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	d7563518-25d8-4551-a4d8-36c8e03db83e	9e161f26-5abb-4d02-92fe-4698bb0b9fc3	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7
31247fc4-c114-4426-9408-9d05c77e5c88	\N	taxi	\N	#595959	\N	\N	\N	\N	\N	upward	\N	\N	\N	\N	#595959	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	d7563518-25d8-4551-a4d8-36c8e03db83e	2462c18f-3e19-4ddf-a405-f829fe591ae2	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7
f7d908ac-dba2-44c4-95b6-c93e0d7b354e	\N	taxi	\N	#595959	\N	\N	\N	\N	\N	upward	\N	\N	\N	\N	#595959	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	d7563518-25d8-4551-a4d8-36c8e03db83e	8f7495aa-c434-44db-aa83-9196cceb8cb1	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7
f7877d85-9006-44d6-811f-dbdf26ea8fd1	\N	taxi	\N	#595959	\N	\N	\N	\N	\N	upward	\N	\N	\N	\N	#595959	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	d7563518-25d8-4551-a4d8-36c8e03db83e	6b1eda94-7f01-4533-8169-a449e5fa2f16	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7
4a9e3a07-4f8c-44c6-aa9c-4117ee1f38c1	\N	taxi	\N	#595959	\N	\N	\N	\N	\N	upward	\N	\N	\N	\N	#595959	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	d7563518-25d8-4551-a4d8-36c8e03db83e	6787dede-e88c-4cc1-ba18-8296d6e90a40	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7
cec0d0f5-1d65-418b-930f-15b916a5501d	\N	taxi	\N	#595959	\N	\N	\N	\N	\N	upward	\N	\N	\N	\N	#595959	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	d7563518-25d8-4551-a4d8-36c8e03db83e	a312eaeb-24cb-4b59-80d1-61c5e45c0999	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7
89cf1cca-6c29-4269-9470-1d1b0c5d67a5	\N	taxi	\N	#595959	\N	\N	\N	\N	\N	upward	\N	\N	\N	\N	#595959	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	d7563518-25d8-4551-a4d8-36c8e03db83e	7c94c396-d04a-48b7-ab25-36bf0be35bc4	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7
61f21421-7833-4996-aa98-149888d464cf	\N	taxi	\N	#595959	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	#595959	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	8f7495aa-c434-44db-aa83-9196cceb8cb1	46803a5f-42f3-4aae-8c39-ed7292824d6c	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7
8f238630-bd22-4603-b6fd-0dda1993dbfb	Deathwalker	taxi	dashed	#595959	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	#595959	\N	\N	\N	\N	\N	\N	\N	\N	\N	10	\N	\N	\N	6b1eda94-7f01-4533-8169-a449e5fa2f16	652014d0-1a16-49c8-bc00-8fcaeed544b7	81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7
e3735f00-aafe-43a4-baf5-d002a28349f9	\N	taxi	solid	\N	\N	\N	\N	\N	\N	vertical	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	10540af3-ed32-493b-ab4b-2a79a9b12d59	a7830d4e-6dee-42f3-b9fc-f6c43584c5cc	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1
\.


--
-- Data for Name: _edgesTotags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_edgesTotags" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _eventsTotags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_eventsTotags" ("A", "B") FROM stdin;
88b15ef0-bc44-4d88-adde-b352fd70c02a	2293781d-595a-4a2f-871e-aedc5f4b3282
88b15ef0-bc44-4d88-adde-b352fd70c02a	b162a18c-5c17-485b-bf84-c923a5ae194d
\.


--
-- Data for Name: _graphsTotags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_graphsTotags" ("A", "B") FROM stdin;
81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7	421445db-6adf-4006-9aaf-85629fc73871
81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7	8dda18a7-1b4e-4176-90bf-c0bf0651e0d7
81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7	931d31b0-2a85-40df-86ba-d06bb031504e
81da5ca2-ecb4-4d31-8c98-2c0cca5c90a7	e655f329-0eb9-477e-aaee-cceb827895eb
7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	b63bce1f-f252-41cb-a8da-dce373223800
\.


--
-- Data for Name: _map_pinsTotags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_map_pinsTotags" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _mapsTotags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_mapsTotags" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _nodesTotags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_nodesTotags" ("A", "B") FROM stdin;
6f8eed19-0bb2-4163-a0ee-1ee20270ab9d	bfae5171-e779-42c5-8eb2-6a857ea99642
3d3ea5c8-68a4-4f90-a2a6-f024fd9877c7	69a1554c-e5db-459f-bd4d-a87526063b9a
\.


--
-- Data for Name: _project_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._project_members ("A", "B") FROM stdin;
\.


--
-- Data for Name: alter_names; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alter_names (id, title, project_id, parent_id) FROM stdin;
57ad54b9-efdb-4034-a286-e43b87c1ba79	Ned	77cb0278-b9c7-43b5-bd30-e72022eacf11	c3511f25-4abd-4a3b-8381-75591a83c9bd
2122c5a7-75b3-4eb5-96c4-48eaa658a2bd	Warden of the North	77cb0278-b9c7-43b5-bd30-e72022eacf11	c3511f25-4abd-4a3b-8381-75591a83c9bd
\.


--
-- Data for Name: random_tables; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.random_tables (id, created_at, updated_at, title, description, project_id, parent_id, icon, is_folder, is_public, owner_id, deleted_at) FROM stdin;
156a9986-2502-4de9-8adc-489cfb4d80c0	2024-03-28 09:46:59.467	2024-03-31 10:15:03.02	Blessings	\N	eb68433a-64b2-4bf9-92a8-5625f46ad59f	\N	\N	\N	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207	\N
\.


--
-- Data for Name: blueprint_fields; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blueprint_fields (id, title, sort, options, formula, parent_id, field_type, random_table_id, calendar_id, blueprint_id) FROM stdin;
b79c0077-aafb-4173-8ed2-8658442978cd	Owner	1	[]	\N	d3579cde-a472-4869-acaa-77949885744b	characters_single	\N	\N	\N
a07d586b-33e4-4ddb-a472-e9b0559ea142	Image	2	[]	\N	d3579cde-a472-4869-acaa-77949885744b	images_single	\N	\N	\N
ef6e9b03-adaa-4ac3-9f2f-11198b66eb23	Country	0	[]	\N	44598285-2999-4846-a6e3-1c746ed886ab	blueprints_single	\N	\N	\N
bf4b9e96-a89a-42d3-b8d8-9c92f3ae6809	Leader(s)	1	[]	\N	618ab39e-1dc9-4612-a4ba-7679064018bc	characters_multiple	\N	\N	\N
f4c5a3c9-a833-4b70-b0eb-60d05d005028	Flag	0	[]	\N	618ab39e-1dc9-4612-a4ba-7679064018bc	images_single	\N	\N	\N
a25879e9-974b-4039-8ad8-733d65f444cf	Type	0	[{"id": "b5e3e5b2-93c9-40dd-89c3-76eb7cb904d6", "value": "Shortsword"}, {"id": "d9cfb645-1b5a-452f-bf35-65db3027450b", "value": "Longsword"}, {"id": "f0396ab9-2156-4815-8061-88d6ad71189c", "value": "Longbow"}, {"id": "ce1659af-f538-43e3-8961-b86dff98ee9d", "value": "Shortbow"}]	\N	0f1930b1-44c5-4a76-8125-beb31612bb12	select	\N	\N	\N
8940f7e6-1763-4325-8628-f6f47d012eb9	Cost	1	[]	\N	0f1930b1-44c5-4a76-8125-beb31612bb12	number	\N	\N	\N
0481c386-a0b6-444a-88dd-71b3a28a0dab	Rarity	2	[{"id": "1e608e0d-250e-4273-94ab-2de0e5b222bd", "value": "Common"}, {"id": "76401f23-1a46-42c1-98fa-8045e16bb1d1", "value": "Uncommon"}, {"id": "ce3198ea-d6ec-4d0d-8931-05c0906327a6", "value": "Rare"}]	\N	0f1930b1-44c5-4a76-8125-beb31612bb12	select	\N	\N	\N
4bcdc2ce-3737-4b6f-af14-70e67de51b91	Number of members	4	[]	\N	07490b86-d82d-449f-bfc2-8154bcf3c560	number	\N	\N	\N
acd724da-d44b-4166-b72e-45beb923f6f1	Leader	0	[]	\N	07490b86-d82d-449f-bfc2-8154bcf3c560	characters_single	\N	\N	\N
3eb421b9-760b-4d32-b5c5-e955e4f8f751	Manifest	1	[]	\N	07490b86-d82d-449f-bfc2-8154bcf3c560	textarea	\N	\N	\N
24159781-58e4-4445-aff9-aceaffe69938	Members	2	[]	\N	07490b86-d82d-449f-bfc2-8154bcf3c560	characters_multiple	\N	\N	\N
4a783da4-c275-4d69-9c29-1b3befb29a96	Headquarters	3	[]	\N	07490b86-d82d-449f-bfc2-8154bcf3c560	locations_single	\N	\N	\N
1cb962d8-d1b2-4fa7-a81d-59ada584e038	Shops	1	[]	\N	95f8881b-9517-419e-9cc3-c9d6092ef0a2	blueprints_multiple	\N	\N	0e424e1c-896c-4831-b50e-2f6671c382ae
c3bdc1bf-f4c4-41fa-97ab-9567eb2cb9aa	Important NPCs	0	[]	\N	95f8881b-9517-419e-9cc3-c9d6092ef0a2	characters_multiple	\N	\N	\N
f79bdb5d-7a99-4d38-ae28-835da8369349	Description	0	[]	\N	b4405bec-f165-461b-9ba1-0ebfd9121b13	textarea	\N	\N	\N
db1410e6-3d55-41db-a8fc-a252743c3970	Cost	1	[]	\N	b4405bec-f165-461b-9ba1-0ebfd9121b13	number	\N	\N	\N
234bdebe-c8a0-4cb5-9975-05531acbc532	Images	0	[]	\N	452867c0-ba7e-42ce-a8c7-0a01103e819e	images_multiple	\N	\N	\N
bcb2bf57-4b15-4dcd-b378-dbc1acad25ce	Description	1	[]	\N	452867c0-ba7e-42ce-a8c7-0a01103e819e	documents_single	\N	\N	\N
600190bc-3957-4285-a321-98ed37aff3dd	Motto	2	[]	\N	30091ef1-6bf6-4215-b256-57622fe7c645	text	\N	\N	\N
655c2ff8-022e-47af-b6a3-a6ed14959053	Members	0	[]	\N	30091ef1-6bf6-4215-b256-57622fe7c645	characters_multiple	\N	\N	\N
bceb552b-78a0-41d0-ab04-da691868695f	Banner	1	[]	\N	30091ef1-6bf6-4215-b256-57622fe7c645	images_single	\N	\N	\N
8853d265-ef31-408d-b587-824036aa889c	Rarity	2	[{"id": "afc6a239-b51b-4c15-b4cb-7869bde6c13d", "value": "Common"}, {"id": "193d2ee9-f89e-44d1-b0ff-9c6b71d71c16", "value": "Uncommon"}, {"id": "df99964b-d036-4ece-9e37-8f4803bc4c4d", "value": "Rare"}]	\N	b4405bec-f165-461b-9ba1-0ebfd9121b13	select	\N	\N	\N
aaf9db65-5497-4fa6-a75c-745c5ba981b7	Members	0	[]	\N	0e7b37e1-97d9-497f-b4e5-8b0aed78c6ce	characters_multiple	\N	\N	\N
e40fc00f-af14-4407-82f6-3733d87c70d3	Languages	0	[]	\N	cc93b9b9-56f6-4cc9-b8f0-9e6df8604afc	blueprints_multiple	\N	\N	b4a5a3ac-ccca-4522-8f9e-27fa1faeb37f
ff15fcb1-3e7c-4170-abad-7ea5d3a1d4eb	Creator	3	[]	\N	d3579cde-a472-4869-acaa-77949885744b	characters_single	\N	\N	\N
31cd49ee-f19d-40a3-a0cd-d70e6a40fd7a	Type	0	[{"id": "bc1d38ce-d6bd-4f25-a21f-b8f4ea09e023", "value": "Shortsword"}, {"id": "2db469ae-34d8-4e7a-9ced-e0d59dcfd237", "value": "Longsword"}, {"id": "fdcc5e04-5108-45a1-8f84-d5234fae22b4", "value": "Greataxe"}, {"id": "4a510bbd-1ae9-493c-8352-770a40facc5c", "value": "Polearm"}, {"id": "24e1305a-5d63-455d-97e0-276f95354593", "value": "Halberd"}, {"id": "a873726a-8fdf-496c-bb60-bbad38066e80", "value": "Rapier"}, {"id": "32d8dd82-dd3e-464b-b440-aa29244ef149", "value": "Shortbow"}, {"id": "e99b1e28-229d-4562-af55-141ca7bedbee", "value": "Longbow"}, {"id": "5b3bc5bf-3067-4084-9532-0d4713daed25", "value": "Crossbow"}]	\N	d3579cde-a472-4869-acaa-77949885744b	select	\N	\N	\N
49943253-dfd6-40af-9347-530942a8eb7c	Owner	0	[]	\N	0e424e1c-896c-4831-b50e-2f6671c382ae	characters_single	\N	\N	\N
39417b93-542a-4762-b1a7-402893a6997c	Alchemy ingredients	1	[]	\N	0e424e1c-896c-4831-b50e-2f6671c382ae	blueprints_multiple	\N	\N	b4405bec-f165-461b-9ba1-0ebfd9121b13
\.


--
-- Data for Name: blueprint_instance_field_values; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blueprint_instance_field_values (id, blueprint_instance_id, blueprint_field_id, related_id, end_month_id, start_month_id, end_day, end_year, start_day, start_year, option_id, suboption_id, value, type) FROM stdin;
3f243fb1-567b-45b7-a589-411d53d0385b	c2a73823-6116-4d67-9ec2-3c4b2102d22c	bcb2bf57-4b15-4dcd-b378-dbc1acad25ce	e0638435-8f3f-46f1-92ad-408a3c959c02	\N	\N	\N	\N	\N	\N	\N	\N	\N	documents
0c510e25-1133-44d2-b6bc-c78d476c0bd8	3d4b00e9-c35d-416d-98b1-78a79ef21e40	acd724da-d44b-4166-b72e-45beb923f6f1	53a9de7f-3379-4522-a70a-af2041a6d8e7	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
dd06147b-a197-4f7d-8eff-ae80b7bba646	3d4b00e9-c35d-416d-98b1-78a79ef21e40	24159781-58e4-4445-aff9-aceaffe69938	565e7175-64d0-4cab-85b2-c88d7adc966f	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
21e9fac7-7e6e-40e3-88c6-cfec3ee960e9	3d4b00e9-c35d-416d-98b1-78a79ef21e40	24159781-58e4-4445-aff9-aceaffe69938	8c79d399-96f6-469e-9948-ad3baa8ce483	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
3ef6b56e-5d38-4b5a-8396-395199ff6fa0	3d4b00e9-c35d-416d-98b1-78a79ef21e40	24159781-58e4-4445-aff9-aceaffe69938	9d10a90f-76bc-41b3-ad15-48e943af147b	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
318f043c-bbb3-43db-a08f-c8b5b2dc3cf9	3d4b00e9-c35d-416d-98b1-78a79ef21e40	24159781-58e4-4445-aff9-aceaffe69938	a40c1aaa-a3b3-40a8-94d2-0826a52b5281	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
bfbd9620-4279-4a62-ad48-a83888d7425c	3d4b00e9-c35d-416d-98b1-78a79ef21e40	24159781-58e4-4445-aff9-aceaffe69938	b8569e15-dae4-484f-8ce5-d76ecebff7bd	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
436d6bbe-df9e-4861-91d8-cc3446179c34	3d4b00e9-c35d-416d-98b1-78a79ef21e40	24159781-58e4-4445-aff9-aceaffe69938	e1943b46-b616-4649-a01e-e8dcdf0d6b2b	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
1ddff7ab-65e8-47a2-967a-52734665946c	3d4b00e9-c35d-416d-98b1-78a79ef21e40	24159781-58e4-4445-aff9-aceaffe69938	eae334ab-dbf6-47b2-916a-95c77902723b	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
3b44b766-0d78-4b7e-8477-12a2b9cdc7e3	3d4b00e9-c35d-416d-98b1-78a79ef21e40	24159781-58e4-4445-aff9-aceaffe69938	20157e84-ee22-4bc3-aa22-fa4261b9dc42	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
7cb8e408-24bc-4a9d-99ff-b4a564f4d1fd	78e4174a-d8e7-4d2d-baa6-03115d8f8d91	24159781-58e4-4445-aff9-aceaffe69938	b0b33ba5-6367-4f7f-9f5e-44cad8b94973	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
8d4b5f96-9703-48d8-bed1-55032f706726	36bae4e6-7aa3-4375-b1fe-637e2bb83cb2	655c2ff8-022e-47af-b6a3-a6ed14959053	3c9ef747-bf4c-44ff-8a71-6648fc1c8642	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
016dbaa9-9bec-40b1-81e9-27e9c32caf0f	36bae4e6-7aa3-4375-b1fe-637e2bb83cb2	655c2ff8-022e-47af-b6a3-a6ed14959053	7296e38f-f51b-4357-bfb0-f82a737b662a	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
39ed53d3-4912-4ee7-96a7-9f6a6ca83a9f	36bae4e6-7aa3-4375-b1fe-637e2bb83cb2	655c2ff8-022e-47af-b6a3-a6ed14959053	3dc7880d-a137-4e9a-9f3f-a55023b63f9c	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
e6de4611-539d-47de-9f5d-da67ea3a5f00	36bae4e6-7aa3-4375-b1fe-637e2bb83cb2	655c2ff8-022e-47af-b6a3-a6ed14959053	9a68e881-000e-4de6-9408-7b3ff632f9ad	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
a89acf74-de7b-43e4-912f-e18d2484278e	36bae4e6-7aa3-4375-b1fe-637e2bb83cb2	655c2ff8-022e-47af-b6a3-a6ed14959053	64aaa1af-aae7-40b4-95fd-316cbd2c349b	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
830882ba-d741-42b0-bccf-6989edd8bea2	36bae4e6-7aa3-4375-b1fe-637e2bb83cb2	655c2ff8-022e-47af-b6a3-a6ed14959053	a50a4981-40e4-44ae-82ff-27b6c4077ac2	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
28e3a861-57aa-4a27-bafb-ba8e4c49f56e	36bae4e6-7aa3-4375-b1fe-637e2bb83cb2	655c2ff8-022e-47af-b6a3-a6ed14959053	5bc05aaa-cae5-40ac-b780-54929639f310	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
96ebc3d7-d90b-44a2-b8e3-2e804ea7f19b	066c7b8f-76bd-44dd-900e-be09a7891196	655c2ff8-022e-47af-b6a3-a6ed14959053	474d03c5-18a1-4e0e-a298-9e479fe64df6	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
36cdeeff-063c-4f1e-b8a8-c12fbfc34593	066c7b8f-76bd-44dd-900e-be09a7891196	655c2ff8-022e-47af-b6a3-a6ed14959053	56abc767-1971-43fb-a08e-878aaab783b1	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
0bf69292-1c93-4fb8-a524-4914227fd5b8	066c7b8f-76bd-44dd-900e-be09a7891196	655c2ff8-022e-47af-b6a3-a6ed14959053	b184a4d0-6b5d-4672-8343-0dda42f129ed	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
c1ca25a3-138f-46dd-b95f-59dc5ab21fc8	066c7b8f-76bd-44dd-900e-be09a7891196	655c2ff8-022e-47af-b6a3-a6ed14959053	796c16ad-9145-4ffc-a762-19f517ba0e4d	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
90007ce5-6382-446e-b94d-710de07d08e9	066c7b8f-76bd-44dd-900e-be09a7891196	655c2ff8-022e-47af-b6a3-a6ed14959053	51622f08-c61f-4c22-8258-e2dd5b9c10f5	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
a86418c4-36e4-4adc-8224-912f6fde02c3	d3d44c5e-9e80-4a01-9f36-cbcabd50bec6	655c2ff8-022e-47af-b6a3-a6ed14959053	719a9ed5-849f-46d1-80c8-5a45b7513b53	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
c5ddfee4-d3d9-47e7-ab98-858d9a3a1660	d3d44c5e-9e80-4a01-9f36-cbcabd50bec6	655c2ff8-022e-47af-b6a3-a6ed14959053	8ba83857-85b7-4d26-8918-3a92b6e6069e	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
a029d3c8-5175-4bb0-90fe-cab8a45cde62	d3d44c5e-9e80-4a01-9f36-cbcabd50bec6	655c2ff8-022e-47af-b6a3-a6ed14959053	db26d940-9cb1-475b-ba46-53d108d9479a	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
b9e94f5c-9fec-431a-8e67-baa9ca354c87	7b0ac83d-15d1-4a49-ad76-dcf172753a10	655c2ff8-022e-47af-b6a3-a6ed14959053	a9d3a726-203f-4dd6-ad59-36793c483d91	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
f2af975d-b5c2-4e78-9c9a-9e420415f925	7b0ac83d-15d1-4a49-ad76-dcf172753a10	655c2ff8-022e-47af-b6a3-a6ed14959053	85e203a8-a394-4067-8fa1-b94c34e2691e	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
4b0f5191-723a-48f6-800c-2743759d02fc	7b0ac83d-15d1-4a49-ad76-dcf172753a10	655c2ff8-022e-47af-b6a3-a6ed14959053	334f3518-9237-41a9-8d2d-b005d25aa13b	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
491c254f-5663-4c13-b9d5-28a7046f22ad	7b0ac83d-15d1-4a49-ad76-dcf172753a10	655c2ff8-022e-47af-b6a3-a6ed14959053	1d9aa594-c04d-4c38-937c-0323be8162e4	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
8c0f8e49-db88-4b03-9872-67da6c651dc7	956534d8-d111-44c5-a793-68e78a0c4af7	655c2ff8-022e-47af-b6a3-a6ed14959053	cf716320-8fed-4f2d-b438-defe0d3177ea	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
15c695ce-1a31-4c2e-974f-d5bfc81ea156	956534d8-d111-44c5-a793-68e78a0c4af7	655c2ff8-022e-47af-b6a3-a6ed14959053	7119b36f-c49a-4d30-b7ac-89a366340fbc	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
7cc5d3fe-1db8-4838-90f8-53398a3f1d21	956534d8-d111-44c5-a793-68e78a0c4af7	655c2ff8-022e-47af-b6a3-a6ed14959053	19e9dba3-b166-4a5c-9e16-1749dfbde91e	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
3e2def64-b8e5-462c-90c4-f2900b71f073	e4549663-03a4-4fc8-ac4e-9da36b9b5c11	655c2ff8-022e-47af-b6a3-a6ed14959053	aec562ba-d1bc-4849-a50f-a1e369a6ace6	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
4d20226b-a631-49e6-841b-0c3ef8933775	e4549663-03a4-4fc8-ac4e-9da36b9b5c11	655c2ff8-022e-47af-b6a3-a6ed14959053	18edfff6-5e09-4028-8085-96aeacf96280	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
6acc325c-f68f-4a4c-81c6-4eb5765e5b97	e4549663-03a4-4fc8-ac4e-9da36b9b5c11	655c2ff8-022e-47af-b6a3-a6ed14959053	35f92ae8-889c-4f94-80a7-be21f444823d	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
a32c4dd7-5e56-47cf-ac82-2f345618dd15	485a5879-3bfe-40f5-b1f8-51d3958ca4f7	655c2ff8-022e-47af-b6a3-a6ed14959053	2eccad6c-c292-43fa-8cb3-9f5c241b53ea	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
39cab531-2a8d-4bd1-ab89-86562e84f361	485a5879-3bfe-40f5-b1f8-51d3958ca4f7	655c2ff8-022e-47af-b6a3-a6ed14959053	e273762b-0b47-44fa-a942-694461d12565	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
70aa6346-6942-4244-9489-5c1aef345f8e	485a5879-3bfe-40f5-b1f8-51d3958ca4f7	655c2ff8-022e-47af-b6a3-a6ed14959053	d0506f08-8bad-4924-b75d-26888a3bceaa	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
92e879f1-b49d-41ad-8a9d-54a4260e6299	485a5879-3bfe-40f5-b1f8-51d3958ca4f7	655c2ff8-022e-47af-b6a3-a6ed14959053	bb3c5c51-c52d-4ce2-9c63-42d9cef75a3d	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
a9a00fb5-91a2-4601-82da-f2e43ff96201	e8901f1d-9435-4c8f-b2d7-278b5e5c7f7d	655c2ff8-022e-47af-b6a3-a6ed14959053	dc7d21d1-0a0d-4e4a-aaaa-d970c7da3825	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
71bdc9cd-d952-4ebb-b3cd-d694cefca354	e8901f1d-9435-4c8f-b2d7-278b5e5c7f7d	655c2ff8-022e-47af-b6a3-a6ed14959053	4eb3f9fd-e0c6-4e66-b293-b1a51f0db477	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
10790059-58fb-4a02-b199-dd9b495973b4	e8901f1d-9435-4c8f-b2d7-278b5e5c7f7d	655c2ff8-022e-47af-b6a3-a6ed14959053	7dff96b1-fe62-4bd5-b04c-849ae0d9dba8	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
feae3493-ad51-46f9-9250-3303e0d10dfe	e8901f1d-9435-4c8f-b2d7-278b5e5c7f7d	655c2ff8-022e-47af-b6a3-a6ed14959053	c74d538a-212e-4e59-9f3e-eb5a70f9fd93	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
c1d25846-e9f2-4b2a-9ba3-cbb52a4f98e7	e8901f1d-9435-4c8f-b2d7-278b5e5c7f7d	655c2ff8-022e-47af-b6a3-a6ed14959053	ced1866a-f8e3-470f-aa6a-f94c6d2374bc	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
e64df23d-2448-4f49-bf63-9b2cb3bc2832	e8901f1d-9435-4c8f-b2d7-278b5e5c7f7d	655c2ff8-022e-47af-b6a3-a6ed14959053	38d318b0-6457-4974-af45-b0db8381d460	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
596a1512-e324-49f9-b0ad-c1c9bf72b385	bd2471a2-8a0d-4437-9814-f83e25a7137a	aaf9db65-5497-4fa6-a75c-745c5ba981b7	b8569e15-dae4-484f-8ce5-d76ecebff7bd	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
ccf3c861-1025-4ce9-9f45-067089bf9410	bd2471a2-8a0d-4437-9814-f83e25a7137a	aaf9db65-5497-4fa6-a75c-745c5ba981b7	b0b33ba5-6367-4f7f-9f5e-44cad8b94973	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
7ae81e36-10fa-4627-a25e-461baaa47f4f	e82fb25c-3677-4188-a2c6-c9100edbbe51	b79c0077-aafb-4173-8ed2-8658442978cd	565e7175-64d0-4cab-85b2-c88d7adc966f	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
3cfdca9c-7316-4ac3-b70b-43f10d4e306a	e82fb25c-3677-4188-a2c6-c9100edbbe51	ff15fcb1-3e7c-4170-abad-7ea5d3a1d4eb	66fc9c8e-78b2-437a-9972-7189dd1665e1	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
ca03ace0-986f-4aba-a03b-c367f1bcc55f	39cfee77-7c80-4361-b8bf-2b2cfa26272d	ff15fcb1-3e7c-4170-abad-7ea5d3a1d4eb	73125719-319c-430f-88d9-5cda7dc72eb1	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
b51ff139-4fdc-45af-8cc7-bad12c6d30ad	3d4b00e9-c35d-416d-98b1-78a79ef21e40	4a783da4-c275-4d69-9c29-1b3befb29a96	7453df24-ee03-48a8-aa9a-610337e68833	\N	\N	\N	\N	\N	\N	\N	\N	\N	map_pins
67f1a0dc-5969-4f1d-8fd3-b66e50278592	78e4174a-d8e7-4d2d-baa6-03115d8f8d91	4a783da4-c275-4d69-9c29-1b3befb29a96	7453df24-ee03-48a8-aa9a-610337e68833	\N	\N	\N	\N	\N	\N	\N	\N	\N	map_pins
5b3fd492-79b4-40f0-90bc-c3218e13eaf5	033e4b64-ee3c-4f45-b4fc-b28e7a0aa5df	e40fc00f-af14-4407-82f6-3733d87c70d3	d56448de-874f-4173-9533-1c81b3b811c1	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
3a486ade-1d57-46ab-a001-3663804444da	b2ce1e15-3070-4edf-9bb8-12b20def6166	e40fc00f-af14-4407-82f6-3733d87c70d3	7050c210-f1cf-4b26-819c-89dbce83f956	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
9fd95f24-ad5c-4f68-b85a-dead504d4cf1	85cb7d4f-fd39-4a6f-8b59-68e490af507a	e40fc00f-af14-4407-82f6-3733d87c70d3	7050c210-f1cf-4b26-819c-89dbce83f956	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
51f160b6-bf6b-44cf-9da6-8c0e5a15aa53	50d76389-1a03-4a41-9d09-61c5aa320e5a	e40fc00f-af14-4407-82f6-3733d87c70d3	7050c210-f1cf-4b26-819c-89dbce83f956	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
bd746357-5c6f-4378-bc6f-831b0dd10d34	584248e6-793b-4533-a04b-4c68feda6861	e40fc00f-af14-4407-82f6-3733d87c70d3	7050c210-f1cf-4b26-819c-89dbce83f956	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
62ac6274-51f2-4f91-9e9d-5b3ead9b7346	aceddc8b-d563-4629-9ddc-4f8e4951c058	e40fc00f-af14-4407-82f6-3733d87c70d3	7050c210-f1cf-4b26-819c-89dbce83f956	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
eee5bc7b-f77f-4753-a788-8d42995cf7c2	652a30ba-8eec-421a-b9ec-8689f7c857b9	e40fc00f-af14-4407-82f6-3733d87c70d3	7050c210-f1cf-4b26-819c-89dbce83f956	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
18940c4e-db77-4ea9-be04-2045cabd5165	5d783765-c735-4b3b-80e3-787b52b49ff2	e40fc00f-af14-4407-82f6-3733d87c70d3	2c09cad8-af31-4d48-b557-6dc1cbe7dbb4	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
ea87c810-369a-4ffb-a249-3efe3c7d5036	de06bae2-5397-4603-8b67-6b660efd094f	e40fc00f-af14-4407-82f6-3733d87c70d3	2c09cad8-af31-4d48-b557-6dc1cbe7dbb4	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
d2a6471a-d074-469d-9957-d2c6e06c5d4c	b89c3ff8-9170-4dc8-b80a-7b9fa69b333b	e40fc00f-af14-4407-82f6-3733d87c70d3	f137c4c0-ecd3-4fca-b437-ef3a91be3ce0	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
76747391-4603-4cc9-9b2e-688701a231f6	140b7862-d550-47fd-a7bc-5c26a17f0d30	ef6e9b03-adaa-4ac3-9f2f-11198b66eb23	122de938-df41-4d57-ae24-1cb87b7c29f5	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
b45ec54b-17d1-42f3-abff-b72a11843850	faf276f4-f7d8-4e9e-8994-bae9d2922f8d	ef6e9b03-adaa-4ac3-9f2f-11198b66eb23	122de938-df41-4d57-ae24-1cb87b7c29f5	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
81df24d5-6c06-4175-9ce4-643be0dc6441	c2a73823-6116-4d67-9ec2-3c4b2102d22c	234bdebe-c8a0-4cb5-9975-05531acbc532	bf4723a8-81fc-4ded-b0e2-cc603646ec9b	\N	\N	\N	\N	\N	\N	\N	\N	\N	images
c99b58b8-a6ec-4869-994f-3cf8ee9fa131	c2a73823-6116-4d67-9ec2-3c4b2102d22c	234bdebe-c8a0-4cb5-9975-05531acbc532	a1257cb6-388f-44f0-b564-419d23d60c46	\N	\N	\N	\N	\N	\N	\N	\N	\N	images
a77134b6-a4ba-4486-a886-cc2ed836d398	c2a73823-6116-4d67-9ec2-3c4b2102d22c	234bdebe-c8a0-4cb5-9975-05531acbc532	ebe366d7-7a2b-4c40-810e-880aef966743	\N	\N	\N	\N	\N	\N	\N	\N	\N	images
d14d7e6b-a084-43cb-a72c-ca80eea92df6	0b217ff3-d94f-405e-ae4a-2b7a2c6cc7bd	234bdebe-c8a0-4cb5-9975-05531acbc532	f655c9c8-b39d-475a-94cd-b1b092523064	\N	\N	\N	\N	\N	\N	\N	\N	\N	images
0abb2b6f-4b8f-4051-a99f-784acf66be0c	22f2ea97-1863-47e8-859e-ef9dfe54b199	234bdebe-c8a0-4cb5-9975-05531acbc532	bc381b3c-5a82-4426-9906-ea86f45bd505	\N	\N	\N	\N	\N	\N	\N	\N	\N	images
d1d8d2de-400e-49bc-85a7-c13e8768881f	36bae4e6-7aa3-4375-b1fe-637e2bb83cb2	bceb552b-78a0-41d0-ab04-da691868695f	27cd8fef-fea0-4779-9324-5af0931d9b92	\N	\N	\N	\N	\N	\N	\N	\N	\N	images
fda726ab-d553-4f5b-bb2c-c819be7dda27	066c7b8f-76bd-44dd-900e-be09a7891196	bceb552b-78a0-41d0-ab04-da691868695f	e2951f29-532a-445a-b8aa-a2b4f3fa701f	\N	\N	\N	\N	\N	\N	\N	\N	\N	images
d6a793f5-a0e0-43ef-9839-177034e87331	d3d44c5e-9e80-4a01-9f36-cbcabd50bec6	bceb552b-78a0-41d0-ab04-da691868695f	80b47bd9-fa80-4b73-9ccb-590e4615f22d	\N	\N	\N	\N	\N	\N	\N	\N	\N	images
55401eaf-8917-49d5-a444-1869ae613ba5	7b0ac83d-15d1-4a49-ad76-dcf172753a10	bceb552b-78a0-41d0-ab04-da691868695f	4c5e0786-691c-420a-8297-a281e25f6a1d	\N	\N	\N	\N	\N	\N	\N	\N	\N	images
cfcf6d80-517d-4a08-89d2-92a49a979261	956534d8-d111-44c5-a793-68e78a0c4af7	bceb552b-78a0-41d0-ab04-da691868695f	e561b55c-33a6-4049-9765-651f01c68f7d	\N	\N	\N	\N	\N	\N	\N	\N	\N	images
aa1ce8d0-71c8-40b7-a163-0291e17d1e21	e8901f1d-9435-4c8f-b2d7-278b5e5c7f7d	bceb552b-78a0-41d0-ab04-da691868695f	939a9a23-f286-46bf-b7c2-63f1dd8caec2	\N	\N	\N	\N	\N	\N	\N	\N	\N	images
1997c23d-6fea-4288-9f18-de0a7f014563	e4549663-03a4-4fc8-ac4e-9da36b9b5c11	bceb552b-78a0-41d0-ab04-da691868695f	804c2074-5da7-4d49-aa5a-23a70471a1e1	\N	\N	\N	\N	\N	\N	\N	\N	\N	images
814d1b98-0055-459c-9cd1-586223ac8a84	485a5879-3bfe-40f5-b1f8-51d3958ca4f7	bceb552b-78a0-41d0-ab04-da691868695f	a8d5d991-955f-4eeb-8db1-c173bf39f02b	\N	\N	\N	\N	\N	\N	\N	\N	\N	images
e341b2b9-f006-4bc4-99f1-d41586c8770c	122de938-df41-4d57-ae24-1cb87b7c29f5	f4c5a3c9-a833-4b70-b0eb-60d05d005028	e5ae2f28-9f3f-474f-808b-3757f2df28e6	\N	\N	\N	\N	\N	\N	\N	\N	\N	images
904ab86c-5623-4425-a07c-f322545deaa9	3d4b00e9-c35d-416d-98b1-78a79ef21e40	4bcdc2ce-3737-4b6f-af14-70e67de51b91	\N	\N	\N	\N	\N	\N	\N	\N	\N	178	values
093c7429-b205-4f21-8fab-e31386cac92c	78e4174a-d8e7-4d2d-baa6-03115d8f8d91	4bcdc2ce-3737-4b6f-af14-70e67de51b91	\N	\N	\N	\N	\N	\N	\N	\N	\N	150	values
e8c6d3b4-2d90-4597-81e2-5e193def0387	d3d44c5e-9e80-4a01-9f36-cbcabd50bec6	600190bc-3957-4285-a321-98ed37aff3dd	\N	\N	\N	\N	\N	\N	\N	\N	\N	"As High as Honor"	values
c6825640-806b-460f-bd21-6157bbe74da0	e8901f1d-9435-4c8f-b2d7-278b5e5c7f7d	600190bc-3957-4285-a321-98ed37aff3dd	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Ours is the Fury"	values
61fe595f-1696-42b7-b524-1a6e2227cf3e	066c7b8f-76bd-44dd-900e-be09a7891196	600190bc-3957-4285-a321-98ed37aff3dd	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Hear Me Roar!"	values
990608db-9d6c-4c01-a1f0-956ce15e1a31	956534d8-d111-44c5-a793-68e78a0c4af7	600190bc-3957-4285-a321-98ed37aff3dd	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Unbowed, Unbent, Unbroken"	values
6bc0f0d4-8550-4965-86eb-67bf19f39edd	36bae4e6-7aa3-4375-b1fe-637e2bb83cb2	600190bc-3957-4285-a321-98ed37aff3dd	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Winter is Coming"	values
4619988d-709f-4f4b-ae7e-0506550fc9ec	7b0ac83d-15d1-4a49-ad76-dcf172753a10	600190bc-3957-4285-a321-98ed37aff3dd	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Growing Strong"	values
dc5d0e99-6c42-4672-94eb-27b5ad76bb54	e4549663-03a4-4fc8-ac4e-9da36b9b5c11	600190bc-3957-4285-a321-98ed37aff3dd	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Family, Duty, Honor"	values
ddae6b45-6b72-457b-899d-65858a625592	485a5879-3bfe-40f5-b1f8-51d3958ca4f7	600190bc-3957-4285-a321-98ed37aff3dd	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Fire and Blood"	values
27188516-d5bc-4d42-8ea6-d3bdb06404f6	ebdaafa6-5f70-4bed-aca3-62d0f0aca6cc	31cd49ee-f19d-40a3-a0cd-d70e6a40fd7a	\N	\N	\N	\N	\N	\N	\N	\N	\N	"2db469ae-34d8-4e7a-9ced-e0d59dcfd237"	values
1e264019-343d-4af4-a38d-ec955319a40d	e82fb25c-3677-4188-a2c6-c9100edbbe51	31cd49ee-f19d-40a3-a0cd-d70e6a40fd7a	\N	\N	\N	\N	\N	\N	\N	\N	\N	"bc1d38ce-d6bd-4f25-a21f-b8f4ea09e023"	values
8d3deae0-64da-486b-877e-e441d58b0f07	4cde42c9-11da-4134-9c96-776d777e818b	31cd49ee-f19d-40a3-a0cd-d70e6a40fd7a	\N	\N	\N	\N	\N	\N	\N	\N	\N	"2db469ae-34d8-4e7a-9ced-e0d59dcfd237"	values
690275c0-f98d-4b4b-9719-078f21eb93a6	0ab3d98c-c460-4981-a24b-d687cf33fe84	c3bdc1bf-f4c4-41fa-97ab-9567eb2cb9aa	551597eb-86e7-406c-897e-63be470898af	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
6d081581-ecfc-4683-8e34-95df97caa294	0ab3d98c-c460-4981-a24b-d687cf33fe84	c3bdc1bf-f4c4-41fa-97ab-9567eb2cb9aa	29bc458c-feaa-4d70-b9a9-afc5cdb60ded	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
a1fa19ac-e924-4a64-96e7-e928160aa031	b9cb6274-c52b-4044-ba3b-00f10bcc9d7c	f79bdb5d-7a99-4d38-ae28-835da8369349	\N	\N	\N	\N	\N	\N	\N	\N	\N	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Translucent leaf that is rare.", "type": "text"}]}]}	values
f9112bae-b050-4123-a6dc-ff5bd79c8bff	b9cb6274-c52b-4044-ba3b-00f10bcc9d7c	db1410e6-3d55-41db-a8fc-a252743c3970	\N	\N	\N	\N	\N	\N	\N	\N	\N	500	values
0d0a2cdc-63bc-4608-8bea-e42d371b328a	b9cb6274-c52b-4044-ba3b-00f10bcc9d7c	8853d265-ef31-408d-b587-824036aa889c	\N	\N	\N	\N	\N	\N	\N	\N	\N	"df99964b-d036-4ece-9e37-8f4803bc4c4d"	values
e332df8b-ff6a-4383-a726-9a3facbb7c45	cf7a34a4-6282-4fc1-a59e-6dda8aedcd96	49943253-dfd6-40af-9347-530942a8eb7c	1911b480-54b9-4ea2-967c-95f201f5ea67	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
281189cc-e83d-4ba2-954a-8c04188c7b34	39eeee12-df28-40a7-918c-c0b6cb423ad1	db1410e6-3d55-41db-a8fc-a252743c3970	\N	\N	\N	\N	\N	\N	\N	\N	\N	150	values
d47dcfb1-969d-4def-be6b-7039bc868a04	39eeee12-df28-40a7-918c-c0b6cb423ad1	8853d265-ef31-408d-b587-824036aa889c	\N	\N	\N	\N	\N	\N	\N	\N	\N	"193d2ee9-f89e-44d1-b0ff-9c6b71d71c16"	values
ec965fcb-c25e-416d-aadf-6ca5cec242ea	cf7a34a4-6282-4fc1-a59e-6dda8aedcd96	39417b93-542a-4762-b1a7-402893a6997c	b9cb6274-c52b-4044-ba3b-00f10bcc9d7c	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
f082059a-4ff9-428c-ae28-510144b452b2	cf7a34a4-6282-4fc1-a59e-6dda8aedcd96	39417b93-542a-4762-b1a7-402893a6997c	39eeee12-df28-40a7-918c-c0b6cb423ad1	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
1d3c9d28-2095-4a81-8964-f40f96fe8c00	0ab3d98c-c460-4981-a24b-d687cf33fe84	1cb962d8-d1b2-4fa7-a81d-59ada584e038	cf7a34a4-6282-4fc1-a59e-6dda8aedcd96	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
35de4b07-8bd1-44ee-b4f2-5291d8bcd744	4c4453e5-d49f-45bf-9aeb-cd1112c69718	e40fc00f-af14-4407-82f6-3733d87c70d3	2b272f40-2fc9-43db-b497-d484b9defb31	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
d4d0c60a-8f2e-4184-ba9a-102c311d5261	a50b660d-3527-4fab-acac-74ca48097458	e40fc00f-af14-4407-82f6-3733d87c70d3	e3c43417-2afc-4175-b176-0065866aeb85	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
4a46d388-66b6-4515-a794-9c58f123df06	122de938-df41-4d57-ae24-1cb87b7c29f5	bf4b9e96-a89a-42d3-b8d8-9c92f3ae6809	5f874844-c636-460f-bf39-134faa548624	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
c6d92b36-c436-4017-b9f2-c23da9e8aaac	122de938-df41-4d57-ae24-1cb87b7c29f5	bf4b9e96-a89a-42d3-b8d8-9c92f3ae6809	cb9de732-f974-48a3-bf67-ecf1d9d0f58c	\N	\N	\N	\N	\N	\N	\N	\N	\N	characters
\.


--
-- Data for Name: character_field_values; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.character_field_values (id, character_id, character_field_id, related_id, end_month_id, start_month_id, end_day, end_year, start_day, start_year, option_id, suboption_id, value, type) FROM stdin;
afa70c82-c441-4f09-ac4b-2a2ee269bcc1	eae334ab-dbf6-47b2-916a-95c77902723b	beb9a180-5cc5-4bab-82ef-964cbddfecab	7050c210-f1cf-4b26-819c-89dbce83f956	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
fce81a98-cc1e-4e3f-be1e-665d2e5e8fc6	a50a4981-40e4-44ae-82ff-27b6c4077ac2	5cb166f5-558b-408e-8dd0-711dba284c23	36bae4e6-7aa3-4375-b1fe-637e2bb83cb2	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
64bdeddd-b334-4511-b42a-5578fcc48c07	474d03c5-18a1-4e0e-a298-9e479fe64df6	5cb166f5-558b-408e-8dd0-711dba284c23	066c7b8f-76bd-44dd-900e-be09a7891196	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
d9365e71-871c-44b1-9349-8c16de080e8b	b184a4d0-6b5d-4672-8343-0dda42f129ed	5cb166f5-558b-408e-8dd0-711dba284c23	066c7b8f-76bd-44dd-900e-be09a7891196	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
eb2dd679-b346-4739-b941-d99efa9c4013	51622f08-c61f-4c22-8258-e2dd5b9c10f5	5cb166f5-558b-408e-8dd0-711dba284c23	066c7b8f-76bd-44dd-900e-be09a7891196	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
d08967f2-3d46-47a7-864b-c1193a1ce693	796c16ad-9145-4ffc-a762-19f517ba0e4d	5cb166f5-558b-408e-8dd0-711dba284c23	066c7b8f-76bd-44dd-900e-be09a7891196	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
5a3c8c86-7b5e-430b-9be3-ad86e453dd62	56abc767-1971-43fb-a08e-878aaab783b1	5cb166f5-558b-408e-8dd0-711dba284c23	066c7b8f-76bd-44dd-900e-be09a7891196	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
805a4930-d44d-48de-98e6-91efe608b66f	85e203a8-a394-4067-8fa1-b94c34e2691e	5cb166f5-558b-408e-8dd0-711dba284c23	7b0ac83d-15d1-4a49-ad76-dcf172753a10	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
f5c0521a-c9bb-4a39-99ba-9d51475c6321	334f3518-9237-41a9-8d2d-b005d25aa13b	5cb166f5-558b-408e-8dd0-711dba284c23	7b0ac83d-15d1-4a49-ad76-dcf172753a10	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
e1700785-5284-47a0-99dd-8eeeb4db21b0	1d9aa594-c04d-4c38-937c-0323be8162e4	5cb166f5-558b-408e-8dd0-711dba284c23	7b0ac83d-15d1-4a49-ad76-dcf172753a10	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
03ef5b3a-3966-49cb-8b7c-a979755ebafe	a9d3a726-203f-4dd6-ad59-36793c483d91	5cb166f5-558b-408e-8dd0-711dba284c23	7b0ac83d-15d1-4a49-ad76-dcf172753a10	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
1eed47bd-1187-45b8-ac54-afac150e87be	19e9dba3-b166-4a5c-9e16-1749dfbde91e	5cb166f5-558b-408e-8dd0-711dba284c23	956534d8-d111-44c5-a793-68e78a0c4af7	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
ba9cf06a-f09a-436e-96b3-dba0fe01a078	cf716320-8fed-4f2d-b438-defe0d3177ea	5cb166f5-558b-408e-8dd0-711dba284c23	956534d8-d111-44c5-a793-68e78a0c4af7	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
d6e53d4d-ed84-4936-861a-abe370a732c7	7119b36f-c49a-4d30-b7ac-89a366340fbc	5cb166f5-558b-408e-8dd0-711dba284c23	956534d8-d111-44c5-a793-68e78a0c4af7	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
3f2581ba-15a6-4489-b949-33cd998df6ee	4eb3f9fd-e0c6-4e66-b293-b1a51f0db477	5cb166f5-558b-408e-8dd0-711dba284c23	e8901f1d-9435-4c8f-b2d7-278b5e5c7f7d	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
df06da75-dc5a-431e-84cb-3cfd266a0d87	7dff96b1-fe62-4bd5-b04c-849ae0d9dba8	5cb166f5-558b-408e-8dd0-711dba284c23	e8901f1d-9435-4c8f-b2d7-278b5e5c7f7d	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
f99f39ee-5a1c-486b-8273-2c785f56714d	c74d538a-212e-4e59-9f3e-eb5a70f9fd93	5cb166f5-558b-408e-8dd0-711dba284c23	e8901f1d-9435-4c8f-b2d7-278b5e5c7f7d	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
588cf785-56e9-4153-b9e2-e66eaae5611e	ced1866a-f8e3-470f-aa6a-f94c6d2374bc	5cb166f5-558b-408e-8dd0-711dba284c23	e8901f1d-9435-4c8f-b2d7-278b5e5c7f7d	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
550edfdd-5836-4ab7-9387-975370600316	38d318b0-6457-4974-af45-b0db8381d460	5cb166f5-558b-408e-8dd0-711dba284c23	e8901f1d-9435-4c8f-b2d7-278b5e5c7f7d	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
a3754c3c-d56b-494a-8f4e-4075fc665637	2eccad6c-c292-43fa-8cb3-9f5c241b53ea	5cb166f5-558b-408e-8dd0-711dba284c23	485a5879-3bfe-40f5-b1f8-51d3958ca4f7	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
86eeb305-7bbd-4d09-8fe2-c76a26c401eb	3dc7880d-a137-4e9a-9f3f-a55023b63f9c	5cb166f5-558b-408e-8dd0-711dba284c23	36bae4e6-7aa3-4375-b1fe-637e2bb83cb2	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
5d8c9810-bef4-41e3-8c6b-5a929d91ae1f	7296e38f-f51b-4357-bfb0-f82a737b662a	5cb166f5-558b-408e-8dd0-711dba284c23	36bae4e6-7aa3-4375-b1fe-637e2bb83cb2	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
fcb02ac6-dc8c-424d-a26d-d672faad4aa3	aec562ba-d1bc-4849-a50f-a1e369a6ace6	5cb166f5-558b-408e-8dd0-711dba284c23	e4549663-03a4-4fc8-ac4e-9da36b9b5c11	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
186abf23-4bf8-456c-a415-289da1605919	dc7d21d1-0a0d-4e4a-aaaa-d970c7da3825	5cb166f5-558b-408e-8dd0-711dba284c23	e8901f1d-9435-4c8f-b2d7-278b5e5c7f7d	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
18e12479-51fb-4a67-aa97-5f9e33322114	e273762b-0b47-44fa-a942-694461d12565	5cb166f5-558b-408e-8dd0-711dba284c23	485a5879-3bfe-40f5-b1f8-51d3958ca4f7	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
d7b2a35e-5664-45ad-9ae2-634296b6dbf1	d0506f08-8bad-4924-b75d-26888a3bceaa	5cb166f5-558b-408e-8dd0-711dba284c23	485a5879-3bfe-40f5-b1f8-51d3958ca4f7	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
14b97eb9-8f17-4abf-97df-c1039877b3ce	bb3c5c51-c52d-4ce2-9c63-42d9cef75a3d	5cb166f5-558b-408e-8dd0-711dba284c23	485a5879-3bfe-40f5-b1f8-51d3958ca4f7	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
cb06e61e-83d4-480b-b96c-08017a025c04	2dc1216a-2a31-4a74-8387-4acbd9556599	beb9a180-5cc5-4bab-82ef-964cbddfecab	7050c210-f1cf-4b26-819c-89dbce83f956	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
e383313f-6bc3-4c24-8c80-785acf7137b2	2dc1216a-2a31-4a74-8387-4acbd9556599	beb9a180-5cc5-4bab-82ef-964cbddfecab	2c09cad8-af31-4d48-b557-6dc1cbe7dbb4	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
813c1491-637f-438b-8d19-e4a6b6aa44f0	8c79d399-96f6-469e-9948-ad3baa8ce483	2e60f241-4c82-4cc7-8433-f2bc63985ebb	85cb7d4f-fd39-4a6f-8b59-68e490af507a	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
a1a62b03-b60a-4abe-aa73-07793b7b895a	565e7175-64d0-4cab-85b2-c88d7adc966f	2e60f241-4c82-4cc7-8433-f2bc63985ebb	b2ce1e15-3070-4edf-9bb8-12b20def6166	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
87c4cd02-f15d-442e-bcd7-61bbaeac528c	565e7175-64d0-4cab-85b2-c88d7adc966f	beb9a180-5cc5-4bab-82ef-964cbddfecab	7050c210-f1cf-4b26-819c-89dbce83f956	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
a49c5542-f47d-446b-97be-950ba52c6a89	e1943b46-b616-4649-a01e-e8dcdf0d6b2b	2e60f241-4c82-4cc7-8433-f2bc63985ebb	50d76389-1a03-4a41-9d09-61c5aa320e5a	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
bf363ed7-ca32-402c-9af7-e90a16a35d2b	b8569e15-dae4-484f-8ce5-d76ecebff7bd	2e60f241-4c82-4cc7-8433-f2bc63985ebb	b2ce1e15-3070-4edf-9bb8-12b20def6166	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
87133caf-8a90-4a14-976a-f4bc46cc5cd0	b8569e15-dae4-484f-8ce5-d76ecebff7bd	beb9a180-5cc5-4bab-82ef-964cbddfecab	7050c210-f1cf-4b26-819c-89dbce83f956	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
af17fe69-287a-4622-8b38-a3157969b009	a40c1aaa-a3b3-40a8-94d2-0826a52b5281	2e60f241-4c82-4cc7-8433-f2bc63985ebb	b2ce1e15-3070-4edf-9bb8-12b20def6166	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
daa5c2a3-7f8d-4649-ad65-6ff48fd69466	a40c1aaa-a3b3-40a8-94d2-0826a52b5281	beb9a180-5cc5-4bab-82ef-964cbddfecab	7050c210-f1cf-4b26-819c-89dbce83f956	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
989c6c58-e30d-4ab4-a268-47316f843e0a	eae334ab-dbf6-47b2-916a-95c77902723b	2e60f241-4c82-4cc7-8433-f2bc63985ebb	033e4b64-ee3c-4f45-b4fc-b28e7a0aa5df	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
56dc1755-8dee-4b38-995b-f89ae7cba62f	e1943b46-b616-4649-a01e-e8dcdf0d6b2b	beb9a180-5cc5-4bab-82ef-964cbddfecab	7050c210-f1cf-4b26-819c-89dbce83f956	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
e0e15941-93d3-42c0-adcd-40aba4a8588d	e1943b46-b616-4649-a01e-e8dcdf0d6b2b	beb9a180-5cc5-4bab-82ef-964cbddfecab	6ecaf253-ffe7-4288-8332-917cdc582657	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
6dd7dd9e-9998-4a8d-b82d-a89f53288274	8c79d399-96f6-469e-9948-ad3baa8ce483	beb9a180-5cc5-4bab-82ef-964cbddfecab	7050c210-f1cf-4b26-819c-89dbce83f956	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
15e9e386-9ea0-42ba-b51a-a16c8c50cbeb	8c79d399-96f6-469e-9948-ad3baa8ce483	beb9a180-5cc5-4bab-82ef-964cbddfecab	2b272f40-2fc9-43db-b497-d484b9defb31	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
da14be50-3218-4b80-835d-280e3b2df7e4	0996efd2-e65c-454e-ba59-d33569b7e648	beb9a180-5cc5-4bab-82ef-964cbddfecab	d56448de-874f-4173-9533-1c81b3b811c1	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
f7bdc08c-f523-412e-b905-157a7caa45c3	0996efd2-e65c-454e-ba59-d33569b7e648	beb9a180-5cc5-4bab-82ef-964cbddfecab	7050c210-f1cf-4b26-819c-89dbce83f956	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
2626ea69-6707-447b-bb10-68fd54953c21	6053d298-c0f6-431f-8e7e-c1aec7924c88	2e60f241-4c82-4cc7-8433-f2bc63985ebb	5d783765-c735-4b3b-80e3-787b52b49ff2	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
5f02d115-9e1b-42fd-adfd-33588185e913	6053d298-c0f6-431f-8e7e-c1aec7924c88	beb9a180-5cc5-4bab-82ef-964cbddfecab	2c09cad8-af31-4d48-b557-6dc1cbe7dbb4	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
4ee72fd3-c51f-4648-bb00-80a27301713a	6053d298-c0f6-431f-8e7e-c1aec7924c88	beb9a180-5cc5-4bab-82ef-964cbddfecab	7050c210-f1cf-4b26-819c-89dbce83f956	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
7465cc09-db48-4861-b4c2-5c30da7b3a34	06d43ae7-a804-4072-aa37-14800b4b13f1	beb9a180-5cc5-4bab-82ef-964cbddfecab	7f9f1633-71af-4fba-8c81-81c628f30c21	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
e453d6a4-3795-4102-889d-706587f24957	8c79d399-96f6-469e-9948-ad3baa8ce483	5cbfcaf7-a703-41ab-9012-5b183d67903c	140b7862-d550-47fd-a7bc-5c26a17f0d30	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
189c1787-dd0c-42ad-9536-ebb0210ca77e	8c79d399-96f6-469e-9948-ad3baa8ce483	5cbfcaf7-a703-41ab-9012-5b183d67903c	faf276f4-f7d8-4e9e-8994-bae9d2922f8d	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
6feb54c7-bc72-40b1-a310-d310ed4f511a	8c79d399-96f6-469e-9948-ad3baa8ce483	5cbfcaf7-a703-41ab-9012-5b183d67903c	8056e39e-be0b-4bd9-bf16-324dabfba71d	\N	\N	\N	\N	\N	\N	\N	\N	\N	blueprint_instances
1ca54144-7c19-4c09-a193-9d6d8b5ee9ae	61fa5f6a-cae3-48aa-bcbf-b10351299d23	c831cf05-3379-49eb-9d75-df61a5452436	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	values
fa897091-c6c6-4594-967a-6337db82f835	61fa5f6a-cae3-48aa-bcbf-b10351299d23	467a8ad9-8c22-4475-ae94-1ce4c6b7d942	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Elirah"	values
d417f645-860d-41e3-afd2-7404b270ac27	eae334ab-dbf6-47b2-916a-95c77902723b	4a1f488b-9087-4cb0-9167-9b7fa7559dd7	\N	\N	\N	\N	\N	\N	\N	\N	\N	"a3687875-115c-4bbe-a1a6-eb3dc844554d"	values
1e2bd1db-78ac-4797-937f-11f906a123ea	d760c6fb-9376-4551-94a0-4b16e85e96ac	8dc9223c-461b-40a6-ad7a-acc8ed9b6f2a	\N	\N	\N	\N	\N	\N	\N	\N	\N	"the Great"	values
4ab864ed-239b-404c-b150-8755ba999bc0	565e7175-64d0-4cab-85b2-c88d7adc966f	467a8ad9-8c22-4475-ae94-1ce4c6b7d942	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Kyton"	values
5b24f6ef-f980-44a5-a510-43d0c8c3c589	565e7175-64d0-4cab-85b2-c88d7adc966f	c831cf05-3379-49eb-9d75-df61a5452436	\N	\N	\N	\N	\N	\N	\N	\N	\N	5	values
6fd7f547-96c0-4251-bbfe-029bce0756d5	565e7175-64d0-4cab-85b2-c88d7adc966f	8dc9223c-461b-40a6-ad7a-acc8ed9b6f2a	\N	\N	\N	\N	\N	\N	\N	\N	\N	"the Wise"	values
d4f61aa3-a934-40d6-9286-f6c0f477350a	565e7175-64d0-4cab-85b2-c88d7adc966f	4a1f488b-9087-4cb0-9167-9b7fa7559dd7	\N	\N	\N	\N	\N	\N	\N	\N	\N	"a3687875-115c-4bbe-a1a6-eb3dc844554d"	values
4513d229-ace7-43d3-944e-879984959563	66fc9c8e-78b2-437a-9972-7189dd1665e1	467a8ad9-8c22-4475-ae94-1ce4c6b7d942	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Kyton"	values
6138fa2a-effb-4743-a071-393c16f87c77	66fc9c8e-78b2-437a-9972-7189dd1665e1	c831cf05-3379-49eb-9d75-df61a5452436	\N	\N	\N	\N	\N	\N	\N	\N	\N	4	values
512749a6-65f8-4202-82bb-6bd00db8719c	66fc9c8e-78b2-437a-9972-7189dd1665e1	8dc9223c-461b-40a6-ad7a-acc8ed9b6f2a	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Whitehair"	values
1919883d-1450-4664-a261-8cb2654fd77e	27a4a371-45e1-45f2-acf2-d5fbd36e32f4	467a8ad9-8c22-4475-ae94-1ce4c6b7d942	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Kyton"	values
e3604b9b-6b3d-4033-a24d-f28fe1831e25	27a4a371-45e1-45f2-acf2-d5fbd36e32f4	c831cf05-3379-49eb-9d75-df61a5452436	\N	\N	\N	\N	\N	\N	\N	\N	\N	3	values
8fcf0c32-7da2-42b2-a29a-851500b5b13c	2ddefdce-7d00-4668-988c-53d24d79e056	467a8ad9-8c22-4475-ae94-1ce4c6b7d942	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Kyton"	values
f3acdb78-0f18-4d0b-86cd-d4c87ddeeeb8	2ddefdce-7d00-4668-988c-53d24d79e056	c831cf05-3379-49eb-9d75-df61a5452436	\N	\N	\N	\N	\N	\N	\N	\N	\N	2	values
e95a1295-4084-4934-9a0a-1917f2d5d0e6	0f916460-8c32-443c-912a-842207838174	467a8ad9-8c22-4475-ae94-1ce4c6b7d942	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Kyton"	values
d33ad393-732f-4c4a-ab5c-8aa5ac50c709	0f916460-8c32-443c-912a-842207838174	c831cf05-3379-49eb-9d75-df61a5452436	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	values
c9967ed3-3fa2-436b-9006-a90c2edfe1d0	0f916460-8c32-443c-912a-842207838174	8dc9223c-461b-40a6-ad7a-acc8ed9b6f2a	\N	\N	\N	\N	\N	\N	\N	\N	\N	"the Restorer"	values
abf3ec9f-2b1c-4209-a35c-e94d6e38f965	8611ab61-310c-4c11-80d9-53e814012d6f	467a8ad9-8c22-4475-ae94-1ce4c6b7d942	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Andra"	values
49493cec-716a-4151-af9c-fb9e73955227	8611ab61-310c-4c11-80d9-53e814012d6f	c831cf05-3379-49eb-9d75-df61a5452436	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	values
e56a9a70-1b56-466f-b0e5-bab1d20c4209	8611ab61-310c-4c11-80d9-53e814012d6f	8dc9223c-461b-40a6-ad7a-acc8ed9b6f2a	\N	\N	\N	\N	\N	\N	\N	\N	\N	"the Pale"	values
5789617a-6505-4609-8c2d-1daa078093e3	71675486-ae62-42b6-968e-d1b1ef917ef0	4a1f488b-9087-4cb0-9167-9b7fa7559dd7	\N	\N	\N	\N	\N	\N	\N	\N	\N	"61564068-a765-41ad-83a0-f683cb3615a0"	values
a3940b2d-cf3b-4a01-af2b-b5ea1dde0e43	65a41a03-063a-4bb8-99f9-4f1eae0d7d4a	4a1f488b-9087-4cb0-9167-9b7fa7559dd7	\N	\N	\N	\N	\N	\N	\N	\N	\N	"fd14fca8-063b-43ed-a9aa-73c96a6c4fc6"	values
9601ebf7-1840-4db3-acf2-3a46282c8c16	6053d298-c0f6-431f-8e7e-c1aec7924c88	4a1f488b-9087-4cb0-9167-9b7fa7559dd7	\N	\N	\N	\N	\N	\N	\N	\N	\N	"61564068-a765-41ad-83a0-f683cb3615a0"	values
331f5ea9-7306-406d-bce6-7a25f4aaaf11	f0cd02ca-bb5a-49bb-9117-c6be46dd2907	4a1f488b-9087-4cb0-9167-9b7fa7559dd7	\N	\N	\N	\N	\N	\N	\N	\N	\N	"fd14fca8-063b-43ed-a9aa-73c96a6c4fc6"	values
7e754be6-87c9-41d4-9ede-ad8f6a70cee4	2dc1216a-2a31-4a74-8387-4acbd9556599	4a1f488b-9087-4cb0-9167-9b7fa7559dd7	\N	\N	\N	\N	\N	\N	\N	\N	\N	"5083cc0b-9641-4513-89e0-c925abe29e02"	values
2a962f92-d2a2-4d2a-804e-75c64a5dacc5	b8569e15-dae4-484f-8ce5-d76ecebff7bd	4a1f488b-9087-4cb0-9167-9b7fa7559dd7	\N	\N	\N	\N	\N	\N	\N	\N	\N	"5083cc0b-9641-4513-89e0-c925abe29e02"	values
dd240545-1ae6-4f00-9756-6a92482e5b3b	66fc9c8e-78b2-437a-9972-7189dd1665e1	4a1f488b-9087-4cb0-9167-9b7fa7559dd7	\N	\N	\N	\N	\N	\N	\N	\N	\N	"a3687875-115c-4bbe-a1a6-eb3dc844554d"	values
2d718aa8-c7ae-46a9-b9f3-9ef185c9a913	72254500-1ef4-4b8d-940b-b9a059b74b5f	467a8ad9-8c22-4475-ae94-1ce4c6b7d942	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Aton"	values
01135273-beac-4a5b-ac62-feb7a5594261	446bbfe5-c3ba-4de1-8cae-db4fc1206c15	467a8ad9-8c22-4475-ae94-1ce4c6b7d942	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Banis"	values
3d4cf77c-ec93-4956-bd1f-e456e86e32fd	446bbfe5-c3ba-4de1-8cae-db4fc1206c15	c831cf05-3379-49eb-9d75-df61a5452436	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	values
c1d8159e-88d2-4ad7-8479-1b5754d94275	446bbfe5-c3ba-4de1-8cae-db4fc1206c15	8dc9223c-461b-40a6-ad7a-acc8ed9b6f2a	\N	\N	\N	\N	\N	\N	\N	\N	\N	"the Great"	values
187f1ace-7386-4027-a58a-f77e9ab853e2	ddb2f771-f6e2-492a-81bd-d9c8af8fd15e	467a8ad9-8c22-4475-ae94-1ce4c6b7d942	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Anona"	values
d6318abc-27c3-49c9-9c67-48b3c4c42617	ddb2f771-f6e2-492a-81bd-d9c8af8fd15e	c831cf05-3379-49eb-9d75-df61a5452436	\N	\N	\N	\N	\N	\N	\N	\N	\N	2	values
22d02c08-b45d-4743-a50c-14a341f974ee	ddb2f771-f6e2-492a-81bd-d9c8af8fd15e	8dc9223c-461b-40a6-ad7a-acc8ed9b6f2a	\N	\N	\N	\N	\N	\N	\N	\N	\N	"the Just"	values
6a636188-b0d9-4001-8585-270f4540826f	089ebc15-1543-4d92-b077-7bd832eb2a79	467a8ad9-8c22-4475-ae94-1ce4c6b7d942	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Banis"	values
be6794e9-672b-4423-9a52-892fcaec84c2	089ebc15-1543-4d92-b077-7bd832eb2a79	c831cf05-3379-49eb-9d75-df61a5452436	\N	\N	\N	\N	\N	\N	\N	\N	\N	2	values
68dc3f95-0cfb-4bc6-8b5b-ce4b692b981a	78529628-b5cf-4d05-a8c3-2f651fa56391	467a8ad9-8c22-4475-ae94-1ce4c6b7d942	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Banis"	values
be32129c-84dc-4faa-8271-05e6781d24dc	78529628-b5cf-4d05-a8c3-2f651fa56391	8dc9223c-461b-40a6-ad7a-acc8ed9b6f2a	\N	\N	\N	\N	\N	\N	\N	\N	\N	"the Unready"	values
9a1062ff-ea39-409b-89d7-b50565a91895	78529628-b5cf-4d05-a8c3-2f651fa56391	c831cf05-3379-49eb-9d75-df61a5452436	\N	\N	\N	\N	\N	\N	\N	\N	\N	3	values
7191720f-016e-40fc-af43-e154e59942b6	05a62bbb-6fa4-46b0-ae14-4115937b9f5e	467a8ad9-8c22-4475-ae94-1ce4c6b7d942	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Banis"	values
ebceacd7-7c85-4f97-9b2e-04ba9e294855	05a62bbb-6fa4-46b0-ae14-4115937b9f5e	c831cf05-3379-49eb-9d75-df61a5452436	\N	\N	\N	\N	\N	\N	\N	\N	\N	4	values
a751439b-c44e-479e-ae90-367d055d172a	2ae57613-1a15-432b-ab75-57dc566a8fed	8dc9223c-461b-40a6-ad7a-acc8ed9b6f2a	\N	\N	\N	\N	\N	\N	\N	\N	\N	"the Magnificent"	values
0774ee58-fae1-4d53-b0b3-71446553428a	2ae57613-1a15-432b-ab75-57dc566a8fed	c831cf05-3379-49eb-9d75-df61a5452436	\N	\N	\N	\N	\N	\N	\N	\N	\N	5	values
ca4a5788-1228-4c69-954f-efb46d8d4322	2ae57613-1a15-432b-ab75-57dc566a8fed	467a8ad9-8c22-4475-ae94-1ce4c6b7d942	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Banis"	values
c39d16e7-22f0-45bf-b45b-2ebaff5632e2	d05651da-7e14-4429-88d2-e1bcf6997290	c831cf05-3379-49eb-9d75-df61a5452436	\N	\N	\N	\N	\N	\N	\N	\N	\N	6	values
83d550e3-fc39-4023-95d1-d5da24fa0313	d05651da-7e14-4429-88d2-e1bcf6997290	467a8ad9-8c22-4475-ae94-1ce4c6b7d942	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Banis"	values
4a6abf52-e43e-47e6-a000-309ca76e151e	d760c6fb-9376-4551-94a0-4b16e85e96ac	c831cf05-3379-49eb-9d75-df61a5452436	\N	\N	\N	\N	\N	\N	\N	\N	\N	2	values
75507dad-6214-4d7a-b46f-e176d10c53ad	d760c6fb-9376-4551-94a0-4b16e85e96ac	467a8ad9-8c22-4475-ae94-1ce4c6b7d942	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Elirah"	values
32756230-7289-45e8-89b2-c2b8d6519ffc	430cda7d-8ab9-43fc-a8cb-8e69a0220a5f	8dc9223c-461b-40a6-ad7a-acc8ed9b6f2a	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Conqueror of Xaf"	values
a28ded77-6341-4d64-9b7a-a282ca6da275	430cda7d-8ab9-43fc-a8cb-8e69a0220a5f	c831cf05-3379-49eb-9d75-df61a5452436	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	values
cb488580-fe26-4976-a37b-f5bfcbb0f8c7	430cda7d-8ab9-43fc-a8cb-8e69a0220a5f	467a8ad9-8c22-4475-ae94-1ce4c6b7d942	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Elrad"	values
c7fd85f2-d390-4d1a-8ff2-f8352b40606d	b75309d2-b3aa-467e-9e85-8b9983feb9c2	8dc9223c-461b-40a6-ad7a-acc8ed9b6f2a	\N	\N	\N	\N	\N	\N	\N	\N	\N	"the Bloody"	values
57831cc8-43a6-4e12-b9d3-0dac0be2f45b	b75309d2-b3aa-467e-9e85-8b9983feb9c2	467a8ad9-8c22-4475-ae94-1ce4c6b7d942	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Elys"	values
86df6086-cf73-4ef3-afb6-ef3e038b9ee1	af75eb77-c24c-485a-a7cb-483ca778cd66	8dc9223c-461b-40a6-ad7a-acc8ed9b6f2a	\N	\N	\N	\N	\N	\N	\N	\N	\N	"the Short"	values
48d095f8-e9d9-491a-bfa7-8d1fc6483963	af75eb77-c24c-485a-a7cb-483ca778cd66	c831cf05-3379-49eb-9d75-df61a5452436	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	values
f9da5e77-f8e1-441c-8dec-2087b6cc9e8c	af75eb77-c24c-485a-a7cb-483ca778cd66	467a8ad9-8c22-4475-ae94-1ce4c6b7d942	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Gan"	values
43e2be56-7fa3-429e-8e30-9b88bb062029	6e79865e-cc81-4da7-9be0-8674932413b0	467a8ad9-8c22-4475-ae94-1ce4c6b7d942	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Gan"	values
45bb5b02-7997-406b-b029-52bdc007a600	6e79865e-cc81-4da7-9be0-8674932413b0	c831cf05-3379-49eb-9d75-df61a5452436	\N	\N	\N	\N	\N	\N	\N	\N	\N	2	values
785eb046-dabf-49e3-b5bb-6e7d92be4ca9	6e79865e-cc81-4da7-9be0-8674932413b0	8dc9223c-461b-40a6-ad7a-acc8ed9b6f2a	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Conqueror of Taeth"	values
d805b857-eb17-4619-90be-b7204348c3c4	8c79d399-96f6-469e-9948-ad3baa8ce483	4a1f488b-9087-4cb0-9167-9b7fa7559dd7	\N	\N	\N	\N	\N	\N	\N	\N	\N	"cdfe589a-e6e3-4ffe-901a-a0e6c86681e3"	values
02ba1e31-a423-4f64-a5e6-6084bcfcf7de	43855f00-564a-4d7c-873d-b4260954b14d	467a8ad9-8c22-4475-ae94-1ce4c6b7d942	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Andra"	values
351b4085-4c87-4ebb-be65-4a54802ed2e6	43855f00-564a-4d7c-873d-b4260954b14d	c831cf05-3379-49eb-9d75-df61a5452436	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	values
e8653400-59d4-442b-9e45-0f542788b46d	f183375b-c3ac-40a7-a72a-fee05a008267	467a8ad9-8c22-4475-ae94-1ce4c6b7d942	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Andra"	values
219d3867-34b4-4cd0-984a-62b4e3ffa043	f183375b-c3ac-40a7-a72a-fee05a008267	c831cf05-3379-49eb-9d75-df61a5452436	\N	\N	\N	\N	\N	\N	\N	\N	\N	2	values
a2771142-e105-4333-b52f-f4599af31063	f183375b-c3ac-40a7-a72a-fee05a008267	8dc9223c-461b-40a6-ad7a-acc8ed9b6f2a	\N	\N	\N	\N	\N	\N	\N	\N	\N	"The Drunk"	values
4c8386cd-7386-4e64-847c-89c4ab11f88d	8c79d399-96f6-469e-9948-ad3baa8ce483	b0a7ca1c-5cab-45cb-a727-5f6329d9d93c	\N	\N	\N	\N	\N	\N	\N	\N	\N	"d3d750d6-2520-4686-8e6d-c1fa9fa60e4d"	values
50e6f11b-8ff4-4b76-a592-e628a7f978d6	565e7175-64d0-4cab-85b2-c88d7adc966f	b0a7ca1c-5cab-45cb-a727-5f6329d9d93c	\N	\N	\N	\N	\N	\N	\N	\N	\N	"d3d750d6-2520-4686-8e6d-c1fa9fa60e4d"	values
bb8576ed-a421-4175-96db-9477e0d100b7	01815aa3-06d4-45ec-aeb7-a91ed879f3bb	b0a7ca1c-5cab-45cb-a727-5f6329d9d93c	\N	\N	\N	\N	\N	\N	\N	\N	\N	"a34f67f4-07ea-40f8-9582-43ec30642f5c"	values
bfbb9b55-5fc0-4e34-b4f0-a7f34f5418cc	eae334ab-dbf6-47b2-916a-95c77902723b	b0a7ca1c-5cab-45cb-a727-5f6329d9d93c	\N	\N	\N	\N	\N	\N	\N	\N	\N	"6bf2ead4-8b4a-4e23-8951-372d238cf38c"	values
cb6e3dea-548a-4ca0-b0f3-9f2172e48ed5	47b28ed9-edc3-4ce6-ae53-8b59b46db787	467a8ad9-8c22-4475-ae94-1ce4c6b7d942	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Paus"	values
c9e5b05d-fe70-4556-8f99-d222622ebbb8	47b28ed9-edc3-4ce6-ae53-8b59b46db787	c831cf05-3379-49eb-9d75-df61a5452436	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	values
5959ac5a-7230-46ba-8272-ebec979cc6da	47b28ed9-edc3-4ce6-ae53-8b59b46db787	8dc9223c-461b-40a6-ad7a-acc8ed9b6f2a	\N	\N	\N	\N	\N	\N	\N	\N	\N	"The Philosopher King"	values
dfb5e58d-eb82-44c1-ab4a-b29aaacd5e1f	e5bad67a-1212-4999-80a8-0e3f267f3246	467a8ad9-8c22-4475-ae94-1ce4c6b7d942	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Paus"	values
0250e2f6-2aeb-4292-898c-2068902f75f0	e5bad67a-1212-4999-80a8-0e3f267f3246	c831cf05-3379-49eb-9d75-df61a5452436	\N	\N	\N	\N	\N	\N	\N	\N	\N	2	values
52343bde-c9ee-4f5b-9eb3-cc4091a0e461	836feb12-4be9-4ef9-bfc2-04b89c82d785	467a8ad9-8c22-4475-ae94-1ce4c6b7d942	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Rodanon"	values
5d9d017b-7c10-49fb-b2df-0420fb3eefcf	836feb12-4be9-4ef9-bfc2-04b89c82d785	c831cf05-3379-49eb-9d75-df61a5452436	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	values
0afc6fef-4bd7-41ed-9874-785079683926	f068b802-732a-4bbd-b423-5cc9f404434f	467a8ad9-8c22-4475-ae94-1ce4c6b7d942	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Rodanon"	values
62e2db6e-22e7-44c3-a566-a1a0394178af	f068b802-732a-4bbd-b423-5cc9f404434f	c831cf05-3379-49eb-9d75-df61a5452436	\N	\N	\N	\N	\N	\N	\N	\N	\N	2	values
31cdf3f5-7e75-42f6-b611-7e8ef98c4e1e	f068b802-732a-4bbd-b423-5cc9f404434f	8dc9223c-461b-40a6-ad7a-acc8ed9b6f2a	\N	\N	\N	\N	\N	\N	\N	\N	\N	"The Handsome"	values
b4e2b7a9-a24b-4082-ab77-dc302c4282bd	65a03f79-1467-49e4-b5d6-be4f297426fa	467a8ad9-8c22-4475-ae94-1ce4c6b7d942	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Rodanon"	values
52be816d-df3f-4598-8a22-3f3d2880c6e7	65a03f79-1467-49e4-b5d6-be4f297426fa	c831cf05-3379-49eb-9d75-df61a5452436	\N	\N	\N	\N	\N	\N	\N	\N	\N	3	values
d561ebe9-99c2-4bf9-8506-fe1f324b1fe2	ee9aeef6-bb12-492d-8c65-4c6541a97e3c	467a8ad9-8c22-4475-ae94-1ce4c6b7d942	\N	\N	\N	\N	\N	\N	\N	\N	\N	"Rodanon"	values
65ba0b34-c9b5-4982-ac8d-0963944025eb	ee9aeef6-bb12-492d-8c65-4c6541a97e3c	c831cf05-3379-49eb-9d75-df61a5452436	\N	\N	\N	\N	\N	\N	\N	\N	\N	4	values
b175f0d6-95fb-45de-9be6-d92e62f9f17e	ee9aeef6-bb12-492d-8c65-4c6541a97e3c	8dc9223c-461b-40a6-ad7a-acc8ed9b6f2a	\N	\N	\N	\N	\N	\N	\N	\N	\N	"The Bull"	values
96a1c914-7b0d-409b-ac81-bedf41e7f04c	5889baaf-1c5a-4087-a4b7-24d583395413	8dc9223c-461b-40a6-ad7a-acc8ed9b6f2a	\N	\N	\N	\N	\N	\N	\N	\N	\N	"The Uncrowned"	values
\.


--
-- Data for Name: character_fields; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.character_fields (id, title, sort, field_type, formula, random_table_id, parent_id, options, calendar_id, blueprint_id) FROM stdin;
4a1f488b-9087-4cb0-9167-9b7fa7559dd7	Type	0	select	\N	\N	f63e41f7-71cf-4d5c-8c1b-1124b18f1faa	[{"id": "61564068-a765-41ad-83a0-f683cb3615a0", "value": "Bravery"}, {"id": "a7435409-34a8-4fb1-89c1-8aa4581a0c4f", "value": "Unity"}, {"id": "a3687875-115c-4bbe-a1a6-eb3dc844554d", "value": "Love"}, {"id": "cdfe589a-e6e3-4ffe-901a-a0e6c86681e3", "value": "Duty"}, {"id": "5083cc0b-9641-4513-89e0-c925abe29e02", "value": "Sincerity"}, {"id": "fd14fca8-063b-43ed-a9aa-73c96a6c4fc6", "value": "Knowledge"}]	\N	\N
467a8ad9-8c22-4475-ae94-1ce4c6b7d942	Regnal title	0	text	\N	\N	08721a0e-b39e-4aec-8906-3860dbf11422	[]	\N	\N
8dc9223c-461b-40a6-ad7a-acc8ed9b6f2a	Regnal nickname	2	text	\N	\N	08721a0e-b39e-4aec-8906-3860dbf11422	[]	\N	\N
c831cf05-3379-49eb-9d75-df61a5452436	Regnal number	1	number	\N	\N	08721a0e-b39e-4aec-8906-3860dbf11422	[]	\N	\N
c50618c3-c62c-404d-b9dd-f38c9b8712f4	Reign	3	date	\N	\N	08721a0e-b39e-4aec-8906-3860dbf11422	[]	bd6f749d-c636-496f-9e28-08a347640924	\N
5cb166f5-558b-408e-8dd0-711dba284c23	Great House	0	blueprints_single	\N	\N	770eacc4-ae00-4672-a651-9ac8c0ebea4b	[]	\N	\N
2e60f241-4c82-4cc7-8433-f2bc63985ebb	Origin	1	blueprints_single	\N	\N	7f961c9b-10a6-4035-952f-588f7e74aa18	[]	\N	cc93b9b9-56f6-4cc9-b8f0-9e6df8604afc
beb9a180-5cc5-4bab-82ef-964cbddfecab	Languages	1	blueprints_multiple	\N	\N	7f961c9b-10a6-4035-952f-588f7e74aa18	[]	\N	b4a5a3ac-ccca-4522-8f9e-27fa1faeb37f
b0a7ca1c-5cab-45cb-a727-5f6329d9d93c	Rank	1	select	\N	\N	e2075df9-d892-4939-9ed9-a820b4c8c3a7	[{"id": "a34f67f4-07ea-40f8-9582-43ec30642f5c", "value": "High Inquisitor"}, {"id": "d3d750d6-2520-4686-8e6d-c1fa9fa60e4d", "value": "Gold rank"}, {"id": "e8b9dab9-7eed-4eaf-8d47-4c006d4eb5b7", "value": "Silver rank"}, {"id": "e1d0556a-ebdf-461f-a6b9-4c25b05f84fd", "value": "Brass rank"}, {"id": "4e28ca37-1ee0-44ee-993b-a1bf174a760a", "value": "Free agent"}, {"id": "6bf2ead4-8b4a-4e23-8951-372d238cf38c", "value": "On proving"}]	\N	\N
5cbfcaf7-a703-41ab-9012-5b183d67903c	Title	0	blueprints_multiple	\N	\N	e2075df9-d892-4939-9ed9-a820b4c8c3a7	[]	\N	44598285-2999-4846-a6e3-1c746ed886ab
\.


--
-- Data for Name: character_relationship_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.character_relationship_types (id, title, project_id, ascendant_title, descendant_title) FROM stdin;
1535197c-b620-492e-bbf5-41a65124bab9	Friends	43e1c879-415b-4394-95ad-f9a4c42a43c5	\N	\N
756a8c0b-6b75-412a-a395-578a5f006654	Family	43e1c879-415b-4394-95ad-f9a4c42a43c5	Parent	Child
aa925890-316b-44a7-aec8-2d379d6b24ad	Inquisition	43e1c879-415b-4394-95ad-f9a4c42a43c5	Superior	Subordinate
98dcaa48-cf32-474c-8d37-a46f88c94ddb	Family	77cb0278-b9c7-43b5-bd30-e72022eacf11	Parent	Child
46a56c10-ca29-410a-b939-8bffcfff61e9	Divine hierarchy	43e1c879-415b-4394-95ad-f9a4c42a43c5	Superior	Inferior
\.


--
-- Data for Name: characters_relationships; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.characters_relationships (character_a_id, character_b_id, relation_type_id, id) FROM stdin;
565e7175-64d0-4cab-85b2-c88d7adc966f	02ef72f7-2ba3-49a1-885b-f780a74cb7ef	756a8c0b-6b75-412a-a395-578a5f006654	b4be2058-8eff-4780-b2cc-bdaa431a707a
565e7175-64d0-4cab-85b2-c88d7adc966f	eae334ab-dbf6-47b2-916a-95c77902723b	1535197c-b620-492e-bbf5-41a65124bab9	ba944397-5e47-4407-81e2-98bc5d8266c5
565e7175-64d0-4cab-85b2-c88d7adc966f	6053d298-c0f6-431f-8e7e-c1aec7924c88	1535197c-b620-492e-bbf5-41a65124bab9	a28445cb-a291-4026-9596-e8f10ab8ebb3
5f874844-c636-460f-bf39-134faa548624	02ef72f7-2ba3-49a1-885b-f780a74cb7ef	756a8c0b-6b75-412a-a395-578a5f006654	e3578e95-b4e0-4ff6-a74d-0aa0d974de03
5f874844-c636-460f-bf39-134faa548624	5889baaf-1c5a-4087-a4b7-24d583395413	756a8c0b-6b75-412a-a395-578a5f006654	cfa70379-6c45-4f3e-bc6e-c8c400b0f282
eae334ab-dbf6-47b2-916a-95c77902723b	565e7175-64d0-4cab-85b2-c88d7adc966f	aa925890-316b-44a7-aec8-2d379d6b24ad	2d2df14b-77af-4c0d-bcf4-bfb8e111ee9f
b8569e15-dae4-484f-8ce5-d76ecebff7bd	565e7175-64d0-4cab-85b2-c88d7adc966f	aa925890-316b-44a7-aec8-2d379d6b24ad	5142d479-1dce-443f-a489-a7955a8d813c
5889baaf-1c5a-4087-a4b7-24d583395413	66fc9c8e-78b2-437a-9972-7189dd1665e1	756a8c0b-6b75-412a-a395-578a5f006654	0f860370-1c4a-42b2-b181-a77a7cb5db8d
66fc9c8e-78b2-437a-9972-7189dd1665e1	420c052c-e3f9-4cde-b3b0-8bb5ab115a6c	756a8c0b-6b75-412a-a395-578a5f006654	5313cd42-d93a-4c4d-9163-ccf6019c57cb
66fc9c8e-78b2-437a-9972-7189dd1665e1	fce94a81-baa3-4dbd-9d9b-98e0d28db9c8	756a8c0b-6b75-412a-a395-578a5f006654	d5ea6b67-08b7-40f4-8e71-fed01da5c56a
d05651da-7e14-4429-88d2-e1bcf6997290	fce94a81-baa3-4dbd-9d9b-98e0d28db9c8	756a8c0b-6b75-412a-a395-578a5f006654	874ca2b3-338d-41d8-b232-9bc0e624b104
d05651da-7e14-4429-88d2-e1bcf6997290	420c052c-e3f9-4cde-b3b0-8bb5ab115a6c	756a8c0b-6b75-412a-a395-578a5f006654	73bd2ee0-3957-4600-9b85-36fda0b36a68
4c7062f3-c0c3-47fc-b5ed-af609bde881d	420c052c-e3f9-4cde-b3b0-8bb5ab115a6c	756a8c0b-6b75-412a-a395-578a5f006654	09969fb4-8669-4c31-a664-3758681759c6
4c7062f3-c0c3-47fc-b5ed-af609bde881d	fce94a81-baa3-4dbd-9d9b-98e0d28db9c8	756a8c0b-6b75-412a-a395-578a5f006654	c43c1d6e-1fb1-4e22-ac05-4419eaa93f76
565e7175-64d0-4cab-85b2-c88d7adc966f	5889baaf-1c5a-4087-a4b7-24d583395413	756a8c0b-6b75-412a-a395-578a5f006654	9c869a75-655e-4318-810f-87495ec07d35
5889baaf-1c5a-4087-a4b7-24d583395413	a48a1161-f834-4296-a955-c01c8a8e7cc6	756a8c0b-6b75-412a-a395-578a5f006654	5f298c64-774d-42dc-94a9-6581fd0cfc78
8c79d399-96f6-469e-9948-ad3baa8ce483	60600919-d5b5-49f8-8bb8-1cda143c7759	756a8c0b-6b75-412a-a395-578a5f006654	4c41febd-9544-420e-acea-42fbf085148b
8c79d399-96f6-469e-9948-ad3baa8ce483	4f7fe214-265c-48dd-b8d6-dbf416a28917	756a8c0b-6b75-412a-a395-578a5f006654	d8907b20-0932-449e-abce-775cd3959c0a
51a05454-1f30-4c98-b976-25e26217ac60	4f7fe214-265c-48dd-b8d6-dbf416a28917	756a8c0b-6b75-412a-a395-578a5f006654	e8ca3df3-83c0-4731-a7d9-c3adffaedf98
51a05454-1f30-4c98-b976-25e26217ac60	60600919-d5b5-49f8-8bb8-1cda143c7759	756a8c0b-6b75-412a-a395-578a5f006654	1cef99a6-d8dd-48ff-9e1c-d3ba273ecd71
420c052c-e3f9-4cde-b3b0-8bb5ab115a6c	f3d7e4b2-ade4-4da4-83ad-2f007746395a	756a8c0b-6b75-412a-a395-578a5f006654	86001a2d-7472-4196-86af-b0f91976617c
54ffebb4-a35e-417d-828a-8faade3fbb75	f3d7e4b2-ade4-4da4-83ad-2f007746395a	756a8c0b-6b75-412a-a395-578a5f006654	6cd98c54-2190-4dc1-b621-46ba8c0a482a
54ffebb4-a35e-417d-828a-8faade3fbb75	9a25c621-d46a-493c-b876-dab5a639c0c9	756a8c0b-6b75-412a-a395-578a5f006654	a5b971c0-6553-4673-9728-7c9fc6cf1a1f
420c052c-e3f9-4cde-b3b0-8bb5ab115a6c	9a25c621-d46a-493c-b876-dab5a639c0c9	756a8c0b-6b75-412a-a395-578a5f006654	daf9d449-e721-4b3f-8490-63a09ab636d6
58fc3988-e686-41fc-b62b-a10c0416ac44	aaa02323-5478-4373-9e25-bb1735c00e0e	756a8c0b-6b75-412a-a395-578a5f006654	c1cae434-ab86-47b0-a98e-18592500a9c2
72254500-1ef4-4b8d-940b-b9a059b74b5f	58fc3988-e686-41fc-b62b-a10c0416ac44	756a8c0b-6b75-412a-a395-578a5f006654	846398b7-63fd-4f3a-b48b-b58c4703cdad
972e40bf-c301-4b1e-81be-81dc2a03ab65	72254500-1ef4-4b8d-940b-b9a059b74b5f	756a8c0b-6b75-412a-a395-578a5f006654	3cb616be-3281-4ab7-ae4b-e328322b17f8
d2fb5503-3f99-41cb-9e1a-a20b72417567	72254500-1ef4-4b8d-940b-b9a059b74b5f	756a8c0b-6b75-412a-a395-578a5f006654	9aa61815-b0f9-498d-9c92-f2169d7371e2
d2fb5503-3f99-41cb-9e1a-a20b72417567	64571933-d64d-40ff-8708-91543f9355e3	756a8c0b-6b75-412a-a395-578a5f006654	e8140acd-7242-4751-a9e3-55956659911b
972e40bf-c301-4b1e-81be-81dc2a03ab65	64571933-d64d-40ff-8708-91543f9355e3	756a8c0b-6b75-412a-a395-578a5f006654	1f8837ef-0e00-44f0-abe1-bd9e81b07630
ca84cf36-c80a-4674-8ac3-f628a42aa560	d2fb5503-3f99-41cb-9e1a-a20b72417567	756a8c0b-6b75-412a-a395-578a5f006654	f7062279-0c46-4fcc-83a4-261a4ef2a51e
ca84cf36-c80a-4674-8ac3-f628a42aa560	be9944bd-083b-4f82-ae7f-16ce579b3a74	756a8c0b-6b75-412a-a395-578a5f006654	6e74eba1-0527-4f7b-9b05-0a39fdc1b35e
5185926a-6761-40d6-941f-6909d2f393c0	ca84cf36-c80a-4674-8ac3-f628a42aa560	756a8c0b-6b75-412a-a395-578a5f006654	94120c0c-7fb4-43cf-83af-49adc0182306
af75eb77-c24c-485a-a7cb-483ca778cd66	ca84cf36-c80a-4674-8ac3-f628a42aa560	756a8c0b-6b75-412a-a395-578a5f006654	6efcec0e-04d4-4564-9e3f-d495393b9f40
836feb12-4be9-4ef9-bfc2-04b89c82d785	ca84cf36-c80a-4674-8ac3-f628a42aa560	756a8c0b-6b75-412a-a395-578a5f006654	181ca65a-dddf-4d7b-944f-d623f2cc2e09
5185926a-6761-40d6-941f-6909d2f393c0	eec884b6-89b5-46b1-b342-af07bd253719	756a8c0b-6b75-412a-a395-578a5f006654	c407d3e4-39fa-454d-83c4-8beb679edbd4
af75eb77-c24c-485a-a7cb-483ca778cd66	eec884b6-89b5-46b1-b342-af07bd253719	756a8c0b-6b75-412a-a395-578a5f006654	d79e4d7b-1fb4-475b-979a-3d0f3882a769
836feb12-4be9-4ef9-bfc2-04b89c82d785	eec884b6-89b5-46b1-b342-af07bd253719	756a8c0b-6b75-412a-a395-578a5f006654	f5f261b2-9dcc-4c14-9938-a9cc180d0f12
939fbb69-bf03-4e1a-97e7-8f987d1fcb80	d5cce706-aab4-4390-8f2c-9aa8135f4bf4	756a8c0b-6b75-412a-a395-578a5f006654	5991153b-d8fb-4786-aed0-3ca8a084813c
939fbb69-bf03-4e1a-97e7-8f987d1fcb80	5185926a-6761-40d6-941f-6909d2f393c0	756a8c0b-6b75-412a-a395-578a5f006654	6cb3f528-05e8-489f-95f4-a65509cbe9e5
61fa5f6a-cae3-48aa-bcbf-b10351299d23	836feb12-4be9-4ef9-bfc2-04b89c82d785	756a8c0b-6b75-412a-a395-578a5f006654	cb217d08-c98d-4d91-abbf-cfef47aea063
61fa5f6a-cae3-48aa-bcbf-b10351299d23	45a3b9cc-c971-462f-b85c-df8f678b17fc	756a8c0b-6b75-412a-a395-578a5f006654	1dcc072a-1d5f-41fd-ba80-e8d3da3b782c
446bbfe5-c3ba-4de1-8cae-db4fc1206c15	edba5cb4-6a02-4405-b37b-3852eb449940	756a8c0b-6b75-412a-a395-578a5f006654	402ea1e3-8658-4a2c-a951-b014f5e037a9
446bbfe5-c3ba-4de1-8cae-db4fc1206c15	61fa5f6a-cae3-48aa-bcbf-b10351299d23	756a8c0b-6b75-412a-a395-578a5f006654	af08f0c0-ae9c-4cc2-9d43-5cc5af20a24c
089ebc15-1543-4d92-b077-7bd832eb2a79	446bbfe5-c3ba-4de1-8cae-db4fc1206c15	756a8c0b-6b75-412a-a395-578a5f006654	95a22a75-b696-418f-8f74-390fbcb65c9c
430cda7d-8ab9-43fc-a8cb-8e69a0220a5f	446bbfe5-c3ba-4de1-8cae-db4fc1206c15	756a8c0b-6b75-412a-a395-578a5f006654	7a464db4-bd83-4494-9fe0-8beb4ecb14a6
089ebc15-1543-4d92-b077-7bd832eb2a79	cde91141-356d-4bdc-9ed6-095f9971df4c	756a8c0b-6b75-412a-a395-578a5f006654	a85bba63-5228-442c-813b-368cd6ae1f9d
430cda7d-8ab9-43fc-a8cb-8e69a0220a5f	cde91141-356d-4bdc-9ed6-095f9971df4c	756a8c0b-6b75-412a-a395-578a5f006654	2fb2f017-4688-4315-8004-ed244ce05ef7
5bcadcd6-1639-461c-9d1b-a88a9615a030	992cb4e3-ccc3-4c82-8172-3135e85e4099	756a8c0b-6b75-412a-a395-578a5f006654	351089d9-8e55-4813-ba2c-d24cfa46a19a
5bcadcd6-1639-461c-9d1b-a88a9615a030	8e89ad04-5a59-4fb5-922f-8a37a374511e	756a8c0b-6b75-412a-a395-578a5f006654	a09778b8-ec3d-48c3-8279-3cd10afaeb06
e0a57db4-960d-4175-8466-7bdb16bb975d	089ebc15-1543-4d92-b077-7bd832eb2a79	756a8c0b-6b75-412a-a395-578a5f006654	9f117e4b-3b45-4c77-a9dd-002bbfecfe7a
e0a57db4-960d-4175-8466-7bdb16bb975d	e9ec7008-a4f7-4f11-a648-6fd118f1d374	756a8c0b-6b75-412a-a395-578a5f006654	32044ebb-13a8-4eb3-82c4-fedc0aa3869c
ea64ffaf-8dea-40fa-b089-083931d21858	e0a57db4-960d-4175-8466-7bdb16bb975d	756a8c0b-6b75-412a-a395-578a5f006654	7068fca7-5709-4735-a725-599634224e87
f068b802-732a-4bbd-b423-5cc9f404434f	e0a57db4-960d-4175-8466-7bdb16bb975d	756a8c0b-6b75-412a-a395-578a5f006654	1142fd19-453d-4fea-a6b1-80ba4c66588a
992cb4e3-ccc3-4c82-8172-3135e85e4099	ea64ffaf-8dea-40fa-b089-083931d21858	756a8c0b-6b75-412a-a395-578a5f006654	3e2eb13e-4291-4be5-9f89-9f1a72c716f2
992cb4e3-ccc3-4c82-8172-3135e85e4099	a8ac515d-8f56-4673-aa40-436d36a3622e	756a8c0b-6b75-412a-a395-578a5f006654	0cde9c25-3db8-4d26-b186-62510c84bcdb
4573aa15-33e0-46dc-bb32-20de8b68bd88	a8ac515d-8f56-4673-aa40-436d36a3622e	756a8c0b-6b75-412a-a395-578a5f006654	862e1d9c-2ce8-419d-9084-5f4747d11428
ea64ffaf-8dea-40fa-b089-083931d21858	4aa9136c-ce33-4290-90a0-327cf44f925d	756a8c0b-6b75-412a-a395-578a5f006654	3ccadd9c-a6df-4ee0-8b1f-b9654006ecef
6e79865e-cc81-4da7-9be0-8674932413b0	5bcadcd6-1639-461c-9d1b-a88a9615a030	756a8c0b-6b75-412a-a395-578a5f006654	17e1caf6-955b-4e59-958b-f7f906f52cb5
6e79865e-cc81-4da7-9be0-8674932413b0	7680246a-a1d5-40c7-9628-3a366c47a2c1	756a8c0b-6b75-412a-a395-578a5f006654	05e54d73-3b7f-4750-9ec2-735b2bdb3e4d
ac451175-aa47-4d8a-9dfd-2dbd35fdf2bd	f2a2663e-dedc-465d-ba79-f845235d4748	756a8c0b-6b75-412a-a395-578a5f006654	c8e1193b-6525-43a8-85ea-814e2ff4ee5b
ac451175-aa47-4d8a-9dfd-2dbd35fdf2bd	1beb584e-8cb0-41b3-90ad-b8fc51e4030e	756a8c0b-6b75-412a-a395-578a5f006654	a84411bc-e82f-496f-81cd-bdfbd993f5b3
c2eaf201-61ab-46dc-83c2-0cf0654553b1	7e903b3f-5ade-4990-be1b-d945891aa802	756a8c0b-6b75-412a-a395-578a5f006654	c585e369-2a78-4213-8ba1-3f8d128ece8c
c2eaf201-61ab-46dc-83c2-0cf0654553b1	b75309d2-b3aa-467e-9e85-8b9983feb9c2	756a8c0b-6b75-412a-a395-578a5f006654	f9473ff1-aaa2-4553-8e61-97a0b483f267
26005085-8938-47bd-8928-85df8e8afdb6	d760c6fb-9376-4551-94a0-4b16e85e96ac	756a8c0b-6b75-412a-a395-578a5f006654	47ae9f46-15a8-4e17-b4b8-0f2a0570ff96
26005085-8938-47bd-8928-85df8e8afdb6	38bfff68-291d-4221-8de6-3073a5b0082a	756a8c0b-6b75-412a-a395-578a5f006654	48ff42ca-e034-4c96-9913-f5fe7ac1e952
ddb2f771-f6e2-492a-81bd-d9c8af8fd15e	d760c6fb-9376-4551-94a0-4b16e85e96ac	756a8c0b-6b75-412a-a395-578a5f006654	47d54fdd-818d-4e88-aad3-4c5fb730aa50
ddb2f771-f6e2-492a-81bd-d9c8af8fd15e	38bfff68-291d-4221-8de6-3073a5b0082a	756a8c0b-6b75-412a-a395-578a5f006654	40891a93-a2da-4f57-a48f-359e998390fc
78529628-b5cf-4d05-a8c3-2f651fa56391	47b28ed9-edc3-4ce6-ae53-8b59b46db787	756a8c0b-6b75-412a-a395-578a5f006654	71622d46-fa67-4496-b1bf-456bac4818c1
78529628-b5cf-4d05-a8c3-2f651fa56391	cf8d67e7-054e-4400-b4ab-7cdb70f84154	756a8c0b-6b75-412a-a395-578a5f006654	df9d9080-60f5-4b24-bc16-db2c63fc4e7f
2ddefdce-7d00-4668-988c-53d24d79e056	78529628-b5cf-4d05-a8c3-2f651fa56391	756a8c0b-6b75-412a-a395-578a5f006654	a2e75c2e-0f73-4af2-9eb1-62c1d1d4f2d4
2ddefdce-7d00-4668-988c-53d24d79e056	948a8aa0-8386-4c0f-b715-8cd0c7609d6b	756a8c0b-6b75-412a-a395-578a5f006654	d26a86e2-7cce-48d5-a29a-3ec0c361843e
ee9aeef6-bb12-492d-8c65-4c6541a97e3c	47b28ed9-edc3-4ce6-ae53-8b59b46db787	756a8c0b-6b75-412a-a395-578a5f006654	7eaae723-0386-4cc6-9139-582db6f1e6a3
ee9aeef6-bb12-492d-8c65-4c6541a97e3c	cf8d67e7-054e-4400-b4ab-7cdb70f84154	756a8c0b-6b75-412a-a395-578a5f006654	aa97118c-9bf7-405c-9dd5-c2ad517c74af
74e65ead-4b87-4092-a9a8-29ac04ec5551	71e2652e-2255-4eba-8199-ca20e579cfe6	756a8c0b-6b75-412a-a395-578a5f006654	b1ab0868-b8be-4894-a535-dc21348ee91d
74e65ead-4b87-4092-a9a8-29ac04ec5551	19078d30-d5fe-4e39-8190-afbb41a35f28	756a8c0b-6b75-412a-a395-578a5f006654	6a116348-50f1-4955-83fa-665a6c357022
5084316b-bcab-4881-bc38-bd912acf71ea	71e2652e-2255-4eba-8199-ca20e579cfe6	756a8c0b-6b75-412a-a395-578a5f006654	8d9cd6d1-abc0-4c86-a0ee-80719d97adba
5084316b-bcab-4881-bc38-bd912acf71ea	19078d30-d5fe-4e39-8190-afbb41a35f28	756a8c0b-6b75-412a-a395-578a5f006654	973aa1c3-fb64-4873-a474-f67f72b74b17
05a62bbb-6fa4-46b0-ae14-4115937b9f5e	74e65ead-4b87-4092-a9a8-29ac04ec5551	756a8c0b-6b75-412a-a395-578a5f006654	20f7091e-4685-4fea-97f1-2c2c5c91ef1a
05a62bbb-6fa4-46b0-ae14-4115937b9f5e	14d640fb-761f-44a2-9868-164eb1a618e8	756a8c0b-6b75-412a-a395-578a5f006654	abbb6b2e-2b7d-4f8f-ae3b-f599f7100a53
1ba5fd05-db0c-4e0d-b89c-52eb728f6b9d	74e65ead-4b87-4092-a9a8-29ac04ec5551	756a8c0b-6b75-412a-a395-578a5f006654	14c41809-061d-442f-8aaf-a4fee47dcf82
1ba5fd05-db0c-4e0d-b89c-52eb728f6b9d	14d640fb-761f-44a2-9868-164eb1a618e8	756a8c0b-6b75-412a-a395-578a5f006654	d667a08f-85e3-471c-8c0a-c3cc02f9950d
2ae57613-1a15-432b-ab75-57dc566a8fed	05a62bbb-6fa4-46b0-ae14-4115937b9f5e	756a8c0b-6b75-412a-a395-578a5f006654	045ca647-9117-4464-8d99-9cbea0080653
2ae57613-1a15-432b-ab75-57dc566a8fed	0dc49010-17d4-493d-9853-1d19927f10ac	756a8c0b-6b75-412a-a395-578a5f006654	a6e32b62-564e-456f-b859-131d318fb610
27a4a371-45e1-45f2-acf2-d5fbd36e32f4	2ae57613-1a15-432b-ab75-57dc566a8fed	756a8c0b-6b75-412a-a395-578a5f006654	2675b98f-3b55-4e2e-a78e-f2c7be7a60a1
27a4a371-45e1-45f2-acf2-d5fbd36e32f4	48aa1ba9-fc92-4b3f-859b-f3284e35436e	756a8c0b-6b75-412a-a395-578a5f006654	b1cd90d1-4d5f-43ef-9a9f-83df6cdff35e
b06f48da-8761-4eab-92d5-37fccad058fd	27a4a371-45e1-45f2-acf2-d5fbd36e32f4	756a8c0b-6b75-412a-a395-578a5f006654	37527ccb-4241-43cc-964d-67f2163fdacc
b06f48da-8761-4eab-92d5-37fccad058fd	ca088a1a-8fcd-430f-b3c9-7ba6446477a8	756a8c0b-6b75-412a-a395-578a5f006654	11d4c97c-fa66-41b2-b7e7-18774c679e08
bea58ad5-ee6e-4b88-9548-c38578f0dd7d	27a4a371-45e1-45f2-acf2-d5fbd36e32f4	756a8c0b-6b75-412a-a395-578a5f006654	330ca173-25db-43bd-88e8-8ab1b170a73e
bea58ad5-ee6e-4b88-9548-c38578f0dd7d	ca088a1a-8fcd-430f-b3c9-7ba6446477a8	756a8c0b-6b75-412a-a395-578a5f006654	ac01cd76-b054-4a91-92d2-968a0a91d3be
518bd02d-52c9-4d20-bcca-bee6233665a8	27a4a371-45e1-45f2-acf2-d5fbd36e32f4	756a8c0b-6b75-412a-a395-578a5f006654	e4fd4959-d135-4abe-b4a8-035747f01b96
518bd02d-52c9-4d20-bcca-bee6233665a8	ca088a1a-8fcd-430f-b3c9-7ba6446477a8	756a8c0b-6b75-412a-a395-578a5f006654	5781bc1c-e574-410e-bac3-0004dfc34795
e5bad67a-1212-4999-80a8-0e3f267f3246	fda0bcb5-a0eb-42a7-a0cd-4c7d85dba6b3	756a8c0b-6b75-412a-a395-578a5f006654	8dac6444-b42c-4eab-842b-75d8fdfa6099
e5bad67a-1212-4999-80a8-0e3f267f3246	b06f48da-8761-4eab-92d5-37fccad058fd	756a8c0b-6b75-412a-a395-578a5f006654	d064cf57-1956-4009-908c-4e4f7bfac0a5
abcfe56e-d89b-47b5-a248-d58a2a9ddf7a	b06f48da-8761-4eab-92d5-37fccad058fd	756a8c0b-6b75-412a-a395-578a5f006654	0ab866c0-4b40-4d3d-8822-a5b257e22526
abcfe56e-d89b-47b5-a248-d58a2a9ddf7a	fda0bcb5-a0eb-42a7-a0cd-4c7d85dba6b3	756a8c0b-6b75-412a-a395-578a5f006654	549ffc74-813d-450c-aefc-74c7706d5a04
f183375b-c3ac-40a7-a72a-fee05a008267	a14e372a-dac3-44f9-9c3a-7e0b4419db2c	756a8c0b-6b75-412a-a395-578a5f006654	e4e28746-ef58-432c-a882-11e94133cf32
f183375b-c3ac-40a7-a72a-fee05a008267	e5bad67a-1212-4999-80a8-0e3f267f3246	756a8c0b-6b75-412a-a395-578a5f006654	28fc6136-eafa-4146-bd86-0b3d43301d60
f3d7e4b2-ade4-4da4-83ad-2f007746395a	e5bad67a-1212-4999-80a8-0e3f267f3246	756a8c0b-6b75-412a-a395-578a5f006654	9e7b7f5f-e10d-40f1-b54b-1c57f726062b
f3d7e4b2-ade4-4da4-83ad-2f007746395a	a14e372a-dac3-44f9-9c3a-7e0b4419db2c	756a8c0b-6b75-412a-a395-578a5f006654	e8212d33-dc1d-4324-8044-d9322864a3b3
ae44fc3e-571d-4c58-a028-5183f94815f6	a14e372a-dac3-44f9-9c3a-7e0b4419db2c	756a8c0b-6b75-412a-a395-578a5f006654	5b29ed1e-67a9-4bf4-932e-21f3bdc0e6c5
ae44fc3e-571d-4c58-a028-5183f94815f6	e5bad67a-1212-4999-80a8-0e3f267f3246	756a8c0b-6b75-412a-a395-578a5f006654	793c59dd-fa32-446f-b9da-41c7197f0575
71e2652e-2255-4eba-8199-ca20e579cfe6	52df46d6-8765-44e5-91c0-bc873903b914	756a8c0b-6b75-412a-a395-578a5f006654	c04c59e1-720f-4cb1-979e-6def4562a969
71e2652e-2255-4eba-8199-ca20e579cfe6	af42cb03-c6fb-40c0-87c7-d12901b630d4	756a8c0b-6b75-412a-a395-578a5f006654	f1ab52bd-eafa-4da8-a4b2-94d09d20b32f
52df46d6-8765-44e5-91c0-bc873903b914	43855f00-564a-4d7c-873d-b4260954b14d	756a8c0b-6b75-412a-a395-578a5f006654	876fc734-876f-4c50-8b11-103cdd294cc8
52df46d6-8765-44e5-91c0-bc873903b914	1feca789-8251-4766-9c7b-e7e1fe6cc004	756a8c0b-6b75-412a-a395-578a5f006654	e77fa04b-fc5a-4aa0-91ad-d1f43f62d9ee
5cc32e0d-2ec1-460e-87b0-9bf6e3ee6ea0	52df46d6-8765-44e5-91c0-bc873903b914	756a8c0b-6b75-412a-a395-578a5f006654	b8fdec3d-d4d2-4437-ba5e-ca6ee8a32e02
5cc32e0d-2ec1-460e-87b0-9bf6e3ee6ea0	af42cb03-c6fb-40c0-87c7-d12901b630d4	756a8c0b-6b75-412a-a395-578a5f006654	2ea2a2bf-4ff6-4069-989d-4e116a12e8f2
43855f00-564a-4d7c-873d-b4260954b14d	47b28ed9-edc3-4ce6-ae53-8b59b46db787	756a8c0b-6b75-412a-a395-578a5f006654	da2ae7e6-ff76-4fd9-a897-85f5b0913d25
47b28ed9-edc3-4ce6-ae53-8b59b46db787	a316698a-b376-4d07-acec-1c4fa859b3e5	756a8c0b-6b75-412a-a395-578a5f006654	a1b16102-0f28-4f75-a06f-44dc3ccaf2ac
47b28ed9-edc3-4ce6-ae53-8b59b46db787	0632b05b-b6ca-4cb6-95d3-269b3822336c	756a8c0b-6b75-412a-a395-578a5f006654	9ab1a77b-bb39-48fd-80c6-97a3023a53a6
6881540b-9f07-43af-931b-7afdf5bb1e36	26005085-8938-47bd-8928-85df8e8afdb6	756a8c0b-6b75-412a-a395-578a5f006654	04ea4a1e-9384-4bb5-a3eb-8cfe03a520a7
a316698a-b376-4d07-acec-1c4fa859b3e5	6881540b-9f07-43af-931b-7afdf5bb1e36	756a8c0b-6b75-412a-a395-578a5f006654	55857c58-e50d-450a-99b8-acf9a17376ef
115322e3-8301-4ba3-876b-9a9f51e20edc	6881540b-9f07-43af-931b-7afdf5bb1e36	756a8c0b-6b75-412a-a395-578a5f006654	845a299f-16c7-4802-8637-ce8d2160af68
0f916460-8c32-443c-912a-842207838174	26005085-8938-47bd-8928-85df8e8afdb6	756a8c0b-6b75-412a-a395-578a5f006654	f4b149e0-7cef-42b4-b023-c81716804d4f
d760c6fb-9376-4551-94a0-4b16e85e96ac	f6b6c4c3-31a3-4a7d-8376-82319f31c4c8	756a8c0b-6b75-412a-a395-578a5f006654	ec5970ac-febd-481e-ae27-41162cb5d1ef
d760c6fb-9376-4551-94a0-4b16e85e96ac	d4253843-b4b2-4136-a25d-e6fccb7cc72a	756a8c0b-6b75-412a-a395-578a5f006654	e30907e8-8db1-42e0-846f-715f9da5a679
f6b6c4c3-31a3-4a7d-8376-82319f31c4c8	90f10a2e-fb73-4830-8306-41f5e2b0d612	756a8c0b-6b75-412a-a395-578a5f006654	6ce3683c-5a04-442a-8e0a-10b2a00a9343
f6b6c4c3-31a3-4a7d-8376-82319f31c4c8	4b409c17-b35c-4c94-a5c6-c5f996589eb9	756a8c0b-6b75-412a-a395-578a5f006654	edf3a802-912c-4340-8615-72e1864b6387
90f10a2e-fb73-4830-8306-41f5e2b0d612	f7b9f2e6-60eb-401b-ab89-195b41835a5f	756a8c0b-6b75-412a-a395-578a5f006654	5b4bccec-2ba9-4716-9647-6f6a2d7c0495
90f10a2e-fb73-4830-8306-41f5e2b0d612	7638c01b-b48e-435e-8103-a35c4d08a4b3	756a8c0b-6b75-412a-a395-578a5f006654	5cf6201b-3ae2-4dda-8a92-adabed0265ae
f03fb0cd-5640-4a78-a029-1d9c2ffa7a84	f7b9f2e6-60eb-401b-ab89-195b41835a5f	756a8c0b-6b75-412a-a395-578a5f006654	6355b32a-f72e-4452-be02-9494bc00c153
f03fb0cd-5640-4a78-a029-1d9c2ffa7a84	7638c01b-b48e-435e-8103-a35c4d08a4b3	756a8c0b-6b75-412a-a395-578a5f006654	00a8c4e6-feb5-4b3f-9972-eeed72015206
f7b9f2e6-60eb-401b-ab89-195b41835a5f	c2eaf201-61ab-46dc-83c2-0cf0654553b1	756a8c0b-6b75-412a-a395-578a5f006654	56df8fdb-7359-4c9e-a790-5b5230ba2be9
f7b9f2e6-60eb-401b-ab89-195b41835a5f	fdfd317b-451e-4600-a9af-cf648f9500dc	756a8c0b-6b75-412a-a395-578a5f006654	7d4076e8-bc1b-4870-b416-8bae3eb3d6a7
b62fe6c0-0e2f-46a9-85d6-8b2223ec403e	c2eaf201-61ab-46dc-83c2-0cf0654553b1	756a8c0b-6b75-412a-a395-578a5f006654	77388cf8-b8b1-4ef7-bd30-21e1ca761a03
b62fe6c0-0e2f-46a9-85d6-8b2223ec403e	fdfd317b-451e-4600-a9af-cf648f9500dc	756a8c0b-6b75-412a-a395-578a5f006654	0db18939-151f-4470-994d-5655d5db3697
f2a2663e-dedc-465d-ba79-f845235d4748	6e79865e-cc81-4da7-9be0-8674932413b0	756a8c0b-6b75-412a-a395-578a5f006654	ef7d9c43-6baa-40d9-97b5-47bda992a31d
f2a2663e-dedc-465d-ba79-f845235d4748	715b3d8a-9faf-46b6-ab1b-bf1138bc7134	756a8c0b-6b75-412a-a395-578a5f006654	f9bf9d20-7251-4b2f-991f-119f76ef1d38
b5ca043c-f6c0-4224-b772-ad0fe1c84f21	ac451175-aa47-4d8a-9dfd-2dbd35fdf2bd	756a8c0b-6b75-412a-a395-578a5f006654	be74e634-59a4-4b9e-8121-92c7e95e6da4
b5ca043c-f6c0-4224-b772-ad0fe1c84f21	fa75b650-b6ab-4763-a86e-a16e25ecd5af	756a8c0b-6b75-412a-a395-578a5f006654	cee85673-d7c3-4d86-9d40-be5e625a8516
d2006ddc-4d99-4dfd-a55d-b425410243e4	b5ca043c-f6c0-4224-b772-ad0fe1c84f21	756a8c0b-6b75-412a-a395-578a5f006654	601e1af2-bf7c-43fc-ad8e-48f48cb14a5b
65a03f79-1467-49e4-b5d6-be4f297426fa	ac451175-aa47-4d8a-9dfd-2dbd35fdf2bd	756a8c0b-6b75-412a-a395-578a5f006654	83770e2c-8c55-4e89-85a2-736f935592e7
65a03f79-1467-49e4-b5d6-be4f297426fa	fa75b650-b6ab-4763-a86e-a16e25ecd5af	756a8c0b-6b75-412a-a395-578a5f006654	17ecef0a-6470-49ce-bda2-5128722b9dd8
b75309d2-b3aa-467e-9e85-8b9983feb9c2	d2006ddc-4d99-4dfd-a55d-b425410243e4	756a8c0b-6b75-412a-a395-578a5f006654	6626c018-f1f4-418d-94a1-b088db1691cb
8611ab61-310c-4c11-80d9-53e814012d6f	d2006ddc-4d99-4dfd-a55d-b425410243e4	756a8c0b-6b75-412a-a395-578a5f006654	0a65ff1c-d36a-475f-ad4c-e2edae1bb1fb
eff224bc-c8ab-46f1-844c-9df1d28609d2	d2006ddc-4d99-4dfd-a55d-b425410243e4	756a8c0b-6b75-412a-a395-578a5f006654	91f6ef54-43a6-4ed5-b21d-86be14f3240d
3cfb4abf-2ead-466d-88ca-4761ecdbeda0	d2006ddc-4d99-4dfd-a55d-b425410243e4	756a8c0b-6b75-412a-a395-578a5f006654	73cdf038-12c3-443b-8198-9d224030a937
22fcff15-630a-4fe7-8aa9-893f52e13b74	0f916460-8c32-443c-912a-842207838174	756a8c0b-6b75-412a-a395-578a5f006654	f625f522-7942-4af0-89bd-f91f6a02c5e5
22fcff15-630a-4fe7-8aa9-893f52e13b74	551bd74b-964d-4c9e-98f3-6ccce8724046	756a8c0b-6b75-412a-a395-578a5f006654	d9a83b6a-8c60-4070-b7e9-b3c5eec93762
f9b13f77-6319-4225-9910-2b6a64652fb6	3384123d-7dc1-4728-a320-1ffb905b7d98	756a8c0b-6b75-412a-a395-578a5f006654	3758d21c-3ab7-4113-9120-195e42ffec30
f9b13f77-6319-4225-9910-2b6a64652fb6	22fcff15-630a-4fe7-8aa9-893f52e13b74	756a8c0b-6b75-412a-a395-578a5f006654	e6b1e599-5eba-4b7c-b9d5-49079783d30a
3b84aabb-8086-419a-88a1-fa6991150583	f9671ab8-4d1c-4d45-8b3c-5eb9ebe723dc	756a8c0b-6b75-412a-a395-578a5f006654	ed833799-16a8-400b-a54b-a12076ff776b
3b84aabb-8086-419a-88a1-fa6991150583	f9b13f77-6319-4225-9910-2b6a64652fb6	756a8c0b-6b75-412a-a395-578a5f006654	ec4766ed-ffa7-4e93-9079-b987a699bbfd
a4863ad6-985a-46e3-aeaf-5ce290375c25	f9671ab8-4d1c-4d45-8b3c-5eb9ebe723dc	756a8c0b-6b75-412a-a395-578a5f006654	5d469876-34bc-458e-b96f-eac357ce79a9
a4863ad6-985a-46e3-aeaf-5ce290375c25	f9b13f77-6319-4225-9910-2b6a64652fb6	756a8c0b-6b75-412a-a395-578a5f006654	9233fe03-5e54-479c-ab9d-e8f5c87d0a5f
4c41a048-adec-4ec4-8b52-b976eb3be723	3384123d-7dc1-4728-a320-1ffb905b7d98	756a8c0b-6b75-412a-a395-578a5f006654	6066a03f-9365-459c-81c6-1abb40db579c
4c41a048-adec-4ec4-8b52-b976eb3be723	22fcff15-630a-4fe7-8aa9-893f52e13b74	756a8c0b-6b75-412a-a395-578a5f006654	ee3d5bbb-e918-4e61-9d73-6b83b78e1e4b
86c5a4ec-a058-4c91-8937-cc71f0f7af77	3384123d-7dc1-4728-a320-1ffb905b7d98	756a8c0b-6b75-412a-a395-578a5f006654	5d2a3d0a-c035-4946-981b-4263efebe373
86c5a4ec-a058-4c91-8937-cc71f0f7af77	22fcff15-630a-4fe7-8aa9-893f52e13b74	756a8c0b-6b75-412a-a395-578a5f006654	07c01a46-6586-4186-8f84-749958fb55d6
423e057a-c207-4b91-9521-a00b0f89ee4f	4c41a048-adec-4ec4-8b52-b976eb3be723	756a8c0b-6b75-412a-a395-578a5f006654	2236936b-1aa7-49a2-92e8-0163c2968b2c
423e057a-c207-4b91-9521-a00b0f89ee4f	7b6c828c-8d97-48be-a237-d1e0611aa6a4	756a8c0b-6b75-412a-a395-578a5f006654	7768faee-e43a-412a-a992-817039a64f13
5c191811-99dd-4487-aae1-5eab69c35358	7b6c828c-8d97-48be-a237-d1e0611aa6a4	756a8c0b-6b75-412a-a395-578a5f006654	ba528e37-5a2b-4b85-a0ff-cd770c6469a6
5c191811-99dd-4487-aae1-5eab69c35358	4c41a048-adec-4ec4-8b52-b976eb3be723	756a8c0b-6b75-412a-a395-578a5f006654	00a6c1f0-6af2-4a05-9415-6945053a1174
a2e6e181-0843-428e-9610-14d7ac80f6e4	ddb2f771-f6e2-492a-81bd-d9c8af8fd15e	756a8c0b-6b75-412a-a395-578a5f006654	e85b66fc-ff7e-405c-affd-06b217e13561
3cf1a90e-7475-419a-9290-2e8d727432c9	a2e6e181-0843-428e-9610-14d7ac80f6e4	756a8c0b-6b75-412a-a395-578a5f006654	7f5de33b-99e1-4a58-a7e1-5adaec0fc746
3cf1a90e-7475-419a-9290-2e8d727432c9	2a6fa77a-79fc-41b7-a6d2-77dc5c8706be	756a8c0b-6b75-412a-a395-578a5f006654	55a4170f-dbb0-4686-849c-26d6b83dac4d
9aa07364-9dd2-4227-a62e-998e792e4b8a	a2e6e181-0843-428e-9610-14d7ac80f6e4	756a8c0b-6b75-412a-a395-578a5f006654	12f6c16b-9a12-42c7-8db8-94ea3e45a0d5
9aa07364-9dd2-4227-a62e-998e792e4b8a	2a6fa77a-79fc-41b7-a6d2-77dc5c8706be	756a8c0b-6b75-412a-a395-578a5f006654	42f45a6a-fc54-443c-8668-b8b8ea1941bd
c69ecc10-7730-4d55-aa95-c4c2cd65617a	ee9aeef6-bb12-492d-8c65-4c6541a97e3c	756a8c0b-6b75-412a-a395-578a5f006654	f0d1a4b5-18a6-4ca9-9a6e-e9d6057d79dc
c69ecc10-7730-4d55-aa95-c4c2cd65617a	db31376a-f4ea-49af-a494-32b6efa38001	756a8c0b-6b75-412a-a395-578a5f006654	fb7083cb-11f7-4724-b2bc-0519f5e64f76
e962a0e7-3467-4abd-9167-fd35508c99aa	ee9aeef6-bb12-492d-8c65-4c6541a97e3c	756a8c0b-6b75-412a-a395-578a5f006654	409df67c-efb4-4ca5-88f9-5ac9dcaf7130
e962a0e7-3467-4abd-9167-fd35508c99aa	db31376a-f4ea-49af-a494-32b6efa38001	756a8c0b-6b75-412a-a395-578a5f006654	43e64a58-3a1b-46ac-b4e4-baddc3d6eca3
9db21149-f9c2-4817-b501-b7a35def7c42	ee9aeef6-bb12-492d-8c65-4c6541a97e3c	756a8c0b-6b75-412a-a395-578a5f006654	5a1ac9d1-5d0a-48b5-b8fa-6a4401fcb3f3
9db21149-f9c2-4817-b501-b7a35def7c42	db31376a-f4ea-49af-a494-32b6efa38001	756a8c0b-6b75-412a-a395-578a5f006654	9b27ebf6-32dd-4d70-b73c-553745fdfe2f
6a314fe0-050b-4e56-a4d7-689120560568	ee9aeef6-bb12-492d-8c65-4c6541a97e3c	756a8c0b-6b75-412a-a395-578a5f006654	34a5f02b-32fe-4be0-b510-7ae77ad1c81b
6a314fe0-050b-4e56-a4d7-689120560568	db31376a-f4ea-49af-a494-32b6efa38001	756a8c0b-6b75-412a-a395-578a5f006654	63ff724b-9255-4003-bd1c-b6fc3d1f9c66
65b58ba7-5dab-4f61-9bf5-3bddadbbe8be	ee9aeef6-bb12-492d-8c65-4c6541a97e3c	756a8c0b-6b75-412a-a395-578a5f006654	4b77c31c-7f9a-4a9f-9e84-ac086843a0d8
65b58ba7-5dab-4f61-9bf5-3bddadbbe8be	db31376a-f4ea-49af-a494-32b6efa38001	756a8c0b-6b75-412a-a395-578a5f006654	f5ec6052-f4da-4b14-bacf-6050727a2e43
32be8979-fe27-4c3f-9a08-8acec68b5439	ee9aeef6-bb12-492d-8c65-4c6541a97e3c	756a8c0b-6b75-412a-a395-578a5f006654	8266522f-2e2a-4539-954b-5614d25ae95b
32be8979-fe27-4c3f-9a08-8acec68b5439	db31376a-f4ea-49af-a494-32b6efa38001	756a8c0b-6b75-412a-a395-578a5f006654	c08bbad5-ffa9-46e2-9e1a-0c224b3e2355
9d6c5ab5-9b67-4153-a75c-ae73efa4fcdc	1ba5fd05-db0c-4e0d-b89c-52eb728f6b9d	756a8c0b-6b75-412a-a395-578a5f006654	2d07e67d-0ec7-4507-81b6-6e5ffca0624c
0963a01c-c27f-4d9f-baf1-c5ec5219db98	2837d3a8-a626-49c3-9ede-03af36f9e490	756a8c0b-6b75-412a-a395-578a5f006654	0362fd59-9f96-49df-83db-1e033f6def6d
80128878-7e33-49a5-80ae-024a0719da19	2837d3a8-a626-49c3-9ede-03af36f9e490	756a8c0b-6b75-412a-a395-578a5f006654	fd78c0cc-28e5-416c-b007-302607969efb
88bed265-2b87-41b0-839c-86195b193be0	d93f996f-ee86-4e7e-82c1-1ddf49bcb044	756a8c0b-6b75-412a-a395-578a5f006654	5c63462f-bb54-42e0-9557-f5dfbdecc345
88bed265-2b87-41b0-839c-86195b193be0	de9254e6-c737-4460-9121-011550b0a6c5	756a8c0b-6b75-412a-a395-578a5f006654	5cd33d84-b45c-4efe-b3c5-553a2403b6a7
55c882ad-8311-4e43-96b7-e995928f73dc	5bcadcd6-1639-461c-9d1b-a88a9615a030	756a8c0b-6b75-412a-a395-578a5f006654	7208114a-5d20-42a9-b6fb-c754de48ac77
55c882ad-8311-4e43-96b7-e995928f73dc	7680246a-a1d5-40c7-9628-3a366c47a2c1	756a8c0b-6b75-412a-a395-578a5f006654	def58700-adcc-482c-92ef-86fe5e6c84f4
c5fc22dc-9451-4d2d-b563-2d2bf9bb4193	55c882ad-8311-4e43-96b7-e995928f73dc	756a8c0b-6b75-412a-a395-578a5f006654	c683bb23-f5d1-44df-aeda-8127f365f13a
77a419bb-fe76-424c-88db-cac29199f0d6	55c882ad-8311-4e43-96b7-e995928f73dc	756a8c0b-6b75-412a-a395-578a5f006654	75c1f737-1a24-48ca-a8b4-a8c30bb451f3
eae334ab-dbf6-47b2-916a-95c77902723b	92672947-0693-480e-b64e-0aef04cf1f50	756a8c0b-6b75-412a-a395-578a5f006654	9a19f667-9fd9-457c-bc1c-17e3b21ce59b
eae334ab-dbf6-47b2-916a-95c77902723b	0996efd2-e65c-454e-ba59-d33569b7e648	756a8c0b-6b75-412a-a395-578a5f006654	30690ba4-b9d5-4d99-bde9-512243dd7ab3
6053d298-c0f6-431f-8e7e-c1aec7924c88	7f30a6e6-af28-47d9-9ac6-5e39fa80472c	756a8c0b-6b75-412a-a395-578a5f006654	4e198dcf-7243-4e25-b9c8-342f941a3aa5
eae334ab-dbf6-47b2-916a-95c77902723b	b8569e15-dae4-484f-8ce5-d76ecebff7bd	1535197c-b620-492e-bbf5-41a65124bab9	1dbf73af-121e-4bc1-974a-c3e876f31467
3c9ef747-bf4c-44ff-8a71-6648fc1c8642	a50a4981-40e4-44ae-82ff-27b6c4077ac2	98dcaa48-cf32-474c-8d37-a46f88c94ddb	8ede8224-f638-4fd8-b621-dade21e7fb28
3c9ef747-bf4c-44ff-8a71-6648fc1c8642	5bc05aaa-cae5-40ac-b780-54929639f310	98dcaa48-cf32-474c-8d37-a46f88c94ddb	48d16707-8701-4672-8356-e7e28453f831
7296e38f-f51b-4357-bfb0-f82a737b662a	a50a4981-40e4-44ae-82ff-27b6c4077ac2	98dcaa48-cf32-474c-8d37-a46f88c94ddb	75c07a25-700d-4a30-8d57-ed68759f8db6
7296e38f-f51b-4357-bfb0-f82a737b662a	5bc05aaa-cae5-40ac-b780-54929639f310	98dcaa48-cf32-474c-8d37-a46f88c94ddb	4a5c0400-2c47-40ec-bb5e-fbbef7452efe
474d03c5-18a1-4e0e-a298-9e479fe64df6	56abc767-1971-43fb-a08e-878aaab783b1	98dcaa48-cf32-474c-8d37-a46f88c94ddb	a5170334-d709-40b4-b30f-424a823eb8ac
9a68e881-000e-4de6-9408-7b3ff632f9ad	5bc05aaa-cae5-40ac-b780-54929639f310	98dcaa48-cf32-474c-8d37-a46f88c94ddb	8a86ff52-0918-498c-bdf0-9597197b79ca
64aaa1af-aae7-40b4-95fd-316cbd2c349b	5bc05aaa-cae5-40ac-b780-54929639f310	98dcaa48-cf32-474c-8d37-a46f88c94ddb	d37b9b14-ded8-4e04-baae-c0258d67c77e
3dc7880d-a137-4e9a-9f3f-a55023b63f9c	5bc05aaa-cae5-40ac-b780-54929639f310	98dcaa48-cf32-474c-8d37-a46f88c94ddb	c12d72b7-c391-46f2-93eb-e4c6ee2144c7
9a68e881-000e-4de6-9408-7b3ff632f9ad	a50a4981-40e4-44ae-82ff-27b6c4077ac2	98dcaa48-cf32-474c-8d37-a46f88c94ddb	7fd8b775-6f62-4d19-a3da-ecf8f6869a62
3dc7880d-a137-4e9a-9f3f-a55023b63f9c	a50a4981-40e4-44ae-82ff-27b6c4077ac2	98dcaa48-cf32-474c-8d37-a46f88c94ddb	6c7e2054-b36d-49e1-b5dd-87401bee415d
64aaa1af-aae7-40b4-95fd-316cbd2c349b	a50a4981-40e4-44ae-82ff-27b6c4077ac2	98dcaa48-cf32-474c-8d37-a46f88c94ddb	3e93a963-08c7-4763-9c73-eae24b5d1cdb
b184a4d0-6b5d-4672-8343-0dda42f129ed	56abc767-1971-43fb-a08e-878aaab783b1	98dcaa48-cf32-474c-8d37-a46f88c94ddb	f442139d-cc67-49a5-ab79-979af29073bb
796c16ad-9145-4ffc-a762-19f517ba0e4d	56abc767-1971-43fb-a08e-878aaab783b1	98dcaa48-cf32-474c-8d37-a46f88c94ddb	f967cd4a-4ce1-44f9-9f57-fece3c007674
474d03c5-18a1-4e0e-a298-9e479fe64df6	51622f08-c61f-4c22-8258-e2dd5b9c10f5	98dcaa48-cf32-474c-8d37-a46f88c94ddb	a76d4dd7-c8b8-4f9e-bc1d-b014f886e55d
b184a4d0-6b5d-4672-8343-0dda42f129ed	51622f08-c61f-4c22-8258-e2dd5b9c10f5	98dcaa48-cf32-474c-8d37-a46f88c94ddb	4d46f00e-3fd6-41bd-9e5c-660fd7a9e51c
796c16ad-9145-4ffc-a762-19f517ba0e4d	51622f08-c61f-4c22-8258-e2dd5b9c10f5	98dcaa48-cf32-474c-8d37-a46f88c94ddb	979fad60-59ec-47b4-a6b5-9609bc25eb52
5bc05aaa-cae5-40ac-b780-54929639f310	35f92ae8-889c-4f94-80a7-be21f444823d	98dcaa48-cf32-474c-8d37-a46f88c94ddb	1882400a-3aaa-480e-957e-cea7b6e72b5d
719a9ed5-849f-46d1-80c8-5a45b7513b53	35f92ae8-889c-4f94-80a7-be21f444823d	98dcaa48-cf32-474c-8d37-a46f88c94ddb	dd382ce2-29dc-4f56-a01b-5491cf5656b2
18edfff6-5e09-4028-8085-96aeacf96280	35f92ae8-889c-4f94-80a7-be21f444823d	98dcaa48-cf32-474c-8d37-a46f88c94ddb	09602449-80d3-496d-955d-9e8293172eb5
db26d940-9cb1-475b-ba46-53d108d9479a	8ba83857-85b7-4d26-8918-3a92b6e6069e	98dcaa48-cf32-474c-8d37-a46f88c94ddb	be91f207-7c6c-4b8f-8cec-f1e62b5513ba
db26d940-9cb1-475b-ba46-53d108d9479a	719a9ed5-849f-46d1-80c8-5a45b7513b53	98dcaa48-cf32-474c-8d37-a46f88c94ddb	ef6cadaa-45c4-4102-9797-e91588fa2b78
334f3518-9237-41a9-8d2d-b005d25aa13b	a9d3a726-203f-4dd6-ad59-36793c483d91	98dcaa48-cf32-474c-8d37-a46f88c94ddb	b4315acb-26c4-4103-a889-d87b0072bff4
85e203a8-a394-4067-8fa1-b94c34e2691e	334f3518-9237-41a9-8d2d-b005d25aa13b	98dcaa48-cf32-474c-8d37-a46f88c94ddb	b35dce22-b16a-4e6d-a046-7b64566d387d
1d9aa594-c04d-4c38-937c-0323be8162e4	334f3518-9237-41a9-8d2d-b005d25aa13b	98dcaa48-cf32-474c-8d37-a46f88c94ddb	c0156cf2-2903-4231-a497-0ccecbc159a9
c74d538a-212e-4e59-9f3e-eb5a70f9fd93	dc7d21d1-0a0d-4e4a-aaaa-d970c7da3825	98dcaa48-cf32-474c-8d37-a46f88c94ddb	eb381440-a62b-4e75-afd2-b5e6adb4825c
ced1866a-f8e3-470f-aa6a-f94c6d2374bc	474d03c5-18a1-4e0e-a298-9e479fe64df6	98dcaa48-cf32-474c-8d37-a46f88c94ddb	5d2f59cf-72fd-4765-b13b-3f0a9ad3a788
ced1866a-f8e3-470f-aa6a-f94c6d2374bc	b184a4d0-6b5d-4672-8343-0dda42f129ed	98dcaa48-cf32-474c-8d37-a46f88c94ddb	9d5e61ac-137b-4d31-94da-c5e02632d3eb
e273762b-0b47-44fa-a942-694461d12565	2eccad6c-c292-43fa-8cb3-9f5c241b53ea	98dcaa48-cf32-474c-8d37-a46f88c94ddb	0048c37c-cfac-4035-8e9a-987894a56166
d0506f08-8bad-4924-b75d-26888a3bceaa	2eccad6c-c292-43fa-8cb3-9f5c241b53ea	98dcaa48-cf32-474c-8d37-a46f88c94ddb	6d0662ea-4f7e-4513-9de6-32540b7e42b4
bb3c5c51-c52d-4ce2-9c63-42d9cef75a3d	2eccad6c-c292-43fa-8cb3-9f5c241b53ea	98dcaa48-cf32-474c-8d37-a46f88c94ddb	061a3c89-3761-4e30-ae5b-0e7f158ee8b5
aef4bc03-5e7f-44fa-b102-e53135db421a	98655876-fa94-4fe1-b139-5497c323c280	98dcaa48-cf32-474c-8d37-a46f88c94ddb	a9c0fc71-b1ef-48c8-81e2-3e62ca9efe47
aef4bc03-5e7f-44fa-b102-e53135db421a	a50a4981-40e4-44ae-82ff-27b6c4077ac2	98dcaa48-cf32-474c-8d37-a46f88c94ddb	a89337d8-c352-4201-b452-b22bce98dc08
01815aa3-06d4-45ec-aeb7-a91ed879f3bb	5f874844-c636-460f-bf39-134faa548624	aa925890-316b-44a7-aec8-2d379d6b24ad	bda3a008-34df-4e9c-840a-d42f1941b79c
565e7175-64d0-4cab-85b2-c88d7adc966f	01815aa3-06d4-45ec-aeb7-a91ed879f3bb	aa925890-316b-44a7-aec8-2d379d6b24ad	6d749f3e-a8db-40fb-bf72-dbf215eecee4
9d10a90f-76bc-41b3-ad15-48e943af147b	01815aa3-06d4-45ec-aeb7-a91ed879f3bb	aa925890-316b-44a7-aec8-2d379d6b24ad	380fd89c-4860-4a39-a97b-b13efc98aaf1
8c79d399-96f6-469e-9948-ad3baa8ce483	01815aa3-06d4-45ec-aeb7-a91ed879f3bb	aa925890-316b-44a7-aec8-2d379d6b24ad	6476616a-2bd3-4b01-a226-bb6683790ac3
80567cab-aa4b-4a7c-8d02-9f31709a66ff	01815aa3-06d4-45ec-aeb7-a91ed879f3bb	aa925890-316b-44a7-aec8-2d379d6b24ad	a31a5f4f-5635-45b4-8b07-19a7688d1be7
eae334ab-dbf6-47b2-916a-95c77902723b	a40c1aaa-a3b3-40a8-94d2-0826a52b5281	1535197c-b620-492e-bbf5-41a65124bab9	db90f480-b8cd-4057-8771-92bab3a633ee
f1b90b1a-9e3f-419e-bd92-162bbf01845c	72627abe-3988-41ab-80fd-e56e58642101	46a56c10-ca29-410a-b939-8bffcfff61e9	ffe3a067-f793-4280-97a8-7f324d9e7e10
fb1962c6-b829-4edc-b8f3-a66a909a1934	75cf0640-2d57-4eb5-8340-7bd816551733	46a56c10-ca29-410a-b939-8bffcfff61e9	13a8a2b9-a444-433b-97e4-171b228d003b
806c2666-004b-4356-af39-ed8b1c570769	75cf0640-2d57-4eb5-8340-7bd816551733	46a56c10-ca29-410a-b939-8bffcfff61e9	c7d63b07-1f3e-4208-823c-da210120ff9a
72627abe-3988-41ab-80fd-e56e58642101	75cf0640-2d57-4eb5-8340-7bd816551733	46a56c10-ca29-410a-b939-8bffcfff61e9	35ddef94-49ea-410e-ab65-ed4c20ed9e68
247a295c-4c35-4381-a0f5-c6416cd40203	75cf0640-2d57-4eb5-8340-7bd816551733	46a56c10-ca29-410a-b939-8bffcfff61e9	da915c75-b75b-4018-bed4-99e7d20cad8c
c677283d-0b6b-4f78-99ce-efbe1c706053	75cf0640-2d57-4eb5-8340-7bd816551733	46a56c10-ca29-410a-b939-8bffcfff61e9	299afd5b-6342-468a-a524-179858740b56
b5b89d35-6cc0-4d6c-a8b1-66f463ab335a	75cf0640-2d57-4eb5-8340-7bd816551733	46a56c10-ca29-410a-b939-8bffcfff61e9	7c146376-5923-49b8-aec1-f3216d12b8b6
ab4d5708-4598-4caa-aa54-4317a57ad15e	75cf0640-2d57-4eb5-8340-7bd816551733	46a56c10-ca29-410a-b939-8bffcfff61e9	9d0cd162-4787-4c35-95b8-58aeed83c273
1830ab6b-8213-4579-814a-c5841d52c36f	37e08cba-2320-4e1b-b564-adff5c764884	46a56c10-ca29-410a-b939-8bffcfff61e9	cb0e05b7-7c25-4dd1-8e3c-6b575ff50bcc
b29ba856-37ef-4541-baf3-58fa8a96f60e	37e08cba-2320-4e1b-b564-adff5c764884	46a56c10-ca29-410a-b939-8bffcfff61e9	a196d509-3387-46bf-9f4a-869ac28fbe05
206608a7-3c83-4600-8da1-994b085b63d6	37e08cba-2320-4e1b-b564-adff5c764884	46a56c10-ca29-410a-b939-8bffcfff61e9	759b3785-1edd-4216-87d8-6172de792b01
d43fef12-98fe-4592-abcd-bd3e228cea46	37e08cba-2320-4e1b-b564-adff5c764884	46a56c10-ca29-410a-b939-8bffcfff61e9	5b993cb3-eed7-444a-87ca-f58fae00758f
605ebbe6-f5b9-4f5a-9e5c-6f08743aef50	37e08cba-2320-4e1b-b564-adff5c764884	46a56c10-ca29-410a-b939-8bffcfff61e9	af3bdf39-4b69-4f6d-90e3-13fa6e136877
91b6ee36-49e6-421b-b60f-eb30d8fb33e9	37e08cba-2320-4e1b-b564-adff5c764884	46a56c10-ca29-410a-b939-8bffcfff61e9	f4cba958-ce13-4514-9547-2cf9a3e76ba6
4f833928-cf94-4691-b5db-3d7da93f0da4	37e08cba-2320-4e1b-b564-adff5c764884	46a56c10-ca29-410a-b939-8bffcfff61e9	8271139b-55a7-4f79-9982-0961cc96dfc7
06d43ae7-a804-4072-aa37-14800b4b13f1	72627abe-3988-41ab-80fd-e56e58642101	46a56c10-ca29-410a-b939-8bffcfff61e9	0b396269-47ff-4caa-a069-c59ed38b590a
a0622aaa-b8f5-4717-87af-cca2c540a232	565e7175-64d0-4cab-85b2-c88d7adc966f	1535197c-b620-492e-bbf5-41a65124bab9	4d5265c0-225c-4cee-a93b-163902c05092
\.


--
-- Data for Name: document_mentions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.document_mentions (id, parent_document_id, mention_id, mention_type) FROM stdin;
8c1eb465-c9c7-4d71-9f42-969de1f1bdf4	f1bb7038-1326-4e6b-bcff-485663e18cb2	0996efd2-e65c-454e-ba59-d33569b7e648	characters
243eaf93-c058-4471-8183-05085f659fa9	f1bb7038-1326-4e6b-bcff-485663e18cb2	92672947-0693-480e-b64e-0aef04cf1f50	characters
986ff9cd-445a-48a5-9d6d-5c16e2ee3e45	f1bb7038-1326-4e6b-bcff-485663e18cb2	0996efd2-e65c-454e-ba59-d33569b7e648	characters
2f24dde0-b670-4e9a-b5b5-ee0584084720	f1bb7038-1326-4e6b-bcff-485663e18cb2	92672947-0693-480e-b64e-0aef04cf1f50	characters
cac7407c-9530-4bc5-a14e-d747cd7719e7	f1bb7038-1326-4e6b-bcff-485663e18cb2	0996efd2-e65c-454e-ba59-d33569b7e648	characters
6308ed36-d7ef-47a4-9c55-d799b6731f33	f1bb7038-1326-4e6b-bcff-485663e18cb2	92672947-0693-480e-b64e-0aef04cf1f50	characters
4a52a264-688b-4d1f-9def-705605de0391	f1bb7038-1326-4e6b-bcff-485663e18cb2	0996efd2-e65c-454e-ba59-d33569b7e648	characters
2bd95124-513c-49c9-9d0c-09bee6ffab15	f1bb7038-1326-4e6b-bcff-485663e18cb2	92672947-0693-480e-b64e-0aef04cf1f50	characters
acced616-00be-44e6-9fbb-1960b0695fa5	9afb41f7-b413-4950-90ff-9893066daf77	06d43ae7-a804-4072-aa37-14800b4b13f1	characters
4432db84-e37b-4439-b0ed-001e8668c72e	9afb41f7-b413-4950-90ff-9893066daf77	06d43ae7-a804-4072-aa37-14800b4b13f1	characters
13d7b63e-432d-444e-9073-20a6324154cc	9afb41f7-b413-4950-90ff-9893066daf77	06d43ae7-a804-4072-aa37-14800b4b13f1	characters
9c450847-0879-4d14-84f1-0b1bf5d61b70	9afb41f7-b413-4950-90ff-9893066daf77	06d43ae7-a804-4072-aa37-14800b4b13f1	characters
acab4a64-9052-40d9-845a-f1d42c514c90	f1bb7038-1326-4e6b-bcff-485663e18cb2	0996efd2-e65c-454e-ba59-d33569b7e648	characters
1146fab5-8e34-44fa-a136-76e4bbd01a37	f1bb7038-1326-4e6b-bcff-485663e18cb2	92672947-0693-480e-b64e-0aef04cf1f50	characters
716fddc5-1fdf-4007-ae60-3b3c592ea652	3177e2ac-9ffa-43af-bef3-ef4f20d14a2e	0cb87e5a-ee9f-4154-b48a-c049ba9ec26b	documents
473a58e0-92f4-406a-a17e-d97a98d5abe3	3177e2ac-9ffa-43af-bef3-ef4f20d14a2e	aaa02323-5478-4373-9e25-bb1735c00e0e	characters
8a023f73-ade3-475c-84ab-7ea188b6340d	3177e2ac-9ffa-43af-bef3-ef4f20d14a2e	c52a229e-8b07-4b33-80a4-a4aa6b41cc6d	words
f04f8622-c4ba-4ba1-9224-875f792781fb	c3511f25-4abd-4a3b-8381-75591a83c9bd	dc7d21d1-0a0d-4e4a-aaaa-d970c7da3825	characters
8b1ae9c8-116b-4403-bf98-654fc4976a30	c3511f25-4abd-4a3b-8381-75591a83c9bd	dc7d21d1-0a0d-4e4a-aaaa-d970c7da3825	characters
5a34433a-95a4-4aa0-b03b-d3194a38ccb9	8af66f86-3211-49f2-87e9-ce7a8ccd9a0b	474d03c5-18a1-4e0e-a298-9e479fe64df6	characters
67e855f9-bcf3-4064-af0c-893e3c654321	8af66f86-3211-49f2-87e9-ce7a8ccd9a0b	a50a4981-40e4-44ae-82ff-27b6c4077ac2	characters
68e2fa51-e507-4235-8557-79acb045553f	8af66f86-3211-49f2-87e9-ce7a8ccd9a0b	474d03c5-18a1-4e0e-a298-9e479fe64df6	characters
097c790b-3d5c-46eb-8a79-2e05af2881e9	8af66f86-3211-49f2-87e9-ce7a8ccd9a0b	066c7b8f-76bd-44dd-900e-be09a7891196	blueprint_instances
809ad620-d585-402d-956b-b35c22f6b509	8af66f86-3211-49f2-87e9-ce7a8ccd9a0b	a50a4981-40e4-44ae-82ff-27b6c4077ac2	characters
584a1164-0030-461b-800b-05d320a5528c	8af66f86-3211-49f2-87e9-ce7a8ccd9a0b	474d03c5-18a1-4e0e-a298-9e479fe64df6	characters
2b6ed9ac-0eb2-47ff-a5db-ac224d5b2a09	8af66f86-3211-49f2-87e9-ce7a8ccd9a0b	066c7b8f-76bd-44dd-900e-be09a7891196	blueprint_instances
ed9ca2f8-66ec-4a10-98a5-79a8b168d669	8af66f86-3211-49f2-87e9-ce7a8ccd9a0b	a50a4981-40e4-44ae-82ff-27b6c4077ac2	characters
2a29d98f-7e35-41bb-bebf-b134419e4c0c	c3511f25-4abd-4a3b-8381-75591a83c9bd	dc7d21d1-0a0d-4e4a-aaaa-d970c7da3825	characters
b08180ec-7b1e-46be-9f1f-92f278339ad6	c3511f25-4abd-4a3b-8381-75591a83c9bd	dc7d21d1-0a0d-4e4a-aaaa-d970c7da3825	characters
3fb223d1-6033-4c15-9aba-157e1de91312	c3511f25-4abd-4a3b-8381-75591a83c9bd	dc7d21d1-0a0d-4e4a-aaaa-d970c7da3825	characters
7536e92b-8e1b-4449-9bfe-aefbfaa05aef	c3511f25-4abd-4a3b-8381-75591a83c9bd	dc7d21d1-0a0d-4e4a-aaaa-d970c7da3825	characters
532b0689-365f-4e78-91c1-489e4c964333	c3511f25-4abd-4a3b-8381-75591a83c9bd	36bae4e6-7aa3-4375-b1fe-637e2bb83cb2	blueprint_instances
84734cc4-1fef-4719-84bd-8f2e26afe953	c3511f25-4abd-4a3b-8381-75591a83c9bd	dc7d21d1-0a0d-4e4a-aaaa-d970c7da3825	characters
7e6dd1a1-0aed-4a0c-8e23-c15d793f1ce4	c3511f25-4abd-4a3b-8381-75591a83c9bd	a50a4981-40e4-44ae-82ff-27b6c4077ac2	characters
caadf51f-db48-493b-be57-f9d4c3633957	c3511f25-4abd-4a3b-8381-75591a83c9bd	36bae4e6-7aa3-4375-b1fe-637e2bb83cb2	blueprint_instances
2ae9d691-2f3a-4272-9eec-ee7622c9bf85	c3511f25-4abd-4a3b-8381-75591a83c9bd	dc7d21d1-0a0d-4e4a-aaaa-d970c7da3825	characters
3f231c21-8df6-42d1-97a6-64eb5846ddfa	8af66f86-3211-49f2-87e9-ce7a8ccd9a0b	dc7d21d1-0a0d-4e4a-aaaa-d970c7da3825	characters
b771fb3f-20d6-47d2-9b75-3b05dc738b91	8af66f86-3211-49f2-87e9-ce7a8ccd9a0b	e8901f1d-9435-4c8f-b2d7-278b5e5c7f7d	blueprint_instances
3727502f-d652-45e1-8dc1-2b373953637b	8af66f86-3211-49f2-87e9-ce7a8ccd9a0b	474d03c5-18a1-4e0e-a298-9e479fe64df6	characters
7d548ae0-5f4a-471c-8def-1d509aa2a722	8af66f86-3211-49f2-87e9-ce7a8ccd9a0b	066c7b8f-76bd-44dd-900e-be09a7891196	blueprint_instances
ff2be28e-9b26-48d9-b760-7116f24cbe9e	8af66f86-3211-49f2-87e9-ce7a8ccd9a0b	a50a4981-40e4-44ae-82ff-27b6c4077ac2	characters
4e628ade-afd0-4a2b-8ee1-3511dadf2699	e0638435-8f3f-46f1-92ad-408a3c959c02	0e848229-1db7-4ae0-b85a-1fd66ab30d60	words
3178aebc-9020-466d-91ae-8951605c5532	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
7bb9bced-00cf-43ce-99dd-f69037007b49	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
9666b5a9-6797-4200-81c4-04df497489c8	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
6924cd5b-2a60-4cf5-ab8b-e369929c24e6	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
b912ed70-6233-4d15-b9dc-f342b9205664	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
25917d29-0f62-4221-ad96-03e9a38c8ad8	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
fcb36e8e-f343-4cca-9de6-c530cdd589c1	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
90f20500-6cf0-470c-81a2-6fa69557f991	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
019c27d5-b220-4d03-9e9f-f6a179fe7d8c	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
8fb60a35-a5a3-4c73-bc07-aeb71aa542ef	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
2fde6580-0107-43f3-84a7-23a1ab359268	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
b5dcd36d-14c1-4854-be47-a5c8b003ddaa	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
ac561615-3a17-4cae-86d3-e26c7d3b637c	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
bdb9831d-4f70-41bc-96f9-e9d832276a0e	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
80bf1772-810f-459a-b880-8fec7054666e	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
42290397-c89a-4671-bf09-ab5ffd14586c	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
fada66f2-bb4e-4bd3-8ad2-834cee3e86d1	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
02ac87f7-556f-4c53-a489-28d14ea47d3c	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
817c1e1f-2d21-4d61-86e6-1adfd97f1ef0	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
f3da47eb-188c-4de9-ba0a-415d57403075	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
33cef194-c3dd-495e-818e-fe51ead4a298	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
ae1ae56a-9207-4d72-830e-541bebe72969	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
dcdd1fa9-708b-4362-a2c5-8769b7ad5e50	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
ca3eb637-d023-4f4a-992d-27ee2ed67efa	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
d51d1ba1-2bf8-4c15-9fae-7305ae1f5d78	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
e453faa4-a3e2-4ac9-b5f5-43d00026f35f	6347c93f-d5d1-470e-b23d-e2f5527869ff	11b6875d-fff6-4034-83fd-dffcb48f1f0c	documents
0628849b-7cb1-4d9d-a206-3276cd4dacb6	6347c93f-d5d1-470e-b23d-e2f5527869ff	11b6875d-fff6-4034-83fd-dffcb48f1f0c	documents
5bf3bc7b-7583-41cb-ba9d-0a80a2d0df3a	6347c93f-d5d1-470e-b23d-e2f5527869ff	11b6875d-fff6-4034-83fd-dffcb48f1f0c	documents
70875174-bab6-4254-9ede-8ba65203b1bd	6347c93f-d5d1-470e-b23d-e2f5527869ff	ac9104a8-99e8-4f48-bcaf-9ff11eb0c02b	words
a4dc54bd-2250-419b-864f-9a5e2974348b	6347c93f-d5d1-470e-b23d-e2f5527869ff	11b6875d-fff6-4034-83fd-dffcb48f1f0c	documents
4cb136ee-0bfb-4f81-aebc-6c81ff291e69	6347c93f-d5d1-470e-b23d-e2f5527869ff	ac9104a8-99e8-4f48-bcaf-9ff11eb0c02b	words
59eac330-4b63-4a4b-9357-5a23730f4b38	6347c93f-d5d1-470e-b23d-e2f5527869ff	11b6875d-fff6-4034-83fd-dffcb48f1f0c	documents
2a967e9c-b4fb-449a-90d7-84a1cdfb407a	6347c93f-d5d1-470e-b23d-e2f5527869ff	ac9104a8-99e8-4f48-bcaf-9ff11eb0c02b	words
1a7df36e-172f-4a44-8ecf-e2150b63c18f	6347c93f-d5d1-470e-b23d-e2f5527869ff	11b6875d-fff6-4034-83fd-dffcb48f1f0c	documents
901bcfa5-1c7f-43b8-a396-cfe2aed67b60	6347c93f-d5d1-470e-b23d-e2f5527869ff	ac9104a8-99e8-4f48-bcaf-9ff11eb0c02b	words
886b0c45-2bf3-4c8a-a67d-01d02b2758ab	6347c93f-d5d1-470e-b23d-e2f5527869ff	11b6875d-fff6-4034-83fd-dffcb48f1f0c	documents
f7771333-7aae-489e-9563-8f316067f503	6347c93f-d5d1-470e-b23d-e2f5527869ff	ac9104a8-99e8-4f48-bcaf-9ff11eb0c02b	words
801a4aef-4c30-4472-b7a3-146beaf028dc	6347c93f-d5d1-470e-b23d-e2f5527869ff	a2ca36bb-1a3a-4843-913c-72a6abb3fb32	words
13005743-855c-4010-ae46-12f390259385	6347c93f-d5d1-470e-b23d-e2f5527869ff	11b6875d-fff6-4034-83fd-dffcb48f1f0c	documents
5314777c-718f-4140-9e3f-9adc57bd40a9	6347c93f-d5d1-470e-b23d-e2f5527869ff	ac9104a8-99e8-4f48-bcaf-9ff11eb0c02b	words
8de713a6-1d96-491c-890d-cd48d75f95ac	6347c93f-d5d1-470e-b23d-e2f5527869ff	a2ca36bb-1a3a-4843-913c-72a6abb3fb32	words
30ca9ff9-83f4-4a06-bfd1-8b55f82e273a	6347c93f-d5d1-470e-b23d-e2f5527869ff	11b6875d-fff6-4034-83fd-dffcb48f1f0c	documents
df226754-7932-4695-a345-4852767f9a54	6347c93f-d5d1-470e-b23d-e2f5527869ff	ac9104a8-99e8-4f48-bcaf-9ff11eb0c02b	words
d60062d4-45bc-488c-b9bb-535e5e4cc8d9	6347c93f-d5d1-470e-b23d-e2f5527869ff	a2ca36bb-1a3a-4843-913c-72a6abb3fb32	words
9ac6cc4c-0438-4f3d-a630-48ccb65e280b	6347c93f-d5d1-470e-b23d-e2f5527869ff	11b6875d-fff6-4034-83fd-dffcb48f1f0c	documents
76df8884-4d2f-42fc-b388-9ca17c29fa43	6347c93f-d5d1-470e-b23d-e2f5527869ff	ac9104a8-99e8-4f48-bcaf-9ff11eb0c02b	words
ec9cd40d-0d2d-4766-9290-228e76ed0095	6347c93f-d5d1-470e-b23d-e2f5527869ff	a2ca36bb-1a3a-4843-913c-72a6abb3fb32	words
0a31d4b2-c31f-4b1c-91a1-e5a379c8e032	6347c93f-d5d1-470e-b23d-e2f5527869ff	11b6875d-fff6-4034-83fd-dffcb48f1f0c	documents
e7cd15c3-2c31-4f33-aa45-3c7006116235	6347c93f-d5d1-470e-b23d-e2f5527869ff	ac9104a8-99e8-4f48-bcaf-9ff11eb0c02b	words
97b7719d-73ad-4da7-b8fd-c5daf3eeba5b	6347c93f-d5d1-470e-b23d-e2f5527869ff	a2ca36bb-1a3a-4843-913c-72a6abb3fb32	words
a1a51418-7b0e-4701-a85e-35d1f900c9b0	6347c93f-d5d1-470e-b23d-e2f5527869ff	11b6875d-fff6-4034-83fd-dffcb48f1f0c	documents
2e64054a-656d-406d-a6fd-3b66eabf8b58	6347c93f-d5d1-470e-b23d-e2f5527869ff	ac9104a8-99e8-4f48-bcaf-9ff11eb0c02b	words
fc871e2e-9440-4a54-beca-de0cd2a55d1d	6347c93f-d5d1-470e-b23d-e2f5527869ff	a2ca36bb-1a3a-4843-913c-72a6abb3fb32	words
ae7b0ca7-0d2e-459e-89b8-38e8a89444e7	6347c93f-d5d1-470e-b23d-e2f5527869ff	11b6875d-fff6-4034-83fd-dffcb48f1f0c	documents
4c8dcab5-9c50-4437-93f4-774f641505f5	6347c93f-d5d1-470e-b23d-e2f5527869ff	ac9104a8-99e8-4f48-bcaf-9ff11eb0c02b	words
12103c81-6b50-4d32-8cfc-4fe93aebe022	6347c93f-d5d1-470e-b23d-e2f5527869ff	a2ca36bb-1a3a-4843-913c-72a6abb3fb32	words
1eb10789-f48c-4674-acf9-ac65a111cbe7	6347c93f-d5d1-470e-b23d-e2f5527869ff	11b6875d-fff6-4034-83fd-dffcb48f1f0c	documents
c8d235d5-a6c6-4813-9f59-19a6f11cce41	6347c93f-d5d1-470e-b23d-e2f5527869ff	ac9104a8-99e8-4f48-bcaf-9ff11eb0c02b	words
985fd9ca-a84e-41cf-8237-87f8aa8eb102	6347c93f-d5d1-470e-b23d-e2f5527869ff	a2ca36bb-1a3a-4843-913c-72a6abb3fb32	words
f257cc16-fd83-4126-a19a-250c1c8134ee	6347c93f-d5d1-470e-b23d-e2f5527869ff	11b6875d-fff6-4034-83fd-dffcb48f1f0c	documents
17587f3b-cb84-479f-bd8b-bc77b0d5d27c	6347c93f-d5d1-470e-b23d-e2f5527869ff	ac9104a8-99e8-4f48-bcaf-9ff11eb0c02b	words
85dc7882-16b7-40b1-a334-cf7e684f4c4f	6347c93f-d5d1-470e-b23d-e2f5527869ff	a2ca36bb-1a3a-4843-913c-72a6abb3fb32	words
d57ccdc0-3e7d-4cd3-a7f6-ecf7368c3063	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
87a8da6a-d2c9-459c-9aab-da90a243a57b	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
b5ce2ae1-26ac-4fb3-ac81-86c62a0021e8	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
6cacd8d4-030b-4006-95c0-c5de006ea587	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
9377df4b-6d5f-4fc1-8c6f-bc910fadcec9	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
2182a596-b2fd-45f2-9b5d-4aebddbbbfd0	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
aa07f3be-d570-498d-a283-c7dfeb383c81	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
da4d6656-e505-4b9a-bda1-04f9172b1d46	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
48f5e7ea-28d1-45d2-8162-26b0e8b02038	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
ad7e4a68-f619-4ae1-89a5-a4cd06a3e494	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
0725bdb0-e78f-42fa-aadb-9713fc118f72	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
a314267d-c0b8-4a77-883e-70a0faadf6e8	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
cec24931-8870-4819-909e-61a976317fe1	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
ef0ad8db-121d-49ce-a2ad-6b7915c5fb0f	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
f5325bef-c5c9-44bb-9521-7c6bea52c8b5	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
03baf965-f4a7-4edb-b278-60a4735af3f6	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
4f1cd463-8603-49b1-a21d-53cecefd3b99	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
7af07d22-4a26-4537-b803-39c5e226a531	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
ce36c956-c136-4de3-9bb9-ead33690b25c	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
a482375b-3346-4c2c-904e-a908901597ad	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
97fe8819-a84a-400c-8800-63d1cbf633a3	6e9a511e-ea64-4bbd-8bf6-d0bba57c698a	42334e0b-7e47-48da-9f8b-83c33434e733	documents
61dc34e7-c025-436e-a632-0452092f46eb	19a96d00-e811-4b39-aea2-b9b4ca7e7196	79dcda36-292f-4b6b-b555-0d0c760d0360	blueprint_instances
e73fa448-c372-4924-9ecc-4ce4a8fafd93	19a96d00-e811-4b39-aea2-b9b4ca7e7196	f56e9300-9e36-479f-b001-8a475edc29a3	blueprint_instances
25e6edf5-7302-4095-ba45-3e949664d36f	19a96d00-e811-4b39-aea2-b9b4ca7e7196	66fb4390-0fc2-4dce-8840-e744171f1d7d	blueprint_instances
6637ee82-c319-47d3-a814-ef025a60c320	19a96d00-e811-4b39-aea2-b9b4ca7e7196	4cde42c9-11da-4134-9c96-776d777e818b	blueprint_instances
50b9846b-3f55-4edb-b7a7-1319fc38fd7c	19a96d00-e811-4b39-aea2-b9b4ca7e7196	93f9860e-9875-488f-8df7-e297746c78a0	blueprint_instances
bd8dc6b2-fc8e-46c5-a18c-fd7c3957509d	19a96d00-e811-4b39-aea2-b9b4ca7e7196	ebdaafa6-5f70-4bed-aca3-62d0f0aca6cc	blueprint_instances
a810bf73-78bd-47ab-bc12-604c623e76f7	19a96d00-e811-4b39-aea2-b9b4ca7e7196	597c9659-8151-459c-a1f7-e35060407fee	blueprint_instances
143f9fad-af3e-4c6d-8179-8bf7833f338e	19a96d00-e811-4b39-aea2-b9b4ca7e7196	e82fb25c-3677-4188-a2c6-c9100edbbe51	blueprint_instances
806c855e-85dc-4548-bed8-180bfaf6a7f8	19a96d00-e811-4b39-aea2-b9b4ca7e7196	39cfee77-7c80-4361-b8bf-2b2cfa26272d	blueprint_instances
3c539991-5870-457a-9743-e379b204f687	19a96d00-e811-4b39-aea2-b9b4ca7e7196	946c2993-6893-4e04-abe2-7dad0f115eb8	blueprint_instances
a64fb441-9766-48a3-8b44-2817913c26ff	19a96d00-e811-4b39-aea2-b9b4ca7e7196	f886d899-a0ac-4b90-8ec2-9daa08d46926	blueprint_instances
8fcc02e7-dd25-4e14-9dcf-05e0ab85f7b8	19a96d00-e811-4b39-aea2-b9b4ca7e7196	3400134a-1d11-410b-9e1d-c9c7dd31c7bd	blueprint_instances
ee9330d3-c59e-41fe-90b5-0e307a1afb4a	19a96d00-e811-4b39-aea2-b9b4ca7e7196	79dcda36-292f-4b6b-b555-0d0c760d0360	blueprint_instances
8710dbac-29ad-41b4-82fa-4738d0ac55bd	19a96d00-e811-4b39-aea2-b9b4ca7e7196	f56e9300-9e36-479f-b001-8a475edc29a3	blueprint_instances
8c3a1c16-b578-4740-9980-9d5fcf5de4e5	19a96d00-e811-4b39-aea2-b9b4ca7e7196	66fb4390-0fc2-4dce-8840-e744171f1d7d	blueprint_instances
ac6e02e9-9366-4961-ba31-c5e5e0723f6d	19a96d00-e811-4b39-aea2-b9b4ca7e7196	4cde42c9-11da-4134-9c96-776d777e818b	blueprint_instances
fb0c242d-8563-48db-a525-640f9c265a5b	19a96d00-e811-4b39-aea2-b9b4ca7e7196	93f9860e-9875-488f-8df7-e297746c78a0	blueprint_instances
90e5c8d7-226f-4b9b-8b1b-73e43b9ba8f1	19a96d00-e811-4b39-aea2-b9b4ca7e7196	ebdaafa6-5f70-4bed-aca3-62d0f0aca6cc	blueprint_instances
d0116caa-c07b-4ab0-8b97-803f138aa19b	19a96d00-e811-4b39-aea2-b9b4ca7e7196	597c9659-8151-459c-a1f7-e35060407fee	blueprint_instances
323a6f0d-8821-47ac-909e-7075fb5c1b37	19a96d00-e811-4b39-aea2-b9b4ca7e7196	e82fb25c-3677-4188-a2c6-c9100edbbe51	blueprint_instances
37194624-1605-4fa8-a0a9-fc27abf35048	19a96d00-e811-4b39-aea2-b9b4ca7e7196	39cfee77-7c80-4361-b8bf-2b2cfa26272d	blueprint_instances
8025c6a1-9a72-4fba-b9c3-82fc2beb119e	19a96d00-e811-4b39-aea2-b9b4ca7e7196	946c2993-6893-4e04-abe2-7dad0f115eb8	blueprint_instances
5c7a1aee-3886-464d-aa1e-1025d0665fd4	19a96d00-e811-4b39-aea2-b9b4ca7e7196	f886d899-a0ac-4b90-8ec2-9daa08d46926	blueprint_instances
38cbaa52-fa54-4fa0-9b2a-e118abcf0adb	19a96d00-e811-4b39-aea2-b9b4ca7e7196	3400134a-1d11-410b-9e1d-c9c7dd31c7bd	blueprint_instances
5cbb7395-6767-42cf-8e6a-3d866c0d13d2	19a96d00-e811-4b39-aea2-b9b4ca7e7196	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	graphs
e89c5745-8f4b-4996-af6d-21ae37a1f171	19a96d00-e811-4b39-aea2-b9b4ca7e7196	79dcda36-292f-4b6b-b555-0d0c760d0360	blueprint_instances
de93c3bb-96a1-4959-80ce-ea0902012d68	19a96d00-e811-4b39-aea2-b9b4ca7e7196	f56e9300-9e36-479f-b001-8a475edc29a3	blueprint_instances
476e16a5-e5f4-4942-b057-0c62921c5c32	19a96d00-e811-4b39-aea2-b9b4ca7e7196	66fb4390-0fc2-4dce-8840-e744171f1d7d	blueprint_instances
f5bd61d2-b212-449a-8da2-b49f52606564	19a96d00-e811-4b39-aea2-b9b4ca7e7196	4cde42c9-11da-4134-9c96-776d777e818b	blueprint_instances
b95723ce-0efb-492e-9694-6befa9a71195	19a96d00-e811-4b39-aea2-b9b4ca7e7196	93f9860e-9875-488f-8df7-e297746c78a0	blueprint_instances
59d0d377-0697-4b29-8ed1-beda6dcc6299	19a96d00-e811-4b39-aea2-b9b4ca7e7196	ebdaafa6-5f70-4bed-aca3-62d0f0aca6cc	blueprint_instances
2f4cbeb8-f2ef-458a-bf4a-418052fd3483	19a96d00-e811-4b39-aea2-b9b4ca7e7196	597c9659-8151-459c-a1f7-e35060407fee	blueprint_instances
59928856-2f52-4121-8fb1-0a1ca66205ea	19a96d00-e811-4b39-aea2-b9b4ca7e7196	e82fb25c-3677-4188-a2c6-c9100edbbe51	blueprint_instances
5603e3cd-c3e7-4f4f-8d8f-eb03d34579c0	19a96d00-e811-4b39-aea2-b9b4ca7e7196	73125719-319c-430f-88d9-5cda7dc72eb1	characters
fce89a7d-a60f-4013-ace7-800962e6e292	19a96d00-e811-4b39-aea2-b9b4ca7e7196	39cfee77-7c80-4361-b8bf-2b2cfa26272d	blueprint_instances
979c0be1-267f-466a-9c04-9413fa4b7326	19a96d00-e811-4b39-aea2-b9b4ca7e7196	946c2993-6893-4e04-abe2-7dad0f115eb8	blueprint_instances
26124258-d7d5-4167-9815-ab302b8f5186	19a96d00-e811-4b39-aea2-b9b4ca7e7196	f886d899-a0ac-4b90-8ec2-9daa08d46926	blueprint_instances
6e0ffa4c-fbaf-4837-b9bf-ad157644101c	19a96d00-e811-4b39-aea2-b9b4ca7e7196	3400134a-1d11-410b-9e1d-c9c7dd31c7bd	blueprint_instances
95f3ed26-97cb-4f08-b082-66f3e4ea3ae0	19a96d00-e811-4b39-aea2-b9b4ca7e7196	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	graphs
b89b12b1-ba6f-491c-b82c-02ea0ba8d218	19a96d00-e811-4b39-aea2-b9b4ca7e7196	79dcda36-292f-4b6b-b555-0d0c760d0360	blueprint_instances
4573da5d-ab50-4f18-bd09-ba992362b97b	19a96d00-e811-4b39-aea2-b9b4ca7e7196	f56e9300-9e36-479f-b001-8a475edc29a3	blueprint_instances
98e4da81-cd94-45cb-b3b7-7a1b6d966503	19a96d00-e811-4b39-aea2-b9b4ca7e7196	66fb4390-0fc2-4dce-8840-e744171f1d7d	blueprint_instances
00ccdfbe-576d-455f-9fd9-b97eb9141a8e	19a96d00-e811-4b39-aea2-b9b4ca7e7196	4cde42c9-11da-4134-9c96-776d777e818b	blueprint_instances
124e3e0d-b6db-4ae2-9d20-d68edaaa9e4a	19a96d00-e811-4b39-aea2-b9b4ca7e7196	93f9860e-9875-488f-8df7-e297746c78a0	blueprint_instances
3af645a0-8f34-4b15-b1cd-6306f0486b2b	19a96d00-e811-4b39-aea2-b9b4ca7e7196	ebdaafa6-5f70-4bed-aca3-62d0f0aca6cc	blueprint_instances
b5699f83-82b6-4a3d-8697-2edaac6d5bab	19a96d00-e811-4b39-aea2-b9b4ca7e7196	597c9659-8151-459c-a1f7-e35060407fee	blueprint_instances
503f3942-647e-4907-ae1a-3e66e2dfcfac	19a96d00-e811-4b39-aea2-b9b4ca7e7196	e82fb25c-3677-4188-a2c6-c9100edbbe51	blueprint_instances
ab5c35df-74b6-4457-8a89-e4e69084fa07	19a96d00-e811-4b39-aea2-b9b4ca7e7196	565e7175-64d0-4cab-85b2-c88d7adc966f	characters
dfe0ece9-3768-421c-b890-7731221b5ed9	19a96d00-e811-4b39-aea2-b9b4ca7e7196	73125719-319c-430f-88d9-5cda7dc72eb1	characters
b1c047c8-5618-4fa2-a7f8-c5417238690c	19a96d00-e811-4b39-aea2-b9b4ca7e7196	39cfee77-7c80-4361-b8bf-2b2cfa26272d	blueprint_instances
9848576d-721d-4070-92d9-21ea6a04cfac	19a96d00-e811-4b39-aea2-b9b4ca7e7196	946c2993-6893-4e04-abe2-7dad0f115eb8	blueprint_instances
e7ae5ab7-d43f-401b-a839-eead5e163bdc	19a96d00-e811-4b39-aea2-b9b4ca7e7196	f886d899-a0ac-4b90-8ec2-9daa08d46926	blueprint_instances
8d8780c7-9a7d-47e4-8b00-df671080f765	19a96d00-e811-4b39-aea2-b9b4ca7e7196	3400134a-1d11-410b-9e1d-c9c7dd31c7bd	blueprint_instances
08aaf531-0e8e-4bf5-a941-32e6ef7fb224	19a96d00-e811-4b39-aea2-b9b4ca7e7196	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	graphs
8f3f23b8-1a7b-40f5-bada-31b1ee923d5c	19a96d00-e811-4b39-aea2-b9b4ca7e7196	79dcda36-292f-4b6b-b555-0d0c760d0360	blueprint_instances
030f206f-cada-4390-88e9-15fa13236c1b	19a96d00-e811-4b39-aea2-b9b4ca7e7196	f56e9300-9e36-479f-b001-8a475edc29a3	blueprint_instances
663433eb-a19f-4d18-bd98-53deee179ed8	19a96d00-e811-4b39-aea2-b9b4ca7e7196	66fb4390-0fc2-4dce-8840-e744171f1d7d	blueprint_instances
5855aef3-3e7b-4578-a1aa-d528b0154990	19a96d00-e811-4b39-aea2-b9b4ca7e7196	4cde42c9-11da-4134-9c96-776d777e818b	blueprint_instances
02b0bded-dee7-4d6e-842f-34c1b585dc76	19a96d00-e811-4b39-aea2-b9b4ca7e7196	93f9860e-9875-488f-8df7-e297746c78a0	blueprint_instances
42d069c6-9e20-434a-821d-2cb33d67a336	19a96d00-e811-4b39-aea2-b9b4ca7e7196	ebdaafa6-5f70-4bed-aca3-62d0f0aca6cc	blueprint_instances
130ce8cd-00c3-4e4a-90b2-192d2895e438	19a96d00-e811-4b39-aea2-b9b4ca7e7196	597c9659-8151-459c-a1f7-e35060407fee	blueprint_instances
d6d9b97d-c42a-4001-83c2-26b643acf353	19a96d00-e811-4b39-aea2-b9b4ca7e7196	e82fb25c-3677-4188-a2c6-c9100edbbe51	blueprint_instances
2dd33022-b36d-4177-92cc-2c5e584ee661	19a96d00-e811-4b39-aea2-b9b4ca7e7196	565e7175-64d0-4cab-85b2-c88d7adc966f	characters
28c4e7ff-4c3f-42eb-968a-ceadc1b0977b	19a96d00-e811-4b39-aea2-b9b4ca7e7196	73125719-319c-430f-88d9-5cda7dc72eb1	characters
70fc753d-0479-44f3-90ad-f208083de5c8	19a96d00-e811-4b39-aea2-b9b4ca7e7196	39cfee77-7c80-4361-b8bf-2b2cfa26272d	blueprint_instances
3db84557-98cc-4745-938e-95948ddd1bb3	19a96d00-e811-4b39-aea2-b9b4ca7e7196	946c2993-6893-4e04-abe2-7dad0f115eb8	blueprint_instances
7ee5b76d-2756-485c-abb5-7324f2e99c04	19a96d00-e811-4b39-aea2-b9b4ca7e7196	f886d899-a0ac-4b90-8ec2-9daa08d46926	blueprint_instances
d6cf004f-424e-464f-a907-64015908b899	19a96d00-e811-4b39-aea2-b9b4ca7e7196	3400134a-1d11-410b-9e1d-c9c7dd31c7bd	blueprint_instances
1882ab8c-8664-4e38-b329-2f6724bcd307	19a96d00-e811-4b39-aea2-b9b4ca7e7196	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	graphs
edb27e89-0628-462a-a1d3-ca51313280b2	19a96d00-e811-4b39-aea2-b9b4ca7e7196	79dcda36-292f-4b6b-b555-0d0c760d0360	blueprint_instances
065a7549-b855-4708-9cca-4b2b232c268f	19a96d00-e811-4b39-aea2-b9b4ca7e7196	f56e9300-9e36-479f-b001-8a475edc29a3	blueprint_instances
31e5a79c-da82-4072-b9fa-749e5a7aeda0	19a96d00-e811-4b39-aea2-b9b4ca7e7196	66fb4390-0fc2-4dce-8840-e744171f1d7d	blueprint_instances
dad61be9-c116-4c20-a06f-2f2c219aa923	19a96d00-e811-4b39-aea2-b9b4ca7e7196	4cde42c9-11da-4134-9c96-776d777e818b	blueprint_instances
a5e62555-280f-43ed-8eab-f10ab12bb204	19a96d00-e811-4b39-aea2-b9b4ca7e7196	93f9860e-9875-488f-8df7-e297746c78a0	blueprint_instances
c2fac5a0-e72d-41f2-bee2-dccc719a5ae2	19a96d00-e811-4b39-aea2-b9b4ca7e7196	ebdaafa6-5f70-4bed-aca3-62d0f0aca6cc	blueprint_instances
49ceb2cd-6885-4ad0-9f4b-198e67a2eceb	19a96d00-e811-4b39-aea2-b9b4ca7e7196	597c9659-8151-459c-a1f7-e35060407fee	blueprint_instances
95b8a197-d0bc-4143-9548-599661fc2923	19a96d00-e811-4b39-aea2-b9b4ca7e7196	e82fb25c-3677-4188-a2c6-c9100edbbe51	blueprint_instances
f0bdb264-8ef6-46c7-b201-8b77f0c7691e	19a96d00-e811-4b39-aea2-b9b4ca7e7196	565e7175-64d0-4cab-85b2-c88d7adc966f	characters
f40111fb-b814-4fd0-a284-849f2fd46b27	19a96d00-e811-4b39-aea2-b9b4ca7e7196	73125719-319c-430f-88d9-5cda7dc72eb1	characters
4aab5374-d370-4812-ac8c-979bf8abef7e	19a96d00-e811-4b39-aea2-b9b4ca7e7196	39cfee77-7c80-4361-b8bf-2b2cfa26272d	blueprint_instances
ed478c24-d18e-4955-b431-7d40c33c7f6d	19a96d00-e811-4b39-aea2-b9b4ca7e7196	946c2993-6893-4e04-abe2-7dad0f115eb8	blueprint_instances
96eb0dc1-f470-41b8-8d50-4315cbff28e1	19a96d00-e811-4b39-aea2-b9b4ca7e7196	f886d899-a0ac-4b90-8ec2-9daa08d46926	blueprint_instances
66b2179d-959b-412f-8694-f9891bbab498	19a96d00-e811-4b39-aea2-b9b4ca7e7196	3400134a-1d11-410b-9e1d-c9c7dd31c7bd	blueprint_instances
73edc8cb-06ec-4818-99f0-067ecfb23eec	19a96d00-e811-4b39-aea2-b9b4ca7e7196	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	graphs
cf274c00-624a-44fa-bbe6-00b1009fe2bd	19a96d00-e811-4b39-aea2-b9b4ca7e7196	79dcda36-292f-4b6b-b555-0d0c760d0360	blueprint_instances
148c28e0-37b5-4e40-bc65-81fb189e0074	19a96d00-e811-4b39-aea2-b9b4ca7e7196	f56e9300-9e36-479f-b001-8a475edc29a3	blueprint_instances
44471995-4022-4072-b115-69b5c69b8ab9	19a96d00-e811-4b39-aea2-b9b4ca7e7196	66fb4390-0fc2-4dce-8840-e744171f1d7d	blueprint_instances
178d1b0d-81bf-4ee4-a134-82c67a5a8ad9	19a96d00-e811-4b39-aea2-b9b4ca7e7196	4cde42c9-11da-4134-9c96-776d777e818b	blueprint_instances
a1f29171-f86a-46a8-b2c2-9cce8bd42c9b	19a96d00-e811-4b39-aea2-b9b4ca7e7196	93f9860e-9875-488f-8df7-e297746c78a0	blueprint_instances
e8bece4f-7304-4c8f-a756-eb3a12bf5ba1	19a96d00-e811-4b39-aea2-b9b4ca7e7196	ebdaafa6-5f70-4bed-aca3-62d0f0aca6cc	blueprint_instances
223d3fdb-0d54-4dd5-86c6-b29ce9d23e0a	19a96d00-e811-4b39-aea2-b9b4ca7e7196	597c9659-8151-459c-a1f7-e35060407fee	blueprint_instances
e83ee425-bb86-4225-b7c1-6e0b61d946c8	19a96d00-e811-4b39-aea2-b9b4ca7e7196	e82fb25c-3677-4188-a2c6-c9100edbbe51	blueprint_instances
f4ce3f37-6971-49f0-811a-d3ee0751dc86	19a96d00-e811-4b39-aea2-b9b4ca7e7196	565e7175-64d0-4cab-85b2-c88d7adc966f	characters
e71ec4e9-138d-4b12-8b4e-d6067e5fcb86	19a96d00-e811-4b39-aea2-b9b4ca7e7196	73125719-319c-430f-88d9-5cda7dc72eb1	characters
d029d844-7c31-40c2-a840-6f3ff6859dd4	19a96d00-e811-4b39-aea2-b9b4ca7e7196	39cfee77-7c80-4361-b8bf-2b2cfa26272d	blueprint_instances
7509774b-0942-4299-bb25-c2480130b339	19a96d00-e811-4b39-aea2-b9b4ca7e7196	946c2993-6893-4e04-abe2-7dad0f115eb8	blueprint_instances
087127a0-33cd-41e8-8c5a-f658f27dbc98	19a96d00-e811-4b39-aea2-b9b4ca7e7196	f886d899-a0ac-4b90-8ec2-9daa08d46926	blueprint_instances
ae75fc25-8227-4dfd-9ea1-77b2372cd326	19a96d00-e811-4b39-aea2-b9b4ca7e7196	3400134a-1d11-410b-9e1d-c9c7dd31c7bd	blueprint_instances
8ee8335a-6a97-4460-b035-bd3d0a1002b0	19a96d00-e811-4b39-aea2-b9b4ca7e7196	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	graphs
a2874e72-3154-4bc3-a01a-94296c0fca08	19a96d00-e811-4b39-aea2-b9b4ca7e7196	79dcda36-292f-4b6b-b555-0d0c760d0360	blueprint_instances
3957d240-496c-45dd-9099-82e4c83548e7	19a96d00-e811-4b39-aea2-b9b4ca7e7196	f56e9300-9e36-479f-b001-8a475edc29a3	blueprint_instances
d3c5a292-2de4-4d90-9eca-78cb66b0beea	19a96d00-e811-4b39-aea2-b9b4ca7e7196	66fb4390-0fc2-4dce-8840-e744171f1d7d	blueprint_instances
7c6a7be3-f5c7-40b0-a7de-54499d797989	19a96d00-e811-4b39-aea2-b9b4ca7e7196	4cde42c9-11da-4134-9c96-776d777e818b	blueprint_instances
bf81535b-8134-406e-8502-ba1457079495	19a96d00-e811-4b39-aea2-b9b4ca7e7196	93f9860e-9875-488f-8df7-e297746c78a0	blueprint_instances
66c9541c-4a52-459d-a62b-77e8922f1ebe	19a96d00-e811-4b39-aea2-b9b4ca7e7196	ebdaafa6-5f70-4bed-aca3-62d0f0aca6cc	blueprint_instances
5b27e07e-648f-4dd8-96f9-61be293dc0e8	19a96d00-e811-4b39-aea2-b9b4ca7e7196	597c9659-8151-459c-a1f7-e35060407fee	blueprint_instances
0a563057-16de-4feb-8f02-2319adbe5b4f	19a96d00-e811-4b39-aea2-b9b4ca7e7196	e82fb25c-3677-4188-a2c6-c9100edbbe51	blueprint_instances
b287ee40-3cb5-428d-a9fe-94100c7b35c1	19a96d00-e811-4b39-aea2-b9b4ca7e7196	565e7175-64d0-4cab-85b2-c88d7adc966f	characters
9d0cf5fd-7cbb-4761-9ff5-0cc3705a8f20	19a96d00-e811-4b39-aea2-b9b4ca7e7196	73125719-319c-430f-88d9-5cda7dc72eb1	characters
31268125-d6c6-48f3-8f2d-0f38875c40e8	19a96d00-e811-4b39-aea2-b9b4ca7e7196	39cfee77-7c80-4361-b8bf-2b2cfa26272d	blueprint_instances
c620ebd0-9692-4156-8577-22a5ea45bc12	19a96d00-e811-4b39-aea2-b9b4ca7e7196	946c2993-6893-4e04-abe2-7dad0f115eb8	blueprint_instances
251732a7-9868-48c1-9e78-ae79f76c7ce2	19a96d00-e811-4b39-aea2-b9b4ca7e7196	f886d899-a0ac-4b90-8ec2-9daa08d46926	blueprint_instances
8eac27ab-09b2-4bda-a28e-1801824f21f0	19a96d00-e811-4b39-aea2-b9b4ca7e7196	3400134a-1d11-410b-9e1d-c9c7dd31c7bd	blueprint_instances
e3c48279-54ff-41ab-9672-5447e52acc77	19a96d00-e811-4b39-aea2-b9b4ca7e7196	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	graphs
d94a7372-6e08-4363-ac96-972ca6f1bfa4	19a96d00-e811-4b39-aea2-b9b4ca7e7196	79dcda36-292f-4b6b-b555-0d0c760d0360	blueprint_instances
cce8cbde-9cd6-4809-bb43-5feb7bcbc651	19a96d00-e811-4b39-aea2-b9b4ca7e7196	f56e9300-9e36-479f-b001-8a475edc29a3	blueprint_instances
079a0b5f-c352-4822-8b49-e7930e843548	19a96d00-e811-4b39-aea2-b9b4ca7e7196	66fb4390-0fc2-4dce-8840-e744171f1d7d	blueprint_instances
f5dbbb5f-ba9d-4a34-911e-25947165f7f1	19a96d00-e811-4b39-aea2-b9b4ca7e7196	4cde42c9-11da-4134-9c96-776d777e818b	blueprint_instances
6b72d3a1-1ab3-40df-9273-d94a875973de	19a96d00-e811-4b39-aea2-b9b4ca7e7196	93f9860e-9875-488f-8df7-e297746c78a0	blueprint_instances
ddeea186-50dd-44e5-b4db-a2344b70176e	19a96d00-e811-4b39-aea2-b9b4ca7e7196	ebdaafa6-5f70-4bed-aca3-62d0f0aca6cc	blueprint_instances
5bcb2236-1d5d-464f-8aa9-62306223110c	19a96d00-e811-4b39-aea2-b9b4ca7e7196	597c9659-8151-459c-a1f7-e35060407fee	blueprint_instances
a8086744-7b2f-4b2f-b848-0bf735277a1f	19a96d00-e811-4b39-aea2-b9b4ca7e7196	e82fb25c-3677-4188-a2c6-c9100edbbe51	blueprint_instances
0ae18d46-2f9c-4d8a-995c-026e4ab450b1	19a96d00-e811-4b39-aea2-b9b4ca7e7196	565e7175-64d0-4cab-85b2-c88d7adc966f	characters
418eebce-47dc-4db4-8487-31abf6afdaac	19a96d00-e811-4b39-aea2-b9b4ca7e7196	73125719-319c-430f-88d9-5cda7dc72eb1	characters
e191e28f-fb47-4ea6-be44-f233fcb1649d	19a96d00-e811-4b39-aea2-b9b4ca7e7196	39cfee77-7c80-4361-b8bf-2b2cfa26272d	blueprint_instances
1d10e83c-fbcb-459d-aa7c-36e67c7c0394	19a96d00-e811-4b39-aea2-b9b4ca7e7196	946c2993-6893-4e04-abe2-7dad0f115eb8	blueprint_instances
b8bfa172-4452-433e-a993-81512258d9a9	19a96d00-e811-4b39-aea2-b9b4ca7e7196	f886d899-a0ac-4b90-8ec2-9daa08d46926	blueprint_instances
a9a1b8bf-917e-4621-9fda-e40aea95745a	19a96d00-e811-4b39-aea2-b9b4ca7e7196	3400134a-1d11-410b-9e1d-c9c7dd31c7bd	blueprint_instances
6f23bd85-0995-42bb-b173-c1f0eedfb68c	19a96d00-e811-4b39-aea2-b9b4ca7e7196	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	graphs
0b11bfe2-6ec5-49da-83a0-94fd9978bc24	19a96d00-e811-4b39-aea2-b9b4ca7e7196	79dcda36-292f-4b6b-b555-0d0c760d0360	blueprint_instances
e339aae9-bfa1-4354-80d9-870fd649437b	19a96d00-e811-4b39-aea2-b9b4ca7e7196	f56e9300-9e36-479f-b001-8a475edc29a3	blueprint_instances
bfbb1652-ea90-42e6-8da0-1fc59ae68488	19a96d00-e811-4b39-aea2-b9b4ca7e7196	66fb4390-0fc2-4dce-8840-e744171f1d7d	blueprint_instances
ae7344b4-e753-4db7-9a7c-da7234179fd7	19a96d00-e811-4b39-aea2-b9b4ca7e7196	4cde42c9-11da-4134-9c96-776d777e818b	blueprint_instances
e4662f6f-e11b-4e59-8dea-cc171c5322d1	19a96d00-e811-4b39-aea2-b9b4ca7e7196	93f9860e-9875-488f-8df7-e297746c78a0	blueprint_instances
e41bb6bf-4f47-4534-b85c-16839c811a1d	19a96d00-e811-4b39-aea2-b9b4ca7e7196	ebdaafa6-5f70-4bed-aca3-62d0f0aca6cc	blueprint_instances
836449ee-5e48-4209-9dfb-89eaaaf802d8	19a96d00-e811-4b39-aea2-b9b4ca7e7196	597c9659-8151-459c-a1f7-e35060407fee	blueprint_instances
e959aa9a-36a5-49f4-8934-051dc65fc3d6	19a96d00-e811-4b39-aea2-b9b4ca7e7196	84f9f03d-241d-41a1-9fa6-7a13c39c9608	characters
54d9eccc-91bf-4e84-89ba-54ed2826f8c0	19a96d00-e811-4b39-aea2-b9b4ca7e7196	e82fb25c-3677-4188-a2c6-c9100edbbe51	blueprint_instances
9d15f393-29a5-450c-9956-dac66488092a	19a96d00-e811-4b39-aea2-b9b4ca7e7196	565e7175-64d0-4cab-85b2-c88d7adc966f	characters
7a4f56f7-e9b9-4746-9305-95389786a52e	19a96d00-e811-4b39-aea2-b9b4ca7e7196	73125719-319c-430f-88d9-5cda7dc72eb1	characters
bbdf9d31-5b9b-4ab3-8fc8-db6e381e21b6	19a96d00-e811-4b39-aea2-b9b4ca7e7196	39cfee77-7c80-4361-b8bf-2b2cfa26272d	blueprint_instances
2ee4c354-91c3-497d-93cc-7ca4ec7a9652	19a96d00-e811-4b39-aea2-b9b4ca7e7196	946c2993-6893-4e04-abe2-7dad0f115eb8	blueprint_instances
281b1a73-d301-4ab8-be2d-19960fbe0536	19a96d00-e811-4b39-aea2-b9b4ca7e7196	f886d899-a0ac-4b90-8ec2-9daa08d46926	blueprint_instances
b14e7a3f-3419-44f7-8083-406882649b4f	19a96d00-e811-4b39-aea2-b9b4ca7e7196	3400134a-1d11-410b-9e1d-c9c7dd31c7bd	blueprint_instances
9d2109ea-56c8-4624-a0c3-bb4a6da76b7a	19a96d00-e811-4b39-aea2-b9b4ca7e7196	7a1410fd-28b8-4ad9-a5d4-c16e3a32aba1	graphs
a50e4c76-6a6a-4121-b71f-25fe3f38e72e	19a96d00-e811-4b39-aea2-b9b4ca7e7196	79dcda36-292f-4b6b-b555-0d0c760d0360	blueprint_instances
90225004-fc96-4ee5-8ea7-fcab0f03e271	19a96d00-e811-4b39-aea2-b9b4ca7e7196	f56e9300-9e36-479f-b001-8a475edc29a3	blueprint_instances
48d3b16e-8c4b-47a0-8ca6-d1ef2a0d0115	19a96d00-e811-4b39-aea2-b9b4ca7e7196	66fb4390-0fc2-4dce-8840-e744171f1d7d	blueprint_instances
00a6f318-cb33-4827-8da6-6dac114753b6	19a96d00-e811-4b39-aea2-b9b4ca7e7196	4cde42c9-11da-4134-9c96-776d777e818b	blueprint_instances
5ebf6117-f49e-40ec-bdd2-f94e08cb3f08	19a96d00-e811-4b39-aea2-b9b4ca7e7196	93f9860e-9875-488f-8df7-e297746c78a0	blueprint_instances
4dd33d71-327b-4b68-9fc2-cb42b8df03e6	19a96d00-e811-4b39-aea2-b9b4ca7e7196	ebdaafa6-5f70-4bed-aca3-62d0f0aca6cc	blueprint_instances
6bd28f99-fb79-4b80-a188-8e70157d1b57	19a96d00-e811-4b39-aea2-b9b4ca7e7196	597c9659-8151-459c-a1f7-e35060407fee	blueprint_instances
6632d16a-ae2d-4e40-9349-aa82fc84f750	19a96d00-e811-4b39-aea2-b9b4ca7e7196	84f9f03d-241d-41a1-9fa6-7a13c39c9608	characters
efca622a-998b-451b-8a61-339598f11c16	19a96d00-e811-4b39-aea2-b9b4ca7e7196	e82fb25c-3677-4188-a2c6-c9100edbbe51	blueprint_instances
5d30e283-1416-46eb-81bd-a8ac520979f0	19a96d00-e811-4b39-aea2-b9b4ca7e7196	565e7175-64d0-4cab-85b2-c88d7adc966f	characters
35bed35c-e727-4ed3-926e-2da88479a8dd	19a96d00-e811-4b39-aea2-b9b4ca7e7196	73125719-319c-430f-88d9-5cda7dc72eb1	characters
5eedb876-b5f5-4685-a388-913e869b44cc	19a96d00-e811-4b39-aea2-b9b4ca7e7196	39cfee77-7c80-4361-b8bf-2b2cfa26272d	blueprint_instances
9985d99a-6f8f-49a5-a159-bb8b0ae8c166	19a96d00-e811-4b39-aea2-b9b4ca7e7196	946c2993-6893-4e04-abe2-7dad0f115eb8	blueprint_instances
f633d40d-8bfe-40be-b574-5cf4f962976f	19a96d00-e811-4b39-aea2-b9b4ca7e7196	f886d899-a0ac-4b90-8ec2-9daa08d46926	blueprint_instances
2810d39d-0de0-4394-8811-74ae9e1b536e	19a96d00-e811-4b39-aea2-b9b4ca7e7196	3400134a-1d11-410b-9e1d-c9c7dd31c7bd	blueprint_instances
cae7607b-d99c-434b-8920-c0f913c78ae5	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
403b05a4-0b90-4b03-aa8f-31535cb7bec5	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
d32b6f0f-37e5-476d-9f86-8101f42b78df	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
e3353c01-bd63-4267-9055-c785117bd6bb	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
9f3134f5-e6ba-4411-9e60-674358c85d45	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
b994da5d-037f-4c68-8317-7beb0cac0b86	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
06d5a213-74b0-4a0e-be2b-5769de9fa1ac	62b120c5-585a-4a6f-9c90-6c976c3aaebd	00e5e5d0-8763-4e6a-a11a-8950811c7ed3	characters
e35f661b-8255-4564-acd1-4eb33f30a3af	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
7c02e8e6-aaf0-437e-9fd9-a19ead780ebc	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
3d7b38b2-af56-416f-b380-ffcb7b931a3a	62b120c5-585a-4a6f-9c90-6c976c3aaebd	00e5e5d0-8763-4e6a-a11a-8950811c7ed3	characters
fa8ed0e4-5483-47c4-9223-bead9f8ed46f	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
028bf022-e322-4e8c-aab8-bf6e1b17de13	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
4ebfa3fd-7eeb-4849-a096-7574c3c42060	62b120c5-585a-4a6f-9c90-6c976c3aaebd	00e5e5d0-8763-4e6a-a11a-8950811c7ed3	characters
32fc13b8-29c2-49c1-b255-24a555b68bf8	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
70b6cc21-c97e-4506-ba8d-5c4eb6a51423	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
9ea6a869-7c78-4c7d-8364-4c263d3c8986	62b120c5-585a-4a6f-9c90-6c976c3aaebd	00e5e5d0-8763-4e6a-a11a-8950811c7ed3	characters
bca36bfc-47d3-4787-8bd4-725bfa13a429	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
0e741b50-c659-4d41-b961-c87ff5238e7b	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
ee956cfd-15d5-46d9-8861-f7d857c996e8	62b120c5-585a-4a6f-9c90-6c976c3aaebd	00e5e5d0-8763-4e6a-a11a-8950811c7ed3	characters
8201701f-142e-44fc-850a-c868966583cf	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
fa8e0616-309d-4837-98eb-5e229cea7726	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
aa619def-167f-452f-9907-db5c38eb19f1	62b120c5-585a-4a6f-9c90-6c976c3aaebd	00e5e5d0-8763-4e6a-a11a-8950811c7ed3	characters
ce5f0c37-123a-4860-93f7-fcdaa9601de3	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
496bf76e-a3d1-47f2-9b20-dddd24a08c26	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
3c4b9994-0f19-4671-b489-4855b1751c14	62b120c5-585a-4a6f-9c90-6c976c3aaebd	00e5e5d0-8763-4e6a-a11a-8950811c7ed3	characters
c29ef1e2-3c51-4b34-99b3-8d540a422f42	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
3a9e721e-1d41-4f8f-9c33-07a9117e9052	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
5c51a21b-ba0a-41c4-b56c-d926fe56fafa	62b120c5-585a-4a6f-9c90-6c976c3aaebd	00e5e5d0-8763-4e6a-a11a-8950811c7ed3	characters
77039c8a-cfb8-4bf3-a569-bbb0218dbdd2	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
c6c088ca-d266-4f34-ba23-a95ebf02c42d	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
a0352f8f-323a-4c2d-b2a8-c1d7e9a7cd27	62b120c5-585a-4a6f-9c90-6c976c3aaebd	00e5e5d0-8763-4e6a-a11a-8950811c7ed3	characters
75b8f744-2f9f-43cd-ab18-3a9f6a4b55c6	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
09b8a6bd-550a-4421-a2db-63022b6e4cdc	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
53bbea20-f85f-466d-84d9-0524a8e83413	62b120c5-585a-4a6f-9c90-6c976c3aaebd	00e5e5d0-8763-4e6a-a11a-8950811c7ed3	characters
d0712e67-ae8f-46e6-a170-7b2d16b08972	9afb41f7-b413-4950-90ff-9893066daf77	06d43ae7-a804-4072-aa37-14800b4b13f1	characters
469518ec-d90e-46a4-8523-9abe6ef0168e	9afb41f7-b413-4950-90ff-9893066daf77	06d43ae7-a804-4072-aa37-14800b4b13f1	characters
fcd5b9f9-53c8-4d1a-81cb-0cd7bea0a8b1	9afb41f7-b413-4950-90ff-9893066daf77	06d43ae7-a804-4072-aa37-14800b4b13f1	characters
568e714c-50ae-47fa-8f67-1f867324626f	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
1902ee21-4951-49b8-bd3b-2fd6e47669ac	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
5f6c029a-1fc4-4e65-9928-dc5f047a5481	62b120c5-585a-4a6f-9c90-6c976c3aaebd	00e5e5d0-8763-4e6a-a11a-8950811c7ed3	characters
8162b661-01ce-4cfe-a573-27209c15e24e	62b120c5-585a-4a6f-9c90-6c976c3aaebd	c12df5fb-1beb-4450-97db-ba9636468d4f	characters
f5a23ea0-db37-4f22-b3fb-27caee84641a	62b120c5-585a-4a6f-9c90-6c976c3aaebd	1911b480-54b9-4ea2-967c-95f201f5ea67	characters
ff7481e5-f6f1-4086-b865-8af299ebb0dc	62b120c5-585a-4a6f-9c90-6c976c3aaebd	00e5e5d0-8763-4e6a-a11a-8950811c7ed3	characters
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, created_at, updated_at, title, project_id, icon) FROM stdin;
\.


--
-- Data for Name: entity_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.entity_permissions (id, related_id, permission_id, role_id, user_id) FROM stdin;
\.


--
-- Data for Name: eras; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.eras (id, title, parent_id, end_day, end_month, end_year, start_day, start_month, start_year, start_month_id, end_month_id, color) FROM stdin;
bf373c2b-a458-4220-9c2a-c51ef3a9ac24	First Pheagon era	4e26a73d-46ef-467d-80f5-5d8f7374c491	1	0	980	1	0	1	f4a1c779-21fe-4a4f-9e2f-44e34d8b1ac9	f4a1c779-21fe-4a4f-9e2f-44e34d8b1ac9	#2e1065
9681abcd-b677-4ae9-ba84-3b41f86fbb4f	Second Pheagon era	4e26a73d-46ef-467d-80f5-5d8f7374c491	1	0	1270	1	0	980	f4a1c779-21fe-4a4f-9e2f-44e34d8b1ac9	f4a1c779-21fe-4a4f-9e2f-44e34d8b1ac9	#4c1d95
298ab8f1-45bc-4277-a29b-085404c65b2a	Third Pheagon era	4e26a73d-46ef-467d-80f5-5d8f7374c491	1	0	1772	1	0	1270	f4a1c779-21fe-4a4f-9e2f-44e34d8b1ac9	f4a1c779-21fe-4a4f-9e2f-44e34d8b1ac9	#5b21b6
\.


--
-- Data for Name: event_characters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_characters (event_id, related_id) FROM stdin;
88b15ef0-bc44-4d88-adde-b352fd70c02a	aaa02323-5478-4373-9e25-bb1735c00e0e
88b15ef0-bc44-4d88-adde-b352fd70c02a	71675486-ae62-42b6-968e-d1b1ef917ef0
\.


--
-- Data for Name: event_map_pins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_map_pins (event_id, related_id) FROM stdin;
\.


--
-- Data for Name: leap_days; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leap_days (id, parent_id, month_id, conditions) FROM stdin;
\.


--
-- Data for Name: map_layers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.map_layers (id, title, parent_id, is_public, image_id) FROM stdin;
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, created_at, updated_at, content, sender_id, type, parent_id) FROM stdin;
3b61e8c3-b483-48b7-87f1-8a0bc82061b7	2023-11-14 07:05:16.871	2023-11-14 07:05:16.871	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "This is important to get right, what we're doing here could make or break everything we've been doing up until this point.", "type": "text"}]}]}	565e7175-64d0-4cab-85b2-c88d7adc966f	character	da010cf6-c874-472d-80ad-f1c63139fa8e
aba91f04-ca48-4c6d-9b58-627ec522e845	2023-11-14 07:06:08.936	2023-11-14 07:06:08.936	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Right.", "type": "text"}]}]}	b8569e15-dae4-484f-8ce5-d76ecebff7bd	character	da010cf6-c874-472d-80ad-f1c63139fa8e
717ce26f-8533-4598-8d16-c8b6b5143a7c	2023-11-14 07:11:57.743	2023-11-14 07:11:57.743	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Juliette and Uri nod.", "type": "text"}]}]}	\N	narration	da010cf6-c874-472d-80ad-f1c63139fa8e
e411736f-dd0d-411c-9692-da9f6f41ccdb	2023-11-14 07:13:00.778	2023-11-14 07:13:00.778	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "We're going in stealthily.", "type": "text"}]}]}	565e7175-64d0-4cab-85b2-c88d7adc966f	character	da010cf6-c874-472d-80ad-f1c63139fa8e
4bf58638-d5f7-462d-8e6b-9f944f169683	2023-11-14 07:15:28.169	2023-11-14 07:15:28.169	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "What happens if we get caught?", "type": "text"}]}]}	eae334ab-dbf6-47b2-916a-95c77902723b	character	da010cf6-c874-472d-80ad-f1c63139fa8e
9fa23ec1-1362-496a-8ec4-8d4866932e2b	2023-11-14 07:24:39.952	2023-11-14 07:24:39.952	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "We won't get caught.", "type": "text"}]}]}	565e7175-64d0-4cab-85b2-c88d7adc966f	character	da010cf6-c874-472d-80ad-f1c63139fa8e
e76c0309-34f7-4c4f-ba26-31c21527e3a3	2023-11-14 07:38:48.91	2023-11-14 07:38:48.91	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "But what if we do? There's obscura demons everywhere.", "type": "text"}]}]}	eae334ab-dbf6-47b2-916a-95c77902723b	character	da010cf6-c874-472d-80ad-f1c63139fa8e
0b2f31f2-5c54-4887-b79c-c970ffaa2f58	2023-11-14 07:39:18.096	2023-11-14 07:39:18.096	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "Juliette's coming with us for that very reason.", "type": "text"}]}]}	565e7175-64d0-4cab-85b2-c88d7adc966f	character	da010cf6-c874-472d-80ad-f1c63139fa8e
8af2bc9b-719c-4a69-b296-52f0c17744a3	2023-11-14 19:02:54.22	2023-11-14 19:02:54.22	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "TEst", "type": "text"}]}]}	565e7175-64d0-4cab-85b2-c88d7adc966f	character	da010cf6-c874-472d-80ad-f1c63139fa8e
a6d420ee-503b-4c1f-a578-f9e2de5bbc60	2023-11-14 19:02:54.856	2023-11-14 19:02:54.856	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "test", "type": "text"}]}]}	565e7175-64d0-4cab-85b2-c88d7adc966f	character	da010cf6-c874-472d-80ad-f1c63139fa8e
479dce90-41c4-4a1e-b380-83cb7bdce5fe	2023-11-14 19:02:55.506	2023-11-14 19:02:55.506	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "test", "type": "text"}]}]}	565e7175-64d0-4cab-85b2-c88d7adc966f	character	da010cf6-c874-472d-80ad-f1c63139fa8e
f14bfe13-64fd-46a4-adec-ef7985e798e0	2023-11-14 19:02:56.146	2023-11-14 19:02:56.146	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "test", "type": "text"}]}]}	565e7175-64d0-4cab-85b2-c88d7adc966f	character	da010cf6-c874-472d-80ad-f1c63139fa8e
7def600c-074c-409c-98a3-0048af373d3a	2023-11-14 19:02:56.796	2023-11-14 19:02:56.796	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "test", "type": "text"}]}]}	565e7175-64d0-4cab-85b2-c88d7adc966f	character	da010cf6-c874-472d-80ad-f1c63139fa8e
a333cc0b-cd2a-4deb-983b-27cd711048ae	2023-11-14 19:02:57.396	2023-11-14 19:02:57.396	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "test", "type": "text"}]}]}	565e7175-64d0-4cab-85b2-c88d7adc966f	character	da010cf6-c874-472d-80ad-f1c63139fa8e
50d8035b-4f64-45b6-b3c4-59141b946b3a	2023-11-14 19:02:58	2023-11-14 19:02:58	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "test", "type": "text"}]}]}	565e7175-64d0-4cab-85b2-c88d7adc966f	character	da010cf6-c874-472d-80ad-f1c63139fa8e
4072e6d6-bdd5-436c-9540-8bf1d7827467	2023-11-14 19:02:58.654	2023-11-14 19:02:58.654	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "test", "type": "text"}]}]}	565e7175-64d0-4cab-85b2-c88d7adc966f	character	da010cf6-c874-472d-80ad-f1c63139fa8e
ae0831dc-69c5-405a-8f39-ffe03fef55a6	2023-11-14 19:02:59.308	2023-11-14 19:02:59.308	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "test", "type": "text"}]}]}	565e7175-64d0-4cab-85b2-c88d7adc966f	character	da010cf6-c874-472d-80ad-f1c63139fa8e
a3ad832a-45f5-4551-b431-6490229e40ba	2023-11-14 19:02:59.96	2023-11-14 19:02:59.96	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "test", "type": "text"}]}]}	565e7175-64d0-4cab-85b2-c88d7adc966f	character	da010cf6-c874-472d-80ad-f1c63139fa8e
5ac64443-70fa-4e4b-b088-70be2c7d9b6a	2023-11-14 19:03:00.882	2023-11-14 19:03:00.882	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "test", "type": "text"}]}]}	565e7175-64d0-4cab-85b2-c88d7adc966f	character	da010cf6-c874-472d-80ad-f1c63139fa8e
b1503801-c81d-41ed-badc-b7b9d6a9fcbb	2023-11-14 19:03:01.458	2023-11-14 19:03:01.458	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "test", "type": "text"}]}]}	565e7175-64d0-4cab-85b2-c88d7adc966f	character	da010cf6-c874-472d-80ad-f1c63139fa8e
7d0128a9-d7cd-4e22-afed-ae7eaa562e30	2023-11-14 19:03:02.308	2023-11-14 19:03:02.308	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "test", "type": "text"}]}]}	565e7175-64d0-4cab-85b2-c88d7adc966f	character	da010cf6-c874-472d-80ad-f1c63139fa8e
7a11f53f-0dd3-4943-9c8d-c207e347d1d8	2023-11-14 19:03:03.018	2023-11-14 19:03:03.018	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "test", "type": "text"}]}]}	565e7175-64d0-4cab-85b2-c88d7adc966f	character	da010cf6-c874-472d-80ad-f1c63139fa8e
63f0f2dc-c36c-4e54-9873-564ad66b0993	2023-11-14 19:03:04.002	2023-11-14 19:03:04.002	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "test", "type": "text"}]}]}	565e7175-64d0-4cab-85b2-c88d7adc966f	character	da010cf6-c874-472d-80ad-f1c63139fa8e
31a905c7-204f-4db6-9c2d-ae58da3e240a	2023-11-14 19:03:04.766	2023-11-14 19:03:04.766	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "test", "type": "text"}]}]}	565e7175-64d0-4cab-85b2-c88d7adc966f	character	da010cf6-c874-472d-80ad-f1c63139fa8e
dbcefb32-4cea-48c4-a033-e3b1290d677c	2023-11-14 19:03:05.473	2023-11-14 19:03:05.473	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "test", "type": "text"}]}]}	565e7175-64d0-4cab-85b2-c88d7adc966f	character	da010cf6-c874-472d-80ad-f1c63139fa8e
32401419-de38-4332-8b52-3daafe445ee9	2023-11-14 19:03:06.258	2023-11-14 19:03:06.258	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "test", "type": "text"}]}]}	565e7175-64d0-4cab-85b2-c88d7adc966f	character	da010cf6-c874-472d-80ad-f1c63139fa8e
0d26a110-f9b3-4d96-9778-ceda542523c8	2023-11-14 19:03:07.27	2023-11-14 19:03:07.27	{"type": "doc", "content": [{"type": "paragraph", "attrs": {"style": "", "nodeIndent": null, "nodeLineHeight": null, "nodeTextAlignment": null}, "content": [{"text": "test", "type": "text"}]}]}	565e7175-64d0-4cab-85b2-c88d7adc966f	character	da010cf6-c874-472d-80ad-f1c63139fa8e
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, title, code, created_at, updated_at, parent_category) FROM stdin;
e319db75-85a5-45c2-b93a-72b08dd0ba36	Create characters	create_characters	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	0
8cf3ad0a-419c-4317-8405-8ddeaa499eb7	View characters	read_characters	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	0
e3134bca-5727-4b83-aa7d-52de5928486b	Edit characters	update_characters	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	0
cb4d6945-f282-4601-876d-11ef5186f8d3	Delete characters	delete_characters	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	0
6ed72274-3e77-4ae3-a040-c32cbc277b4d	Create blueprints	create_blueprints	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	1
6377d1cb-86a5-4c26-bea5-3077aafa9859	View blueprints	read_blueprints	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	1
9428474a-32b2-4a06-bade-20be6a37d4fe	Edit blueprints	update_blueprints	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	1
bbe8439b-96ef-47e8-96f9-b78392973e31	Delete blueprints	delete_blueprints	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	1
b01e97b8-e2ee-41b1-aaaf-0fff52169010	Create blueprint instances	create_blueprint_instances	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	1
68de7818-a5ba-400a-a1d4-f69cb95d95ae	View blueprint instances	read_blueprint_instances	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	1
ed14d8e2-967a-43bb-afe5-d295a9562311	Edit blueprint instances	update_blueprint_instances	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	1
1b10b46a-338a-443a-9773-50b3f70c496a	Delete blueprint instances	delete_blueprint_instances	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	1
b59b8028-2c23-4da1-bce8-7283ca38455c	Create documents	create_documents	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	2
f56e02fb-c57a-4ab4-9572-a26203598983	View documents	read_documents	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	2
1b3a03a6-7a96-453d-9e76-9df264e54b19	Edit documents	update_documents	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	2
9bda87fa-9285-46a2-a0a6-4db0ede30c26	Delete documents	delete_documents	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	2
d1fa8b2a-d711-4a25-8b5a-3613e0895eca	Create maps	create_maps	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	3
24a538d8-f1c6-4cf0-b1a4-6300da8e424a	View maps	read_maps	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	3
28b94e2e-1849-4313-ba25-493b1e0e5b41	Edit maps	update_maps	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	3
b9faac70-9be1-4eb7-ae4d-a30e4fadb50a	Delete maps	delete_maps	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	3
b79a61b9-f175-49f8-a8c8-a4fe1e3a9a26	Create graphs	create_graphs	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	4
cb4d1a0f-064b-4615-b49b-d2abe44d3750	View graphs	read_graphs	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	4
9a2883e8-fb21-4354-8c7a-92d19f028d80	Edit graphs	update_graphs	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	4
04cec223-cf03-4af5-935d-4e38627f8692	Delete graphs	delete_graphs	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	4
7ba67951-e4d0-4ae2-96a2-d2d6fa0403d7	Create calendars	create_calendars	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	5
5c8e50e5-aab5-4725-9fc6-aaa396d4ce82	View calendars	read_calendars	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	5
740cdef8-f670-4931-a128-dfecf54149aa	Edit calendars	update_calendars	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	5
93f2189f-94f1-4c62-9fce-a9cf754f2060	Delete calendars	delete_calendars	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	5
bf7ccb68-30de-4c92-9d75-6dd5a8cc3ee6	Create dictionaries	create_dictionaries	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	6
bc08f143-68c8-45cf-9512-d9a13a884f25	View dictionaries	read_dictionaries	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	6
0a353f9b-9647-442d-a308-df2459270f8d	Edit dictionaries	update_dictionaries	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	6
f5576572-9fe1-4c08-b197-24edb49f30a5	Delete dictionaries	delete_dictionaries	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	6
e7a349a1-4c73-494c-b928-8f062822bdb8	Create random tables	create_random_tables	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	7
f8278201-f24b-41cc-8212-942b729d847d	View random tables	read_random_tables	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	7
254c8e78-5009-4be5-97a6-e619e48ed621	Edit random tables	update_random_tables	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	7
b53fe5b7-23b3-4732-8668-9f954038f052	Delete random tables	delete_random_tables	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	7
5361a51a-3af4-42a9-9c83-bff2d0a4a206	Create tags	create_tags	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	8
c2e5deb7-60d3-4440-aa1b-bf6e803e0fe9	View tags	read_tags	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	8
cfc1b528-d8e4-4673-a901-0ec158b7d78f	Edit tags	update_tags	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	8
5a31a467-e914-4530-b843-2b7512a18c62	Delete tags	delete_tags	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	8
52c16364-65b1-4ba5-ab9e-caa60f29f0f5	Create character templates	create_character_fields_templates	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	0
bc0ce474-2347-4057-a6a1-c4e6b8df0752	View character templates	read_character_fields_templates	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	0
46bc9e31-91db-4ce9-be04-4b5588d2c75f	Edit character templates	update_character_fields_templates	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	0
8a7cb970-08bb-4296-bd83-74becfe9c32c	Delete character templates	delete_character_fields_templates	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	0
176d0266-9ce7-4f9c-9989-d128e7db7281	Upload assets	create_assets	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	9
8c42cc7c-7a61-45e3-962f-cf6ddadbd53b	View assets	read_assets	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	9
5c303ad9-45c4-4b56-9660-71667fd115ee	Edit assets	update_assets	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	9
2d4e3d9a-822b-45ae-80c1-d1ff92b4daf8	Delete assets	delete_assets	2024-03-28 15:42:31.464	2024-03-28 15:42:31.464	9
1f4d4ea6-8054-4c3c-a2ed-42bee84fbab1	Create events	create_events	2024-04-06 08:34:05.455	2024-04-06 08:34:05.455	5
3eec99a6-519e-4f91-9fe6-6a18bac9bd6d	View events	read_events	2024-04-06 08:34:05.455	2024-04-06 08:34:05.455	5
c3f293c1-de61-4a39-ba1d-f68730f9ef18	Edit events	update_events	2024-04-06 08:34:05.455	2024-04-06 08:34:05.455	5
46ff8b73-ab3f-4a93-bb8d-85ffcbdec977	Delete events	delete_events	2024-04-06 08:34:05.455	2024-04-06 08:34:05.455	5
4db230c8-7180-4164-81e5-0628c5d85640	Create map pins	create_map_pins	2024-04-06 08:34:06.922	2024-04-06 08:34:06.922	3
5c6a7690-8585-4fdf-9309-4e80e3ec3c54	View map pins	read_map_pins	2024-04-06 08:34:06.922	2024-04-06 08:34:06.922	3
531e269b-4eb6-4398-909b-65badc3f5e9b	Edit map pins	update_map_pins	2024-04-06 08:34:06.922	2024-04-06 08:34:06.922	3
2fbafc0d-0466-4322-b4f8-02d265087cd1	Delete map pins	delete_map_pins	2024-04-06 08:34:06.922	2024-04-06 08:34:06.922	3
cddf698c-9812-4bfb-8f58-6a884f7e3506	Create words	create_words	2024-04-06 08:34:06.922	2024-04-06 08:34:06.922	6
1aa6a024-8f9a-49f4-b4e5-d4938688b272	View words	read_words	2024-04-06 08:34:06.922	2024-04-06 08:34:06.922	6
2ab957b3-9dbd-419e-b6e0-0dd5431420f7	Edit words	update_words	2024-04-06 08:34:06.922	2024-04-06 08:34:06.922	6
40435196-9a64-4444-b358-fc9a6fa6c8be	Delete words	delete_words	2024-04-06 08:34:06.922	2024-04-06 08:34:06.922	6
\.


--
-- Data for Name: random_table_options; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.random_table_options (id, title, description, parent_id, icon, icon_color) FROM stdin;
e7e9c06d-509c-4555-82fa-cdacc4445f33	8. Umbra - Shadowstep	Once per day as a bonus action when you are in dim light or darkness you can teleport up to 60 feet to an unoccupied space you can see that is also in dim light or darkness.	156a9986-2502-4de9-8adc-489cfb4d80c0	\N	\N
27507d98-6609-485c-b3fb-3de45498f3e2	1. Lux - Daybringer	Once while you have this blessing you can cast the Daylight spell.	156a9986-2502-4de9-8adc-489cfb4d80c0	\N	\N
a7089fdf-993b-435b-8b60-7b2047fdc3ad	2. Verumal - Truthseeker	Once while you have this blessing you may cast the Zone of Truth spell.	156a9986-2502-4de9-8adc-489cfb4d80c0	\N	\N
7fecee04-507e-4acc-96de-0ef17d6cac74	3. Vivus - Quintessence	Once while you have this blessing you can cast the spell Death Ward.	156a9986-2502-4de9-8adc-489cfb4d80c0	\N	\N
5cd8157b-a148-49c9-8423-f2d893a29cb0	4. Lacuno - Guardian	Once per day while you have this blessing you can cast the spell Shield of Faith. 	156a9986-2502-4de9-8adc-489cfb4d80c0	\N	\N
dc16ded1-405b-4085-b36b-684d90e54456	5. Medela - Archmagus	Once while you have this blessing you can restore all expended spell slots as a bonus action. 	156a9986-2502-4de9-8adc-489cfb4d80c0	\N	\N
a6484300-dd79-405a-a0b8-1dc5b8f21899	6. Fiducia - Redo	Once while you have this blessing you can grant advantage or disadvantage on any roll within 30ft of you.	156a9986-2502-4de9-8adc-489cfb4d80c0	\N	\N
eedf5792-177a-4c07-bc08-ea1d2fd0f5b4	7. Trisitia - Tears without fears	Once while you have this blessing you can remove one condition as a bonus action.	156a9986-2502-4de9-8adc-489cfb4d80c0	\N	\N
afabdbdd-5d29-4ff8-8e7e-08a29d9ac782	9. Obscurum - Luck of the roll	Once while you have this blessing you can reroll any roll you made and choose which roll to keep.	156a9986-2502-4de9-8adc-489cfb4d80c0	\N	\N
cb555dd3-5321-4122-9058-e5837d11a9fd	10. Mersus - Infliction	Once while you have this blessing you can cast the Inflict Wounds spell.	156a9986-2502-4de9-8adc-489cfb4d80c0	\N	\N
72484add-4d72-47cc-a20d-80cb84571350	11. Fragor - Conquest	Once per day while you have this blessing as a bonus action you can gain advantage against one enemy that is within 10 ft of you for the next minute or until you or the enemy fall unconscious.	156a9986-2502-4de9-8adc-489cfb4d80c0	\N	\N
53ad84c7-ff49-49fa-b8e7-38b96f9f0646	12. Morbus - Infection	Once while you have this blessing you can cast the Blight spell.	156a9986-2502-4de9-8adc-489cfb4d80c0	\N	\N
3025e4f6-3f3b-47af-9f9e-42361ec240c5	13. Mevor - Subjugation	Once while you have this blessing you can cast the Dominate Person spell.	156a9986-2502-4de9-8adc-489cfb4d80c0	\N	\N
57d8135f-f63d-4b1e-836f-2314f2d871de	14. Iraqunda - Cleansing Fury	Once while you have this blessing you can use the Action Surge feature.	156a9986-2502-4de9-8adc-489cfb4d80c0	\N	\N
43ea2c7d-2d71-4432-99c7-41427f35f0db	15. Wishing god - Portent	Roll a d6 and a d10. Then pick a number between 1 and 14. You gain a blessing...	156a9986-2502-4de9-8adc-489cfb4d80c0	\N	\N
\.


--
-- Data for Name: random_table_suboptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.random_table_suboptions (id, title, description, parent_id) FROM stdin;
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_permissions (role_id, permission_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schema_migrations (version) FROM stdin;
20240408164006
20240409061711
20240409074236
20240422075931
\.


--
-- Data for Name: user_project_feature_flags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_project_feature_flags (user_id, project_id, feature_flags) FROM stdin;
00fb25f1-2f47-40e3-bcaf-35d303c10207	43e1c879-415b-4394-95ad-f9a4c42a43c5	{"maps_enabled": true, "graphs_enabled": true, "calendars_enabled": true, "documents_enabled": true, "blueprints_enabled": true, "characters_enabled": true, "dictionaries_enabled": true, "random_tables_enabled": true, "character_fields_templates_enabled": true}
00fb25f1-2f47-40e3-bcaf-35d303c10207	eb68433a-64b2-4bf9-92a8-5625f46ad59f	{"documents_enabled": true, "blueprints_enabled": true, "characters_enabled": true, "random_tables_enabled": true}
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (user_id, role_id, project_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_sessions (id, expires_at, user_id) FROM stdin;
\.


--
-- Data for Name: webhooks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.webhooks (id, title, url, user_id) FROM stdin;
09307e7c-8776-473f-82bf-e3466375c2fe	The tavern webhook	https://discord.com/api/webhooks/1090661254961565706/7SW1fYprInEHvk1hwfik8qIMQjnTTUAsd-JwN1sdlZjVA89nHbPoE5XY3BfHSjF87tsq	00fb25f1-2f47-40e3-bcaf-35d303c10207
\.


--
-- Data for Name: words; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.words (id, title, description, translation, parent_id, deleted_at, owner_id) FROM stdin;
976ce450-6835-426b-9e47-fc24d04d2a26	Maat'len	One of the 12 great cities.	House of order	2673920c-ec23-44e5-b218-47494075573a	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
c52a229e-8b07-4b33-80a4-a4aa6b41cc6d	Pheagon	Generally refers to the Sovereign of the Pheagon Empire.	Protector	b51209b4-bd17-4b45-932d-0b95d77132a5	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
0e848229-1db7-4ae0-b85a-1fd66ab30d60	Weissteria	Name of a plant which is native to Xaf, known as "Wisteria" in the Empire.	White earth	fde18d14-aa78-489a-93aa-48e4d7b3f427	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
ac694dbf-ceff-4fc0-a217-c897ba0b47dc	Ercaryn	Elves who can access and read the memories of others.	True elf	2673920c-ec23-44e5-b218-47494075573a	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
9378604a-111b-47cc-9aa1-324e84314964	Tel'Vandor Athrell	A forest that spans the globe and can transport anyone within its bounds to anywhere else in the forest, if it so chooses.	Forest of many places	2673920c-ec23-44e5-b218-47494075573a	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
5805c411-0f50-49e5-b741-870edac260f9	Soler	\N	Sun	2673920c-ec23-44e5-b218-47494075573a	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
abda110e-222f-44b6-957c-6d7ba9c27756	Aren	\N	Star	2673920c-ec23-44e5-b218-47494075573a	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
ac9104a8-99e8-4f48-bcaf-9ff11eb0c02b	Sol'aren	What the people of Maat'len referred to themselves in comparison to the other flying cities.	Sun among stars	2673920c-ec23-44e5-b218-47494075573a	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
a2ca36bb-1a3a-4843-913c-72a6abb3fb32	Artifex	The twelve architects of Maat'len who created the first spirits and demons.	Architect	b51209b4-bd17-4b45-932d-0b95d77132a5	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
ee9fc3fa-cc8b-4263-b5e6-f895382a4b4f	Tel	\N	Forest	2673920c-ec23-44e5-b218-47494075573a	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
13f808d8-f299-4e4e-a90d-7aad90c526c9	Vandor	\N	Place/s	2673920c-ec23-44e5-b218-47494075573a	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
ba640a0f-82ba-4ad2-ae23-49f25baead09	Athrell	\N	Many/Multiple/Plurality	2673920c-ec23-44e5-b218-47494075573a	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
51f67ee5-514a-4e2d-9772-bb4f0b7d6e90	Len	\N	House	2673920c-ec23-44e5-b218-47494075573a	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
666b9254-a828-4325-9d0b-57dd5f6b7dba	Maat	\N	Order	2673920c-ec23-44e5-b218-47494075573a	\N	00fb25f1-2f47-40e3-bcaf-35d303c10207
\.


--
-- PostgreSQL database dump complete
--

