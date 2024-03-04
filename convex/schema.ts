// https://docs.convex.dev/database/schemas

import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export const roles = v.union(v.literal("admin"), v.literal("member"))

export default defineSchema({
  files: defineTable({
    name: v.string(),
  }),
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    orgIds: v.array(
      v.object({
        orgId: v.string(),
        role: roles,
      })
    ),
    tokenIdentifier: v.string(),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),
})
