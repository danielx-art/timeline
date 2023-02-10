import { type NextPage } from "next";
import Head from "next/head";
//import Link from "next/link";
import { useSession } from "next-auth/react";

//import { api } from "../utils/api";
//import type { Session } from "next-auth";
import NavBar from "../components/NavBar";

const Home: NextPage = () => {
  //const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>Index</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-pink1b to-blue1">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="flex flex-col items-center gap-2">
            {/* <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p> */}
          </div>
        </div>
      </main>
      <NavBar {...{ sessionData, edit: false }} />
    </>
  );
};

export default Home;
