import { InferSelectModel, relations, sql } from 'drizzle-orm';
import { doublePrecision, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { coachSchedule } from './coachSchedule';

export const timeframeDay = pgTable('timeframeDay', {
	id: text('id')
		.primaryKey()
		.notNull()
		.default(sql`gen_random_uuid()`),
	day: integer('day').notNull(),
	coachScheduleId: text('coachScheduleId').notNull(),
	createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	startHour: doublePrecision('startHour').notNull(),
	endHour: doublePrecision('endHour').notNull(),
});

export const timeframeDayRelations = relations(timeframeDay, ({ one, many }) => ({
	coachSchedule: one(coachSchedule, {
		fields: [timeframeDay.coachScheduleId],
		references: [coachSchedule.id],
	}),
}));

export type Coachschedule = InferSelectModel<typeof timeframeDay>;
