'use server';
import { getUserById } from '@/data/user';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { SettingsSchema } from '@/schemas';
import z from 'zod';
export const updateUserSettings = async (values: z.infer<typeof SettingsSchema>) => {
	const user = await currentUser();

	if (!user) {
		return { error: 'Unauthorized' };
	}

	const dbUser = await getUserById(user?.id ?? '');

	if (!dbUser) {
		return { error: 'Unauthorized' };
	}

	//As an oauth user, we can't update email and password and have no two factor authentication on app
	await db.user.update({
		where: { id: user.id },
		data: {
			...values,
			email: undefined,
			isTwoFactorEnabled: undefined,
			password: undefined,
		},
	});

	return { success: 'Settings updated' };
};
