import React from 'react';
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";

const VehicleSelection = ({vehicleSize, handleVehicleSizeChange }) => {
    return (
        <div>
            <FormControl sx={{ width:"300px" }}>
                <InputLabel id="demo-simple-select-label">Select Vehicle size</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={vehicleSize}
                    label="Vehicle Size"
                    onChange={handleVehicleSizeChange}
                >
                    <MenuItem value={0}>Small Vehicle</MenuItem>
                    <MenuItem value={1}>Medium Vehicle</MenuItem>
                    <MenuItem value={2}>Large Vehicle</MenuItem>
                </Select>
            </FormControl>
        </div>
    )
}

export default VehicleSelection;