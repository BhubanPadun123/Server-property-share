const express = require("express");
const { getMarketPriceDetail } = require("../controller/marketPrice.control");
const router = express.Router();

router.get('/update', function (req, res) {
    getMarketPriceDetail().then((result) => {
        res.render('price', {
            isLoggedIn:true,
            international: result.data[0].price,
            local_min:result.data[1].price,
            local_max:result.data[2].price
        });
    }).catch((error) => {
        //need to render te error page
        console.log("Error-->", error)
        res.render('error')
    })
})

module.exports = router;