'use client';

import { auth } from '@/auth';
import { useSession } from 'next-auth/react';

export function useCurrentUser() {
	const session = useSession()?.data?.user;

	return session;
}