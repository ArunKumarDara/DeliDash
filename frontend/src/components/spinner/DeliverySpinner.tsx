import { motion } from "motion/react"

export default function DeliverySpinner() {
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <motion.div
                className="relative h-16 w-16"
                animate={{ x: [-10, 10, -10] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                {/* Bike Body */}
                <div className="absolute top-1/2 left-1/2 h-2 w-8 bg-gray-700 transform -translate-x-1/2 -translate-y-1/2" />
                {/* Front Wheel */}
                <motion.div
                    className="absolute top-1/2 left-1/4 h-6 w-6 border-2 border-gray-700 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                {/* Rear Wheel */}
                <motion.div
                    className="absolute top-1/2 left-3/4 h-6 w-6 border-2 border-gray-700 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
            </motion.div>
            <motion.p
                className="text-sm font-medium text-gray-700"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                Your food is on the way!
            </motion.p>
        </div>
    );
}