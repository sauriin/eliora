import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    fullName: v.string(),
    gender: v.string(),
    lifeStatus: v.string(),
    dateOfBirth: v.string(),
    whatsappNumber: v.string(),
    emergencyContact: v.string(),
    emailAddress: v.string(),
    address: v.optional(v.string()),
    parishName: v.string(),
    travelWithUs: v.string(),
    paymentMethod: v.string(),
    prayerIntention: v.optional(v.string()), // ✅ added field
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert("registrations", {
      ...args,
      createdAt: Date.now(),
    });
    return result._id;
  },
});

export const getRegistration = query({
  args: { registrationId: v.string() },
  handler: async (ctx, { registrationId }) => {
    const registration = await ctx.db.get(`registrations/${registrationId}`);
    return registration || null;
  },
});
