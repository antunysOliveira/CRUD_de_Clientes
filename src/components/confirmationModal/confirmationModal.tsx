import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

type ConfirmationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    children: ReactNode;
};

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    children
}: ConfirmationModalProps) {

    const backdropVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const modalVariants: Variants = {
        hidden: { scale: 0.9, opacity: 0, y: 50 },
        visible: {
            scale: 1,
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 300, damping: 25 }
        },
        exit: { scale: 0.9, opacity: 0, y: -50 },
    };

    if (!isOpen) {
        return null;
    }

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 md:px-0 px-3"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
        >
            <motion.div
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
                variants={modalVariants}
                className="relative w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-xl"
            >
                <div className="flex flex-col text-center">
                    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                    <div className="text-gray-300 mb-6">
                        {children}
                    </div>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={onClose}
                            className="w-1/2 rounded-lg bg-gray-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            className="w-1/2 rounded-lg bg-red-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            Excluir
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}