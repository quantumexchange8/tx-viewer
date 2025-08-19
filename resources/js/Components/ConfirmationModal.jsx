import { AlertIcon } from "./Icon";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export default function ConfirmationModal({
    title,
    text,
    onClose,
    setIsConfirm,
    isLoading,
    errorMessage,
}) {
    return (
        <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            tabIndex="-1"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{ maxWidth: "400px" }}>
                    {isLoading ? (
                        <div className="p-5">
                            <Spin
                                indicator={<LoadingOutlined spin />}
                                size="large"
                            />
                        </div>
                    ) : (
                        <>
                            <div className="d-flex justify-content-end">
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
                            <div className="d-flex flex-column align-items-center">
                                <div className="d-flex align-items-center justify-content-center">
                                    <AlertIcon />
                                </div>
                                <div>
                                    <div className="modal-header justify-content-center border-bottom-0 p-0">
                                        <h4 className="modal-title">{title}</h4>
                                    </div>
                                    <div className="modal-body text-center py-2">
                                        <p style={{ fontSize: "16px" }}>
                                            {text}
                                        </p>
                                    </div>
                                </div>
                                <div className="d-md-flex d-grid align-items-center justify-content-center gap-3 pb-4">
                                    {errorMessage == "" ? (
                                        <button
                                            type="button"
                                            className="btn btn-grd btn-danger px-4"
                                            onClick={() => {
                                                setIsConfirm(true);
                                            }}
                                        >
                                            确定
                                        </button>
                                    ) : (
                                        ""
                                    )}

                                    <button
                                        type="button"
                                        className="btn btn-outline-info px-4"
                                        onClick={onClose}
                                    >
                                        {errorMessage == "" ? "取消" : "关闭"}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
