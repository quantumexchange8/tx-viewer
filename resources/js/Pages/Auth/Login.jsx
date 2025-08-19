import Checkbox from "@/Components/Checkbox";
import LoginIDInput from "@/Components/LoginIDInput";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PasswordInput from "@/Components/PasswordInput";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        login_id: "",
        password: "",
    });

    const submit = (e) => {
        e.preventDefault();

        console.log("errors: ", data);

        post(route("login.user"), {
            onError: (errors) => {
                console.error("Validation errors:", errors);
            },
            onFinish: () => reset("password"),
        });
    };

    console.log("errors: ", errors);

    return (
        <GuestLayout>
            <Head title="Login" />
            <div className="section-authentication-cover">
                <div className="">
                    <div className="row g-0">
                        <div className="col-12 col-xl-7 col-xxl-8 auth-cover-left align-items-center justify-content-center d-none d-xl-flex border-end bg-transparent">
                            <div className="card rounded-0 mb-0 border-0 shadow-none bg-transparent bg-none">
                                <div className="card-body">
                                    <img
                                        src="asset/images/auth/login1.png"
                                        className="img-fluid auth-img-cover-login"
                                        width="650"
                                        alt=""
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-xl-5 col-xxl-4 auth-cover-right align-items-center justify-content-center border-top border-4 border-primary border-gradient-1">
                            <div className="card rounded-0 m-3 mb-0 border-0 shadow-none bg-none">
                                <div className="card-body p-sm-5">
                                    <img
                                        src="asset/images/logo1.png"
                                        className="mb-4"
                                        width="145"
                                        alt=""
                                    />
                                    <h4 className="fw-bold">Get Started Now</h4>
                                    <p className="mb-0">
                                        Enter your credentials to login your
                                        account
                                    </p>

                                    <div className="form-body mt-4">
                                        <form
                                            onSubmit={submit}
                                            className="row g-3"
                                        >
                                            <div className="col-12">
                                                <label
                                                    htmlFor="login_id"
                                                    className="form-label"
                                                >
                                                    登录ID
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </label>
                                                <LoginIDInput
                                                    data={data}
                                                    setData={setData}
                                                />

                                                {errors.login_id ? (
                                                    <span
                                                        className="invalid-feedback"
                                                        role="alert"
                                                    >
                                                        <strong>
                                                            {errors.login_id}
                                                        </strong>
                                                    </span>
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                            <div className="col-12">
                                                <label
                                                    htmlFor="password"
                                                    className="form-label"
                                                >
                                                    密码
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </label>
                                                <div
                                                    className="input-group"
                                                    id="show_hide_password"
                                                >
                                                    <PasswordInput
                                                        data={data}
                                                        setData={setData}
                                                    />

                                                    {errors.password ? (
                                                        <span
                                                            className="invalid-feedback"
                                                            role="alert"
                                                        >
                                                            <strong>
                                                                {
                                                                    errors.password
                                                                }
                                                            </strong>
                                                        </span>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="d-grid">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-grd-primary"
                                                    >
                                                        登录
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
