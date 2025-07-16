import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-[color:var(--color-ring)] focus-visible:ring-[color:var(--color-ring)]/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden shadow-[var(--shadow-shadow)]",
  {
    variants: {
      variant: {
        default:
          "border-2 border-[color:var(--color-border)] bg-[color:var(--color-main)] text-[color:var(--color-main-foreground)] hover:bg-[color:var(--color-main)]/90",
        secondary:
          "border-2 border-[color:var(--color-border)] bg-[color:var(--color-secondary-background)] text-[color:var(--color-foreground)] hover:bg-[color:var(--color-main)]/10 hover:text-[color:var(--color-main)]",
        destructive:
          "border-2 border-destructive bg-destructive text-white hover:bg-destructive/90",
        outline:
          "border-2 border-[color:var(--color-border)] bg-background text-[color:var(--color-foreground)] hover:bg-[color:var(--color-main)]/10 hover:text-[color:var(--color-main)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge };
