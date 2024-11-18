import { AuthLayoutButton } from '@/components/auth/auth-layout-button';
import { FrameIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { ClipLoader } from 'react-spinners';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<main className="auth-layout h-screen max-w-full">
			<section className="flex flex-col md:flex-row min-h-screen ">
				<section className="min-h-screen bg-primary-foreground flex-1">
					<div className=" min-h-screen mb-auto relative max-w-lg mx-auto py-8 px-4 md:px-8 ">
						<Image
							src="https://coaching-hours.s3.eu-west-2.amazonaws.com/coaching-hours-logo.svg"
							alt="Coaching hours logo"
							width={150}
							height={80}
							className=""
						/>
						<div className="justify-center items-center flex mx-auto flex-col">
							<Suspense fallback={<ClipLoader size={50} />}>{children}</Suspense>
						</div>
					</div>
				</section>
				<aside className="md:flex hidden flex-col w-1/2 bg-background  flex-0 md:flex-1 relative text-white p-8">
					<div className={` opacity-10 w-full h-full absolute z-0 bg-cover -m-8`} />
					<Link
						href="/"
						className="z-20 absolute md:flex items-center text-lg font-light hidden top-4 md:top-8 left-4 md:left-8"
					>
						<FrameIcon className="mr-2" size={30} />
						<p className="hidden md:block">Coaching Hours</p>
					</Link>
					<div className="z-10 relative md:flex items-center justify-center flex-1 hidden">
						<div className="text-start">
							<p className="text-3xl font-semibold tracking-tight">Welcome</p>
						</div>
					</div>
					<blockquote className="space-y-2">
						<p className="md:text-md lg:text-lg">
							“This software has revolutionized the way I manage my projects,
							streamlining my workflow and allowing me to exceed client expectations
							every time.”
						</p>
						<footer className="md:text-xs lg:text-sm">Nathan Carter</footer>
					</blockquote>
				</aside>
			</section>
		</main>
	);
}
