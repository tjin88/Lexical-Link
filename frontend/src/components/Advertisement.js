import React, { useEffect } from 'react';
import './Advertisement.css';

// Using Google AdSense
function Advertisement() {
    useEffect(() => {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
    }, []);

    return (
        <div className="ad">
            <ins className="adsbygoogle"
                 style={{ display: 'block' }}
                 data-ad-client={process.env.REACT_APP_GOOGLE_ADSENSE_PUB_ID}
                 data-ad-slot={process.env.REACT_APP_GOOGLE_ADSENSE_SLOT_ID}
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
            <script
                async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        </div>
    );
}

export default Advertisement;