import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

import Api from "@/services/api";
import CreateClientModal from '@/components/createClientModal/creatClient';
import ConfirmationModal from '@/components/confirmationModal/confirmationModal';
import EditClientModal from '@/components/editClientModal/editClientModal';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
}

async function fetchAllClients(): Promise<Client[]> {
  const resp = await Api.ListClients();
  return resp?.data?.clients || [];
}

export default function App() {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const queryClient = useQueryClient();

  const {
    data: allClients,
    isLoading,
    error,
  } = useQuery<Client[], Error>({
    queryKey: ['clients'],
    queryFn: fetchAllClients,
  });

  const filteredClients = useMemo(() => {
    if (!allClients) return [];
    if (!debouncedSearchTerm) return allClients;

    const term = debouncedSearchTerm.toLowerCase();
    return allClients.filter(client =>
      client.name.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term) ||
      (client.phone || "").toLowerCase().includes(term) ||
      (client.company || "").toLowerCase().includes(term)
    );
  }, [allClients, debouncedSearchTerm]);

  const deleteClientMutation = useMutation({
    mutationFn: (clientId: string) => Api.DeleteClient(clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      handleCloseDeleteModal();
    },
  });

  const handleOpenDeleteModal = (clientId: string) => {
    setClientToDelete(clientId);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setClientToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (clientToDelete) {
      deleteClientMutation.mutate(clientToDelete);
    }
  };

  const handleOpenEditModal = (client: Client) => {
    setClientToEdit(client);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setClientToEdit(null);
  };

  const pageVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
  const headerVariants = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
  const tableContainerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const tableRowVariants = { hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } };

  return (
    <motion.div
      className="bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 transition-colors duration-300 font-sans"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="flex justify-between items-center mb-6"
          variants={headerVariants}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Painel de Clientes
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-300">
              Gerencie os clientes cadastrados no sistema.
            </p>
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all duration-300"
          >
            Adicionar Cliente
          </button>
        </motion.div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, e-mail, telefone ou empresa..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-colors duration-300"
              />
            </div>

            {isLoading && (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                Carregando clientes...
              </div>
            )}

            {error && (
              <div className="text-center py-4 text-red-600 bg-red-100 dark:bg-red-900/20 rounded-md">
                {error.message || "Não foi possível carregar os clientes."}
              </div>
            )}

            {!isLoading && !error && (
              <motion.div
                className="overflow-x-auto"
                variants={tableContainerVariants}
                initial="hidden"
                animate="visible"
              >
                <table className="min-w-full text-left text-sm font-light text-gray-700 dark:text-gray-200">
                  <thead className="border-b font-medium dark:border-neutral-700 bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th scope="col" className="px-3 py-4">Nome</th>
                      <th scope="col" className="px-3 py-4">Email</th>
                      <th scope="col" className="px-3 py-4">Telefone</th>
                      <th scope="col" className="px-3 py-4">Empresa</th>
                      <th scope="col" className="px-3 py-4">Gerenciar</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredClients.map((client) => (
                        <motion.tr
                          key={client.id}
                          className="border-b transition duration-300 ease-in-out hover:bg-gray-100 dark:border-neutral-700 dark:hover:bg-gray-700"
                          variants={tableRowVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          layout
                        >
                          <td className="whitespace-nowrap px-3 py-4 font-medium">{client.name || "..."}</td>
                          <td className="whitespace-nowrap px-3 py-4">{client.email || "..."}</td>
                          <td className="whitespace-nowrap px-3 py-4">{client.phone || "..."}</td>
                          <td className="whitespace-nowrap px-3 py-4">{client.company || "..."}</td>
                          <td className="whitespace-nowrap px-3 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleOpenDeleteModal(client.id)}
                                className="rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white transition-all duration-200 ease-in-out hover:bg-red-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                              >
                                Deletar
                              </button>
                              <button
                                onClick={() => handleOpenEditModal(client)}
                                className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-xs font-semibold text-gray-700 transition-all duration-200 ease-in-out hover:bg-gray-200 hover:text-black active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                              >
                                Editar
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </motion.div>
            )}

            {!isLoading && filteredClients.length === 0 && (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                {debouncedSearchTerm
                  ? "Nenhum cliente encontrado para sua busca."
                  : "Nenhum cliente cadastrado. Que tal adicionar um novo?"
                }
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isCreateModalOpen && (
          <CreateClientModal
            onClose={() => setCreateModalOpen(false)}
          />
        )}
        {isDeleteModalOpen && (
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
            title="Confirmar Exclusão"
            isConfirming={deleteClientMutation.isPending}
          >
            <p>
              Você tem certeza que deseja excluir este cliente?
              <br />
              <span className="font-bold text-red-400">Esta ação não pode ser desfeita.</span>
            </p>
          </ConfirmationModal>
        )}
        {isEditModalOpen && clientToEdit && (
          <EditClientModal
            onClose={handleCloseEditModal}
            client={clientToEdit}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}