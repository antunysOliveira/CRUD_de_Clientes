import {
    useContext,
    createContext,
    useState,
    Suspense,
} from 'react';
import { Outlet } from 'react-router-dom';
import LoadingComponent from '@/components/Loading/Loading';
import ErrorModal from '@/components/errorModal/errorModal';

// SUGESTÃO: Crie uma interface para o usuário para ter um código mais seguro
interface User {
    id: string;
    name: string;
    email: string;
    // Adicione outras propriedades que seu objeto de usuário possa ter
}

interface LayoutProps {
    token?: string;
    user?: User; // Tipagem mais forte para o usuário
    fullLoading: boolean;
    error: any
    setError: (value: any) => void
    setToken: (value: string) => void;
    setUser: (user: User | undefined) => void; // Ação de salvar o usuário
    setFullLoading: (value: boolean) => void;
    login: (token: string) => void;
    logout: () => void;
}

const layoutContext = createContext({} as LayoutProps);

export const useLayout = (): LayoutProps => {
    return useContext(layoutContext);
};

function useProvideLayout(): LayoutProps {
    const [fullLoading, setFullLoading] = useState(false);
    const [token, setToken] = useState<string | undefined>(window?.localStorage?.getItem('token') || '');
    const [user, _setUser] = useState<User | undefined>(() => {
        const storedUser = window.localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : undefined;
    });
    const [error, setError] = useState<any>();

    function setUser(newUser: User | undefined) {
        if (newUser) {
            window.localStorage.setItem('user', JSON.stringify(newUser));
        } else {
            window.localStorage.removeItem('user');
        }
        _setUser(newUser);
    }

    function login(token: string) {
        window?.localStorage?.setItem('token', token);
        setToken(token);
    }

    function logout() {
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('user');
        setToken(undefined);
        _setUser(undefined);
    }

    return {
        token,
        user,
        fullLoading,
        setToken,
        setUser,
        setFullLoading,
        login,
        logout,
        error,
        setError
    }
}
const ProvideLayout: any = () => {
    const layout: LayoutProps = useProvideLayout();
    return (
        <layoutContext.Provider value={layout}>
            <Suspense fallback={<LoadingComponent />}>
                <Outlet />
            </Suspense>
            {layout?.error && (
                <ErrorModal
                    message={layout?.error}
                    onClose={() => layout?.setError(null)}
                />)}

        </layoutContext.Provider>
    );
};

export default ProvideLayout;