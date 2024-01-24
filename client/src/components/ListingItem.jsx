import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md"

export default function ListingItem({ listing }) {
    return (
        <div className="bg-white shadow-md hover:shadow-lg transition-all overflow-hidden rounded-lg w-full sm:w-[330px]">
            <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageURLs[0] || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8ZI8-MJ1auAuVH9-dEyFjeaUsW-LyM_ztdg&usqp=CAU"} alt="listing cover" className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-all duration-300" />
                <div className="p-3 flex flex-col gap-2 w-full">
                    <p className="text-lg font-semibold text-slate-700 truncate">{listing.name}</p>
                    <div className="flex items-center gap-1">
                        <MdLocationOn className="h-4 w-4 text-green-700" />
                        <p className="text-sm text-gray-600 truncate">{listing.address}</p>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">{listing.description}</p>
                    <p className="text-slate-700 mt-2 font-semibold">
                        ${listing.offer ? listing.discountPrice.toLocaleString("en-US") : listing.regularPrice.toLocaleString("en-US")}
                        {listing.type === "rent" && " / month"}
                    </p>
                    <p>
                        <div className="text-slate-700 flex gap-3">
                            <div className="font-bold text-xs">
                                {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : `${listing.bedrooms} Bed`}
                            </div>
                            <div className="font-bold text-xs">
                                {listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : `${listing.bathrooms} Bath`}
                            </div>
                        </div>
                    </p>
                </div>
            </Link>
        </div>
    )
}
