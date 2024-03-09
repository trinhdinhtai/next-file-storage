import { ConvexError, v } from "convex/values"

import {
  internalMutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server"
import { roles } from "./schema"

export async function getUser(
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string
) {
  const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) =>
      q.eq("tokenIdentifier", tokenIdentifier)
    )
    .first()

  if (!user) {
    throw new ConvexError("expected user to be defined")
  }

  return user
}

export const getUserProfile = query({
  args: { userId: v.id("users") },
  async handler(ctx, args) {
    const user = await ctx.db.get(args.userId)

    return {
      name: user?.name,
      image: user?.image,
    }
  },
})

export const getCurrentUser = query({
  args: {},
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      return null
    }

    const user = await getUser(ctx, identity.tokenIdentifier)

    if (!user) {
      return null
    }

    return user
  },
})

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

export const addOrgIdToUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    orgId: v.string(),
    role: roles,
  },
  async handler(ctx, { tokenIdentifier, orgId, role }) {
    const user = await getUser(ctx, tokenIdentifier)

    await ctx.db.patch(user._id, {
      orgIds: [...user.orgIds, { orgId, role }],
    })
  },
})

export const updateRoleInOrgForUser = internalMutation({
  args: { tokenIdentifier: v.string(), orgId: v.string(), role: roles },
  async handler(ctx, { tokenIdentifier, orgId, role }) {
    const user = await getUser(ctx, tokenIdentifier)

    const org = user.orgIds.find((org) => org.orgId === orgId)

    if (!org) {
      throw new ConvexError(
        "expected an org on the user but was not found when updating"
      )
    }

    org.role = role

    await ctx.db.patch(user._id, {
      orgIds: user.orgIds,
    })
  },
})
