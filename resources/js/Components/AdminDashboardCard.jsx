import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export default function TeamCard({
    teamName,
    chart,
    deposit = null,
    withdrawal = null,
    balance = null,
    cost = null,
    net = null,
    isLoading,
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
                            {/* 存款 */}
                            {deposit !== null && (
                                <div className="col-12 col-lg-2 align-items-center d-flex flex-column flex-lg-column-reverse">
                                    {isLoading ? (
                                        <Spin
                                            indicator={<LoadingOutlined spin />}
                                            size="large"
                                        />
                                    ) : (
                                        <h4 className="mb-0 text-indigo">
                                            {deposit < 0
                                                ? `-$${Math.abs(
                                                      deposit
                                                  ).toFixed(2)}`
                                                : `$${deposit.toFixed(2)}`}
                                        </h4>
                                    )}
                                    <p className="text-center">存款</p>
                                </div>
                            )}

                            {/* 提款 */}
                            {withdrawal !== null && (
                                <div className="col-12 col-lg-2 align-items-center d-flex flex-column flex-lg-column-reverse">
                                    <h4 className="mb-0 text-indigo">
                                        {withdrawal < 0
                                            ? `-$${Math.abs(withdrawal).toFixed(
                                                  2
                                              )}`
                                            : `$${withdrawal.toFixed(2)}`}
                                    </h4>
                                    <p className="text-center">提款</p>
                                </div>
                            )}

                            {/* 当月余额 */}
                            {balance !== null && (
                                <div className="col-12 col-lg-2 align-items-center d-flex flex-column flex-lg-column-reverse">
                                    <h4 className="mb-0 text-indigo">
                                        {balance < 0
                                            ? `-$${Math.abs(balance).toFixed(
                                                  2
                                              )}`
                                            : `$${balance.toFixed(2)}`}
                                    </h4>
                                    <p className="text-center">当月余额</p>
                                </div>
                            )}

                            {/* 维护费用 */}
                            <div className="col-12 col-lg-2 align-items-center d-flex flex-column flex-lg-column-reverse">
                                <h4 className="mb-0 text-indigo">
                                    {cost < 0
                                        ? `-$${Math.abs(cost).toFixed(2)}`
                                        : `$${cost.toFixed(2)}`}
                                </h4>
                                <p className="text-center">维护费用</p>
                            </div>

                            {/* 净值余额 */}
                            {net !== null && (
                                <div className="col-12 col-lg-2 align-items-center d-flex flex-column flex-lg-column-reverse">
                                    <h4 className="mb-0 text-indigo">
                                        {net < 0
                                            ? `-$${Math.abs(net).toFixed(2)}`
                                            : `$${net.toFixed(2)}`}
                                    </h4>
                                    <p className="text-center">净值余额</p>
                                </div>
                            )}

                            {/* Chart */}
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
