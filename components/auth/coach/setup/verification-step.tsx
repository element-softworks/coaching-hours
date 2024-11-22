'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { CertificateDropzoneInput } from '@/components/inputs/certificate-dropzone-input';
import { Button } from '@/components/ui/button';
import { Form, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { VerificationStepSchema } from '@/schemas';
import { FileCheck2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { FormInput } from '../../form-input';
import { CoachSetupFormFormProps } from './coach-setup-form';
import { coachApplicationUpdate } from '@/actions/booking-system/coach-application-update';
import { useMutation } from '@/hooks/use-mutation';

type VerificationStepFormProps = z.infer<typeof VerificationStepSchema>;

interface VerificationStepProps {
	fadeOut: boolean;
	onSubmit: (values: VerificationStepFormProps) => void;
	onBack: () => void;
	values: CoachSetupFormFormProps;
}

export function VerificationStep(props: VerificationStepProps) {
	const form = useForm<VerificationStepFormProps>({
		resolver: zodResolver(VerificationStepSchema),
		defaultValues: {
			certificates: props.values?.certificates ?? [],
			hoursExperience: props.values?.hoursExperience ?? '',
		},
	});

	useEffect(() => {
		form.reset({
			certificates: props.values?.certificates ?? form.getValues('certificates') ?? [],
			hoursExperience:
				props.values?.hoursExperience ?? form.getValues('hoursExperience') ?? '',
		});
	}, [props.values]);

	async function onSubmit(values: z.infer<typeof VerificationStepSchema>) {
		const formData = new FormData();

		values?.certificates?.forEach((image, index) => {
			formData.append(`certificates.${index}.file`, image.file as any);
			formData.append(`certificates.${index}.certificateName`, image.certificateName);
			formData.append(`certificates.${index}.certifiedDate`, image.certifiedDate);
			formData.append(`certificates.${index}.institution`, image.institution);
		});
		formData.append('hoursExperience', values.hoursExperience);

		await updateQuery(formData);
	}

	const { query: updateQuery, isLoading } = useMutation<FormData, {}>({
		queryFn: async (values) => {
			return await coachApplicationUpdate(
				{
					hoursExperience: values?.get('hoursExperience') as string,
				},
				values
			);
		},
		onSuccess: (response: any) => {
			props.onSubmit(form.watch());

			form.reset({
				certificates:
					response?.data?.certificates ??
					props.values?.certificates ??
					form.getValues('certificates') ??
					[],
				hoursExperience:
					response?.data?.hoursExperience ??
					props.values?.hoursExperience ??
					form.getValues('hoursExperience') ??
					'',
			});
		},
	});

	return (
		<div className="flex flex-col gap-4 max-w-full mb-16 sm:mb-4 mt-auto">
			<Form {...form}>
				<Button variant="secondary" className="w-fit" onClick={props.onBack}>
					Back
				</Button>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<div>
						<p className="text-sm font-sans font-normal mb-2">Sign up progress</p>
						<Progress value={55} className="" />
					</div>
					<div className="w-full flex flex-col gap-2">
						<h1 className="text-4xl md:text-5xl font-semibold tracking-tight font-display">
							verification
						</h1>

						<p className="text-lg font-display">
							We need to verify who you are to safeguard our community in line with
							our{' '}
							<Link href="/terms-of-service" className="font-semibold">
								terms and conditions
							</Link>
						</p>

						<div className="mt-0 lg:mt-6 flex flex-col gap-4">
							<FormInput
								description="We may ask you to verify this"
								name="hoursExperience"
								label="How many hours of coaching experience do you have?"
								render={({ field }) => (
									<Input {...field} type="number" placeholder="100" />
								)}
							/>
							<CertificateDropzoneInput
								multiple
								label="Coaching certificates"
								name="certificates"
								placeholder="Drag or drop to upload your certificates PDF/PNG/JPEG Maximum 3MB"
								defaultFiles={
									props.values.certificates?.map?.((v) => v.file) as any
								}
								icon={<FileCheck2 className="text-muted-foreground" />}
								accept={{
									'image/png': [],
									'image/jpeg': [],
									'application/pdf': [],
								}}
							/>
							<FormDescription className="!-mt-2 text-muted-foreground">
								Please upload and certificates or awards that can confirm your
								coaching history and standard.
							</FormDescription>

							<Button
								isLoading={isLoading}
								disabled={isLoading}
								size="lg"
								className="w-fit !mt-2"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									form.handleSubmit(onSubmit)();
								}}
							>
								next step
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
}
