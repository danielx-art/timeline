import { api } from "../utils/api";
import type { Session } from "next-auth";
import type { TimelineEntry } from "@prisma/client";
import type { QueryObserverBaseResult } from "@tanstack/react-query";

const TimeLineEntries: React.FC<{
  sessionData: Session | null;
  entries: TimelineEntry[] | undefined;
  refetchEntries: QueryObserverBaseResult["refetch"];
}> = ({ sessionData, entries, refetchEntries }) => {
  const entryDelete = api.timeline.deleteEntry.useMutation({
    onSuccess: () => {
      refetchEntries();
    },
  });

  const deleteItem = (
    evt: React.MouseEvent<HTMLButtonElement>,
    entry: TimelineEntry
  ) => {
    evt.preventDefault();
    if (sessionData?.user) {
      entryDelete.mutate({ userId: sessionData.user.id, entryId: entry.id });
    }
  };

  return (
    <div className="mt-3 w-3/4 min-w-fit">
      <p className="box-border w-full self-start rounded-t-lg bg-gray-200 p-4 text-sm font-semibold text-blue1">
        Past entries
      </p>
      {entries &&
        entries?.map((entry) => {
          return (
            <div
              key={entry.id}
              className="border-box container my-1 flex flex-nowrap items-center rounded bg-white bg-opacity-90 px-4 py-2 drop-shadow-md"
            >
              <div className="w-full">{entry.title}</div>
              {sessionData?.user?.id === entry.userId && (
                <button
                  type="button"
                  onClick={(evt) => {
                    deleteItem(evt, entry);
                  }}
                  disabled={entryDelete.isLoading}
                  className=" text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className=" h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default TimeLineEntries;
