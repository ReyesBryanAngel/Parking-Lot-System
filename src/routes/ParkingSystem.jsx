import React, { useState, useEffect, useCallback } from 'react';
import { Button, Typography, Card } from "@mui/material";
import dayjs from 'dayjs';
import staticParkingSlots from '../static/staticParkingSlots';
import duration from 'dayjs/plugin/duration';
import VehicleSelection from '../components/VehicleSelection';
import ProcessInitiator from '../components/ProcessInitiator';
import { 
    calculateFee, 
    duplicateParkingLocator, 
    formatTime, 
    handleSlotUpdate,
    handleVehicleLeave,
    vehicleSizeSetter, 
} from '../helper/GlobalFunction';
dayjs.extend(duration);

const ParkingSystem = () => {
    const [selectedEntryPoint, setSelectedEntryPoint] = useState(null);
    const [occupiedParkingLots, setOccupiedParkingLots] = useState([]);
    const [sortedParkingSlots, setSortedParkingSlots] = useState([]);
    const [confirmation, setConfirmation] = useState(false);
    const [vehicleSize, setVehicleSize] = useState(null);
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [addEntryPoint, setAddEntryPoint] = useState(false);
    const [parkingSlots, setParkingSlots] = useState(staticParkingSlots);
    const [parkingSlotInfo, setParkingSlotInfo] = useState([]);
    const [parkingAreaLocator, setParkingAreaLocator] = useState([]);

    const handleVehicleSizeChange = (event) => {
        setVehicleSize(event.target.value);
    };
    
    const parkVehicle = useCallback((slotId, parkingSize, parkingLotName) => {
        const slotIndex = parkingSlots.findIndex(slot => slot?.id === slotId);
        const newState = {
            entryPoint: selectedEntryPoint,
            parkingSize: parkingSize,
            parkingLotName: parkingLotName
        };
        if (duplicateParkingLocator(parkingSlotInfo, newState.entryPoint, parkingLotName, newState.parkingSize)) {
            alert('Parking is currently occupied');
        } else {
            const updatedParkingSlots = [...parkingSlots];
            const parkedTime = dayjs();
            const charge = calculateFee(parkedTime, parkingSize);
            updatedParkingSlots[slotIndex] = {
                ...updatedParkingSlots[slotIndex],
                entryPoint: selectedEntryPoint,
                vehicle: {
                    size: parkingSize,
                    parkedTime: parkedTime,      
                },
                fee: charge,
                parkingLotName: parkingLotName
            };
            switch (true) {
                case vehicleSize === 1 && parkingSize === 0:
                    alert('Medium Vehicles cannot park in small parking slots.');
                    break;
                case vehicleSize === 2 && (parkingSize === 0 || parkingSize === 1):
                    alert('Large Vehicles cannot park in either small or medium parking slots.');
                    break;
                default:
                    setParkingSlotInfo(prevState =>
                        prevState.length === 0 ? [newState] : [...prevState, newState]
                    );
                    setOccupiedParkingLots(prevOccupiedParkingLots => [...prevOccupiedParkingLots, updatedParkingSlots[slotIndex]]);
                    setParkingSlots(updatedParkingSlots);
                    setAddEntryPoint(true);
                    break;
        }
        
        }
    }, [parkingSlots, parkingSlotInfo, setOccupiedParkingLots, setAddEntryPoint, vehicleSize, selectedEntryPoint]);
    

    const unparkVehicle = (parkingLotName, entryPoint, parkingSize) => {
        setConfirmation(true);
    
        setOccupiedParkingLots(prevState => {
            return prevState.map(occupiedSlot => {
                if (occupiedSlot.parkingLotName === parkingLotName && 
                    occupiedSlot.entryPoint === entryPoint && 
                    occupiedSlot.parkingSize === parkingSize
                ) {
                    const { size, parkedTime } = occupiedSlot.vehicle;
                    const charge = calculateFee(parkedTime, size);
                    const updatedSlot = {
                        ...occupiedSlot,
                        fee: charge
                    };
                    setTimeout(() => {
                        setConfirmation(false);
                        setOccupiedParkingLots(prevState => {
                            const updatedOccupied = prevState.filter(prevSlot => 
                                !(prevSlot.parkingLotName === parkingLotName && 
                                prevSlot.entryPoint === entryPoint)
                            );
                            
                            const updatedParkingSlotInfo = updatedOccupied.map(slot => ({
                                entryPoint: slot?.entryPoint,
                                parkingSize: slot?.parkingSize,
                                parkingLotName: slot?.parkingLotName
                            }));
                            
                            setParkingSlotInfo(prevParkingSlotInfo =>
                                prevParkingSlotInfo.filter(si =>
                                    updatedParkingSlotInfo.some(updatedSlot =>
                                        updatedSlot.entryPoint === si.entryPoint &&
                                        updatedSlot.parkingLotName === si.parkingLotName
                                    )
                                )
                            );
                            
                            return updatedOccupied;
                        });
                    }, 2000);
    
                    return updatedSlot;
                }
                return occupiedSlot;
            });
        });
    };

    useEffect(() => {
        const sortParkingSlots = () => {
            if (parkingSlots.length > 0 && selectedEntryPoint) {
                const sortedSlots = parkingSlots.slice().sort((a, b) => {
                    return a.distances[selectedEntryPoint] - b.distances[selectedEntryPoint];
                });
                setSortedParkingSlots(sortedSlots);
            }
        };

        sortParkingSlots();
        const updateParkingLots = () => {
            setOccupiedParkingLots(prevOccupiedParkingLots => {
                return prevOccupiedParkingLots.map(slot => {
                    if (slot?.vehicle) {
                        const { size, parkedTime } = slot.vehicle;
                        const charge = calculateFee(parkedTime, size);
                        return {
                            ...slot,
                            fee: charge
                        };
                    }
                    return slot;
                });
            });
        };
    
        const timer = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);
    
        const interval = setInterval(updateParkingLots, 2000);
    
        return () => {
            clearInterval(timer);
            clearInterval(interval);
        };
    }, [selectedEntryPoint, parkingSlots]);
      
    return (
        <div className='flex flex-col items-center justify-evenly'>
            <div className='space-y-10'>
                <VehicleSelection
                    vehicleSize={vehicleSize}
                    handleVehicleSizeChange={handleVehicleSizeChange}
                />
                <ProcessInitiator
                    vehicleSize={vehicleSize}
                    setSelectedEntryPoint={setSelectedEntryPoint}
                    selectedEntryPoint={selectedEntryPoint}
                    sortedParkingSlots={sortedParkingSlots}
                    parkVehicle={parkVehicle}
                    addEntryPoint={addEntryPoint}
                    parkingSlotInfo={parkingSlotInfo}
                    staticParkingSlots={staticParkingSlots}
                />
            </div>
            <div className='text-left mt-10'>
                {occupiedParkingLots?.length > 0 && (
                <>
                    <Typography variant='h6'>Vehicle Records</Typography><div className='grid gap-16 md:grid-cols-3'>
                    {occupiedParkingLots?.map((slot) => {
                        const isAreaSelected = (
                            parkingAreaLocator.entryPoint === slot?.entryPoint &&
                            parkingAreaLocator.parkingLotName === slot?.parkingLotName &&
                            parkingAreaLocator.parkingSize === slot?.parkingSize
                        );
                        return (
                            slot?.vehicle && (
                                <Card sx={{ padding: "20px", width: "300px", marginTop: "40px" }}>
                                    <div key={slot?.id}>
                                        <Typography>{vehicleSizeSetter(vehicleSize)} (Park Area: {slot?.parkingLotName})</Typography> <br />
                                        <Typography>Entrance Record: {slot?.entryPoint}</Typography>
                                        <div className='flex items-center justify-center mt-5 space-x-5 '>
                                            <Button variant='contained'
                                                onClick={() => {
                                                    handleSlotUpdate(
                                                        slot?.parkingLotName,
                                                        occupiedParkingLots,
                                                        setParkingAreaLocator,
                                                        slot?.entryPoint,
                                                        slot?.parkingSize
                                                    );
                                                } }
                                            >
                                                Unpark
                                            </Button>
                                            <Typography>{formatTime(slot?.vehicle?.parkedTime, currentTime, dayjs)} /&#8369;{slot?.fee}</Typography>
                                        </div>
                                        {isAreaSelected && (
                                                <div className='flex gap-5 mt-10'>
                                                    <Button variant='contained'
                                                        onClick={() => {
                                                            unparkVehicle(slot?.parkingLotName, slot?.entryPoint, slot?.parkingSize);
                                                        } }>
                                                        Pay
                                                    </Button>
                                                    <Button variant='contained'
                                                        onClick={() => {
                                                            handleVehicleLeave(parkingAreaLocator, setOccupiedParkingLots)                      
                                                            setConfirmation(false);
                                                        } }
                                                    >
                                                        {slot?.left === true ? 'Got Back' : 'Will get Back'}
                                                    </Button>
                                                </div>
                                        )}
                                        {isAreaSelected && confirmation && (
                                            <div className='mt-5'>
                                                <Typography>Total amount of charged is: &#8369;{slot?.fee}</Typography>
                                            </div>
                                        )}
                                    </div>
                                </Card>

                            )
                        );
                    })}
                </div>
                </>
                )}
            </div>
        </div>
    )
};

export default ParkingSystem;
