import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
	const user = await currentUser();

	console.log(user);

	return (
		<div className="font-sans min-h-screen p-8">
			<h1>Shelter Scout</h1>
		</div>
	);
}
