'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { coachApplicationUpdate } from '@/actions/booking-system/coach-application-update';
import { DropzoneInput } from '@/components/inputs/dropzone-input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useMutation } from '@/hooks/use-mutation';
import counties from '@/lib/countries.json';
import timezones from '@/lib/timezones.json';
import { MoreAboutYouStepSchema } from '@/schemas';
import { useEffect } from 'react';
import { FormInput } from '../../form-input';
import { CoachSetupFormFormProps } from './coach-setup-form';

type MoreAboutYouStepFormProps = z.infer<typeof MoreAboutYouStepSchema>;

interface GenderStepProps {
	fadeOut: boolean;
	onSubmit: (values: MoreAboutYouStepFormProps) => void;
	onBack: () => void;
	values: CoachSetupFormFormProps;
}

export function MoreAboutYouStep(props: GenderStepProps) {
	const form = useForm<MoreAboutYouStepFormProps>({
		resolver: zodResolver(MoreAboutYouStepSchema),
		defaultValues: {
			avatar: '' as any,
			businessName: '',
			location: '',
			timezone: '',
			businessNumber: '',
			yearsExperience: '' as any,
		},
	});

	useEffect(() => {
		form.reset({
			avatar: props.values?.avatar ?? '',
			businessName: props.values?.businessName ?? '',
			location: props.values?.location ?? '',
			timezone: props.values?.timezone ?? '',
			businessNumber: props.values?.businessNumber ?? '',
			yearsExperience: props.values?.yearsExperience ?? '',
		});
	}, [props.values]);

	const {
		query: updateQuery,
		isLoading,
		data,
	} = useMutation<FormData, {}>({
		queryFn: async (values) => {
			return await coachApplicationUpdate(
				{
					businessName: values?.get('businessName') as string,
					location: values?.get('location') as string,
					timezone: values?.get('timezone') as string,
					businessNumber: values?.get('businessNumber') as string,
					yearsExperience: values?.get('yearsExperience') as string,
				},
				values
			);
		},
		onSuccess: (response: any) => {
			props.onSubmit({
				...form.getValues(),
				avatar: response?.data?.avatar ?? '',
			});
		},
	});

	async function onSubmit(values: z.infer<typeof MoreAboutYouStepSchema>) {
		const formData = new FormData();
		const fileInput = values.avatar[0]; // Assuming avatar is being returned as a FileList
		formData.append('avatar', fileInput);
		formData.append('businessName', values.businessName);
		formData.append('location', values.location);
		formData.append('timezone', values.timezone);
		formData.append('businessNumber', values.businessNumber);
		formData.append('yearsExperience', values.yearsExperience);

		await updateQuery(formData);
	}

	return (
		<div className="flex flex-col gap-4 max-w-full mb-16 sm:mb-4 mt-auto">
			<Form {...form}>
				<Button variant="secondary" className="w-fit" onClick={props.onBack}>
					Back
				</Button>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<div>
						<p className="text-sm font-sans font-normal mb-2">Sign up progress</p>
						<Progress value={35} className="" />
					</div>
					<div className="w-full flex flex-col gap-2">
						<h1 className="text-4xl md:text-5xl font-semibold tracking-tight font-display">
							a bit more about you
						</h1>

						<p className="text-lg font-display">
							You{"'"}re almost there! Let{"'"}s add the last finishing touches to
							your account.
						</p>

						<div className="mt-0 lg:mt-6 flex flex-col gap-4">
							<DropzoneInput
								accept={{
									'image/png': [],
									'image/jpeg': [],
								}}
								label="Avatar"
								name="avatar"
								placeholder="Drag or drop to upload an avatar PNG/JPEG Maximum 3MB"
								defaultFiles={
									!!props.values.avatar?.length
										? [props.values?.avatar as any]
										: undefined
								}
							/>

							<FormInput
								name="location"
								label="Coach location"
								render={({ field }) => (
									<Select
										value={field.value}
										onValueChange={(value) => {
											if (!value) return;
											field.onChange(value);
										}}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select a location" />
										</SelectTrigger>
										<SelectContent>
											{[
												{
													name: 'United Kingdom',
													dial_code: '+44',
													code: 'GB',
												},
												{
													name: 'United States',
													dial_code: '+1',
													code: 'US',
												},
												...counties?.filter?.(
													(c) => c.code !== 'GB' && c.code !== 'US'
												),
											]?.map?.((country, index) => {
												return (
													<SelectItem
														className="flex gap-1 flex-row"
														key={index}
														value={country?.code}
													>
														<div className="flex gap-1">
															<img
																className="object-contain"
																loading="lazy"
																width="20"
																srcSet={`https://flagcdn.com/w40/${country?.code?.toLowerCase()}.png 2x`}
																src={`https://flagcdn.com/w20/${country?.code?.toLowerCase()}.png`}
																alt={`${country?.name} country flag`}
															/>
															<p>{country?.name}</p>
														</div>
													</SelectItem>
												);
											})}
										</SelectContent>
									</Select>
								)}
							/>

							<FormInput
								name="timezone"
								label="Timezone"
								render={({ field }) => (
									<Select
										value={field.value}
										onValueChange={(value) => {
											if (!value) return;
											field.onChange(value);
										}}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select a timezone" />
										</SelectTrigger>
										<SelectContent>
											{timezones?.map?.((timezone, index) => {
												return (
													<SelectItem key={index} value={timezone?.zone}>
														{timezone?.zone} {timezone?.gmt}
													</SelectItem>
												);
											})}
										</SelectContent>
									</Select>
								)}
							/>

							<FormInput
								name="yearsExperience"
								label="Years of experience"
								render={({ field }) => (
									<Select
										defaultValue={props.values.yearsExperience}
										onValueChange={(value) => {
											field.onChange(value);
										}}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select years experience" />
										</SelectTrigger>
										<SelectContent>
											{Array.from({ length: 14 })?.map((_, index) => {
												return (
													<SelectItem
														key={index}
														value={String(index + 1)}
													>
														{index + 1}
													</SelectItem>
												);
											})}
											<SelectItem value={'15+'}>15+</SelectItem>
										</SelectContent>
									</Select>
								)}
							/>

							<FormInput
								name="businessName"
								label="Registered business name (or self employed)"
								render={({ field }) => (
									<Input {...field} placeholder="Example Company Ltd" />
								)}
							/>

							<FormInput
								name="businessNumber"
								label="Registered business number"
								render={({ field }) => <Input {...field} placeholder="00000000" />}
							/>

							<Button
								disabled={isLoading}
								isLoading={isLoading}
								size="lg"
								className="w-fit !mt-2"
								onClick={form.handleSubmit(onSubmit)}
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
