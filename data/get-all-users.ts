import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { UserRole } from '@prisma/client';
import Error from 'next/error';

export const getAllUsers = async ({ pageNum, perPage }: { pageNum: number; perPage: number }) => {
	try {
		const currUser = await currentUser();

		if (!currUser) {
			return { error: 'You must be logged in to view users.' };
		}

		if (currUser && currUser.role !== UserRole.ADMIN) {
			return { error: 'You must be an admin to view users.' };
		}

		const users = await db.user.findMany({
			skip: (pageNum - 1) * perPage,
			take: perPage,
			orderBy: { createdAt: 'desc' },
		});

		return { success: 'Users retrieved successfully.', users: users };
	} catch (error: any) {
		return { error: error?.message ?? 'There was a problem retrieving users.' };
	}
};
