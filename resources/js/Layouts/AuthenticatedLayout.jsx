import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import {
    AccessIcon,
    CaculatorIcon,
    CalendarIcon,
    DisplayIcon,
    HomeIcon,
    SettingIcon,
    TeamIcon,
    TimeIcon,
} from "@/Components/Icon";
import { useMediaQuery } from "react-responsive";
import Countdown from "react-countdown";
import MessageModal from "@/Components/MessageModal";

export default function AuthenticatedLayout({ header, children, settings }) {
    const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
    const [hovered, setHovered] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [endTime, setEndTime] = useState(null); // To store the remaining time in localStorage

    const { auth } = usePage().props;
    const user = auth.user;
    const roles = auth.roles;

    const isAdmin = roles.includes("admin");

    useEffect(() => {
        let storedEndTime = localStorage.getItem("countdownEndTime");
        if (storedEndTime) {
            setEndTime(parseInt(storedEndTime));
        }

        if (!isAdmin && settings.time_management && !storedEndTime) {
            const endTime = Date.now() + settings.time_management * 60 * 1000;
            localStorage.setItem("countdownEndTime", endTime);
            setEndTime(parseInt(endTime));
        }
    }, []);

    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) return null;

        // Convert total time into just minutes
        const totalMinutes = days * 24 * 60 + hours * 60 + minutes;
        const paddedSeconds = String(seconds).padStart(2, "0");

        return (
            <div
                style={{ fontSize: "16px", fontWeight: "bold" }}
                className="text-nowrap"
            >
                {totalMinutes}:{paddedSeconds}
            </div>
        );
    };

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const handleLogout = (e) => {
        if (e) {
            e.preventDefault();
        }
        localStorage.removeItem("countdownEndTime"); // clean up
        router.post("/logout");
    };

    return (
        <>
            <header className="top-header">
                <nav className="navbar navbar-expand align-items-center gap-4">
                    <ul className="navbar-nav gap-1 nav-right-links align-items-center w-100 justify-content-between">
                        <li className="nav-item gap-1 gap-lg-5">
                            <img
                                src="/asset/images/logo-icon.png"
                                width={40}
                                height={30}
                            ></img>
                            {isAdmin ? (
                                <Link
                                    href={route("admin.dashboard")}
                                    className="py-1 px-3"
                                >
                                    <div className="d-flex gap-2 text-white align-items-center">
                                        <HomeIcon /> {isMobile ? "" : "首页"}
                                    </div>
                                </Link>
                            ) : (
                                ""
                            )}
                        </li>

                        <li className="nav-item gap-3">
                            {isAdmin ? (
                                <div className="position-relative">
                                    <button
                                        type="button"
                                        className={`btn ${
                                            !isMobile ? "btn-outline-light" : ""
                                        } text-nowrap border-1 btn-circle d-flex gap-2 ${
                                            isExpanded
                                                ? "bg-white text-black"
                                                : ""
                                        }`}
                                        onMouseEnter={() => setHovered(true)}
                                        onMouseLeave={() => {
                                            if (!isExpanded) {
                                                setHovered(false);
                                            }
                                        }}
                                        onClick={() => {
                                            const nextExpanded = !isExpanded;
                                            setIsExpanded(nextExpanded);
                                            if (isMobile) {
                                                setHovered(nextExpanded); // Keep black icon on mobile when expanded
                                            }
                                        }}
                                    >
                                        <SettingIcon
                                            color={
                                                isExpanded || hovered
                                                    ? "black"
                                                    : "white"
                                            }
                                        />
                                        {!isMobile ? (
                                            <p className="m-0 p-0">设置</p>
                                        ) : (
                                            ""
                                        )}
                                    </button>

                                    <ul
                                        className={`dropdown-menu dropdown-menu-start text-center ${
                                            isExpanded ? "show" : ""
                                        } mt-2`}
                                        style={{ right: "1px" }}
                                    >
                                        <li className="">
                                            <Link
                                                className="dropdown-item d-flex gap-2 align-items-center"
                                                href={`${route(
                                                    "admin.settings"
                                                )}#time-management`}
                                            >
                                                <TimeIcon />
                                                时间管理
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                className="dropdown-item d-flex gap-2 align-items-center"
                                                href={`${route(
                                                    "admin.settings"
                                                )}#access-management`}
                                            >
                                                <AccessIcon />
                                                开放权限
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                className="dropdown-item d-flex gap-2 align-items-center"
                                                href={`${route(
                                                    "admin.settings"
                                                )}#display-management`}
                                            >
                                                <DisplayIcon />
                                                显示权限
                                            </Link>
                                        </li>
                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>
                                        <li>
                                            <Link
                                                className="dropdown-item d-flex gap-2 align-items-center"
                                                href={route(
                                                    "admin.teamSettings"
                                                )}
                                            >
                                                <TeamIcon />
                                                组别信息
                                            </Link>
                                        </li>
                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>
                                        <li>
                                            <Link
                                                className="dropdown-item d-flex gap-2 align-items-center"
                                                href={`${route(
                                                    "admin.transactionSettings"
                                                )}#transaction-adjustment`}
                                            >
                                                <CalendarIcon />
                                                账目调整
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                className="dropdown-item d-flex gap-2 align-items-center"
                                                href="#"
                                            >
                                                <CaculatorIcon />
                                                结账设置
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            ) : (
                                endTime && (
                                    <Countdown
                                        date={endTime}
                                        renderer={renderer}
                                        onComplete={() => {
                                            openModal();
                                            setTimeout(() => {
                                                handleLogout();
                                            }, 3000);
                                        }}
                                    />
                                )
                            )}

                            <a
                                className="logout-btn d-flex align-items-center gap-2 py-2 px-3"
                                href="#"
                                onClick={handleLogout}
                            >
                                <i className="material-icons-outlined text-danger">
                                    power_settings_new
                                </i>
                                {isMobile ? "" : "退出"}
                            </a>
                        </li>
                    </ul>
                </nav>
            </header>

            <main className="main-wrapper">
                <div
                    className="main-content px-4 px-lg-5 mx-auto"
                    style={{ maxWidth: "1300px" }}
                >
                    {children}
                    <MessageModal
                        title="时间到！"
                        text="您将会被强制登出"
                        btnText="好"
                        isOpen={isOpen}
                        onClose={closeModal}
                    />
                </div>
            </main>
        </>
    );
}
