const parkingSlots = [
    { 
        id: 1,
        entryPoint: null,
        name: 'Parking 1', 
        parkingSize: 0, 
        distances: { A: 2, B: 4, C: 6 }, 
        vehicle: null, 
        fee: null,
        occupied: false,
        charged: false
    },
    {   
        id: 2,
        entryPoint: null,
        name: 'Parking 2', 
        parkingSize: 1, 
        distances: { A: 8, B: 10, C: 12 }, 
        vehicle: null, 
        fee: null,
        occupied: false,
        charged: false
    },
    {   
        id: 3,
        entryPoint: null,
        name: 'Parking 3', 
        parkingSize: 2, 
        distances: { A: 11, B: 14, C: 15 },
        vehicle: null, 
        fee: null,
        occupied: false,
        charged: false,
    },        
  ];

  export default parkingSlots;