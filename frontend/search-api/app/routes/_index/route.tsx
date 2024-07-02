import * as pagination from "@zag-js/pagination";
import { normalizeProps, useMachine } from "@zag-js/react";
import type { MetaFunction } from "@remix-run/node";
import {
	Form,
	Link,
	useLoaderData,
	useLocation,
	useNavigation,
} from "@remix-run/react";
import {
	AlertCircleIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	EllipsisIcon,
	SearchIcon,
} from "lucide-react";
import React, { useId, useRef, useState } from "react";
import { loader } from "./loader.server";
import type { SearchResult } from "./schema";

export { loader };

export const meta: MetaFunction = () => [{ title: "Search Movies & TV Shows" }];

export default function Index() {
	const { searchResult } = useLoaderData<typeof loader>();

	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const [query, setQuery] = useState(searchParams.get("query") ?? "");

	return (
		<main className="p-8 [--spacing:theme(spacing.10)]">
			<h1 className="text-center text-3xl">Search for Movies &amp; TV Shows</h1>
			<SearchForm query={query} onQueryChange={setQuery} />
			{searchResult !== null && (
				<SearchResultGrid
					searchResult={searchResult}
					query={query}
					searchParams={searchParams}
				/>
			)}
		</main>
	);
}

function SearchForm({
	query,
	onQueryChange,
}: {
	query: string;
	onQueryChange: (query: string) => void;
}) {
	const submitTimeout = useRef<number | undefined>();
	const form = useRef<HTMLFormElement>(null);

	function debouncedSubmit(event: React.ChangeEvent<HTMLInputElement>) {
		window.clearTimeout(submitTimeout.current);
		submitTimeout.current = window.setTimeout(() => {
			form.current?.requestSubmit();
		}, 300);
		onQueryChange(event.currentTarget.value);
	}

	return (
		<Form ref={form} role="search" className="mx-auto w-fit pt-4">
			<div className="relative flex items-center">
				<input
					type="text"
					name="query"
					aria-label="Search"
					className="input input-bordered w-[400px] max-w-full pr-10"
					value={query}
					onChange={debouncedSubmit}
				/>
				<SearchIcon
					role="presentation"
					className="pointer-events-none absolute right-3 size-5"
				/>
			</div>
			<input type="hidden" name="page" value="1" />
		</Form>
	);
}

function SearchResultGrid({
	searchResult,
	query,
	searchParams,
}: {
	searchResult: SearchResult;
	query: string;
	searchParams: URLSearchParams;
}) {
	const navigation = useNavigation();

	if (navigation.state === "loading" && navigation.location.pathname === "/") {
		return (
			<div className="mx-auto w-fit pt-[--spacing]">
				<span
					aria-label="Loading"
					className="loading loading-spinner size-10"
				/>
			</div>
		);
	}

	if (!searchResult.success) {
		return (
			<div className="mx-auto w-fit pt-[--spacing]">
				<AlertCircleIcon
					role="presentation"
					className="mx-auto size-10 text-error"
				/>
				<p aria-hidden className="mt-4 text-center text-lg text-error">
					{searchResult.error}
				</p>
				<span className="sr-only">Error: {searchResult.error}</span>
			</div>
		);
	}

	return (
		<>
			<ul
				role="list"
				className="mx-auto grid w-fit gap-8 pt-[--spacing] sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"
			>
				{searchResult.movies.map((movie) => (
					<li key={movie.id} className="group relative">
						<img
							src={movie.poster}
							alt={movie.title}
							className="h-[300px] w-[200px]"
						/>
						<p
							aria-hidden
							className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 text-center font-medium opacity-0 transition-opacity duration-500 group-hover:opacity-100"
						>
							{movie.title}
						</p>
					</li>
				))}
			</ul>
			<Pagination
				query={query}
				searchParams={searchParams}
				count={searchResult.totalCount}
			/>
		</>
	);
}

function Pagination({
	query,
	searchParams,
	count,
}: {
	query: string;
	searchParams: URLSearchParams;
	count: number;
}) {
	const id = useId();
	const [state, send] = useMachine(pagination.machine({ id, count }), {
		context: {
			count,
			page: parseInt(searchParams.get("page") || "1", 10),
		},
	});
	const api = pagination.connect(state, send, normalizeProps);

	function pageHref(page: number) {
		const searchParams = new URLSearchParams();
		searchParams.set("query", query);
		searchParams.set("page", page.toString());
		return `?${searchParams}`;
	}

	if (api.totalPages <= 1) {
		return null;
	}

	return (
		<nav {...api.getRootProps()} className="mx-auto w-fit pt-[--spacing]">
			<ul className="flex">
				<li>
					<Link
						to={pageHref(api.previousPage ?? api.page)}
						{...api.getPrevTriggerProps()}
						className="btn btn-square rounded-r-none"
					>
						<ChevronLeftIcon />
					</Link>
				</li>
				{api.pages.map((page, i) => {
					switch (page.type) {
						case "page":
							return (
								<li key={page.value}>
									<Link
										to={pageHref(page.value)}
										{...api.getItemProps(page)}
										data-active={page.value === api.page ? true : undefined}
										className="btn btn-square rounded-none data-[active]:btn-primary data-[active]:btn-active"
									>
										{page.value}
									</Link>
								</li>
							);
						case "ellipsis":
							return (
								<li
									key={`ellipsis-${i}`}
									className="btn-square flex items-center justify-center rounded-none"
								>
									<span {...api.getEllipsisProps({ index: i })}>
										<EllipsisIcon />
									</span>
								</li>
							);
					}
				})}
				<li>
					<Link
						to={pageHref(api.nextPage ?? api.page)}
						{...api.getNextTriggerProps()}
						className="btn btn-square rounded-l-none"
					>
						<ChevronRightIcon />
					</Link>
				</li>
			</ul>
		</nav>
	);
}
