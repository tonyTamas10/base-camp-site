import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_events_teams_group" AS ENUM('A', 'B');
  CREATE TYPE "public"."enum_events_matches_stage" AS ENUM('group', 'semi-final', 'third-place', 'final');
  CREATE TYPE "public"."enum_events_matches_group" AS ENUM('A', 'B');
  CREATE TYPE "public"."enum_events_matches_penalty_winner" AS ENUM('home', 'away');
  CREATE TYPE "public"."enum_events_accent" AS ENUM('signal', 'amber', 'pale-blue', 'mint', 'rose');
  CREATE TYPE "public"."enum_events_kind" AS ENUM('team', 'track');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_teams_group" AS ENUM('A', 'B');
  CREATE TYPE "public"."enum__events_v_version_matches_stage" AS ENUM('group', 'semi-final', 'third-place', 'final');
  CREATE TYPE "public"."enum__events_v_version_matches_group" AS ENUM('A', 'B');
  CREATE TYPE "public"."enum__events_v_version_matches_penalty_winner" AS ENUM('home', 'away');
  CREATE TYPE "public"."enum__events_v_version_accent" AS ENUM('signal', 'amber', 'pale-blue', 'mint', 'rose');
  CREATE TYPE "public"."enum__events_v_version_kind" AS ENUM('team', 'track');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_sports_kind" AS ENUM('team', 'track');
  CREATE TYPE "public"."enum_sports_geometry" AS ENUM('mini-pitch', 'pitch', 'oval', 'lanes');
  CREATE TYPE "public"."enum_sponsor_enquiries_interest" AS ENUM('event', 'season', 'kit', 'venue', 'unsure');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TABLE "events_schedule_slots" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"time" varchar,
  	"title" varchar,
  	"detail" varchar
  );
  
  CREATE TABLE "events_schedule" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone,
  	"title" varchar
  );
  
  CREATE TABLE "events_teams_players" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"goals" numeric DEFAULT 0
  );
  
  CREATE TABLE "events_teams" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"code" varchar,
  	"group" "enum_events_teams_group",
  	"crest_fill" varchar DEFAULT '#FF5B1A',
  	"crest_ink" varchar DEFAULT '#050A2C'
  );
  
  CREATE TABLE "events_matches" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"stage" "enum_events_matches_stage",
  	"group" "enum_events_matches_group",
  	"round" numeric,
  	"home_team" varchar,
  	"home_goals" numeric,
  	"away_goals" numeric,
  	"away_team" varchar,
  	"penalty_winner" "enum_events_matches_penalty_winner"
  );
  
  CREATE TABLE "events_heats_lanes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"lane" numeric,
  	"athlete" varchar,
  	"club" varchar,
  	"time" numeric
  );
  
  CREATE TABLE "events_heats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" numeric,
  	"start_time" varchar
  );
  
  CREATE TABLE "events_blocks_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"pull_quote" varchar,
  	"pull_quote_emphasis" varchar,
  	"body" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "events_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "events_blocks_schedule" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "events_blocks_teams" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "events_blocks_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "events_blocks_bracket" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "events_blocks_results" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "events_blocks_players" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "events_blocks_heats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "events_blocks_rankings" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "events_blocks_records" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "events_blocks_venue" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"surface" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "events_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "events_blocks_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "events_blocks_registration" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "events_blocks_related" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"sport_id" integer,
  	"date" timestamp(3) with time zone,
  	"venue" varchar,
  	"city" varchar DEFAULT 'Cluj-Napoca',
  	"accent" "enum_events_accent" DEFAULT 'amber',
  	"distance" varchar,
  	"slug" varchar,
  	"kind" "enum_events_kind",
  	"participants" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "events_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"partners_id" integer
  );
  
  CREATE TABLE "_events_v_version_schedule_slots" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"time" varchar,
  	"title" varchar,
  	"detail" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_events_v_version_schedule" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_events_v_version_teams_players" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"goals" numeric DEFAULT 0,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_events_v_version_teams" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"code" varchar,
  	"group" "enum__events_v_version_teams_group",
  	"crest_fill" varchar DEFAULT '#FF5B1A',
  	"crest_ink" varchar DEFAULT '#050A2C',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_events_v_version_matches" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"stage" "enum__events_v_version_matches_stage",
  	"group" "enum__events_v_version_matches_group",
  	"round" numeric,
  	"home_team" varchar,
  	"home_goals" numeric,
  	"away_goals" numeric,
  	"away_team" varchar,
  	"penalty_winner" "enum__events_v_version_matches_penalty_winner",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_events_v_version_heats_lanes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"lane" numeric,
  	"athlete" varchar,
  	"club" varchar,
  	"time" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_events_v_version_heats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" numeric,
  	"start_time" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_events_v_blocks_story" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"pull_quote" varchar,
  	"pull_quote_emphasis" varchar,
  	"body" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_events_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_events_v_blocks_schedule" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_events_v_blocks_teams" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_events_v_blocks_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_events_v_blocks_bracket" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_events_v_blocks_results" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_events_v_blocks_players" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_events_v_blocks_heats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_events_v_blocks_rankings" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_events_v_blocks_records" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_events_v_blocks_venue" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"surface" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_events_v_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_events_v_blocks_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_events_v_blocks_registration" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_events_v_blocks_related" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_sport_id" integer,
  	"version_date" timestamp(3) with time zone,
  	"version_venue" varchar,
  	"version_city" varchar DEFAULT 'Cluj-Napoca',
  	"version_accent" "enum__events_v_version_accent" DEFAULT 'amber',
  	"version_distance" varchar,
  	"version_slug" varchar,
  	"version_kind" "enum__events_v_version_kind",
  	"version_participants" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_events_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"partners_id" integer
  );
  
  CREATE TABLE "sports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"kind" "enum_sports_kind" DEFAULT 'team' NOT NULL,
  	"geometry" "enum_sports_geometry" NOT NULL,
  	"squad_size" numeric,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer,
  	"website" varchar,
  	"order" numeric DEFAULT 0,
  	"placeholder_mark" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_wide_url" varchar,
  	"sizes_wide_width" numeric,
  	"sizes_wide_height" numeric,
  	"sizes_wide_mime_type" varchar,
  	"sizes_wide_filesize" numeric,
  	"sizes_wide_filename" varchar
  );
  
  CREATE TABLE "registrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"event_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"team" varchar,
  	"handled" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sponsor_enquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"organisation" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"interest" "enum_sponsor_enquiries_interest" NOT NULL,
  	"message" varchar,
  	"handled" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contact_messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"handled" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"events_id" integer,
  	"sports_id" integer,
  	"partners_id" integer,
  	"media_id" integer,
  	"registrations_id" integer,
  	"sponsor_enquiries_id" integer,
  	"contact_messages_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"default_season_year" numeric,
  	"contact_email" varchar,
  	"show_prototype_badge" boolean DEFAULT false,
  	"showcase_event_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"events_id" integer
  );
  
  ALTER TABLE "events_schedule_slots" ADD CONSTRAINT "events_schedule_slots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events_schedule"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_schedule" ADD CONSTRAINT "events_schedule_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_teams_players" ADD CONSTRAINT "events_teams_players_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events_teams"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_teams" ADD CONSTRAINT "events_teams_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_matches" ADD CONSTRAINT "events_matches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_heats_lanes" ADD CONSTRAINT "events_heats_lanes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events_heats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_heats" ADD CONSTRAINT "events_heats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_blocks_story" ADD CONSTRAINT "events_blocks_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_blocks_stats" ADD CONSTRAINT "events_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_blocks_schedule" ADD CONSTRAINT "events_blocks_schedule_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_blocks_teams" ADD CONSTRAINT "events_blocks_teams_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_blocks_groups" ADD CONSTRAINT "events_blocks_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_blocks_bracket" ADD CONSTRAINT "events_blocks_bracket_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_blocks_results" ADD CONSTRAINT "events_blocks_results_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_blocks_players" ADD CONSTRAINT "events_blocks_players_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_blocks_heats" ADD CONSTRAINT "events_blocks_heats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_blocks_rankings" ADD CONSTRAINT "events_blocks_rankings_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_blocks_records" ADD CONSTRAINT "events_blocks_records_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_blocks_venue" ADD CONSTRAINT "events_blocks_venue_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_blocks_gallery" ADD CONSTRAINT "events_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_blocks_partners" ADD CONSTRAINT "events_blocks_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_blocks_registration" ADD CONSTRAINT "events_blocks_registration_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_blocks_related" ADD CONSTRAINT "events_blocks_related_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_sport_id_sports_id_fk" FOREIGN KEY ("sport_id") REFERENCES "public"."sports"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_schedule_slots" ADD CONSTRAINT "_events_v_version_schedule_slots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v_version_schedule"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_schedule" ADD CONSTRAINT "_events_v_version_schedule_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_teams_players" ADD CONSTRAINT "_events_v_version_teams_players_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v_version_teams"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_teams" ADD CONSTRAINT "_events_v_version_teams_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_matches" ADD CONSTRAINT "_events_v_version_matches_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_heats_lanes" ADD CONSTRAINT "_events_v_version_heats_lanes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v_version_heats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_version_heats" ADD CONSTRAINT "_events_v_version_heats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_blocks_story" ADD CONSTRAINT "_events_v_blocks_story_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_blocks_stats" ADD CONSTRAINT "_events_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_blocks_schedule" ADD CONSTRAINT "_events_v_blocks_schedule_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_blocks_teams" ADD CONSTRAINT "_events_v_blocks_teams_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_blocks_groups" ADD CONSTRAINT "_events_v_blocks_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_blocks_bracket" ADD CONSTRAINT "_events_v_blocks_bracket_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_blocks_results" ADD CONSTRAINT "_events_v_blocks_results_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_blocks_players" ADD CONSTRAINT "_events_v_blocks_players_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_blocks_heats" ADD CONSTRAINT "_events_v_blocks_heats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_blocks_rankings" ADD CONSTRAINT "_events_v_blocks_rankings_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_blocks_records" ADD CONSTRAINT "_events_v_blocks_records_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_blocks_venue" ADD CONSTRAINT "_events_v_blocks_venue_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_blocks_gallery" ADD CONSTRAINT "_events_v_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_blocks_partners" ADD CONSTRAINT "_events_v_blocks_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_blocks_registration" ADD CONSTRAINT "_events_v_blocks_registration_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_blocks_related" ADD CONSTRAINT "_events_v_blocks_related_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_sport_id_sports_id_fk" FOREIGN KEY ("version_sport_id") REFERENCES "public"."sports"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "registrations" ADD CONSTRAINT "registrations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sports_fk" FOREIGN KEY ("sports_id") REFERENCES "public"."sports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_registrations_fk" FOREIGN KEY ("registrations_id") REFERENCES "public"."registrations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sponsor_enquiries_fk" FOREIGN KEY ("sponsor_enquiries_id") REFERENCES "public"."sponsor_enquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_messages_fk" FOREIGN KEY ("contact_messages_id") REFERENCES "public"."contact_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_showcase_event_id_events_id_fk" FOREIGN KEY ("showcase_event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "events_schedule_slots_order_idx" ON "events_schedule_slots" USING btree ("_order");
  CREATE INDEX "events_schedule_slots_parent_id_idx" ON "events_schedule_slots" USING btree ("_parent_id");
  CREATE INDEX "events_schedule_order_idx" ON "events_schedule" USING btree ("_order");
  CREATE INDEX "events_schedule_parent_id_idx" ON "events_schedule" USING btree ("_parent_id");
  CREATE INDEX "events_teams_players_order_idx" ON "events_teams_players" USING btree ("_order");
  CREATE INDEX "events_teams_players_parent_id_idx" ON "events_teams_players" USING btree ("_parent_id");
  CREATE INDEX "events_teams_order_idx" ON "events_teams" USING btree ("_order");
  CREATE INDEX "events_teams_parent_id_idx" ON "events_teams" USING btree ("_parent_id");
  CREATE INDEX "events_matches_order_idx" ON "events_matches" USING btree ("_order");
  CREATE INDEX "events_matches_parent_id_idx" ON "events_matches" USING btree ("_parent_id");
  CREATE INDEX "events_heats_lanes_order_idx" ON "events_heats_lanes" USING btree ("_order");
  CREATE INDEX "events_heats_lanes_parent_id_idx" ON "events_heats_lanes" USING btree ("_parent_id");
  CREATE INDEX "events_heats_order_idx" ON "events_heats" USING btree ("_order");
  CREATE INDEX "events_heats_parent_id_idx" ON "events_heats" USING btree ("_parent_id");
  CREATE INDEX "events_blocks_story_order_idx" ON "events_blocks_story" USING btree ("_order");
  CREATE INDEX "events_blocks_story_parent_id_idx" ON "events_blocks_story" USING btree ("_parent_id");
  CREATE INDEX "events_blocks_story_path_idx" ON "events_blocks_story" USING btree ("_path");
  CREATE INDEX "events_blocks_stats_order_idx" ON "events_blocks_stats" USING btree ("_order");
  CREATE INDEX "events_blocks_stats_parent_id_idx" ON "events_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "events_blocks_stats_path_idx" ON "events_blocks_stats" USING btree ("_path");
  CREATE INDEX "events_blocks_schedule_order_idx" ON "events_blocks_schedule" USING btree ("_order");
  CREATE INDEX "events_blocks_schedule_parent_id_idx" ON "events_blocks_schedule" USING btree ("_parent_id");
  CREATE INDEX "events_blocks_schedule_path_idx" ON "events_blocks_schedule" USING btree ("_path");
  CREATE INDEX "events_blocks_teams_order_idx" ON "events_blocks_teams" USING btree ("_order");
  CREATE INDEX "events_blocks_teams_parent_id_idx" ON "events_blocks_teams" USING btree ("_parent_id");
  CREATE INDEX "events_blocks_teams_path_idx" ON "events_blocks_teams" USING btree ("_path");
  CREATE INDEX "events_blocks_groups_order_idx" ON "events_blocks_groups" USING btree ("_order");
  CREATE INDEX "events_blocks_groups_parent_id_idx" ON "events_blocks_groups" USING btree ("_parent_id");
  CREATE INDEX "events_blocks_groups_path_idx" ON "events_blocks_groups" USING btree ("_path");
  CREATE INDEX "events_blocks_bracket_order_idx" ON "events_blocks_bracket" USING btree ("_order");
  CREATE INDEX "events_blocks_bracket_parent_id_idx" ON "events_blocks_bracket" USING btree ("_parent_id");
  CREATE INDEX "events_blocks_bracket_path_idx" ON "events_blocks_bracket" USING btree ("_path");
  CREATE INDEX "events_blocks_results_order_idx" ON "events_blocks_results" USING btree ("_order");
  CREATE INDEX "events_blocks_results_parent_id_idx" ON "events_blocks_results" USING btree ("_parent_id");
  CREATE INDEX "events_blocks_results_path_idx" ON "events_blocks_results" USING btree ("_path");
  CREATE INDEX "events_blocks_players_order_idx" ON "events_blocks_players" USING btree ("_order");
  CREATE INDEX "events_blocks_players_parent_id_idx" ON "events_blocks_players" USING btree ("_parent_id");
  CREATE INDEX "events_blocks_players_path_idx" ON "events_blocks_players" USING btree ("_path");
  CREATE INDEX "events_blocks_heats_order_idx" ON "events_blocks_heats" USING btree ("_order");
  CREATE INDEX "events_blocks_heats_parent_id_idx" ON "events_blocks_heats" USING btree ("_parent_id");
  CREATE INDEX "events_blocks_heats_path_idx" ON "events_blocks_heats" USING btree ("_path");
  CREATE INDEX "events_blocks_rankings_order_idx" ON "events_blocks_rankings" USING btree ("_order");
  CREATE INDEX "events_blocks_rankings_parent_id_idx" ON "events_blocks_rankings" USING btree ("_parent_id");
  CREATE INDEX "events_blocks_rankings_path_idx" ON "events_blocks_rankings" USING btree ("_path");
  CREATE INDEX "events_blocks_records_order_idx" ON "events_blocks_records" USING btree ("_order");
  CREATE INDEX "events_blocks_records_parent_id_idx" ON "events_blocks_records" USING btree ("_parent_id");
  CREATE INDEX "events_blocks_records_path_idx" ON "events_blocks_records" USING btree ("_path");
  CREATE INDEX "events_blocks_venue_order_idx" ON "events_blocks_venue" USING btree ("_order");
  CREATE INDEX "events_blocks_venue_parent_id_idx" ON "events_blocks_venue" USING btree ("_parent_id");
  CREATE INDEX "events_blocks_venue_path_idx" ON "events_blocks_venue" USING btree ("_path");
  CREATE INDEX "events_blocks_gallery_order_idx" ON "events_blocks_gallery" USING btree ("_order");
  CREATE INDEX "events_blocks_gallery_parent_id_idx" ON "events_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "events_blocks_gallery_path_idx" ON "events_blocks_gallery" USING btree ("_path");
  CREATE INDEX "events_blocks_partners_order_idx" ON "events_blocks_partners" USING btree ("_order");
  CREATE INDEX "events_blocks_partners_parent_id_idx" ON "events_blocks_partners" USING btree ("_parent_id");
  CREATE INDEX "events_blocks_partners_path_idx" ON "events_blocks_partners" USING btree ("_path");
  CREATE INDEX "events_blocks_registration_order_idx" ON "events_blocks_registration" USING btree ("_order");
  CREATE INDEX "events_blocks_registration_parent_id_idx" ON "events_blocks_registration" USING btree ("_parent_id");
  CREATE INDEX "events_blocks_registration_path_idx" ON "events_blocks_registration" USING btree ("_path");
  CREATE INDEX "events_blocks_related_order_idx" ON "events_blocks_related" USING btree ("_order");
  CREATE INDEX "events_blocks_related_parent_id_idx" ON "events_blocks_related" USING btree ("_parent_id");
  CREATE INDEX "events_blocks_related_path_idx" ON "events_blocks_related" USING btree ("_path");
  CREATE INDEX "events_sport_idx" ON "events" USING btree ("sport_id");
  CREATE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE INDEX "events_rels_order_idx" ON "events_rels" USING btree ("order");
  CREATE INDEX "events_rels_parent_idx" ON "events_rels" USING btree ("parent_id");
  CREATE INDEX "events_rels_path_idx" ON "events_rels" USING btree ("path");
  CREATE INDEX "events_rels_media_id_idx" ON "events_rels" USING btree ("media_id");
  CREATE INDEX "events_rels_partners_id_idx" ON "events_rels" USING btree ("partners_id");
  CREATE INDEX "_events_v_version_schedule_slots_order_idx" ON "_events_v_version_schedule_slots" USING btree ("_order");
  CREATE INDEX "_events_v_version_schedule_slots_parent_id_idx" ON "_events_v_version_schedule_slots" USING btree ("_parent_id");
  CREATE INDEX "_events_v_version_schedule_order_idx" ON "_events_v_version_schedule" USING btree ("_order");
  CREATE INDEX "_events_v_version_schedule_parent_id_idx" ON "_events_v_version_schedule" USING btree ("_parent_id");
  CREATE INDEX "_events_v_version_teams_players_order_idx" ON "_events_v_version_teams_players" USING btree ("_order");
  CREATE INDEX "_events_v_version_teams_players_parent_id_idx" ON "_events_v_version_teams_players" USING btree ("_parent_id");
  CREATE INDEX "_events_v_version_teams_order_idx" ON "_events_v_version_teams" USING btree ("_order");
  CREATE INDEX "_events_v_version_teams_parent_id_idx" ON "_events_v_version_teams" USING btree ("_parent_id");
  CREATE INDEX "_events_v_version_matches_order_idx" ON "_events_v_version_matches" USING btree ("_order");
  CREATE INDEX "_events_v_version_matches_parent_id_idx" ON "_events_v_version_matches" USING btree ("_parent_id");
  CREATE INDEX "_events_v_version_heats_lanes_order_idx" ON "_events_v_version_heats_lanes" USING btree ("_order");
  CREATE INDEX "_events_v_version_heats_lanes_parent_id_idx" ON "_events_v_version_heats_lanes" USING btree ("_parent_id");
  CREATE INDEX "_events_v_version_heats_order_idx" ON "_events_v_version_heats" USING btree ("_order");
  CREATE INDEX "_events_v_version_heats_parent_id_idx" ON "_events_v_version_heats" USING btree ("_parent_id");
  CREATE INDEX "_events_v_blocks_story_order_idx" ON "_events_v_blocks_story" USING btree ("_order");
  CREATE INDEX "_events_v_blocks_story_parent_id_idx" ON "_events_v_blocks_story" USING btree ("_parent_id");
  CREATE INDEX "_events_v_blocks_story_path_idx" ON "_events_v_blocks_story" USING btree ("_path");
  CREATE INDEX "_events_v_blocks_stats_order_idx" ON "_events_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_events_v_blocks_stats_parent_id_idx" ON "_events_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_events_v_blocks_stats_path_idx" ON "_events_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_events_v_blocks_schedule_order_idx" ON "_events_v_blocks_schedule" USING btree ("_order");
  CREATE INDEX "_events_v_blocks_schedule_parent_id_idx" ON "_events_v_blocks_schedule" USING btree ("_parent_id");
  CREATE INDEX "_events_v_blocks_schedule_path_idx" ON "_events_v_blocks_schedule" USING btree ("_path");
  CREATE INDEX "_events_v_blocks_teams_order_idx" ON "_events_v_blocks_teams" USING btree ("_order");
  CREATE INDEX "_events_v_blocks_teams_parent_id_idx" ON "_events_v_blocks_teams" USING btree ("_parent_id");
  CREATE INDEX "_events_v_blocks_teams_path_idx" ON "_events_v_blocks_teams" USING btree ("_path");
  CREATE INDEX "_events_v_blocks_groups_order_idx" ON "_events_v_blocks_groups" USING btree ("_order");
  CREATE INDEX "_events_v_blocks_groups_parent_id_idx" ON "_events_v_blocks_groups" USING btree ("_parent_id");
  CREATE INDEX "_events_v_blocks_groups_path_idx" ON "_events_v_blocks_groups" USING btree ("_path");
  CREATE INDEX "_events_v_blocks_bracket_order_idx" ON "_events_v_blocks_bracket" USING btree ("_order");
  CREATE INDEX "_events_v_blocks_bracket_parent_id_idx" ON "_events_v_blocks_bracket" USING btree ("_parent_id");
  CREATE INDEX "_events_v_blocks_bracket_path_idx" ON "_events_v_blocks_bracket" USING btree ("_path");
  CREATE INDEX "_events_v_blocks_results_order_idx" ON "_events_v_blocks_results" USING btree ("_order");
  CREATE INDEX "_events_v_blocks_results_parent_id_idx" ON "_events_v_blocks_results" USING btree ("_parent_id");
  CREATE INDEX "_events_v_blocks_results_path_idx" ON "_events_v_blocks_results" USING btree ("_path");
  CREATE INDEX "_events_v_blocks_players_order_idx" ON "_events_v_blocks_players" USING btree ("_order");
  CREATE INDEX "_events_v_blocks_players_parent_id_idx" ON "_events_v_blocks_players" USING btree ("_parent_id");
  CREATE INDEX "_events_v_blocks_players_path_idx" ON "_events_v_blocks_players" USING btree ("_path");
  CREATE INDEX "_events_v_blocks_heats_order_idx" ON "_events_v_blocks_heats" USING btree ("_order");
  CREATE INDEX "_events_v_blocks_heats_parent_id_idx" ON "_events_v_blocks_heats" USING btree ("_parent_id");
  CREATE INDEX "_events_v_blocks_heats_path_idx" ON "_events_v_blocks_heats" USING btree ("_path");
  CREATE INDEX "_events_v_blocks_rankings_order_idx" ON "_events_v_blocks_rankings" USING btree ("_order");
  CREATE INDEX "_events_v_blocks_rankings_parent_id_idx" ON "_events_v_blocks_rankings" USING btree ("_parent_id");
  CREATE INDEX "_events_v_blocks_rankings_path_idx" ON "_events_v_blocks_rankings" USING btree ("_path");
  CREATE INDEX "_events_v_blocks_records_order_idx" ON "_events_v_blocks_records" USING btree ("_order");
  CREATE INDEX "_events_v_blocks_records_parent_id_idx" ON "_events_v_blocks_records" USING btree ("_parent_id");
  CREATE INDEX "_events_v_blocks_records_path_idx" ON "_events_v_blocks_records" USING btree ("_path");
  CREATE INDEX "_events_v_blocks_venue_order_idx" ON "_events_v_blocks_venue" USING btree ("_order");
  CREATE INDEX "_events_v_blocks_venue_parent_id_idx" ON "_events_v_blocks_venue" USING btree ("_parent_id");
  CREATE INDEX "_events_v_blocks_venue_path_idx" ON "_events_v_blocks_venue" USING btree ("_path");
  CREATE INDEX "_events_v_blocks_gallery_order_idx" ON "_events_v_blocks_gallery" USING btree ("_order");
  CREATE INDEX "_events_v_blocks_gallery_parent_id_idx" ON "_events_v_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "_events_v_blocks_gallery_path_idx" ON "_events_v_blocks_gallery" USING btree ("_path");
  CREATE INDEX "_events_v_blocks_partners_order_idx" ON "_events_v_blocks_partners" USING btree ("_order");
  CREATE INDEX "_events_v_blocks_partners_parent_id_idx" ON "_events_v_blocks_partners" USING btree ("_parent_id");
  CREATE INDEX "_events_v_blocks_partners_path_idx" ON "_events_v_blocks_partners" USING btree ("_path");
  CREATE INDEX "_events_v_blocks_registration_order_idx" ON "_events_v_blocks_registration" USING btree ("_order");
  CREATE INDEX "_events_v_blocks_registration_parent_id_idx" ON "_events_v_blocks_registration" USING btree ("_parent_id");
  CREATE INDEX "_events_v_blocks_registration_path_idx" ON "_events_v_blocks_registration" USING btree ("_path");
  CREATE INDEX "_events_v_blocks_related_order_idx" ON "_events_v_blocks_related" USING btree ("_order");
  CREATE INDEX "_events_v_blocks_related_parent_id_idx" ON "_events_v_blocks_related" USING btree ("_parent_id");
  CREATE INDEX "_events_v_blocks_related_path_idx" ON "_events_v_blocks_related" USING btree ("_path");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_sport_idx" ON "_events_v" USING btree ("version_sport_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE INDEX "_events_v_rels_order_idx" ON "_events_v_rels" USING btree ("order");
  CREATE INDEX "_events_v_rels_parent_idx" ON "_events_v_rels" USING btree ("parent_id");
  CREATE INDEX "_events_v_rels_path_idx" ON "_events_v_rels" USING btree ("path");
  CREATE INDEX "_events_v_rels_media_id_idx" ON "_events_v_rels" USING btree ("media_id");
  CREATE INDEX "_events_v_rels_partners_id_idx" ON "_events_v_rels" USING btree ("partners_id");
  CREATE UNIQUE INDEX "sports_slug_idx" ON "sports" USING btree ("slug");
  CREATE INDEX "sports_updated_at_idx" ON "sports" USING btree ("updated_at");
  CREATE INDEX "sports_created_at_idx" ON "sports" USING btree ("created_at");
  CREATE INDEX "partners_logo_idx" ON "partners" USING btree ("logo_id");
  CREATE INDEX "partners_updated_at_idx" ON "partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "partners" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_wide_sizes_wide_filename_idx" ON "media" USING btree ("sizes_wide_filename");
  CREATE INDEX "registrations_event_idx" ON "registrations" USING btree ("event_id");
  CREATE INDEX "registrations_updated_at_idx" ON "registrations" USING btree ("updated_at");
  CREATE INDEX "registrations_created_at_idx" ON "registrations" USING btree ("created_at");
  CREATE INDEX "sponsor_enquiries_updated_at_idx" ON "sponsor_enquiries" USING btree ("updated_at");
  CREATE INDEX "sponsor_enquiries_created_at_idx" ON "sponsor_enquiries" USING btree ("created_at");
  CREATE INDEX "contact_messages_updated_at_idx" ON "contact_messages" USING btree ("updated_at");
  CREATE INDEX "contact_messages_created_at_idx" ON "contact_messages" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_sports_id_idx" ON "payload_locked_documents_rels" USING btree ("sports_id");
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_registrations_id_idx" ON "payload_locked_documents_rels" USING btree ("registrations_id");
  CREATE INDEX "payload_locked_documents_rels_sponsor_enquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("sponsor_enquiries_id");
  CREATE INDEX "payload_locked_documents_rels_contact_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_messages_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_showcase_event_idx" ON "site_settings" USING btree ("showcase_event_id");
  CREATE INDEX "site_settings_rels_order_idx" ON "site_settings_rels" USING btree ("order");
  CREATE INDEX "site_settings_rels_parent_idx" ON "site_settings_rels" USING btree ("parent_id");
  CREATE INDEX "site_settings_rels_path_idx" ON "site_settings_rels" USING btree ("path");
  CREATE INDEX "site_settings_rels_events_id_idx" ON "site_settings_rels" USING btree ("events_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "events_schedule_slots" CASCADE;
  DROP TABLE "events_schedule" CASCADE;
  DROP TABLE "events_teams_players" CASCADE;
  DROP TABLE "events_teams" CASCADE;
  DROP TABLE "events_matches" CASCADE;
  DROP TABLE "events_heats_lanes" CASCADE;
  DROP TABLE "events_heats" CASCADE;
  DROP TABLE "events_blocks_story" CASCADE;
  DROP TABLE "events_blocks_stats" CASCADE;
  DROP TABLE "events_blocks_schedule" CASCADE;
  DROP TABLE "events_blocks_teams" CASCADE;
  DROP TABLE "events_blocks_groups" CASCADE;
  DROP TABLE "events_blocks_bracket" CASCADE;
  DROP TABLE "events_blocks_results" CASCADE;
  DROP TABLE "events_blocks_players" CASCADE;
  DROP TABLE "events_blocks_heats" CASCADE;
  DROP TABLE "events_blocks_rankings" CASCADE;
  DROP TABLE "events_blocks_records" CASCADE;
  DROP TABLE "events_blocks_venue" CASCADE;
  DROP TABLE "events_blocks_gallery" CASCADE;
  DROP TABLE "events_blocks_partners" CASCADE;
  DROP TABLE "events_blocks_registration" CASCADE;
  DROP TABLE "events_blocks_related" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "events_rels" CASCADE;
  DROP TABLE "_events_v_version_schedule_slots" CASCADE;
  DROP TABLE "_events_v_version_schedule" CASCADE;
  DROP TABLE "_events_v_version_teams_players" CASCADE;
  DROP TABLE "_events_v_version_teams" CASCADE;
  DROP TABLE "_events_v_version_matches" CASCADE;
  DROP TABLE "_events_v_version_heats_lanes" CASCADE;
  DROP TABLE "_events_v_version_heats" CASCADE;
  DROP TABLE "_events_v_blocks_story" CASCADE;
  DROP TABLE "_events_v_blocks_stats" CASCADE;
  DROP TABLE "_events_v_blocks_schedule" CASCADE;
  DROP TABLE "_events_v_blocks_teams" CASCADE;
  DROP TABLE "_events_v_blocks_groups" CASCADE;
  DROP TABLE "_events_v_blocks_bracket" CASCADE;
  DROP TABLE "_events_v_blocks_results" CASCADE;
  DROP TABLE "_events_v_blocks_players" CASCADE;
  DROP TABLE "_events_v_blocks_heats" CASCADE;
  DROP TABLE "_events_v_blocks_rankings" CASCADE;
  DROP TABLE "_events_v_blocks_records" CASCADE;
  DROP TABLE "_events_v_blocks_venue" CASCADE;
  DROP TABLE "_events_v_blocks_gallery" CASCADE;
  DROP TABLE "_events_v_blocks_partners" CASCADE;
  DROP TABLE "_events_v_blocks_registration" CASCADE;
  DROP TABLE "_events_v_blocks_related" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "_events_v_rels" CASCADE;
  DROP TABLE "sports" CASCADE;
  DROP TABLE "partners" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "registrations" CASCADE;
  DROP TABLE "sponsor_enquiries" CASCADE;
  DROP TABLE "contact_messages" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_rels" CASCADE;
  DROP TYPE "public"."enum_events_teams_group";
  DROP TYPE "public"."enum_events_matches_stage";
  DROP TYPE "public"."enum_events_matches_group";
  DROP TYPE "public"."enum_events_matches_penalty_winner";
  DROP TYPE "public"."enum_events_accent";
  DROP TYPE "public"."enum_events_kind";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_teams_group";
  DROP TYPE "public"."enum__events_v_version_matches_stage";
  DROP TYPE "public"."enum__events_v_version_matches_group";
  DROP TYPE "public"."enum__events_v_version_matches_penalty_winner";
  DROP TYPE "public"."enum__events_v_version_accent";
  DROP TYPE "public"."enum__events_v_version_kind";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum_sports_kind";
  DROP TYPE "public"."enum_sports_geometry";
  DROP TYPE "public"."enum_sponsor_enquiries_interest";
  DROP TYPE "public"."enum_users_role";`)
}
