'use client';
import { useCurrentUser } from '@/hooks/use-current-user';
import {
	CreditCard,
	FrameIcon,
	LogOut,
	MenuIcon,
	Moon,
	Notebook,
	Settings,
	ShieldCheck,
	Sun,
	XIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { LogoutButton } from '../auth/logout-button';
import { UserButton } from '../auth/user-button';
import { Button } from '../ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { Team } from '@prisma/client';
import { TeamSelectMenu } from '../auth/team-select-menu';

const NAVBAR_ITEMS = [
	{ name: 'Pricing', href: '/pricing', icon: <CreditCard className="mr-2 h-4 w-4" /> },
	{ name: 'Docs', href: '/docs', icon: <Notebook className="mr-2 h-4 w-4" /> },
];

interface NavbarProps {}

export function Navbar(props: NavbarProps) {
	const user = useCurrentUser();

	const [navOpen, setNavOpen] = useState(false);
	const { setTheme, theme } = useTheme();
	const isLightMode = theme === 'light';
	return (
		<nav className="py-6 px-4 md:px-6 flex flex-row justify-between items-center h-24">
			<Link href="/">
				<div className="z-10 flex items-center text-lg font-light">
					<FrameIcon className="mr-2" size={30} />
					<p className="hidden md:block">NextJS SaaS Boilerplate</p>
				</div>
			</Link>

			<div className="block md:hidden">
				{/* Mobile menu */}
				<DropdownMenu onOpenChange={(open) => setNavOpen(open)}>
					<DropdownMenuTrigger asChild className="cursor-pointer">
						<Button onClick={() => setNavOpen((prev) => !prev)} variant="link">
							{navOpen ? (
								<XIcon className="md:hidden" size={30} />
							) : (
								<MenuIcon className="md:hidden" size={30} />
							)}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className={`w-80 mr-2`}>
						<DropdownMenuLabel>General</DropdownMenuLabel>
						<DropdownMenuGroup>
							{NAVBAR_ITEMS.map((item, index) => {
								return (
									<Link key={index} href={item.href}>
										<DropdownMenuItem className="cursor-pointer">
											{item.icon}
											{item.name}
										</DropdownMenuItem>
									</Link>
								);
							})}
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuLabel>Account</DropdownMenuLabel>
						<DropdownMenuSeparator />

						<DropdownMenuGroup>
							<Link href="/dashboard/settings">
								<DropdownMenuItem className="cursor-pointer">
									<Settings className="mr-2 h-4 w-4" />
									Settings
								</DropdownMenuItem>
							</Link>
							<Link href="/dashboard/security">
								<DropdownMenuItem className="cursor-pointer">
									<ShieldCheck className="mr-2 h-4 w-4" />
									Security
								</DropdownMenuItem>
							</Link>
							<Link href="/dashboard/billing">
								<DropdownMenuItem className="cursor-pointer">
									<CreditCard className="mr-2 h-4 w-4" />
									Billing
								</DropdownMenuItem>
							</Link>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="cursor-pointer"
							onClick={() => setTheme(isLightMode ? 'dark' : 'light')}
						>
							{isLightMode ? (
								<Moon className="mr-2 h-4 w-4" />
							) : (
								<Sun className="mr-2 h-4 w-4" />
							)}
							{isLightMode ? 'Toggle dark mode' : 'Toggle light mode'}
						</DropdownMenuItem>
						<LogoutButton>
							<DropdownMenuItem className="cursor-pointer">
								<LogOut className="mr-2 h-4 w-4" />
								<span>Log out</span>
							</DropdownMenuItem>
						</LogoutButton>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="md:flex items-center gap-10 hidden">
				<div className="flex ">
					{NAVBAR_ITEMS.map((item, index) => {
						return (
							<Button
								size="lg"
								key={index}
								asChild
								variant="link"
								className="px-4 text-md font-medium"
							>
								<Link href={item.href}>{item.name}</Link>
							</Button>
						);
					})}
				</div>

				<div className="flex">
					<UserButton user={user} />
				</div>
			</div>
		</nav>
	);
}
