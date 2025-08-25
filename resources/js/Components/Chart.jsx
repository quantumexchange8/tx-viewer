import React, { useMemo } from "react";
import Chart from "react-apexcharts";
import dayjs from "dayjs";
import "dayjs/locale/zh-tw"; // 繁體中文

dayjs.locale("zh-tw");

const TeamDashboardChart = ({ isMobile, name, data, months }) => {
    if (!months || months.length === 0 || !data) {
        return <div></div>;
    }

    const options = useMemo(
        () => ({
            chart: {
                type: "area",
                sparkline: { enabled: true },
                animations: {
                    enabled: true,
                    easing: "easeinout",
                    speed: 1000,
                    animateGradually: {
                        enabled: false,
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 800,
                    },
                },
            },
            stroke: {
                width: 1.5,
                curve: "smooth",
            },
            colors: ["#ff0080"],
            fill: {
                type: "gradient",
                gradient: {
                    shade: "dark",
                    gradientToColors: ["#7928ca"],
                    shadeIntensity: 1,
                    type: "vertical",
                    opacityFrom: 0.9,
                    opacityTo: 0.9,
                    stops: [0, 100],
                },
            },
            dataLabels: { enabled: false },
            xaxis: {
                categories: months.map((month) =>
                    dayjs(month, "YYYY-MM").format("MMM YYYY")
                ),
                labels: { show: true },
            },
            tooltip: {
                theme: "dark",
                x: { show: true },
                y: { title: { formatter: () => "" } },
                marker: { show: false },
            },
        }),
        [months]
    );

    const series = [
        {
            name: name,
            data: data || [],
        },
    ];

    return (
        <div id="chart4">
            <Chart
                key={isMobile ? "mobile" : "desktop"} // 👈 force remount when screen size changes
                options={options}
                series={series}
                type="area"
                width={isMobile ? "70%" : "130px"}
                height={isMobile ? "60px" : "80px"}
            />
        </div>
    );
};

const AdminDashboardChart = ({ isMobile, teamName, data }) => {
    const options = useMemo(() => ({
        chart: {
            type: "area",
            sparkline: { enabled: true },
            animations: {
                enabled: true,
                easing: "easeinout",
                speed: 1000,
                animateGradually: {
                    enabled: false,
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 800,
                },
            },
        },
        stroke: {
            width: 1.5,
            curve: "smooth",
        },
        colors: ["#ff0080"],
        fill: {
            type: "gradient",
            gradient: {
                shade: "dark",
                gradientToColors: ["#7928ca"],
                shadeIntensity: 1,
                type: "vertical",
                opacityFrom: 0.9,
                opacityTo: 0.9,
                stops: [0, 100],
            },
        },
        dataLabels: { enabled: false },
        // xaxis: {
        //     categories: months.map((month) =>
        //         dayjs(month, "YYYY-MM").format("MMM YYYY")
        //     ),
        //     labels: { show: true },
        // },
        tooltip: {
            theme: "dark",
            x: { show: true },
            y: { title: { formatter: () => "" } },
            marker: { show: false },
        },
    }));

    const series = [
        {
            name: teamName,
            data: data || [],
        },
    ];

    return (
        <div id="chart4">
            <Chart
                key={isMobile ? "mobile" : "desktop"}
                options={options}
                series={series}
                type="area"
                width={isMobile ? "70%" : "130px"}
                height={isMobile ? "60px" : "80px"}
            />
        </div>
    );
};

export { TeamDashboardChart, AdminDashboardChart };
