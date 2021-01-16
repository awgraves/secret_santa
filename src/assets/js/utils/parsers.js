/* 
Contains all logic for transforming the raw API response into finalized user data.
*/

function userAddressParser(locObj){
    // extract out just the specific location info we need in a new format
    let LOCALIZATION_HUB = {
        "Austria": (locObj)=>{
            return {
                "line_one": `${locObj.street.name} ${locObj.street.number}`,
                "line_two": `${locObj.postcode} ${locObj.city}`,
            }
        },
        "Brazil": (locObj)=>{
            return {
                "line_one": `${locObj.street.name} ${locObj.street.number}`,
                "line_two": `${locObj.city} - ${locObj.state}`,
                "line_three": `${locObj.postcode}`,
            }
        },
        "Canada": (locObj)=>{
            return {
                "line_one": `${locObj.street.number} ${locObj.street.name}`,
                "line_two": `${locObj.city} ${locObj.state} ${locObj.postcode}`,
            }
        },
        "Denmark": (locObj)=>{
            return {
                "line_one": `${locObj.street.name} ${locObj.street.number}`,
                "line_two": `${locObj.postcode} ${locObj.city}`,
            }
        },
        "Finland": (locObj)=>{
            return {
                "line_one": `${locObj.street.name} ${locObj.street.number}`,
                "line_two": `${locObj.postcode} ${locObj.city}`,
            }
        },
        "France": (locObj)=>{
            return {
                "line_one": `${locObj.street.number} ${locObj.street.name}`,
                "line_two": `${locObj.postcode} ${locObj.city}`,
            }
        },
        "Germany": (locObj)=>{
            return {
                "line_one": `${locObj.street.name} ${locObj.street.number}`,
                "line_two": `${locObj.postcode} ${locObj.city}`,
            }
        },
        "Ireland": (locObj)=>{
            return {
                "line_one": `${locObj.street.number} ${locObj.street.name}`,
                "line_two": `${locObj.city} ${locObj.postcode}`,
            }
        },
        "Netherlands": (locObj)=>{
            return {
                "line_one": `${locObj.street.name} ${locObj.street.number}`,
                "line_two": `${locObj.postcode} ${locObj.state} ${locObj.city}`,
            }
        },
        "New Zealand": (locObj)=>{
            return {
                "line_one": `${locObj.street.number} ${locObj.street.name}`,
                "line_two": `${locObj.city} ${locObj.postcode}`,
            }
        },
        "Norway": (locObj)=>{
            return {
                "line_one": `${locObj.street.name} ${locObj.street.number}`,
                "line_two": `${locObj.postcode} ${locObj.city}`,
            }
        },
        "Spain": (locObj)=>{
            return {
                "line_one": `${locObj.street.name} ${locObj.street.number}`,
                "line_two": `${locObj.postcode} ${locObj.city} (${locObj.state})`,
            }
        },
        "Switzerland": (locObj)=>{
            return {
                "line_one": `${locObj.street.name} ${locObj.street.number}`,
                "line_two": `${locObj.postcode} ${locObj.city}`,
            }
        },
        "Turkey": (locObj)=>{
            return {
                "line_one": `${locObj.street.name} ${locObj.street.number}`,
                "line_two": `${locObj.postcode} ${locObj.city} / ${locObj.state}`,
            }
        },
        "United Kingdom": (locObj)=>{
            return {
                "line_one": `${locObj.street.number} ${locObj.street.name}`,
                "line_two": `${locObj.city}`,
                "line_three": `${locObj.postcode}`,
            }
        },
        "United States": (locObj)=>{
            return {
                "line_one": `${locObj.street.number} ${locObj.street.name}`,
                "line_two": `${locObj.city}, ${locObj.state} ${locObj.postcode}`,
            }
        }
    }
    let trimmed = {
        ...LOCALIZATION_HUB[locObj.country](locObj),
        "country": locObj.country
    };

    return trimmed;
}

function singleUserParser(userObj){
    // parse out all the relevant user info and put in new format
    let result = {
        "name": userObj['name'],
        "gender": userObj['gender'],
        "address": userAddressParser(userObj['location']),
        "picture": userObj.picture,
    }

    return result;
}

export function fullUserListParser(rawUserList){
    // loop through all users and parse each, plus add some new fields of our own
    let finalList = [];

    rawUserList.forEach((rawUser, index) => {
        // parse out what randomuser.me provides
        let cleanUser = singleUserParser(rawUser);
        // assign our own unqiue ID to each
        cleanUser['id'] = index;
        // assign default givingTo field
        cleanUser['givingTo'] = null;
        // finalize the user data to our list
        finalList.push(cleanUser);
    });

    return finalList;
}