const { DB } = require("../utils/db_config")
const mysql = require("mysql")

const useGetRow = (tableName, email) => {
    return new Promise((resolved, rejected) => {
        const query = `SELECT * FROM ${tableName} WHERE email= ?`;
        DB.query(query, [email], (err, results) => {
            if (err) {
                rejected({ error: JSON.stringify(err) })
            }
            if (results) {
                resolved({ data: JSON.stringify(results) })
            }
        })
    })
}
const useGetRowById = (tableName, id) => {
    return new Promise((resolved, rejected) => {
        const query = `SELECT * FROM ${tableName} WHERE id= ?`;
        DB.query(query, [id], (err, results) => {
            if (err) {
                rejected({ error: JSON.stringify(err) })
            }
            if (results) {
                resolved({ data: JSON.stringify(results) })
            }
        })
    })
}
const useUpdateRow = (tableName, email, updateValue) => {
    return new Promise((resolved, rejected) => {
        const query = `
            UPDATE ${tableName}
            SET userData = ?
            WHERE email = ?;
        `;
        DB.query(query, [updateValue, email], (err, results) => {
            if (err) {
                rejected({ error: JSON.stringify(err) })
            }
            if (results) {
                resolved({ data: JSON.stringify(results) })
            }
        })
    })
}
const useUpdateRowById = (tableName, id, updateValue) => {
    return new Promise((resolved, rejected) => {
        const query = `
            UPDATE ${tableName}
            SET metaData = ?
            WHERE id = ?;
        `;
        DB.query(query, [updateValue, id], (err, results) => {
            if (err) {
                rejected({ error: JSON.stringify(err) })
            }
            if (results) {
                resolved({ data: JSON.stringify(results) })
            }
        })
    })
}
const useCreateRoom = (data) => {
    return new Promise((resolved, rejected) => {
        const ownerName = data.ownerName
        const email = data.email
        const metaData = data.metaData && JSON.stringify(data.metaData)
        const query = `
                INSERT INTO rooms (ownerName, email, metaData)
                VALUES (?, ?, ?)
            `;
        DB.query(
            query,
            [ownerName, email, metaData],
            (err, result) => {
                if (err) {
                    rejected({
                        message: `Error while post the room!!`,
                        data: JSON.stringify(err)
                    })
                } else {
                    resolved({
                        message: "Room Register successfully!!",
                        resData: JSON.stringify(result)
                    })
                }
            }
        )
    })
}

const useGetAllRooms = () => {
    return new Promise((resolved, rejected) => {
        const query = `SELECT * FROM rooms`;
        DB.query(query, function (err, result) {
            if (err) {
                rejected({
                    message: "Something went wrong while fetch the room list data!!",
                    errData: JSON.stringify(err)
                })
            } else {
                resolved({
                    data: JSON.stringify(result)
                })
            }
        })
    })
}
const useBookingRoom = (data) => {
    return new Promise(async (resolved, rejected) => {
        const {
            ownerEmail,
            customerEmail
        } = data
        await useGetRow("rooms", ownerEmail).then((result) => {

        }).catch((error) => {
            rejected({
                message: "Error while fetching the room list",
                errorData: JSON.stringify(error)
            })
        })
    })
}

const useGetRoomByIds = (roomIds) => {
    return new Promise(async (resolved, rejected) => {
        try {
            const query = 'SELECT * FROM rooms WHERE id IN (?)'
            DB.query(query, [...roomIds], function (err, results) {
                if (err) {
                    rejected({ err })
                } else {
                    resolved({ results })
                }
            })
        } catch (error) {
            rejected({ error })
        }
    })
}


module.exports = {
    useGetRow,
    useUpdateRow,
    useCreateRoom,
    useGetAllRooms,
    useGetRowById,
    useUpdateRowById,
    useGetRoomByIds
}