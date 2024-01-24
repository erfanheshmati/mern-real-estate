import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import SwiperCore from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay } from "swiper/modules"
import "swiper/css/bundle"

import ListingItem from "../components/ListingItem.jsx"


export default function Home() {
  const [offerListings, setOfferListings] = useState([])
  const [saleListings, setSaleListings] = useState([])
  const [rentListings, setRentListings] = useState([])
  SwiperCore.use([Navigation, Autoplay])

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const response = await fetch("/api/listing/get?offer=true&limit=4")
        const data = await response.json()
        setOfferListings(data)
        fetchRentListings()
      } catch (error) {
        console.log(error)
      }
    }
    const fetchRentListings = async () => {
      try {
        const response = await fetch("/api/listing/get?type=rent&limit=4")
        const data = await response.json()
        setRentListings(data)
        fetchSaleListings()
      } catch (error) {
        console.log(error)
      }
    }
    const fetchSaleListings = async () => {
      try {
        const response = await fetch("/api/listing/get?type=sale&limit=4")
        const data = await response.json()
        setSaleListings(data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchOfferListings()
  }, [])


  return (
    <div>

      {/* banner */}
      <div className="flex flex-col gap-6 py-24 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br />place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Erfan Estate is the best place to find your next perfect place to live.
          <br />
          It will help you find your home fast, easy and comfortable.
          <br />
          Our expert support ar ealways available.
        </div>
        <Link to={"/search"} className="text-xs sm:text-sm text-blue-800 font-bold hover:underline">
          Lets get started...
        </Link>
      </div>

      {/* swiper */}
      <Swiper navigation autoplay>
        {offerListings && offerListings.length > 0 && offerListings.map((listing) => (
          <SwiperSlide>
            <div className="h-[500px]" key={listing._id} style={{ background: `url(${listing.imageURLs[0]}) center no-repeat`, backgroundSize: "cover" }}>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* listing results for offer, sale and rent */}
      <div className="max-w-6xl mx-auto flex flex-col gap-10 my-10 p-3">
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">Recent offers</h2>
              <Link to="/search?offer=true" className="text-sm text-blue-800 hover:underline">
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-9">
              {offerListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">Recent places for rent</h2>
              <Link to="/search?type=rent" className="text-sm text-blue-800 hover:underline">
                Show more places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-9">
              {rentListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">Recent places for sale</h2>
              <Link to="/search?type=sale" className="text-sm text-blue-800 hover:underline">
                Show more places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-9">
              {saleListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
