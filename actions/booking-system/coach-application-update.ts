'use server';

import { db } from '@/db/drizzle/db';
import { coachApplication } from '@/db/drizzle/schema';
import { CoachSetupSchema } from '@/schemas';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import * as z from 'zod';
import { uploadFileToS3 } from '../system/upload-file-to-s3';
import { v4 as uuidv4 } from 'uuid';
import { s3Path } from '@/lib/s3';
import { removeFileFromS3 } from '../system/remove-file-from-s3';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export const coachApplicationUpdate = async (
	values: Partial<z.infer<typeof CoachSetupSchema>>,
	formData?: FormData
) => {
	const applicationId = await cookies().get('coachApplicationId');
	const uuid = uuidv4();
	if (!applicationId?.value?.length) {
		return { error: 'An error occurred while retrieving the coach application id' };
	}

	//Retrieve the current application
	const [foundApplication] = await db
		.select()
		.from(coachApplication)
		.where(eq(coachApplication.id, applicationId.value));

	if (!foundApplication) {
		return { error: 'An error occurred while retrieving the coach application' };
	}

	//Check if the avatar file size is greater than 3MB
	const avatar = formData?.get('avatar') as File;

	if (avatar?.size > 3000000) {
		return { error: 'File size cannot exceed 3MB. Please compress or upload another file.' };
	}

	if (!!avatar?.size) {
		const buffer = Buffer.from(await avatar.arrayBuffer());

		await uploadFileToS3(buffer, `${uuid}`);
	}

	//Hash the password
	let hashedPassword = undefined;
	if (!!values?.password) {
		hashedPassword = await bcrypt.hash(values.password, 10);
	}

	//Parse the certificates
	let certificates = [];
	if (!!formData) {
		for (let [key, value] of formData.entries()) {
			if (key.includes('certificates')) {
				const [_, index, property] = key.split('.'); // Extract index and property name

				if (!certificates[+index]) {
					certificates[+index] = {
						file: null as any,
						certificateName: '',
						certifiedDate: '',
						institution: '',
					};
				}

				if (property === 'file') {
					certificates[+index].file = value as File;
				} else if (property === 'certificateName') {
					certificates[+index].certificateName = value as string;
				} else if (property === 'certifiedDate') {
					certificates[+index].certifiedDate = value as string;
				} else if (property === 'institution') {
					certificates[+index].institution = value as string;
				}
			}
		}
	}

	//Check if the certificate file size is greater than 3MB
	certificates?.forEach?.((image, index) => {
		if (typeof image?.file === 'string') return;

		if (!!image?.file?.size && image?.file?.size > 3000000) {
			return {
				error: 'File size cannot exceed 3MB. Please compress or upload another file.',
			};
		}
	});

	let uuids: { name: string; uuid: string }[] = [];

	//Upload the certificates to S3
	await Promise.all(
		certificates?.map(async (image, index) => {
			if (typeof image?.file === 'string') return;
			const uuid = uuidv4();

			const buffer = Buffer.from(await image?.file?.arrayBuffer());
			await uploadFileToS3(buffer, `${uuid}-${image?.file.name}`);

			uuids.push({ name: image?.file?.name, uuid });
		})
	);

	if (foundApplication.avatar && foundApplication.avatar.includes(s3Path) && !!avatar?.size) {
		//If the user already has an avatar, remove it from S3
		const avatarKey = foundApplication.avatar.split('/').pop();
		await removeFileFromS3(avatarKey ?? '');
	}

	//Update the application
	const [updatedApplication] = await db
		.update(coachApplication)
		.set({
			email: !!values?.email ? values.email : undefined,
			firstName: !!values?.firstName ? values.firstName : undefined,
			lastName: !!values?.lastName ? values.lastName : undefined,
			password: !!values?.password ? hashedPassword : undefined,
			agreedToMarketing: !!values?.agreedToMarketing ? values.agreedToMarketing : undefined,
			agreedToTerms: !!values?.agreedToTerms ? values.agreedToTerms : undefined,
			businessName: values.businessName,
			hoursExperience: !!values?.hoursExperience ? Number(values.hoursExperience) : undefined,
			businessNumber: !!values?.businessNumber ? values.businessNumber : undefined,
			location: !!values?.location ? values.location : undefined,
			timezone: !!values?.timezone ? values.timezone : undefined,
			yearsExperience: !!values?.yearsExperience ? Number(values.yearsExperience) : undefined,
			avatar: !!avatar?.size ? `${s3Path}/${uuid}` : undefined,
			certificates:
				certificates?.map?.((image, index) => {
					let imagePath = '';
					if (typeof image?.file === 'string') {
						imagePath = image?.file;
					} else {
						const foundUuid = uuids.find((uuid) => uuid.name === image?.file.name);
						imagePath = `${s3Path}/${foundUuid?.uuid}-${image?.file.name}`;
					}

					return {
						file: imagePath,
						certificateName: image?.certificateName,
						certifiedDate: image?.certifiedDate,
						institution: image?.institution,
					};
				}) ?? [],
		})
		.where(eq(coachApplication.id, applicationId.value))
		.returning();

	await revalidatePath('/auth/coach-setup');

	return { success: true, data: updatedApplication };
};
