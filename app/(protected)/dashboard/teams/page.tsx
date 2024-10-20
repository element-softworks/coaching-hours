import { ShowArchivedButton } from '@/components/show-archived-button';
import TeamsCardsContainer from '@/components/teams-cards-container';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { currentUser } from '@/lib/auth';
import Link from 'next/link';

export async function generateMetadata({ searchParams }: any) {
	return {
		title: `Teams | Dashboard | NextJS SaaS Boilerplate`,
		description: 'Team for NextJS SaaS Boilerplate.',
		openGraph: {
			title: `Teams | Dashboard | NextJS SaaS Boilerplate`,
			description: 'Team for NextJS SaaS Boilerplate.',
		},
		twitter: {
			title: `Teams | Dashboard | NextJS SaaS Boilerplate`,
			description: 'Team overview for NextJS SaaS Boilerplate.',
		},
	};
}

export default async function DashboardPage({ searchParams }: any) {
	const user = await currentUser();
	return (
		<main className="flex flex-col  gap-4">
			<div className="flex gap-2 items-center">
				<div className="flex-1">
					<p className="text-xl font-bold">Teams overview</p>
					<p className="text-muted-foreground text-sm">Manage your teams below</p>
				</div>
				<Link href="/dashboard/teams/create">
					<Button className="w-fit">Create team</Button>
				</Link>
			</div>
			<Separator />

			<ShowArchivedButton id="teams" />

			<TeamsCardsContainer userId={user?.id ?? ''} searchParams={searchParams} />
		</main>
	);
}
