import React from "react";
import Chart from "react-apexcharts";

const DashboardChart = ({ isMobile, name, data }) => {
    const options = {
        chart: {
            //width:150,
            height: 120,
            type: "bar",
            sparkline: {
                enabled: !0,
            },
            zoom: {
                enabled: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: 1,
            curve: "smooth",
            color: ["transparent"],
        },
        fill: {
            type: "gradient",
            gradient: {
                shade: "dark",
                gradientToColors: ["#7928ca"],
                shadeIntensity: 1,
                type: "vertical",
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100, 100, 100],
            },
        },
        colors: ["#ff0080"],
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 4,
                borderRadiusApplication: "around",
                borderRadiusWhenStacked: "last",
                columnWidth: "45%",
            },
        },

        tooltip: {
            theme: "dark",
            fixed: {
                enabled: !1,
            },
            x: {
                show: !1,
            },
            y: {
                title: {
                    formatter: function (e) {
                        return "";
                    },
                },
            },
            marker: {
                show: !1,
            },
        },
        xaxis: {
            categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
            ],
        },
    };

    const series = [
        {
            name: name,
            data: data,
        },
    ];

    return (
        <div id="chart4">
            <Chart
                options={options}
                series={series}
                type="area"
                width={isMobile ? "80%" : "50%"}
                height={isMobile ? "80%" : "50%"}
            />
        </div>
    );
};

export { DashboardChart };
