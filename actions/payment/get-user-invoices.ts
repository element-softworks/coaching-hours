'use server';

import { db } from '@/db/drizzle/db';
import { customerInvoice } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { and, asc, count, desc, eq, or, sql } from 'drizzle-orm';

interface GetUserInvoicesProps {
	userId: string;
	pageNum: number;
	perPage: number;
	search: string;
	filters: {
		createdAt: string;
	};
}
export const getUserInvoices = async (props: GetUserInvoicesProps) => {
	const authUser = await currentUser();

	if (!authUser) {
		return { error: 'User not found' };
	}

	const invoicesResponse = await db
		.select()
		.from(customerInvoice)
		.where(
			and(
				eq(customerInvoice.userId, props.userId),
				or(
					sql`lower(${customerInvoice.id}) like ${`%${props.search.toLowerCase()}%`}`,
					sql`lower(${customerInvoice.status}) like ${`%${props.search.toLowerCase()}%`}`
				)
			)
		)
		.orderBy(
			props.filters.createdAt === 'asc'
				? asc(customerInvoice.createdAt)
				: desc(customerInvoice.createdAt)
		)
		.limit(props.perPage)
		.offset(props.perPage * (props.pageNum - 1));

	const [totalInvoices] = await db
		.select({ count: count() })
		.from(customerInvoice)
		.where(
			and(
				eq(customerInvoice.userId, props.userId),
				or(
					sql`lower(${customerInvoice.id}) like ${`%${props.search.toLowerCase()}%`}`,
					sql`lower(${customerInvoice.status}) like ${`%${props.search.toLowerCase()}%`}`
				)
			)
		);

	const totalPages = Math.ceil(totalInvoices.count / props.perPage);

	return { invoices: invoicesResponse, totalPages: totalPages };
};
