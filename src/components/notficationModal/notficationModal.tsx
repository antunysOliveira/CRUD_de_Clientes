import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ReactNode, useState, createContext, useContext, useCallback } from 'react';

const SuccessIcon = () => (
    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ErrorIcon = () => (
    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const InfoIcon = () => (
    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

type NotificationType = 'success' | 'error' | 'info';

type Notification = {
    id: number;
    message: string;
    type: NotificationType;
};

type NotificationContextType = {
    addNotification: (message: string, type: NotificationType) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

type NotificationItemProps = {
    notification: Notification;
    onClose: (id: number) => void;
};

function NotificationItem({ notification, onClose }: NotificationItemProps) {
    const notificationStyles = {
        success: {
            bg: 'bg-green-500',
            icon: <SuccessIcon />,
        },
        error: {
            bg: 'bg-red-600',
            icon: <ErrorIcon />,
        },
        info: {
            bg: 'bg-blue-500',
            icon: <InfoIcon />,
        },
    };

    const variants: Variants = {
        initial: { opacity: 0, y: -50, scale: 0.8, x: 50 },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            x: 0,
            transition: { type: 'spring', stiffness: 400, damping: 25 }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            x: 100,
            transition: { duration: 0.3 }
        },
    };

    useState(() => {
        const timer = setTimeout(() => {
            onClose(notification.id);
        }, 5000);

        return () => clearTimeout(timer);
    });


    return (
        <motion.div
            layout
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`relative flex items-center w-full max-w-sm p-4 mb-3 text-white rounded-lg shadow-lg ${notificationStyles[notification.type].bg}`}
        >
            <div className="flex-shrink-0">
                {notificationStyles[notification.type].icon}
            </div>
            <div className="ml-3 text-sm font-medium">
                {notification.message}
            </div>
            <button
                onClick={() => onClose(notification.id)}
                className="ml-auto -mx-1.5 -my-1.5 p-1.5 text-white/70 hover:text-white hover:bg-white/20 rounded-lg inline-flex h-8 w-8 transition-colors"
                aria-label="Fechar"
            >
                <span className="sr-only">Fechar</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
            </button>
        </motion.div>
    );
}

type NotificationListProps = {
    notifications: Notification[];
    removeNotification: (id: number) => void;
}

function NotificationList({ notifications, removeNotification }: NotificationListProps) {
    return (
        <div className="fixed top-5 right-5 z-[100] w-full max-w-sm">
            <AnimatePresence initial={false}>
                {notifications.map((notification) => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onClose={removeNotification}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback((message: string, type: NotificationType) => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, message, type }]);
    }, []);

    const removeNotification = useCallback((id: number) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}
            <NotificationList notifications={notifications} removeNotification={removeNotification} />
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification deve ser usado dentro de um NotificationProvider');
    }
    return context;
}