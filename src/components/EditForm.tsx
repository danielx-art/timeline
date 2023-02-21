import { api } from "../utils/api";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Session } from "next-auth";

export type TimeLineEntryType = "Event" | "Period" | "Persona";

const validateDate = function (str: string | undefined) {
  if (str === undefined || str === "") return true;

  const date = str.split("/");
  if (date.length > 3 || date.length < 1) {
    return false;
  }

  const year = parseInt(date[0] as string);

  if (isNaN(year)) return false;

  if (year > new Date().getFullYear()) {
    return false;
    //message: "psss, how'd'y'know that?"
  }

  const isLeapYear =
    (year % 4 == 0 && year % 100 != 0) || year % 400 == 0 ? true : false;
  const month = date.length > 1 ? parseInt(date[1] as string) : 1;
  const day = date.length > 2 ? parseInt(date[2] as string) : 1;

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

export const FormSchema = z.object({
  type: z.enum(["Event", "Period", "Persona"]),
  date1: z.string().refine(
    (date1) => {
      return validateDate(date1) && date1 !== "";
    },
    {
      message:
        "Either this is empty, is not a valid date or is not on the format 'year/month/day'.",
    }
  ),
  date2: z.string().refine(validateDate, {
    message:
      "This is not a valid date or its not on the format 'year/month/day'.",
  }),
  title: z.string().min(1, { message: "This cannot be empty" }),
  description: z.string().min(1, { message: "This cannot be empty" }),
  tags: z.string().min(1, { message: "This cannot be empty" }),
  more: z.string().optional(),
});

export type FormSchemaType = z.infer<typeof FormSchema>;

const dateLabelsDictionary = {
  Event: ["Date", "Approximate to (Optional)"],
  Period: ["Begin", "End (Optional)"],
  Persona: ["Birth", "Death (Optional)"],
};

/*--------------------------------------------------------------------
----------------------------------------------------------------------
----------------------------------------------------------------------
------------------------------finally---------------------------------
----------------------------------------------------------------------
----------------------------------------------------------------------
---------------------------------------------------------------------*/
const EditForm: React.FC<{ sessionData: Session | null }> = ({
  sessionData,
}) => {
  const entryMutation = api.timeline.newEntry.useMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const isSubmitting = false;

  const formSubmit: SubmitHandler<FormSchemaType> = async (formData) => {
    if (sessionData?.user?.id) {
      entryMutation.mutate(formData);
    }
  };

  return (
    <div className=" border-box container flex w-fit flex-col items-center justify-center rounded-lg bg-white bg-opacity-90 drop-shadow-md">
      <p className="box-border w-full self-start rounded-t-lg bg-gray-200 p-4 text-sm text-blue1">
        New timeline entry
      </p>
      <form
        className="gap-1text-sm flex flex-col flex-nowrap px-4 text-gray-900"
        onSubmit={handleSubmit(formSubmit)}
      >
        <label className="flex flex-col flex-nowrap gap-1 py-1">
          <p className="text-sm">Type</p>
          <select
            defaultValue={"Event"}
            {...register("type")}
            className="rounded border border-gray-400 py-1.5 px-3 focus:text-black focus:outline-none focus:ring-1  focus:ring-blue1"
          >
            <option value="Event">Event</option>
            <option value="Period">Period</option>
            <option value="Persona">Persona</option>
          </select>
        </label>
        <div className="flex flex-row flex-nowrap gap-1">
          <label className="flex w-1/2 flex-col flex-nowrap gap-1">
            <p className="mt-2 text-sm">
              {dateLabelsDictionary[watch().type || "Event"][0]}*
            </p>
            <input
              {...register("date1")}
              type="text"
              placeholder={"year/month/day"}
              className="rounded border border-gray-400 py-1.5 px-3 focus:text-black focus:outline-none focus:ring-1  focus:ring-blue1"
            />
            {errors.date1 && (
              <p className="mb-1 text-xs text-red-600">
                {errors.date1?.message}
              </p>
            )}
          </label>
          <label className="flex w-1/2 flex-col flex-nowrap gap-1">
            <p className="mt-2 text-sm">
              {dateLabelsDictionary[watch().type || "Event"][1]}
            </p>
            <input
              {...register("date2")}
              type="text"
              placeholder={"year/month/day"}
              className="rounded border border-gray-400 py-1.5 px-3 focus:text-black  focus:outline-none focus:ring-1  focus:ring-blue1"
            />
            {errors.date2 && (
              <p className="text-sm text-red-600">{errors.date2?.message}</p>
            )}
          </label>
        </div>
        <label className="flex flex-col flex-nowrap gap-1">
          <p className="mt-2 text-sm">Title or Name*</p>
          <input
            {...register("title")}
            type="text"
            className="rounded border border-gray-400 py-1.5 px-3 focus:text-black  focus:outline-none focus:ring-1  focus:ring-blue1"
          />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title?.message}</p>
          )}
        </label>
        <label className="flex flex-col flex-nowrap gap-1">
          <p className="mt-2 text-sm">Description*</p>
          <textarea
            {...register("description")}
            className="rounded border border-gray-400 py-1.5 px-3 focus:text-black  focus:outline-none focus:ring-1  focus:ring-blue1"
          />
          {errors.description && (
            <p className="text-sm text-red-600">
              {errors.description?.message}
            </p>
          )}
        </label>
        <label className="flex flex-col flex-nowrap gap-1">
          <p className="mt-2 text-sm">Tags, separated by &#34;,&#34; *</p>
          <input
            {...register("tags")}
            type="text"
            className="rounded border border-gray-400 py-1.5 px-3 focus:text-black  focus:outline-none focus:ring-1  focus:ring-blue1"
          />
          {errors.tags && (
            <p className="text-sm text-red-600">{errors.tags?.message}</p>
          )}
        </label>
        <label className="flex flex-col flex-nowrap gap-1 ">
          <p className="mt-2 text-sm">More</p>
          <input
            {...register("more")}
            type="text"
            className="border-box rounded border border-gray-400 py-1.5 px-3 focus:text-black  focus:outline-none focus:ring-1 focus:ring-blue1"
          />
          {errors.more && (
            <p className="text-sm text-red-600">{errors.more?.message}</p>
          )}
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-3 mb-3 self-end rounded-md ${
            isSubmitting ? "bg-blue1" : "bg-gray-500"
          }  py-2 px-3 font-bold text-white hover:bg-gray-900 hover:shadow-sm hover:shadow-blue1`}
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default EditForm;
