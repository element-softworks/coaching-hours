'use server';

import { db } from '@/db/drizzle/db';
import { coach, coachApplication, user } from '@/db/drizzle/schema';
import { sendNewApplicationEmail } from '@/lib/mail';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { register } from '../auth/register';

export const coachApplicationSubmit = async () => {
	const coachAppId = await cookies().get('coachApplicationId')?.value;

	if (!coachAppId) {
		return { error: 'No coach application id found' };
	}

	const [foundCoachApplication] = await db
		.select()
		.from(coachApplication)
		.where(eq(coachApplication.id, coachAppId));

	if (!foundCoachApplication) {
		return { error: 'No coach application found' };
	}

	await sendNewApplicationEmail(foundCoachApplication);

	if (foundCoachApplication.status !== 'IN_PROGRESS') {
		return { error: 'Coach application already submitted' };
	}

	//Create a new user from the application
	try {
		const newUser = await register(
			{
				email: foundCoachApplication?.email ?? '',
				password: foundCoachApplication?.password ?? '',
				name: `${foundCoachApplication?.firstName} ${foundCoachApplication?.lastName}`,
			},
			{},
			true,
			true
		);

		//Create a new coach from the application
		const [linkedCoach] = await db
			.insert(coach)
			.values({
				avatar: foundCoachApplication?.avatar ?? '',
				businessName: foundCoachApplication?.businessName ?? '',
				businessNumber: foundCoachApplication?.businessNumber ?? '',
				certificates: foundCoachApplication?.certificates ?? [],
				userId: newUser?.user?.id ?? '',
				hoursExperience: foundCoachApplication?.hoursExperience ?? 0,
				location: foundCoachApplication?.location ?? '',
				timezone: foundCoachApplication?.timezone ?? '',
				yearsExperience: foundCoachApplication?.yearsExperience ?? 0,
				bookingInAdvance: foundCoachApplication?.bookingInAdvance ?? 0,
			})
			.returning();

		//Update the user to have the new coachId
		await db
			.update(user)
			.set({ coachId: linkedCoach?.id ?? '' })
			.where(eq(user.id, newUser?.user?.id ?? ''))
			.returning();

		//Update the coach application status to PENDING review and apply the new coachID
		await db
			.update(coachApplication)
			.set({ status: 'PENDING', coachId: linkedCoach?.id ?? '' })
			.where(eq(coachApplication.id, coachAppId))
			.returning({ id: coachApplication.id });
	} catch (error) {
		console.error(error, 'error creating coach');
		return { error: 'An error occurred creating the coach, please try again later.' };
	}

	return { success: 'Coach app submitted. Email verification sent.' };
};
