import type { MetaFunction } from "@remix-run/node";
import {
	Form,
	Link,
	useLoaderData,
	useLocation,
	useNavigation,
} from "@remix-run/react";
import * as pagination from "@zag-js/pagination";
import { normalizeProps, useMachine } from "@zag-js/react";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	EllipsisIcon,
	SearchIcon,
} from "lucide-react";
import type React from "react";
import { useId, useRef, useState } from "react";
import { MoviePoster } from "~/components/MoviePoster";
import { loader } from "./loader.server";
import type { SearchResult } from "./schema";

export { loader };

export const meta: MetaFunction = () => [{ title: "Search Movies" }];

export default function Index() {
	const { searchResult } = useLoaderData<typeof loader>();
	const location = useLocation();
	const [query, setQuery] = useState(
		() => new URLSearchParams(location.search).get("query") ?? "",
	);
	return (
		<main className="p-8 [--spacing:theme(spacing.10)]">
			<h1 className="text-center text-4xl">Search for Movies</h1>
			<SearchForm query={query} onQueryChange={setQuery} />
			{searchResult !== null && (
				<SearchResultGrid searchResult={searchResult} query={query} />
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
		}, 500);
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
}: {
	searchResult: SearchResult;
	query: string;
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

	return (
		<>
			<ul
				role="list"
				className="mx-auto grid w-fit gap-8 pt-[--spacing] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
			>
				{searchResult.results.map((movie) => (
					<li key={movie.id}>
						<MovieCard movie={movie} />
					</li>
				))}
			</ul>
			<Pagination query={query} count={searchResult.total_results} />
			<p className="mt-10 text-center text-sm">
				Movie data is provided by{" "}
				<a
					href="https://www.themoviedb.org"
					target="_blank"
					rel="noopener noreferrer"
					className="link-hover link-secondary"
				>
					TMDB
				</a>
			</p>
		</>
	);
}

function MovieCard({ movie }: { movie: SearchResult["results"][number] }) {
	const navigation = useNavigation();
	const href = `/movies/${movie.id}`;
	const loading =
		navigation.state === "loading" && navigation.location.pathname === href;

	return (
		<Link to={href} prefetch="intent" className="group relative block">
			<div className="w-[200px]">
				<MoviePoster path={movie.poster_path} size="w500" />
			</div>
			<p
				data-placeholder={movie.poster_path === null ? true : undefined}
				className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 text-center font-medium opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 data-[placeholder]:opacity-100"
			>
				{movie.title}
			</p>
			<div
				data-loading={loading ? true : undefined}
				className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/80 opacity-0 transition-opacity data-[loading]:opacity-100"
			>
				<span className="loading loading-spinner size-10" />
			</div>
		</Link>
	);
}

function Pagination({ query, count }: { query: string; count: number }) {
	const id = useId();
	const location = useLocation();
	const [state, send] = useMachine(pagination.machine({ id, count }), {
		context: {
			count,
			page: Number.parseInt(
				new URLSearchParams(location.search).get("page") || "1",
				10,
			),
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
									// biome-ignore lint/suspicious/noArrayIndexKey: Using the index as key is fine here
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
