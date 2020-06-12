export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType = "Photography" | "VideoRecording" | "BlurayPackage" | "TwoDayEvent" | "WeddingSession";

interface AmountItem {
    amount: number;
    year: ServiceYear;
}

const photograhyPriceList: Array<AmountItem> = [{ amount: 1700, year: 2020 }, { amount: 1800, year: 2021 }, { amount: 1900, year: 2022 }]
const videoPriceList: Array<AmountItem> = [{ amount: 1700, year: 2020 }, { amount: 1800, year: 2021 }, { amount: 1900, year: 2022 }]
const packageVideoAndPhotoPriceList: Array<AmountItem> = [{ amount: 2200, year: 2020 }, { amount: 2300, year: 2021 }, { amount: 1900, year: 2022 }]

//This is not prices for package but discount - I calculated it. 
const packageOfPhotographyAndVideoDiscount: Array<AmountItem> = [{ amount: 1200, year: 2020 }, { amount: 1300, year: 2021 }, { amount: 1300, year: 2022 }]
const weddingSessionStandardPrice: number = 600;
const twoDayEventPrice: number = 400;
const blurayPackagePrice: number = 300;

export const updateSelectedServices = (
    previouslySelectedServices: ServiceType[],
    action: { type: "Select" | "Deselect"; service: ServiceType }
) => {

    if (action.type == "Select") {
        if (action.service == "BlurayPackage") {
            if (previouslySelectedServices.indexOf("VideoRecording") == -1) {
                return previouslySelectedServices;
            }
        }

        if (previouslySelectedServices.indexOf(action.service) == -1) {
            previouslySelectedServices.push(action.service);
        }
    }
    if (action.type == "Deselect") {
        let index: number = previouslySelectedServices.indexOf(action.service);
        //VideoRecoding is not selected - check photography
        if (previouslySelectedServices[index] == "VideoRecording") {
            if (previouslySelectedServices.indexOf("Photography") == -1) {
                let index = previouslySelectedServices.indexOf("TwoDayEvent"); // deselect twodayevent
                previouslySelectedServices.splice(index, 1);
            }
        }

        //Photograhy is not selected - check video
        if (previouslySelectedServices[index] == "Photography") {
            if (previouslySelectedServices.indexOf("VideoRecording") == -1) {
                let index = previouslySelectedServices.indexOf("TwoDayEvent");
                previouslySelectedServices.splice(index, 1); // deselect twodayevent
            }
        }
        if (index != -1)
            previouslySelectedServices.splice(index, 1) //deselect
    }
    return previouslySelectedServices;
}

export const calculatePrice = (selectedServices: ServiceType[], selectedYear: ServiceYear) => {
    let basePrice: number = 0;
    let finalPrice: number = 0;
    let isPhoto: boolean = false;
    let isVideo: boolean = false;
    let isWeddingSession = false;

    selectedServices.forEach(function (x) {
        switch (x) {
            case "Photography": {
                basePrice += photograhyPriceList.find(x => x.year == selectedYear).amount;
                isPhoto = true;
                break;
            }
            case "VideoRecording": {
                basePrice += videoPriceList.find(x => x.year == selectedYear).amount;
                isVideo = true;
                break;
            }
            case "BlurayPackage": {
                //video validation is in updateSelectedServices func
                basePrice += blurayPackagePrice;
                break;
            }
            case "TwoDayEvent": {
                //video and photo validation is in updateSelectedServices func
                basePrice += twoDayEventPrice;
                break;
            }
            case "WeddingSession":
                isWeddingSession = true;
                basePrice += weddingSessionStandardPrice;

                break;

        }

        finalPrice = basePrice;

        // -- Wedding Session Discount 

        if (isWeddingSession) {
            if (isPhoto && selectedYear == 2022) { // greater discount wins.
                finalPrice = finalPrice - weddingSessionStandardPrice;
            }
            else {
                if (isPhoto || isVideo) {
                    finalPrice = finalPrice - 300;
                }
            }
        }

        // -- Package price
        if (isPhoto && isVideo) {
            finalPrice -= packageOfPhotographyAndVideoDiscount.find(x => x.year == selectedYear).amount;
        }




    });


    return { basePrice: basePrice, finalPrice: finalPrice };
}