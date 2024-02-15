import React, { useState, useEffect, useCallback } from 'react';
import { Button, Typography } from "@mui/material";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import VehicleSelection from '../components/VehicleSelection';
import parkingSlots from '../static/ParkingSlots';
import ProcessInitiator from '../components/ProcessInitiator';
import { 
    calculateFee, 
    formatTime, 
    getSizeLabel, 
    handleSlotUpdate, 
    updateFilteredParkingSlots 
} from '../components/GlobalFunction';
dayjs.extend(duration);

const ParkingSystem = () => {
    const [selectedEntryPoint, setSelectedEntryPoint] = useState(null);
    const [occupiedParkingLots, setOccupiedParkingLots] = useState([]);
    const [filteredParkingSlots, setFilteredParkingSlots] = useState([]);
    const [sortedParkingSlots, setSortedParkingSlots] = useState([]);
    const [confirmation, setConfirmation] = useState(false);
    const [vehicleSize, setVehicleSize] = useState(null);
    const [leftVehicles, setLeftVehicles] = useState([]);
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [totalCharge, setTotalCharge] = useState(0);
    const [hiddenSlots, setHiddenSlots] = useState({});

    const handleVehicleSizeChange = (event) => {
        setVehicleSize(event.target.value);
    };

    const handleHideSlot = (slotId) => {
        setHiddenSlots(prevState => ({
            ...prevState,
            [slotId]: true
        }));
    };
    
    const parkVehicle = useCallback((slotId, parkingSize, entryPoint, occupied) => {
        const slotIndex = parkingSlots.findIndex(slot => slot.id === slotId);
        if (slotIndex !== -1 && !parkingSlots[slotIndex].vehicle) {
            const updatedParkingSlots = [...parkingSlots];
            const parkedTime = dayjs();
            updatedParkingSlots[slotIndex] = {
                ...updatedParkingSlots[slotIndex],
                entryPoint: entryPoint,
                vehicle: {
                    size: parkingSize,
                    parkedTime: dayjs(),
                },
                fee: calculateFee(parkedTime, parkingSize, leftVehicles),
                occupied: occupied
            };
            switch (true) {
                case vehicleSize == 1 && parkingSize == 0:
                    alert('Medium Vehicles cannot park to small parking slot.');
                    break;
                case vehicleSize == 2 && (parkingSize == 0 || parkingSize == 1):
                    alert('Large Parking cannot park to either small or medium parking slots.');
                    break;
                default:
                    setOccupiedParkingLots(prevOccupiedParkingLots => [...prevOccupiedParkingLots, updatedParkingSlots[slotIndex]]);
                    break;
            }
        }
    }, [leftVehicles, vehicleSize]);
    

      const unparkVehicle = (slotId) => {
        setConfirmation(true);
        occupiedParkingLots.map(slot => {
            if (slot.id === slotId && slot.vehicle && confirmation) {
                const { size, parkedTime } = slot.vehicle;
                const charge = calculateFee(parkedTime, size, leftVehicles);
                setTotalCharge(charge);
                setTimeout(() => {
                    const updatedSlot = {
                        ...slot,
                        vehicle: null,
                        fee: charge,
                        occupied: false
                    };
                    setOccupiedParkingLots(prevState => {
                        return prevState.map(prevSlot => {
                            if (prevSlot.id === slotId) {
                                return updatedSlot;
                            }
                            return prevSlot;
                        });
                    });
                }, 3000);
            }
            return slot;
        });
    };
    
    
    const handleVehicleLeave = (parkedTime) => {
        const elapsedTime = currentTime - parkedTime;
        const convertedTime = dayjs.duration(elapsedTime).format("HH[h] mm[m] ss[s]");
        if (convertedTime) {
            setLeftVehicles(prevLeftVehicles => [...prevLeftVehicles, convertedTime]);
        }
    }; 
    

    useEffect(() => {
        // Function to sort parking slots
        const sortParkingSlots = () => {
            if (filteredParkingSlots.length > 0 && selectedEntryPoint) {
                const sortedSlots = filteredParkingSlots.slice().sort((a, b) => {
                    return a.distances[selectedEntryPoint] - b.distances[selectedEntryPoint];
                });
                setSortedParkingSlots(sortedSlots);
            }
        };

        sortParkingSlots();

        const updateParkingLots = () => {
            setOccupiedParkingLots(prevOccupiedParkingLots => {
                return prevOccupiedParkingLots.map(slot => {
                    if (slot.vehicle) {
                        const { size, parkedTime } = slot.vehicle;
                        const charge = calculateFee(parkedTime, size, leftVehicles);
                        return {
                            ...slot,
                            fee: charge
                        };
                    }
                    return slot;
                });
            });
    
            const now = dayjs();
            const newlyLeftVehicles = leftVehicles.filter(vehicle => {
                const parkedTime = dayjs(vehicle.parkedTime);
                return now.diff(parkedTime, 'hours') >= 1;
            });
            if (newlyLeftVehicles.length > 0) {
                setLeftVehicles(prevLeftVehicles => prevLeftVehicles.filter(vehicle => !newlyLeftVehicles.includes(vehicle)));
            }
        };
    
        const timer = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);
    
        const interval = setInterval(updateParkingLots, 5000);
    
        return () => {
            clearInterval(timer);
            clearInterval(interval);
        };
    }, [leftVehicles, filteredParkingSlots, selectedEntryPoint]);


    const handleEntryPointSelect = (entryPoint) => {
        setSelectedEntryPoint(entryPoint);
        updateFilteredParkingSlots(entryPoint, parkingSlots, setFilteredParkingSlots);  
    };

    return (
        <div className='flex flex-col items-center justify-evenly'>
            <div className='space-y-10'>
                <VehicleSelection
                    vehicleSize={vehicleSize}
                    handleVehicleSizeChange={handleVehicleSizeChange}
                />
                <ProcessInitiator
                    vehicleSize={vehicleSize}
                    handleEntryPointSelect={handleEntryPointSelect}
                    selectedEntryPoint={selectedEntryPoint}
                    sortedParkingSlots={sortedParkingSlots}
                    parkVehicle={parkVehicle}
                />
            </div>
            <div>
                {occupiedParkingLots?.length > 0 && (
                    <div className='grid gap-16 md:grid-cols-3'>
                        {occupiedParkingLots.map((slot) => {
                            return (
                                !hiddenSlots[slot.id] && slot.vehicle && (
                                    <div key={slot.id} className='mt-20'>
                                        <Typography>{slot.name} (Size: {getSizeLabel(slot.vehicle.size)}) <br/></Typography> 
                                        <div className='flex items-center justify-center mt-5 space-x-5 '>
                                            <Button variant='contained' 
                                                onClick={() => { 
                                                    handleSlotUpdate(slot.id, setConfirmation, setOccupiedParkingLots, { confirmation: true })
                                                }}
                                            >
                                                Unpark
                                            </Button>
                                            <Typography>{formatTime(slot.vehicle.parkedTime, currentTime, dayjs)} / &#8369;{slot.fee}</Typography>
                                        </div>
                                        {slot.confirmation && (
                                             <div className='flex gap-5 mt-10'>
                                                <Button variant='contained' 
                                                    onClick={() => { 
                                                        unparkVehicle(slot.id); 
                                                        setConfirmation(false);
                                                        handleSlotUpdate(slot.id, setConfirmation, setOccupiedParkingLots, { charged: true });
                                                    }}>
                                                        Leave
                                                    </Button>
                                                <Button variant='contained' 
                                                    onClick={() => { 
                                                        handleVehicleLeave(slot.vehicle.parkedTime, currentTime);
                                                        setConfirmation(false);
                                                        handleHideSlot(slot.id);
                                                    }}
                                                >
                                                        Will get Back
                                                </Button>
                                            </div>
                                        )}
                                        {slot.charged && (
                                             <div>
                                                <Typography>The total amount of charged is: {totalCharge}</Typography>
                                            </div>
                                        )}
                                    </div>
                                )
                            )   
                        })}
                    </div>
                )}
            </div>
        </div>
    )
};

export default ParkingSystem;
