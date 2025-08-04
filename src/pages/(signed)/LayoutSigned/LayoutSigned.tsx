import { Outlet } from "react-router-dom";
import { Suspense, lazy } from "react";
const HeaderSigned = lazy(() => import("@/components/HeaderSigned/HeaderSigned"));
const FooterSigned = lazy(() => import("@/components/FooterSigned/FooterSigned"));
const LoadingComponent = lazy(() => import("@/components/Loading/Loading"));

export default function LayoutSigned() {
    return (
        <>
            <HeaderSigned />
            <main className="flex flex-col flex-1 bg-gray-100 dark:bg-gray-900">
                <Suspense fallback={<LoadingComponent />}>
                    <Outlet />
                </Suspense>
            </main>
            <FooterSigned />
        </>
    )
}