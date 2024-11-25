import { Social } from '@/components/auth/social';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export async function generateMetadata() {
	return {
		title: `Error | Login | Coaching Hours`,
		description: 'Failed logging in to your account on Coaching Hours.',
		openGraph: {
			title: `Error | Login | Coaching Hours`,
			description: 'Failed logging in to your account on Coaching Hours.',
		},
		twitter: {
			title: `Error | Login | Coaching Hours`,
			description: 'Failed logging in to your account on Coaching Hours.',
		},
		alternates: {
			canonical: `${process.env.NEXT_PUBLIC_APP_URL}/auth/error`,
		},
	};
}

export default function AuthErrorPage() {
	return (
		<div className="flex flex-col gap-4 max-w-full ">
			<div className="mb-4 ">
				<h1 className="text-4xl md:text-5xl font-semibold tracking-tight font-display">
					Failed logging in
				</h1>
				<p className="text-lg font-normal mt-1">
					There was a problem while logging in. Your account may have been archived.
					Contact an administator for help if this continues
				</p>
			</div>
			<Link href="/auth/login">
				<Button isLoading={false} className="w-full mt-2">
					back to login
				</Button>
			</Link>

			{/* <div className="relative flex text-base items-start mt-4">
				<span className="bg-primary-foreground border-t px-3 text-muted-foreground" />
				<span className="bg-primary-foreground -mt-2 px-2 text-muted-foreground">
					or continue with
				</span>
				<span className="bg-primary-foreground border-t px-3 text-muted-foreground" />
			</div>
			<Social className="mt-2" /> */}

			<p className="text-sm font-medium !font-sans mt-4">
				Already have an account?{' '}
				<Link className="font-semibold" href="/auth/login">
					Login
				</Link>
			</p>
		</div>
	);
}
