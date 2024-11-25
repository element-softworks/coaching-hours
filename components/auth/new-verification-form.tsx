'use client';

import { newEmailVerification } from '@/actions/account/new-email-verification';
import { useMutation } from '@/hooks/use-mutation';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import { FaExclamation } from 'react-icons/fa';
import { BeatLoader } from 'react-spinners';
import { Button } from '../ui/button';
import { Social } from './social';

interface NewVerificationFormProps {}
export function NewVerificationForm(props: NewVerificationFormProps) {
	const searchParams = useSearchParams();
	const token = searchParams.get('token');
	const hasFired = useRef(false);

	const { query: newVerificationQuery, status } = useMutation({
		queryFn: async () => await newEmailVerification(token),
	});

	const onSubmit = useCallback(async () => {
		if (hasFired.current) return;
		hasFired.current = true;

		await newVerificationQuery();
	}, [newVerificationQuery]);

	useEffect(() => {
		onSubmit();
	}, [onSubmit]);

	return (
		<div className="flex flex-col gap-4 max-w-full">
			<div className="mb-4 ">
				<h1 className="text-4xl md:text-5xl font-semibold tracking-tight font-display">
					Verifying email
				</h1>
				<p className="text-lg font-normal mt-1">
					Your email is being verified. You will be able to login once the verification is
					complete.
				</p>
			</div>

			{!status && (
				<div className="flex items-center space-x-2">
					<BeatLoader size={8} />
					<span>Email verifying</span>
				</div>
			)}
			{status === 'success' && (
				<div className="flex items-center space-x-2">
					<Check />
					<span>Email verified!</span>
				</div>
			)}
			{status === 'error' && (
				<div className="flex items-center space-x-2">
					<FaExclamation />
					<span>Failed to verify email</span>
				</div>
			)}

			<Link href="/auth/login">
				<Button isLoading={false} className="w-fit mt-2">
					Back to login
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
					Login now
				</Link>
			</p>
		</div>
	);
}
