'use client';

import {
	GetUserNotificationsResponse,
	getUserNotifications,
} from '@/actions/account/get-user-notifications';
import { markUserNotificationsRead } from '@/actions/account/mark-user-notifications-read';
import { ExtendedUser } from '@/next-auth';
import { DropdownMenuGroup, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { BellDotIcon, Settings } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import { NotificationsIcon } from '../general/notifications-icon';
import { StatusIcon } from '../general/status-icon';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Separator } from '../ui/separator';

interface NotificationsMenuProps {
	user: ExtendedUser | undefined;
	count?: number;
}
export function NotificationsMenu(props: NotificationsMenuProps) {
	const { update, data } = useSession();

	const [onScreenNotifications, setOnScreenNotifications] = useState(4);

	const [notificationResponse, setNotificationResponse] =
		useState<GetUserNotificationsResponse | null>(null);

	useEffect(() => {
		(async () => {
			const response = await getUserNotifications(props.user?.id ?? '', 100, 1, true);
			setNotificationResponse(response);
		})();
	}, []);

	useEffect(() => {
		if (!notificationResponse) return;
		(async () => {
			await markUserNotificationsRead({
				notificationIds:
					notificationResponse?.notifications?.map((notif, index) =>
						onScreenNotifications > index ? notif.id : ''
					) ?? [],
			});

			await update();
		})();
	}, [onScreenNotifications, notificationResponse]);

	if (!props.user) {
		return null;
	}
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild className="cursor-pointer">
				{/* <Tooltip text="Notifications" className="-bottom-10"> */}
				<Button variant="ghost">
					<div className="relative">
						<BellDotIcon className="h-5 w-5" />
						<NotificationsIcon
							className="-top-1.5 left-2 absolute"
							count={props.count}
						/>
					</div>
				</Button>
				{/* </Tooltip> */}
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-80 max-h-[400px] overflow-auto mr-2 px-4"
				onScroll={(e) => {
					const target = e.target as HTMLDivElement;
					const scrollBottom =
						target.scrollHeight - target.scrollTop - target.clientHeight;

					setOnScreenNotifications(
						Math.min(
							notificationResponse?.notifications?.length ?? 0,
							Math.floor(
								(target.scrollTop / target.scrollHeight) *
									(notificationResponse?.notifications?.length ?? 0)
							) + 4
						)
					);
				}}
			>
				<div className="sticky -top-2 left-0 bg-card -mx-4 z-30 ">
					<div className="flex gap-4 items-center">
						<p className="py-4 mx-4 flex-1">Notifications</p>

						<Link href="/dashboard/notifications">
							<Button variant="ghost" className="mr-1">
								<Settings className="h-5 w-5" />
							</Button>
						</Link>
					</div>
					<Separator />
				</div>

				<DropdownMenuGroup>
					{!notificationResponse?.notifications?.length && (
						<DropdownMenuItem className="py-4">
							<p className="text-center">No notifications</p>
						</DropdownMenuItem>
					)}
					{notificationResponse?.notifications?.map((notif, index) => {
						return (
							<Fragment key={index}>
								<DropdownMenuItem className="py-4">
									<div className="flex gap-0 items-center">
										<p className="font-semibold flex-1" key={notif.id}>
											{notif.title}
										</p>
										<StatusIcon status={'successful'} />
									</div>
									<p className="text-sm" key={notif.id}>
										{notif.message}
									</p>
								</DropdownMenuItem>
								<Separator />
							</Fragment>
						);
					})}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
