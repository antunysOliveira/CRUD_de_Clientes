import { motion, AnimatePresence } from "framer-motion";

const errorVariants = {
    hidden: { opacity: 0, y: 10, transition: { duration: 0.3 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};
type AnimatedErrorMessageProps = {
    message?: string;
};

export function AnimatedErrorMessage({ message }: AnimatedErrorMessageProps) {
    return (
        <AnimatePresence>
            {message && (
                <motion.span
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="block pt-1 text-xs text-red-500"
                >
                    {message}
                </motion.span>
            )}
        </AnimatePresence>
    );
}