import type { MouseEventHandler, ReactNode } from "react";
import { ButtonVariant } from "../types/button";

const VARIANT_CLASSNAME: Record<ButtonVariant, string> = {
  [ButtonVariant.Primary]: "rounded bg-blue-500 px-5 py-2.5 text-white hover:bg-blue-400",
  [ButtonVariant.Secondary]:
    "rounded border border-zinc-600 px-5 py-2.5 text-zinc-200 hover:border-zinc-400 hover:text-white",
  [ButtonVariant.Danger]:
    "rounded border border-red-500/60 px-5 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300",
  [ButtonVariant.Nav]: "text-zinc-300 hover:text-white",
};

export function Button({
  variant = ButtonVariant.Primary,
  href,
  target,
  rel,
  className = "",
  onClick,
  disabled,
  children,
}: {
  variant?: ButtonVariant;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  onClick?: MouseEventHandler;
  disabled?: boolean;
  children?: ReactNode;
}) {
  const classes = `cursor-pointer text-base font-semibold transition-colors disabled:cursor-wait disabled:opacity-60 ${VARIANT_CLASSNAME[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={classes} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" disabled={disabled} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
