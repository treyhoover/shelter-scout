import { pgTable, uuid } from "drizzle-orm/pg-core";
import { shelters } from "./shelters";
import { images } from "./images";

export const shelterImages = pgTable("shelter_images", {
	id: uuid("id").defaultRandom().primaryKey(),
	shelterId: uuid("shelter_id")
		.references(() => shelters.id)
		.notNull(),
	imageId: uuid("image_id")
		.references(() => images.id)
		.notNull(),
});
