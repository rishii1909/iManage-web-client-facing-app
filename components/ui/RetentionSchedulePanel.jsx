import { Space } from "antd";


const RightAlignedButtonWrapper = ({children}) => {
    return (
        <div style={{display : "flex", justifyContent : "right"}}>
            <Space>
            {children}
            </Space>
        </div>
    )
}

export default RightAlignedButtonWrapper;