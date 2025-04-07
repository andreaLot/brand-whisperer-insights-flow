
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        elegant: "bg-gradient-to-r from-uberall-ultraviolet to-uberall-rosa border border-white/10 shadow-lg text-white hover:shadow-uberall-rosa/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5",
        dynamic: "relative text-white border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 overflow-hidden",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-10 py-3 text-base",
        icon: "h-10 w-10",
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
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    React.useEffect(() => {
      // Inject the animation CSS if it doesn't exist
      if (!document.getElementById('button-animations')) {
        const style = document.createElement('style');
        style.id = 'button-animations';
        style.textContent = `
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          .btn-animate {
            background: linear-gradient(-45deg, #7515F5, #FF7BBA, #06CC8A, #08C0F9);
            background-size: 300% 300%;
            animation: gradientMove 6s ease infinite;
          }
          
          .btn-shadow {
            position: absolute;
            inset: 0;
            border-radius: inherit;
            filter: blur(15px);
            opacity: 0.7;
            background: linear-gradient(-45deg, rgba(117, 21, 245, 0.7), rgba(255, 123, 186, 0.7), rgba(6, 204, 138, 0.7), rgba(8, 192, 249, 0.7));
            background-size: 300% 300%;
            animation: gradientMove 6s ease infinite;
            transform: translateY(5px);
            z-index: -1;
            width: 100%;
            max-width: 100%;
            height: 100%;
          }
        `;
        document.head.appendChild(style);
      }
    }, []);
    
    return (
      <div className={variant === 'dynamic' ? "relative group w-fit" : ""}>
        {variant === 'dynamic' && (
          <div className="absolute inset-0 btn-shadow rounded-md opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
        )}
        <Comp
          className={cn(
            buttonVariants({ variant, size, className }), 
            variant === 'dynamic' && "btn-animate text-white/90 relative z-10"
          )}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      </div>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
