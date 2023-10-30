-- CreateTable
CREATE TABLE "_character_fields_templatesTotags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_character_fields_templatesTotags_AB_unique" ON "_character_fields_templatesTotags"("A", "B");

-- CreateIndex
CREATE INDEX "_character_fields_templatesTotags_B_index" ON "_character_fields_templatesTotags"("B");

-- AddForeignKey
ALTER TABLE "_character_fields_templatesTotags" ADD CONSTRAINT "_character_fields_templatesTotags_A_fkey" FOREIGN KEY ("A") REFERENCES "character_fields_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_character_fields_templatesTotags" ADD CONSTRAINT "_character_fields_templatesTotags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
