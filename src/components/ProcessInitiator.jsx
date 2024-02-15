import React from 'react'
import { Button, Typography } from "@mui/material";

const ProcessInitiator = ({vehicleSize, handleEntryPointSelect, selectedEntryPoint, sortedParkingSlots, parkVehicle}) => {
    return (
       <>
            {vehicleSize !== null &&(
                    <div className='space-x-5'>
                        <Button variant='contained' onClick={() => { handleEntryPointSelect('A'); } }>A</Button>
                        <Button variant='contained' onClick={() => { handleEntryPointSelect('B'); } }>B</Button>
                        <Button variant='contained' onClick={() => { handleEntryPointSelect('C'); } }>C</Button>
                    </div>
            )}
            {selectedEntryPoint && (
                <div className='mt-10 text-left space-y-5'>
                    <Typography variant='h6'>Parking Slots near Entry Point {selectedEntryPoint}:</Typography>
                    <ul>
                    {sortedParkingSlots?.map(slot => {
                        return (
                            <li key={slot.id}>
                                <Typography sx={{ marginLeft:"20px" }}>{slot.name} (Distance Unit: {slot.distances[selectedEntryPoint]})</Typography>
                                <div className='m-5 space-x-5'>
                                    <Button variant='contained' onClick={() => parkVehicle(slot.id, 0, selectedEntryPoint, true)}>Small Parking</Button>
                                    <Button variant='contained' onClick={() => parkVehicle(slot.id, 1, selectedEntryPoint, true)}>Medium Parking</Button>
                                    <Button variant='contained' onClick={() => parkVehicle(slot.id, 2, selectedEntryPoint, true)}>Large Parking</Button>
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