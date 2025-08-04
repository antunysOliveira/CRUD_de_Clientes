import { useState, useEffect } from 'react';
import Api from "@/services/api";
import CreateClientModal from '@/components/createClientModal/creatClient';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmationModal from '@/components/confirmationModal/confirmationModal';
import EditClientModal from '@/components/editClientModal/editClientModal';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
}

export default function App() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (!loading && !isCreateModalOpen && !isEditModalOpen) {
      fetchClients();
    }
  }, [isCreateModalOpen, isEditModalOpen]);

  const handleOpenDeleteModal = (clientId: string) => {
    setClientToDelete(clientId);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setClientToDelete(null);
  };

  const handleOpenEditModal = (client: Client) => {
    setClientToEdit(client);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setClientToEdit(null);
  };

  async function fetchClients() {
    try {
      setLoading(true);
      setError(null);
      const resp = await Api.ListClients();
      setClients(resp?.data?.clients || []);
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
        "Não foi possível carregar os clientes. Tente novamente mais tarde."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmDelete() {
    if (!clientToDelete) {
      setError("ID do cliente não encontrado para exclusão.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await Api.DeleteClient(clientToDelete);
      handleCloseDeleteModal();
      fetchClients();

    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
        "Não foi possível excluir o cliente. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const tableContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };


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
            {loading && (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                Carregando clientes...
              </div>
            )}
            {error && (
              <div className="text-center py-4 text-red-600 bg-red-100 dark:bg-red-900/20 rounded-md">
                {error}
              </div>
            )}

            {!loading && !error && (
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
                    {clients.map((client: any, index: any) => (
                      <motion.tr
                        key={index}
                        className="border-b transition duration-300 ease-in-out hover:bg-gray-100 dark:border-neutral-700 dark:hover:bg-gray-700"
                        variants={tableRowVariants}
                        layout
                      >
                        <td className="whitespace-nowrap px-3 py-4 font-medium">{client?.name || "..."}</td>
                        <td className="whitespace-nowrap px-3 py-4">{client?.email || "..."}</td>
                        <td className="whitespace-nowrap px-3 py-4">{client?.phone || "..."}</td>
                        <td className="whitespace-nowrap px-3 py-4">{client?.company || "..."}</td>
                        <td className="whitespace-nowrap px-3 py-4">
                          <div className='flex space-x-1'>
                            <button
                              onClick={() => handleOpenDeleteModal(client?.id)}
                              className='bg-red-600 text-white px-2 font-semibold text-[10px] py-1 rounded-2xl'
                            >
                              deletar
                            </button>
                            <button
                              onClick={() => handleOpenEditModal(client)}
                              className='bg-white text-black font-semibold px-2 text-[10px] py-1 rounded-2xl'
                            >
                              Editar
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {!loading && clients.length === 0 && (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                Nenhum cliente encontrado. Que tal adicionar um novo?
              </div>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {/* //! modal de criação de cliente */}
        {isCreateModalOpen && (
          <CreateClientModal
            onClose={() => setCreateModalOpen(false)}
          />
        )}
        {/* //! modal para excluir cliente */}
        {isDeleteModalOpen && (
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
            title="Confirmar Exclusão"
          >
            <p>
              Você tem certeza que deseja excluir este cliente?
              <br />
              <span className="font-bold text-red-400">Esta ação não pode ser desfeita.</span>
            </p>
          </ConfirmationModal>
        )}
        {/* //! modal para editar cliente */}
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