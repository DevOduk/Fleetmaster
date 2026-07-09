import React from 'react'

function DeliveryBanner() {
    return (
        <div className="col-span-full bg-brand-200 dark:bg-brand-500/10 items-center flex gap-3 border dark:border-gray-700 rounded-xl mb-5 p-3">
            <img className="w-50" src={'https://indigocarhire.co.uk/wp-content/uploads/header_22-768x281.png'} alt="" /> <div>
                <h5 className="text-black dark:text-white font-semibold">Delivery & Airport Dropoffs</h5>
                <p className="text-gray-400 text-sm">We offer Affordable delivery services and airport dropoffs</p>
                <p className="text-gray-500 text-xs mt-1">1,000 Ksh Within Nairobi | 1,500 Ksh Airport Dropoffs | 2,000 Ksh Outside Nairobi ({'<'}100km)</p>
            </div>
        </div>
    )
}

export default DeliveryBanner
