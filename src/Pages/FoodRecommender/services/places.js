export const getLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
        } else {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        }
    });
};

export const getGeocode = async (address) => {
    const apiKey = 'AIzaSyA7qFAV9taIxXIbzm2rnrdNOlnFBtHSp-8';

    const encodedAddress = encodeURIComponent(address)
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.status === 'OK') {
        const location = data.results[0].geometry.location;
        return {
            latitude: location.lat,
            longitude: location.lng,
        };
    } else {
        console.error('Geocoding failed:', data.status);
        return null;
    }
};
