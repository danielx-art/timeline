import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";

import EditForm from "../components/EditForm";
import NavBar from "../components/NavBar";
import TimeLineEntries from "../components/TimeLineEntries";
import { api } from "../utils/api";

const Dashboard: NextPage = () => {
  const { data: sessionData } = useSession();
  const { data: entries, refetch: refetchEntries } =
    api.timeline.getEntries.useQuery();

  return (
    <>
      <Head>
        <title>Edit Page</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-pink1b to-blue1 p-4">
        <NavBar {...{ sessionData, edit: true }} />
        <EditForm {...{ sessionData, refetchEntries }} />
        <TimeLineEntries {...{ sessionData, entries, refetchEntries }} />
      </main>
    </>
  );
};

export default Dashboard;
