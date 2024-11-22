import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import { Fredoka, Inter, Open_Sans } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/marketing/footer';

const fredoka = Fredoka({
	subsets: ['latin'],
	variable: '--font-fredoka',
	weight: ['300', '400', '500', '600', '700'],
});
const openSans = Open_Sans({
	subsets: ['latin'],
	variable: '--font-open-sans',
	weight: ['300', '400', '500', '600', '700'],
});

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
		<html
			lang="en"
			suppressHydrationWarning
			className={`${fredoka.variable} ${openSans.variable}`}
		>
			<body>
				<Toaster />
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
