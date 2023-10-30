-- CreateTable
CREATE TABLE "_blueprint_instancesTotags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_blueprint_instancesTotags_AB_unique" ON "_blueprint_instancesTotags"("A", "B");

-- CreateIndex
CREATE INDEX "_blueprint_instancesTotags_B_index" ON "_blueprint_instancesTotags"("B");

-- AddForeignKey
ALTER TABLE "_blueprint_instancesTotags" ADD CONSTRAINT "_blueprint_instancesTotags_A_fkey" FOREIGN KEY ("A") REFERENCES "blueprint_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_blueprint_instancesTotags" ADD CONSTRAINT "_blueprint_instancesTotags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
