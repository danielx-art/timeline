import { type NextPage } from "next";
import Head from "next/head";
//import Link from "next/link";
import { useSession } from "next-auth/react";

//import { api } from "../utils/api";
//import type { Session } from "next-auth";
import NavBar from "../components/NavBar";
import { Timeline } from "../components/Timeline";

const Home: NextPage = () => {
  //const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>Index</title>
      </Head>
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-pink1b to-blue1">
        <Timeline />
      </main>
      <NavBar {...{ sessionData, edit: false }} />
    </>
  );
};

export default Home;

/* <p className="text-2xl text-white">
      {hello.data ? hello.data.greeting : "Loading tRPC query..."}
    </p> */
