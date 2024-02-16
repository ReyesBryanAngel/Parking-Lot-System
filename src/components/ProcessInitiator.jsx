import React, { useEffect, useState } from 'react'
import { Button, Typography, Card } from "@mui/material";
import { duplicateParkingLocator, handleEntryPointSelect } from './GlobalFunction';

const ProcessInitiator = ({
    vehicleSize,
    selectedEntryPoint, 
    sortedParkingSlots, 
    parkVehicle, 
    addEntryPoint, 
    parkingSlotInfo,
    setSelectedEntryPoint,
    staticParkingSlots
}) => {
    const [defaultButtons, setDefaultButtons] = useState(['A', 'B', 'C']);
    

    const handleAddEntryPoint = () => {
        const lastLetter = defaultButtons[defaultButtons.length - 1];
        const nextLetterToAdd =  String.fromCharCode(lastLetter.charCodeAt(0) + 1);
        if (nextLetterToAdd <= 'G') {
            setDefaultButtons([...defaultButtons, nextLetterToAdd]);
        }
    }
    
    return (
       <>
            <div className='flex'>
                <Button disabled={!addEntryPoint} variant='contained' onClick={handleAddEntryPoint}>Add Entry Point</Button>
            </div>
            {vehicleSize !== null && (
                defaultButtons.map((entryPoint, index) => (
                    <Button
                        sx={{ marginX:"20px" }}
                        key={index}
                        variant='contained' 
                        onClick={() => { handleEntryPointSelect(entryPoint, setSelectedEntryPoint, staticParkingSlots); }}
                    >
                        {entryPoint}
                    </Button>
                ))
            )}
            {selectedEntryPoint && (
                <div className='mt-10 text-left space-y-10'>
                    <Typography variant='h6'>Parking Slots near Entry Point {selectedEntryPoint}:</Typography>
                    <ul>
                        {sortedParkingSlots?.map(slot => {
                            return (
                                <li key={slot.id}>
                                    <Typography sx={{ marginLeft: "20px" }}>{slot.name}</Typography>
                                    <div className='m-5 space-x-5 grid grid-cols-3 mt-10'>
                                        {Object.entries(slot.distances).map(([parkingLotName, distanceValue]) => {
                                           
                                            if ((slot.name === "Small Parking" && parkingLotName.startsWith("SP")) ||
                                                (slot.name === "Medium Parking" && parkingLotName.startsWith("MP")) ||
                                                (slot.name === "Large Parking" && parkingLotName.startsWith("LP"))) {
                                                return (
                                                    <Card key={parkingLotName} sx={{  padding:"40px", width:"300px" }}>
                                                        <Button
                                                            disabled={duplicateParkingLocator(parkingSlotInfo, selectedEntryPoint, parkingLotName, slot.parkingSize)}
                                                            variant='contained'
                                                            onClick={() => {
                                                                parkVehicle(slot.id, slot.parkingSize, parkingLotName);
                                                            }}
                                                        >
                                                            {parkingLotName}: {`${distanceValue} distance unit`} <br/>
                                                        </Button>
                                                    </Card>
                                                
                                                );
                                            } else {
                                                return null;
                                            }
                                        })}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
       </>
    )
}

export default ProcessInitiator;