
const Listing = require("../model/listing");
const path = require("path");

module.exports.index = async(req,res)=>{

    const AllListings= await Listing.find({});
    console.log(path.join(__dirname, 'views/listings/index.ejs'));
    res.render('listings/index.ejs',{ AllListings });
    
  };

  module.exports.renderNewForm = (req, res) => {

    res.render('listings/new.ejs');
};


module.exports.createListing = (async (req, res) => {
  
   const url= req.file.path;
    const filename = req.file.filename;
   
    if (!req.body.listing) {
        throw new ExpressError("Invalid data: 'listing' field is required.", 400);
    }
    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;
    newListing.image = {url , filename};
   
    await newListing.save();
  console.log(req.body);
    req.flash("success","New Listing is Created!");
    res.redirect("/listings",);
});


module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{
      path:"auther"
    }})
    .populate("owner");
    if(!listing){
        req.flash("error"," listing you requested does not exists!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show", { listing, currtUser: req.user  });
};



module.exports.editListings = async(req,res)=>{
    let {id}  = req.params;
    const listing =  await Listing.findById(id);
    if(!listing){
      req.flash("error"," listing you requested does not exists!");
      res.redirect("/listings");
    }
  let orignalimageurl = listing.image.url;
   orignalimageurl = orignalimageurl.replace("/upload","/upload/h_300,w_250");
    res.render('listings/edit.ejs',{ listing ,orignalimageurl});
};



module.exports.UpdateListing = async (req, res) => {
    const { id } = req.params;

    let listings =await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file != "undefined"){
        const url= req.file.path;
        const filename = req.file.filename;
        listings.image ={url,filename};
        await listings.save();
    }
  
    req.flash("success","Listing Updated Successfully !");
    res.redirect( `/listings/${id}`);
};


module.exports.DeleteListing = async(req,res)=>{
      let {id}  = req.params;
      let deletedListing = await Listing.findByIdAndDelete(id );
       console.log(deletedListing);
       req.flash("success","Listing Deleted !");
       res.redirect("/listings");
  };

  

  module.exports.SearchListing = async (req, res) => {
      const { destination } = req.query;
      console.log('Search term:', destination);
  
      try {
          // Check if the destination exists
          if (!destination || destination.trim() === "") {
              req.flash("error", "Please provide a destination you want to search!");
              return res.redirect("/listings");
          }
  
          // Build the query based on destination input
          const terms = destination.split(',').map(term => term.trim()); // Trim whitespace
          let query = {};
  
          if (terms.length === 2) {
              query = {
                  $and: [
                      { country: { $regex: `^${terms[0]}$`, $options: 'i' } }, // Exact match with regex
                      { location: { $regex: `^${terms[1]}$`, $options: 'i' } }
                  ]
              };
          } else if (terms.length === 1) {
              query = {
                  $or: [
                      { country: { $regex: terms[0], $options: 'i' } },
                      { location: { $regex: terms[0], $options: 'i' } }
                  ]
              };
          }
  
          // Fetch listings based on the query
          const listings = await Listing.find(query);
  
          if (listings.length === 0) {
              req.flash("error", "No listings found for the given destination.");
              return res.redirect("/listings");
          }
  
          // Render search results
          res.render('listings/searchResults', { listings, destination });
  
      } catch (error) {
          console.error('Error fetching listings:', error.message);
          res.status(500).send('An error occurred while searching for listings.');
      }
  };