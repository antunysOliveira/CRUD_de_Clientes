import { motion, Variants } from 'framer-motion';
import { useRef, useEffect } from 'react';

type ErrorModalProps = {
    message: string;
    onClose: () => void;
};

export default function ErrorModal({ message, onClose }: ErrorModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

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
        exit: { scale: 0.9, opacity: 0, y: 50 },
    };

    useEffect(() => {
        const dialogNode = dialogRef.current;
        if (dialogNode) {
            if (message) {
                dialogNode.showModal();
            } else {
                dialogNode.close();
            }
        }
    }, [message]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 md:px-0 px-3"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
        >
            <motion.dialog
                ref={dialogRef}
                onClose={onClose}
                onClick={(e) => e.stopPropagation()}
                variants={modalVariants}
                className="relative w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-xl"
            >
                <div className="flex flex-col items-center text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Ocorreu um Erro</h3>
                    <p className="text-gray-300 mb-6">
                        {message}
                    </p>
                    <button
                        onClick={onClose}
                        className="w-1/2 rounded-lg bg-red-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                        Fechar
                    </button>
                </div>
            </motion.dialog>
        </motion.div>
    );
}