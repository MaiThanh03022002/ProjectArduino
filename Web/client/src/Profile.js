import React from "react";
import Header from "./Header";
import './Profile.css'
import anhpro from "./anhpro.jpg"
export default function Profile(){

    return(
        <div className="root">
            <Header></Header>
            <div className="profile">
                <div className="portrait">
                    <img src={anhpro} alt=""></img>
                </div>
                <div className="infomation">
                
                    <div className="Left-info">
                        <h2>Thông tin</h2>
                        <p>Tên của bạn: Mai văn Thành</p>
                        <p>Mã sinh viên: B20DCCN648</p>
                        <p>Lớp: D20CNPM06-B</p>
                        <p>Email: vanthanh322002@mail.com</p>
                        <p>Điện thoại: 0961017757</p>
                        <p>Địa chỉ: Hà Nội, Việt Nam</p>
                    </div>
                    <div className="Right-info">
                        <h2>Giới thiệu bản thân:</h2>
                        <p>hsisjadfghjdfghjk</p>
                    </div>
                    
                    
                </div>
            </div>
            
        </div>
    );
}