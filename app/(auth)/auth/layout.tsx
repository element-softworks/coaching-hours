import { Logo } from '@/components/general/logo';
import { Footer } from '@/components/marketing/footer';
import Image from 'next/image';
import { Suspense } from 'react';
import { ClipLoader } from 'react-spinners';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<main className="auth-layout min-h-screen max-w-full">
			<section className="flex flex-col md:flex-row min-h-screen ">
				<section className="min-h-screen bg-primary-foreground flex-1 ">
					<section className="h-16 block md:hidden">
						<div className="isolate">
							<div className="noise"></div>
							<div className="overlay dark:!bg-[#94746a]"></div>
						</div>
					</section>
					<div className=" min-h-screen mb-auto relative max-w-lg mx-auto w-full py-8 px-4 md:px-8 flex flex-col">
						<Logo width={200} height={50} />
						<div className="justify-center items-center flex mx-auto flex-col my-auto w-full">
							<Suspense fallback={<ClipLoader size={50} />}>{children}</Suspense>
						</div>
					</div>
				</section>
				<aside className="md:flex overflow-hidden hidden flex-col w-1/2 bg-background  flex-0 md:flex-1 relative text-white ">
					<section className="h-16 ">
						<div className="isolate ">
							<div className="noise "></div>
							<div className="overlay dark:!bg-[#94746a]"></div>
						</div>
					</section>

					<div className="z-10 relative md:flex justify-center flex-1 hidden px-4 ">
						<Image
							className="object-contain  2xl:w-[70%] max-w-[800px]"
							alt="People in office"
							loading="eager"
							priority
							width={500}
							height={500}
							src="/images/auth/auth-images.png"
						/>
					</div>
				</aside>
			</section>
			<Footer />
		</main>
	);
}
