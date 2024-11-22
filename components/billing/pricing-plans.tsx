'use client';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useStripePricing } from '@/hooks/use-stripe-pricing';
import plans from '@/plans';
import { CheckCircle2, X } from 'lucide-react';
import { useState } from 'react';

interface PricingProps {
	readOnly?: boolean;
	userId: string;
	currentPlanId: string | undefined;
	stripeCustomerId: string;
}

interface PricingCardProps {
	type?: 'year' | 'month';
	planName: string;
	price: string;
	description: string;
	features: { feature: string; active: boolean }[];
	Button: React.ReactNode;
	className?: string;
	discount?: string | null;
}
export function PricingCard(props: PricingCardProps) {
	return (
		<Card className={`w-full flex flex-col ${props.className}`}>
			<CardHeader>
				<p className="font-semibold text-muted-foreground">{props.planName}</p>

				<CardTitle
					className={`${
						!!props.discount?.length
							? 'text-muted-foreground line-through text-base '
							: ''
					}`}
				>
					{props.price}
					{!!props.type?.length ? `/${props.type}` : ''}
				</CardTitle>
				<CardTitle className="text-2xl">{props.discount}</CardTitle>
				<CardDescription>{props.description}</CardDescription>
			</CardHeader>
			<CardContent className="my-6 flex flex-col gap-2">
				{props.features?.map((feature, index) => {
					if (!feature.active) {
						return (
							<div key={index} className="flex gap-2 items-center">
								<X className="text-muted-foreground" size={18} />
								<p>{feature.feature}</p>
							</div>
						);
					}

					return (
						<div key={index} className="flex gap-2 items-center">
							<CheckCircle2 className="text-successful" size={18} />
							<p>{feature.feature}</p>
						</div>
					);
				})}
			</CardContent>
			<CardFooter className="flex justify-between mt-auto">{props.Button}</CardFooter>
		</Card>
	);
}

export function SubscriptionPricingPlans(props: PricingProps) {
	const [price, setPrice] = useState<'basic' | 'pro' | 'enterprise' | null>(null);

	const [isYearly, setIsYearly] = useState(false);

	const { isLoading } = useStripePricing({
		enabled: !!price,
		price,
		stripeCustomerId: props.stripeCustomerId,
	});

	const basic = plans.basic;
	const pro = plans.pro;
	const enterprise = plans.enterprise;

	const calcPrice = (price: number, yearly: boolean) => {
		const formattedPrice = yearly ? price * 12 : price;

		return `£${formattedPrice.toFixed(2)}`;
	};

	return (
		<div className="text-start lg:text-center">
			<p className="text-xl md:text-3xl font-bold">Coaching hours pricing plans</p>
			<p className="text-muted-foreground">Select a plan to upgrade your account</p>

			<div className="flex gap-2 justify-start lg:justify-center mt-4">
				<Button
					onClick={() => setIsYearly(true)}
					variant={isYearly ? 'default' : 'secondary'}
				>
					Yearly
				</Button>
				<Button
					variant={!isYearly ? 'default' : 'secondary'}
					onClick={() => setIsYearly(false)}
				>
					Monthly
				</Button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 lg:mt-10">
				<PricingCard
					type={isYearly ? 'year' : 'month'}
					planName={basic.name}
					price={calcPrice(basic.price, isYearly)}
					description="Essential features you need to get started"
					features={basic.features}
					Button={
						<Button
							isLoading={price === 'basic' && isLoading}
							disabled={
								props.currentPlanId === basic.stripePricingId ||
								(price === 'basic' && isLoading) ||
								props.readOnly
							}
							className="w-full"
							onClick={() => {
								setPrice('basic');
							}}
						>
							{props.currentPlanId === basic.stripePricingId
								? 'Current plan'
								: 'Get started with Basic'}
						</Button>
					}
				/>
				<PricingCard
					className="lg:scale-105 shadow-md border-primary"
					type={isYearly ? 'year' : 'month'}
					planName={pro.name}
					price={calcPrice(pro.price, isYearly)}
					description="Perfect for owners of small & medium businesses"
					features={pro.features}
					Button={
						<Button
							isLoading={price === 'pro' && isLoading}
							disabled={
								props.currentPlanId === pro.stripePricingId ||
								(price === 'pro' && isLoading) ||
								props.readOnly
							}
							className="w-full"
							onClick={() => {
								setPrice('pro');
							}}
						>
							{props.currentPlanId === pro.stripePricingId
								? 'Current plan'
								: 'Get started with Pro'}
						</Button>
					}
				/>

				<PricingCard
					type={isYearly ? 'year' : 'month'}
					planName={enterprise.name}
					price={calcPrice(enterprise.price, isYearly)}
					description="Dedicated support and infrastructure to fit your needs"
					features={enterprise.features}
					Button={
						<Button
							isLoading={price === 'enterprise' && isLoading}
							disabled={
								props.currentPlanId === enterprise.stripePricingId ||
								(price === 'enterprise' && isLoading) ||
								props.readOnly
							}
							className="w-full"
							onClick={() => {
								setPrice('enterprise');
							}}
						>
							{props.currentPlanId === enterprise.stripePricingId
								? 'Current plan'
								: 'Get started with enterprise'}
						</Button>
					}
				/>
			</div>
		</div>
	);
}

export function OneTimePricingPlans(props: PricingProps) {
	const [price, setPrice] = useState<'starter' | 'full access' | null>(null);

	const [isYearly, setIsYearly] = useState(false);

	const { isLoading } = useStripePricing({
		enabled: !!price,
		price,
		stripeCustomerId: props.stripeCustomerId,
	});

	const fullAccess = plans?.['full access'];
	const starter = plans?.['starter'];

	const calcPrice = (price: number, yearly: boolean) => {
		const formattedPrice = yearly ? price * 12 : price;

		return `£${formattedPrice.toFixed(2)}`;
	};

	const currentPlan = Object.entries(plans).find(
		(plan) => plan?.[1]?.stripePricingId === props.currentPlanId
	)?.[1];

	return (
		<div className="text-start lg:text-center">
			<p className="text-xl md:text-3xl font-bold">Coaching hours pricing plans</p>
			<p className="text-muted-foreground">Select a plan to upgrade your account</p>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 lg:mt-10">
				<PricingCard
					planName={starter.name}
					price={calcPrice(starter.price, isYearly)}
					description="Perfect for owners of small & medium businesses"
					features={starter.features}
					Button={
						<Button
							isLoading={price === 'starter' && isLoading}
							disabled={
								props.currentPlanId === starter.stripePricingId ||
								(price === 'starter' && isLoading) ||
								props.readOnly ||
								Number(currentPlan?.price) > Number(starter.price)
							}
							className="w-full"
							onClick={() => {
								setPrice('starter');
							}}
						>
							{props.currentPlanId === starter.stripePricingId
								? 'Current plan'
								: 'Get started with Starter'}
						</Button>
					}
				/>

				<PricingCard
					className="shadow-md border-primary"
					planName={fullAccess.name}
					price={calcPrice(fullAccess.price, isYearly)}
					discount={
						!!currentPlan
							? calcPrice(fullAccess.price - currentPlan.price, isYearly)
							: undefined
					}
					description="Dedicated support and infrastructure to fit your needs"
					features={fullAccess.features}
					Button={
						<Button
							isLoading={price === 'full access' && isLoading}
							disabled={
								props.currentPlanId === fullAccess.stripePricingId ||
								(price === 'full access' && isLoading) ||
								props.readOnly
							}
							className="w-full"
							onClick={() => {
								setPrice('full access');
							}}
						>
							{props.currentPlanId === fullAccess.stripePricingId
								? 'Current plan'
								: 'Get started with Full Access'}
						</Button>
					}
				/>
			</div>
		</div>
	);
}

interface PricingPlansProps extends PricingProps {
	type: 'one-time' | 'subscription';
}
export default function PricingPlans(props: PricingPlansProps) {
	if (props.type === 'subscription') {
		return <SubscriptionPricingPlans {...props} />;
	} else if (props.type === 'one-time') {
		return <OneTimePricingPlans {...props} />;
	}
}
