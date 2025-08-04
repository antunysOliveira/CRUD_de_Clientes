import { useLayout } from '@/context/UseLayout';
import { motion, Variants } from 'framer-motion';
import VMasker from "vanilla-masker";
import Api from "@/services/api";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { AnimatedErrorMessage } from '../errorMsg/errorMsg';
import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ClientData {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
}

type FormValues = {
    name: string;
    email: string;
    phone: string;
    company: string;
};

type EditClientModalProps = {
    onClose: () => void;
    client: ClientData;
};

type UpdateClientVariables = {
    id: string;
    data: FormValues;
};

const SpinnerIcon = () => (
    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export default function EditClientModal({ onClose, client }: EditClientModalProps) {
    const { setError } = useLayout();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
        setValue,
    } = useForm<FormValues>();

    useEffect(() => {
        if (client) {
            const maskedPhone = VMasker.toPattern(client.phone, "(99) 99999-9999");
            setValue("name", client.name);
            setValue("email", client.email);
            setValue("phone", maskedPhone);
            setValue("company", client.company);
        }
    }, [client, setValue]);

    const queryClient = useQueryClient();

    const updateClientMutation = useMutation({
        mutationFn: ({ id, data }: UpdateClientVariables) => Api.UpdateClient(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            reset();
            onClose();
        },
        onError: (error: any) => {
            console.error("Erro ao editar cliente:", error?.response?.data?.message);
            setError(
                error?.response?.data?.message ||
                "Falha ao editar cliente. Verifique os dados e tente novamente."
            );
        }
    });

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        setError(null);
        const removeMask = (value: string) => value.replace(/\D/g, '');

        const updatedData = {
            ...data,
            phone: removeMask(data.phone),
        };

        updateClientMutation.mutate({ id: client.id, data: updatedData });
    };

    const backdropVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
    const formContainerVariants: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
    const modalVariants: Variants = { hidden: { scale: 0.9, opacity: 0, y: 50 }, visible: { scale: 1, opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } }, exit: { scale: 0.9, opacity: 0, y: 50 } };
    const formItemVariants = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } } as const;


    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 md:px-0 px-3"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={updateClientMutation.isPending ? undefined : onClose}
        >
            <motion.div
                onClick={(e) => e.stopPropagation()}
                variants={modalVariants}
                className="relative w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-xl"
            >
                <h2 className="text-2xl font-bold text-white mb-4">Editar Cliente</h2>
                <motion.form
                    onSubmit={handleSubmit(onSubmit)}
                    variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                    className="space-y-4"
                >
                    <motion.div
                        className="space-y-4"
                        variants={formContainerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* //! Nome */}
                        <motion.div variants={formItemVariants} className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nome</label>
                            <input
                                type="text"
                                id="name"
                                placeholder="ex: Joãozinho"
                                {...register("name", { required: "O campo nome é obrigatório." })}
                                className={`${errors?.name ? 'border-red-500' : 'border-gray-600'} mt-1 block w-full px-3 py-2 bg-gray-700 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500  text-gray-100`}
                            />
                            <AnimatedErrorMessage message={errors?.name?.message} />
                        </motion.div>
                        {/* //! Email */}
                        <motion.div variants={formItemVariants} className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="voce@exemplo.com"
                                {...register("email", {
                                    required: "O campo e-mail é obrigatório.",
                                    pattern: {
                                        value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                                        message: "Por favor, insira um e-mail válido.",
                                    },
                                })}
                                className={`${errors?.email ? 'border-red-500' : 'border-gray-600'} mt-1 block w-full px-3 py-2 bg-gray-700 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500  text-gray-100`}
                            />
                            <AnimatedErrorMessage message={errors?.email?.message} />
                        </motion.div>
                        {/* //! Telefone */}
                        <motion.div variants={formItemVariants} className="space-y-2">
                            <label htmlFor="telefone" className="block text-sm font-medium text-gray-300">Telefone</label>
                            <Controller
                                name="phone"
                                control={control}
                                rules={{
                                    required: "O campo telefone é obrigatório.",
                                    validate: (value) => {
                                        if (!value) return "O campo telefone é obrigatório.";
                                        const unmaskedValue = value.replace(/\D/g, '');
                                        if (unmaskedValue?.length < 10 || unmaskedValue?.length > 11) {
                                            return "Telefone inválido (mínimo 10, máximo 11 dígitos).";
                                        }
                                        return true;
                                    }
                                }}
                                render={({ field }) => (
                                    <input
                                        type="tel"
                                        id="telefone"
                                        autoComplete='none'
                                        className={`${errors?.phone ? 'border-red-500' : 'border-gray-600'} mt-1 block w-full px-3 py-2 bg-gray-700 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500  text-gray-100`}
                                        placeholder="(00) 00000-0000"
                                        {...field}
                                        value={field.value || ""}
                                        onChange={(e) => {
                                            field.onChange(VMasker.toPattern(e?.target?.value, "(99) 99999-9999"));
                                        }}
                                        onBlur={field?.onBlur}
                                    />
                                )}
                            />
                            <AnimatedErrorMessage message={errors?.phone?.message} />
                        </motion.div>
                        {/* //! Empresa */}
                        <motion.div variants={formItemVariants} className="space-y-2">
                            <label htmlFor="company" className="block text-sm font-medium text-gray-300">Empresa</label>
                            <input
                                type="text"
                                id="company"
                                placeholder="ex: Empresa ABC"
                                {...register("company", { required: "O campo empresa é obrigatório." })}
                                className={`${errors?.company ? 'border-red-500' : 'border-gray-600'} mt-1 block w-full px-3 py-2 bg-gray-700 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500  text-gray-100`}
                            />
                            <AnimatedErrorMessage message={errors?.company?.message} />
                        </motion.div>
                    </motion.div>
                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={updateClientMutation.isPending}
                            className="px-4 py-2 bg-gray-600 text-gray-100 font-semibold rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={updateClientMutation.isPending}
                            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {updateClientMutation.isPending ? (
                                <>
                                    <SpinnerIcon />
                                    Salvando...
                                </>
                            ) : (
                                'Salvar Alterações'
                            )}
                        </button>
                    </div>
                </motion.form>
            </motion.div>
        </motion.div >
    );
}