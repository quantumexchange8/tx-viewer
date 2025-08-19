import { DashboardChart } from "@/Components/Chart";
import TeamCard from "@/Components/AdminDashboardCard";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useMediaQuery } from "react-responsive";

export default function Dashboard({ teams, transactions }) {
    const isMobile = useMediaQuery({ query: "(max-width: 991px)" });

    console.log(teams, transactions, isMobile);

    let teamTransactions = {};
    let deposit = {},
        withdrawal = {},
        balance = {},
        cost = {},
        net = {};
    const percentage = 10;

    Object.keys(transactions).map((year) => {
        teams.forEach((team) => {
            // Filter transactions that match any user_id in this team
            const filtered = transactions[year].filter((transaction) =>
                team.team_has_users.some(
                    (u) => u.user_id === transaction.user_id
                )
            );

            if (filtered.length > 0) {
                // Store grouped by year + team
                if (!teamTransactions[year]) {
                    teamTransactions[year] = {};
                }

                teamTransactions[year][team.name] = filtered;
                deposit[team.name] = 0;
                withdrawal[team.name] = 0;
                balance[team.name] = 1000.0;
                cost[team.name] = 0;
                net[team.name] = 0;

                filtered.forEach((row) => {
                    if (row.transaction_type === "deposit") {
                        deposit[team.name] += parseFloat(
                            row.transaction_amount
                        );
                    } else if (row.transaction_type === "withdrawal") {
                        withdrawal[team.name] += parseFloat(
                            row.transaction_amount
                        );
                    }
                });

                // format deposit & withdrawal to 2 decimals
                deposit[team.name] = Math.round(deposit[team.name] * 100) / 100;
                withdrawal[team.name] =
                    Math.round(withdrawal[team.name] * 100) / 100;

                cost[team.name] =
                    Math.round((percentage / 100) * deposit[team.name] * 100) /
                    100;

                net[team.name] =
                    Math.round(
                        (deposit[team.name] +
                            balance[team.name] -
                            cost[team.name] -
                            withdrawal[team.name]) *
                            100
                    ) / 100;
            }
        });
    });

    console.log(
        "money: ",
        deposit,
        withdrawal,
        balance,
        cost,
        net,
        teamTransactions
    );

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Admin Dashboard" />
                <div className="row">
                    {teams.map((team) => (
                        <TeamCard
                            key={team.id}
                            teamName={team.name}
                            deposit={deposit[team.name]}
                            withdrawal={withdrawal[team.name]}
                            balance={balance[team.name]}
                            cost={cost[team.name]}
                            net={net[team.name]}
                            chart={
                                <DashboardChart
                                    isMobile={isMobile}
                                    name={team.name}
                                    data={[
                                        { x: "Deposit", y: deposit[team.name] },
                                        {
                                            x: "Withdrawal",
                                            y: withdrawal[team.name],
                                        },
                                        { x: "Balance", y: balance[team.name] },
                                        { x: "Cost", y: cost[team.name] },
                                        { x: "Net", y: net[team.name] },
                                    ]}
                                />
                            }
                        />
                    ))}
                </div>
            </AuthenticatedLayout>
        </>
    );
}
