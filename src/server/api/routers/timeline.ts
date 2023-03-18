//import { connect } from "http2";
import { z } from "zod";
import { FormSchema } from "../../../components/EditForm";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const timelineRouter = createTRPCRouter({
  newEntry: protectedProcedure
    .input(FormSchema)
    .mutation(async ({ ctx, input }) => {
      const allTagNames = input.tags.split(",");

      const newEntry = await ctx.prisma.timelineEntry.create({
        data: {
          user: { connect: { id: ctx.session.user.id } },
          type: input.type,
          title: input.title,
          initialDate: {
            connectOrCreate: {
              where: { date: input.date1 },
              create: { date: input.date1 },
            },
          },
          finalDate: {
            connectOrCreate: {
              where: { date: input.date2 },
              create: { date: input.date2 },
            },
          },
          description: input.description,
          tags: {
            connectOrCreate: allTagNames.map((tagName) => {
              return {
                where: { name: tagName },
                create: { name: tagName },
              };
            }),
          },
          more: input.more,
        },
      });

      return newEntry;
    }),

  getTags: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.tag.findMany();
  }),

  newTag: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.tag.create({
          data: {
            name: input,
          },
        });
      } catch (e) {}

      return await ctx.prisma.tag.findFirst({
        where: {
          name: {
            equals: input,
          },
        },
      });
    }),

  getDates: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.date.findMany();
  }),

  newDate: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.date.create({
          data: {
            date: input,
          },
        });
      } catch (e) {}

      return await ctx.prisma.date.findFirst({
        where: {
          date: {
            equals: input,
          },
        },
      });
    }),

  getEntries: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.timelineEntry.findMany();
  }),

  deleteEntry: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        entryId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (
        ctx.session.user.role === "admin" ||
        ctx.session.user.id === input.userId
      )
        return ctx.prisma.timelineEntry.delete({
          where: {
            id: input.entryId,
          },
        });
    }),

  getDefault: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.timelineEntry.findMany({
      where: {
        user: {
          role: {
            equals: "admin",
          },
        },
      },
    });
  }),

  getUserTimeline: publicProcedure.query(({ ctx }) => {
    if (ctx.session && ctx.session.user) {
      return ctx.prisma.timelineEntry.findMany({
        where: {
          user: {
            id: {
              equals: ctx.session?.user?.id,
            },
          },
        },
      });
    }

    return ctx.prisma.timelineEntry.findMany({
      where: {
        user: {
          role: {
            equals: "admin",
          },
        },
      },
    });
  }),
});
