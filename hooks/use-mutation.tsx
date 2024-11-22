'use client';

import { toast } from '@/components/ui/use-toast';
import { useEffect, useState, useTransition } from 'react';

/**
 * A custom hook to handle query requests.
 * @param queryFn The function to execute the query.
 * @returns An object with the query function, status, data, and loading state.
 * @description This hook will also display a toast notification based on the response.
 */

// Generic type T for input values and R for response type
export function useMutation<T, R>({
	queryFn,
	onCompleted,
	onSuccess,
	onError,
}: {
	queryFn: (values?: T) => Promise<any>;
	onCompleted?: (data?: { success?: string; error?: string } & R) => void;
	onSuccess?: (data?: { success?: string; error?: string } & R) => void;
	onError?: (data?: { success?: string; error?: string } & R) => void;
}) {
	type QueryResponse = { success?: string; error?: string } & R;

	const [queryStatus, setQueryStatus] = useState<'error' | 'success'>();
	const [data, setData] = useState<QueryResponse>();
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		if (!data) return;

		onCompleted?.(data);
		if (data?.success) onSuccess?.(data);
		if (data?.error) onError?.(data);
	}, [data]);

	const query = async (values?: T | undefined) => {
		let response: QueryResponse;

		await startTransition(async () => {
			// Execute the queryFn within the transition
			const responseData = await queryFn(values).then((res) => {
				response = res as QueryResponse;

				console.log(response, 'response datatat');
				setData(response);

				if (response?.success) setQueryStatus('success');
				else setQueryStatus('error');

				if (!!response?.error || !!response?.success) {
					toast({
						description: response?.error ?? response?.success ?? 'An error occurred.',
						variant: response?.error ? 'destructive' : 'default',
					});
				}

				return response;
			});

			return;
		});

		return;
	};

	return { query, status: queryStatus, data, isLoading: isPending };
}
