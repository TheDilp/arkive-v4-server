/*
  Warnings:

  - You are about to drop the `_boardsTotags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `boards` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_boardsTotags" DROP CONSTRAINT "_boardsTotags_A_fkey";

-- DropForeignKey
ALTER TABLE "_boardsTotags" DROP CONSTRAINT "_boardsTotags_B_fkey";

-- DropForeignKey
ALTER TABLE "boards" DROP CONSTRAINT "boards_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "boards" DROP CONSTRAINT "boards_project_id_fkey";

-- DropForeignKey
ALTER TABLE "edges" DROP CONSTRAINT "edges_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "nodes" DROP CONSTRAINT "nodes_parent_id_fkey";

-- DropTable
DROP TABLE "_boardsTotags";

-- DropTable
DROP TABLE "boards";

-- CreateTable
CREATE TABLE "graphs" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL DEFAULT 'New graph',
    "is_folder" BOOLEAN,
    "is_public" BOOLEAN,
    "icon" TEXT,
    "default_node_shape" TEXT NOT NULL DEFAULT 'rectangle',
    "default_node_color" TEXT NOT NULL DEFAULT '#595959',
    "default_edge_color" TEXT NOT NULL DEFAULT '#595959',
    "project_id" TEXT NOT NULL,
    "parent_id" TEXT,

    CONSTRAINT "graphs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_graphsTotags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_graphsTotags_AB_unique" ON "_graphsTotags"("A", "B");

-- CreateIndex
CREATE INDEX "_graphsTotags_B_index" ON "_graphsTotags"("B");

-- AddForeignKey
ALTER TABLE "graphs" ADD CONSTRAINT "graphs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "graphs" ADD CONSTRAINT "graphs_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "graphs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "graphs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edges" ADD CONSTRAINT "edges_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "graphs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_graphsTotags" ADD CONSTRAINT "_graphsTotags_A_fkey" FOREIGN KEY ("A") REFERENCES "graphs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_graphsTotags" ADD CONSTRAINT "_graphsTotags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
