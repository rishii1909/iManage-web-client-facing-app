import { Space } from "antd";


const RightAlignedButtonWrapper = ({children}) => {
    return (
        <div style={{display : "flex", justifyContent : "right", margin : '0.6em'}}>
            <Space>
            {children}
            </Space>
        </div>
    )
}

export default RightAlignedButtonWrapper;