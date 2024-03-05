import { ConvexError, v } from "convex/values"

import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server"
import { fileTypes } from "./schema"

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity()

  if (!identity) {
    throw new ConvexError("you must be logged in to upload a file")
  }

  return await ctx.storage.generateUploadUrl()
})

export async function hasAccessToOrg(
  ctx: QueryCtx | MutationCtx,
  orgId: string
) {
  const identity = await ctx.auth.getUserIdentity()

  if (!identity) return null

  const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .first()

  if (!user) return null

  const hasAccess =
    user.orgIds.some((item) => item.orgId === orgId) ||
    user.tokenIdentifier.includes(orgId)

  if (!hasAccess) return null

  return { user }
}

export const createFile = mutation({
  args: {
    name: v.string(),
    fileId: v.id("_storage"),
    orgId: v.string(),
    type: fileTypes,
  },
  async handler(ctx, { fileId, name, orgId, type }) {
    const hasAccess = await hasAccessToOrg(ctx, orgId)

    if (!hasAccess) {
      throw new ConvexError("you do not have access to this org")
    }

    await ctx.db.insert("files", {
      name,
      fileId,
      orgId,
      type,
      userId: hasAccess.user._id,
    })
  },
})

export const getFiles = query({
  args: {
    orgId: v.string(),
    query: v.optional(v.string()),
    type: v.optional(fileTypes),
  },
  async handler(ctx, { orgId, query, type }) {
    const hasAccess = await hasAccessToOrg(ctx, orgId)

    if (!hasAccess) return []

    let files = await ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", orgId))
      .collect()

    if (query) {
      files = files.filter((file) =>
        file.name.toLowerCase().includes(query.toLowerCase())
      )
    }

    if (type) {
      files = files.filter((file) => file.type === type)
    }

    return files
  },
})
