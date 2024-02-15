import React from 'react';
import { 
    Button, 
    Typography,
    Dialog,
    DialogContent,
    TextField,
    DialogActions,
    IconButton
} from "@mui/material";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";

const ConfirmationDialog = ({ 
    closeModal, 
    unparkVehicle, 
    slot, 
    setPaidindicator, 
    handleVehicleLeave, 
    occupiedParkingLots, 
    setLeftVehicles 
}) => {
    return (
        <>
            <Dialog
                open={true}
                onClose={closeModal}
            >
                <DialogContent className='w-full md:w-full' sx={{ marginY:"30px" }}>
                    <div className='my-10'>
                        <Typography variant='h6' className=' text-center pb-5'>Please confirm for unparking of the vehicle</Typography>
                        <IconButton
                                aria-label="close"
                                onClick={closeModal}
                                sx={{
                                position: "absolute",
                                right: 6,
                                top: 4,
                                color: (theme) => theme.palette.grey[500],
                                }}
                            >
                                <HighlightOffRoundedIcon />
                        </IconButton>
                    </div>
                    <div className='flex gap-10 items-center justify-center'>
                        <Button variant='contained' onClick={() => { unparkVehicle(slot.id); setPaidindicator(true);}}>Leave</Button>
                        <Button variant='contained' 
                            onClick={() => { unparkVehicle(slot?.id); 
                                handleVehicleLeave(slot.vehicle?.parkedTime, occupiedParkingLots, setLeftVehicles);    
                            }}
                        >
                                Will get Back
                        </Button>
                    </div>
                       
                    </DialogContent>
            </Dialog>
        </>
    )
}

export default ConfirmationDialog;