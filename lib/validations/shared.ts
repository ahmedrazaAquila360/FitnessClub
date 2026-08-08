import { z } from "zod";

// Images can be an absolute URL (pasted by an admin) or a same-origin path
// returned by the upload endpoint (e.g. "/uploads/programs/123-photo.jpg"),
// which z.string().url() would incorrectly reject.
const imagePathRegex = /^(\/|https?:\/\/)/;

export const requiredImageUrl = z
  .string()
  .regex(imagePathRegex, "Enter a valid image URL or upload a file");

export const optionalImageUrl = z
  .string()
  .regex(imagePathRegex, "Enter a valid image URL or upload a file")
  .optional()
  .nullable();
