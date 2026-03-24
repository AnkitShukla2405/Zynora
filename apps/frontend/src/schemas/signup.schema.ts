import { z } from "zod";

const emailRegex = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[A-Za-z]{2,}$/;

const mobileRegex = /^(?:(?:\+?91[\s-]?)|0)?[6-9]\d{9}$/;

export const signupSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email or Phone is required.")
    .refine(
      (val) => {
        return (
          emailRegex.test(val) ||
          mobileRegex.test(val.replace(/\s|-/g, ""))
        );
      },
      {
        message: "Enter a valid Email of Mobile Numbner",
      }
    )
    .refine(
      (val: string): boolean => {
        if (val.includes("@")) return emailRegex.test(val);
        return true;
      },
      {
        message: "Invalid Email address format",
      }
    )
    .refine(
        (val: string): boolean => {
            if(!val.includes("@")) return mobileRegex.test(val);
            return true;
        },
        {
            message: "Invalid Mobile Number format"
        }
    )
});

export type signupSchemaData = z.infer<typeof signupSchema>;
