import { cuisineCategories } from "./cuisineList";
import mockRestaurantData from "./mockRestaurantData.json"

const apiKey = 'AIzaSyA7qFAV9taIxXIbzm2rnrdNOlnFBtHSp-8';

export const fetchCatImages = async () => {
    const url = 'https://api.thecatapi.com/v1/images/search';
    const apiKey = 'live_3Jzqi9DOimDu3DYZUCPXGqxUcHJ4hnIn2Zskm7PnONHJB4wqfqOcH4XNVBxVFjY2'; 

    try {
        const response = await fetch(url, {
            headers: {
                'x-api-key': apiKey
            }
        });

        const data = await response.json()
        if (data && data.length > 0) {
            return data.map(imageData => imageData.url);
        } else {
            throw new Error('No cat images found');
        }
    } catch (error) {
        console.error('Error fetching cat images:', error);
        throw error;
    }
}

export const getLocation = (timeoutDelay) => {
    const geolocationPromise = new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
        } else {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        }
    });

    const defaultCoordPromise = new Promise((resolve) => {
        setTimeout(() => {
            // default coordinate is the coordinate of Singapore
            const defaultCoord = {
                coords: {
                    latitude: 1.352083,
                    longitude: 103.819836
                }
            }
            
            resolve(defaultCoord)
        })
    }, timeoutDelay)

    return Promise.race([geolocationPromise, defaultCoordPromise])
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

const fetchMockRestaurantData = (delay) => {
    return new Promise((resolve) => {
        setTimeout(() => { 
            resolve(mockRestaurantData)
        }, delay)
    })
}

const fetchRestaurantImage = async (imageName) => {
    const photoUrl = `https://places.googleapis.com/v1/${imageName}/media?maxHeightPx=400&key=${apiKey}`;
    const imageFetchRes = await fetch(photoUrl)

    return imageFetchRes.url
}

export const fetchRestaurants = async ({ cuisine, textQuery, locationCoord, pageToken, pageSize = 5, useCatImagesDuringMock = false }) => {
    const bodyData = {
        'textQuery': textQuery ?? "Popular restaurants near me",
        'includedType': (cuisineCategories[cuisine] || "restaurant"),
        'rankPreference': "RELEVANCE",
    }

    if (pageSize !== undefined) {
        bodyData["pageSize"] = pageSize
    }
    if (locationCoord) {
        bodyData["locationBias"] = {
            circle: {
                center: locationCoord,
                radius: 500.0
            }
        }
    }
    if (pageToken) {
        bodyData["pageToken"] = pageToken
    }

    if (process.env.NODE_ENV === "development") {
        const data = await fetchMockRestaurantData(1000)

        if (!useCatImagesDuringMock) {
            return data.places
        }

        const restaurantImagePromise = data?.places?.map(async (place) => {
            const [catImageUrl] = await fetchCatImages()
            return {
                ...place,
                thumbnailUrl: catImageUrl,
            }
        }) ?? []

        const restaurantData = await Promise.all(restaurantImagePromise)
        return restaurantData

    } else {
        const fieldMasksArray = [
            'places.id',
            'places.rating',
            'places.userRatingCount',
            'places.reviews',
            'places.displayName',
            'places.formattedAddress',
            'places.photos',
            'places.priceLevel',
            'places.primaryTypeDisplayName',
            'places.googleMapsUri',
            'nextPageToken'
        ]

        const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': fieldMasksArray.join(',')
            },
            body: JSON.stringify(bodyData)
        });
    
        if (!response.ok) {
            throw new Error('Failed to fetch restaurants');
        }
    
        const data = await response.json();
    
        const restaurantImagePromise = data?.places?.map(async (place) => {
            const firstPhoto = place?.photos?.[0]
            return {
                ...place,
                thumbnailUrl: firstPhoto ? await fetchRestaurantImage(firstPhoto.name) : null
            }
        }) ?? []

        const restaurantData = await Promise.all(restaurantImagePromise)

        return restaurantData
    }
}
