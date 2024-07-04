import { pgTable, serial, integer } from "drizzle-orm/pg-core";
import { pets } from "./pets";
import { images } from "./images";

export const petImages = pgTable("pet_images", {
	id: serial("id").primaryKey(),
	petId: integer("pet_id")
		.references(() => pets.id)
		.notNull(),
	imageId: integer("image_id")
		.references(() => images.id)
		.notNull(),
});
