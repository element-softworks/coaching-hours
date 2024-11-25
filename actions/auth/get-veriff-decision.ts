'use server';
import { db } from '@/db/drizzle/db';
import { coachApplication } from '@/db/drizzle/schema';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { coachApplicationSubmit } from '../booking-system/coach-application-submit';

if (!process.env.VERIFF_CLIENT_ID) {
	throw new Error('VERIFF_CLIENT_ID is not defined');
}

/**
 * Generates an HMAC signature using the Veriff secret and payload.
 * @param {string} sharedSecretKey - The Veriff secret.
 * @param {string} payload - The payload to sign (e.g., request data or URL).
 * @returns {string} - The HMAC signature in hexadecimal format.
 */
function generateHmacSignature(sharedSecretKey: string, payload: string): string {
	return crypto.createHmac('sha256', sharedSecretKey).update(payload, 'utf8').digest('hex');
}

export const getVeriffDecision = async () => {
	const veriffSession = await cookies().get('veriffSession');

	const hmacSignature = generateHmacSignature(
		process.env.VERIFF_SECRET!,
		veriffSession?.value ?? ''
	);

	const session = await fetch(
		`https://stationapi.veriff.com/v1/sessions/${veriffSession?.value}/attempts`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-AUTH-CLIENT': process.env.VERIFF_CLIENT_ID!,
				'X-HMAC-SIGNATURE': hmacSignature,
			},
		}
	).then((res) => res.json());

	const verified = session?.verifications?.some((v: any) => v?.status === 'approved') ?? false;

	if (session?.verifications?.[0]?.status === 'created') {
		redirect('/auth/coach-setup?step=identity-check');
	}

	const coachAppId = await cookies().get('coachApplicationId');

	const [foundApplication] = await db
		.select()
		.from(coachApplication)
		.where(eq(coachApplication.id, coachAppId?.value ?? ''));

	if (foundApplication) {
		await db
			.update(coachApplication)
			.set({ idVerified: verified })
			.where(eq(coachApplication.id, coachAppId?.value ?? ''));
	} else {
		return { error: 'Application not found', verified: false };
	}

	if (foundApplication.status !== 'IN_PROGRESS') {
		return { verified: true, email: foundApplication.email };
	}

	if (verified) {
		//If successful, submit the application

		const response = await coachApplicationSubmit();

		if (response.error) {
			return { error: response.error, verified: true };
		}

		return {
			success: 'Verification successful. Please verify your email address to sign in.',
			verified: true,
		};
	} else {
		return { error: 'Verification failed', verified: false, email: foundApplication.email };
	}
};
