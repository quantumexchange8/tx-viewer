import { ErrorIcon } from "./Icon";

export default function MessageModal({
    title,
    text,
    btnText,
    isOpen,
    onClose,
}) {
    if (!isOpen) return null;

    return (
        <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            tabIndex="-1"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{ maxWidth: "400px" }}>
                    <div className="d-flex m-3 gap-3 align-items-center">
                        <div className="d-flex align-items-center justify-content-center">
                            <ErrorIcon />
                        </div>
                        <div>
                            <div className="modal-header border-bottom-0 py-2">
                                <h4 className="modal-title">{title}</h4>
                            </div>
                            <div className="modal-body py-2">
                                <p style={{ fontSize: "16px" }}>{text}</p>
                            </div>
                            <div className="modal-footer border-top-0 p-0">
                                {/* <button className="btn btn-primary" onClick={onClose}>
                            {btnText}
                        </button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
