const adminhelper = require("../helpers/adminhelper")
const userhelper = require("../helpers/userhelper")


const admin = {
    myEmail: "admin@gmail.com",
    myPassword: 1234
}
/* -------------------------------------------------------------------------- */
/*                                   Login                                 */
/* -------------------------------------------------------------------------- */

const getLogin = (req, res) => {

     if(req.session.admin){
        res.redirect('/admindashboard')
 }
     else {
         res.render('admin/adminLogin')
     }

    res.render('admin/adminLogin')
}



const postLogin = (req, res) => {
    const { email, password } = req.body;
    if (email == admin.myEmail && password == admin.myPassword) {

        req.session.admin = true;
        res.redirect('/admindashboard')
    } else {

        req.flash('msg', 'INCORRECT DETAILS');
        res.redirect('/admin-login');
    }
}


/* -------------------------------------------------------------------------- */
/*                                 Get Logout                                 */
/* -------------------------------------------------------------------------- */

const getlogout = (req, res) => {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err)
            res.send('error')
        }
        else {
            res.redirect('/admin-login')
        }
    })
}


const admindashboard = async (req, res) => {
    let data= await adminhelper.doNutchartData()
      let year = await adminhelper.yearlyChart()
      let month = await adminhelper.salesMonthlyGraph()
      let daily = await adminhelper.salesGraph()
          
      let dailysales = await adminhelper.getDailySales()
      let dailyorders = await adminhelper.getDailyOrders()
      let TotalUsers = await adminhelper.getTotalUsers()
      let TotalInactiveUsers = await adminhelper.getTotalInactiveUsers()
      let status = await adminhelper.piechartData()
      let payment = await adminhelper.barchartData()
      let sum=0
      for(var i=0;i<dailysales.length;i++){
      sum=sum+dailysales[i].totalAmount
      }
      let sumFinal= Math.round(sum)
      console.log(sumFinal);
      res.render('admin/Admin-dashboard',{data,year,dailysales,sumFinal,dailyorders,
          TotalUsers,TotalInactiveUsers,status,payment,month,daily})
  
   }   
  
   const adminsalesreport = async (req, res) => {
    let data= await adminhelper.doNutchartData()
      let year = await adminhelper.yearlyChart()
      let month = await adminhelper.salesMonthlyGraph()
      let daily = await adminhelper.salesGraph()
          
      let dailysales = await adminhelper.getDailySales()
      let dailyorders = await adminhelper.getDailyOrders()
      let TotalUsers = await adminhelper.getTotalUsers()
      let TotalInactiveUsers = await adminhelper.getTotalInactiveUsers()
      let status = await adminhelper.piechartData()
      let payment = await adminhelper.barchartData()
      let sum=0
      for(var i=0;i<dailysales.length;i++){
      sum=sum+dailysales[i].totalAmount
      }
      let sumFinal= Math.round(sum)
      console.log(sumFinal);
      res.render('admin/salesreport',{data,year,dailysales,sumFinal,dailyorders,
          TotalUsers,TotalInactiveUsers,status,payment,month,daily})
  
   }   



/* -------------------------------------------------------------------------- */
/*                                  get Users                                 */
/* -------------------------------------------------------------------------- */

const getUsers = async(req, res) => {

   await adminhelper.viewUsers().then((data) => {
        console.log(data)
        res.render('admin/ViewUser', { data })
    })

}

/* -------------------------------------------------------------------------- */
/*                                 block Users                                */
/* -------------------------------------------------------------------------- */

const blockUsers = (req, res) => {
    let Id = req.params.id

    adminhelper.blockUser(Id).then((response) => {
    

        res.json(response)
     
    })
}

/* -------------------------------------------------------------------------- */
/*                                unblock Users                               */
/* -------------------------------------------------------------------------- */

const unblockUsers = (req, res) => {
    let proId = req.params.id
    console.log(proId)
    adminhelper.unblockUser(proId).then((data) => {
        res.redirect('/admin-users')
    })
}

/* -------------------------------------------------------------------------- */
/*                                get Products                                */
/* -------------------------------------------------------------------------- */

const getproducts = async(req, res) => {

   
   let count =  await adminhelper.Procount()

   let pageNum = Math.round(count)/4;

   let p =[];
   for(i=0;i<pageNum;i++){

    p[i]=i+1;

   }

   console.log(p,"jinga");

    await adminhelper.ViewProducts().then((data) => {
        
        res.render('admin/product', { data,p })
    })
}


/* -------------------------------------------------------------------------- */
/*                               get addproduct                               */
/* -------------------------------------------------------------------------- */

const getaddproducts = (req, res) => {

   
    adminhelper.viewCategory().then((category) => {
        res.render('admin/addproduct', { category: category})
    })


}

/* -------------------------------------------------------------------------- */
/*                               post addproduct                              */
/* -------------------------------------------------------------------------- */

const postaddproducts = (req, res) => {
    console.log(req.files);
    const filename = req.files.map(function (file) {
        return file.filename
    })
    req.body.image = filename
    adminhelper.addproduct(req.body).then(() => {
            res.redirect('/admin-products')
    })
}




/* -------------------------------------------------------------------------- */
/*                               delete products                              */
/* -------------------------------------------------------------------------- */

const deleteProducts = (req, res) => {

    let delId = req.params.id
    adminhelper.deleteproduct(delId).then((data) => {
        res.redirect('/admin-products')
    })

}
/* -------------------------------------------------------------------------- */
/*                               update Product                               */
/* -------------------------------------------------------------------------- */

const getupdateproduct = (req, res) => {

    let Id = req.params.id
    adminhelper.ViewUpdateproduct(Id).then((data) => {
        adminhelper.viewCategory().then((category) => {
            console.log(data)
            res.render('admin/updateproduct', { data, category })
        })

    })
}

/* -------------------------------------------------------------------------- */
/*                             Post update Product                            */
/* -------------------------------------------------------------------------- */

const postupdateproduct = (req, res) => {

    const filename = req.files.map(function (file) {
        return file.filename
    })
    req.body.image = filename

    let Id = req.params.id
    console.log(req.body);
    adminhelper.updateProduct(Id, req.body).then((data) => {
        res.redirect('/admin-products')
    })
}



/* -------------------------------------------------------------------------- */
/*                                get Category                                */
/* -------------------------------------------------------------------------- */

const getCategory = (req, res) => {
    adminhelper.viewCategory().then((category) => {
        res.render('admin/category', { category })
    })
}

/* -------------------------------------------------------------------------- */
/*                                post category                               */
/* -------------------------------------------------------------------------- */

const postCategory = (req, res) => {
 
    adminhelper.addcategory(req.body).then((response) => {
        console.log(response)
        if(response.status){
            res.redirect('/admin-category')


        }
        else{

            req.session.catmsg = "Category Already Exist"
            // res.redirect('/admin-category')
            res.send("Category exists.....")
        }
    })


}

/* -------------------------------------------------------------------------- */
/*                                view Category                               */
/* -------------------------------------------------------------------------- */

const viewCategory = (req, res) => {
    res.render('admin/viewCategory')
}

/* -------------------------------------------------------------------------- */
/*                               delete category                              */
/* -------------------------------------------------------------------------- */

const deletecategorys = (req, res) => {
    let catId = req.params.id
    let categoryName=req.body.category
  
    adminhelper.checkProductCategory(catId).then((response)=>{
        if(response.delete){
            adminhelper.deletecategory(catId).then((data) => {
                res.redirect('/admin-category')
            })
        }
            
            else{
   
                res.send("Already products exist in this category!")
            }

    })
}

const getupdatecategorys = (req, res)=>{
    let Id = req.params.id
    adminhelper.ViewUpdatecategorys(Id).then((data) => {
            res.render('admin/updatecategory', { data})
        })
        

    }




const updatecategorys=(req,res)=>{
    let Id = req.params.id 
    console.log(req.body);
    adminhelper.updateCategory(Id, req.body).then((data) => {

        res.redirect('/admin-category')
    })
}
/* -------------------------------------------------------------------------- */
/*                               Display orders                               */
/* -------------------------------------------------------------------------- */

const viewOrders=(req,res)=>{
    adminhelper.viewOrders().then((orders)=>{

        res.render('admin/viewOrders',{orders})

    })

  
}




   
  const orderCanceladmin=(req,res)=>{
    adminhelper.cancelOrder(req.params.id).then((response)=>{

        res.json(response)
    })
}

const orderShipadmin=(req,res)=>{
    adminhelper.shippedOrder(req.params.id).then((response)=>{

        res.json(response)
    })
}

const orderDeliveradmin=(req,res)=>{
    adminhelper.deliveredOrder(req.params.id).then((response)=>{

        res.json(response)
    })
}/*




/* -------------------------------------------------------------------------- */
/*                                 pagiantion                                 */
/* -------------------------------------------------------------------------- */

const getChangePage = async(req,res)=>{

    
   let count =  await adminhelper.Procount()

   let pageNum = Math.round(count)/4;

   let p =[];
   for(i=0;i<pageNum;i++){

    p[i]=i+1;

   }

   console.log(p,"jinga");

   let startIndex = parseInt(req.query.page)

   let limit = parseInt(req.query.lim)


    await adminhelper.getprodlist(startIndex,limit).then((data) => {
        res.render('admin/product', { data,p })
    })


}
const orderCanceladm = async(req, res) => {
    let user = req.session.user

    console.log(req.body,"iooioioio");

    let description = "Order Cancelled"
  
    await userhelper.cancelOrder(req.params.id,user).then(async(response) => {

        console.log(response,"lklklklk");

        let order = {

            orderId : response.order._id,
            amount : response.order.totalAmount
        }
      
        res.send("order cancelled")
        
        
    })
}

const getSalesReport= async(req,res)=>{
    res.render('admin/salesReport')
}


/* -------------------------------------------------------------------------- */
/*                             daily sales report                             */
/* -------------------------------------------------------------------------- */

const dailysales = async(req,res)=>{
    day= req.body.day 
    dayend=req.body.dayend  
   let dailysalePro = await adminhelper.getDailySalespro(day,dayend)    
   
   let sum=0;
   for(var i=0;i<dailysalePro.length;i++){
       sum=sum+dailysalePro[i].quantity
   }
   
   let sum2=0;
   for(var i=0;i<dailysalePro.length;i++){
       sum2=sum2+dailysalePro[i].totalAmount
   }
   
   let dailysale = await adminhelper.getDailySales(day)
   
    res.render('admin/dailySales',{dailysale:true,dailysalePro,sum,sum2,dailysale})
   }
   
   /* -------------------------------------------------------------------------- */
   /*                            monthly sales report                            */
   /* -------------------------------------------------------------------------- */
   
   const monthlysales = async(req,res)=>{
     let day=req.body.year+"-"+req.body.month
     console.log(day);
     let monthly = await adminhelper.getMonthlySalesPro(day)
   
     let sum=0
     for(var i=0;i<monthly.length;i++){
       sum=sum+monthly[i].count
     }
     
     let sum2=0
     for(var i=0;i<monthly.length;i++){
       sum2=sum2+monthly[i].totalAmount
     }
    
     console.log("sjdkkdj");
     console.log(monthly);
   
     res.render('admin/dailySales',{monthlysales:true,sum,sum2,monthly})
   
   }
   
   /* -------------------------------------------------------------------------- */
   /*                             yearly Sales Report                            */
   /* -------------------------------------------------------------------------- */
   
   const yearlysales = async(req,res)=>{
   
       let day=req.body.year
       console.log(day);
       let yearly = await adminhelper.getYearlySalesPro(day)
     
       let sum=0
       for(var i=0;i<yearly.length;i++){
         sum=sum+yearly[i].count
       }
       
       let sum2=0
       for(var i=0;i<yearly.length;i++){
         sum2=sum2+yearly[i].totalAmount
       }
      
       console.log("sjdkkdj");
       console.log(yearly);
     
       res.render('admin/dailySales',{yearlysales:true,sum,sum2,yearly})
     
     }
      
     const getProfile = async (req, res) => {

        let user = req.session.user 
        let wallet = await userhelper.getUserWallet(req.session.user._id)
        console.log(wallet);
        let orders = await userhelper.getUserOrders(req.session.user._id)
        let details = await userhelper.viewAddress(req.session.user._id)
        let Id=req.params.id                                                          
        let coupon = await adminhelper.viewCoupens()
        let disCoup = await userhelper.displayCoupon(req.session.user._id)
    
        let history = await userhelper.disWalletHistory(req.session.user._id)
    
        console.log(details,"90909090");
    
    
        
            res.render('user/userProfile', { orders, user, details , coupon,disCoup,history,wallet})
        }
    
        
       
    
    
    
    
    
    /* -------------------------------------------------------------------------- */
    /*                       View Ordered Products For user                       */
    /* -------------------------------------------------------------------------- */
    
    
    const orderProducts = async (req, res) => {
        let user = req.session.user
        let products = await userhelper.getOrderProduct(req.params.id)
        let orders = await userhelper.getOrderSummary(req.params.id)
    
        console.log(products,"9887878");
    
        console.log(orders,"90909090");
      
        res.render('user/orderProducts', { products, user,orders })
    }
    

/* -------------------------------------------------------------------------- */
/*                                 View Banner                                */
/* -------------------------------------------------------------------------- */

const getBanner = (req, res) => {
    adminhelper.viewBanner().then((banner) => {
        console.log(banner);
        res.render('admin/viewBanner', { banner })
    })
}

/* -------------------------------------------------------------------------- */
/*                                 Add Banner                                 */
/* -------------------------------------------------------------------------- */

const addBanner = (req, res) => {
    res.render('admin/addBanner')


}

/* -------------------------------------------------------------------------- */
/*                               Post AddBanner                               */
/* -------------------------------------------------------------------------- */

const postaddBanner = (req, res) => {
    console.log(req.body)

    const filename = req.files.map(function (file) {
        return file.filename
    })
    req.body.image = filename
    adminhelper.addBanner(req.body).then((response) => {
        if (response.status) {
            res.redirect('/admin-addbanner')
        } else {
            // res.send('product added')
            res.redirect('/admin-banner')


        }

    })

}

/* -------------------------------------------------------------------------- */
/*                                delete Banner                               */
/* -------------------------------------------------------------------------- */

const deleteBanner = (req, res) => {

    let delId = req.params.id
    adminhelper.deleteBanner(delId).then((data) => {
        res.redirect('/admin-banner')
    })

}



/* -------------------------------------------------------------------------- */
/*                                 View Coupon                                */
/* -------------------------------------------------------------------------- */


const getCoupens = (req, res) => {
    adminhelper.viewCoupens().then((coupen) => {
        res.render('admin/ViewCoupons',{coupen})
    })

}


/* -------------------------------------------------------------------------- */
/*                               GET ADD COUPON                               */
/* -------------------------------------------------------------------------- */

const getAddCoupen = (req,res)=>{

    res.render('admin/addCoupens')
}

/* -------------------------------------------------------------------------- */
/*                               POST ADD COUPON                              */
/* -------------------------------------------------------------------------- */

const postAddCoupon = (req,res)=>{

     
    adminhelper.addCoupon(req.body).then((response) => {
        if (response.status) {
            res.redirect('/admin-addcoupen')
        } else {
            // res.send('product added')
            res.redirect('/admin-viewcoupen')


        }

    })

}
module.exports = {
    admindashboard, getproducts, getUsers,
    getLogin, getaddproducts, postLogin, getlogout, getCategory, postCategory,
    blockUsers, unblockUsers, deleteProducts, viewCategory, deletecategorys,
    getupdateproduct, postupdateproduct, postaddproducts,
     viewOrders,orderCanceladmin,
     orderShipadmin,dailysales,
    getChangePage,orderCanceladm,monthlysales,yearlysales, getProfile,orderProducts,orderDeliveradmin,getupdatecategorys,updatecategorys,getSalesReport,getBanner,addBanner,
    postaddBanner,
    deleteBanner,adminsalesreport,getCoupens,getAddCoupen,postAddCoupon,
};