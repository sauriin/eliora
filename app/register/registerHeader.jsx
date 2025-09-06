import HeaderImage from './images/BannerBlue.png';

export default function HeaderSection() {
    return (
        <div className="min-h-screen bg-white font-poppins">
            {/* Hero Banner */}
            <div className="w-full overflow-hidden">
                <div
                    className="hidden md:block w-full"
                    style={{
                        backgroundImage: `url(${HeaderImage.src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        aspectRatio: "1700 / 400",
                    }}
                />
                <div
                    className="block md:hidden w-full"
                    style={{
                        backgroundImage: `url(${HeaderImage.src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        aspectRatio: "1728 / 470",
                    }}
                />
            </div>

            <div className="container max-w-3xl mx-auto px-4 py-8">
                <div className="space-y-8 animate-in fade-in duration-800">
                    {/* Event Information */}
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">ELIORA - God is my light!</h1>
                        <div className="text-gray-600 mt-2 text-base leading-relaxed space-y-2">
                            <p>{'"Your word is a lamp to my feet and light to my path. - Psalm 119:105"'}</p>
                            <p>
                                Eliora 2025 - An Initial Retreat for the Diocese of Vadodara. Return to where you belong, in God's love!
                            </p>
                            <div className="space-y-1">
                                <p><strong>Dates:</strong> 24 - 26 Oct, 2025</p>
                                <p><strong>Venue:</strong> Netrang</p>
                                <p><strong>Language:</strong> English</p>
                                <p><strong>Age group:</strong> 16-30 years</p>
                                <p><strong>Registration Fee:</strong> ₹1000/- (Includes travel to and fro the venue)</p>
                            </div>
                        </div>

                        <div className="mt-4 text-gray-600">
                            <p>For any concern please reach out to us:</p>
                            <ul className="mt-2 space-y-1">
                                <li>Honey Chavda (General Coordinator): <br />+91 63520 55646</li>
                                <li>Francis Tellis (Program Coordinator): <br />+91 99980 71630</li>
                                <li>Sejal Macwan (Mobilization in charge): <br />+91 93134 33681</li>
                            </ul>
                        </div>
                    </div>

                    <hr className="my-12 h-0.5 border-t-0 bg-blue-100" />
                </div>
            </div>
        </div>
    );
}
