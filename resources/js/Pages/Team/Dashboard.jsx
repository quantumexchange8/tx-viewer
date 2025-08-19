import { DashboardChart } from "@/Components/Chart";
import { BalanceIcon, CostIcon, NetIcon } from "@/Components/Icon";
import TeamDashboardCard from "@/Components/TeamDashboardCard";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Table } from "antd";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import dayjs from "dayjs";

export default function Dashboard({ settings, years, transactions }) {
    const isMobile = useMediaQuery({ query: "(max-width: 400px)" });
    const [yearSelected, setYearSelected] = useState("");
    const [monthSelected, setMonthSelected] = useState("");
    const [transactionSelected, setTransactionSelected] = useState([]);

    const [displayManagement, setDisplayManagement] = useState([]);

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const monthMap = {
        1: "一月",
        2: "二月",
        3: "三月",
        4: "四月",
        5: "五月",
        6: "六月",
        7: "七月",
        8: "八月",
        9: "九月",
        10: "十月",
        11: "十一月",
        12: "十二月",
    };

    const columns = [
        {
            title: () => (
                <div>
                    <p className="h5">日期</p>
                </div>
            ),
            dataIndex: "created_at",
            key: "date",
            render: (text) => (
                <div>
                    {text ? (
                        <>
                            <p className="fw-bold mb-0">
                                {dayjs(text).format("DD/MM/YYYY")}
                            </p>
                            <p className="fw-bold d-lg-none mb-0">
                                {dayjs(text).format("HH:mm")}
                            </p>
                        </>
                    ) : (
                        "N/A"
                    )}
                </div>
            ),
        },
        {
            title: () => (
                <div>
                    <p className="h5">时间</p>
                </div>
            ),
            dataIndex: "created_at",
            key: "time",
            responsive: ["lg"],
            render: (text) => (
                <div>
                    {text ? (
                        <p className="fw-bold mb-0">
                            {dayjs(text).format("HH:mm")}
                        </p>
                    ) : (
                        "N/A"
                    )}
                </div>
            ),
        },
        {
            title: () => (
                <div className="text-center">
                    <p className="h5">账户号码</p>
                </div>
            ),
            dataIndex: "user_id",
            key: "user_id",
            render: (val, record) => (
                <div className="text-center">
                    {val ? <p className="fw-bold mb-0">{val}</p> : "N/A"}
                </div>
            ),
        },
        {
            title: () => (
                <div className="text-center">
                    <p className="h5">存款</p>
                </div>
            ),
            dataIndex: "transaction_amount",
            key: "deposit",
            render: (val, record) => (
                <div className="text-center">
                    {record.transaction_type === "deposit" ? (
                        <p className="text-success fw-bold h6">+${val}</p>
                    ) : (
                        "-"
                    )}
                </div>
            ),
        },
        {
            title: () => (
                <div className="text-center">
                    <p className="h5">提款</p>
                </div>
            ),
            dataIndex: "transaction_amount",
            key: "withdrawal",
            render: (val, record) => (
                <div className="text-center">
                    {record.transaction_type === "withdrawal" ? (
                        <p className="text-danger fw-bold h6">-${val}</p>
                    ) : (
                        "-"
                    )}
                </div>
            ),
        },
    ];

    useEffect(() => {
        if (settings) {
            setDisplayManagement(JSON.parse(settings.display_management));
        }
    }, [settings]);

    useEffect(() => {
        // Make sure latest year is selected as default, if latest year is disabeld, select the next available year
        if (years && years.length > 0) {
            const validYear = years.find((year) => {
                const months = displayManagement?.[year] || {};
                const anyEnabled = Object.values(months).some(
                    (value) => value === true
                );
                return anyEnabled;
            });

            setYearSelected(validYear || years[0]);

            if (yearSelected == currentYear) {
                setMonthSelected(currentMonth);
            } else {
                // ✅ If not current year, find the last available month
                const months = displayManagement?.[yearSelected] || {};
                const enabledMonths = Object.keys(months)
                    .filter((m) => months[m]) // only months marked true
                    .map((m) => parseInt(m));

                if (enabledMonths.length > 0) {
                    const lastMonth = Math.max(...enabledMonths);
                    setMonthSelected(lastMonth);
                } else {
                    setMonthSelected(12);
                }
            }

            console.log("current year & month", currentYear, currentMonth);
        }
    }, [years, displayManagement]);

    useEffect(() => {
        if (
            yearSelected &&
            monthSelected &&
            displayManagement[yearSelected][monthSelected] === true &&
            transactions[yearSelected][monthSelected]
        ) {
            setTransactionSelected(transactions[yearSelected][monthSelected]);
        } else {
            setTransactionSelected([]);
        }

        if (yearSelected == currentYear && monthSelected > currentMonth) {
            setMonthSelected(currentMonth);
        }
    }, [yearSelected, monthSelected]);

    console.log("month selected", yearSelected, monthSelected);

    return (
        <>
            <AuthenticatedLayout settings={settings}>
                <Head title="Team Dashboard" />
                <div className="row">
                    <TeamDashboardCard
                        title="存款"
                        chart={
                            <DashboardChart
                                isMobile={isMobile}
                                name="In"
                                data={[
                                    12302, 234121, 313112, 154842, 231412,
                                    131413, 434234, 242423, 432423,
                                ]}
                            />
                        }
                    />
                    <TeamDashboardCard
                        title="提款"
                        chart={
                            <DashboardChart
                                isMobile={isMobile}
                                name="Out"
                                data={[
                                    13122, 323312, 453542, 543521, 313123,
                                    123123, 321312, 313213, 23131,
                                ]}
                            />
                        }
                    />
                    <TeamDashboardCard
                        title="当月余额"
                        chart={
                            <DashboardChart
                                isMobile={isMobile}
                                name="Balance"
                                data={[
                                    13122, 323312, 453542, 543521, 313123,
                                    123123, 321312, 313213, 23131,
                                ]}
                            />
                        }
                        icon={<BalanceIcon />}
                    />
                    <TeamDashboardCard
                        title="维护费用"
                        chart={
                            <DashboardChart
                                isMobile={isMobile}
                                name="Cost"
                                data={[
                                    13122, 323312, 453542, 543521, 313123,
                                    123123, 321312, 313213, 23131,
                                ]}
                            />
                        }
                        icon={<CostIcon />}
                    />

                    <TeamDashboardCard
                        title="净值余额"
                        chart={
                            <DashboardChart
                                isMobile={isMobile}
                                name="Net"
                                data={[
                                    13122, 323312, 453542, 543521, 313123,
                                    123123, 321312, 313213, 23131,
                                ]}
                            />
                        }
                        icon={<NetIcon />}
                    />
                </div>

                <div className="d-none d-lg-flex flex-row flex-wrap gap-2 justify-content-center mb-3">
                    {Object.keys(displayManagement).map((year) => {
                        const allMonthsDisabled = Object.values(
                            displayManagement[year] || {}
                        ).every((value) => value === false);

                        return (
                            <button
                                key={year}
                                type="button"
                                className={`btn btn-primary px-5 raised ${
                                    Number(yearSelected) === Number(year)
                                        ? "active text-info"
                                        : ""
                                }`}
                                onClick={() => setYearSelected(year)}
                                disabled={allMonthsDisabled}
                            >
                                {year}
                            </button>
                        );
                    })}
                </div>

                <div className="d-none d-lg-flex flex-row gap-2 justify-content-center">
                    {yearSelected &&
                        Object.keys(displayManagement[yearSelected] || {}).map(
                            (monthNum) => (
                                <button
                                    key={monthNum}
                                    type="button"
                                    className={`btn text-nowrap flex-fill ${
                                        String(monthNum) ==
                                            String(monthSelected) &&
                                        displayManagement[yearSelected][
                                            monthNum
                                        ] == true
                                            ? "btn-info"
                                            : "btn-outline-info"
                                    }`}
                                    disabled={
                                        (displayManagement[yearSelected][
                                            monthNum
                                        ] == false ||
                                            (currentYear == yearSelected &&
                                                currentMonth < monthNum)) &&
                                        true
                                    }
                                    onClick={() => setMonthSelected(monthNum)}
                                >
                                    {monthMap[monthNum]}
                                </button>
                            )
                        )}
                </div>
                <div className="card mt-5" id="time-management">
                    <div className="card-body text-start p-4">
                        <Table
                            className="mt-3 text-light"
                            columns={columns}
                            rowKey="id"
                            dataSource={transactionSelected}
                            pagination={{
                                position: ["bottomCenter"],
                                defaultPageSize: 100,
                                showQuickJumper: false,
                                showSizeChanger: false,
                                total: transactionSelected.length,
                                showTotal: (total, range) =>
                                    `显示第${range[0]}-${range[1]}项， 共${total}项`,
                            }}
                            locale={{
                                emptyText: (
                                    <div className="text-center text-light">
                                        没有找到交易记录
                                    </div>
                                ),
                            }}
                        />
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
