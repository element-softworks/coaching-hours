'use client';

import { getVeriffDecision } from '@/actions/auth/get-veriff-decision';
import { CenteredLoader } from '@/components/layout/centered-loader';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useMutation } from '@/hooks/use-mutation';
import { Info } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

interface ThankYouStepProps {
	fadeOut: boolean;
}

export function ThankYouStep(props: ThankYouStepProps) {
	const {
		query: verifyIdentity,
		isLoading,
		data,
	} = useMutation<{}, { verified: boolean }>({
		queryFn: async (values) => await getVeriffDecision(),
	});

	useEffect(() => {
		(async () => {
			const data = await verifyIdentity();
		})();
	}, []);

	return (
		<div className="flex flex-col gap-4 max-w-full mb-16 sm:mb-4 mt-auto">
			<div className="space-y-4">
				<div className="w-full flex flex-col gap-2">
					{isLoading ? (
						<>
							<h1 className="text-4xl md:text-5xl font-semibold tracking-tight font-display">
								Checking verification
							</h1>
							<p className="text-lg font-display">
								Please wait while we check your verification status.
							</p>
							<CenteredLoader />
						</>
					) : data?.verified && !data?.error ? (
						<>
							<h1 className="text-4xl md:text-5xl font-semibold tracking-tight font-display">
								Thank you
							</h1>

							<p className="text-lg font-display">
								Thank you for registering to become a coach, our team will review
								your application and we{"'"}ll usually get back to you within 24
								hours.
							</p>
							<Alert>
								<Info className="w-6 h-6 mr-2" />
								<p>
									Please check your emails for a verification link to complete
									your registration.
								</p>
							</Alert>

							<div className="mt-0 lg:mt-4 flex flex-col gap-4">
								<Link href="/auth/login">
									<Button size="lg" className="w-fit !mt-2">
										Login
									</Button>
								</Link>
							</div>
						</>
					) : (
						<>
							<h1 className="text-4xl md:text-5xl font-semibold tracking-tight font-display">
								Failed to verify
							</h1>

							<p className="text-lg font-display">
								We were unable to finalize your account. Possible reasons are your
								email may already be in use or your identity could not be verified.
							</p>

							<div className="mt-0 lg:mt-4 flex flex-col gap-4">
								<Link href="/auth/coach-setup?step=identity-check">
									<Button size="lg" className="w-fit !mt-2">
										retry verification
									</Button>
								</Link>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
