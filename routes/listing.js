const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");



const validateListing = (req,res,next)=>{
    let{error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else{
        next();
    };
};






//  Index Route
router.get("/",wrapAsync ( async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));



// New Route

router.get("/new",(req,res)=>{
    res.render("listings/new.ejs"); 
 });

// show Route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing= await  Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));


//Create Route

router.post("/",validateListing,wrapAsync (async(req,res)=>{
    //let {title,description,image,price,country,location} =req.params;
    //  let result = listingSchema.validate(req.body);
    // console.log(result);
    //  if(result.error){
    //     throw new ExpressError(400,result.error);
    //  }
const newlisting = new Listing(req.body.listing);
 await  newlisting.save();
 req.flash("success","New Listing Created");
    res.redirect("/listings");
}));


//Edit Route

router.get("/:id/edit",wrapAsync( async(req,res)=>{
    let {id} = req.params;
    const listing= await  Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});

}));

//Update Route

router.put("/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   req.flash("success"," Listing Updated");
res.redirect(`/listings/${id}`);

}));

//Delete Route

router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    //console.log(deletedListing);
    req.flash("success"," Listing Deleted");
    res.redirect("/listings");
}));


//check route
router.get("/check",validateListing, wrapAsync (async (req, res) => {
    try {
        const allListings = await Listing.find();

        // Log only the image URLs
        allListings.forEach((listing, index) => {
            console.log(`Listing ${index + 1} Image URL: `, listing.image);
        });

        // Send the data as a response if needed

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}));




module.exports = router;
