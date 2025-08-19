import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";

export default function TransactionSettings() {
    return (
        <AuthenticatedLayout>
            <Head title="Admin Settings" />

            <div className="container text-center">
                <div className="card" id="transaction-adjustment">
                    <div className="card-body text-start p-4">
                        <h4 className="fw-bold mb-2">账目调整</h4>
                    </div>
                </div>

                <div className="card" id="transaction-adjustment">
                    <div className="card-body text-start p-4">
                        <h4 className="fw-bold mb-2">结账设置</h4>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
