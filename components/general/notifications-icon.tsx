'use client';

interface NotificationsIconProps {
	className?: string;
	count?: number;
}

export function NotificationsIcon(props: NotificationsIconProps) {
	return (
		<div
			className={`transition-all bg-destructive rounded-full flex items-center justify-center text-destructive-foreground font-extrabold text-[0.6rem] size-5  ${
				props.className && props.className
			}
            ${!props.count ? 'scale-50 opacity-0' : 'scale-100 opacity-100'}
            `}
		>
			{props.count ?? 0}
		</div>
	);
}
