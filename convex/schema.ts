// https://docs.convex.dev/database/schemas

import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export const fileTypes = v.union(
  v.literal("image"),
  v.literal("csv"),
  v.literal("pdf")
)

export const roles = v.union(v.literal("admin"), v.literal("member"))

export default defineSchema({
  files: defineTable({
    name: v.string(),
    type: fileTypes,
    orgId: v.string(),
    fileId: v.id("_storage"),
    userId: v.id("users"),
    shouldDelete: v.optional(v.boolean()),
  }).index("by_orgId", ["orgId"]),
  favorites: defineTable({
    orgId: v.string(),
    userId: v.id("users"),
    fileId: v.id("files"),
  }).index("by_userId_orgId_fileId", ["userId", "orgId", "fileId"]),
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
