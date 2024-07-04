import { pgTable, serial, integer } from "drizzle-orm/pg-core";
import { shelters } from "./shelters";
import { images } from "./images";

export const shelterImages = pgTable("shelter_images", {
	id: serial("id").primaryKey(),
	shelterId: integer("shelter_id")
		.references(() => shelters.id)
		.notNull(),
	imageId: integer("image_id")
		.references(() => images.id)
		.notNull(),
});
