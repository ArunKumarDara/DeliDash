import { motion } from "motion/react";

export default function FoodSpinner() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 h-fit w-full bg-white">
            <div className="relative h-16 w-16">
                {/* Animated Fork */}
                <motion.div
                    className="absolute left-2 h-10 w-2 bg-black rounded-full origin-bottom"
                    animate={{ rotate: [-30, 20, -30] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Animated Spoon */}
                <motion.div
                    className="absolute right-2 h-10 w-2 bg-black rounded-full origin-bottom"
                    animate={{ rotate: [30, -20, 30] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>
            <motion.p
                className="text-sm font-medium text-black"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                Dine Express is setting the table for your cravings...
            </motion.p>
        </div>
    );
}
