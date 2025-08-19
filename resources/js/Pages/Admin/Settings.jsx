import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { message } from "antd";

export default function Settings({ settings, years }) {
    const [timeLimit, setTimeLimit] = useState("");
    const [accessDays, setAccessDays] = useState({
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true,
    });
    const [saved, setSaved] = useState(false);
    const [saveError, setSaveError] = useState(false);

    const [selectedRange, setSelectedRange] = useState([null, null]);
    const [addedTimeRanges, setAddedTimeRanges] = useState([]);

    const [yearSelected, setYearSelected] = useState("");
    const [displayManagement, setDisplayManagement] = useState([]);

    const dayMap = {
        monday: "星期一",
        tuesday: "星期二",
        wednesday: "星期三",
        thursday: "星期四",
        friday: "星期五",
        saturday: "星期六",
        sunday: "星期日",
    };

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

    const format = "HH:mm";

    const [messageApi, contextHolder] = message.useMessage();

    console.log("years: ", years);

    useEffect(() => {
        if (settings) {
            setTimeLimit(settings.time_management || "");
            setAccessDays(JSON.parse(settings.access_days));
            setAddedTimeRanges(
                (() => {
                    try {
                        const arr = JSON.parse(settings.access_times) || [];
                        return arr.map(([start, end]) => [
                            dayjs(start),
                            dayjs(end),
                        ]);
                    } catch {
                        return [];
                    }
                })()
            );
            setDisplayManagement(JSON.parse(settings.display_management));
        }

        if (years) {
            setYearSelected(years[0] || "");
        }
    }, []);

    console.log("display management: ", displayManagement);

    useEffect(() => {
        if (saved) {
            messageApi.open({
                type: "success",
                content: "设置保存成功！",
            });
            setSaved(false);
        }
    }, [saved]);

    useEffect(() => {
        if (saveError) {
            messageApi.open({
                type: "error",
                content: "设置保存失败！",
            });
            setSaveError(false);
        }
    }, [saveError]);

    const handleCheckboxChange = (day) => {
        setAccessDays((prev) => ({ ...prev, [day]: !prev[day] }));
    };

    const disableMonth = (e) => {
        const month = Object.keys(monthMap).find(
            (key) => monthMap[key] === e.target.textContent
        );
        if (month) {
            setDisplayManagement((prev) => ({
                ...prev,
                [yearSelected]: {
                    ...prev[yearSelected],
                    [month]: !prev[yearSelected][month],
                },
            }));
        }
    };

    const saveAll = () => {
        console.log("access day: ", accessDays);
        router.post(
            route("admin.settings.save"),
            {
                time_management: timeLimit,
                access_days: accessDays,
                access_times: addedTimeRanges,
                display_management: displayManagement,
            },
            {
                onSuccess: () => {
                    console.log("Settings saved successfully!");
                    setSaved(true);
                },
                onError: (errors) => {
                    console.error("Failed to save settings:", errors);
                    setSaveError(true);
                },
            }
        );
    };

    const formatTimeRange = (start, end) => {
        return `${start.format(format)} - ${end.format(format)}`;
    };

    const handleAddTime = () => {
        if (selectedRange.length === 2) {
            const start = selectedRange[0];
            const end = selectedRange[1];

            if (start !== null && end !== null) {
                // Check overlap with existing ranges
                const hasOverlap = addedTimeRanges.some(([tStart, tEnd]) => {
                    return start.isBefore(tEnd) && end.isAfter(tStart);
                });

                if (!hasOverlap) {
                    setAddedTimeRanges([...addedTimeRanges, [start, end]]);
                } else {
                    console.warn("Overlapping range detected!");
                }

                // Reset selection
                setSelectedRange([]);
            }
        }
    };

    const handleRemove = (id) => {
        setAddedTimeRanges((prev) => prev.filter((_, index) => index !== id));
    };

    const disabledTime = (current, type) => {
        if (!Array.isArray(addedTimeRanges)) {
            return {};
        }
        const disabledHours = new Set();
        const disabledMinutes = new Set();

        if (type === "start") {
            // Disable all hours that fall within existing ranges
            addedTimeRanges.forEach(([start, end]) => {
                let hour = start.hour();
                while (hour <= end.hour()) {
                    disabledHours.add(hour);
                    hour++;
                }
            });
        }

        if (type === "end" && selectedRange[0]) {
            const startHour = selectedRange[0].hour();
            const startMinute = selectedRange[0].minute();

            // Disable hours before start
            for (let h = 0; h < startHour; h++) {
                disabledHours.add(h);
            }

            // Disable end hours that cause overlap
            addedTimeRanges.forEach(([rangeStart, rangeEnd]) => {
                // If the new start is within an existing range, limit end before overlap
                if (
                    startHour >= rangeStart.hour() &&
                    startHour <= rangeEnd.hour()
                ) {
                    let hour = rangeStart.hour();
                    while (hour <= rangeEnd.hour()) {
                        disabledHours.add(hour);
                        hour++;
                    }
                }

                // If range starts after our start time, prevent going into it
                if (rangeStart.hour() > startHour) {
                    let h = rangeStart.hour();
                    while (h <= 23) {
                        disabledHours.add(h);
                        h++;
                    }
                }
            });

            // Disable minutes before start minute (if same hour)
            if (startMinute >= 0 && !disabledHours.has(startHour)) {
                for (let m = 0; m <= startMinute; m++) {
                    disabledMinutes.add(m);
                }
                if (selectedRange[1] && selectedRange[1].hour() !== startHour) {
                    disabledMinutes.clear(); // no minutes disabled when the end hour not the same as start hour
                }
            }
        } else if (type === "end" && selectedRange.length === 0) {
            // If no range is selected, disable all hours
            for (let h = 0; h < 24; h++) {
                disabledHours.add(h);
            }
        }

        return {
            disabledHours: () => [...disabledHours],
            disabledMinutes: () => [...disabledMinutes],
        };
    };

    console.log("year selected:", yearSelected);

    const resetMonth = () => {
        if (!yearSelected) return; // No year selected

        setDisplayManagement((prev) => {
            const months = prev[yearSelected] || {};

            // Set all months to true
            const updatedMonths = Object.keys(months).reduce((acc, month) => {
                acc[month] = true;
                return acc;
            }, {});

            return {
                ...prev,
                [yearSelected]: updatedMonths,
            };
        });
    };

    const disableAllMonth = () => {
        if (!yearSelected) return; // No year selected

        setDisplayManagement((prev) => {
            const months = prev[yearSelected] || {};

            // Set all months to true
            const updatedMonths = Object.keys(months).reduce((acc, month) => {
                acc[month] = false;
                return acc;
            }, {});

            return {
                ...prev,
                [yearSelected]: updatedMonths,
            };
        });
    };

    return (
        <>
            {contextHolder}

            <AuthenticatedLayout>
                <Head title="Admin Settings" />
                <div className="container text-center ">
                    <h1>设置</h1>
                    <div className="d-flex justify-content-end">
                        <button
                            type="button"
                            className="btn btn-success px-5 my-2 text-nowrap"
                            onClick={saveAll}
                        >
                            保存
                        </button>
                    </div>
                    <div className="card" id="time-management">
                        <div className="card-body text-start p-4">
                            <h4 className="fw-bold mb-2">时间管理</h4>

                            <p>设置组别用户单次登录的允许时长</p>

                            <div className="row">
                                <div className="col-12">
                                    <input
                                        className="form-control"
                                        type="number"
                                        placeholder="分钟"
                                        min={1}
                                        name="timeLimit"
                                        value={timeLimit}
                                        onChange={(e) =>
                                            setTimeLimit(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card" id="access-management">
                        <div className="card-body text-start p-4">
                            <h4 className="fw-bold mb-2">开放权限</h4>
                            <p>
                                设置系统禁止访问时间，
                                组别用户将无法于设置时间内访问系统
                            </p>

                            <div className="row mt-4">
                                <div className="col-12 col-lg-3 d-flex flex-column align-items-center gap-3">
                                    {Object.keys(accessDays).map((day) => (
                                        <div
                                            key={day}
                                            className="form-check form-switch form-check-danger"
                                        >
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={!accessDays[day]}
                                                role="switch"
                                                onChange={() =>
                                                    handleCheckboxChange(day)
                                                }
                                                id={day}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor={day}
                                            >
                                                {dayMap[day]}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <div className="col-12 col-lg-9 mt-3 mt-lg-0">
                                    <div className="d-flex flex-column flex-md-row align-items-lg-center gap-3">
                                        <TimePicker.RangePicker
                                            format={format}
                                            // minuteStep={5}
                                            value={selectedRange}
                                            onCalendarChange={(values) => {
                                                setSelectedRange(values);
                                            }}
                                            disabledTime={disabledTime}
                                            placeholder={[
                                                "开始时间",
                                                "结束时间",
                                            ]}
                                            className="form-control d-flex text-light"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-success text-nowrap align-items-center justify-content-center px-4 d-flex gap-2"
                                            onClick={handleAddTime}
                                        >
                                            <i className="lni lni-plus"></i>
                                            添加
                                        </button>
                                    </div>

                                    <div className="my-3 fs-5 d-flex gap-2 justify-content-center justify-content-lg-start flex-wrap">
                                        {addedTimeRanges.map(
                                            ([start, end], index) => (
                                                <span
                                                    key={index}
                                                    className="badge bg-primary d-flex align-items-center"
                                                >
                                                    {formatTimeRange(
                                                        start,
                                                        end
                                                    )}
                                                    <span
                                                        className="close-btn mx-2"
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() =>
                                                            handleRemove(index)
                                                        } // pass index to remove
                                                    >
                                                        &#10006;
                                                    </span>
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card" id="display-management">
                        <div className="card-body text-start p-4">
                            <h4 className="fw-bold mb-2">显示权限</h4>
                            <p>
                                设置禁止图表显示的年份和月份，组别用户将无法查看被禁止年份或月份的图表数据
                            </p>
                            <div></div>
                            <div className="row mt-4">
                                <div className="col-12 col-lg-3 d-flex flex-column align-items-center gap-3">
                                    {Object.keys(displayManagement).map(
                                        (year) => (
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
                                                    setYearSelected(year)
                                                }
                                            >
                                                {year}
                                            </button>
                                        )
                                    )}
                                </div>

                                <div className="col-12 col-lg-9 mt-3 mt-lg-0 d-flex flex-column align-items-center align-items-lg-end gap-3">
                                    <div className="d-flex flex-column flex-md-row align-items-lg-center gap-3 mb-3">
                                        <button
                                            type="button"
                                            className="btn btn-outline-info align-items-center justify-content-center px-4 d-flex gap-2"
                                            onClick={resetMonth}
                                        >
                                            <i className="lni lni-spinner-arrow"></i>
                                            重置
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary align-items-center justify-content-center text-wrap px-4 d-flex gap-2"
                                            onClick={disableAllMonth}
                                        >
                                            <i className="material-icons-outlined">
                                                event
                                            </i>
                                            全部禁止
                                        </button>
                                    </div>
                                    <div className="row">
                                        {yearSelected &&
                                            Object.keys(
                                                displayManagement[
                                                    yearSelected
                                                ] || {}
                                            ).map((monthNum) => (
                                                <div
                                                    key={monthNum}
                                                    className="col-lg-2 col-md-3 col-6"
                                                >
                                                    <button
                                                        key={monthNum}
                                                        type="button"
                                                        className={`btn btn-outline-info text-nowrap px-3 me-2 mb-2 w-100 ${
                                                            displayManagement[
                                                                yearSelected
                                                            ][monthNum] ==
                                                                false &&
                                                            "bg-transparent text-secondary border-secondary"
                                                        }`}
                                                        onClick={disableMonth}
                                                    >
                                                        {monthMap[monthNum]}
                                                    </button>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <div className="card" id="team-management">
                        <div className="card-body text-start p-4">
                            <h4 className="fw-bold mb-2">组别信息</h4>

                            <div className="row">
                                <div className="col-12">
                                    <input
                                        className="form-control"
                                        type="number"
                                        placeholder="分钟"
                                    />
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </AuthenticatedLayout>
        </>
    );
}
