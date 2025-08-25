import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Table } from "antd";
import FormModal from "@/Components/FormModal";
import { EditIcon, RemoveIcon } from "@/Components/Icon";
import ConfirmationModal from "@/Components/ConfirmationModal";
import { message } from "antd";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export default function TeamSettings({ teamLeaderOpt }) {
    const [isOpen, setIsOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState("");
    const [teams, setTeams] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirm, setIsConfirm] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [saved, setSaved] = useState(false);
    const [saveError, setSaveError] = useState(false);
    const [savedMessage, setSavedMessage] = useState("");
    const [mode, setMode] = useState("");

    const columns = [
        {
            title: () => (
                <div>
                    <p className="h5">名称</p>
                </div>
            ),
            key: "name",
            render: (_, team) => (
                <div>
                    <p className="h6">{team.name}</p>
                    <p className="mb-0">
                        {new Date(team.created_at).toLocaleDateString("en-GB")}
                    </p>
                </div>
            ),
        },
        {
            title: () => (
                <div className="text-center">
                    <p className="h5">组长</p>
                </div>
            ),
            dataIndex: "leader", // leader is the relationship
            key: "leader_name",
            render: (leader) => (
                <div className="text-center">
                    <p className="h6">
                        {leader
                            ? [
                                  leader.first_name,
                                  leader.middle_name,
                                  leader.last_name,
                              ]
                                  .filter(Boolean) // removes null, undefined, empty string
                                  .join(" ")
                            : "-"}
                    </p>
                </div>
            ),
        },
        {
            title: () => (
                <div className="text-center">
                    <p className="h5">人数</p>
                </div>
            ),
            dataIndex: "team_has_users_count",
            key: "member_number",
            render: (number) => (
                <div className="text-center">
                    <p className="h6">{number}</p>
                </div>
            ),
        },
        {
            key: "action",
            render: (_, team) => (
                <div className="d-flex gap-2 justify-content-center">
                    <div
                        className="cursor-pointer"
                        onClick={() => {
                            setSelectedTeam(team.id);
                            setData({
                                teamName: team.name || "",
                                loginID:
                                    team.account_user.login_id?.toString() ||
                                    "",
                                password: "", // leave blank on edit
                                password_confirmation: "",
                                teamLeaderID:
                                    team.team_leader_id?.toString() || "",
                            });

                            setIsOpen(true);
                            setMode("edit");
                        }}
                    >
                        <EditIcon />
                    </div>
                    <div
                        className="cursor-pointer"
                        onClick={() => {
                            setConfirmModalOpen(true);
                            setSelectedTeam(team.id);
                        }}
                    >
                        <RemoveIcon />
                    </div>
                </div>
            ),
        },
    ];

    const EMPTY_FORM = {
        teamName: "",
        loginID: "",
        password: "",
        password_confirmation: "",
        teamLeaderID: "",
    };

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        setDefaults,
        clearErrors,
    } = useForm(EMPTY_FORM);

    const fetchTeams = async () => {
        setIsLoading(true);

        try {
            const response = await axios.get("/admin/getAllTeams");
            setTeams(response.data);
        } catch (error) {
            console.error("error", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    useEffect(() => {
        if (saved) {
            messageApi.open({
                type: "success",
                content: savedMessage,
            });
            setSaved(false);
        }
    }, [saved]);

    useEffect(() => {
        if (saveError) {
            messageApi.open({
                type: "error",
                content: savedMessage,
            });
            setSaveError(false);
        }
    }, [saveError]);

    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if (isConfirm === true) {
            setIsLoading(true);

            router.post(
                route("admin.removeTeam"),
                {
                    teamID: selectedTeam,
                },
                {
                    onSuccess: () => {
                        setIsLoading(false);
                        setConfirmModalOpen(!confirmModalOpen);
                        setIsConfirm(false);
                        setSaved(true);
                        setSavedMessage("组别删除成功");
                        fetchTeams();
                    },
                    onError: () => {
                        setErrorMessage("删除组别失败!请重试");
                        setIsLoading(false);
                        setIsConfirm(false);
                        setSaveError(true);
                        setSavedMessage("组别删除失败");
                    },
                }
            );
        }
    }, [isConfirm]);

    const addTeam = async () => {
        setIsLoading(true);
        post(route("admin.addTeam"), {
            onSuccess: () => {
                setIsOpen(false);
                setIsLoading(false);
                setSaved(true);
                setSavedMessage("组别添加成功");
                fetchTeams();
                setDefaults(EMPTY_FORM);
                reset();
            },
            onError: () => {
                setIsLoading(false);
                setSaveError(true);
                setSavedMessage("组别添加失败");
            },
        });
    };

    const updateTeam = async () => {
        setIsLoading(true);
        post(route("admin.updateTeam", { team: selectedTeam }), {
            onSuccess: () => {
                setIsOpen(false);
                setIsLoading(false);
                setSaved(true);
                setSavedMessage("组别资料更改成功");
                fetchTeams();
                setDefaults(EMPTY_FORM);
                reset();
            },
            onError: () => {
                setIsLoading(false);
                setSaveError(true);
                setSavedMessage("组别资料更改失败");
            },
        });
    };

    const hardReset = () => {
        setDefaults(EMPTY_FORM);
        reset();
        clearErrors();
    };

    const onClose = () => {
        setIsOpen(!isOpen);
        hardReset();
    };

    const onConfirmModalClose = () => {
        setConfirmModalOpen(!confirmModalOpen);
        setErrorMessage("");
    };

    let foundTeamName;
    let team;

    if (selectedTeam) {
        team = teams.find((team) => team.id === selectedTeam);
        foundTeamName = team?.name || "未知组别";
    }

    return (
        <>
            {contextHolder}

            <AuthenticatedLayout>
                <Head title="Admin Settings" />
                <div className="container text-center ">
                    <h1>设置</h1>
                    <div className="card" id="time-management">
                        <div className="card-body text-start p-4">
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
                                    <div className="d-flex flex-column flex-md-row align-items-lg-center justify-content-between gap-3">
                                        <h4 className="fw-bold mb-0">
                                            组别信息
                                        </h4>
                                        <button
                                            type="button"
                                            className="btn btn-outline-success text-nowrap align-items-center justify-content-center px-4 d-flex gap-2"
                                            onClick={() => {
                                                hardReset(); // empty form
                                                setIsOpen(!isOpen);
                                                setMode("add");
                                            }}
                                        >
                                            <i className="lni lni-plus"></i>
                                            添加
                                        </button>
                                    </div>
                                    <Table
                                        className="mt-3 text-light"
                                        rowKey="id"
                                        columns={columns}
                                        dataSource={isLoading ? [] : teams}
                                        pagination={{
                                            position: ["bottomCenter"],
                                            defaultPageSize: 8,
                                            showQuickJumper: false,
                                            total: teams.length,
                                            showTotal: (total, range) =>
                                                `显示第${range[0]}-${range[1]}项， 共${total}项`,
                                        }}
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    {isOpen ? (
                        <FormModal
                            mode={mode} // <-- add this
                            onClose={onClose}
                            isLoading={isLoading}
                            teamLeaderOpt={teamLeaderOpt}
                            data={data}
                            setData={setData}
                            errors={errors}
                            reset={hardReset}
                            updateTeam={updateTeam}
                            addTeam={addTeam}
                        />
                    ) : (
                        ""
                    )}
                    {confirmModalOpen ? (
                        <ConfirmationModal
                            title={errorMessage ? "删除失败" : "请确认"}
                            text={
                                errorMessage
                                    ? errorMessage
                                    : `您即将删除${foundTeamName}组别!`
                            }
                            errorMessage={errorMessage}
                            onClose={onConfirmModalClose}
                            setIsConfirm={setIsConfirm}
                            isLoading={isLoading}
                        />
                    ) : (
                        ""
                    )}
                </div>
            </AuthenticatedLayout>
        </>
    );
}
