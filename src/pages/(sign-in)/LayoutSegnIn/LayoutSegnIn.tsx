import { Suspense, lazy } from "react";
import { Outlet } from "react-router-dom";
const LoadingComponent = lazy(() => import("@/components/Loading/Loading"));

export default function LayoutSignIn() {
    return (
        <div className="">
            <Suspense fallback={<LoadingComponent />}>
                <Outlet />
            </Suspense>
        </div>
    )
}