import { motion } from "motion/react"

const foodIcons = ["🍕", "🍔", "🍣", "🥗"];

export function FoodIconSpinner() {
    return (
        <div className="flex flex-col items-center justify-center gap-6">
            <div className="relative h-20 w-20">
                {foodIcons.map((icon, index) => (
                    <motion.span
                        key={index}
                        className="absolute text-2xl"
                        style={{
                            left: "50%",
                            top: "50%",
                            x: "-50%",
                            y: "-50%"
                        }}
                        animate={{
                            rotate: [0, 360],
                            x: [0, Math.cos(index * Math.PI / 2) * 30],
                            y: [0, Math.sin(index * Math.PI / 2) * 30],
                            opacity: [0.3, 1, 0.3]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: index * 0.2,
                            ease: "easeInOut"
                        }}
                    >
                        {icon}
                    </motion.span>
                ))}
            </div>
            <motion.p
                className="text-sm font-medium text-amber-800"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                Crafting your dining experience...
            </motion.p>
        </div>
    );
}