import { v } from "convex/values"

import { internalMutation } from "./_generated/server"

export const createUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.string(),
    image: v.string(),
  },
  async handler(ctx, { tokenIdentifier, name, image }) {
    await ctx.db.insert("users", {
      tokenIdentifier,
      orgIds: [],
      name,
      image,
    })
  },
})
