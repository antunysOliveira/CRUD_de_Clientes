import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "@/components/formComponents/formLogin";
import Register from "@/components/formComponents/formRegister";

type Step = "start" | "login" | "register";

export default function LoginPage() {
    const [step, setStep] = useState<Step>("start");

    const screenVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
        exit: { opacity: 0, y: -50, transition: { duration: 0.3, ease: "easeIn" } },
    } as const;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white font-sans md:px-0 px-3">
            <div className="w-full max-w-md h-[550px] p-8 space-y-8 rounded-2xl bg-gray-800 shadow-2xl relative overflow-hidden items-center flex justify-center">
                <AnimatePresence mode="wait">
                    {step === "start" && (
                        <motion.div
                            key="start"
                            variants={screenVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="w-full text-center space-y-6"
                        >
                            <motion.h1 className="text-4xl font-bold tracking-tight">
                                Bem-vindo(a)!
                            </motion.h1>
                            <p>Clique no botão abaixo para acessar sua conta.</p>
                            <button
                                className="bg-azul-2 hover:bg-azul-1 transition-all duration-300 transform hover:scale-105 px-8 py-3 rounded-lg text-white font-semibold text-lg shadow-lg"
                                onClick={() => setStep("login")}
                            >
                                Começar
                            </button>
                        </motion.div>
                    )}
                    {step === "login" && <Login key="login" setStep={setStep} />}
                    {step === "register" && <Register key="register" setStep={setStep} />}
                </AnimatePresence>
            </div>
        </div>
    );
}