import { AdminDashboardChart } from "@/Components/Chart";
import TeamCard from "@/Components/AdminDashboardCard";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useMediaQuery } from "react-responsive";
import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export default function Dashboard({ years, settings }) {
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
            const months = displayManagement[year] || {};

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

    console.log("transactions: ", transactions);
    console.log("teams: ", teams);

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Admin Dashboard" />

                {isLoading ? (
                    <div className="d-flex justify-content-center mt-5 gap-3">
                        <Spin
                            indicator={<LoadingOutlined spin />}
                            size="large"
                        />
                        <h5>載入中...</h5>
                    </div>
                ) : (
                    <>
                        <div className="d-flex justify-content-start gap-3">
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
                                        setYearSelected(opt.value)
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

                        <div className="row mt-4">
                            {teams.map((team) => (
                                <Link
                                    href={route("admin.adminDashboardDetails", {
                                        team: team.id,
                                    })}
                                    key={team.id}
                                >
                                    <TeamCard
                                        key={team.id}
                                        teamName={team.name}
                                        deposit={teamStats[team.id].deposit}
                                        withdrawal={
                                            teamStats[team.id].withdrawal
                                        }
                                        balance={teamStats[team.id].balance}
                                        cost={teamStats[team.id].cost}
                                        net={teamStats[team.id].net}
                                        chart={
                                            <AdminDashboardChart
                                                isMobile={isMobile}
                                                name={team.name}
                                                data={[
                                                    {
                                                        x: "存款",
                                                        y: teamStats[team.id]
                                                            .deposit,
                                                    },
                                                    {
                                                        x: "提款",
                                                        y: teamStats[team.id]
                                                            .withdrawal,
                                                    },
                                                    {
                                                        x: "当月余额",
                                                        y: teamStats[team.id]
                                                            .balance,
                                                    },
                                                    {
                                                        x: "维护费用",
                                                        y: teamStats[team.id]
                                                            .cost,
                                                    },
                                                    {
                                                        x: "净值余额",
                                                        y: teamStats[team.id]
                                                            .net,
                                                    },
                                                ]}
                                            />
                                        }
                                    />
                                </Link>
                            ))}
                        </div>
                    </>
                )}
            </AuthenticatedLayout>
        </>
    );
}
