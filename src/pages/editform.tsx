import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
//import { api } from "../utils/api";
import type { Session } from "next-auth";
import NavBar from "../components/NavBar";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export type TimeLineEntryType = "Event" | "Period" | "Persona";

const validateDate = function (str: string | undefined) {
  if (str === undefined) return false;

  let date = str.split("/");
  if (date.length > 3 || date.length < 1) {
    return false;
  }
  let year = parseInt(date[0] as string);

  if (year > new Date().getFullYear()) {
    return false;
    //message: "psss, how'd'y'know that?"
  }

  let isLeapYear =
    (year % 4 == 0 && year % 100 != 0) || year % 400 == 0 ? true : false;
  let month = date.length > 1 ? parseInt(date[1] as string) : 1;
  let day = date.length > 2 ? parseInt(date[2] as string) : 1;

  if (month < 1 || month > 12) return false;
  if (
    day < 1 ||
    ([4, 6, 9, 11].includes(month) && day > 30) ||
    ([1, 3, 5, 7, 8, 10, 12].includes(month) && day > 31)
  )
    return false;
  if (month === 2 && (day > 29 || (isLeapYear && day > 28))) return false;

  return true;
};

const schema = z.object({
  type: z.enum(["Event", "Period", "Persona"]),
  date1: z
    .string()
    .refine(validateDate, {
      message:
        "This is not a valid date or its not on the format 'year/month/day'.",
    }),
  date2: z
    .string()
    .optional()
    .refine(validateDate, {
      message:
        "This is not a valid date or its not on the format 'year/month/day'.",
    }),
  title: z.string(),
  description: z.string(),
  tags: z.string(),
  more: z.string(),
});

const dateLabelsDictionary = {
  Event: ["Date", "Approximate to (Optional)"],
  Period: ["Begin", "End (Optional)"],
  Persona: ["Birth", "Death (Optional)"],
};

const EditForm: NextPage = () => {
  const { data: sessionData } = useSession();
  const [type, setType] = useState<TimeLineEntryType>("Event");

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setType(event.target.value as TimeLineEntryType);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "Persona",
      date1: "7040-02-28",
      date2: "",
      title: "Arlene Tooeesk",
      description: "She did remind us about the nature of the universe.",
      tags: "psicohistory, mathmagic",
      more: "",
    },
  });

  return (
    <>
      <Head>
        <title>Edit Form</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-pink1b to-blue1">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="flex flex-col flex-nowrap items-center justify-center gap-2">
            <p className=" font-bold text-black">New timeline entry</p>
            <form
              className="flex flex-col flex-nowrap gap-1 rounded-md bg-white bg-opacity-40 p-4 text-sm"
              onSubmit={handleSubmit((data) => console.log(data))}
            >
              <label className="flex flex-col flex-nowrap gap-1">
                <p>Type</p>
                <select {...register("type")} className="p-1">
                  <option value="Event">Event</option>
                  <option value="Period">Period</option>
                  <option value="Persona">Persona</option>
                </select>
              </label>
              <div className="flex flex-row flex-nowrap gap-1">
                <label className="flex flex-col flex-nowrap gap-1">
                  <p>{dateLabelsDictionary[type][0]}</p>
                  <input
                    {...register("date1")}
                    type="text"
                    placeholder={"yyyy-mm-dd"}
                    className="rounded-sm p-0.5"
                  />
                </label>
                <label className="flex flex-col flex-nowrap gap-1">
                  <p>{dateLabelsDictionary[type][1]}</p>
                  <input
                    {...register("date2")}
                    type="text"
                    placeholder={"yyyy-mm-dd"}
                    className="rounded-sm p-0.5"
                  />
                </label>
              </div>
              <label className="flex flex-col flex-nowrap gap-1">
                <p>Title or Name</p>
                <input
                  {...register("title")}
                  type="text"
                  className="rounded-sm p-0.5"
                />
              </label>
              <label className="flex flex-col flex-nowrap gap-1">
                <p>Description </p>
                <textarea
                  {...register("description")}
                  className="rounded-sm p-0.5"
                />
              </label>
              <label className="flex flex-col flex-nowrap gap-1">
                <p>Tags, separated by &#34;,&#34; </p>
                <input
                  {...register("tags")}
                  type="text"
                  className="rounded-sm p-0.5"
                />
              </label>
              <label className="flex flex-col flex-nowrap gap-1">
                <p>More</p>
                <input
                  {...register("more")}
                  type="text"
                  className="rounded-sm p-0.5"
                />
              </label>
              <button
                type="submit"
                className="mt-1 w-fit self-center rounded-md border-2 border-black bg-transparent pt-2 pr-3 pl-3 pb-2 font-bold text-black hover:border-transparent hover:bg-black hover:text-white"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      </main>
      <NavBar {...{ sessionData, edit: true }} />
    </>
  );
};

export default EditForm;
