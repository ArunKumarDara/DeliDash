import { motion } from "motion/react"

export function CutlerySpinner() {
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative h-16 w-16">
                <motion.div
                    className="absolute left-0 h-12 w-3 bg-black rounded-sm origin-bottom"
                    animate={{ rotate: [-45, 45, -45] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute right-0 h-12 w-3 bg-black rounded-sm origin-bottom"
                    animate={{ rotate: [45, -45, 45] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>
            <motion.p
                className="text-sm font-medium text-black"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                getting your addresses...
            </motion.p>
        </div>
    );
}