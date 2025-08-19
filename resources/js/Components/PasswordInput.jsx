import React, { useState } from "react";

const PasswordInput = ({ data, setData, name = "password" }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = (e) => {
        e.preventDefault();
        setShowPassword((prev) => !prev);
    };

    return (
        <div id="show_hide_password" className="input-group">
            <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder={name == "password" ? "输入密码" : "确认密码"}
                value={data[name]}
                onChange={(e) => setData(name, e.target.value)}
            />
            <button
                className="btn btn-outline-secondary"
                onClick={togglePassword}
                type="button"
                style={{ zIndex: "0" }}
            >
                <i
                    className={`bi ${
                        showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"
                    }`}
                ></i>
            </button>
        </div>
    );
};

export default PasswordInput;
