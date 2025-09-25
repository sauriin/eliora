import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new registration
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
    paymentProof: v.optional(v.id("_storage")),
    comment: v.optional(v.string()),
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

// Generate signed upload URL
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// Get file URL
export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});

<<<<<<< HEAD
// Update an existing registration
export const update = mutation({
  args: {
    id: v.id("registrations"),
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
    comment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates); // use patch
  },
});

// registrations.js
export const fetchPaymentUrl = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});
=======
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
>>>>>>> f4b5bbc34c516fbaeda3f7cf84c69f09f8b265ea
