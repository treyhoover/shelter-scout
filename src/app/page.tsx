import { getUserDb } from "@/database/client";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
	const user = await currentUser();

	if (user != null) {
		const shelters = await getUserDb({ id: user.id }, async (db) => {
			return db.query.shelters.findMany();
		});

		console.log("found shelters:", shelters);
	}

	return (
		<div className="font-sans min-h-screen p-8">
			<h1>Shelter Scout</h1>
		</div>
	);
}
