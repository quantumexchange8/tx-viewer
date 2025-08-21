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

                teamTransactions[year][team.id] = filtered;
                deposit[team.id] = 0;
                withdrawal[team.id] = 0;
                balance[team.id] = 1000.0;
                cost[team.id] = 0;
                net[team.id] = 0;

                filtered.forEach((row) => {
                    if (row.transaction_type === "deposit") {
                        deposit[team.id] += parseFloat(row.transaction_amount);
                    } else if (row.transaction_type === "withdrawal") {
                        withdrawal[team.id] += parseFloat(
                            row.transaction_amount
                        );
                    }
                });

                // format deposit & withdrawal to 2 decimals
                deposit[team.id] = Math.round(deposit[team.id] * 100) / 100;
                withdrawal[team.id] =
                    Math.round(withdrawal[team.id] * 100) / 100;

                cost[team.id] =
                    Math.round((percentage / 100) * deposit[team.id] * 100) /
                    100;

                net[team.id] =
                    Math.round(
                        (deposit[team.id] +
                            balance[team.id] -
                            cost[team.id] -
                            withdrawal[team.id]) *
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
                            deposit={deposit[team.id]}
                            withdrawal={withdrawal[team.id]}
                            balance={balance[team.id]}
                            cost={cost[team.id]}
                            net={net[team.id]}
                            chart={
                                <DashboardChart
                                    isMobile={isMobile}
                                    name={team.id}
                                    data={[
                                        { x: "Deposit", y: deposit[team.id] },
                                        {
                                            x: "Withdrawal",
                                            y: withdrawal[team.id],
                                        },
                                        { x: "Balance", y: balance[team.id] },
                                        { x: "Cost", y: cost[team.id] },
                                        { x: "Net", y: net[team.id] },
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
