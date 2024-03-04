import { ConvexError, v } from "convex/values"

import { mutation } from "./_generated/server"

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity()

  if (!identity) {
    throw new ConvexError("you must be logged in to upload a file")
  }

  return await ctx.storage.generateUploadUrl()
})

export const createFile = mutation({
  args: {
    name: v.string(),
  },
  async handler(ctx, args) {
    await ctx.db.insert("files", {
      name: args.name,
    })
  },
})
