import React from "react";

const LoginIDInput = ({ data, setData }) => {
    return (
        <input
            type="text"
            className="form-control"
            id="login_id"
            placeholder="jhon@example.com"
            value={data.login_id}
            onChange={(e) => setData("login_id", e.target.value)}
            autoComplete={data.login_id}
            autoFocus
        />
    );
};

export default LoginIDInput;
