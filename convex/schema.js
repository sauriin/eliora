import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  registrations: defineTable({
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
    createdAt: v.number(),
  }),
});
