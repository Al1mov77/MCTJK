import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gold text-white hover:bg-gold/90 shadow-md",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-border bg-background hover:bg-surface hover:text-foreground",
        secondary: "bg-surface text-foreground hover:bg-surface/80",
        ghost: "hover:bg-surface hover:text-foreground",
        link: "text-gold underline-offset-4 hover:underline",
        premium: "bg-white text-black hover:bg-gold hover:text-white shadow-xl transition-all duration-300",
        luxury: "bg-gold text-white hover:bg-gold-dark shadow-2xl rounded-full transition-all duration-500 border border-gold/20",
      },
      size: {
        default: "h-12 px-10 py-3",
        sm: "h-9 rounded-full px-4",
        lg: "h-16 rounded-full px-12 text-base font-bold",
        icon: "h-12 w-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
