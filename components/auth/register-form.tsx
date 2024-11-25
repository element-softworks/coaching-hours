'use client';

import { register } from '@/actions/auth/register';
import { useMutation } from '@/hooks/use-mutation';
import { RegisterSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { PasswordInput } from '../inputs/password-input';
import { Button } from '../ui/button';
import { Form } from '../ui/form';
import { Input } from '../ui/input';
import { FormInput } from './form-input';
import { Social } from './social';
import { useSearchParams } from 'next/navigation';
import { ConciergeToken } from '@/db/drizzle/schema/conciergeToken';

type RegisterFormFormProps = z.infer<typeof RegisterSchema>;

interface RegisterFormProps {
	token?: ConciergeToken | null;
}

export function RegisterForm(props: RegisterFormProps) {
	const form = useForm<RegisterFormFormProps>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			email: props.token?.email ?? '',
			password: '',
			name: props.token?.name ?? '',
		},
	});

	const { query: registerQuery, isLoading } = useMutation<RegisterFormFormProps, {}>({
		queryFn: async (values) => await register(values!, props?.token),
		onSuccess: () => {
			form.reset({
				email: '',
				password: '',
				name: '',
			});
		},
	});

	async function onSubmit(values: z.infer<typeof RegisterSchema>) {
		await registerQuery(values);
	}

	return (
		<div className="flex flex-col gap-4 max-w-full ">
			<div className="mb-4">
				<h1 className="text-4xl md:text-5xl font-semibold tracking-tight font-display">
					Register
				</h1>
				<p className="text-lg font-normal mt-1">
					Enter your details to register to your account on the platform.
				</p>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormInput
						name="name"
						label="Name"
						render={({ field }) => (
							<Input {...field} disabled={isLoading} placeholder="John Doe" />
						)}
					/>
					<FormInput
						name="email"
						label="Email"
						render={({ field }) => (
							<Input
								{...field}
								disabled={isLoading}
								placeholder="john.doe@example.com"
							/>
						)}
					/>

					<PasswordInput
						isLoading={isLoading}
						name="password"
						label="Password"
						showStrengthRequirements
					/>

					<Button isLoading={isLoading} className="w-fit" type="submit">
						sign up
					</Button>
				</form>
			</Form>
			{/* {!!props.token ? null : (
				<div className="relative flex text-base items-start mt-4">
					<span className="bg-primary-foreground border-t px-3 text-muted-foreground" />
					<span className="bg-primary-foreground -mt-2 px-2 text-muted-foreground">
						or continue with
					</span>
					<span className="bg-primary-foreground border-t px-3 text-muted-foreground" />
				</div>
			)} */}

			{/* We disable social login if the user is invited to the platform as there is no way to
			securely pass data to OAuth providers without exposing vulnerabilities to the platform.
			This is a security measure to prevent unauthorized access teams across platform. */}
			<Social className="mt-2" disabled={!!props.token} />
			<p className="text-sm font-medium !font-sans mt-4">
				Already have an account?{' '}
				<Link className="font-semibold" href="/auth/login">
					Login
				</Link>
			</p>

			<p className="text-sm font-medium !font-sans">
				Want to become a coach?{' '}
				<Link className="font-semibold" href="/auth/coach-setup">
					Apply here
				</Link>
			</p>
		</div>
	);
}
