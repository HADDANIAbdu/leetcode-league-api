import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1795778075381 implements MigrationInterface {
    name = 'Init1795778075381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "refreshTokenHash" character varying, "leetcodeUsername" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_745a15d3401c7d4f241cbe1629e" UNIQUE ("leetcodeUsername"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "leagues" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "inviteCode" character varying NOT NULL, "weeklyStake" integer NOT NULL DEFAULT '10', "currency" character varying NOT NULL DEFAULT 'MAD', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_d712fa4ce38b812bd6714d6eb7f" UNIQUE ("inviteCode"), CONSTRAINT "PK_2275e1e3e32e9223298c3a0b514" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."memberships_role_enum" AS ENUM('OWNER', 'MEMBER')`);
        await queryRunner.query(`CREATE TABLE "memberships" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."memberships_role_enum" NOT NULL DEFAULT 'MEMBER', "joinedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "leagueId" uuid NOT NULL, CONSTRAINT "UQ_c185ea38fe05847fe2d055a2b5e" UNIQUE ("userId", "leagueId"), CONSTRAINT "PK_25d28bd932097a9e90495ede7b4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."weeks_status_enum" AS ENUM('OPEN', 'CLOSED')`);
        await queryRunner.query(`CREATE TABLE "weeks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "weekNumber" integer NOT NULL, "startDate" date NOT NULL, "status" "public"."weeks_status_enum" NOT NULL DEFAULT 'OPEN', "closedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "leagueId" uuid NOT NULL, CONSTRAINT "UQ_9ab02b14144aaf826c629d6e177" UNIQUE ("leagueId", "weekNumber"), CONSTRAINT "PK_003488ee2ca80ef0c85a02a8065" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "daily_problems" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "postedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "title" character varying, "url" character varying, "leagueId" uuid NOT NULL, CONSTRAINT "UQ_0055769a29e3051be62a14a59e2" UNIQUE ("leagueId", "date"), CONSTRAINT "PK_553214b5e6ca63b40b0f1d589b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."daily_entries_source_enum" AS ENUM('MANUAL', 'AUTO')`);
        await queryRunner.query(`CREATE TABLE "daily_entries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "solved" boolean NOT NULL DEFAULT false, "solvedAt" TIMESTAMP WITH TIME ZONE, "points" integer NOT NULL DEFAULT '0', "source" "public"."daily_entries_source_enum" NOT NULL DEFAULT 'MANUAL', "weekId" uuid NOT NULL, "userId" uuid NOT NULL, "problemId" uuid NOT NULL, CONSTRAINT "UQ_1ead47cdce325ebcd6b8c5ce89e" UNIQUE ("userId", "problemId"), CONSTRAINT "PK_028b8ddda254a474018429f3c81" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."pot_transactions_type_enum" AS ENUM('WEEKLY_STAKE', 'ADJUSTMENT')`);
        await queryRunner.query(`CREATE TABLE "pot_transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" integer NOT NULL, "type" "public"."pot_transactions_type_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "leagueId" uuid, "weekId" uuid, "userId" uuid, CONSTRAINT "PK_a5ca63a958acd0a005565e3eb6a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "memberships" ADD CONSTRAINT "FK_187d573e43b2c2aa3960df20b78" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "memberships" ADD CONSTRAINT "FK_56100c56db571252b90a8d2545a" FOREIGN KEY ("leagueId") REFERENCES "leagues"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "weeks" ADD CONSTRAINT "FK_cd94e169650e09e774723350dfc" FOREIGN KEY ("leagueId") REFERENCES "leagues"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "daily_problems" ADD CONSTRAINT "FK_8a2d7fd2563d28beeecd0513a78" FOREIGN KEY ("leagueId") REFERENCES "leagues"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "daily_entries" ADD CONSTRAINT "FK_f3c70c73259f190080c437d823c" FOREIGN KEY ("weekId") REFERENCES "weeks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "daily_entries" ADD CONSTRAINT "FK_90508ffc9d8eb09fa7afea424fa" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "daily_entries" ADD CONSTRAINT "FK_5312678bd47ef0ed677a4faf0fc" FOREIGN KEY ("problemId") REFERENCES "daily_problems"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pot_transactions" ADD CONSTRAINT "FK_316d8635adb85d81a061452c2e7" FOREIGN KEY ("leagueId") REFERENCES "leagues"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pot_transactions" ADD CONSTRAINT "FK_58c268cc7063de601c968b74c91" FOREIGN KEY ("weekId") REFERENCES "weeks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pot_transactions" ADD CONSTRAINT "FK_9f4372f99d306f13da880622499" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pot_transactions" DROP CONSTRAINT "FK_9f4372f99d306f13da880622499"`);
        await queryRunner.query(`ALTER TABLE "pot_transactions" DROP CONSTRAINT "FK_58c268cc7063de601c968b74c91"`);
        await queryRunner.query(`ALTER TABLE "pot_transactions" DROP CONSTRAINT "FK_316d8635adb85d81a061452c2e7"`);
        await queryRunner.query(`ALTER TABLE "daily_entries" DROP CONSTRAINT "FK_5312678bd47ef0ed677a4faf0fc"`);
        await queryRunner.query(`ALTER TABLE "daily_entries" DROP CONSTRAINT "FK_90508ffc9d8eb09fa7afea424fa"`);
        await queryRunner.query(`ALTER TABLE "daily_entries" DROP CONSTRAINT "FK_f3c70c73259f190080c437d823c"`);
        await queryRunner.query(`ALTER TABLE "daily_problems" DROP CONSTRAINT "FK_8a2d7fd2563d28beeecd0513a78"`);
        await queryRunner.query(`ALTER TABLE "weeks" DROP CONSTRAINT "FK_cd94e169650e09e774723350dfc"`);
        await queryRunner.query(`ALTER TABLE "memberships" DROP CONSTRAINT "FK_56100c56db571252b90a8d2545a"`);
        await queryRunner.query(`ALTER TABLE "memberships" DROP CONSTRAINT "FK_187d573e43b2c2aa3960df20b78"`);
        await queryRunner.query(`DROP TABLE "pot_transactions"`);
        await queryRunner.query(`DROP TYPE "public"."pot_transactions_type_enum"`);
        await queryRunner.query(`DROP TABLE "daily_entries"`);
        await queryRunner.query(`DROP TYPE "public"."daily_entries_source_enum"`);
        await queryRunner.query(`DROP TABLE "daily_problems"`);
        await queryRunner.query(`DROP TABLE "weeks"`);
        await queryRunner.query(`DROP TYPE "public"."weeks_status_enum"`);
        await queryRunner.query(`DROP TABLE "memberships"`);
        await queryRunner.query(`DROP TYPE "public"."memberships_role_enum"`);
        await queryRunner.query(`DROP TABLE "leagues"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
