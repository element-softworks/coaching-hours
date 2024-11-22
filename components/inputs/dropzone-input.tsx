'use client';
import { User } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect } from 'react';
import Dropzone, { Accept } from 'react-dropzone';
import { Controller, useFormContext } from 'react-hook-form';
import { FormLabel } from '../ui/form';

interface DropzoneInputProps {
	name: string;
	multiple?: boolean;
	accept?: Accept | undefined;
	defaultFiles?: string[];
	isLoading?: boolean;
	label?: string;
	placeholder?: string;
	icon?: React.ReactNode;
}

export function DropzoneInput(props: DropzoneInputProps) {
	const { multiple = false } = props;
	const { control, formState, watch } = useFormContext();

	const [files, setFiles] = React.useState<(File[] | string[]) | null>(
		props.defaultFiles ?? null
	);

	const error = formState.errors[props.name];

	return (
		<>
			<Controller
				name={props.name}
				control={control}
				render={({ field: { onChange } }) => (
					<div className="">
						{props.label ? (
							<FormLabel
								className={`text-sm font-normal ${
									!!error ? 'text-destructive' : ''
								}`}
							>
								{props.label}
							</FormLabel>
						) : null}

						<Dropzone
							multiple={multiple}
							onDrop={(acceptedFiles) => {
								setFiles(acceptedFiles);
								onChange(acceptedFiles);
							}}
							accept={
								props.accept ?? {
									'image/webp': [],
									'image/png': [],
									'image/jpeg': [],
									'image/jpg': [],
									'image/gif': [],
								}
							}
						>
							{({ getRootProps, getInputProps, acceptedFiles }) => {
								return (
									<>
										<section className="mt-1">
											<div
												{...getRootProps()}
												className={`group border flex-col gap-2 bg-background h-40 border-input rounded-2xl flex items-center justify-center transition cursor-pointer ${
													!!error
														? 'border-destructive'
														: 'hover:border-primary hover:bg-background/80'
												}`}
											>
												<input
													{...getInputProps({
														onChange: (e) => {
															return onChange(e.target.files);
														},
													})}
												/>
												{!props.multiple && (files?.length ?? 0) === 1 ? (
													files?.map?.((file, index) => {
														console.log(file, 'file repsonse data');
														const objectUrl =
															typeof file === 'string'
																? file
																: URL.createObjectURL(file);
														return (
															<Image
																className="w-[40px] h-[40px] object-cover rounded-full"
																key={index}
																src={objectUrl}
																alt="Dropzone image"
																width={75}
																height={75}
															/>
														);
													})
												) : (
													<div className="bg-card w-[40px] h-[40px] flex justify-center items-center rounded-full">
														{!!props.icon ? (
															props.icon
														) : (
															<User className="text-muted-foreground" />
														)}
													</div>
												)}
												<p
													className={`text-center text-sm font-sans font-light max-w-[34ch] px-2 ${
														!!error
															? 'text-destructive'
															: `text-muted-foreground group-hover:text-primary`
													} transition`}
												>
													{!!error
														? (error as any)?.[props.name]?.message ??
														  error?.message
														: props?.placeholder ??
														  'Drag and drop some files here, or click to select files'}
												</p>
											</div>
										</section>
										<div
											className={`flex gap-2 flex-wrap ${
												!!((files?.length ?? 0) > 0) ? 'mt-4' : ''
											}`}
										>
											{props.multiple && (files?.length ?? 0) > 0
												? files?.map?.((file, index) => {
														const objectUrl =
															typeof file === 'string'
																? file
																: URL.createObjectURL(file);
														return (
															<Image
																className="w-[105px] h-[105px] object-cover rounded-md"
																key={index}
																src={objectUrl}
																alt={`Dropzone image ${index}`}
																width={100}
																height={100}
															/>
														);
												  })
												: null}
										</div>
									</>
								);
							}}
						</Dropzone>
					</div>
				)}
			/>
		</>
	);
}
