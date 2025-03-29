import { motion } from "motion/react"
import FoodSpinner from "./FoodSpinner";

export function FullPageLoader() {
    return (
        <motion.div
            className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <FoodSpinner />
            <motion.p
                className="mt-4 text-lg font-semibold text-amber-700"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                Preparing your order...
            </motion.p>
        </motion.div>
    );
}