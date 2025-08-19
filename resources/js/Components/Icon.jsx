const HomeIcon = () => {
    return (
        <div className="font-20 text-white">
            <i className="lni lni-home"></i>
        </div>
    );
};

const BalanceIcon = () => {
    return (
        <div className="wh-42 d-flex align-items-center justify-content-center rounded-circle bg-warning bg-opacity-10 text-warning">
            <span className="material-icons-outlined fs-5">leaderboard</span>
        </div>
    );
};

const CostIcon = () => {
    return (
        <div className="wh-42 d-flex align-items-center justify-content-center rounded-circle bg-info bg-opacity-10 text-info">
            <span className="material-icons-outlined fs-5">visibility</span>
        </div>
    );
};

const NetIcon = () => {
    return (
        <div className="wh-42 d-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10 text-success">
            <span className="material-icons-outlined fs-5">attach_money</span>
        </div>
    );
};

const SettingIcon = ({ color = "white" }) => {
    return (
        <div className="font-20 setting-icon" style={{ color }}>
            <i className="lni lni-cog"></i>
        </div>
    );
};

const TimeIcon = () => {
    return (
        <div className="font-20 text-white">
            <i className="lni lni-alarm-clock"></i>
        </div>
    );
};

const AccessIcon = () => {
    return (
        <div className="font-20 text-white">
            <i className="lni lni-lock-alt"></i>
        </div>
    );
};

const DisplayIcon = () => {
    return (
        <div className="font-20 text-white">
            <i className="lni lni-display-alt"></i>
        </div>
    );
};

const TeamIcon = () => {
    return (
        <div className="font-20 text-white">
            <i className="lni lni-users"></i>
        </div>
    );
};

const CalendarIcon = () => {
    return (
        <div className="font-20 text-white">
            <i className="lni lni-calendar"></i>
        </div>
    );
};

const CaculatorIcon = () => {
    return (
        <div className="font-20 text-white">
            <i className="lni lni-calculator"></i>
        </div>
    );
};

const ErrorIcon = () => {
    return (
        <div className="text-danger" style={{ fontSize: "70px" }}>
            <i className="fadeIn animated bx bx-error-circle"></i>
        </div>
    );
};

const RemoveIcon = () => {
    return (
        <div className="font-20 text-danger">
            <i className="lni lni-trash"></i>
        </div>
    );
};

const EditIcon = () => {
    return (
        <div className="font-20 text-primary">
            <i className="lni lni-pencil"></i>
        </div>
    );
};

const AlertIcon = () => {
    return (
        <div className="font-22 text-danger">
            <i className="fadeIn animated bx bx-message-error"></i>
        </div>
    );
};

export {
    HomeIcon,
    BalanceIcon,
    CostIcon,
    NetIcon,
    SettingIcon,
    TimeIcon,
    AccessIcon,
    DisplayIcon,
    TeamIcon,
    CalendarIcon,
    CaculatorIcon,
    ErrorIcon,
    RemoveIcon,
    EditIcon,
    AlertIcon,
};
