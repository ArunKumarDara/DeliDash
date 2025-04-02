import { motion } from "motion/react"
import FoodSpinner from "./FoodSpinner";

export function FullPageLoader() {
    return (
        <motion.div
            className="h-screen w-screen fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <FoodSpinner />
        </motion.div>
    );
}