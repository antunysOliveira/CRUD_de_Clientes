import { useLayout } from "@/context/UseLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import Api from "@/services/api";
import { AnimatedErrorMessage } from "../errorMsg/errorMsg";

type LoginFormProps = {
    setStep: (step: "start" | "login" | "register") => void;
};

type LoginFormData = {
    email: string;
    password: string;
};

export default function FormLogin({ setStep }: LoginFormProps) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { setError, login, setUser } = useLayout();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<LoginFormData>({
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const screenVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
        exit: { opacity: 0, y: -50, transition: { duration: 0.3, ease: "easeIn" } },
    } as const;

    const formItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    } as const;

    const handleLogin: SubmitHandler<LoginFormData> = async (data) => {
        setIsLoading(true);
        try {
            const resp = await Api.Login(data);
            login(resp?.data?.token);
            setUser(resp?.data?.user)
            reset();
            navigate('/');
        } catch (error: any) {
            setError(error?.response?.data?.message || "E-mail ou senha inválidos.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <motion.div
                key="form"
                variants={screenVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full"
            >
                <motion.button
                    onClick={() => setStep("start")}
                    className="absolute top-4 left-4 p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                    aria-label="Voltar"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.6, type: "spring" }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </motion.button>
                <h2 className="text-3xl font-bold text-center mb-8">Acesse sua Conta</h2>
                <motion.form
                    onSubmit={handleSubmit(handleLogin)}
                    variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                    className="space-y-4"
                >
                    {/* //! Email */}
                    <motion.div variants={formItemVariants} className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="voce@exemplo.com"
                            {...register("email", {
                                required: "O campo e-mail é obrigatório.",
                                pattern: {
                                    value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                                    message: "Por favor, insira um e-mail válido.",
                                },
                            })}
                            className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 transition-shadow ${errors?.email ? 'border-red-500' : 'border-gray-600'}`}
                        />
                        <AnimatedErrorMessage message={errors?.email?.message} />
                    </motion.div>
                    {/* //! Senha */}
                    <motion.div variants={formItemVariants} className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-gray-300">Senha</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            {...register("password", {
                                required: "O campo senha é obrigatório."
                            })}
                            className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 transition-shadow ${errors?.password ? 'border-red-500' : 'border-gray-600'}`}
                        />
                        <AnimatedErrorMessage message={errors?.password?.message} />
                    </motion.div>
                    <div className="text-center pt-2">
                        <button
                            type="button"
                            onClick={() => setStep("register")}
                            className="text-sm text-cyan-400 hover:underline"
                        >
                            Não tem uma conta? Cadastre-se
                        </button>
                    </div>
                    <motion.div variants={formItemVariants} className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 px-5 py-3 rounded-lg text-white font-semibold shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </motion.div>
                </motion.form>
            </motion.div>
        </div>
    )
}
