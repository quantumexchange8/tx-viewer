import { Link } from "@inertiajs/react";
import { router } from "@inertiajs/react";

export default function ErrorPage() {
    const handleLogout = (e) => {
        if (e) {
            e.preventDefault();
        }
        localStorage.removeItem("countdownEndTime"); // clean up
        router.post("/logout");
    };

    return (
        <div className="pt-5">
            <div className="container pt-5">
                <div className="row pt-5">
                    <div className="col-lg-12">
                        <div className="text-center error-pages">
                            <h2 className="error-sub-title text-white">
                                禁止访问系统
                            </h2>

                            <p className="error-message text-white text-uppercase">
                                管理者已禁止访客于此时段访问系统，请稍后再试。
                            </p>

                            <div className="mt-4 d-flex align-items-center justify-content-center gap-3">
                                <Link
                                    href="#"
                                    className="btn btn-primary"
                                    onClick={handleLogout}
                                >
                                    <i className="bi bi-house-fill me-2"></i>
                                    返回登陆
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
