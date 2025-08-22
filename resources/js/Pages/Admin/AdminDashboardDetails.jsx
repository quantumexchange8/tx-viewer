import { TeamDashboardChart } from "@/Components/Chart";
import { BalanceIcon, CostIcon, NetIcon } from "@/Components/Icon";
import TeamDashboardCard from "@/Components/TeamDashboardCard";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Table } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import dayjs from "dayjs";
import Select from "react-select";

export default function Dashboard({ settings, years, transactions }) {
    const isMobile = useMediaQuery({ query: "(max-width: 991px)" });
    const smallScreen = useMediaQuery({ query: "(max-width: 400px)" });

    const [yearSelected, setYearSelected] = useState("");
    const [monthSelected, setMonthSelected] = useState("");
    const [transactionSelected, setTransactionSelected] = useState([]);
    const [displayManagement, setDisplayManagement] = useState([]);
    const [chartData, setChartData] = useState({
        deposit: null,
        withdrawal: null,
        cost: null,
        balance: null,
        net: null,
        months: null,
    });
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const [summary, setSummary] = useState({
        deposit: 0,
        withdrawal: 0,
        cost: 0,
        balance: 1000,
        net: 1000,
    });

    const { deposit, withdrawal, cost, balance, net } = summary;

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
                    <p className="h6">日期</p>
                </div>
            ),
            dataIndex: "created_at",
            key: "date",
            width: smallScreen ? 70 : 120,

            render: (text) => (
                <div
                    className="w-auto "
                    style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                >
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
                    <p className="h6">時間</p>
                </div>
            ),
            dataIndex: "created_at",
            key: "time",
            responsive: ["lg"],
            render: (text) => (
                <div className="w-auto">
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
                    <p className="h6">帳戶編號</p>
                </div>
            ),
            key: "meta_id",
            width: smallScreen ? 70 : 120,

            render: (_, record) => (
                <div
                    className="text-center w-auto "
                    style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                >
                    {record.transaction_type === "deposit" ? (
                        <p className="fw-bold mb-0">{record.to_meta_login}</p>
                    ) : record.transaction_type === "withdrawal" ? (
                        <p className="fw-bold mb-0">{record.from_meta_login}</p>
                    ) : (
                        "-"
                    )}{" "}
                </div>
            ),
        },
        {
            title: () => (
                <div className="text-center">
                    <p className="h6">存款</p>
                </div>
            ),
            dataIndex: "transaction_amount",
            key: "deposit",
            render: (val, record) => (
                <div className="text-center w-auto">
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
                    <p className="h6">提款</p>
                </div>
            ),
            dataIndex: "transaction_amount",
            key: "withdrawal",
            render: (val, record) => (
                <div className="text-center w-auto">
                    {record.transaction_type === "withdrawal" ? (
                        <p className="text-danger fw-bold h6">-${val}</p>
                    ) : (
                        "-"
                    )}
                </div>
            ),
        },
    ];

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: "#0f1535",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "8px",
            color: "#fff",
            boxShadow: state.isFocused
                ? "0 0 0 1px rgba(255,255,255,0.25)"
                : "none",
            "&:hover": {
                borderColor: "rgba(255, 255, 255, 0.25)",
            },
        }),
        singleValue: (provided) => ({
            ...provided,
            color: "#fff",
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: "#0f1535",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            overflow: "hidden",
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused
                ? "rgba(255,255,255,0.1)"
                : "#0f1535",
            color: state.isDisabled ? "#737373ff" : "#fff", // gray text if disabled
            cursor: "pointer",
        }),
        input: (provided) => ({
            ...provided,
            color: "#fff",
        }),
        placeholder: (provided) => ({
            ...provided,
            color: "rgba(255,255,255,0.5)",
        }),
    };

    const calculateStats = (year, month) => {
        let deposit = 0,
            withdrawal = 0,
            cost = 0,
            net = 0,
            balance = 1000;

        const filtered = transactions?.[year]?.[month] || [];

        filtered.forEach((row) => {
            if (row.transaction_type === "deposit") {
                deposit += parseFloat(row.transaction_amount);
            } else if (row.transaction_type === "withdrawal") {
                withdrawal += parseFloat(row.transaction_amount);
            }
        });

        cost = 0.1 * deposit;
        net = deposit + balance - cost - withdrawal;

        return {
            deposit: Number(deposit.toFixed(2)),
            withdrawal: Number(withdrawal.toFixed(2)),
            cost: Number(cost.toFixed(2)),
            balance: Number(balance.toFixed(2)),
            net: Number(net.toFixed(2)),
        };
    };

    const yearOptions = Object.keys(displayManagement)
        .sort((a, b) => b - a)
        .map((year) => {
            return {
                value: year,
                label: year,
            };
        });

    const monthOptions = Object.keys(displayManagement[yearSelected] || {}).map(
        (monthNum) => ({
            value: monthNum,
            label: monthMap[monthNum],
            isDisabled: yearSelected == currentYear && monthNum > currentMonth,
        })
    );

    useEffect(() => {
        if (settings) {
            setDisplayManagement(JSON.parse(settings.display_management));
        }
    }, [settings]);

    useEffect(() => {
        // Make sure latest year is selected as default, if latest year is disabeld, select the next available year
        if (years && years.length > 0) {
            setYearSelected(years[0]);
        }
    }, [years, displayManagement]);

    useEffect(() => {
        if (!yearSelected) return;

        // find allowed months
        const months = displayManagement?.[yearSelected] || {};
        let enabledMonths;

        if (yearSelected == currentYear) {
            enabledMonths = Object.keys(months)
                .filter((m) => parseInt(m) <= currentMonth)
                .map((m) => parseInt(m));
        } else {
            enabledMonths = Object.keys(months).map((m) => parseInt(m));
        }

        if (enabledMonths.length === 0) {
            setChartData(null);
            setTransactionSelected([]);
            return;
        }

        let activeMonth = monthSelected;

        // if current month isn’t valid for this year, pick last available
        if (!enabledMonths.includes(activeMonth)) {
            const lastMonth = Math.max(...enabledMonths);

            console.log(
                "month: ",
                enabledMonths,
                lastMonth,
                lastMonth,
                activeMonth
            );

            // ✅ only update if truly different
            if (lastMonth !== monthSelected) {
                setMonthSelected(lastMonth);
                return;
            }

            activeMonth = lastMonth;
        }

        // --- chart calculation ---
        let results = {
            months: [],
            deposit: [],
            withdrawal: [],
            cost: [],
            balance: [],
            net: [],
        };

        const startDate = dayjs(`${yearSelected}-${activeMonth}-01`);

        for (let i = 5; i >= 0; i--) {
            const date = startDate.subtract(i, "month");
            const year = date.year();
            const month = date.month() + 1;

            const stats = calculateStats(year, month);

            results.months.push(date.format("YYYY-MM"));
            results.deposit.push(stats.deposit);
            results.withdrawal.push(stats.withdrawal);
            results.cost.push(stats.cost);
            results.balance.push(stats.balance);
            results.net.push(stats.net);
        }

        setChartData({
            deposit: results.deposit,
            withdrawal: results.withdrawal,
            cost: results.cost,
            balance: results.balance,
            net: results.net,
            months: results.months,
        });

        if (transactions?.[yearSelected]?.[activeMonth]) {
            const currentStats = calculateStats(yearSelected, activeMonth);

            setTransactionSelected(transactions[yearSelected][activeMonth]);
            setSummary(currentStats);
        } else {
            setTransactionSelected([]);

            setSummary({
                deposit: 0,
                withdrawal: 0,
                cost: 0,
                balance: 1000,
                net: 1000,
            });
        }
    }, [yearSelected, monthSelected]);

    console.log(
        "month: ",
        monthSelected,
        yearSelected,
        transactions?.[yearSelected]?.[monthSelected]
    );

    return (
        <>
            <AuthenticatedLayout settings={settings}>
                <Head title="Team Dashboard" />
                <div className="row">
                    <TeamDashboardCard
                        title="存款"
                        amount={deposit.toFixed(2)}
                        chart={
                            <TeamDashboardChart
                                isMobile={isMobile}
                                name="In"
                                data={chartData["deposit"]}
                                months={chartData["months"]}
                            />
                        }
                    />
                    <TeamDashboardCard
                        title="提款"
                        amount={withdrawal.toFixed(2)}
                        chart={
                            <TeamDashboardChart
                                isMobile={isMobile}
                                name="Out"
                                data={chartData["withdrawal"]}
                                months={chartData["months"]}
                            />
                        }
                    />
                    <TeamDashboardCard
                        title="当月余额"
                        amount={balance.toFixed(2)}
                        chart={
                            <TeamDashboardChart
                                isMobile={isMobile}
                                name="Balance"
                                data={chartData["balance"]}
                                months={chartData["months"]}
                            />
                        }
                        icon={<BalanceIcon />}
                    />
                    <TeamDashboardCard
                        title="维护费用"
                        amount={cost.toFixed(2)}
                        chart={
                            <TeamDashboardChart
                                isMobile={isMobile}
                                name="Cost"
                                data={chartData["cost"]}
                                months={chartData["months"]}
                            />
                        }
                        icon={<CostIcon />}
                    />

                    <TeamDashboardCard
                        title="净值余额"
                        amount={net.toFixed(2)}
                        chart={
                            <TeamDashboardChart
                                isMobile={isMobile}
                                name="Net"
                                data={chartData["net"]}
                                months={chartData["months"]}
                            />
                        }
                        icon={<NetIcon />}
                    />
                </div>

                <div className="d-lg-none d-flex justify-content-between">
                    <div className="w-auto">
                        <Select
                            options={yearOptions}
                            value={
                                yearOptions.length > 0
                                    ? yearOptions.find(
                                          (o) =>
                                              String(o.value) ===
                                              String(yearSelected)
                                      ) || null
                                    : null
                            }
                            onChange={(opt) => setYearSelected(opt.value)}
                            styles={customStyles}
                            placeholder="选择年份"
                        />
                    </div>

                    <div className="w-auto">
                        <Select
                            options={monthOptions}
                            value={
                                monthOptions.length > 0
                                    ? monthOptions.find(
                                          (o) =>
                                              String(o.value) ===
                                              String(monthSelected)
                                      ) || null
                                    : null
                            }
                            onChange={(opt) => setMonthSelected(opt.value)}
                            styles={customStyles}
                            placeholder="选择月份"
                        />
                    </div>
                </div>

                <div className="d-none d-lg-flex flex-row flex-wrap gap-2 justify-content-end mb-3">
                    {Object.keys(displayManagement).map((year) => {
                        return (
                            <button
                                key={year}
                                type="button"
                                className={`btn btn-primary px-5 raised ${
                                    Number(yearSelected) === Number(year)
                                        ? "active text-info"
                                        : ""
                                }`}
                                onClick={() => setYearSelected(Number(year))}
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
                                        String(monthSelected)
                                            ? "btn-info"
                                            : "btn-outline-info"
                                    }`}
                                    disabled={
                                        currentYear == yearSelected &&
                                        currentMonth < monthNum
                                    }
                                    onClick={() =>
                                        setMonthSelected(Number(monthNum))
                                    }
                                >
                                    {monthMap[monthNum]}
                                </button>
                            )
                        )}
                </div>
                <div className="card mt-5" id="time-management">
                    <div
                        className={`card-body text-start ${
                            isMobile ? "p-1" : "p-4"
                        }`}
                    >
                        <Table
                            className="mt-3 text-light"
                            style={{ userSelect: "none" }}
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
