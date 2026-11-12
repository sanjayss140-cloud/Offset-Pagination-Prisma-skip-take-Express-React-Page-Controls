import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getThreads } from "../services/threads.service";
import ThreadItem from "./ThreadItem.jsx";

const PAGE_SIZE = 10;

export default function ThreadList() {
  const [page, setPage] = useState(1);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["threads", { page }],
    queryFn: () => getThreads(page),
    placeholderData: keepPreviousData,
  });

  if (isPending) return <p className="muted">Loading threads…</p>;
  if (isError) return <p className="error">Could not load threads: {error.message}</p>;

  const { threads, total } = data;
  if (!threads || (threads.length === 0 && page === 1)) {
    return <p className="muted">No threads found.</p>;
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      {threads.length === 0 ? (
        <p className="muted">No threads found on this page.</p>
      ) : (
        <ul className="threads">
          {threads.map((thread) => (
            <ThreadItem key={thread.id} thread={thread} />
          ))}
        </ul>
      )}

      <div className="pager">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="page-label">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          disabled={!data.hasMore}
        >
          Next
        </button>
      </div>
    </div>
  );
}
