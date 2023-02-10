import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const editFormRouter = createTRPCRouter({
  postEvent: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        more: z.string().optional(),
        date: z.string(),
        tags: z.array(z.string()),
        approximationFuture: z.number().optional(),
        approximationPast: z.number().optional(),
        //add persona? add it to model in prisma schema
      })
    )
    .mutation(({ ctx, input }) => {
      ctx.prisma.event.create({
        data: {
          title: input.title,
          description: input.description,
          more: input.more,
          date: {
            create: { date: input.date },
          },
          tags: {
            create: input.tags.map((item) => {
              return { name: item };
            }),
          },
          approximationFuture: input.approximationFuture,
          approximationPast: input.approximationPast,
        },
      });
    }),

  getTags: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.tag.findMany();
  }),
});
