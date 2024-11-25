'use client';

import { getVeriffDecision } from '@/actions/auth/get-veriff-decision';
import { resendCoachApplicationEmail } from '@/actions/booking-system/resend-coach-application-email';
import { CenteredLoader } from '@/components/layout/centered-loader';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useMutation } from '@/hooks/use-mutation';
import { sendNewApplicationEmail } from '@/lib/mail';
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
	} = useMutation<{}, { verified: boolean; email: string }>({
		queryFn: async (values) => await getVeriffDecision(),
	});

	const { query: resendEmail, isLoading: isResendingEmail } = useMutation<
		{},
		{ verified: boolean }
	>({
		queryFn: async (values) => await resendCoachApplicationEmail(),
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
									Please check your emails. We{"'"}ve sent you an email to{' '}
									<span className="font-semibold">{data.email}</span> with a
									verification link to complete your registration.
								</p>
							</Alert>

							<div className="mt-0 lg:mt-4 flex flex-col gap-4">
								<Button
									isLoading={isResendingEmail}
									disabled={isResendingEmail}
									onClick={() => {
										(async () => {
											await resendEmail();
										})();
									}}
									size="lg"
									className="w-fit !mt-2"
								>
									resend verification
								</Button>
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
