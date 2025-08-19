import { ConfigProvider } from "antd";
import { StyleProvider } from "@ant-design/cssinjs";

function AntThemeCustomizationProvider({ children }) {
    return (
        <ConfigProvider
            theme={{
                cssVar: true,
                hashed: false,
                token: {},
                components: {
                    InputNumber: {},
                    Select: {
                        controlHeight: "auto",
                        padding: "8px 16px",
                        optionHeight: "36px",
                        optionFontSize: "14px",
                        optionLineHeight: "20px",
                        optionPadding: "8px 16px",
                    },
                    Table: {
                        rowHoverBg: "rgba(255, 255, 255, .075)",
                        borderColor: "rgba(255, 255, 255, .15)",
                        headerSplitColor: "rgba(255, 255, 255, .15)",
                    },
                },
            }}
        >
            <StyleProvider hashPriority="high">{children}</StyleProvider>
        </ConfigProvider>
    );
}

export default AntThemeCustomizationProvider;
