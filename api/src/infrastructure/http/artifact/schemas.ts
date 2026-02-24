import z from "zod";

export const listSchema = z.object({
  query: z.object({
    paperId: z.coerce.number({
      error: "'paperId' must be a number."
    }).optional()
  })
})

export type ListSchemaType = z.infer<typeof listSchema>;