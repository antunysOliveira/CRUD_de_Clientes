import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

type ConfirmationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    children: ReactNode;
    isConfirming?: boolean;
};

const SpinnerIcon = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    children,
    isConfirming = false
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
            onClick={isConfirming ? undefined : onClose}
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
                            disabled={isConfirming}
                            className="w-1/2 rounded-lg bg-gray-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isConfirming}
                            className="flex w-1/2 items-center justify-center rounded-lg bg-red-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isConfirming ? (
                                <>
                                    <SpinnerIcon />
                                    Excluindo...
                                </>
                            ) : (
                                'Excluir'
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}