import "react";

declare module "react" {
  interface ButtonHTMLAttributes<T> {
    /** Command to execute on click. */
    command?: T extends unknown
      ?
          | "show-modal"
          | "close"
          | "request-close"
          | "show-popover"
          | "hide-popover"
          | "toggle-popover"
          | "show-modal"
          | Omit<string, "show-modal" | "close" | "request-close" | "show-popover" | "hide-popover" | "toggle-popover">
      : never;
    /** Command target — shows a popover on click (activation). */
    commandfor?: T extends unknown ? string : never;
    /** Interest invoker target — shows a popover on hover/focus (interest). */
    interestfor?: T extends unknown ? string : never;
  }
}
