import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import TeamCard from "@/Components/AdminDashboardCard";
import { AdminDashboardChart } from "@/Components/Chart";
import dayjs from "dayjs";
import Select from "react-select";
import { TimePicker } from "antd";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useState, useEffect, useMemo } from "react";
import { useMediaQuery } from "react-responsive";
import TeamTransactionsCard from "@/Components/TeamTransactionsCard";

export default function TransactionSettings({ settings, years }) {
    const isMobile = useMediaQuery({ query: "(max-width: 991px)" });

    const [isLoading, setIsLoading] = useState(true);
    const [teams, setTeams] = useState("");
    const [transactions, setTransactions] = useState("");
    const [yearSelected, setYearSelected] = useState("");
    const [monthSelected, setMonthSelected] = useState("");
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

    console.log("month Opt: ", monthOptions);

    const dateOptions = [
        { value: 1, label: 1 },
        { value: 2, label: 2 },
        { value: 3, label: 3 },
        { value: 4, label: 4 },
        { value: 5, label: 5 },
        { value: 6, label: 6 },
        { value: 7, label: 7 },
        { value: 8, label: 8 },
        { value: 9, label: 9 },
        { value: 10, label: 10 },
    ];

    const teamStats = useMemo(() => {
        if (!teams || teams.length === 0) return {};

        const result = {};

        teams.forEach((team) => {
            const teamID = team.id;
            const records =
                transactions?.[teamID]?.[yearSelected]?.[monthSelected] || [];

            let deposit = 0,
                withdrawal = 0,
                cost = 0,
                net = 0,
                balance = 1000;

            records.forEach((row) => {
                if (row.transaction_type === "deposit") {
                    deposit += parseFloat(row.transaction_amount);
                } else if (row.transaction_type === "withdrawal") {
                    withdrawal += parseFloat(row.transaction_amount);
                }
            });

            cost = 0.1 * deposit;
            net = deposit + balance - cost - withdrawal;

            // format all to 2 decimal places
            deposit = Number(deposit.toFixed(2));
            withdrawal = Number(withdrawal.toFixed(2));
            cost = Number(cost.toFixed(2));
            net = Number(net.toFixed(2));
            balance = Number(balance.toFixed(2));

            result[teamID] = {
                team,
                deposit,
                withdrawal,
                cost,
                balance,
                net,
            };
        });

        return result;
    }, [transactions, teams, yearSelected, monthSelected]);

    const fetchTransactions = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("/admin/getAllTransactions");
            setTransactions(response.data);
        } catch (error) {
            console.error("error", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTeams = async () => {
        setIsLoading(true);

        try {
            const response = await axios.get("/admin/getAllTeams");
            setTeams(response.data);
        } catch (error) {
            console.error("error", error);
        } finally {
        }
    };

    useEffect(() => {
        fetchTeams();
        fetchTransactions();
    }, []);

    useEffect(() => {
        if (settings) {
            setDisplayManagement(JSON.parse(settings.display_management));
        }
    }, [settings]);

    useEffect(() => {
        if (years && years.length > 0) {
            setYearSelected(years[0]);
        }
    }, [years]);

    useEffect(() => {
        const months = displayManagement?.[yearSelected] || {};
        let enabledMonths;
        if (yearSelected == currentYear) {
            enabledMonths = Object.keys(months)
                .filter((m) => parseInt(m) <= currentMonth)
                .map((m) => parseInt(m));
        } else {
            enabledMonths = Object.keys(months).map((m) => parseInt(m));
        }

        if (enabledMonths.length > 0) {
            const lastMonth = Math.max(...enabledMonths);

            setMonthSelected(lastMonth);
        }
    }, [yearSelected]);

    const format = "HH:mm";

    return (
        <AuthenticatedLayout>
            <Head title="Admin Settings" />

            <div className="container text-center">
                <h1>设置</h1>

                <div className="card" id="transaction-adjustment">
                    <div className="card-body text-start p-4">
                        <h4 className="fw-bold mb-2">账目调整</h4>
                        <p>设置每月交易记录的开始日期与时间</p>

                        <div className="d-flex gap-5">
                            <Select
                                options={dateOptions}
                                styles={customStyles}
                                placeholder="选择日期"
                            />
                            <TimePicker
                                format={format}
                                className="form-control d-flex text-light w-auto"
                                placeholder="选择时间"
                            />
                        </div>
                        <div className="d-flex justify-content-end">
                            <button
                                type="button"
                                className="btn btn-success px-5 my-2 text-nowrap"
                            >
                                保存
                            </button>
                        </div>
                    </div>
                </div>

                <div className="card" id="complete-settings">
                    <div className="card-body text-start p-4">
                        <h4 className="fw-bold mb-2">结账设置</h4>
                        <p>调整维护费用与设置结账</p>
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
                                    onChange={(opt) =>
                                        setYearSelected(Number(opt.value))
                                    }
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
                                    onChange={(opt) =>
                                        setMonthSelected(Number(opt.value))
                                    }
                                    styles={customStyles}
                                    placeholder="选择月份"
                                />
                            </div>
                        </div>
                        <div className="d-none d-lg-flex flex-row flex-wrap gap-2 justify-content-end mb-3">
                            {Object.keys(displayManagement).map((year) => {
                                const allMonthsDisabled = Object.values(
                                    displayManagement[year] || {}
                                ).every((value) => value === false);

                                return (
                                    <button
                                        key={year}
                                        type="button"
                                        className={`btn btn-primary px-5 raised ${
                                            Number(yearSelected) ===
                                            Number(year)
                                                ? "active text-info"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setYearSelected(Number(year))
                                        }
                                        disabled={allMonthsDisabled}
                                    >
                                        {year}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="d-none d-lg-flex flex-row gap-2 justify-content-center">
                            {yearSelected &&
                                Object.keys(
                                    displayManagement[yearSelected] || {}
                                ).map((monthNum) => (
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
                                            currentMonth < monthNum &&
                                            true
                                        }
                                        onClick={() =>
                                            setMonthSelected(Number(monthNum))
                                        }
                                    >
                                        {monthMap[monthNum]}
                                    </button>
                                ))}
                        </div>
                        <div className="row mt-3">
                            {isLoading ? (
                                <div className="d-flex justify-content-center mt-5 gap-3">
                                    <Spin
                                        indicator={<LoadingOutlined spin />}
                                        size="large"
                                    />
                                    <h5>載入中...</h5>
                                </div>
                            ) : (
                                teams.map((team) => (
                                    <div className="col-12 col-lg-6">
                                        <TeamTransactionsCard
                                            key={team.id}
                                            teamName={team.name}
                                            cost={teamStats[team.id].cost}
                                            net={teamStats[team.id].net}
                                            chart={
                                                <AdminDashboardChart
                                                    isMobile={isMobile}
                                                    name={team.name}
                                                    data={[
                                                        {
                                                            x: "维护费用",
                                                            y: teamStats[
                                                                team.id
                                                            ].cost,
                                                        },
                                                        {
                                                            x: "净值余额",
                                                            y: teamStats[
                                                                team.id
                                                            ].net,
                                                        },
                                                    ]}
                                                />
                                            }
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
