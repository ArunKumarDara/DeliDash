import { motion } from "motion/react"

export function CookingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <motion.div
                className="relative h-16 w-16 rounded-full bg-gray-200 border-4 border-amber-800"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
                <motion.div
                    className="absolute top-1/2 left-1/2 h-2 w-2 bg-amber-600 rounded-full"
                    animate={{
                        scale: [1, 1.5, 1],
                        x: [-12, 0, 12, 0, -12],
                        y: [0, -12, 0, 12, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </motion.div>
            <motion.p
                className="text-sm font-medium text-amber-800"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                Cooking your meal...
            </motion.p>
        </div>
    );
}