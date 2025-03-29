import { motion } from "motion/react"
export default function PulseLoader() {
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <motion.div
                className="h-12 w-12 rounded-full bg-amber-500"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 1, 0.6],
                    rotate: [0, 180, 360]
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.p
                className="text-sm font-medium text-amber-800"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                Processing your order...
            </motion.p>
        </div>
    );
}