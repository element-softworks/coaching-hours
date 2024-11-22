'use server';

import { getVerificationTokenByEmail } from '@/data/verification-token';
import { db } from '@/db/drizzle/db';
import { coachApplication } from '@/db/drizzle/schema';
import { sendNewApplicationEmail, sendVerificationEmail } from '@/lib/mail';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export const resendCoachApplicationEmail = async () => {
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

	// Generate a verification token and send it to the user via email
	const verificationToken = await getVerificationTokenByEmail(foundCoachApplication?.email ?? '');
	const data = await sendVerificationEmail(verificationToken!, true);

	return { success: 'Email verification resent' };
};
