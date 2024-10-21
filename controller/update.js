const mysql = require('mysql');
const { DB } = require("../utils/db_config");
const {
    useGetRow,
    useUpdateRow
} = require("../hook/index")

const verifyOtp=(email,otp)=>{
    return new Promise(async(resolved,rejected)=> {
        useGetRow("users",email).then((res)=>{
            let rowData = JSON.parse(res.data)[0]
            let userData = JSON.parse(rowData.userData)
            if(userData){
                if(otp == userData.otp){
                    userData.otp = ""
                    userData['verify'] = true
                    useUpdateRow("users",email,JSON.stringify(userData)).then((ans)=> {
                        resolved({data:JSON.stringify(ans)})
                    }).catch((err)=> {
                        rejected({error:JSON.stringify(err)})
                    })
                }else{
                    rejected({message:"Enter OTP number is not same!!!"})
                }
            }else{
                console.log("err1")
                rejected({message:"Something went wrong!!"})
            }
        }).catch((err)=>{
            console.log("err2",err)
            rejected({error:JSON.stringify(err)})
        })
    })
}
const updateUserData = (data, email) => {
    return new Promise((resolve, reject) => {
        const jsonPairs = [];
        for (const key in data) {
            jsonPairs.push(`${key}`, data[key]);
        }
        useGetRow("users",email).then((result)=> {
            let userData = {}
            let userMetaData = JSON.parse(result.data)[0].userData ? {...JSON.parse(JSON.parse(result.data)[0].userData)} : {}
            if(userMetaData){
                userData = userMetaData
            }
            const now = new Date()
            if(userData && userData.otp){
                userData.otp = data.otp
                userData.expireAt = `${now.toLocaleDateString()},${now.toLocaleTimeString()}`
            }else{
                userData["otp"] = data.otp
                userData['expireAt'] = `${now.toLocaleDateString()},${now.toLocaleTimeString()}`
            }
            useUpdateRow("users",email,JSON.stringify(userData)).then((ans)=> {
                resolve({data:JSON.stringify(ans)})
            }).catch((err)=> {
                reject({error:JSON.stringify(err)}) 
            })
        }).catch((err)=>{
            console.log("Error--->",err)
            reject({errData:JSON.stringify(err)})
        })
    });
};
const updateUserProfile=(data,email)=> {
    return new Promise((resolved,rejected)=> {
        useGetRow("users",email).then((result)=>{
            let rowData = JSON.parse(result.data)[0]
            let updateData = {
                ...rowData.userData,
                ...data,
            }
            useUpdateRow("users",email,JSON.stringify(updateData)).then((ans)=> {
                resolved({data:JSON.stringify(ans)})
            }).catch((err)=> {
                rejected({error:JSON.stringify(err)})
            })
        }).catch((err)=> {
            rejected({
                error:JSON.stringify(err)
            })
        })
    })
}

module.exports = {
    updateUserData,
    updateUserProfile,
    verifyOtp
};
