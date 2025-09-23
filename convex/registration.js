import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new registration with optional payment proof
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
    paymentMethod: v.string(),
    prayerIntention: v.optional(v.string()),
    paymentProof: v.optional(v.id("_storage")), // file reference
    comment: v.optional(v.string()), // ✅ Added
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("registrations", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Get a single registration
export const getRegistration = query({
  args: { registrationId: v.id("registrations") },
  handler: async (ctx, { registrationId }) => {
    return await ctx.db.get(registrationId);
  },
});

// List all registrations (newest first)
export const listAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("registrations").order("desc").collect();
  },
});

// Generate a signed upload URL (frontend will POST file to this URL)
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// Get a temporary URL to serve a stored file
export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});

export const updateRegistration = mutation({
  args: {
    registrationId: v.id("registrations"),
    parishName: v.string(),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, { registrationId, ...updatedFields }) => {
    await ctx.db.patch(registrationId, updatedFields);
  },
});