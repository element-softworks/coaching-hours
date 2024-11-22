'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { CoachSetupSchema } from '@/schemas';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { DetailsStep } from './details-step';
import { IdentityCheckStep } from './identity-check-step';
import { MoreAboutYouStep } from './more-about-you-step';
import { VerificationStep } from './verification-step';
import { createVeriffSession } from '@/actions/auth/create-veriff-session';
import { ThankYouStep } from './thank-you-step';
import { CoachApplication } from '@/db/drizzle/schema/booking-system/coachApplication';
import { cookies } from 'next/headers';
import { setCookie } from '@/data/cookies';

export type CoachSetupFormFormProps = z.infer<typeof CoachSetupSchema>;

export type step = 'details' | 'more-details' | 'verification' | 'identity-check' | 'thank-you';

interface CoachSetupFormProps {
	sessionId: string | null;
	hasCookie: boolean;
	searchParams: any;
	veriffSession?: string;
	session: CoachApplication | null | undefined;
}

export function CoachSetupForm(props: CoachSetupFormProps) {
	const { watch, setValue, handleSubmit, reset } = useForm<CoachSetupFormFormProps>({
		resolver: zodResolver(CoachSetupSchema),
		defaultValues: {
			email: props.session?.email ?? '',
			firstName: props.session?.firstName ?? '',
			lastName: props.session?.lastName ?? '',
			password: '',
			agreedToMarketing: props.session?.agreedToMarketing ?? false,
			agreedToTerms: props.session?.agreedToTerms ?? false,
			avatar: typeof props.session?.avatar === 'string' ? (props.session.avatar as any) : '',
			location: props.session?.location ?? '',
			timezone: props.session?.timezone ?? '',
			yearsExperience: String(props.session?.yearsExperience ?? '') ?? '',
			businessName: props.session?.businessName ?? '',
			businessNumber: props.session?.businessNumber ?? '',
			certificates: (props.session?.certificates as any) ?? [],
			hoursExperience: String(props.session?.hoursExperience) ?? '',
		},
	});
	useEffect(() => {
		(async () => {
			if (
				(!props.hasCookie && props.sessionId) ||
				(props.session?.status !== 'IN_PROGRESS' && !!props.sessionId)
			) {
				await setCookie({
					name: 'coachApplicationId',
					value: props.sessionId,
				});
			}
		})();

		return () => {
			reset();
		};
	}, []);

	async function onSubmit(values: z.infer<typeof CoachSetupSchema>) {
		// await createSetupFormSubmission(values!);
	}

	console.log(props.session, 'props.session');
	const [fadeOut, setFadeOut] = useState(false);
	const [step, setStep] = useState<step>(props?.searchParams?.step ?? 'details');
	const router = useRouter();
	const pathname = usePathname();

	const changePageTimer = (step: step, duration: number) => {
		setFadeOut(true);
		setTimeout(() => {
			router.push(`${pathname}?step=${step}`, { scroll: false });
			setStep(step);
			setFadeOut(false);
		}, duration);
	};

	useEffect(() => {
		if (props?.searchParams?.step) {
			setStep(props.searchParams.step);
		}
	}, [props?.searchParams?.step]);

	console.log(watch(), 'watch data dasdas');
	return (
		<div className="flex flex-col gap-4 ">
			{step === 'details' ? (
				<DetailsStep
					values={watch()}
					fadeOut={fadeOut}
					onSubmit={async (values) => {
						setValue('email', values.email);
						setValue('firstName', values.firstName);
						setValue('lastName', values.lastName);
						setValue('password', values.password);
						setValue('agreedToMarketing', values.agreedToMarketing);
						setValue('agreedToTerms', values.agreedToTerms);

						changePageTimer('more-details', 0);
					}}
				/>
			) : null}

			{step === 'more-details' ? (
				<MoreAboutYouStep
					values={watch()}
					fadeOut={fadeOut}
					onSubmit={async (values) => {
						console.log(values, 'props.values.avatar submit values');
						setValue('avatar', values.avatar);
						setValue('location', values.location);
						setValue('timezone', values.timezone);
						setValue('yearsExperience', values.yearsExperience);
						setValue('businessName', values.businessName);
						setValue('businessNumber', values.businessName);

						changePageTimer('verification', 0);
					}}
					onBack={() => {
						changePageTimer('details', 0);
					}}
				/>
			) : null}

			{step === 'verification' ? (
				<VerificationStep
					values={watch()}
					fadeOut={fadeOut}
					onSubmit={async (values) => {
						setValue('certificates', values.certificates);
						setValue('hoursExperience', values.hoursExperience);

						props.session?.idVerified
							? changePageTimer('thank-you', 0)
							: changePageTimer('identity-check', 0);
					}}
					onBack={() => {
						changePageTimer('more-details', 0);
					}}
				/>
			) : null}

			{step === 'identity-check' ? (
				<IdentityCheckStep
					values={watch()}
					fadeOut={fadeOut}
					onSubmit={async () => {
						await createVeriffSession();
						// changePageTimer('next', 0);
					}}
					onBack={() => {
						changePageTimer('verification', 0);
					}}
				/>
			) : null}

			{step === 'thank-you' ? <ThankYouStep fadeOut={fadeOut} /> : null}
		</div>
	);
}
