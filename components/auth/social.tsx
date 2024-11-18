'use client';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Button } from '../ui/button';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

interface SocialProps {
	className?: string;
	disabled?: boolean;
}
export function Social(props: SocialProps) {
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get('callbackUrl');

	const onClick = (provider: 'google' | 'github') => {
		signIn(provider, {
			callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
		});
	};

	if (props.disabled) return null;

	return (
		<div className={`${props.className} flex flex-col w-fit gap-y-2 items-center`}>
			<Button
				className="w-full bg-transparent"
				variant="outline"
				size="lg"
				onClick={() => onClick('google')}
			>
				<FcGoogle size={17} />
				<span className="ml-1 font-normal">Google</span>
			</Button>

			<Button
				className="w-full"
				variant="outline"
				size="lg"
				onClick={() => onClick('github')}
			>
				<FaGithub size={17} />
				<span className="ml-1 font-normal">Github</span>
			</Button>
		</div>
	);
}
