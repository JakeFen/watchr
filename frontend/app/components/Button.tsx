import type { ButtonHTMLAttributes } from "react";
import { ButtonVariant } from "../types/button";

const VARIANT_CLASSNAME: Record<ButtonVariant, string> = {
  [ButtonVariant.Primary]: "rounded bg-blue-500 px-5 py-2.5 text-white hover:bg-blue-400",
  [ButtonVariant.Nav]: "text-zinc-300 hover:text-white",
};

export function Button({
  variant = ButtonVariant.Primary,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={`cursor-pointer text-base font-semibold transition-colors ${VARIANT_CLASSNAME[variant]} ${className}`}
      {...props}
    />
  );
}
