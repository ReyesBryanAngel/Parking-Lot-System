const staticParkingSlots = [
    { 
        id: 1,
        entryPoint: null,
        name: 'Small Parking', 
        parkingSize: 0, 
        distances: { A: null, B: null, C: null, },
        vehicle: null, 
        fee: null,
        occupied: false,
        charged: false
    },
    {   
        id: 2,     
        entryPoint: null,
        name: 'Medium Parking', 
        parkingSize: 1, 
        distances: { A: null, B: null, C: null },
        vehicle: null, 
        fee: null,
        occupied: false,
        charged: false
    },
    {   
        id: 3,      
        entryPoint: null,
        name: 'Large Parking', 
        parkingSize: 2, 
        distances: { A: null, B: null, C: null },
        vehicle: null, 
        fee: null,
        occupied: false,
        charged: false,
    },        
  ];

  export default staticParkingSlots;