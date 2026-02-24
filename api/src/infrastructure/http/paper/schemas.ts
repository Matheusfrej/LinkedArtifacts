import z from "zod";

export const findByIdSchema = z.object({
  params: z.object({
    id: z.coerce.number({
      error: "'id' must be a number."
    })
  })
})

export type FindByIdSchemaType =  z.infer<typeof findByIdSchema>;

export const listByTitlesSchema = z.object({
  body: z.object({
    titles: z
      .array(
        z.string().trim().min(1, {
          message: "Titles must be non-empty strings",
        })
      )
      .min(1, {
        message: "'titles' cannot be empty",
      }),
  })
});

export type ListByTitlesSchemaType =  z.infer<typeof listByTitlesSchema>;
