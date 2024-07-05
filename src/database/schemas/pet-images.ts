import { pgTable, uuid } from "drizzle-orm/pg-core";
import { pets } from "./pets";
import { images } from "./images";

export const petImages = pgTable("pet_images", {
	id: uuid("id").defaultRandom().primaryKey(),
	petId: uuid("pet_id")
		.references(() => pets.id)
		.notNull(),
	imageId: uuid("image_id")
		.references(() => images.id)
		.notNull(),
});
