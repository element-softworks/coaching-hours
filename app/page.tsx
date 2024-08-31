import { LoginButton } from '@/components/auth/login-button';
import { AuthEmailTemplate } from '@/components/email-templates/auth-email-template';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Home() {
	return (
		<main className="flex h-full flex-col items-center justify-center">
			<LoginButton>
				<Button variant="secondary">Sign in</Button>
			</LoginButton>
			<AuthEmailTemplate title="register" description="hello" />
		</main>
	);
}
