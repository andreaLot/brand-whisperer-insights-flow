
import { Variants } from 'framer-motion';

export const cardVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.7 }
  }
};

export const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 100,
      duration: 0.6
    }
  }
};

export const platformIconVariants = {
  hidden: { x: -5, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { delay: 0.2, duration: 0.5 }
  }
};

export const scoreVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { delay: 0.3, duration: 0.5 }
  }
};

export const rankBadgeVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { delay: 0.4, duration: 0.5 }
  }
};

export const legendVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.7 }
  }
};

export const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.7 }
  }
};

export const starVariants = {
  hidden: { rotate: -20, scale: 0 },
  visible: { 
    rotate: 0, 
    scale: 1,
    transition: { delay: 0.5, type: "spring", stiffness: 400 }
  }
};
