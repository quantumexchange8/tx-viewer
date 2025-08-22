export default function TeamDashboardCard({ title, amount, chart, icon }) {
    if (title == "存款" || title == "提款") {
        return (
            <div className="col-12 col-md-6 d-flex">
                <div className="card rounded-4 w-100">
                    <div className="card-body">
                        <div className="d-flex flex-column justify-content-between h-100">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <h2 className="mb-0">{title}</h2>
                            </div>
                            <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
                                <div className="d-flex flex-column justify-content-end h-100">
                                    <h3 className="mb-0 text-indigo">
                                        {Number(amount) < 0
                                            ? `-$${Math.abs(
                                                  Number(amount)
                                              ).toFixed(2)}`
                                            : `$${Number(amount).toFixed(2)}`}
                                    </h3>
                                    <p>总数</p>
                                </div>
                                {chart}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="col-12 col-lg-4 d-flex">
                <div className="card rounded-4 w-100">
                    <div className="card-body">
                        <div className="mb-3 d-flex align-items-center justify-content-between">
                            <div className="wh-42 d-flex align-items-center justify-content-center rounded-circle bg-warning bg-opacity-10 text-warning">
                                {icon}
                            </div>
                        </div>
                        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
                            <div className="d-flex flex-column justify-content-end">
                                <h4 className="mb-2">
                                    {Number(amount) < 0
                                        ? `-$${Math.abs(Number(amount)).toFixed(
                                              2
                                          )}`
                                        : `$${Number(amount).toFixed(2)}`}
                                </h4>
                                <p className="mb-3">{title}</p>
                            </div>
                            {chart}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
