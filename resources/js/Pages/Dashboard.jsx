import { DashboardChart } from "@/Components/Chart";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Table } from "antd";

export default function Dashboard() {
    const columns = [
        {
            title: "日期",
            dataIndex: "name",
            key: "name",
            render: (text) => <a>{text}</a>,
        },
        {
            title: "时间",
            dataIndex: "name",
            key: "name",
            render: (text) => <a>{text}</a>,
        },
        {
            title: "Account Number",
            dataIndex: "name",
            key: "name",
            render: (text) => <a>{text}</a>,
        },
        {
            title: "In",
            dataIndex: "name",
            key: "name",
            render: (text) => <a>{text}</a>,
        },
        {
            title: "Out",
            dataIndex: "name",
            key: "name",
            render: (text) => <a>{text}</a>,
        },
    ];

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Dashboard" />
                <div className="row">
                    <div className="col-12 col-md-6 d-flex">
                        <div className="card rounded-4 w-100">
                            <div className="card-body">
                                <div className="d-flex flex-column justify-content-between h-100">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <h2 className="mb-0">In</h2>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex flex-column justify-content-end h-100">
                                            <h3 className="mb-0 text-indigo">
                                                $168.5K
                                            </h3>
                                            <p>总数</p>
                                        </div>
                                        <DashboardChart />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 d-flex">
                        <div className="card rounded-4 w-100">
                            <div className="card-body">
                                <div className="d-flex flex-column justify-content-between h-100">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <h2 className="mb-0">Out</h2>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex flex-column justify-content-end h-100">
                                            <h3 className="mb-0 text-indigo">
                                                $168.5K
                                            </h3>
                                            <p>总数</p>
                                        </div>
                                        <DashboardChart />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-4 d-flex">
                        <div className="card rounded-4 w-100">
                            <div className="card-body">
                                <div className="mb-3 d-flex align-items-center justify-content-between">
                                    <div className="wh-42 d-flex align-items-center justify-content-center rounded-circle bg-warning bg-opacity-10 text-warning">
                                        <span className="material-icons-outlined fs-5">
                                            leaderboard
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-success d-flex align-items-center">
                                            +18%
                                            <i className="material-icons-outlined">
                                                expand_less
                                            </i>
                                        </span>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <div className="d-flex flex-column justify-content-end">
                                        <h4 className="mb-2">24.6%</h4>
                                        <p className="mb-3">当月余额</p>
                                    </div>
                                    <DashboardChart />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-4 d-flex">
                        <div className="card rounded-4 w-100">
                            <div className="card-body">
                                <div className="mb-3 d-flex align-items-center justify-content-between">
                                    <div className="wh-42 d-flex align-items-center justify-content-center rounded-circle bg-info bg-opacity-10 text-info">
                                        <span className="material-icons-outlined fs-5">
                                            visibility
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-danger d-flex align-items-center">
                                            -35%
                                            <i className="material-icons-outlined">
                                                expand_less
                                            </i>
                                        </span>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <div className="d-flex flex-column justify-content-end">
                                        <h4 className="mb-2">189K</h4>
                                        <p className="mb-3">维护费用</p>
                                    </div>
                                    <DashboardChart />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-4 d-flex">
                        <div className="card rounded-4 w-100">
                            <div className="card-body">
                                <div className="mb-3 d-flex align-items-center justify-content-between">
                                    <div className="wh-42 d-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10 text-success">
                                        <span className="material-icons-outlined fs-5">
                                            attach_money
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-success d-flex align-items-center">
                                            +14%
                                            <i className="material-icons-outlined">
                                                expand_less
                                            </i>
                                        </span>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <div className="d-flex flex-column justify-content-end">
                                        <h4 className="mb-2">$47.6k</h4>
                                        <p className="mb-3">净值余额</p>
                                    </div>
                                    <DashboardChart />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-none d-lg-flex flex-row flex-wrap gap-2 justify-content-center mb-3">
                    <button
                        type="button"
                        className="btn btn-primary px-5 raised"
                    >
                        2025
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary px-5 raised"
                        disabled
                    >
                        2026
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary px-5 raised"
                    >
                        2027
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary px-5 raised"
                    >
                        2028
                    </button>
                </div>

                <div className="d-none d-lg-flex flex-row flex-wrap gap-2 justify-content-center">
                    <button
                        type="button"
                        className="btn btn-outline-info px-4 text-nowrap disabled:bg-secondary-subtle"
                        disabled
                    >
                        一月
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-info px-4 text-nowrap"
                    >
                        二月
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-info px-4 text-nowrap"
                    >
                        三月
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-info px-4 text-nowrap"
                    >
                        四月
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-info px-4 text-nowrap"
                    >
                        五月
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-info px-4 text-nowrap"
                    >
                        六月
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-info px-4 text-nowrap"
                    >
                        七月
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-info px-4 text-nowrap"
                    >
                        八月
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-info px-4 text-nowrap"
                    >
                        九月
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-info px-4 text-nowrap"
                    >
                        十月
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-info px-4 text-nowrap"
                    >
                        十一月
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-info px-4 text-nowrap"
                    >
                        十二月
                    </button>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
