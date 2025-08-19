import PasswordInput from "./PasswordInput";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import Select from "react-select";

export default function FormModal({
    mode = "add",
    onClose,
    teamLeaderOpt,
    data,
    setData,
    errors,
    reset,
    isLoading,
    updateTeam,
    addTeam,
}) {
    const options = teamLeaderOpt.map((opt) => {
        const fullName = [opt.first_name, opt.middle_name, opt.last_name]
            .filter(Boolean) // removes null or ""
            .join(" ");

        return {
            value: String(opt.id),
            label: fullName,
        };
    });

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
            color: "#fff",
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

    return (
        <>
            <div
                className="modal fade show"
                style={{
                    display: "block",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
                id="FormModal"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        {isLoading ? (
                            <div className="p-5">
                                <Spin
                                    indicator={<LoadingOutlined spin />}
                                    size="large"
                                />
                            </div>
                        ) : (
                            <>
                                <div className="modal-header border-bottom-0 py-2 bg-grd-info">
                                    <h5 className="modal-title">新组别</h5>
                                    <button
                                        onClick={onClose}
                                        className="primaery-menu-close bg-transparent border-0"
                                        data-bs-dismiss="modal"
                                    >
                                        <i className="material-icons-outlined">
                                            close
                                        </i>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-body">
                                        <form className="row g-3">
                                            <div className="col-md-12">
                                                <label
                                                    htmlFor="teamName"
                                                    className="form-label"
                                                >
                                                    组别名称
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="teamName"
                                                    name="teamName"
                                                    value={data.teamName}
                                                    onChange={(e) =>
                                                        setData(
                                                            "teamName",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="输入组别名称"
                                                />
                                                {errors.teamName ? (
                                                    <span
                                                        className="invalid-feedback"
                                                        role="alert"
                                                    >
                                                        <strong>
                                                            {errors.teamName}
                                                        </strong>
                                                    </span>
                                                ) : (
                                                    ""
                                                )}
                                            </div>

                                            <div className="col-md-12">
                                                <label
                                                    htmlFor="loginID"
                                                    className="form-label"
                                                >
                                                    登录ID
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="loginID"
                                                    name="loginID"
                                                    placeholder="输入登录ID"
                                                    value={data.loginID}
                                                    onChange={(e) =>
                                                        setData(
                                                            "loginID",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                {errors.loginID ? (
                                                    <span
                                                        className="invalid-feedback"
                                                        role="alert"
                                                    >
                                                        <strong>
                                                            {errors.loginID}
                                                        </strong>
                                                    </span>
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                            <div className="col-md-12">
                                                <label
                                                    htmlFor="single-select-field"
                                                    className="form-label"
                                                >
                                                    选择组长
                                                </label>

                                                <Select
                                                    options={options}
                                                    value={
                                                        options.length > 0
                                                            ? options.find(
                                                                  (o) =>
                                                                      String(
                                                                          o.value
                                                                      ) ===
                                                                      String(
                                                                          data.teamLeaderID
                                                                      )
                                                              ) || null
                                                            : null
                                                    }
                                                    onChange={(opt) =>
                                                        setData(
                                                            "teamLeaderID",
                                                            opt?.value ?? ""
                                                        )
                                                    }
                                                    styles={customStyles}
                                                    placeholder="选择组长"
                                                />

                                                {errors.teamLeaderID ? (
                                                    <span
                                                        className="invalid-feedback"
                                                        role="alert"
                                                    >
                                                        <strong>
                                                            {
                                                                errors.teamLeaderID
                                                            }
                                                        </strong>
                                                    </span>
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                            <div className="col-md-12">
                                                <label
                                                    htmlFor="password"
                                                    className="form-label"
                                                >
                                                    密码
                                                </label>
                                                <PasswordInput
                                                    data={data}
                                                    setData={setData}
                                                    name="password"
                                                />
                                                {errors.password ? (
                                                    <span
                                                        className="invalid-feedback"
                                                        role="alert"
                                                    >
                                                        <strong>
                                                            {errors.password}
                                                        </strong>
                                                    </span>
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                            <div className="col-md-12">
                                                <label
                                                    htmlFor="password_confirmation"
                                                    className="form-label"
                                                >
                                                    确认密码
                                                </label>
                                                <PasswordInput
                                                    data={data}
                                                    setData={setData}
                                                    name="password_confirmation"
                                                />
                                            </div>

                                            <div className="col-md-12">
                                                <div className="d-md-flex d-grid align-items-center justify-content-center gap-3">
                                                    <button
                                                        type="button"
                                                        className="btn btn-grd btn-success px-4"
                                                        onClick={
                                                            mode === "add"
                                                                ? addTeam
                                                                : updateTeam
                                                        }
                                                    >
                                                        {mode === "add"
                                                            ? "添加"
                                                            : "更改"}
                                                    </button>
                                                    {mode === "add" && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary px-4"
                                                            onClick={() =>
                                                                reset()
                                                            }
                                                        >
                                                            重置
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
