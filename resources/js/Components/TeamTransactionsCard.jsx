export default function TeamTransactionsCard({
    teamName,
    chart,
    cost = null,
    net = null,
}) {
    return (
        <div className="col-12 d-flex">
            <div
                className="card rounded-4 w-100 team-card"
                style={{ cursor: "auto", backgroundColor: "#2e3770ff" }}
            >
                <div className="card-body">
                    <div className="d-flex gap-3 gap-lg-0 flex-column justify-content-between h-100">
                        <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
                            <h4 className="mb-0">{teamName}</h4>
                            <div className="d-flex gap-3">
                                <button className="btn btn-inverse-warning px-3">
                                    未结账
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-lg-3 align-items-center d-flex flex-column flex-lg-column-reverse">
                                <h5 className="mb-0 text-indigo">
                                    ${cost ? cost.toFixed(2) : (0.0).toFixed(2)}
                                </h5>
                                <p className="text-center">维护费用</p>
                            </div>

                            {net !== null && (
                                <div className="col-12 col-lg-4 align-items-center d-flex flex-column flex-lg-column-reverse">
                                    <h5 className="mb-0 text-indigo">
                                        {net < 0
                                            ? `-$${Math.abs(net).toFixed(2)}`
                                            : `$${net.toFixed(2)}`}
                                    </h5>
                                    <p className="text-center">净值余额</p>
                                </div>
                            )}

                            {/* Chart */}
                            <div className="col-12 col-lg-5 align-items-center d-flex flex-column flex-lg-column-reverse">
                                {chart}
                            </div>
                        </div>
                        <div className="d-md-flex d-grid gap-2 justify-content-center">
                            <button className="btn btn-outline-success px-4 mt-4">
                                调整当月余额
                            </button>
                            <button className="btn btn-outline-primary px-4 mt-4">
                                调整维护费用
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
