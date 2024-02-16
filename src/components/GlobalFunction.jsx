import dayjs from 'dayjs';

const formatTime = (parkedTime, currentTime, dayjs) => {
    const elapsedTime = currentTime - parkedTime;
    return dayjs.duration(elapsedTime).format("HH[h] mm[m] ss[s]");
}

const calculateFee = (parkedTime, vehicleSize, leftVehicles) => {
    const parkingDurationMilliseconds = dayjs().diff(parkedTime); // Calculate parked duration in milliseconds
    const hoursPassed = Math.floor(parkingDurationMilliseconds / (1000 * 60 * 60));
    const rateIncrease = hoursPassed >= 3;

    const leftVehicle = leftVehicles?.find(vehicle => vehicle.parkedTime === parkedTime);
    if (leftVehicle) {
        return leftVehicle.fee;
    }

    let totalFee = 0;
    let flatRateFee;

    switch (true) {
        case vehicleSize === 0 && rateIncrease:
            flatRateFee = 20;
            break;
        case vehicleSize === 1 && rateIncrease:
            flatRateFee = 60;
            break;
        case vehicleSize === 2 && rateIncrease:
            flatRateFee = 100;
            break;
        default:
            flatRateFee = 40;
            break;
    }

    const hours24 = Math.floor(parkingDurationMilliseconds / (1000 * 60 * 60));
    if (hours24 > 24) {
        totalFee += 5000;
        const extraHours = hours24 - 24;
        totalFee += extraHours * Math.ceil(flatRateFee / 8);
    } else {
        for (let time = 0; time < parkingDurationMilliseconds; time += 3 * 60 * 60 * 1000) {
            totalFee += flatRateFee;
        }
    }

    return Math.ceil(totalFee);
};

const getSizeLabel = (size) => {
    switch (size) {
        case 0:
            return "Small Parking";
        case 1:
            return "Medium Parking";
        case 2:
            return "Large Parking";
        default:
            return "Unknown";
    }
}

const vehicleSizeSetter = (vehicleSize) => {
    switch (true) {
        case vehicleSize == 0:
            return  "Small Vehicle";
        case vehicleSize == 1:
            return  "Medium Vehicla";
        case vehicleSize == 2 :
            return "Large Vehicle";
        default:
            return "Unkown";

        
    }
}

const duplicateParkingLocator = (parkingSlotInfo, entryPoint, parkingLotName, parkingSize) => {
    const isDuplicate = parkingSlotInfo.some(state => {
        return (
          state.entryPoint === entryPoint &&
          state.parkingLotName === parkingLotName &&
          state.parkingSize === parkingSize
        );
    });


    return isDuplicate;
}

const handleSlotUpdate = (
    parkingLotName, 
    occupiedParkingLots, 
    setParkingAreaLocator, 
    entryPoint
) => {
    const locateVehicleArea = occupiedParkingLots.find(slot =>
        slot.entryPoint === entryPoint &&
        slot.parkingLotName === parkingLotName
    );

    if (locateVehicleArea) {
        const updatedParkingAreaLocator = {
            entryPoint: locateVehicleArea.entryPoint,
            parkingLotName: locateVehicleArea.parkingLotName,
            parkingSize: locateVehicleArea.parkingSize
        };
        console.log(updatedParkingAreaLocator);

        setParkingAreaLocator(updatedParkingAreaLocator);
    }
};

export {
    formatTime,
    calculateFee,
    getSizeLabel,
    handleSlotUpdate,
    duplicateParkingLocator,
    vehicleSizeSetter
}


