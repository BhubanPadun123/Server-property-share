const {DB} = require('../utils/db_config')


const getMarketPrice=()=>{
    return new Promise(function(resolve,reject){
        const query = 'SELECT * FROM current_market_value';
        DB.query(query,(err,result)=>{
            if(err){
                console.log("Error while fetch the data from DB",err)
                reject({
                    message:"Error while fetch the data from DB!!",
                    errorData:err
                })
            }
            if(result){
                resolve({
                    message:"current market data fetch successfully!!",
                    data:result
                })
            }
        })
    })
}

const updateMarketPrice = (international, local_min, local_max) => {
    return new Promise(function (resolve, reject) {
        try {
            const updateQuery = `
                UPDATE current_market_value
                SET
                    price = CASE
                        WHEN name = 'international' THEN ${international}
                        WHEN name = 'local_min' THEN ${local_min}
                        WHEN name = 'local_max' THEN ${local_max}
                    END,
                    modified_on = NOW()
                WHERE name IN ('international', 'local_min', 'local_max')
                `;
            DB.query(
                updateQuery,
                (err, result) => {
                    if (err) {
                        reject({
                            message:"Someting went wrong whhile price update!!",
                            errorData:err
                        })
                    }
                    if(result){
                        resolve({
                            message:"Price update successfully!!",
                            data:result
                        })
                    }
                }
            )
        } catch (error) {
            reject({
                message:"Something went wrong while update market price",
                errorData:error
            })
        }
    })
}

module.exports = {
    getMarketPriceDetail:getMarketPrice,
    updateMarketPrice:updateMarketPrice
}