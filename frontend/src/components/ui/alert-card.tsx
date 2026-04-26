import React from "react";
import { motion, AnimatePresence, type HTMLMotionProps, type Variants } from "framer-motion";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Define the props for the AlertCard component
interface AlertCardProps extends Omit<HTMLMotionProps<"div">, "title"> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
  isVisible: boolean;
  onDismiss?: () => void;
  variant?: "success" | "destructive" | "info";
}

const AlertCard = React.forwardRef<HTMLDivElement, AlertCardProps>(
  ({
    className,
    icon,
    title,
    description,
    buttonText,
    onButtonClick,
    isVisible,
    onDismiss,
    variant = "info",
    ...props
  }, ref) => {
    
    // Animation variants for the card container
    const cardVariants: Variants = {
      hidden: { opacity: 0, y: 50, scale: 0.95 },
      visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { 
          type: "spring", 
          stiffness: 400, 
          damping: 25,
          staggerChildren: 0.1,
        }
      },
      exit: { 
        opacity: 0, 
        y: 20, 
        scale: 0.98,
        transition: { duration: 0.2 }
      }
    };

    // Animation variants for child elements for a staggered effect
    const itemVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 },
    };

    const variantStyles = {
      success: "bg-primary text-primary-foreground",
      destructive: "bg-secondary text-secondary-foreground",
      info: "bg-info text-info-foreground",
    };

    return (
      <AnimatePresence>
        {isVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              ref={ref}
              className={cn(
                "relative w-full max-w-sm overflow-hidden rounded-3xl p-8 shadow-2xl",
                variantStyles[variant],
                className
              )}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="alert"
              aria-live="assertive"
              {...props}
            >
              {/* Optional dismiss button */}
              {onDismiss && (
                <motion.div variants={itemVariants} className="absolute top-4 right-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-white/20 text-white"
                    onClick={onDismiss}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Dismiss</span>
                  </Button>
                </motion.div>
              )}

              {/* Icon with a subtle pulse animation */}
              {icon && (
                <motion.div
                  variants={itemVariants}
                  className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {icon}
                  </motion.div>
                </motion.div>
              )}

              {/* Title */}
              <motion.h3 variants={itemVariants} className="text-3xl font-black tracking-tighter">
                {title}
              </motion.h3>

              {/* Description */}
              <motion.p variants={itemVariants} className="mt-3 text-base opacity-90 font-medium">
                {description}
              </motion.p>
              
              {/* Action Button */}
              <motion.div variants={itemVariants} className="mt-8">
                <Button
                  className="w-full h-14 rounded-full bg-white text-black hover:bg-white/90 py-6 text-lg font-black shadow-xl transition-all active:scale-95"
                  onClick={onButtonClick}
                >
                  {buttonText}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }
);
AlertCard.displayName = "AlertCard";

export { AlertCard };
