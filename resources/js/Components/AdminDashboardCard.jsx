export default function TeamCard({
    teamName,
    chart,
    deposit,
    withdrawal,
    balance,
    cost,
    net,
}) {
    return (
        <div className="col-12 d-flex">
            <div className="card rounded-4 w-100 team-card">
                <div className="card-body">
                    <div className="d-flex gap-3 gap-lg-0 flex-column justify-content-between h-100">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <h2 className="mb-0">{teamName}</h2>
                        </div>
                        <div className="row">
                            <div className="col-12 col-lg-2 align-items-center d-flex flex-column flex-lg-column-reverse">
                                <h4 className="mb-0 text-indigo">
                                    $
                                    {deposit
                                        ? deposit.toFixed(2)
                                        : (0.0).toFixed(2)}
                                </h4>
                                <p className="text-center">存款</p>
                            </div>
                            <div className="col-12 col-lg-2 align-items-center d-flex flex-column flex-lg-column-reverse">
                                <h4 className="mb-0 text-indigo">
                                    $
                                    {withdrawal
                                        ? withdrawal.toFixed(2)
                                        : (0.0).toFixed(2)}
                                </h4>
                                <p className="text-center">提款</p>
                            </div>
                            <div className="col-12 col-lg-2 align-items-center d-flex flex-column flex-lg-column-reverse">
                                <h4 className="mb-0 text-indigo">
                                    $
                                    {balance
                                        ? balance.toFixed(2)
                                        : (0.0).toFixed(2)}
                                </h4>
                                <p className="text-center">当月余额</p>
                            </div>
                            <div className="col-12 col-lg-2 align-items-center d-flex flex-column flex-lg-column-reverse">
                                <h4 className="mb-0 text-indigo">
                                    ${cost ? cost.toFixed(2) : (0.0).toFixed(2)}
                                </h4>
                                <p className="text-center">维护费用</p>
                            </div>
                            <div className="col-12 col-lg-2 align-items-center d-flex flex-column flex-lg-column-reverse">
                                <h4 className="mb-0 text-indigo">
                                    ${net ? net.toFixed(2) : (0.0).toFixed(2)}
                                </h4>
                                <p className="text-center">净值余额</p>
                            </div>
                            <div className="col-12 col-lg-2 align-items-center d-flex flex-column flex-lg-column-reverse">
                                {chart}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
