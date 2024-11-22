import { Navbar } from '@/components/layout/navbar';
import { SessionTrackerProvider } from '@/components/session-provider';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Fredoka, Inter, Open_Sans } from 'next/font/google';
import '../globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Suspense } from 'react';
export const metadata: Metadata = {
	title: 'Coaching Hours',
	description: 'Coaching Hours is a coaching platform for coachees and coaches.',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SessionProvider>
			<SessionTrackerProvider>
				<ThemeProvider>
					<Toaster />
					<div className={`flex flex-col min-h-screen mx-auto`}>
						<Navbar sticky contained disableBorderBottom />

						<div className="flex flex-1 relative">
							<main className="w-full flex-1 flex flex-col ">{children}</main>
						</div>
					</div>
				</ThemeProvider>
			</SessionTrackerProvider>
		</SessionProvider>
	);
}
