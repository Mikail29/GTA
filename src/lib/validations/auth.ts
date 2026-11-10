import { z } from "zod";

export const usernameSchema = z
  .string()
  .trim()
  .min(3, "Der Benutzername muss mindestens 3 Zeichen lang sein.")
  .max(24, "Der Benutzername darf höchstens 24 Zeichen lang sein.")
  .regex(/^[a-zA-Z0-9_-]+$/, "Erlaubt sind nur Buchstaben (ohne Umlaute), Zahlen, _ und -.");

export const emailSchema = z.string().trim().toLowerCase().email("Bitte gib eine gültige E-Mail-Adresse ein.").max(254);

export const passwordSchema = z
  .string()
  .min(10, "Das Passwort muss mindestens 10 Zeichen lang sein.")
  .max(128, "Das Passwort darf höchstens 128 Zeichen lang sein.")
  .regex(/[a-zA-Z]/, "Das Passwort muss mindestens einen Buchstaben enthalten.")
  .regex(/[0-9]/, "Das Passwort muss mindestens eine Zahl enthalten.");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Bitte gib dein Passwort ein.").max(128),
});

export const registerSchema = z
  .object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    passwordConfirm: z.string(),
    acceptRules: z.boolean().refine((v) => v, "Bitte bestätige dein Alter und akzeptiere die Nutzungsbedingungen."),
    // Honeypot gegen Spam-Bots: muss leer bleiben
    website: z.string().max(0).optional(),
  })
  .refine((d) => d.password === d.passwordConfirm, { message: "Die Passwörter stimmen nicht überein.", path: ["passwordConfirm"] });

export const forgotPasswordSchema = z.object({ email: emailSchema });

export const resetPasswordSchema = z
  .object({ password: passwordSchema, passwordConfirm: z.string() })
  .refine((d) => d.password === d.passwordConfirm, { message: "Die Passwörter stimmen nicht überein.", path: ["passwordConfirm"] });

export const profileSchema = z.object({
  username: usernameSchema,
  bio: z.string().trim().max(280, "Die Beschreibung darf höchstens 280 Zeichen lang sein.").optional().default(""),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ProfileInput = z.input<typeof profileSchema>;
